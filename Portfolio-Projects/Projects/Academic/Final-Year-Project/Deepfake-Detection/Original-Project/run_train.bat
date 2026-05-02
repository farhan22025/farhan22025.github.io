@echo off
echo ==========================================
echo Deepfake Detection Engine - Trainer
echo ==========================================
echo.

set VENV_DIR=venv

REM Check if virtual environment exists
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [INFO] Environment not found. Creating dedicated Python Virtual Environment...
    "C:\Users\DSLAB\AppData\Local\Programs\Python\Python312\python.exe" -m venv %VENV_DIR%
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment! Ensure Python is installed.
        pause
        exit /b 1
    )
    echo [INFO] Virtual Environment created successfully!
    
    echo [INFO] Activating environment and installing ALL dependencies...
    call "%VENV_DIR%\Scripts\activate.bat"
    python -m pip install --upgrade pip
    pip install -r requirements.txt
) else (
    echo [INFO] Environment found. Activating...
    call "%VENV_DIR%\Scripts\activate.bat"
)
echo ==========================================
echo Initializing Training Protocol...
echo ==========================================
echo.

REM Launch the training script
python train.py

pause
