# AI Task Priority

This project is a task management application that uses Google's Gemini AI to prioritize tasks based on urgency, workload, and due dates.

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Google Gemini API Key

## Setup

1.  **Install Dependencies**:
    Run the setup script to install dependencies for both client and server:

    ```bash
    chmod +x setup.sh
    ./setup.sh
    ```

2.  **Database Setup**:

    - Ensure you have PostgreSQL running.
    - Create a database (e.g., `taskdb`).
    - The application will automatically create the `tasks` table on startup.

3.  **Environment Variables**:
    - **Server**:
      - Copy `server/.env.example` to `server/.env`.
      - Update `DATABASE_URL` with your PostgreSQL connection string.
      - Update `GEMINI_API_KEY` with your API key.
    - **Client**:
      - (Optional) Copy `client/.env.example` to `client/.env`.

## Running the Application

1.  **Start the Server**:
    Open a terminal and run:

    ```bash
    cd server
    npm run dev
    ```

    The server will start on `http://localhost:4000`.

2.  **Start the Client**:
    Open another terminal and run:

    ```bash
    cd client
    npm run dev
    ```

    The client will start on `http://localhost:3000`.

3.  **Open in Browser**:
    Navigate to `http://localhost:3000` to use the application.

## Features

- **Add Tasks**: Create tasks with title, description, due date, urgency, and workload.
- **AI Ranking**: Click "Rank Tasks with AI" to have Gemini analyze and prioritize your tasks.
- **Fallback Ranking**: If AI is unavailable, a rule-based algorithm is used.
# AI-Task-Priority
