# 🏢 EPWMS — Enterprise Project & Workforce Management System

A full-stack web application for managing employees, projects, tasks, attendance, and analytics within an organisation. Built with **React + Vite** on the frontend and **Node.js + Express** on the backend, with support for both **MongoDB** and a built-in **JSON mock database** (no MongoDB installation required to get started).

---

## ✨ Features

### 🔐 Authentication & Access Control
- JWT-based login and registration
- Role-based access: **Admin**, **Manager**, **Employee**
- Admin approval flow — newly registered users must be approved before accessing dashboards
- **Pending Approval screen** for unapproved users with real-time status refresh
- Admin can **block / unblock** users to revoke or restore access
- Blocked users are rejected at login and on all API calls

### 🛡️ Admin Dashboard
- View and manage all registered users
- Approve or reject new registration requests
- Block / Unblock users with one click
- User directory with role, department, approval & block status
- Overview stats: approved users, pending approvals, total users
- Profile settings (change name, email, designation, password)

### 📊 Manager Dashboard
- **Projects tab** — Create and manage projects, assign employees, track status
- **Workforce tab** — View and manage team members and their task load
- **Tasks tab** — Create tasks, assign to employees, update status (To Do / In Progress / Done)
- **Attendance tab** — View attendance records for the team
- **Analytics tab** — Interactive Recharts dashboards:
  - Project Completion Velocity (Line Chart)
  - Resource & Workload Allocation (Stacked Bar Chart)
  - Company-wide Attendance & Peak Hour Patterns (Area Chart)
  - Task Priority Distribution (Pie Chart)
- **Team Calendar** — Monthly view of tasks and deadlines per employee
- Audit log viewer with pagination

### 👷 Employee Dashboard
- View assigned tasks with priority and status
- Mark tasks as In Progress or Done
- Submit daily attendance check-in / check-out
- View personal profile and update credentials

### 🔔 Notifications
- Real-time notification bell in the header
- Notifications for task assignments, project updates, and alerts
- Mark as read

### 🎨 Theme Support
- Full **Dark / Light mode** toggle (persisted in localStorage)
- Premium dark slate theme with violet/blue accent colours
- Clean, high-contrast light theme across all dashboards
- Smooth colour transitions with CSS animations

---

## 🗂️ Project Structure

```
surya prj/
├── package.json                  # Root – runs both servers concurrently
│
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── .env                      # Environment variables
│   ├── config/
│   │   ├── db.js                 # MongoDB connection (falls back to mock DB)
│   │   └── mockDb.js             # JSON-file based mock database
│   ├── models/
│   │   ├── User.js               # User schema (roles, approval, block flags)
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Attendance.js
│   │   └── Notification.js
│   ├── controllers/
│   │   ├── authController.js     # Login, register, profile, password
│   │   ├── adminController.js    # Approve, reject, block, unblock users
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── attendanceController.js
│   │   ├── analyticsController.js
│   │   ├── notificationController.js
│   │   └── reportController.js
│   ├── routes/                   # Express routers for each resource
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification + approval/block checks
│   ├── utils/                    # Helper utilities
│   ├── data/                     # Mock JSON database files
│   │   ├── users.json
│   │   ├── projects.json
│   │   ├── tasks.json
│   │   ├── attendances.json
│   │   ├── notifications.json
│   │   └── auditlogs.json
│   ├── uploads/                  # File upload storage
│   └── tests/
│       └── auth.test.js          # Jest integration tests
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx              # React app entry
        ├── App.jsx               # Routing & auth guards
        ├── index.css             # Global styles, custom Tailwind variants
        ├── api/
        │   └── axiosInstance.js  # Axios with JWT interceptor
        ├── context/
        │   ├── AuthContext.jsx   # Auth state, login, logout, refresh
        │   ├── ThemeContext.jsx  # Dark/light theme toggle
        │   └── ToastContext.jsx  # Toast notification system
        └── components/
            ├── LandingPage.jsx
            ├── Login.jsx
            ├── PendingApproval.jsx
            ├── AdminDashboard.jsx
            ├── ManagerDashboard.jsx
            ├── ManagerAnalytics.jsx
            ├── EmployeeDashboard.jsx
            ├── TaskBoard.jsx
            ├── TeamCalendar.jsx
            ├── UserProfile.jsx
            ├── NotificationBell.jsx
            ├── SkeletonLoader.jsx
            ├── ErrorBoundary.jsx
            └── layout/
                └── DashboardLayout.jsx
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | https://nodejs.org |
| **npm** | v9 or higher | Comes with Node.js |
| **Git** | Any recent version | https://git-scm.com |
| **MongoDB** | Optional (mock DB included) | https://www.mongodb.com |

> **💡 Note:** MongoDB is **optional**. The app includes a built-in JSON mock database. If MongoDB is not available or the connection fails, it automatically falls back to the mock database.

---

### 📥 Clone the Repository

```bash
git clone https://github.com/rakshitha-14/skyforce.git
cd skyforce
```

---

### ⚙️ Environment Setup

The backend needs an `.env` file. Create one at `backend/.env`:

```bash
# backend/.env

PORT=5000
MONGO_URI=mongodb://localhost:27017/enterprise_management
JWT_SECRET=super_secret_jwt_token_key_12345

# Optional: override the default admin credentials
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=Admin@123
```

> **💡 Tip:** If you don't have MongoDB, just leave `MONGO_URI` as-is — the app will fall back to the built-in mock database automatically. No extra setup needed.

---

### 📦 Install Dependencies

**Option A — Install everything at once from the root:**

```bash
npm run install-all
```

**Option B — Install manually:**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### ▶️ Run the Application

**From the project root (runs both servers concurrently):**

```bash
npm run dev
```

This starts:
- **Backend** API server at `http://localhost:5000`
- **Frontend** Vite dev server at `http://localhost:5173`

**Or run them separately:**

```bash
# Terminal 1 — Backend
npm run dev-backend

# Terminal 2 — Frontend
npm run dev-frontend
```

Then open your browser and go to: **http://localhost:5173**

---

## 🔑 Default Credentials

When the server starts for the first time, a default Admin account is automatically created:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `Admin@123` |

> **Managers and Employees** must register via the Sign Up form and wait for Admin approval before they can log in to their dashboards.

---

## 🔄 How It Works

```
User visits http://localhost:5173
        │
        ▼
  Landing Page (Dark/Light theme toggle available)
        │
        ├── Sign In ──► JWT issued ──► Role check
        │                               │
        │                       ┌───────┴────────┐
        │                       ▼                ▼
        │                 isApproved?         isBlocked?
        │                    │                   │
        │                 Yes/No              Blocked
        │                   │              Login rejected
        │           ┌────────┴────────┐
        │           ▼                 ▼
        │     Not Approved       Approved
        │    Pending Screen     Role Dashboard
        │
        └── Register ──► Account created (pending)
                              │
                    Admin approves via
                    "Pending Approval" tab
                              │
                    User can now log in
```

### API Routes Overview

| Prefix | Description |
|--------|-------------|
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Login and get JWT token |
| `GET /api/auth/profile` | Get current user profile |
| `PUT /api/auth/profile` | Update profile (name, email, designation) |
| `PUT /api/auth/password` | Change password |
| `GET /api/admin/users` | Admin: list all users |
| `PUT /api/admin/users/:id/approve` | Admin: approve a user |
| `PUT /api/admin/users/:id/reject` | Admin: reject a user |
| `PUT /api/admin/users/:id/block` | Admin: block a user |
| `PUT /api/admin/users/:id/unblock` | Admin: unblock a user |
| `GET /api/projects` | List projects |
| `POST /api/projects` | Create a project |
| `GET /api/tasks` | List tasks |
| `POST /api/tasks` | Create a task |
| `GET /api/attendance` | Attendance records |
| `POST /api/attendance/checkin` | Check in |
| `POST /api/attendance/checkout` | Check out |
| `GET /api/analytics/...` | Analytics data |
| `GET /api/notifications` | User notifications |
| `GET /api/reports/...` | Generate PDF reports |

---

## 🗄️ Database Modes

### Mode 1: MongoDB (Recommended for production)
Set `MONGO_URI` in `backend/.env` to your MongoDB connection string. Supports Atlas cloud or a local instance.

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/enterprise_management
```

### Mode 2: Mock JSON Database (Default / No setup needed)
If MongoDB is not available, the app automatically uses JSON files stored in `backend/data/`. All data is read and written to these files. This is great for local development and demos without any database setup.

---

## 🧪 Running Tests

```bash
# Backend integration tests (Jest + Supertest)
cd backend
npm test

# Frontend component tests (Vitest)
cd frontend
npm test
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS v4** | Styling with dark/light mode support |
| **Recharts** | Interactive data visualisation |
| **Axios** | HTTP client with JWT interceptor |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Primary database (optional) |
| **JSON Mock DB** | Built-in fallback database |
| **bcryptjs** | Password hashing |
| **jsonwebtoken** | JWT authentication |
| **Multer** | File uploads |
| **PDFKit** | PDF report generation |
| **Jest + Supertest** | Backend testing |

---

## 📸 Dashboards at a Glance

- **Landing Page** — Premium hero section with animated gradients and theme toggle
- **Admin Dashboard** — User management with approve/reject/block actions
- **Manager Dashboard** — Projects, tasks, workforce, calendar, analytics, and audit logs
- **Employee Dashboard** — Assigned tasks, attendance, and profile settings
- **Pending Approval Screen** — Animated status screen for unapproved accounts
- **All dashboards** — Support full dark ↔ light theme switching with smooth transitions

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👩‍💻 Author.

**Rakshitha** — [GitHub @rakshitha-14](https://github.com/rakshitha-14)
