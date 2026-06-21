# Dev Project Hub

A full-stack web app for developers to track what they are building — from idea to shipped.

## Features

- **Authentication** — sign up and log in with JWT
- **Projects** — create, edit, and delete projects with a title, description, and status
- **Tasks** — add tasks inside each project and check them off as you go
- **Status system** — mark projects as Not Started, In Progress, or Completed
- **Ship it** — one-click button to mark a project as shipped

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |

## Project Structure

```
dev-project-hub/
├── backend/
│   ├── src/
│   │   ├── models/        # User, Project, Task schemas
│   │   ├── routes/        # /auth, /projects, /tasks
│   │   ├── middleware/    # JWT auth guard
│   │   ├── types/         # Express request augmentation
│   │   └── index.ts
│   └── tsconfig.json
└── frontend/
    └── src/
        ├── app/
        │   ├── login/
        │   ├── signup/
        │   ├── dashboard/
        │   └── projects/[id]/
        ├── components/    # Navbar
        └── lib/           # API client, auth context
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally

### Backend

```bash
cd backend
cp .env.example .env      # fill in your values
npm install
npm run dev               # starts on http://localhost:5000
```

`.env` variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dev-project-hub
JWT_SECRET=your_long_random_secret
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev               # starts on http://localhost:3000
```

`.env.local` variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get project + tasks |
| PUT | `/api/projects/:id` | Update project |
| PATCH | `/api/projects/:id/ship` | Ship a project |
| DELETE | `/api/projects/:id` | Delete project + tasks |
| POST | `/api/tasks` | Add a task |
| PATCH | `/api/tasks/:id/toggle` | Toggle task done |
| DELETE | `/api/tasks/:id` | Delete a task |
