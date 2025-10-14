# Project Overview

This is a desktop application for managing policies, built with Electron, Node.js, Express, and SQLite. The application allows users to add, view, and filter insurance policies.

## Technologies Used

*   **Electron:** For building the cross-platform desktop application.
*   **Node.js:** As the runtime environment for the backend.
*   **Express:** As the web framework for creating the API.
*   **SQLite:** As the database for storing policy data.
*   **HTML/CSS/JavaScript:** For the user interface.

## Architecture

The application consists of two main parts:

1.  **Electron Main Process (`main.js`):** This is the entry point of the application. It creates the main browser window and starts the Express server.
2.  **Express Server (`app.js`):** This server runs in the background and provides a RESTful API for the frontend to interact with the database. It also serves the HTML, CSS, and JavaScript files for the UI.

The frontend and backend communicate via HTTP requests. The frontend sends requests to the Express API to perform CRUD (Create, Read, Update, Delete) operations on the policy data stored in the SQLite database.

# Building and Running

## Prerequisites

*   Node.js and npm installed.
*   Docker (for building the Windows version).

## Development

To run the application in development mode, you can use the following command:

```bash
npm start
```

This will start the Express server and open the Electron window.

## Building for Production

To build the application for production, you can use the following commands:

*   **For the current platform:**

    ```bash
    npm run build
    ```

*   **For Windows (using Docker):**

    ```bash
    npm run build:windows
    ```

# Development Conventions

## Code Style

The project does not have a strict code style guide. However, it is recommended to follow the standard JavaScript conventions.

## Testing

There are no tests in the project. It is recommended to add a testing framework like Jest or Mocha to ensure the quality of the code.

## Database

The project uses `better-sqlite3` to interact with the SQLite database. The database schema is defined in `database.js`. The database file is `policy_manager.db`.
