# TaskTeam - Team Task Management System

**Angular 20+ Application**

A comprehensive task management system built with Angular 20, designed for team collaboration similar to ClickUp. This application enables teams to manage projects and tasks efficiently with a modern, responsive interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Backend Setup](#backend-setup)
- [Application Structure](#application-structure)
- [API Integration](#api-integration)
- [Available Scripts](#available-scripts)
- [Project Requirements](#project-requirements)
- [Additional Features](#additional-features)
- [Contributing](#contributing)

---

## 🎯 Overview

TaskTeam is a client-side Angular application that works with a Node.js backend server. The system allows users to:

- Create and manage teams
- Organize projects within teams
- Track tasks with priorities and statuses
- Collaborate through comments
- Visualize team and project analytics

---

## ✨ Features

### Core Functionality

1. **Authentication**
   - User registration and login
   - JWT-based secure authentication
   - Protected routes with authentication guards

2. **Team Management**
   - View all user teams
   - Create new teams
   - View team members and statistics

3. **Project Management**
   - List projects by team
   - Create new projects
   - Track project progress

4. **Task Board**
   - Kanban-style task board with columns: Backlog, In Progress, Done
   - Create, update, and delete tasks
   - Priority levels: High, Medium, Low
   - Drag-and-drop task management
   - Task filtering and search

5. **Comments**
   - View task comments
   - Add new comments to tasks
   - Real-time collaboration

### UI/UX Features

- **Angular Material Design** - Consistent, professional UI components
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Custom Branding** - TaskTeam logo and custom "Ploni" font family

---

## 🛠 Technology Stack

### Frontend
- **Angular 20+** - Latest features with Standalone Components
- **Angular Material** - UI component library
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Angular Signals** - Modern state management

### Modern Angular Features Used
- ✅ Standalone Components (No NgModules)
- ✅ Control Flow Syntax (`@if`, `@for`, `@switch`)
- ✅ Signals for reactive state management
- ✅ `inject()` function for dependency injection
- ✅ Strongly-typed forms
- ✅ HTTP Interceptors for JWT authentication

---

## 📦 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git** (for cloning repositories)
- **Angular CLI** (v21 or higher): `npm install -g @angular/cli`

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-manager-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
ng serve
```

The application will be available at `http://localhost:4200/`

---

## 🔧 Backend Setup

This Angular app requires the Node.js backend server to function properly.

### 1. Clone the Backend Repository

```bash
git clone https://github.com/rivkamos/WolfTasksServer.git
cd WolfTasksServer
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 4. Database

The backend uses SQLite with a local file (`./data.sqlite`). No additional database setup is required.

**Optional:** Seed the database with demo data:

```bash
npm run seed
```

Demo users:
- Email: `alice@example.com` / Password: `Password1!`
- Email: `bob@example.com` / Password: `Password1!`

---

## 📁 Application Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── guards/             # Route guards (authGuard)
│   │   ├── interceptors/       # HTTP interceptors (auth, error)
│   │   └── services/           # Core services
│   ├── features/               # Feature modules
│   │   ├── auth/              # Login & Registration
│   │   ├── teams/             # Team management
│   │   ├── projects/          # Project management
│   │   ├── projects/          # Project management
│   │   ├── tasks/             # Task board
│   │   └── comments/          # Task comments
│   ├── shared/                # Shared components & utilities
│   └── app.routes.ts          # Route definitions
├── assets/                    # Static assets (images, fonts)
├── styles.css                 # Global styles
└── index.html                 # Entry HTML file
```

---

## 🔌 API Integration

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require the JWT token in the request header:
```
Authorization: Bearer <token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Teams (Protected)
- `GET /api/teams` - Get user teams
- `POST /api/teams` - Create new team
- `POST /api/teams/:teamId/members` - Add team member

#### Projects (Protected)
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project

#### Tasks (Protected)
- `GET /api/tasks?projectId=<id>` - Get tasks by project
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Comments (Protected)
- `GET /api/comments?taskId=<id>` - Get task comments
- `POST /api/comments` - Create new comment

### API Documentation
For detailed API documentation with request/response examples, see:
- `WolfTasksServer/docs/API.md`
- Postman Collection: `WolfTasksServer/postman/TeamTasksAPI.postman_collection.json`

---

## 📜 Available Scripts

### Development
```bash
ng serve              # Start dev server (http://localhost:4200)
ng serve --open       # Start and open browser automatically
```

### Build
```bash
ng build              # Production build (outputs to dist/)
ng build --configuration development  # Development build
```

### Testing
```bash
ng test               # Run unit tests with Vitest
```

### Code Generation
```bash
ng generate component <name>     # Generate new component
ng generate service <name>       # Generate new service
ng generate guard <name>         # Generate new guard
```

---

## 📝 Project Requirements

This project was developed according to the following course requirements:

### Must-Have Features
1. ✅ Login/Registration with JWT authentication
2. ✅ Team listing and creation
3. ✅ Project management per team
4. ✅ Task board with CRUD operations
5. ✅ Comment system for tasks
6. ✅ Loading, empty, and error states
7. ✅ HTTP error handling (401, 403, 404, 500)

### Technical Requirements
1. ✅ Angular 20+ with Standalone Components
2. ✅ Angular Material for UI
3. ✅ Strongly-typed forms
4. ✅ Modern control flow (`@if`, `@for`, `@switch`)
5. ✅ Signal-based state management
6. ✅ JWT interceptor for authentication
7. ✅ Route guards for protected pages
8. ✅ Responsive design

### UI/UX Requirements
1. ✅ Professional, clean interface
2. ✅ Task board (Kanban-style layout)
3. ✅ Priority badges (High, Medium, Low)
4. ✅ Toast notifications for success/error
5. ✅ Custom logo and branding

---

## 🎨 Additional Features
## 🎨 Additional Features

Beyond the core requirements, this project includes:

1. **Enhanced Task Management**
   - Drag-and-drop task organization
   - Status-based columns (Backlog, In Progress, Done)
   - Quick task filtering
   - Task search functionality

2. **Custom Branding**
   - TaskTeam logo integration
   - Custom "Ploni" Hebrew font family
   - Consistent color scheme
   - Professional Material Design theme

3. **Advanced UX**tions and animations
   - Loading skeletons
   - Empty state illustrations
   - Contextual error messages
   - Confirmation dialogs for destructive actions

---

## 👥 Contributing

This is a student project developed as part of an Angular 20 development course.

### Development Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Keep components focused and reusable
- Add comments for complex logic

---

## 📄 License

This project is developed for educational purposes.

---

## 📞 Support

For questions or issues:
- Check the backend API documentation: `WolfTasksServer/docs/API.md`
- Review the client guidelines: `WolfTasksServer/docs/Client-Guidelines.md`
- Consult the Postman collection for API examples

---

**Developed with ❤️ using Angular 20 by Chani Daniel 10ch5086@gmail.com**
