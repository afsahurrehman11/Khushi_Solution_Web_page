@echo off
:: Khushi Solutions Development Launcher
:: Starts backend (FastAPI) and frontend (Next.js) in separate terminals

echo Starting Khushi Solutions Development Environment...
echo WARNING: MongoDB must be running as a replica set (rs0) for transactions!

:: Check if Windows Terminal (wt) is available
where wt >nul 2>&1
if %errorlevel% == 0 (
    :: Open Windows Terminal with two tabs
    wt --title "KS Backend" cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else echo [WARN] No .venv found, using system Python) && echo Starting FastAPI backend... && python run.py" ; new-tab --title "KS Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Next.js frontend... && npm run dev"
) else (
    :: Fallback: open two separate cmd windows
    start "KS Backend" cmd /k "cd /d %~dp0backend && (if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else echo [WARN] No .venv found, using system Python) && echo Starting FastAPI backend... && python run.py"
    start "KS Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Next.js frontend... && npm run dev"
)

echo Both terminals launched.
