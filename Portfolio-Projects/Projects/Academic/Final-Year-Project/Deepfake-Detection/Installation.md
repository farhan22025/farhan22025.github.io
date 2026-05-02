# 🚀 DeepTrace: Installation & Training Guide

This guide provides step-by-step instructions on how to deploy the Multimodal Deepfake Defense Platform on any PC, as well as how to train the models from scratch.

---

## 🛑 Prerequisites (For All Methods)
Before you begin, ensure your system has the following installed:
1. **Python 3.10 or higher** (Ensure Python is added to your system `PATH`).
2. **Node.js (v18+)** (Required for the React Frontend and Express Proxy).
3. **NVIDIA GPU (Optional but Highly Recommended)**: For real-time inference and training, an NVIDIA GPU with CUDA 12.1+ is strongly recommended. 

*(Note: The system will gracefully fall back to CPU processing if no GPU is found, but inference and training will be significantly slower).*

---

## 🟢 Part 1: Running the Application (Inference Mode)

There are two ways to boot the application. The **Portable Launcher** is the fastest and completely automated.

### ⚠️ Important First Step: Download the Models
Because GitHub has a 100MB file limit, the large pre-trained `.pth` models are not included in the repository. Before running the project, you **must** obtain the models and place them in the root directory:
1. `best_deepfake_model.pth` (~243 MB)
2. `best_text_model.pth` (~985 MB)

### Method A: The Portable Launcher (Automated)
1. Double-click the **`DeepTrace_Launcher.exe`** file located in the root folder.
2. **First Boot**: The launcher will detect that it is running for the first time. It will automatically:
   - Create a Python virtual environment (`venv`).
   - Install all Python dependencies from `requirements.txt`.
   - Install all Node.js dependencies for the `backend/` and `frontend/`.
3. The launcher will safely boot up the FastAPI server, the Node.js proxy, and the React frontend in the background. 
4. The web interface will become accessible at `http://localhost:5173`.

### Method B: Manual Deployment (For Developers)
If you prefer to start the servers manually:
1. **Setup Python Environment:**
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
2. **Setup Node.js Environments:**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   cd ..
   ```
3. **Boot the Services:**
   You can either double-click the **`run_app.bat`** file to start all three servers simultaneously, or run them in three separate terminals:
   - **Terminal 1 (FastAPI):** `.\venv\Scripts\python.exe app.py`
   - **Terminal 2 (Node Proxy):** `cd backend && npm start`
   - **Terminal 3 (React UI):** `cd frontend && npm run dev`

---

## 🔴 Part 2: Training the Models from Scratch

If you wish to train the EfficientNetV2 vision model and DistilRoBERTa text model on your own hardware, follow these steps.

### Step 1: Prepare the Datasets
This project uses ~55GB of multimodal datasets.
*   **Image Datasets**: You must manually download the image datasets (CASIA2, CIFAKE, CoMoFoD, CG1050, DETECTAIVSHUMAN) and place them in a folder named `datasets/` in the root directory. Ensure they are split into `real/` and `fake/` subdirectories.
*   **Text Datasets**: You can automatically download the ~20,000 text samples via HuggingFace by running:
    ```bash
    .\venv\Scripts\python.exe download_text_data.py
    ```

### Step 2: Train the Vision Model (Deepfake Images)
To train the EfficientNetV2 model:
1. Simply double-click **`run_train.bat`** OR execute:
   ```bash
   .\venv\Scripts\python.exe train.py --epochs 25 --batch_size 32
   ```
2. The script supports auto-resume. If your PC crashes or you stop the script, running it again will ask if you want to resume from the last saved epoch!
3. Upon completion, the script will output a new `best_deepfake_model.pth`.

### Step 3: Train the NLP Model (AI Text)
To fine-tune the DistilRoBERTa model:
1. Simply double-click **`run_text_trainer.bat`** OR execute:
   ```bash
   .\venv\Scripts\python.exe train_text.py --epochs 5 --batch_size 16
   ```
2. Like the vision model, it will automatically save progress and supports resuming from interrupted epochs.
3. Upon completion, it will output a new `best_text_model.pth`.

---

## 🛠 Troubleshooting
*   **Port 8000 / 3001 In Use**: If the backend fails to start, another program might be using those ports. You can change them in `app.py` and `backend/.env`.
*   **OpenCV Missing DLLs**: If you get a `cv2` import error on Windows, ensure you have the Visual C++ Redistributable installed.
*   **CUDA Out of Memory**: If training crashes due to VRAM limits, reduce the `--batch_size` argument to `8` or `16` in the training commands.
