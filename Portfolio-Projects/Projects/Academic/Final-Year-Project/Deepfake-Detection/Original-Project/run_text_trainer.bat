@echo off
echo ==========================================
echo Deepfake Detection Engine - TEXT Trainer
echo ==========================================
echo.

set VENV_DIR=venv

REM Check if virtual environment exists
if not exist "%VENV_DIR%\Scripts\activate.bat" (
    echo [ERROR] Environment not found. Please run run_train.bat first to create the environment.
    pause
    exit /b 1
)

REM Activate the virtual environment
echo [INFO] Activating environment...
call "%VENV_DIR%\Scripts\activate.bat"

echo.
echo ==========================================
echo Step 1: Downloading Text Datasets (if missing)
echo ==========================================
echo [INFO] This will safely skip datasets you already downloaded.
python download_text_data.py

echo.
echo ==========================================
echo Step 2: Initializing Text NLP Training...
echo ==========================================
echo.

REM Launch the text training script
python train_text.py

pause
