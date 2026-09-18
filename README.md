# FreeProjectAPI Sandbox Project Dashboard

A frontend-focused sandbox dashboard built with **HTML, CSS, and JavaScript**, using the public **FreeProjectAPI** as a backend API source.

The project is designed to practice and demonstrate frontend development skills, with a particular focus on **JavaScript, API integration, modular architecture, SPA routing, reusable components, and responsive UI development**.

> 🚧 **Status:** Work in Progress  
> The **Goal Tracker** is currently the completed and functional project. Additional sandbox projects will be developed progressively.

## 🌐 Live Demo

<a href="https://sachintha-madubashana.github.io/FreeProjectAPI-Sandbox-Project-Dashboard/" target="_blank" rel="noopener noreferrer">Visit the Live Application</a>

## 📖 Overview

The FreeProjectAPI Sandbox Project Dashboard is a collection of frontend applications built around the public APIs provided by FreeProjectAPI.

Instead of building one large application, this project provides a central dashboard where different application ideas can be developed and experimented with over time.

The home page displays the available sandbox projects and their current status.

Currently, **Goal Tracker** is the active project, while the other projects are planned for future development.

## ✨ Features

### Project Dashboard

- Overview of planned sandbox applications
- Project availability/status indicators
- Centralized navigation
- Dynamic breadcrumbs

### Goal Tracker

The currently completed application includes:

- Goal Tracker Dashboard
- Goals management
- Task management
- Reminders
- Productivity statistics
- Task completion chart
- Recent activity
- API-driven data

### Application Features

- Custom Single Page Application (SPA) routing
- Reusable JavaScript components
- Light and dark mode
- Responsive dashboard interface
- Fetch API integration
- Local Storage
- Toast notifications
- Admin Mode UI simulation

> **Note:** Admin Mode is only a frontend UI simulation. It is intended for projects that require different user/admin interfaces and does not provide real authentication or authorization.

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (ES Modules)
- Vite
- Tailwind CSS
- Basecoat CSS
- Lucide Icons
- Chart.js
- Fetch API
- Local Storage
- FreeProjectAPI
- GitHub Actions
- GitHub Pages

## 🏗️ Project Structure

```text
FreeProjectAPI-Sandbox-Project-Dashboard/
│
├── public/
│
├── src/
│   ├── assets/
│   │   └── data.json
│   │
│   ├── components/
│   │   ├── headers/
│   │   ├── sidebar/
│   │   ├── cards/
│   │   ├── dialogs/
│   │   └── ...
│   │
│   ├── pages/
│   │   └── goalTracker/
│   │
│   ├── router/
│   │
│   ├── styles/
│   │
│   ├── utils/
│   │   ├── loadAndRenderIcon.js
│   │   ├── requestHandler.js
│   │   ├── toastSystem.js
│   │   └── ...
│   │
│   └── main.js
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

The project is organized into reusable **components, pages, routing, styles, and utility modules** to keep the application maintainable as more sandbox projects are added.

## 🔌 API Integration

The project uses **FreeProjectAPI** as its public backend API.

The current Goal Tracker application uses the API for:

- Goals
- Tasks
- Reminders

The frontend communicates with the API to retrieve and manage application data through CRUD operations.

API requests are handled using the browser's native **Fetch API**, with common request functionality organized in a reusable request handler.

### API Documentation

<a href="https://www.freeprojectapi.com/api.html" target="_blank" rel="noopener noreferrer">FreeProjectAPI Documentation</a>

No API key is currently required.

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a>
- npm
- A modern web browser
- An internet connection for API requests

### Installation

Clone the repository:

```bash
gh repo clone sachintha-madubashana/FreeProjectAPI-Sandbox-Project-Dashboard
```

Navigate to the project:

```bash
cd FreeProjectAPI-Sandbox-Project-Dashboard
```

Install dependencies:

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

### Build for Production

```bash
npm run build
```

### Preview the Production Build

```bash
npm run preview
```

## 📸 Screenshots

### Project Dashboard — Dark Mode

![Project Dashboard - Dark Mode](docs/screenshots/home-dark.png)

### Project Dashboard — Light Mode

![Project Dashboard - Light Mode](docs/screenshots/home-light.png)

### Goal Tracker Dashboard

![Goal Tracker Dashboard](docs/screenshots/goal-tracker-dashboard.png)

## 📊 Project Status

| Project         | Status         |
| --------------- | -------------- |
| Goal Tracker    | 🟢 Active      |
| Bank Loan       | 🔴 Unavailable |
| Bus Booking     | 🔴 Unavailable |
| College Project | 🔴 Unavailable |
| Competition     | 🔴 Unavailable |
| Ecommerce       | 🔴 Unavailable |
| Employee App    | 🔴 Unavailable |
| Enquiry         | 🔴 Unavailable |
| Fees Tracking   | 🔴 Unavailable |
| Leave Tracker   | 🔴 Unavailable |
| Onboarding      | 🔴 Unavailable |
| Smart Parking   | 🔴 Unavailable |
| Survey          | 🔴 Unavailable |
| User App        | 🔴 Unavailable |

The unavailable projects are planned applications that will be implemented progressively.

## 🎯 Learning & Development Goals

This project is being developed as a combination of:

- Academic project
- Learning project
- Practice project
- Portfolio project

It provides practical experience with:

- JavaScript and ES Modules
- REST API integration
- Asynchronous programming
- SPA routing
- Reusable components
- DOM manipulation
- Client-side state management
- Responsive UI development
- Light/dark themes
- Data visualization
- GitHub Actions and GitHub Pages

## 🔮 Future Plans

- Implement additional sandbox projects
- Expand API integrations
- Add appropriate Admin Mode interfaces
- Improve responsive/mobile layouts
- Add more reusable components
- Improve accessibility
- Add additional data visualizations
- Continue improving the SPA architecture

## ⚠️ Project Scope

This is primarily a **frontend sandbox project**.

The backend functionality is provided by the public FreeProjectAPI service. Therefore, API availability and behavior depend on the external service.

The project is intended for **learning, experimentation, academic work, and portfolio demonstration**, rather than production use.

## 🙏 Acknowledgements

This project uses <a href="https://www.freeprojectapi.com/api.html" target="_blank" rel="noopener noreferrer">FreeProjectAPI</a> as its public API source for the sandbox applications.

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sachintha Madubashana**

Frontend development and JavaScript projects.
