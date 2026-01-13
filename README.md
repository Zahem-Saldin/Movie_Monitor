# 🎬 Movie Booking System – FastAPI, MongoDB, Prometheus & Grafana

A **Dockerized Movie Booking System** built with **FastAPI**, **MongoDB**, and **React**, featuring **real-time monitoring using Prometheus and Grafana**.

This project demonstrates:
- RESTful API design with FastAPI
- Async MongoDB access using Motor
- Custom Prometheus metrics
- Grafana dashboards for observability
- Full Docker Compose–based setup

---

## 🚀 Features

### Backend (FastAPI)
- Add and list movies
- Book and cancel tickets
- Check seat availability
- Async background task to sync DB data with Prometheus metrics
- CORS-enabled for frontend integration

### Frontend (React)
- Movie listing
- Seat availability display
- Ticket booking UI
- Communicates with backend via REST API

### Observability
- **Prometheus** scrapes API metrics
- **Grafana** visualizes:
  - Total movies added
  - Successful & failed bookings
  - Seat utilization per movie
  - Available seats
  - Booking request distribution

---

## 🏗️ Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Backend     | FastAPI (Python) |
| Database    | MongoDB |
| Frontend    | React |
| Monitoring  | Prometheus |
| Visualization | Grafana |
| Containerization | Docker & Docker Compose |

---


---

## 📊 Prometheus Metrics Exposed

| Metric Name | Type | Description |
|------------|------|-------------|
| `movie_added_total` | Gauge | Total movies in DB |
| `booking_total{movie_id}` | Gauge | Successful bookings per movie |
| `booking_failed_total{reason}` | Counter | Failed booking attempts |
| `booking_cancel_total` | Counter | Canceled bookings |
| `booking_seats_requested` | Histogram | Seats requested per booking |
| `movie_seat_utilization{movie_id}` | Gauge | Seat utilization ratio |
| `available_seats{movie_id,title}` | Gauge | Remaining seats |

Metrics endpoint:

---

## 🔌 API Endpoints

### Movies
- `POST /movies` – Add a movie
- `GET /movies` – List all movies
- `GET /availability` – Check seat availability

### Bookings
- `POST /bookings` – Book tickets
- `GET /bookings` – View all bookings
- `DELETE /bookings/{booking_id}` – Cancel booking

---

## 🐳 Running the Project (Docker)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Zahem-Saldin/Movie_Monitor.git
cd Movie_Monitor

Configure Environment Variables

Create backend/.env:

MONGO_DETAILS=mongodb://mongo:27017

Start All Services
  docker-compose up --build

Service URLs

| Service      | URL                                                      |
| ------------ | -------------------------------------------------------- |
| Frontend     | [http://localhost:3000](http://localhost:3000)           |
| Backend API  | [http://localhost:8000](http://localhost:8000)           |
| FastAPI Docs | [http://localhost:8000/docs](http://localhost:8000/docs) |
| Prometheus   | [http://localhost:9090](http://localhost:9090)           |
| Grafana      | [http://localhost:3001](http://localhost:3001)           |

Grafana default login
Username: admin
Password: admin
