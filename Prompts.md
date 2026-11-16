# TaskMatrix Sprint 16 — AI Prompts and Development Log

## Project objective
Build a responsive full-stack task management application with secure authentication, task CRUD, and a server-side Gemini AI microfeature that suggests actionable subtasks.

## Prompt 1 — Architecture
"Design a maintainable full-stack task management application using React, Vite, Node.js, Express, MongoDB, Mongoose, and JWT. Keep the frontend and backend separate. Use protected routes and ensure users can only access their own tasks."

## Prompt 2 — Backend validation and errors
"Add Zod validation to every API request body before database operations. Use centralized error middleware, correct HTTP status codes, safe production error messages, Helmet, and rate limits for authentication and AI endpoints."

## Prompt 3 — Gemini AI microfeature
"Create a server-side Gemini endpoint that accepts a task title and optional description and returns a JSON array of concise, practical subtasks. Keep the API key in the backend environment only. Validate the incoming body, sanitize the generated result, limit output count, and handle provider errors safely."

## Prompt 4 — Frontend experience
"Build a responsive task dashboard with mobile navigation, task create/edit/delete, status filters, toast notifications, loading indicators, and a useful empty state. Call the protected backend API rather than accessing MongoDB or Gemini directly."

## Prompt 5 — QA
"Test registration, login, protected routes, task ownership, CRUD, invalid request payloads, malformed MongoDB IDs, AI provider failures, rate limiting, and mobile layouts. Document reproducible steps and expected HTTP status codes."

## Sprint 16 implementation notes
- Track A: responsive layout, mobile menu, toast messages, loading and empty states, AI subtask interaction.
- Track B: Zod validation, centralized errors, Gemini integration, server-side secrets, rate limits, Helmet, and payment signature verification.
- Gemini is optional until `GEMINI_API_KEY` is configured.
- Razorpay is optional until test credentials are configured.

## Manual QA checklist
- [ ] Register with valid details.
- [ ] Duplicate email returns HTTP 409.
- [ ] Invalid registration/login payload returns HTTP 400.
- [ ] Login returns a JWT.
- [ ] Unauthenticated task request returns HTTP 401.
- [ ] A user cannot read or change another user's task.
- [ ] Create, read, update, and delete tasks.
- [ ] Invalid task ID returns HTTP 400.
- [ ] Invalid task body returns HTTP 400 before database update.
- [ ] AI endpoint rejects malformed payloads.
- [ ] AI endpoint returns sanitized subtasks when Gemini is configured.
- [ ] AI provider failure returns a safe error response.
- [ ] Mobile menu opens and closes on small screens.
- [ ] Toasts and loading/empty states are visible.
- [ ] Razorpay payment signature is verified server-side.
