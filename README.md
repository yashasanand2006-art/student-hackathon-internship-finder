# ⚡ DevNexus - Student Hackathon & Internship Finder Platform

> A production-style, high-performance full-stack web platform connecting student engineers to verified collegiate hackathons, high-compensation software internships, and career-accelerating developer opportunities.

![DevNexus Platform](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🎓 Student Experience
- **Luminous Modern Dark UI**: Tailored for developers with obsidian-slate palettes, electric purple & cyan accents, glassmorphic cards, and smooth micro-interactions.
- **Dynamic Exploration & Multi-Filter Search**: Search by title, host, or keyword. Filter hackathons by format (Online, In-Person, Hybrid) or status (Open, Upcoming, Closed), and sort by prize pool or deadline.
- **Internship Portal**: Filter software internships by arrangement (Remote, Onsite, Hybrid), skill requirements (React, TypeScript, PyTorch, Go, Rust), and track compensation.
- **Real-Time Bookmark Radar**: 1-click optimistic bookmark saving with automatic synchronization across the backend database.
- **Deadline Countdown Alerts**: Automated student dashboard calculating days remaining until registration or application deadlines.
- **Developer Profile Management**: Academic credentials, graduation year, biography, tag-based skills manager, and portfolio/social links (GitHub, LinkedIn).

### 🛡️ Admin & Recruiter Console
- **Role-Based Authorization (RBAC)**: Secure routes restricted to admin credentials.
- **Full CRUD for Hackathons**: Create, view, edit, and delete collegiate hackathons with custom prize pools, tags, and dates.
- **Full CRUD for Internships**: Create, view, edit, and delete tech internship postings with compensation, duration, and requirements.
- **Live System KPI Metrics**: Overview of total students, active hackathons, open internships, cumulative prize pool ($), and recent user signups.
- **1-Click Platform Data Seeder**: Fast replenishing of curated collegiate hackathons and internships.

---

## 🏗️ Architecture & Tech Stack

```
opportunity-nexus/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & resilient in-memory fallback
│   ├── controllers/
│   │   ├── adminController.js    # Platform analytics & database seeding
│   │   ├── authController.js     # User registration, login, profile management
│   │   ├── bookmarkController.js # Bookmark CRUD & fast ID synchronization
│   │   ├── hackathonController.js# Hackathon CRUD, filtering, pagination
│   │   └── internshipController.js# Internship CRUD, skills matching
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization (RBAC)
│   │   └── errorHandler.js       # Centralized error handling & validation
│   ├── models/
│   │   ├── Bookmark.js           # Mongoose Bookmark model with compound index
│   │   ├── Hackathon.js          # Mongoose Hackathon model with text indices
│   │   ├── Internship.js         # Mongoose Internship model with text indices
│   │   └── User.js               # Mongoose User model with bcrypt password hashing
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   ├── hackathonRoutes.js
│   │   └── internshipRoutes.js
│   ├── utils/
│   │   ├── initialData.js        # Curated mock hackathons and internships
│   │   ├── seedData.js           # Command line seeder script
│   │   └── store.js              # Dual-mode data repository (Mongo & In-Memory)
│   ├── .env                      # Environment configurations
│   ├── package.json
│   ├── server.js                 # Express server entry point
│   └── test-api.js               # Automated 15-point backend integration test suite
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminHackathonModal.jsx   # Create/Edit Hackathon form
    │   │   ├── AdminInternshipModal.jsx  # Create/Edit Internship form
    │   │   ├── Footer.jsx                # System health indicator & links
    │   │   ├── Navbar.jsx                # Responsive navigation & drawer
    │   │   ├── OpportunityModal.jsx      # Detail view with external links & share
    │   │   └── SearchFilterBar.jsx       # Multi-factor search & filter controls
    │   ├── context/
    │   │   ├── AuthContext.jsx           # JWT session state & 1-click demo login
    │   │   └── BookmarkContext.jsx       # Optimistic bookmarking & real-time sync
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx        # Admin analytics & CRUD data tables
    │   │   ├── BookmarksPage.jsx         # Tabbed saved opportunities manager
    │   │   ├── HackathonsPage.jsx        # Hackathon exploration grid
    │   │   ├── InternshipsPage.jsx       # Internship exploration grid
    │   │   ├── LandingPage.jsx           # Hero, stats, featured grids, CTA
    │   │   ├── LoginPage.jsx             # Auth form + 1-click Demo buttons
    │   │   ├── NotFoundPage.jsx          # 404 page
    │   │   ├── ProfilePage.jsx           # Academic details & skills tag manager
    │   │   ├── RegisterPage.jsx          # Student & Recruiter registration
    │   │   └── StudentDashboard.jsx      # Deadline countdowns & profile radar
    │   ├── services/
    │   │   └── api.js                    # Axios client with JWT interceptors
    │   ├── App.jsx                       # React Router & protected routes
    │   ├── index.css                     # Tailwind base & glassmorphism utilities
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or newer recommended, tested on v24)
- **npm** (v9 or newer)
- **MongoDB** (Optional: local service or MongoDB Atlas; an automatic zero-config In-Memory document store is pre-integrated for immediate instant testing).

---

### Step 1: Start the Backend Server

```bash
cd backend
npm install
node server.js
```

*The Express API will launch on `http://localhost:5000`.*
- Health check: `http://localhost:5000/api/health`

#### Run the 15-Point Automated Backend Test Suite:
```bash
cd backend
node test-api.js
```
*(Runs comprehensive tests for auth, registration, role security, CRUD, bookmarks, and pagination).*

---

### Step 2: Start the React Frontend

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev
```

*The Vite development server will launch at `http://localhost:5173`.*

---

## 🔑 Pre-Configured Demo Accounts

For effortless evaluation, the login screen includes **1-Click Demo Login** buttons:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Student** | `student@nexus.edu` | `password123` | Bookmark opportunities, update profile, view dashboard |
| **Admin** | `admin@nexus.edu` | `password123` | Full CRUD on hackathons & internships, view stats, seed database |

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create student or admin account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/me` - Retrieve authenticated user profile *(Private)*
- `PUT /api/auth/profile` - Update academic profile, bio, and skills *(Private)*

### Hackathons
- `GET /api/hackathons` - List hackathons (Supports: `search`, `mode`, `status`, `tag`, `sort`, `page`, `limit`)
- `GET /api/hackathons/:id` - Fetch single hackathon details
- `POST /api/hackathons` - Create hackathon *(Admin only)*
- `PUT /api/hackathons/:id` - Update hackathon *(Admin only)*
- `DELETE /api/hackathons/:id` - Remove hackathon *(Admin only)*

### Internships
- `GET /api/internships` - List internships (Supports: `search`, `type`, `status`, `skill`, `sort`, `page`, `limit`)
- `GET /api/internships/:id` - Fetch single internship details
- `POST /api/internships` - Create internship listing *(Admin only)*
- `PUT /api/internships/:id` - Update internship *(Admin only)*
- `DELETE /api/internships/:id` - Remove internship *(Admin only)*

### Bookmarks
- `GET /api/bookmarks` - Fetch populated bookmarks for current user *(Private)*
- `GET /api/bookmarks/ids` - Fast sync endpoint returning saved IDs *(Private)*
- `POST /api/bookmarks/toggle` - Toggle bookmark for hackathon or internship *(Private)*
- `DELETE /api/bookmarks/:id` - Remove specific bookmark *(Private)*

### Admin
- `GET /api/admin/stats` - Platform KPIs, counts, and user metrics *(Admin only)*
- `POST /api/admin/seed` - Replenish curated sample data *(Admin only)*

---

## 🔒 Security Best Practices

1. **Password Hashing**: Passwords are salted and hashed using `bcryptjs` with 10 salt rounds before being stored.
2. **Stateless JWT Authentication**: Tokens are signed using HMAC SHA-256 with an environment secret (`JWT_SECRET`) and expire automatically after 7 days.
3. **Role-Based Access Control (RBAC)**: All administrative mutation routes (`POST`, `PUT`, `DELETE` for listings) verify both authentication and role authorization, rejecting non-admins with `403 Forbidden`.
4. **Environment Isolation**: Database connection strings, ports, and JWT keys are loaded strictly from `.env` and never hardcoded in source control.
5. **Sanitization & Input Validation**: Email addresses are normalized to lowercase and trimmed; required fields are validated before persistence.

---

## 🚢 Deployment Instructions

### Production Frontend Build
```bash
cd frontend
npm run build
```
Generates an optimized static bundle in `frontend/dist/`. Deploy to Vercel, Netlify, or serve directly from Express via `express.static()`.

### Backend Deployment (Render, Railway, AWS ECS)
1. Set environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/opportunity_nexus`
   - `JWT_SECRET=<strong_random_secret_string>`
   - `CLIENT_URL=https://your-frontend-domain.com`
2. Start command: `node backend/server.js`
