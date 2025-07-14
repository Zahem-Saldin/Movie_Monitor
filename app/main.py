from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from prometheus_client import Gauge, Histogram
import asyncio
from contextlib import asynccontextmanager

# MongoDB setup
MONGO_DETAILS = "mongodb+srv://zahem3:20626@cluster0.zkky4km.mongodb.net/"
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.Movies_Db
movies_collection = db.get_collection("movie_data")
bookings_collection = db.get_collection("booking_data")

# Prometheus Custom Metrics
movie_added_gauge = Gauge("movie_added_total", "Total number of movies added")
booking_gauge = Gauge("booking_total", "Total number of successful bookings", ["movie_id"])
booking_failed_gauge = Gauge("booking_failed_total", "Number of failed booking attempts", ["reason"])
booking_cancel_gauge = Gauge("booking_cancel_total", "Number of canceled bookings")
seat_request_histogram = Histogram("booking_seats_requested", "Seats requested per booking", buckets=[1, 2, 3, 4, 5, 10])
seat_utilization_gauge = Gauge("movie_seat_utilization", "Seat utilization ratio", ["movie_id"])
available_seats_gauge = Gauge("available_seats", "Number of available seats per movie", ["movie_id", "title"])

# Background task
async def sync_metrics_with_db():
    while True:
        # Movie count
        movie_count = await movies_collection.count_documents({})
        movie_added_gauge.set(movie_count)

        # Booking stats
        bookings = await bookings_collection.find().to_list(1000)
        booking_counts = {}
        for booking in bookings:
            movie_id = booking["movie_id"]
            booking_counts[movie_id] = booking_counts.get(movie_id, 0) + 1
        for movie_id, count in booking_counts.items():
            booking_gauge.labels(movie_id=movie_id).set(count)

        # Movie availability & utilization
        movies = await movies_collection.find().to_list(1000)
        for movie in movies:
            available = movie["total_seats"] - movie["booked_seats"]
            utilization = movie["booked_seats"] / movie["total_seats"] if movie["total_seats"] > 0 else 0
            available_seats_gauge.labels(movie_id=movie["id"], title=movie["title"]).set(available)
            seat_utilization_gauge.labels(movie_id=movie["id"]).set(utilization)

        await asyncio.sleep(5)

# Lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(sync_metrics_with_db())
    yield
    task.cancel()

# FastAPI app
app = FastAPI(lifespan=lifespan)

# Prometheus Instrumentation
Instrumentator().instrument(app).expose(app)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Movie(BaseModel):
    id: str
    title: str
    total_seats: int

class Booking(BaseModel):
    booking_id: str
    movie_id: str
    seats: int

# Routes
@app.post("/movies", status_code=201)
async def add_movie(movie: Movie):
    if await movies_collection.find_one({"id": movie.id}):
        raise HTTPException(status_code=400, detail="Movie with this ID already exists.")
    movie_data = movie.dict()
    movie_data["booked_seats"] = 0
    await movies_collection.insert_one(movie_data)
    return {"message": "Movie added successfully."}

@app.get("/movies")
async def list_movies():
    movies = await movies_collection.find().to_list(1000)
    return [{**movie, "_id": str(movie["_id"])} for movie in movies]

@app.get("/availability")
async def check_availability(movie_id: Optional[str] = None):
    query = {"id": movie_id} if movie_id else {}
    movies = await movies_collection.find(query).to_list(1000)
    result = []
    for movie in movies:
        available = movie["total_seats"] - movie["booked_seats"]
        result.append({
            "movie_id": movie["id"],
            "title": movie["title"],
            "available_seats": available
        })
        available_seats_gauge.labels(movie_id=movie["id"], title=movie["title"]).set(available)
    return result

@app.post("/bookings", status_code=201)
async def book_tickets(booking: Booking):
    movie = await movies_collection.find_one({"id": booking.movie_id})
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    available = movie["total_seats"] - movie["booked_seats"]
    if booking.seats > available:
        booking_failed_gauge.labels(reason="not_enough_seats").inc()
        raise HTTPException(status_code=400, detail="Not enough seats available")

    await movies_collection.update_one(
        {"id": booking.movie_id},
        {"$inc": {"booked_seats": booking.seats}}
    )
    await bookings_collection.insert_one(booking.dict())
    seat_request_histogram.observe(booking.seats)

    return {"message": "Booking successful"}

@app.get("/bookings")
async def get_all_bookings():
    bookings = await bookings_collection.find().to_list(1000)
    return [{**booking, "_id": str(booking["_id"])} for booking in bookings]

@app.delete("/bookings/{booking_id}", status_code=204)
async def cancel_booking(booking_id: str):
    booking = await bookings_collection.find_one({"booking_id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    await movies_collection.update_one(
        {"id": booking["movie_id"]},
        {"$inc": {"booked_seats": -booking["seats"]}}
    )
    await bookings_collection.delete_one({"booking_id": booking_id})
    booking_cancel_gauge.inc()

    return {"message": "Booking canceled successfully"}
