# EWMS PRO | Enterprise Work Management System

A full-stack Enterprise Work Management System built using **Spring Boot** (Backend) and **React** (Frontend). This system supports secure authentication, role-based access control, real-time collaboration, and data analytics.

## 🔗 Hosted Links
- **Frontend (Netlify):** [https://enterpriseworkmanagementsystem.netlify.app](https://enterpriseworkmanagementsystem.netlify.app)
- **Backend (Railway):** [https://ewms-project-production.up.railway.app](https://ewms-project-production.up.railway.app)

---

## 🚀 Features
- **Role-Based Access Control**: Granular permissions for Admin, Manager, and Employee roles.
- **Projects & Tasks**: Full Kanban board with drag-and-drop capability.
- **Real-Time Collaboration**: WebSocket-powered toast notifications and live updates.
- **Reporting & Analytics**: Comprehensive data visualization with interactive charts.
- **Activity Feed**: System-wide audit log of user actions.
- **Dark Mode**: Persistent theme toggling.

---

## 🛠️ Tech Stack & Libraries
### Frontend
- **Core:** React 18 (Hooks), Vite, React Router v6.
- **UI:** Material-UI (MUI), TailwindCSS (for custom utilities).
- **State:** Redux Toolkit (Auth), Context API (Theming).
- **Forms:** React Hook Form, Yup Validation.
- **Charts:** Recharts.
- **Real-time:** SockJS, StompJS.
- **DND:** @hello-pangea/dnd.
- **Feedback:** React Toastify.

### Backend
- **Core:** Spring Boot 3, Java 17, Spring Security.
- **Database:** MySQL, Spring Data JPA.
- **Auth:** JWT (JSON Web Tokens).
- **Communication:** Spring WebSocket + STOMP.

---

## 🏁 How to Run Locally

### Backend
1. Navigate to the `backend` folder.
2. Ensure MySQL is running and update `application.properties` with your credentials.
3. Run: `mvn spring-boot:run`
4. *DataSeeder will automatically populate demo data on first run.*

### Frontend
1. Navigate to the `Enterprise Work Management System` folder.
2. Install dependencies: `npm install --legacy-peer-deps`
3. Start dev server: `npm run dev`

---

## 🧪 Testing
The project includes a robust test suite of **46 unit and integration tests** ensuring reliability across all core components.

- **Unit Tests:** `npm test` executes tests for components, reducers, and context providers (5 tests per major component).
- **Integration Tests:** 
  - `AppFlow.test.jsx`: Verifies high-level navigation and auth flow.
  - `integration/UserFlow.test.jsx`: Simulates a complete user journey (Login → Dashboard → Protected Route access).
- **Coverage:** Run `npm run test:coverage` to generate full reports (Target: >80% for core logic).

---

## 📷 Screenshots

| Dashboard | Projects List |
| :---: | :---: |
| ![Dashboard](./Enterprise%20Work%20Management%20System/screenshots/dashboard.png) | ![Projects](./Enterprise%20Work%20Management%20System/screenshots/projects.png) |

| Kanban Board | Reports & Analytics |
| :---: | :---: |
| ![Kanban](./Enterprise%20Work%20Management%20System/screenshots/kanban.png) | ![Reports](./Enterprise%20Work%20Management%20System/screenshots/reports.png) |

| Test Execution Report (46/46 Passed) |
| :---: |
| ![Test Coverage](./Enterprise%20Work%20Management%20System/screenshots/test_coverage.png) |
| ![Users](./Enterprise%20Work%20Management%20System/screenshots/users.png) |

---

## 👤 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `abhijit@test.com` | `admin123` |
| **Manager** | `rajesh@test.com` | `manager123` |
| **Employee** | `kunal@test.com` | `emp123` |

---
*Created by Abhijit Behera | Enterprise Work Management System Project*
