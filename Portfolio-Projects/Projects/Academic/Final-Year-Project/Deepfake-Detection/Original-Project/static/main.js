const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const textInput = document.getElementById('text-input');
const analyzeBtn = document.getElementById('analyze-btn');

const resultsPanel = document.getElementById('results-panel');
const loader = document.getElementById('loader');
const resetBtn = document.getElementById('reset-btn');

let currentFile = null;

// Image Elements
const originalPreview = document.getElementById('original-preview');
const heatmapPreview = document.getElementById('heatmap-preview');
const scanLine = document.querySelector('.scan-line');

// Dashboard Elements
const predictionText = document.getElementById('prediction-text');
const confidenceBar = document.getElementById('confidence-bar');
const confidenceText = document.getElementById('confidence-text');
const notesList = document.getElementById('notes-list');

// Event Listeners for Drag & Drop
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

resetBtn.addEventListener('click', () => {
    resultsPanel.classList.add('hidden');
    dropZone.classList.remove('hidden');
    fileInput.value = '';
    textInput.value = '';
    currentFile = null;
    originalPreview.src = '';
    heatmapPreview.src = '';
});

analyzeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent dropzone click
    if (!currentFile && !textInput.value.trim()) {
        alert("Please provide a Certificate/Image or deepfake Tech text to analyze!");
        return;
    }
    executeMultimodalAnalysis(currentFile, textInput.value.trim());
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file within the accepted datasets formats.');
        return;
    }

    currentFile = file; // Assign to global variable

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        heatmapPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
    // DO NOT auto-upload, wait for user to hit Analyze in case they want to paste text
    document.querySelector('.upload-content h2').textContent = file.name;
    document.querySelector('.upload-content p').textContent = "Ready for Multimodal Analysis";
}

async function executeMultimodalAnalysis(file, textData) {
    // UI State Prep
    dropZone.classList.add('hidden');
    resultsPanel.classList.remove('hidden');
    loader.classList.remove('hidden');
    scanLine.style.display = 'block';

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (textData) formData.append('text_content', textData);

    try {
        const response = await fetch('/api/detect', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        
        if (data.status === 'success') {
            updateDashboard(data);
        } else {
            alert('Error processing image: ' + data.message);
            resetBtn.click();
        }

    } catch (error) {
        console.error(error);
        alert('Failed to connect to Neural Engine API. Is the server running?');
        resetBtn.click();
    } finally {
        loader.classList.add('hidden');
        setTimeout(() => { scanLine.style.display = 'none'; }, 1000);
    }
}

function updateDashboard(data) {
    // Set Heatmap if image was provided, else hide/placeholder
    if (data.heatmap_image) {
        heatmapPreview.src = data.heatmap_image;
    } else {
        heatmapPreview.src = "";
        originalPreview.src = "https://via.placeholder.com/400x300/1F212A/A4B0BE?text=Text+Only+Analysis";
    }

    // Set Prediction Badge
    predictionText.textContent = data.prediction.toUpperCase();
    if (data.prediction.includes("Fake")) {
        predictionText.className = 'status-badge alert';
        predictionText.style.color = 'var(--danger)';
        predictionText.style.textShadow = '0 0 10px rgba(255, 71, 87, 0.4)';
    } else {
        predictionText.className = 'status-badge safe';
        predictionText.style.color = 'var(--success)';
        predictionText.style.textShadow = '0 0 10px rgba(46, 213, 115, 0.4)';
    }

    // Set Confidence
    confidenceText.textContent = data.confidence;
    confidenceBar.style.width = data.confidence;
    if(parseFloat(data.confidence) < 50) {
        confidenceBar.style.background = 'var(--danger)';
    } else {
        confidenceBar.style.background = 'linear-gradient(90deg, var(--primary), var(--secondary))';
    }

    // Populate Educational Notes
    notesList.innerHTML = '';
    data.notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        notesList.appendChild(li);
    });
}
