# 🚦 **SafePath Bangladesh – Digital Road Safety & Reporting Platform**

SafePath Bangladesh is a MERN-based platform that enables citizens to report unsafe driving, dangerous road conditions, and vehicle misconduct through a modern digital reporting workflow.

The system supports:

* **Unsafe location reporting**
* **Vehicle-linked reporting**
* **QR codes at bus stops & vehicles**
* **Map visualization of safety reports**
* **Media uploads**
* **Basic user history support**

This project was developed as part of a university software engineering course, following requirements-driven development and MVC architecture.

---

# 📜 **Project Requirements – Coverage & Implementation Status**

## ✔ **Requirement 1 — Unsafe Area / Road Hazard Reporting**

**Status: Fully Implemented**

Users can submit reports related to unsafe areas, including:

* GPS coordinates (latitude/longitude)
* City & address
* Issue category (overspeeding, road damage, etc.)
* Severity level (1–5)
* Optional photo/video uploads

**Location QR Codes Supported**
Format:

```
City|Address|Latitude|Longitude
```

Scanning generates an auto-filled report form.

---

## ⚠ **Requirement 2 — Awareness & Alerts**

**Status: Partially Implemented**

Frontend:

* `AlertsPage` and `AwarenessPage` exist as UI placeholders

Backend:

* No implementation for alerts or campaigns yet

---

## ✔ **Requirement 3 — Safety Map Visualization**

**Status: Fully Implemented**

The platform includes:

* Google Maps integration
* Colored severity zones (green/yellow/orange/red)
* Report markers with:

  * Issue type
  * Description
  * City
  * Severity & timestamp

Uses `@react-google-maps/api`.

---

## ✔ **Requirement 4 — Vehicle-Linked Reporting**

**Status: Fully Implemented**

The system supports scanning **vehicle QR codes** to report:

* Reckless driving
* Overspeeding
* Rule violations
* Misconduct by drivers

**Vehicle Features Implemented:**

* Vehicle model with QR code
* `/api/vehicles/qr/:code` → fetch vehicle details
* Update vehicle details during report submission
* Link reports to a specific vehicle
* Show vehicle’s past issue history

---

## ⚠ / ✔ **Requirement 5 — User Profile & History**

**Status: Backend Implemented / Frontend Basic Support**

Backend:

* `/api/reports/user/:userId` → fetch user’s submitted reports

Frontend:

* Fake `AuthContext` simulates user identity
* Reports page shows history

A dedicated profile page is not implemented yet.

---

# 🧠 **QR Code System – Smart Dual-Mode**

The backend automatically identifies whether a QR is:

### **1️⃣ Location QR (Requirement 1)**

```
{ 
  "type": "LOCATION_QR",
  "city": "...",
  "address": "...",
  "latitude": ...,
  "longitude": ...
}
```

### **2️⃣ Vehicle QR (Requirement 4)**

```
{
  "type": "VEHICLE_QR",
  "vehicle": { ... },
  "issueHistory": [ ... ]
}
```

Frontend adapts dynamically to either case.

---

# 🧩 **Technology Stack**

### **Frontend (Local Only, Not in GitHub)**

* React + Vite
* React Router
* qr-scanner
* Context API for user simulation
* MVC-style directory structure
* Google Maps API integration

### **Backend (Included in this Repository)**

* Node.js + Express
* MongoDB + Mongoose
* Multer (file uploads)
* dotenv
* CORS
* REST API architecture

---

# 📁 **Folder Structure**

```
SafePath-Bangladesh/
│
├── backend/
│   ├── models/
│   │   ├── Report.js
│   │   ├── Vehicle.js
│   │   ├── Location.js
│   │   ├── IssueCategory.js
│   │   └── MediaAttachment.js
│   │
│   ├── routes/
│   │   ├── reportRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── uploadRoutes.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

# 🔌 **Backend API Summary**

## **📍 QR Processing**

### `GET /api/reports/from-qr/:qrValue`

→ Returns either LOCATION_QR or VEHICLE_QR format.

---

## **📝 Reports**

### `POST /api/reports`

Create a new report:

* Location-only (Req 1)
* Vehicle-linked (Req 4)

### `GET /api/reports`

List all reports (used in map)

### `GET /api/reports/user/:userId`

User’s report history

---

## **🚗 Vehicle**

### `GET /api/vehicles/qr/:qrCode`

Fetch vehicle + its issue history

### `PATCH /api/vehicles/:vehicleId`

Update allowed fields

---

## **🗂 Categories**

### `GET /api/categories`

### `POST /api/categories`

---

## **📤 Media Upload**

### `POST /api/upload/media`

Uploads image/video
Stored locally in `uploads/` folder
Accessible at `/uploads/<filename>`

---

# ⚙️ **How to Run the Project**

## **1️⃣ Start Backend**

```
cd backend
npm install
```

Create `.env`:

```
MONGO_URI=mongodb://localhost:27017/safepath
PORT=5000
```

Start:

```
npm start
```

Backend URL →
👉 [http://localhost:5000](http://localhost:5000)

---

## **2️⃣ Start Frontend (Not in This Repo)**

```
cd Safepath-frontend
npm install
echo VITE_API_BASE_URL=http://localhost:5000 > .env.local
npm run dev
```

Frontend URL →
👉 [http://localhost:5173](http://localhost:5173)

---

# 🗺 **How the System Works (High-Level Flow)**

### **Requirement 1 Flow**

1. Scan Location QR **OR** enter location manually
2. Form auto-fills city/address/lat/lng
3. User submits unsafe area report
4. Shown on map with severity zone

---

### **Requirement 4 Flow**

1. Scan vehicle QR
2. System loads vehicle info + past issues
3. User submits report with optional vehicle updates
4. Saved with `vehicleId` reference

---

# 🚀 **Future Enhancements**

* Admin dashboard for viewing reports
* User authentication (JWT)
* Push notification alerts
* Heatmap analytics
* AI-based report classification

---

# 👤 **Author**


GitHub: [https://github.com/SpidySain/SafePath-Bangladesh](https://github.com/SpidySain/SafePath-Bangladesh)

---


