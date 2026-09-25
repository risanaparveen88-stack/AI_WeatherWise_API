# AI WeatherWise API

AI WeatherWise API is a RESTful backend application built with **Node.js, Express.js, MongoDB, and Mongoose**. It features secure JWT authentication with password hashing (bcrypt), custom favorite locations tracking, search history management, and Generative AI integrations (**Groq Cloud API**) to deliver intelligent weather summaries and personalized recommendations based on real-time metrics.

## Features
- **User Authentication**: Secure signup, login, and profile lookup endpoints using bcrypt password hashing and JWT token authorization.
- **Favorite Locations Management**: Users can manage their list of favorite locations (add, get, update, and delete locations).
- **Search History Tracking**: Automatically records user weather searches and allows users to retrieve or clear their recent search history.
- **Current Weather Retrieval**: Fetches temperature, humidity, wind speed, and weather condition from OpenWeatherMap.
- **AI Weather Insights**: Leverage the Groq Cloud API (Llama models) to dynamically generate context-aware weather summaries and recommendations (e.g., hydration, clothing, activities).
- **Resilient Fallback Mode**: If you don't have OpenWeatherMap or Groq API keys configured, the application automatically triggers local, deterministic rule-based mock generators so the API remains fully functional and testable out-of-the-box.

---

## Technology Stack
- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database Wrapper**: Mongoose ODM
- **Database**: MongoDB Atlas or Local MongoDB
- **Security**: JWT (jsonwebtoken), bcryptjs
- **AI Integration**: `groq-sdk` (Groq Cloud API)

---

## Project Structure (MVC)

```

ai-weatherwise-api/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── historyController.js
│   │   ├── locationController.js
│   │   └── weatherController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── Location.js
│   │   ├── SearchHistory.js
│   │   ├── User.js
│   │   ├── WeatherCache.js
│   │   └── WeatherSearch.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── historyRoutes.js
│   │   ├── locationRoutes.js
│   │   └── weatherRoutes.js
│   │
│   ├── services/
│   │   ├── cacheService.js
│   │   ├── aiService.js
│   │   ├── openWeatherService.js
│   │   └── recommendationService.js
│   │
│   ├── utils/
│   │   ├── apiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── generateToken.js
│   │   └── sanitize.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── locationValidator.js
│   │   └── weatherValidator.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package-lock.json
└── package.json

```

---

## Quick Start Guide

### 1. Prerequisites
Make sure you have **Node.js (v18+)** and **npm** installed on your system.

### 2. Install Dependencies
Run the following command in the project root:
```bash
npm install

```

### 3. Environment Setup

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weatherwise
JWT_SECRET=your_super_secret_jwt_key_12345!
OPENWEATHER_API_KEY=your_openweathermap_api_key
GROQ_API_KEY=your_groq_api_key

```

> **Note on API Keys**: If you leave the `OPENWEATHER_API_KEY` and `GROQ_API_KEY` with placeholder values, the app will gracefully fall back to returning stable, generated mock response objects so that you can verify and test all endpoints immediately.

### 4. Run the Server

For development mode with hot reloading (built-in file watcher):

```bash
npm run dev

```

For production start:

```bash
npm start

```

The server will start listening on `http://localhost:5000`.

---

## API Documentation

### 1. User Authentication

| Endpoint | Method | Access | Request Body | Description |
| --- | --- | --- | --- | --- |
| `/api/auth/register` | `POST` | Public | `{ "name", "email", "password" }` | Register a new user and get a JWT token. |
| `/api/auth/login` | `POST` | Public | `{ "email", "password" }` | Log in and get a JWT token. |
| `/api/auth/profile` | `GET` | Private (JWT) | *None* | Get logged-in user profile details. |

### 2. Location Management (Private / JWT required)

| Endpoint | Method | Access | Request Body | Description |
| --- | --- | --- | --- | --- |
| `/api/locations` | `POST` | Private | `{ "city", "country" }` | Save a new favorite city. |
| `/api/locations` | `GET` | Private | *None* | Retrieve all saved favorite cities for the user. |
| `/api/locations/:id` | `PUT` | Private | `{ "city", "country" }` | Update a favorite city by ID. |
| `/api/locations/:id` | `DELETE` | Private | *None* | Delete a favorite city by ID. |

### 3. Search History (Private / JWT required)

| Endpoint | Method | Access | Description |
| --- | --- | --- | --- |
| `/api/history` | `GET` | Private | Retrieve all recent weather search history for the logged-in user. |
| `/api/history` | `DELETE` | Private | Clear all weather search history for the user. |
| `/api/history/:id` | `DELETE` | Private | Delete a single search history record by ID. |

### 4. Weather Fetching

| Endpoint | Method | Access | Description |
| --- | --- | --- | --- |
| `/api/weather/:city` | `GET` | Public / Private | Returns current weather metrics for a city and logs the search to history if authenticated. |

### 5. AI Weather Insights (Private / JWT required)

| Endpoint | Method | Access | Request Body | Description |
| --- | --- | --- | --- | --- |
| `/api/ai/weather-summary` | `POST` | Private | `{ "city", "temperature", "humidity", "condition" }` | Generates a natural language weather summary using Groq AI. |
| `/api/ai/weather-recommendation` | `POST` | Private | `{ "temperature", "condition" }` | Generates personalized suggestions (clothing, activities). |

---

## API Testing using Postman

To test all endpoints:

1. Import the `postman_collection.json` file located in the project root into your Postman application.
2. The collection has pre-saved example payloads for registration, login, profile queries, location management, search history, weather search, and AI queries.
3. The registration and login endpoints are set up with test scripts that capture the JWT token and save it to the collection variable `token` automatically. This allows you to call all subsequent private endpoints without manually copying the token.

```
