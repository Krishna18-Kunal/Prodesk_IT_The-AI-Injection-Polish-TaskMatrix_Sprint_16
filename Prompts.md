# TaskMatrix --- Prompt Library

This document contains reusable prompts for planning, developing,
reviewing, and improving TaskMatrix. These are prompt templates for
project work; they should not be interpreted as a record of every prompt
previously used during development.

## 1. Project Context

``` text
I am building TaskMatrix, a full-stack task management application.
The frontend uses React and Vite. The backend uses Node.js and Express.
MongoDB is used for data storage, JWT is used for authentication,
and Google Gemini is integrated to suggest subtasks for a task.
Keep changes consistent with the existing project structure and coding style.
```

## 2. Understand the Existing Code Before Editing

``` text
Review the existing TaskMatrix code before making changes.
Identify the relevant frontend components, backend routes, controllers,
models, middleware, and environment variables.
Explain the current behavior and the files that need to change.
Do not rewrite unrelated files or remove working functionality.
```

## 3. Add or Improve a Feature

``` text
Implement the following feature in TaskMatrix: [DESCRIBE FEATURE].

Requirements:
1. Inspect the existing implementation first.
2. Reuse the current architecture and naming conventions.
3. Validate user input on the backend.
4. Handle loading, success, empty, and error states in the frontend.
5. Keep API calls and secrets on the correct side of the application.
6. Make the UI responsive and consistent with the existing design.
7. List every changed file and provide complete code for each required change.
8. Include commands and steps to test the feature locally.
```

## 4. Optimize Gemini AI Subtask Suggestions

``` text
Review and optimize the Gemini AI subtask suggestion flow in TaskMatrix.

Goals:
- Reduce unnecessary prompt size and response latency.
- Request a small, predictable JSON response.
- Limit the number and length of suggested subtasks.
- Validate and sanitize the model response on the backend.
- Handle malformed responses, timeouts, rate limits, and API errors safely.
- Do not expose the Gemini API key to the browser.
- Return a clear, user-friendly error message without leaking secrets.

Preserve the existing API contract unless a change is necessary.
Explain the changes and provide a practical test procedure.
```

## 5. Improve Frontend UI/UX

``` text
Improve the TaskMatrix interface while preserving its existing functionality.

Focus on:
- Clear visual hierarchy and readable typography.
- Responsive layouts for desktop, tablet, and mobile.
- Accessible labels and keyboard-friendly controls.
- Consistent buttons, forms, cards, spacing, and colors.
- Loading indicators, empty states, validation messages, and error feedback.

Avoid adding unnecessary dependencies. Identify the files to update and provide
complete, compatible code.
```

## 6. Backend Security Review

``` text
Review the TaskMatrix backend for common security and reliability issues.

Check:
- Authentication and authorization on protected routes.
- Password handling and JWT verification.
- Request validation and safe error handling.
- CORS configuration, Helmet, and rate limiting.
- MongoDB query handling and data ownership checks.
- Environment variable usage and secret exposure.

Do not claim the application is secure solely because these checks exist.
Report findings by severity and recommend specific fixes.
```

## 7. Debug an Error

``` text
Help me debug this TaskMatrix issue.

Error or unexpected behavior:
[PASTE ERROR]

Relevant file:
[PASTE FILE PATH AND CODE]

What I expected:
[EXPECTED RESULT]

What happened:
[ACTUAL RESULT]

First identify the likely root cause. Then give me the smallest safe fix,
exact file path, complete replacement code where needed, and Windows CMD
commands to run the project and verify the fix.
Do not guess missing configuration values or ask me to reveal secrets.
```

## 8. Test a Feature

``` text
Create a manual test checklist for this TaskMatrix feature: [FEATURE].

Include:
- Normal successful flow.
- Invalid and missing input.
- Unauthenticated and unauthorized access.
- Empty data and boundary cases.
- API/network failure.
- Responsive UI behavior.

For each test, provide steps and the expected result.
Do not mark a test as passed unless it has actually been run.
```

## 9. Prepare a GitHub Release

``` text
Review TaskMatrix for a GitHub-ready release.

Check:
- README setup instructions match the actual package scripts and folder structure.
- .env files, API keys, database credentials, and other secrets are excluded.
- .env.example files contain placeholders only.
- Installation and run commands are clear.
- Known limitations are documented honestly.
- No unverified deployment URL, test result, or feature claim is added.

Provide a concise list of issues to fix before publishing.
```

## 10. Deployment Planning

``` text
Prepare a deployment plan for TaskMatrix.

The frontend is React/Vite, the backend is Node.js/Express,
and the database is MongoDB. Gemini is used for AI suggestions.

Explain:
- Suitable hosting options for frontend and backend.
- Required production environment variables.
- CORS and API base URL configuration.
- MongoDB network access considerations.
- Build and start commands based on the actual package.json files.
- A post-deployment smoke-test checklist.

Do not invent deployment URLs or claim deployment is complete.
```

## 11. How to Use These Prompts

1.  Choose the prompt that matches the task.
2.  Replace bracketed placeholders with the actual requirement or error.
3.  Share only the relevant code and logs.
4.  Never paste API keys, passwords, JWT secrets, or payment
    credentials.
5.  Ask for a small, testable change rather than changing the whole
    application at once.
6.  Run the suggested tests and report the actual result before moving
    to the next change.
