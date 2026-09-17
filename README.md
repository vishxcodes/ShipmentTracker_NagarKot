# Nagarkot Forwarders — Shipment Status Tracker

> Full-Stack Logistics Operations & Shipment Tracking System built for Nagarkot Forwarders Pvt. Ltd. Technical Assessment.

---

## 1. Project Title
**Nagarkot Forwarders — Shipment Status Tracker**

---

## 2. Project Overview
The **Shipment Status Tracker** is an enterprise-grade, lightweight logistics dispatch management application designed for Nagarkot Forwarders Pvt. Ltd. It tracks freight cargo packages as they progress across logistics hubs from initial booking to final recipient delivery. The platform features an operations dashboard with live KPI metrics, full-text tracking number search with debounce, status filters, cargo registration, deep-dive shipment dossiers, and an auditable chronological status timeline.

---

## 3. Features
- **Real-Time KPI Dashboard**: Dynamic counts for Total Shipments, Booked, In Transit, Delivered, and Exceptions aggregated by PostgreSQL. Click-to-filter capability on any card.
- **Search & Filter**: Search tracking numbers with a 350ms debounce and filter by canonical shipment status stages. Automatically resets pagination to page 1.
- **Shipment Registration**: Register new cargo with sender, receiver, route (origin/destination), weight, description, and optional estimated delivery date. Automatically initializes status to `BOOKED` with an initial status history record in an atomic transaction.
- **Shipment Dossier & Chronological Timeline**: Detailed modal view of shipment specifications, route visualization, copyable tracking number, and an oldest-to-newest chronological timeline with locations, timestamps, and notes.
- **Status Transition Workflow**: Dispatchers can advance or transition cargo status (e.g., `BOOKED` → `PICKED_UP` → `IN_TRANSIT` → `OUT_FOR_DELIVERY` → `DELIVERED` or `EXCEPTION`), with duplicate-status protection and persistent status history tracking.
- **Responsive Dark Theme**: Minimalist, dark operations UI (slate-900 / dark charcoal) tailored for logistics operators, with full mobile responsiveness (collapses table rows into touch-friendly cards without horizontal overflow).
- **System Diagnostics**: Live health indicator reporting Express uptime and PostgreSQL query response latency in milliseconds.

---

## 4. Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS v3.4, Lucide React (Icons).
- **Backend**: Node.js v22, Express.js (ES Modules, `type: "module"`), CORS, Morgan.
- **Database**: PostgreSQL (port 5432, database `shipment_tracker`).
- **ORM**: Prisma ORM v6.19.3 (`@prisma/client` v6.19.3).
- **Language**: JavaScript (ES6+).

---

## 5. Application Architecture
The application is architected as two decoupled services:
```
┌─────────────────────────────────────────┐       HTTP / JSON        ┌─────────────────────────────────────────┐
│           React + Vite Frontend         │  ─────────────────────>  │            Express.js Backend           │
│        (Runs on http://localhost:5173)  │  <─────────────────────  │        (Runs on http://localhost:5001)  │
└─────────────────────────────────────────┘                          └────────────────────┬────────────────────┘
                                                                                          │
                                                                                          │ Prisma Client v6
                                                                                          ▼
                                                                     ┌─────────────────────────────────────────┐
                                                                     │           PostgreSQL Database           │
                                                                     │          (`shipment_tracker`)           │
                                                                     └─────────────────────────────────────────┘
```
- **Controller-Service Architecture**: The backend separates HTTP parsing (`controllers/`) from business and database logic (`services/`).
- **Transaction Safety**: All operations that modify both a shipment and its history run inside atomic Prisma transactions (`prisma.$transaction`).

---

## 6. Folder Structure
```
Shipment tracker/
├── .gitignore                      # Root Git ignore (protects node_modules, .env, dist)
├── README.md                       # Comprehensive documentation
├── client/                         # React Frontend application
│   ├── .env.example                # Frontend environment template
│   ├── .gitignore                  # Frontend ignore rules
│   ├── index.html                  # HTML entry point with Inter font
│   ├── package.json                # React, Vite, Tailwind dependencies
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.js          # Tailwind CSS theme configuration
│   ├── src/
│   │   ├── App.jsx                 # Top-level shell (Header, Dashboard, Footer)
│   │   ├── main.jsx                # React DOM render entry
│   │   ├── index.css               # Tailwind directives and dark scrollbars
│   │   ├── constants/
│   │   │   └── shipmentStatus.js   # Canonical status list and color tokens
│   │   ├── utils/
│   │   │   └── formatters.js       # Safe date, weight, and clipboard utilities
│   │   ├── services/
│   │   │   └── api.js              # Centralized API client helper
│   │   └── components/
│   │       ├── Header.jsx          # Nagarkot Forwarders header & DB latency
│   │       ├── Dashboard.jsx       # State coordinator (KPIs, table, modals)
│   │       ├── MetricCard.jsx      # KPI summary cards
│   │       ├── ShipmentFilters.jsx # Debounced search & status dropdown
│   │       ├── ShipmentTable.jsx   # Paginated shipment table
│   │       ├── ShipmentRow.jsx     # Responsive row / mobile card component
│   │       ├── StatusBadge.jsx     # Status pill badge with dot indicator
│   │       ├── StatusTimeline.jsx  # Oldest-to-newest vertical timeline
│   │       ├── ShipmentDetails.jsx # Cargo dossier modal
│   │       ├── CreateShipmentModal.jsx # New shipment registration modal
│   │       ├── UpdateStatusModal.jsx   # Status transition modal
│   │       ├── LoadingState.jsx    # Pulse skeleton loader
│   │       ├── ErrorState.jsx      # Error banner with retry action
│   │       └── EmptyState.jsx      # Filter/empty state container
└── server/                         # Express Backend application
    ├── .env.example                # Backend environment template
    ├── .gitignore                  # Backend ignore rules
    ├── package.json                # Express, Prisma, Nodemon dependencies
    ├── prisma/
    │   ├── schema.prisma           # Prisma data models and PostgreSQL datasource
    │   ├── seed.js                 # Idempotent database seed script
    │   └── migrations/             # Version-controlled SQL migration history
    └── src/
        ├── app.js                  # Express setup, CORS, JSON parser, error handlers
        ├── server.js               # Entry point, port listening, graceful shutdown
        ├── constants/
        │   └── shipmentStatus.js   # Server-side canonical status enums
        ├── lib/
        │   └── prisma.js           # Singleton PrismaClient instance
        ├── controllers/
        │   ├── health.controller.js   # Health & DB raw query latency
        │   └── shipment.controller.js # Request validation & JSON formatting
        ├── routes/
        │   ├── health.routes.js       # /api/health route
        │   └── shipment.routes.js     # /api/shipments routes
        └── services/
            └── shipment.service.js    # Database queries & atomic transactions
```

---

## 7. Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher running locally on port `5432`

---

## 8. PostgreSQL Database Setup
Ensure PostgreSQL is running locally and that the database `shipment_tracker` exists:
```bash
# Verify PostgreSQL is accepting connections
pg_isready

# Create database if not already created
createdb shipment_tracker
```

---

## 9. Environment Variables

### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```ini
# PostgreSQL Connection URL
DATABASE_URL="postgresql://vishesh@localhost:5432/shipment_tracker"

# Backend Server Port
PORT=5001

# Allowed Client Origin(s) for CORS (can be comma-separated in production)
CLIENT_URL="http://localhost:5173"
```

### Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:
```ini
# Base URL for Express backend API (include /api)
VITE_API_BASE_URL="http://localhost:5001/api"
```

---

## 10. Installation Instructions

### Clone & Install Backend
```bash
cd "Shipment tracker/server"
npm install
```

### Install Frontend
```bash
cd "Shipment tracker/client"
npm install
```

---

## 11. Prisma Migration Commands
Run the migrations to create the PostgreSQL enum and tables:
```bash
cd server

# Validate schema
npx prisma validate

# Format schema
npx prisma format

# Run migrations non-destructively
npx prisma migrate dev --name add_shipment_models

# Generate Prisma Client
npx prisma generate

# Check migration status
npx prisma migrate status
```

---

## 12. Seed Instructions
Populate the database with initial realistic test shipments:
```bash
cd server
npm run seed
```
> **Idempotency**: The seed script checks for existing tracking numbers before inserting. Running `npm run seed` multiple times safely skips existing shipments without duplicating records or history.

---

## 13. Running the Backend
```bash
cd server

# Development mode (auto-reload on change with nodemon)
npm run dev

# Production mode
npm start
```
The server will start at: `http://localhost:5001`  
Health check: `http://localhost:5001/api/health`

---

## 14. Running the Frontend
In a separate terminal:
```bash
cd client

# Development mode
npm run dev
```
The frontend will start at: `http://localhost:5173`

---

## 15. API Endpoint Documentation

| Method | Endpoint | Description | Query Parameters / Body | Status Codes |
|---|---|---|---|---|
| `GET` | `/api/health` | Service health & PostgreSQL latency check | None | `200 OK`, `503 Degraded` |
| `GET` | `/api/shipments` | List paginated shipments with search & status filters | `?search=NF&status=IN_TRANSIT&page=1&limit=10` | `200 OK`, `400 Bad Request` |
| `GET` | `/api/shipments/summary` | Aggregated shipment counts by status | None | `200 OK` |
| `GET` | `/api/shipments/:trackingNumber` | Get single shipment details with full history | None | `200 OK`, `404 Not Found` |
| `GET` | `/api/shipments/:trackingNumber/history` | Get chronological status history | None | `200 OK`, `404 Not Found` |
| `POST` | `/api/shipments` | Register a new shipment (atomic initial `BOOKED` history) | JSON body with shipment specs | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `PATCH` | `/api/shipments/:trackingNumber/status` | Transition status & append history entry | `{ status, location, note }` | `200 OK`, `400 Bad Request`, `404 Not Found` |

---

## 16. Shipment Status Flow
Shipments follow the standard logistics lifecycle:
```
  ┌──────────┐      ┌───────────┐      ┌────────────┐      ┌──────────────────┐      ┌───────────┐
  │  BOOKED  │ ──>  │ PICKED_UP │ ──>  │ IN_TRANSIT │ ──>  │ OUT_FOR_DELIVERY │ ──>  │ DELIVERED │
  └────┬─────┘      └─────┬─────┘      └─────┬──────┘      └────────┬─────────┘      └───────────┘
       │                  │                  │                      │
       ▼                  ▼                  ▼                      ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐       ┌──────────────┐
│  CANCELLED   │   │  EXCEPTION   │   │  EXCEPTION   │       │  EXCEPTION   │
└──────────────┘   └──────────────┘   └──────────────┘       └──────────────┘
```
1. **BOOKED**: Initial registration in system.
2. **PICKED_UP**: Package collected from sender depot.
3. **IN_TRANSIT**: Moving between regional sorting hubs.
4. **OUT_FOR_DELIVERY**: Handed over to final mile courier.
5. **DELIVERED**: Successfully handed over and signed.
6. **EXCEPTION**: Transit delay, customs check, or route issue.
7. **CANCELLED**: Booking cancelled prior to dispatch.

---

## 17. Example Request Bodies

### Create Shipment (`POST /api/shipments`)
```json
{
  "trackingNumber": "NF20260015",
  "senderName": "Govind Sharma",
  "receiverName": "Bikash Adhikari",
  "origin": "Kathmandu Hub",
  "destination": "Biratnagar Station",
  "packageDescription": "Optic fiber routers and cables",
  "weight": 6.8,
  "estimatedDeliveryDate": "2026-09-30T00:00:00.000Z"
}
```

### Update Shipment Status (`PATCH /api/shipments/:trackingNumber/status`)
```json
{
  "status": "IN_TRANSIT",
  "location": "Mugling Highway Checkpoint",
  "note": "Freight vehicle departed central warehouse via Prithvi Highway"
}
```

---

## 18. Deployment Instructions

### Deploying the Backend (e.g., Render, Railway, DigitalOcean, Heroku)
1. Provision a PostgreSQL instance and copy the external connection string.
2. Configure environment variables on the backend hosting provider:
   - `DATABASE_URL`: Your production PostgreSQL URL.
   - `PORT`: Provided by host (or default `5001`).
   - `CLIENT_URL`: The production URL of your frontend (e.g. `https://shipment-tracker.vercel.app`).
   - `NODE_ENV`: `production`.
3. Set the build and start commands:
   - Build Command: `npm install && npx prisma migrate deploy && npx prisma generate`
   - Start Command: `npm start`

### Deploying the Frontend (e.g., Vercel, Netlify, Cloudflare Pages)
1. Configure environment variables in the frontend dashboard:
   - `VITE_API_BASE_URL`: The production backend URL (e.g. `https://shipment-api.railway.app/api`).
2. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Single Page Application (SPA) Routing: Ensure fallback rewriting to `index.html`.

---

## 19. Known Limitations
- **Authentication**: Intentionally omitted per assessment guidelines. In an enterprise deployment, JWT or session-based authentication with role-based access control (Admin, Dispatcher, Driver, Customer) would be added.
- **Deletion**: Shipments cannot be deleted via API to protect audit history integrity.
- **Rate Limiting**: Can be added in front-door proxy (e.g. Nginx or `express-rate-limit`) for production public exposure.

---

## 20. Assessment Notes
- **Prisma Version**: Standardized and locked on stable LTS **Prisma v6.19.3** and `@prisma/client v6.19.3` to avoid experimental v7 driver-adapter quirks.
- **Data Integrity**: All shipments and status transitions utilize PostgreSQL transactions (`prisma.$transaction`) ensuring atomic state updates.
- **Oldest-First History Guarantee**: Status timelines are chronologically ordered from initial booking to latest event.
