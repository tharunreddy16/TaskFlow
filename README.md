# TaskFlow — Team Task Manager

A full-stack collaborative task management web application built with **React + Vite**, **Node.js/Express**, and **MongoDB Atlas**. Deployed as a single service on **Railway**.

---

## 🔗 Live Demo

> **URL:** `https://<your-service>.up.railway.app` ← replace after deploying

---

## ✅ Features

| Feature | Details |
|---|---|
| **Auth** | JWT signup / login / logout |
| **Projects** | Create, view, delete; Admin/Member roles |
| **Members** | Admin adds/removes members by email |
| **Tasks** | Kanban board (To Do / In Progress / Done) |
| **Task fields** | Title, Description, Priority, Due Date, Assignee |
| **Role-based access** | Admins manage all; Members update only their own tasks |
| **Dashboard** | Total tasks, completion rate, overdue count, per-project progress |
| **Real-time UI** | Instant updates without page refresh |

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js 18, Express 4, express-validator |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Deployment | Railway (monorepo — single service) |

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── middleware/auth.js      # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── dashboard.js
│   ├── server.js               # Express app + serves frontend in production
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axios.js        # Axios instance with JWT interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useToast.js
│   │   ├── components/
│   │   │   ├── Layout.jsx      # Sidebar + nav
│   │   │   └── UI.jsx          # Shared components (Avatar, Badge, Modal…)
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── App.jsx             # Routes
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
├── nixpacks.toml               # Railway build instructions
├── railway.json
├── package.json                # Root scripts
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier is fine)

### 1 — Clone the repo
```bash
git clone https://github.com/<your-username>/taskflow.git
cd taskflow
```

### 2 — Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your MONGO_URI and a random JWT_SECRET
npm run dev           # starts on http://localhost:5000
```

### 3 — Frontend setup (new terminal)
```bash
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```

The Vite dev server proxies all `/api` requests to `localhost:5000` automatically.

---

## 🌍 Environment Variables

### `backend/.env`
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskmanager
JWT_SECRET=a_very_long_random_string_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 🚀 Deployment on Railway (step-by-step)

### Step 1 — Create MongoDB Atlas cluster
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → **Create free cluster**
2. **Database Access** → Create user with password
3. **Network Access** → Add IP `0.0.0.0/0` (allow all)
4. **Connect** → Copy the connection string

### Step 2 — Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/taskflow.git
git push -u origin main
```

### Step 3 — Deploy on Railway
1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**
2. Select your `taskflow` repo
3. Click **Add Variables** and add:

| Key | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | any long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

4. Railway auto-detects `nixpacks.toml` and runs:
   - **Build:** installs frontend, builds React, installs backend
   - **Start:** `cd backend && node server.js` (serves the React build)
5. Click **Generate Domain** → copy the URL

### Step 4 — Verify
- Visit your Railway URL
- Sign up → create a project → add tasks
- Test admin vs member role by adding a second account as a member

---

## 🔐 Role-Based Access

| Action | Admin | Member |
|---|---|---|
| Create project | ✅ | ✅ |
| Add/remove members | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| Assign tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ (assigned only) |
| Edit task details | ✅ | ❌ |
| Delete tasks/project | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Register | No |
| POST | `/api/auth/login` | Login → JWT | No |
| GET | `/api/auth/me` | Current user | Yes |

### Projects
| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/projects` | List my projects | Any |
| POST | `/api/projects` | Create project | Any |
| GET | `/api/projects/:id` | Get details | Member |
| PUT | `/api/projects/:id` | Update | Admin |
| DELETE | `/api/projects/:id` | Delete + tasks | Admin |
| POST | `/api/projects/:id/members` | Add member | Admin |
| DELETE | `/api/projects/:id/members/:uid` | Remove member | Admin |

### Tasks
| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/tasks?projectId=` | List tasks | Member |
| POST | `/api/tasks` | Create task | Admin |
| GET | `/api/tasks/:id` | Get task | Member |
| PUT | `/api/tasks/:id` | Update task | Admin/Assignee |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Overall stats |
| GET | `/api/dashboard/:projectId` | Per-project stats |

---

## 🗄 Data Models

```js
// User
{ name, email, password (bcrypt, 12 rounds), createdAt }

// Project
{ name, description, color, createdBy, members: [{ user, role }], timestamps }

// Task
{ title, description, status, priority, dueDate, project, assignedTo, createdBy, timestamps }
```

---

## 📝 Development Notes

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens expire in **7 days**
- Last admin of a project **cannot be removed**
- Overdue = `dueDate < now && status !== 'done'`
- All inputs validated with **express-validator**
- Global error handler returns `{ message }` format
- Frontend uses **Vite proxy** for dev; in production Express serves the `frontend/dist`

---

## 👤 Author

Built as a full-stack coding assignment demonstrating:
- RESTful API design with Express
- JWT authentication flow
- Role-based access control
- MongoDB schema design with Mongoose
- React 18 + React Router v6
- Vite build toolchain
- Railway monorepo deployment
