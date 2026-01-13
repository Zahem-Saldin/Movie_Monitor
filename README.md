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

## 📂 Project Structure

