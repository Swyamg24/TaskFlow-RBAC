# 🚀 Intern Project — FastAPI + PostgreSQL + React

## Tech Stack
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, PostgreSQL
- **Auth**: JWT (python-jose) + bcrypt (passlib)
- **Frontend**: React.js, axios, React Router
- **Docs**: Swagger UI (auto at `/docs`)

## Setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Create .env from .env.example
# Start PostgreSQL and create database:
psql -U postgres -c "CREATE DATABASE internproject;"

uvicorn app.main:app --reload --port 8000
```
### TaskFlow RBAC API

*** Live API ***: https://taskflow-rbac.onrender.com/
*** Swagger Docs ***: https://taskflow-rbac.onrender.com/docs

### Frontend
```bash
cd frontend && npm install && npm start
```

## API Endpoints

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | /api/v1/auth/register | No | Any |
| POST | /api/v1/auth/login | No | Any |
| GET | /api/v1/auth/me | JWT | Any |
| GET | /api/v1/auth/users | JWT | Admin |
| GET | /api/v1/tasks/ | JWT | Any |
| POST | /api/v1/tasks/ | JWT | Any |
| GET | /api/v1/tasks/{id} | JWT | Owner/Admin |
| PUT | /api/v1/tasks/{id} | JWT | Owner/Admin |
| DELETE | /api/v1/tasks/{id} | JWT | Owner/Admin |

## Scalability Note
- **Stateless JWT** → any server instance can verify any token; easy horizontal scaling
- **SQLAlchemy connection pool** → handles concurrent DB access efficiently
- **Pydantic validation** → rejects bad data before it hits business logic or DB
- **Modular routers** → add new features (products, notes) without touching existing code
- **Next steps**: Alembic for DB migrations, Docker + docker-compose, Redis caching, Nginx load balancer

## 📬 API Testing (Postman Collection)

You can test all API endpoints using the Postman collection:

👉 [Download Postman Collection](./docs/TaskFlow API Collection.postman_collection.json)