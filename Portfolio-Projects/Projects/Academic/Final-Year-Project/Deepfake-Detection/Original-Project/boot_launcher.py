import os
import subprocess
import sys
import time

def get_base_dir():
    if getattr(sys, 'frozen', False):
        # If the application is run as a bundle (compiled via PyInstaller)
        return os.path.dirname(sys.executable)
    return os.path.dirname(os.path.abspath(__file__))

def check_command(command, name):
    try:
        subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, shell=True, check=True)
        return True
    except subprocess.CalledProcessError:
        print(f"ERROR: {name} is not installed or not in PATH.")
        return False

def main():
    print("=====================================================")
    print("        DeepTrace Portable Defense Launcher          ")
    print("=====================================================")
    
    base_dir = get_base_dir()
    os.chdir(base_dir)
    print(f"Working Directory: {base_dir}")

    # 1. Check System Prerequisites
    if not check_command("python --version", "Python"):
        print("Please install Python 3.10+ and ensure it is added to your PATH.")
        input("Press Enter to exit...")
        sys.exit(1)
        
    if not check_command("node --version", "Node.js"):
        print("Please install Node.js and ensure it is added to your PATH.")
        input("Press Enter to exit...")
        sys.exit(1)

    # 2. Check and Create Virtual Environment
    venv_dir = os.path.join(base_dir, "venv")
    python_exe = os.path.join(venv_dir, "Scripts", "python.exe")
    pip_exe = os.path.join(venv_dir, "Scripts", "pip.exe")
    
    if not os.path.exists(venv_dir):
        print("\n[SETUP] First boot detected. Creating Python virtual environment...")
        subprocess.run("python -m venv venv", shell=True, check=True)
    else:
        print("\n[OK] Virtual environment found.")
    
    # 3. Check Python Dependencies
    req_check = os.path.join(venv_dir, ".reqs_installed")
    if not os.path.exists(req_check):
        print("\n[SETUP] Installing Python dependencies. This might take a while...")
        subprocess.run(f'"{python_exe}" -m pip install --upgrade pip', shell=True)
        try:
            subprocess.run(f'"{pip_exe}" install -r requirements.txt', shell=True, check=True)
            with open(req_check, "w") as f:
                f.write("Installed")
        except subprocess.CalledProcessError:
            print("\n[ERROR] Failed to install Python dependencies.")
            input("Press Enter to exit...")
            sys.exit(1)
    else:
        print("[OK] Python dependencies are already installed.")

    # 4. Check Backend Node Modules
    backend_dir = os.path.join(base_dir, "backend")
    if not os.path.exists(os.path.join(backend_dir, "node_modules")):
        print("\n[SETUP] Installing backend dependencies...")
        try:
            subprocess.run("npm install", cwd=backend_dir, shell=True, check=True)
        except subprocess.CalledProcessError:
            print("\n[ERROR] Failed to install Backend dependencies.")
            input("Press Enter to exit...")
            sys.exit(1)
    else:
        print("[OK] Backend dependencies are already installed.")

    # 5. Check Frontend Node Modules
    frontend_dir = os.path.join(base_dir, "frontend")
    if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
        print("\n[SETUP] Installing frontend dependencies...")
        try:
            subprocess.run("npm install", cwd=frontend_dir, shell=True, check=True)
        except subprocess.CalledProcessError:
            print("\n[ERROR] Failed to install Frontend dependencies.")
            input("Press Enter to exit...")
            sys.exit(1)
    else:
        print("[OK] Frontend dependencies are already installed.")

    # 6. Launch Application
    print("\n[LAUNCH] Starting DeepTrace Multimodal Defense Platform...")
    
    # Start FastAPI
    print("-> Starting FastAPI Backend (Port 8000)...")
    subprocess.Popen(f'start "DeepTrace FastAPI" cmd /k "{python_exe}" app.py', shell=True)
    
    # Start Express Node Proxy
    print("-> Starting Node.js Express Proxy (Port 3001)...")
    subprocess.Popen('start "DeepTrace Express Proxy" cmd /k npm start', cwd=backend_dir, shell=True)
    
    # Start React Frontend
    print("-> Starting React Frontend (Port 5173)...")
    subprocess.Popen('start "DeepTrace React UI" cmd /k npm run dev', cwd=frontend_dir, shell=True)
    
    print("\nAll services started! The interface should be available shortly.")
    print("Close this window anytime if you don't need the launcher running.")
    time.sleep(5)

if __name__ == "__main__":
    main()
