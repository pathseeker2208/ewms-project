# Enterprise Work Management System

This is a full-stack Enterprise Work Management System built using Spring Boot (Backend) and React (Frontend). 

## Features
- **Role-Based Access Control**: Admin, Manager, and Employee roles.
- **Projects & Tasks**: Kanban board with drag-and-drop capability.
- **Real-Time Collaboration**: Live task comments, attachments, and WebSocket-powered toast notifications.
- **Dashboard & Analytics**: Recharts integration for visual task metrics.
- **Activity Feed**: Live activity tracking for system events.
- **Theming**: Dark/Light mode toggling with persisted local storage.

## How to Run

### Backend (Spring Boot)
1. Ensure you have Java 17 and MySQL installed and running.
2. The database configurations are located in `src/main/resources/application.properties` (Default pass: `mysql123`).
3. Open a terminal and navigate to the `backend` folder.
4. Run the server:
   ```bash
   mvn spring-boot:run
   ```
   *Note: On the first run, the `DataSeeder` will automatically populate the database with demo users, projects, and tasks.*

### Frontend (React/Vite)
1. Open a new terminal and navigate to the `Enterprise Work Management System` folder.
2. Install dependencies (if you haven't already):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the provided `localhost` link in your browser.

## Demo Credentials
The database has been seeded with the following users for testing purposes.

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Abhijit Behera | abhijit@test.com | admin123 | **ADMIN** |
| Rajesh Kumar Jena | rajesh@test.com | manager123 | **MANAGER** |
| Aditya Kiran Pati | aditya@test.com | manager123 | **MANAGER** |
| Kunal KUmar | kunal@test.com | emp123 | EMPLOYEE |
| Jeevanjyoti Sahoo | jeevanjyoti@test.com | emp123 | EMPLOYEE |
| Sudeep Dehury | sudeep@test.com | emp123 | EMPLOYEE |
| Akanshya Pradhan | akanshya@test.com | emp123 | EMPLOYEE |
| Harish Sahoo | harish@test.com | emp123 | EMPLOYEE |
| Laxmidhar Ojha | laxmidhar@test.com | emp123 | EMPLOYEE |

*Note: Only Admins and Managers have the ability to create new projects. Admins have exclusive access to the Users management page.*
