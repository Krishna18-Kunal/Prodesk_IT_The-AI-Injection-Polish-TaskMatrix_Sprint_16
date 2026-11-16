# TaskMatrix --- AI-Powered Task Management System

TaskMatrix is a full-stack task management application that helps users
organize work, track progress, and break larger tasks into smaller
actionable steps with Gemini AI.

## Features

-   **User authentication** --- register and log in using JWT-based
    authentication.
-   **Task management** --- create, view, update, and delete tasks.
-   **Task organization** --- manage task priority and status.
-   **AI subtask suggestions** --- generate practical subtasks for a
    task using Google Gemini.
-   **Input validation** --- validate incoming data with Zod schemas.
-   **API security** --- Helmet security headers and rate limiting.
-   **Responsive interface** --- React-based dashboard designed for
    desktop and smaller screens.
-   **Payment API scaffolding** --- backend Razorpay order/payment
    verification endpoints are included; configure and test them with
    Razorpay credentials before treating checkout as production-ready.

## Tech Stack

  Layer            Technology
  ---------------- ------------------------------
  Frontend         React, Vite, JavaScript, CSS
  Backend          Node.js, Express.js
  Database         MongoDB Atlas, Mongoose
  Authentication   JSON Web Token (JWT)
  AI integration   Google Gemini API
  Validation       Zod
  Security         Helmet, express-rate-limit
  Payments         Razorpay API scaffolding

## Project Structure

``` text
TaskMatrix-Sprint16/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── Prompts.md
└── README.md
```

## Requirements

Install the following before running the project:

-   Node.js (LTS recommended)
-   npm
-   A MongoDB database (for example, MongoDB Atlas)
-   A Google AI Studio API key for Gemini-powered suggestions

## Environment Variables

  -----------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- -----------------------------------
  `PORT`                              Backend server port

  `NODE_ENV`                          Runtime environment

  `MONGODB_URI`                       MongoDB connection string

  `JWT_SECRET`                        Secret used to sign JWTs

  `JWT_EXPIRES_IN`                    JWT expiry duration

  `CLIENT_URL`                        Frontend origin allowed by the
                                      backend

  `GEMINI_API_KEY`                    Google Gemini API key

  `GEMINI_MODEL`                      Gemini model identifier supported
                                      by your API key/project

  `RAZORPAY_KEY_ID`                   Razorpay key ID, if using payment
                                      endpoints

  `RAZORPAY_KEY_SECRET`               Razorpay secret, if using payment
                                      endpoints

  `VITE_API_URL`                      Frontend API base URL
  -----------------------------------------------------------------------

## API Overview

The backend is organized into route groups for:

-   Authentication (`authRoutes`)
-   Tasks (`taskRoutes`)
-   AI subtask suggestions (`aiRoutes`)
-   Payments (`paymentRoutes`)

For exact endpoint paths, request bodies, and response formats, refer to
the route and controller files in `backend/src/`.

## Security Notes

-   Keep real environment files out of Git.
-   Use strong, unique secrets outside local development.
-   Restrict MongoDB network access to trusted IPs.
-   Configure production CORS origins and rate limits for your
    deployment.
-   Verify payment flows in Razorpay test mode before enabling live
    payments.
-   Never put server-side API keys in frontend code.

## Current Scope and Limitations

This repository contains the application source and local development
configuration examples. Deployment, production monitoring, full
end-to-end payment checkout, and production security review should be
completed and tested separately before public production use.

## Future Improvements

-   Deploy the frontend and backend.
-   Add automated unit and integration tests.
-   Add task search, filtering, and sorting.
-   Add reminders, due dates, and notifications.
-   Add team workspaces and task collaboration.
-   Complete and thoroughly test the payment checkout and subscription
    experience.
-   Add analytics and activity history.

## Author

**Krishna Kunal**
