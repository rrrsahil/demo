<div align="center">

# ✈️ Traveloop

### Your Complete Travel Planning Companion

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**Traveloop** is a full-stack MERN travel planning web application that lets you create trips, build day-by-day itineraries, manage budgets, maintain packing checklists, write travel notes, and explore community trips — all in one place.

[Live Demo](#deployment) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [MongoDB Setup](#2-mongodb-setup)
  - [Backend Setup](#3-backend-setup)
  - [Environment Variables](#4-environment-variables)
  - [Frontend Setup](#5-frontend-setup)
  - [Run the Application](#6-run-the-application)
- [API Reference](#-api-reference)
- [Authentication Flow](#-authentication-flow)
- [Responsive Design](#-responsive-design)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Future Scope](#-future-scope)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🌍 Overview

Traveloop is built as a **hackathon-grade MERN stack project** that provides travelers with a single unified platform to:

- Plan and organize trips from scratch
- Build detailed day-by-day itineraries with categorized activities
- Track travel budgets with visual charts and breakdowns
- Maintain packing checklists with category filters and progress tracking
- Write and manage trip notes and reminders
- Discover and share public trips with the community

The application follows a **clean REST API architecture** with JWT-based authentication, role-based access control, file uploads via Multer, and a fully responsive dashboard-style UI built with manual CSS (no frameworks like Tailwind).

---

## ✨ Features

### 🔐 Authentication
- User registration and login with JWT
- Secure password hashing (bcryptjs)
- Forgot password via email / dev console token
- Reset password with expiring token (10 minutes)
- Persistent login via localStorage

### 🗺️ Trip Management
- Create trips with name, dates, description, destinations, and cover image
- Multi-step creation wizard (Info → Destinations → Cover Image)
- View, search, and filter all your trips by status
- Delete trips with full cascade (itinerary, budget, checklist, notes)
- Mark trips as public to share with the community

### 📅 Itinerary Builder
- Add day-by-day plans with city, date, and notes
- Search and assign activities from the activity library to each day
- Remove activities from days
- Collapsible day cards for clean navigation
- Full itinerary timeline view

### 💰 Budget Breakdown
- Enter costs per category: Transport, Hotel, Activities, Meals, Misc
- Live total calculation
- Category percentage bars
- Visual Recharts Pie + Bar charts
- Multi-currency support (INR, USD, EUR, GBP, etc.)

### ✅ Packing Checklist
- Add items with category tags (Clothing, Documents, Electronics, etc.)
- Toggle packed/unpacked with visual progress bar
- Filter by category
- Delete items

### 📝 Trip Notes
- Add titled notes per trip
- Inline edit and delete
- Chronological display

### 🧭 Activity Explorer
- Browse 29+ pre-seeded activities across 7 categories
- Search and filter by category
- View cost, duration, rating per activity

### 👥 Community
- Explore public trips shared by other users
- See trip destinations, dates, author info, and cover images

### 👤 Profile
- Update name and profile photo
- Change password with current password verification

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** v4 | REST API framework |
| **MongoDB** | NoSQL database |
| **Mongoose** v8 | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Multer** | File upload middleware |
| **Nodemailer** | Email service (password reset) |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin request handling |
| **Nodemon** | Dev hot-reloading |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** v19 | UI library |
| **Vite** v8 | Build tool and dev server |
| **React Router DOM** v6 | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Recharts** | Budget visualization charts |
| **Font Awesome 6** | Icon library (via CDN) |
| **Poppins** (Google Fonts) | Typography |
| **Manual CSS** | Custom design system (no Tailwind) |

---

## 📁 Folder Structure

```
Odoo/                               ← Root project directory
│
├── README.md                       ← This file
│
├── backend/                        ← Express + MongoDB API
│   ├── .env                        ← Environment variables (DO NOT commit)
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── server.js               ← Entry point (starts server)
│       ├── app.js                  ← Express app, routes, middleware
│       │
│       ├── configs/
│       │   ├── db.js               ← MongoDB connection
│       │   └── multer.js           ← File upload configuration
│       │
│       ├── models/
│       │   ├── user.model.js
│       │   ├── trip.model.js
│       │   ├── itinerary.model.js
│       │   ├── activity.model.js
│       │   ├── budget.model.js
│       │   ├── checklist.model.js
│       │   ├── notes.model.js
│       │   └── city.model.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── trip.controller.js
│       │   ├── itinerary.controller.js
│       │   ├── activity.controller.js
│       │   ├── budget.controller.js
│       │   ├── checklist.controller.js
│       │   ├── notes.controller.js
│       │   └── profile.controller.js
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── trip.routes.js
│       │   ├── itinerary.routes.js
│       │   ├── activity.routes.js
│       │   ├── budget.routes.js
│       │   ├── checklist.routes.js
│       │   ├── notes.routes.js
│       │   └── profile.routes.js
│       │
│       ├── middleware/
│       │   ├── auth.middleware.js  ← JWT protect + adminOnly
│       │   └── error.middleware.js ← Global error handler
│       │
│       ├── utils/
│       │   ├── generateToken.js    ← JWT token generator
│       │   ├── activityData.js     ← 29 seed activities
│       │   └── cityData.js         ← City seed data
│       │
│       └── uploads/                ← Uploaded images stored here
│
└── frontend/                       ← React + Vite SPA
    ├── index.html                  ← Root HTML (fonts, favicon, FA CDN)
    ├── package.json
    ├── vite.config.js
    ├── public/
    │   └── plane.svg               ← Favicon
    └── src/
        ├── main.jsx                ← React entry (BrowserRouter + AuthProvider)
        ├── App.jsx                 ← All routes defined here
        ├── App.css
        ├── index.css
        │
        ├── api/
        │   └── api.js              ← Axios instance with interceptors
        │
        ├── context/
        │   └── AuthContext.jsx     ← Global auth state + hooks
        │
        ├── components/
        │   ├── Header.jsx          ← Top nav with user dropdown
        │   ├── Sidebar.jsx         ← Navigation sidebar
        │   ├── MainLayout.jsx      ← Page shell (Header + Sidebar + Outlet)
        │   ├── ProtectedRoute.jsx  ← Auth guard wrapper
        │   ├── TripCard.jsx        ← Reusable trip display card
        │   ├── ActivityCard.jsx    ← Reusable activity display card
        │   ├── BudgetChart.jsx     ← Recharts Pie + Bar wrapper
        │   ├── ChecklistItem.jsx   ← Single checklist row
        │   ├── Loader.jsx          ← Spinner (inline + full-page)
        │   ├── NotFound.jsx        ← 404 page
        │   └── ScrollToTop.jsx     ← Auto scroll on route change
        │
        ├── pages/
        │   ├── Login.jsx           ← Split-screen login
        │   ├── Register.jsx        ← Registration with validation
        │   ├── ForgetPassword.jsx  ← Forgot password form
        │   ├── ResetPassword.jsx   ← Token-based password reset
        │   ├── Dashboard.jsx       ← Stats + recent trips
        │   ├── CreateTrip.jsx      ← Multi-step trip creation
        │   ├── TripList.jsx        ← Searchable trip list
        │   ├── ItineraryBuilder.jsx ← Day + activity management
        │   ├── ItineraryView.jsx   ← Timeline itinerary view
        │   ├── BudgetBreakdown.jsx ← Budget form + charts
        │   ├── PackingChecklist.jsx ← Packing list management
        │   ├── TripNotes.jsx       ← Travel notes CRUD
        │   ├── ActivitySearch.jsx  ← Activity explorer
        │   ├── Profile.jsx         ← Profile + password update
        │   └── Community.jsx       ← Public trips gallery
        │
        ├── css/
        │   ├── global.css          ← Design tokens, utilities, base styles
        │   ├── responsive.css      ← Breakpoints for mobile/tablet/desktop
        │   ├── header.css
        │   ├── sidebar.css
        │   ├── login.css
        │   ├── dashboard.css
        │   ├── createTrip.css
        │   ├── itineraryBuilder.css
        │   ├── tripCard.css
        │   ├── activityCard.css
        │   ├── budget.css
        │   └── checklist.css
        │
        └── utils/
            ├── constants.js        ← ACTIVITY_CATEGORIES, API_BASE, CATEGORY_ICONS
            ├── formatDate.js       ← formatDate, getDuration, formatDateInput
            └── calculateBudget.js  ← calculateTotal, formatCurrency
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org) |
| **npm** | v9 or higher | Comes with Node.js |
| **MongoDB** | v6 or higher (local) OR MongoDB Atlas | [mongodb.com](https://mongodb.com) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

To verify your installations:

```bash
node --version    # Should print v18.x.x or higher
npm --version     # Should print 9.x.x or higher
mongod --version  # Should print v6.x.x or higher
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-username/traveloop.git

# Move into the project directory
cd traveloop
```

> **Note:** If you received the project as a ZIP file, extract it and open the root folder (`Odoo/`) in your terminal.

---

### 2. MongoDB Setup

#### Option A — Local MongoDB (Recommended for development)

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:

```bash
# Windows
net start MongoDB

# macOS / Linux
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

3. The default connection string is:
```
mongodb://localhost:27017/TraveloopDB
```
The database `TraveloopDB` will be created automatically on first connection.

#### Option B — MongoDB Atlas (Cloud)

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a new cluster (free tier M0 is sufficient)
3. Click **Connect → Connect your application**
4. Copy the connection string. It looks like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/TraveloopDB?retryWrites=true&w=majority
```
5. Replace `<username>` and `<password>` with your Atlas credentials
6. Paste this as the value of `MONGO_URI` in your `.env` file

---

### 3. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install all dependencies
npm install
```

This installs: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer`, `nodemailer`, `express-validator`, and `nodemon`.

---

### 4. Environment Variables

Inside the `backend/` directory, open the `.env` file. It already exists with defaults — update the values as needed:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/TraveloopDB

# JWT Authentication
JWT_SECRET=traveloop_super_secret_jwt_key_2024

# Password Reset Token Expiry
RESET_TOKEN_EXPIRE=10m
VERIFY_TOKEN_EXPIRE=10m

# Email (only required in production for password reset emails)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **⚠️ Security Notice:**
> - Never commit your `.env` file to GitHub. It is already included in `.gitignore`.
> - Change `JWT_SECRET` to a long random string before deploying to production.
> - For `EMAIL_PASS`, use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your actual Gmail password.
> - In `development` mode, password reset links are printed to the server console — no email is sent.

---

### 5. Frontend Setup

```bash
# From the project root, navigate to frontend
cd frontend

# Install all dependencies
npm install
```

This installs: `react`, `react-dom`, `react-router-dom`, `axios`, `recharts`, and `vite`.

> **No additional configuration needed.** The frontend connects to `http://localhost:5000` by default (configured in `src/api/api.js`).

---

### 6. Run the Application

You need **two terminal windows** open simultaneously.

#### Terminal 1 — Start the Backend

```bash
cd backend
npm run dev
```

**Expected output:**
```
[nodemon] starting `node src/server.js`
✅ MongoDB Connected: localhost
🚀 Traveloop Server running at http://localhost:5000
```

You can verify the server is working by visiting:
```
http://localhost:5000/api/health
```
Response: `{ "status": "OK", "message": "Traveloop API is running 🚀" }`

#### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and visit: **[http://localhost:5173](http://localhost:5173)**

---

## 📡 API Reference

All API routes are prefixed with `/api`. The backend runs at `http://localhost:5000`.

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and get JWT token |
| `GET` | `/profile` | Private | Get logged-in user's profile |
| `POST` | `/forgot-password` | Public | Send password reset link |
| `POST` | `/reset-password/:token` | Public | Reset password with token |

### 🗺️ Trip Routes — `/api/trips`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/create` | Private | Create a new trip (with cover image) |
| `GET` | `/` | Private | Get all trips for logged-in user |
| `GET` | `/public` | Public | Get all public community trips |
| `GET` | `/:id` | Private | Get single trip by ID |
| `PUT` | `/:id` | Private | Update a trip |
| `DELETE` | `/:id` | Private | Delete trip (cascades all data) |

### 📅 Itinerary Routes — `/api/itinerary`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/add` | Private | Add a day to itinerary |
| `GET` | `/:tripId` | Private | Get all days for a trip |
| `PUT` | `/:id` | Private | Update a day (add/remove activities) |
| `DELETE` | `/:id` | Private | Delete a day |

### 💰 Budget Routes — `/api/budget`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/calculate` | Private | Create or update trip budget |
| `GET` | `/:tripId` | Private | Get budget for a trip |

### ✅ Checklist Routes — `/api/checklist`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/add` | Private | Add item to checklist |
| `GET` | `/:tripId` | Private | Get all items for a trip |
| `PUT` | `/update/:id` | Private | Toggle packed / edit item |
| `DELETE` | `/delete/:id` | Private | Delete an item |

### 📝 Notes Routes — `/api/notes`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/add` | Private | Add a note |
| `GET` | `/:tripId` | Private | Get all notes for a trip |
| `PUT` | `/:id` | Private | Edit a note |
| `DELETE` | `/:id` | Private | Delete a note |

### 🧭 Activity Routes — `/api/activities`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Private | Get all activities (auto-seeds if empty) |
| `POST` | `/add` | Admin | Add a new activity |
| `POST` | `/seed` | Admin | Re-seed default activities |

### 👤 Profile Routes — `/api/profile`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `PUT` | `/update` | Private | Update name + profile photo |
| `PUT` | `/change-password` | Private | Change password (requires current) |

---

## 🔐 Authentication Flow

```
┌────────────┐     POST /api/auth/register     ┌──────────────────┐
│   User     │ ───────────────────────────────► │   Backend API    │
│  Browser   │ ◄─────────────── JWT Token ───── │                  │
└────────────┘                                  └──────────────────┘
       │                                                  │
       │  JWT stored in localStorage                      │
       │  (key: traveloop_token)                          │
       │                                                  │
       │  Every API request includes:                     │
       │  Authorization: Bearer <token>                   │
       │                                                  │
       ▼                                                  ▼
┌────────────┐     Token decoded by middleware  ┌──────────────────┐
│  Axios     │ ◄──────── req.user populated ─── │  auth.middleware  │
│ Interceptor│                                  │   (protect)       │
└────────────┘                                  └──────────────────┘
```

**Token lifecycle:**
1. User registers or logs in → server returns JWT (30-day expiry)
2. JWT saved in `localStorage` as `traveloop_token`
3. Axios interceptor automatically adds `Authorization: Bearer <token>` to every request
4. If server returns `401`, the token is cleared and user is redirected to `/login`
5. On app load, `AuthContext` validates the stored token via `GET /api/auth/profile`

**Password Reset flow:**
1. User submits email on `/forgot-password` page
2. Backend generates a random token, hashes it, stores it with 10-min expiry
3. **In development** — reset URL is printed to the server console
4. **In production** — email is sent via Gmail SMTP (Nodemailer)
5. User clicks reset link → submits new password → token is cleared

---

## 📱 Responsive Design

Traveloop is fully responsive with a **mobile-first approach**.

| Breakpoint | Layout |
|------------|--------|
| `< 768px` (Mobile) | Sidebar hidden behind hamburger menu. Stack layouts. Full-width forms. |
| `768px–1023px` (Tablet) | Sidebar available. 2-column grids for stats and trips. |
| `≥ 1024px` (Desktop) | Full sidebar always visible. 3-column trip grids. Side-by-side budget layout. |

**Key responsive behaviors:**
- Sidebar slides in from left on mobile via hamburger button in header
- Overlay backdrop closes the sidebar on mobile
- Stats grid adapts from 1-col → 2-col → 4-col
- Budget layout stacks on mobile, side-by-side on desktop
- Auth pages hide the left decorative panel on mobile
- Forms collapse to single-column on small screens

All breakpoints and layout overrides are centralized in `frontend/src/css/responsive.css`.

---

## 📸 Screenshots

> *(Screenshots to be added after deployment or first run)*

| Page | Description |
|------|-------------|
| 🖼️ Login | Split-screen with feature highlights |
| 🖼️ Dashboard | Stats cards + recent trips |
| 🖼️ Create Trip | Multi-step trip creation wizard |
| 🖼️ Itinerary Builder | Day cards with activity modal |
| 🖼️ Budget Breakdown | Cost inputs + Pie/Bar charts |
| 🖼️ Packing Checklist | Categorized list with progress bar |
| 🖼️ Community | Public trips gallery |

To add screenshots, create a `/docs/screenshots/` folder and reference images here:
```md
![Dashboard](docs/screenshots/dashboard.png)
```

---

## 🌐 Deployment

### Deploy Backend to Render (Free Tier)

1. Push your code to a GitHub repository
2. Create an account at [render.com](https://render.com)
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables (same as your `.env` file, but with production MongoDB Atlas URI)
7. Click **Create Web Service**

### Deploy Frontend to Vercel (Free Tier)

1. Create an account at [vercel.com](https://vercel.com)
2. Click **New Project → Import from GitHub**
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
4. Before deploying, update `frontend/src/api/api.js`:
   ```js
   baseURL: 'https://your-backend-render-url.onrender.com/api'
   ```
5. Click **Deploy**

> **Important:** After deploying the backend, update the CORS origin in `backend/src/app.js`:
> ```js
> app.use(cors({ origin: 'https://your-frontend-vercel-url.vercel.app', credentials: true }))
> ```

---

## 🔭 Future Scope

The following features are planned for future versions:

| Feature | Description |
|---------|-------------|
| 🗺️ **Map Integration** | Google Maps / Leaflet to visualize destinations and routes |
| 🤖 **AI Trip Generator** | Auto-generate itinerary suggestions based on destination + duration |
| 💬 **Community Comments** | Comment and like on public trips |
| 📊 **Analytics Dashboard** | Travel statistics: countries visited, total spent, days traveled |
| 📲 **PWA Support** | Installable app with offline checklist access |
| 🌙 **Dark Mode** | Full dark theme toggle |
| 📤 **Export to PDF** | Download trip itinerary as a printable PDF |
| 🔔 **Push Notifications** | Reminders before trip start dates |
| 👨‍👩‍👧 **Group Trips** | Collaborate on trips with multiple users |
| 🌍 **Multi-language** | i18n support for international travelers |
| 📸 **Trip Photo Gallery** | Upload and organize trip photos per destination |
| ✈️ **Flight/Hotel Booking** | Integration with booking APIs (Amadeus, Booking.com) |

---

## 👨‍💻 Contributors

| Name | Role | GitHub |
|------|------|--------|
| **Alok Patel** | Full Stack Developer | [@alokp](https://github.com/alokp) |

> Want to contribute? Fork the repo, create a feature branch, and open a Pull Request!

```bash
# Fork and clone the repo
git clone https://github.com/your-username/traveloop.git

# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git commit -m "feat: add your feature description"

# Push and create a Pull Request
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Traveloop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Made with ❤️ by the Traveloop Team

⭐ **Star this repo if you found it helpful!**

</div>
