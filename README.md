# 📊 Website Analytics API

A lightweight and fast event analytics API built with **Node.js**, **Express**, and **Redis**, designed to track user events for websites and applications. Ideal for developers who need a minimal self-hosted analytics backend with API key management, rate limiting, and caching.

---

## ✨ Features

- ✅ Register apps and issue API keys
- ✅ Collect and store analytics events
- ✅ Query event summaries by date range
- ✅ API key authentication middleware
- ✅ Redis-based rate limiting and caching
- ✅ Swagger documentation for all endpoints
- ✅ Dockerized and ready for deployment
- ✅ Unit tests with Jest + Supertest

---

## 📦 Tech Stack

- **Backend**: Node.js + Express
- **Caching/Rate Limiting**: Redis
- **Docs**: Swagger (OpenAPI)
- **Testing**: Jest, Supertest
- **Containerization**: Docker

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/penandcode/analytics-api
 cd analytics-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment
Create a .env file by taking an inspiration from .env.local

### 4. Start the Server
```bash
npm start
```
Server will run at: http://localhost:3000

### 5. Running Tests
```bash
npm test
```

## Docker Support
Build and run the app with Docker:

```bash
docker build -t analytics-api .
 docker run -p 3000:3000 analytics-api
```


## API Documentation
Swagger docs available at:

http://localhost:3000/api-docs

## 📂 Project Structure

```
├── src
│   ├── config/        # Redis and other configs
│   ├── controllers/   # Request handlers
│   ├── middlewares/   # Auth, rate limiter, caching
│   ├── routes/        # Express routes
│   ├── utils/         # Helpers, storage, hashing
│   ├── index.js       # App entrypoint
├── tests/             # Jest test suites
├── Dockerfile
├── docker-compose.yml
├── swagger.yaml
└── README.md
```

---

