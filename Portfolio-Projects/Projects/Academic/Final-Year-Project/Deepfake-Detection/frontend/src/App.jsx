import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header      from './components/Header';
import UploadZone  from './components/UploadZone';
import TextZone    from './components/TextZone';
import AnalyzeBar  from './components/AnalyzeBar';
import VerdictBanner    from './components/VerdictBanner';
import ForensicEvidence from './components/ForensicEvidence';
import EvidenceGrid  from './components/EvidenceGrid';
import MetricsRow    from './components/MetricsRow';
import ForensicLog   from './components/ForensicLog';
import ScanHistory   from './components/ScanHistory';
import Loader        from './components/Loader';

import { runDetection } from './api/detect';
import styles from './App.module.css';

// state machine: 'idle' | 'scanning' | 'result'

export default function App() {
  const [phase, setPhase]           = useState('idle');
  const [imageFile, setImageFile]   = useState(null);
  const [textValue, setTextValue]   = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [isDraggingOverPage, setIsDraggingOverPage] = useState(false);
  const dragCounterRef = useRef(0);  // tracks nested drag-enter/leave

  // Original img preview URL (created once per file selection)
  const [originalSrc, setOriginalSrc] = useState('');

  const handleFile = useCallback((file) => {
    setImageFile(file);
    setOriginalSrc(URL.createObjectURL(file));
    setIsDraggingOverPage(false);
    dragCounterRef.current = 0;
  }, []);

  // Global drag-over overlay — fires when user drags anything onto the page
  useEffect(() => {
    const onDragEnter = (e) => {
      const hasFile = e.dataTransfer?.types?.includes('Files');
      if (!hasFile) return;
      dragCounterRef.current += 1;
      setIsDraggingOverPage(true);
    };
    const onDragLeave = () => {
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) setIsDraggingOverPage(false);
    };
    const onDrop = () => {
      dragCounterRef.current = 0;
      setIsDraggingOverPage(false);
    };
    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  const handleClearImage = () => {
    setImageFile(null);
    setOriginalSrc('');
  };

  const handleAnalyze = async () => {
    if (!imageFile && !textValue.trim() && !documentFile) return;
    setPhase('scanning');
    setError(null);
    try {
      const data = await runDetection(imageFile, textValue, documentFile);
      if (data.status === 'success') {
        setResult(data);
        setPhase('result');
        setHistoryKey(k => k + 1); // refresh history sidebar
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
      setPhase('idle');
    }
  };

  const handleReset = () => {
    setPhase('idle');
    setResult(null);
    setError(null);
    setImageFile(null);
    setOriginalSrc('');
    setTextValue('');
    setDocumentFile(null);
  };

  return (
    <div className={styles.app}>
      {/* Scanline overlay */}
      <div className={styles.scanlines} />

      {/* Global drag-over page overlay */}
      {isDraggingOverPage && phase === 'idle' && (
        <div className={styles.globalDragOverlay}>
          <div className={styles.globalDragBox}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="56" height="56">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className={styles.globalDragTitle}>DROP IMAGE TO SCAN</span>
            <span className={styles.globalDragSub}>JPEG · PNG · BMP · TIFF · WebP</span>
          </div>
        </div>
      )}

      <Header />

      <div className={styles.layout}>
        {/* Main content */}
        <main className={styles.main}>

          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>
              MULTIMODAL <span className={styles.accent}>DEEPFAKE</span> DETECTION
            </h1>
            <p className={styles.heroSub}>
              Forensic-grade analysis powered by EfficientNetV2 vision intelligence
              and DistilRoBERTa language verification with Grad-CAM explainability
            </p>
          </section>

          <AnimatePresence mode="wait">

            {/* ── IDLE / INPUT PHASE ── */}
            {phase === 'idle' && (
              <motion.div
                key="input"
                className={styles.inputSection}
                initial={{ opacity:0, y:20 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-20 }}
                transition={{ duration: 0.35 }}
              >
                {error && (
                  <div className={styles.errorBanner}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className={styles.inputGrid}>
                  <UploadZone
                    onFile={handleFile}
                    currentFile={imageFile}
                    onClear={handleClearImage}
                  />
                  <TextZone
                    value={textValue}
                    onChange={setTextValue}
                    documentFile={documentFile}
                    onDocumentDrop={setDocumentFile}
                    onClearDocument={() => setDocumentFile(null)}
                  />
                </div>

                <AnalyzeBar
                  hasImage={!!imageFile}
                  hasText={!!textValue.trim() || !!documentFile}
                  onAnalyze={handleAnalyze}
                  disabled={phase === 'scanning'}
                />
              </motion.div>
            )}

            {/* ── RESULT PHASE ── */}
            {phase === 'result' && result && (
              <motion.div
                key="result"
                className={styles.resultSection}
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                exit={{ opacity:0 }}
                transition={{ duration: 0.4 }}
              >
                <VerdictBanner
                  prediction={result.prediction}
                  confidence={result.confidence}
                />

                <ForensicEvidence
                  prediction={result.prediction}
                  reasons={result.reasons || []}
                />

                <EvidenceGrid
                  hasImage={!!result.heatmap_image}
                  originalSrc={originalSrc}
                  heatmapSrc={result.heatmap_image}
                />

                <MetricsRow
                  imageDetails={result.image_details}
                  textDetails={result.text_details}
                  overallConf={parseFloat(result.confidence)}
                />

                <ForensicLog notes={result.notes || []} />

                <div className={styles.actions}>
                  <button className={styles.newScanBtn} onClick={handleReset} type="button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    NEW SCAN
                  </button>
                  <span className={styles.actionHint}>Analysis complete — submit new evidence to begin another scan</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* History sidebar */}
        <ScanHistory refreshKey={historyKey} />
      </div>

      {/* Full-screen loader */}
      {phase === 'scanning' && <Loader />}

      <footer className={styles.footer}>
        <span>DeepTrace v2.1 — DS-39 Forensic Intelligence Platform</span>
        <span>EfficientNetV2-S · DistilRoBERTa · Grad-CAM XAI · MERN Stack</span>
      </footer>
    </div>
  );
}
