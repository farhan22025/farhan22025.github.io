@echo off
echo ==========================================
echo   DeepTrace — MERN Deepfake Platform
echo ==========================================
echo.

set VENV_DIR=venv
set PYTHON312="C:\Users\DSLAB\AppData\Local\Programs\Python\Python312\python.exe"
set ROOT=%~dp0

REM ── STEP 1: Python venv ────────────────────────────────
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [INFO] Creating Python 3.12 virtual environment...
    %PYTHON312% -m venv %VENV_DIR%
    if errorlevel 1 (
        echo [ERROR] Failed to create venv. Ensure Python 3.12 is installed.
        pause & exit /b 1
    )
)

echo [INFO] Activating Python environment...
call "%VENV_DIR%\Scripts\activate.bat"

echo [INFO] Verifying PyTorch CUDA...
python -c "import torch; assert torch.cuda.is_available()" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing PyTorch 2.5.1+cu121...
    python -m pip install --upgrade pip --quiet
    pip install torch==2.5.1+cu121 torchvision==0.20.1+cu121 torchaudio==2.5.1+cu121 --index-url https://download.pytorch.org/whl/cu121
)

echo [INFO] Installing Python dependencies...
pip install -r requirements.txt --quiet

REM ── STEP 2: Node backend deps ──────────────────────────
echo [INFO] Checking Node.js backend dependencies...
if not exist "%ROOT%backend\node_modules" (
    echo [INFO] Installing backend npm packages...
    cd /d "%ROOT%backend"
    npm install --silent
    cd /d "%ROOT%"
)

REM ── STEP 3: React frontend deps ────────────────────────
echo [INFO] Checking React frontend dependencies...
if not exist "%ROOT%frontend\node_modules" (
    echo [INFO] Installing frontend npm packages...
    cd /d "%ROOT%frontend"
    npm install --silent
    cd /d "%ROOT%"
)

echo.
echo ==========================================
echo   Launching All Services
echo ==========================================
echo   [1] FastAPI ML Engine  →  http://localhost:8000
echo   [2] Express Proxy      →  http://localhost:3001
echo   [3] React Frontend     →  http://localhost:5173
echo ==========================================
echo.

REM Launch FastAPI in this window (it blocks so we open others first)
REM Launch Express backend in a new window
start "DeepTrace — Express Proxy" cmd /k "cd /d "%ROOT%backend" && node server.js"

REM Launch React dev server in a new window
start "DeepTrace — React Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo [INFO] Express and React windows opened.
echo [INFO] Starting FastAPI inference engine (this window)...
echo [INFO] Open http://localhost:5173 in your browser.
echo.

REM FastAPI runs in this window
python app.py

pause
