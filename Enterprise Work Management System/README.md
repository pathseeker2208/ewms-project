# Enterprise Work Management System

A modular, scalable, and production-ready Work Management System built with React, Spring Boot, and MySQL.

## 🚀 Features

### 1. User Authentication & Roles
- **JWT-based Auth:** Secure login and registration.
- **RBAC (Role-Based Access Control):** 
  - **Admin:** Full system access, user management, and task override.
  - **Manager:** Create/manage projects and tasks; visibility over team progress.
  - **Employee:** Personal task management and contribution to assigned projects.
- **Protected Routes:** Unauthorized access prevention.

### 2. Interactive Dashboard
- **Real-time Metrics:** Quick overview of projects, total tasks, and completion rates.
- **Dynamic Charts:** Visual breakdown of task statuses and project progress using `recharts`.
- **Activity Feed:** Live audit log of system actions.

### 3. Project & Task Management
- **Kanban Board:** Full drag-and-drop experience using `@hello-pangea/dnd`.
- **Advanced Task Attributes:** Statuses (Todo, In Progress, Review, Done), Types (Bug, Feature, Improvement), and Priorities.
- **Attachments & Comments:** Collaboration features built into every task.

### 4. Reporting & Analytics
- **Dedicated Reporting Module:** Detailed project health metrics.
- **Data Export:** Export project data to CSV for offline analysis.

### 5. Notifications System
- **WebSockets:** Real-time toast notifications for system-wide updates.
- **Notification History:** Access recent alerts via a dedicated panel in the header.

### 6. Settings & Personalization
- **Dark/Light Theme:** Persistent theme switching using `localStorage`.
- **Profile Management:** Update personal details and manage security.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Material-UI (MUI), Redux Toolkit.
- **State Management:** Redux Toolkit for global state, Context API for theming.
- **Routing:** React Router v6 with Protected Routes and Lazy Loading.
- **API Integration:** Axios with global interceptors for auth and error handling.
- **Forms:** React Hook Form + Yup for robust validation.
- **Real-time:** StompJS + SockJS for WebSocket connectivity.
- **Testing:** Jest + React Testing Library (Unit & Integration tests).

---

## 📦 Deployment

- **Frontend:** Hosted on Netlify: [https://enterpriseworkmanagementsystem.netlify.app](https://enterpriseworkmanagementsystem.netlify.app)
- **Backend:** Hosted on Railway: [https://ewms-project-production.up.railway.app](https://ewms-project-production.up.railway.app)
- **Database:** Managed MySQL instance on Railway.

---

## 🧪 Testing

The project includes comprehensive test coverage:
- **Unit Tests:** 5+ tests covering Redux slices, Context providers, and UI components.
- **Integration Test:** `AppFlow.test.jsx` simulates the full user journey (Login -> Dashboard -> Projects).

Run tests locally:
```bash
npm test
```

---

## 🏁 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/pathseeker2208/ewms-project.git
   ```
2. **Install dependencies:**
   ```bash
   cd "Enterprise Work Management System"
   npm install
   ```
3. **Set Environment Variables:**
   Create a `.env` file with `VITE_API_URL` and `VITE_WS_URL`.
4. **Run Dev Server:**
   ```bash
   npm run dev
   ```

---

## 📷 Screenshots

| Dashboard | Kanban Board |
| :---: | :---: |
| ![Dashboard](https://via.placeholder.com/400x250?text=Dashboard) | ![Kanban](https://via.placeholder.com/400x250?text=Kanban) |

| Reports | Settings |
| :---: | :---: |
| ![Reports](https://via.placeholder.com/400x250?text=Reports) | ![Settings](https://via.placeholder.com/400x250?text=Settings) |
