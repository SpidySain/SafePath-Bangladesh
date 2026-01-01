# 🚦 **SafePath Bangladesh**

### Digital Road Safety, Alerts & Awareness Platform (MERN Stack)

SafePath Bangladesh is a **full-stack MERN web platform** designed to improve road safety in Bangladesh by enabling citizens to **report hazards**, **view verified alerts**, and **receive awareness messages**, while allowing **admins to manage alerts, awareness campaigns, and reports**.

This project was developed as part of a **university Software Engineering course**, following **requirements-driven development**, **MVC architecture**, and real-world system design principles.

---

## 🌍 Core Features Overview

### 👥 Citizens

* Report unsafe roads & incidents
* View **live safety alerts**
* View **expired alerts (labeled)**
* Receive **awareness messages**
* Interactive **map-based visualization**
* QR-based reporting (Location & Vehicle)

### 🛠 Admins

* Create / Enable / Disable **Safety Alerts**
* Create / Activate **Awareness Messages**
* View all alerts (active + expired)
* Dashboard analytics & summaries
* Control visibility for citizens

---

## 📜 Requirements Coverage & Status

### ✔ Requirement 1 — Unsafe Area / Road Hazard Reporting

**Status: Fully Implemented**

* Location-based reporting (manual or QR)
* GPS coordinates (lat/lng)
* City, district, area
* Issue category & severity
* Optional media upload
* Reports visible on map

**Location QR Format**

```
City|Address|Latitude|Longitude
```

---

### ✔ Requirement 2 — Alerts & Awareness System

**Status: Fully Implemented**

#### Safety Alerts

* Admin creates alerts with:

  * Severity (RED / YELLOW)
  * Location
  * Message
  * Auto expiry (24 hours)
* Citizens see alerts in:

  * **Top notification banner (active only)**
  * **Alerts page (active + expired with label)**

#### Awareness Messages

* Admin creates awareness campaigns
* Admin can activate/deactivate
* Citizens see awareness:

  * On homepage (campaign section)
  * As a rotating banner on other pages

---

### ✔ Requirement 3 — Safety Map Visualization

**Status: Fully Implemented**

* Google Maps integration
* Severity-based colored zones
* Markers with:

  * Issue
  * City & area
  * Severity
  * Timestamp

---

### ✔ Requirement 4 — Vehicle-Linked Reporting (QR)

**Status: Fully Implemented**

* Scan vehicle QR codes
* Load vehicle details
* View past issue history
* Link reports to vehicles

**Vehicle QR API**

```
GET /api/vehicles/qr/:qrCode
```

---

### ✔ Requirement 5 — User History & Profile

**Status: Implemented**

* User report history
* Admin user tracking
* JWT-based authentication
* Role-based access (Admin / User)

---

## 🧠 Smart QR Code System

The backend auto-detects QR type:

### 📍 Location QR

```json
{
  "type": "LOCATION_QR",
  "city": "Dhaka",
  "address": "Badda",
  "latitude": 23.78,
  "longitude": 90.42
}
```

### 🚗 Vehicle QR

```json
{
  "type": "VEHICLE_QR",
  "vehicle": { ... },
  "issueHistory": [ ... ]
}
```

Frontend adapts dynamically.

---

## 🧩 Technology Stack

### Frontend

* React + Vite
* React Router
* Context API (Auth)
* Google Maps API
* Modern component-based UI
* Admin & User dashboards

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Role-based middleware
* REST API architecture
* Multer (media uploads)
* dotenv & CORS

---

## 📁 Full Project Structure

```
SafePath-Bangladesh/
│
├── Backend/
│   │
│   ├── controllers/
│   │   ├── alertController.js          # Citizen & admin alert logic (expiry, active)
│   │   ├── awarenessController.js      # Awareness campaigns CRUD
│   │   ├── authController.js           # Login / register / JWT handling
│   │   ├── reportController.js         # Road safety reports logic
│   │   ├── vehicleController.js        # Vehicle & QR based reporting
│   │   ├── categoryController.js       # Issue categories
│   │   └── ratingController.js         # Ratings & feedback logic
│   │
│   ├── middleware/
│   │   └── authMiddleware.js            # JWT auth + adminOnly guard
│   │
│   ├── models/
│   │   ├── Alert.js                    # Safety alert schema (expiry, active)
│   │   ├── Awareness.js                # Awareness campaign schema
│   │   ├── Report.js                   # Road hazard report schema
│   │   ├── Vehicle.js                  # Vehicle & QR schema
│   │   ├── Location.js                 # Location model
│   │   ├── IssueCategory.js             # Issue categories
│   │   └── Rating.js                   # User ratings & feedback
│   │
│   ├── routes/
│   │   ├── alertRoutes.js               # Public alert routes
│   │   ├── awarenessRoutes.js           # Public awareness routes
│   │   ├── adminRoutes.js               # Admin dashboard routes
│   │   ├── adminAlertRoutes.js          # Admin alert control routes
│   │   ├── reportRoutes.js              # Reporting routes
│   │   ├── vehicleRoutes.js             # Vehicle & QR routes
│   │   └── categoryRoutes.js            # Issue categories
│   │
│   ├── uploads/                         # Uploaded images & videos
│   │
│   ├── public/
│   │   └── index.html                   # Backend static serving (if needed)
│   │
│   ├── server.js                        # Express app entry point
│   ├── package.json                    # Backend dependencies
│   ├── package-lock.json
│   └── .env.example                    # Environment variables template
│
├── Frontend/
│   │
│   ├── public/
│   │   ├── login-bg.png
│   │   ├── vite.svg
│   │   └── index.html
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── home-hero.png
│   │   │   ├── login-hero.png
│   │   │   └── feature-bg/
│   │   │       ├── admin.png
│   │   │       ├── alerts.png
│   │   │       ├── map.png
│   │   │       ├── qr.png
│   │   │       └── report.png
│   │   │
│   │   ├── config/
│   │   │   └── apiClient.js             # Centralized API wrapper
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Auth & role management
│   │   │
│   │   ├── controllers/
│   │   │   ├── alertController.js       # Alert API calls
│   │   │   ├── awarenessController.js   # Awareness API calls
│   │   │   ├── reportController.js      # Report API calls
│   │   │   ├── vehicleController.js     # Vehicle API calls
│   │   │   ├── categoryController.js
│   │   │   └── ratingController.js
│   │   │
│   │   ├── data/
│   │   │   ├── bdLocations.json         # Bangladesh locations dataset
│   │   │   └── defaultCategories.js
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── FilterReportsPage.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   ├── AwarenessPage.jsx
│   │   │   ├── FeedbacksPage.jsx
│   │   │   ├── QrPage.jsx
│   │   │   ├── AdminAlertsPage.jsx
│   │   │   ├── AdminAwarenessPage.jsx
│   │   │   └── AdminReportsPage.jsx
│   │   │
│   │   ├── views/
│   │   │   ├── Layout.jsx               # Global layout & banners
│   │   │   ├── HomeView.jsx
│   │   │   ├── AlertsBanner.jsx         # Top alert notification banner
│   │   │   ├── AwarenessBanner.jsx      # Awareness rotating banner
│   │   │   ├── ReportForm.jsx
│   │   │   ├── ReportList.jsx
│   │   │   ├── ReportMap.jsx
│   │   │   ├── AdminAwarenessManager.jsx
│   │   │   ├── AdminReportTable.jsx
│   │   │   └── QrScannerPanel.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── map.js
│   │   │   ├── qr.js
│   │   │   └── reportFilters.js
│   │   │
│   │   ├── App.jsx                      # Route definitions
│   │   ├── main.jsx                     # React entry point
│   │   ├── index.css
│   │   └── App.css
│   │
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
└── README.md                            # Root project documentation
```

---

## 🔌 Backend API Summary

### 🚨 Alerts

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/alerts`           | Active alerts (not expired)   |
| GET    | `/api/alerts/all`       | All alerts (expired included) |
| GET    | `/api/admin/alerts`     | Admin – all alerts            |
| POST   | `/api/admin/alerts`     | Create alert                  |
| PATCH  | `/api/admin/alerts/:id` | Enable / Disable              |
| DELETE | `/api/admin/alerts/:id` | Delete                        |

---

### 📢 Awareness

| Method | Endpoint                          |
| ------ | --------------------------------- |
| GET    | `/api/awareness`                  |
| GET    | `/api/awareness/admin/all`        |
| POST   | `/api/awareness/admin/create`     |
| PATCH  | `/api/awareness/admin/:id`        |
| PATCH  | `/api/awareness/admin/:id/toggle` |

---

### 📝 Reports

* `POST /api/reports`
* `GET /api/reports`
* `GET /api/reports/user/:userId`

---

### 🚗 Vehicles

* `GET /api/vehicles/qr/:qrCode`
* `PATCH /api/vehicles/:id`

---

## ⚙️ How to Run Locally

### Backend

```bash
cd Backend
npm install
```

Create `.env`

```
MONGO_URI=mongodb://localhost:27017/safepath
PORT=5000
JWT_SECRET=your_secret
```

Start:

```bash
npm start
```

---

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend → [http://localhost:5173](http://localhost:5173)
Backend → [http://localhost:5000](http://localhost:5000)

---

## 🔄 Alert Expiry Logic

* Alerts automatically expire after **24 hours**
* Expired alerts:

  * ❌ Hidden from top banner
  * ✅ Shown on Alerts page with **EXPIRED label**
* Admin can still enable/disable expired alerts

---

## 🚀 Future Enhancements

* Push notifications
* Mobile app version
* Heatmap analytics
* AI-based incident classification
* Public awareness campaign statistics

---

## 👤 Author

**SpidySain**
GitHub: [https://github.com/SpidySain/SafePath-Bangladesh](https://github.com/SpidySain/SafePath-Bangladesh)

---

