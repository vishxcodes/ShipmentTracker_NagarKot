# Nagarkot Forwarders — Shipment Status Tracker

A production-style logistics shipment tracking application built for the Nagarkot Forwarders Pvt. Ltd. Technical Assessment.

---

## Live Demo

The application is deployed and publicly accessible in production:

* **Frontend Application**: [https://shipment-tracker-nagar-kot.vercel.app/](https://shipment-tracker-nagar-kot.vercel.app/)
* **Backend API Base**: [https://shipment-tracker-api-0zvi.onrender.com/api](https://shipment-tracker-api-0zvi.onrender.com/api)
* **Backend Health Check**: [https://shipment-tracker-api-0zvi.onrender.com/api/health](https://shipment-tracker-api-0zvi.onrender.com/api/health)

### Deployment Overview
* The React frontend is deployed on **Vercel**.
* The Express backend is deployed on **Render**.
* The PostgreSQL database is hosted separately on **Render** for production.
* The frontend communicates with the backend through REST APIs over HTTPS.

---

## Project Overview

The **Shipment Status Tracker** is a production-style logistics shipment tracking application designed for Nagarkot Forwarders Pvt. Ltd. It tracks freight cargo packages as they advance through each logistics stage—from booking through transit to final delivery.

The system provides dispatchers and cargo managers with an operational dashboard featuring API-synchronized KPI metrics, debounced search by tracking number, status filtering, shipment registration, detailed cargo dossiers, and an auditable chronological status history timeline.

---

## Features

* **Shipment creation**: Register new cargo with sender, receiver, route (origin/destination), weight, description, and optional estimated delivery date.
* **Shipment listing**: Paginated view of all cargo shipments with route details, current status, and timestamps.
* **Search by tracking number**: Search tracking numbers with a 350ms debounce that queries the backend.
* **Status filtering**: Filter shipments by canonical status (`BOOKED`, `PICKED_UP`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `EXCEPTION`, `CANCELLED`).
* **Pagination**: Server-side pagination with configurable limits and automatic reset to page 1 on search or filter change.
* **Shipment details view**: Modal dossier displaying full cargo specifications, route visualization, and metadata.
* **Chronological status timeline**: Oldest-to-newest timeline tracking every status update with location, timestamps, and notes.
* **Shipment status updates**: Transition shipment status with immediate database persistence and duplicate-status guardrails.
* **Persistent status history**: Auditable history table preserving the complete log of cargo movement events.
* **Live/API-synchronized KPI metrics**: Dynamic summary counts for Total Shipments, Booked, In Transit, Delivered, and Exceptions aggregated by PostgreSQL.
* **Backend health check**: Endpoint reporting server status, process uptime, and live PostgreSQL query latency.
* **Form validation**: Strict client-side and server-side validation for required fields, positive weights, and valid ISO dates.
* **Duplicate tracking number protection**: Database-level unique constraint and API validation returning HTTP 409 Conflict.
* **Responsive desktop and mobile UI**: Fully responsive interface that collapses table rows into touch-friendly cards on mobile devices.
* **Loading, error, and empty states**: Visual skeleton loaders, error notifications with retry actions, and empty-state placeholders.
* **Toast/notification feedback**: Non-blocking toast notifications confirming creations and status updates.
* **Dark minimalist dashboard**: Canvas-dark aesthetic with high-contrast text and color-coded status badges for clear operational readability.

---

## Technology Stack

* **Frontend**: React 19, Vite, Tailwind CSS, Lucide React (icons)
* **Backend**: Node.js, Express.js (ES Modules, `type: "module"`), CORS, Morgan
* **Database**: PostgreSQL
  * *Development*: Local PostgreSQL instance (port `5432`)
  * *Production*: Render Managed PostgreSQL database
* **ORM**: Prisma ORM v6.19.3 (`@prisma/client` v6.19.3)
* **Language**: JavaScript (ES6+)
* **Version Control**: GitHub
* **Hosting & Deployment**:
  * *Frontend*: Vercel
  * *Backend & Database*: Render

---

## Architecture

### Production Architecture

```text
User Browser
     |
     v
Vercel React Frontend
     |
     | HTTPS REST API
     v
Render Express Backend
     |
     | Prisma ORM
     v
Render PostgreSQL Database
```

### Local Development Architecture

```text
User Browser
     |
     v
Vite React Frontend (http://localhost:5173)
     |
     | HTTP REST API
     v
Express Backend (http://localhost:5001)
     |
     | Prisma ORM
     v
Local PostgreSQL (localhost:5432 / shipment_tracker)
```

### Architecture Highlights
* `client/` contains the React/Vite single-page frontend.
* `server/` contains the Node.js/Express backend service following a controller-service pattern.
* **Prisma** serves as the type-safe ORM connecting Express to PostgreSQL.
* **PostgreSQL** stores relational data across `Shipment` and `ShipmentStatusHistory` tables.
* **Vercel** hosts the compiled static frontend with HTTPS and CDN distribution.
* **Render** hosts the Express web service and the managed PostgreSQL database.
* **Atomic Transactions**: All operations modifying shipments and appending history records execute inside `prisma.$transaction` blocks to ensure data integrity.

---

## Folder Structure

```text
Shipment tracker/
├── .gitignore                      # Root Git ignore rules
├── README.md                       # Project documentation
├── client/                         # React Frontend application
│   ├── .env.example                # Frontend environment template
│   ├── .gitignore                  # Frontend ignore rules
│   ├── index.html                  # HTML entry point with Inter font
│   ├── package.json                # React, Vite, Tailwind dependencies
│   ├── postcss.config.js           # PostCSS configuration
│   ├── tailwind.config.js          # Tailwind CSS theme configuration
│   ├── src/
│   │   ├── App.jsx                 # Top-level application shell
│   │   ├── main.jsx                # React DOM render root
│   │   ├── index.css               # Base styles and scrollbar definitions
│   │   ├── constants/
│   │   │   └── shipmentStatus.js   # Canonical status list and color mappings
│   │   ├── utils/
│   │   │   └── formatters.js       # Date, weight, and clipboard utilities
│   │   ├── services/
│   │   │   └── api.js              # Centralized Fetch API client
│   │   └── components/
│   │       ├── Header.jsx          # Header with branding and database latency
│   │       ├── Dashboard.jsx       # State coordinator for KPIs, table, and modals
│   │       ├── MetricCard.jsx      # Summary KPI metric cards
│   │       ├── ShipmentFilters.jsx # Search bar and status filter dropdown
│   │       ├── ShipmentTable.jsx   # Paginated shipment table
│   │       ├── ShipmentRow.jsx     # Responsive row and mobile card view
│   │       ├── StatusBadge.jsx     # Color-coded status badge with dot indicator
│   │       ├── StatusTimeline.jsx  # Oldest-to-newest vertical timeline
│   │       ├── ShipmentDetails.jsx # Cargo dossier modal
│   │       ├── CreateShipmentModal.jsx # New shipment registration form
│   │       ├── UpdateStatusModal.jsx   # Status transition modal
│   │       ├── LoadingState.jsx    # Loading spinner and skeleton
│   │       ├── ErrorState.jsx      # Error banner with retry trigger
│   │       └── EmptyState.jsx      # Empty / no results placeholder
└── server/                         # Express Backend application
    ├── .env.example                # Backend environment template
    ├── .gitignore                  # Backend ignore rules
    ├── package.json                # Express, Prisma, Nodemon dependencies
    ├── prisma/
    │   ├── schema.prisma           # Prisma data models and PostgreSQL datasource
    │   ├── seed.js                 # Idempotent database seed script
    │   └── migrations/             # Version-controlled SQL migration files
    └── src/
        ├── app.js                  # Express setup, CORS, JSON parser, error handlers
        ├── server.js               # Server entry point and graceful shutdown
        ├── constants/
        │   └── shipmentStatus.js   # Canonical status enums
        ├── lib/
        │   └── prisma.js           # Singleton PrismaClient instance
        ├── controllers/
        │   ├── health.controller.js   # Health check controller
        │   └── shipment.controller.js # Request validation & HTTP formatting
        ├── routes/
        │   ├── health.routes.js       # Health check route definitions
        │   └── shipment.routes.js     # Shipment CRUD and status route definitions
        └── services/
            └── shipment.service.js    # Prisma database queries and transactions
```

---

## Environment Variables

### Local Development Environment

#### Backend (`server/.env`)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/shipment_tracker"
PORT=5001
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
```

#### Frontend (`client/.env`)
```env
VITE_API_BASE_URL="http://localhost:5001/api"
```

---

### Production Environment

#### Render Backend Web Service
Configure these variables in the Render dashboard (values shown are placeholders):
```env
DATABASE_URL="<Render PostgreSQL connection string>"
NODE_ENV=production
CLIENT_URL="https://shipment-tracker-nagar-kot.vercel.app/"
PORT="<provided by Render>"
```

#### Vercel Frontend
Configure this variable in the Vercel project settings:
```env
VITE_API_BASE_URL="https://shipment-tracker-api-0zvi.onrender.com/api"
```

### Security & Configuration Rules
* Never commit `.env` files to version control (`.gitignore` excludes them by default).
* Never include real database credentials, passwords, or connection strings in documentation or Git history.
* `VITE_API_BASE_URL` is a public frontend configuration value embedded at build time and does not contain sensitive secrets.

---

## Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher (v22.x recommended)
* **npm**: v9.0.0 or higher
* **PostgreSQL**: v14.0 or higher running locally on port `5432`

### 1. Database Setup
Ensure PostgreSQL is running locally and create the database:
```bash
# Check PostgreSQL status
pg_isready

# Create database
createdb shipment_tracker
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create server/.env from the template and adjust your credentials
cp .env.example .env

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed initial test shipments
npm run seed

# Start development server
npm run dev
```
The backend starts at `http://localhost:5001`. Verify with `http://localhost:5001/api/health`.

### 3. Frontend Setup
In a separate terminal:
```bash
cd client

# Install dependencies
npm install

# Create client/.env from the template
cp .env.example .env

# Start Vite development server
npm run dev
```
The frontend starts at `http://localhost:5173`.

---

## Database Management: Local vs. Production

> **Important**: The local PostgreSQL database and the production Render PostgreSQL database are separate databases. Local shipment records do not automatically appear in production.

### Seeding the Database
The project includes an idempotent seed script in `server/prisma/seed.js` configured in `server/package.json`:

```bash
# Using npm script
npm run seed

# Or using Prisma CLI directly
npx prisma db seed
```

* **Idempotency Guarantee**: The script inspects existing tracking numbers prior to creation. Running it repeatedly safely skips existing records without corrupting status history or duplicating data.
* **Production Seeding**: Run the seed command only when the intended production `DATABASE_URL` is configured in your environment.

---

## Production Deployment

### Backend Deployment on Render

1. Push the project to a GitHub repository.
2. Log in to the [Render Dashboard](https://dashboard.render.com/) and create a new **PostgreSQL** database. Note the internal and external connection strings.
3. Create a new **Web Service** on Render and connect it to your GitHub repository.
4. Set the **Root Directory** to:
   ```text
   server
   ```
5. Set the **Runtime** to:
   ```text
   Node
   ```
6. Set the **Build Command** to:
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy
   ```
7. Set the **Start Command** to:
   ```bash
   npm start
   ```
8. Add the required environment variables in the Render settings:
   * `DATABASE_URL`: Your Render PostgreSQL connection string
   * `NODE_ENV`: `production`
   * `CLIENT_URL`: `https://shipment-tracker-nagar-kot.vercel.app/`
9. Click **Deploy Web Service**.
10. Verify the deployment by requesting the health check endpoint:
    ```text
    https://shipment-tracker-api-0zvi.onrender.com/api/health
    ```

---

### Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Import your GitHub repository.
3. Set the **Root Directory** to:
   ```text
   client
   ```
4. In the **Environment Variables** section, add:
   ```env
   VITE_API_BASE_URL="https://shipment-tracker-api-0zvi.onrender.com/api"
   ```
5. Leave the **Build Command** as default:
   ```bash
   npm run build
   ```
6. Verify the **Output Directory** is set to `dist`.
7. Click **Deploy**.
8. After deployment, open the live URL:
   ```text
   https://shipment-tracker-nagar-kot.vercel.app/
   ```
9. Verify in your browser's Network tab that API requests are routed to `https://shipment-tracker-api-0zvi.onrender.com/api` rather than `http://localhost:5001`.

---

## API Documentation

All API endpoints are prefixed with `/api`.

### Endpoints Overview

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/health` | Service health, process uptime, and database latency | `200 OK`, `503 Service Unavailable` |
| `GET` | `/api/shipments` | List shipments with pagination, search, and filtering | `200 OK`, `400 Bad Request`, `500 Internal Server Error` |
| `POST` | `/api/shipments` | Create a new shipment with initial `BOOKED` history | `201 Created`, `400 Bad Request`, `409 Conflict`, `500 Internal Server Error` |
| `GET` | `/api/shipments/summary` | Aggregate KPI counts grouped by status | `200 OK`, `500 Internal Server Error` |
| `GET` | `/api/shipments/:trackingNumber` | Get single shipment details with full history | `200 OK`, `404 Not Found`, `500 Internal Server Error` |
| `PATCH` | `/api/shipments/:trackingNumber/status` | Update status and record a history entry | `200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error` |
| `GET` | `/api/shipments/:trackingNumber/history` | Retrieve chronological status history | `200 OK`, `404 Not Found`, `500 Internal Server Error` |

---

### Endpoint Details

#### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Response `200 OK`**:
```json
{
  "status": "ok",
  "timestamp": "2026-09-19T00:00:00.000Z",
  "uptime": 120.45,
  "database": {
    "status": "connected",
    "latencyMs": 4
  }
}
```

---

#### 2. List Shipments
* **Endpoint**: `GET /api/shipments`
* **Query Parameters**:
  * `search` *(string, optional)*: Search by tracking number prefix or substring (e.g. `NF2026`)
  * `status` *(string, optional)*: Filter by status enum (e.g. `IN_TRANSIT`)
  * `page` *(number, optional)*: Page number (default: `1`)
  * `limit` *(number, optional)*: Results per page (default: `10`)
* **Response `200 OK`**:
```json
{
  "shipments": [
    {
      "id": "cm123456789",
      "trackingNumber": "NF20260001",
      "senderName": "Apex Technologies",
      "receiverName": "Himalayan Logistics",
      "origin": "Kathmandu",
      "destination": "Pokhara",
      "packageDescription": "Telecom Hardware and Routers",
      "weight": 14.5,
      "status": "IN_TRANSIT",
      "estimatedDeliveryDate": "2026-09-22T00:00:00.000Z",
      "createdAt": "2026-09-17T06:00:00.000Z",
      "updatedAt": "2026-09-17T09:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

#### 3. Create Shipment
* **Endpoint**: `POST /api/shipments`
* **Request Body**:
```json
{
  "trackingNumber": "NF20260010",
  "senderName": "Kathmandu Textiles",
  "receiverName": "Pokhara Crafts Co.",
  "origin": "Kathmandu Central Hub",
  "destination": "Pokhara Lakeside Depot",
  "packageDescription": "Handcrafted garments and wool",
  "weight": 8.5,
  "estimatedDeliveryDate": "2026-09-25T00:00:00.000Z"
}
```
* **Validation**:
  * `trackingNumber`, `senderName`, `receiverName`, `origin`, `destination`, `packageDescription`, and `weight` are required.
  * `weight` must be a positive number.
  * `estimatedDeliveryDate` must be a valid ISO date if provided.
  * Returns `409 Conflict` if the tracking number already exists.
* **Response `201 Created`**: Returns created shipment object with initial `BOOKED` status.

---

#### 4. KPI Summary
* **Endpoint**: `GET /api/shipments/summary`
* **Response `200 OK`**:
```json
{
  "total": 12,
  "booked": 3,
  "inTransit": 5,
  "delivered": 3,
  "exceptions": 1
}
```

---

#### 5. Get Shipment Details
* **Endpoint**: `GET /api/shipments/:trackingNumber`
* **Response `200 OK`**: Returns complete shipment object including the nested `statusHistory` array ordered oldest-to-newest.
* **Response `404 Not Found`**: Returned if the tracking number does not exist.

---

#### 6. Update Shipment Status
* **Endpoint**: `PATCH /api/shipments/:trackingNumber/status`
* **Request Body**:
```json
{
  "status": "IN_TRANSIT",
  "location": "Mugling Highway Checkpoint",
  "note": "Freight vehicle departed central warehouse via Prithvi Highway"
}
```
* **Validation**:
  * `status` must be a valid canonical status enum.
  * Returns `400 Bad Request` if `status` is missing or invalid.
  * Returns `404 Not Found` if the shipment is not found.
* **Response `200 OK`**: Returns updated shipment record.

---

#### 7. Get Status History
* **Endpoint**: `GET /api/shipments/:trackingNumber/history`
* **Response `200 OK`**:
```json
[
  {
    "id": "hist_1",
    "shipmentId": "cm123456789",
    "status": "BOOKED",
    "location": "Kathmandu Central Hub",
    "note": "Shipment booked and registered in system",
    "createdAt": "2026-09-17T06:00:00.000Z"
  },
  {
    "id": "hist_2",
    "shipmentId": "cm123456789",
    "status": "IN_TRANSIT",
    "location": "Mugling Highway Checkpoint",
    "note": "Freight vehicle departed central warehouse via Prithvi Highway",
    "createdAt": "2026-09-17T09:30:00.000Z"
  }
]
```

---

## Shipment Status Lifecycle

Cargo status advances through standardized logistics stages:

```text
  ┌──────────┐      ┌───────────┐      ┌────────────┐      ┌──────────────────┐      ┌───────────┐
  │  BOOKED  │ ──>  │ PICKED_UP │ ──>  │ IN_TRANSIT │ ──>  │ OUT_FOR_DELIVERY │ ──>  │ DELIVERED │
  └────┬─────┘      └─────┬─────┘      └─────┬──────┘      └────────┬─────────┘      └───────────┘
       │                  │                  │                      │
       ▼                  ▼                  ▼                      ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐       ┌──────────────┐
│  CANCELLED   │   │  EXCEPTION   │   │  EXCEPTION   │       │  EXCEPTION   │
└──────────────┘   └──────────────┘   └──────────────┘       └──────────────┘
```

1. **BOOKED**: Cargo booked and registered; awaiting pickup from sender depot.
2. **PICKED_UP**: Cargo collected from sender and received at dispatch hub.
3. **IN_TRANSIT**: Freight in motion between regional transit terminals.
4. **OUT_FOR_DELIVERY**: Cargo assigned to delivery courier for final mile.
5. **DELIVERED**: Successfully delivered and handed over to recipient.
6. **EXCEPTION**: Transit delay, severe weather, customs inspection, or road blockage.
7. **CANCELLED**: Cargo booking cancelled prior to transit.

---

## Testing and Verification

The following verifications and automated checks were executed and confirmed:

* **Prisma schema validation**: `npx prisma validate` completed successfully with zero syntax or schema warnings.
* **Prisma formatting**: `npx prisma format` formatted data models cleanly.
* **Prisma Client generation**: `npx prisma generate` generated TypeScript and JavaScript client bindings for Prisma v6.19.3.
* **Prisma migration status**: `npx prisma migrate status` verified that all migrations are applied and in sync with PostgreSQL.
* **Idempotent seed execution**: `npm run seed` verified inserting initial records and safely skipping existing tracking numbers on subsequent runs.
* **Health endpoint testing**: `GET /api/health` verified returning HTTP 200 with server uptime and database latency under 10ms.
* **Shipment listing**: Verified `GET /api/shipments` returns paginated shipments with correct metadata.
* **Search**: Verified debounced query parameter matching tracking numbers.
* **Status filtering**: Verified filtering shipments across all canonical status enums.
* **Pagination**: Verified page limits, page offsets, total record counts, and total pages calculation.
* **Shipment creation**: Verified `POST /api/shipments` creates shipment records and initial `BOOKED` history in an atomic transaction.
* **Duplicate tracking number validation**: Verified duplicate tracking numbers return HTTP 409 Conflict.
* **Shipment details retrieval**: Verified `GET /api/shipments/:trackingNumber` returns full shipment specifications and status history.
* **Status update**: Verified `PATCH /api/shipments/:trackingNumber/status` updates shipment status and appends a history entry.
* **Status history retrieval**: Verified `GET /api/shipments/:trackingNumber/history` returns chronologically ordered records.
* **Invalid status validation**: Verified invalid status values return HTTP 400 Bad Request with descriptive error messages.
* **Missing field validation**: Verified requests missing required fields return HTTP 400 with missing field names.
* **Negative weight validation**: Verified non-positive weights return HTTP 400 validation error.
* **Invalid date validation**: Verified malformed dates return HTTP 400 validation error.
* **Frontend production build**: `npm run build` completed cleanly producing optimized production assets in `client/dist`.
* **Vercel-to-Render API integration**: Verified live production frontend connects over HTTPS to the Render backend.
* **Responsive UI verification**: Verified responsive design on desktop, tablet, and mobile screen sizes.

---

## Technical Assessment Notes

* **Architecture Scope**: Built as a clean, production-style two-tier architecture (React client + Node.js/Express API + PostgreSQL database).
* **No Authentication Required**: As specified in assessment guidelines, authentication is omitted so all reviewers can inspect dashboard functions and API endpoints directly.
* **Audit Trail Preservation**: Shipments cannot be deleted via the API to maintain audit trail integrity for freight logistics.
* **State Immutability**: All status transitions append new records to `ShipmentStatusHistory` inside atomic database transactions, ensuring historical visibility into cargo movements.
