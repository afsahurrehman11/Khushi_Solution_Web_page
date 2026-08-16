# Khushi Solution Web Portal

A premium and dynamic web portal for discovering and registering for high-quality software products like Delivery Management Systems and ERP Solutions. It features a modern, responsive React frontend (Vite/TypeScript) and a robust FastAPI (Python) backend connected to MongoDB.

## Tech Stack
*   **Frontend**: React (Vite, TypeScript), TailwindCSS, Framer Motion, Lucide React
*   **Backend**: FastAPI, Pydantic, Motor (Async MongoDB)
*   **Database**: MongoDB

## 🚀 Running Locally (Development)

We have provided a unified script to launch both the frontend and backend simultaneously on Windows.

1.  Make sure you have Node.js (v18+) and Python (v3.10+) installed.
2.  Make sure MongoDB is running locally on port 27017 (or update `MONGODB_URI` in `backend/.env`).
3.  Double click the `start.bat` file in the root directory, or run it via terminal:
    ```cmd
    .\start.bat
    ```

*   **Frontend**: http://localhost:5173
*   **Backend API Docs**: http://localhost:8000/docs

## 🌍 Running on Server (Production)

For deploying to a production server (e.g., Linux/Ubuntu VPS), you will typically use `pm2` for Node.js (frontend) and `gunicorn` with `uvicorn` for the Python backend. Alternatively, you can use Docker.

### 1. Backend (FastAPI)
Navigate to the `backend` directory, install dependencies, and run via Uvicorn/Gunicorn:
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run with Uvicorn (Background/Production mode using a process manager like systemd or pm2)
pm2 start "uvicorn run:app --host 0.0.0.0 --port 8000" --name "ks-backend"
```

### 2. Frontend (React/Vite)
Navigate to the `frontend` directory, build the static files, and serve them:
```bash
cd frontend
npm install
npm run build

# Serve the 'dist' folder using a static web server like Nginx, or via serve/pm2:
npm install -g serve
pm2 start "serve -s dist -l 5173" --name "ks-frontend"
```

### Alternative: Nginx Configuration for Frontend
Copy the built files to your web root and configure Nginx:
```bash
sudo cp -r frontend/dist/* /var/www/html/
# (Make sure Nginx is configured to point to /var/www/html)
```
