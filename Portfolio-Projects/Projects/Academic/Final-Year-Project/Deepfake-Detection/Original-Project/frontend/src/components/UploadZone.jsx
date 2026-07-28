import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './UploadZone.module.css';

export default function UploadZone({ onFile, currentFile, onClear }) {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    // Allow drag-and-drop always; only disable click-to-open when preview shown
    noClick: !!currentFile,
    noDrag: false,
  });

  return (
    <div className={styles.card}>
      {/* Card header */}
      <div className={styles.cardHead}>
        <div className={styles.headLeft}>
          <div className={`${styles.channelIcon} ${styles.visionIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div>
            <div className={styles.cardTitle}>VISUAL FORENSICS</div>
            <div className={styles.cardSub}>GAN fingerprint & manipulation scanner</div>
          </div>
        </div>
        <div className={`${styles.badge} ${styles.visionBadge}`}>IMG</div>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`${styles.dropArea} ${isDragActive ? styles.active : ''} ${currentFile ? styles.hasFile : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input {...getInputProps()} id="file-input" />
        <div className={styles.corner} data-pos="tl" />
        <div className={styles.corner} data-pos="tr" />
        <div className={styles.corner} data-pos="bl" />
        <div className={styles.corner} data-pos="br" />

        {currentFile ? (
          <div className={styles.previewWrap}>
            {/* Drag-over hint overlay when replacing */}
            {isDragActive && (
              <div className={styles.replaceOverlay}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                <span>DROP TO REPLACE</span>
              </div>
            )}
            <img
              src={URL.createObjectURL(currentFile)}
              alt="Selected"
              className={`${styles.preview} ${isDragActive ? styles.previewDim : ''}`}
            />
            <div className={styles.previewMeta}>
              <span className={styles.fileName}>{currentFile.name}</span>
              <span className={styles.fileSize}>{(currentFile.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        ) : (
          <div className={styles.dropInner}>
            <div className={`${styles.dropIconWrap} ${isHovered || isDragActive ? styles.iconActive : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="40" height="40">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <p className={styles.dropLabel}>{isDragActive ? 'DROP EVIDENCE HERE' : 'DROP EVIDENCE IMAGE'}</p>
            <p className={styles.dropFormats}>JPEG · PNG · BMP · TIFF · WebP</p>
            <button
              className={styles.browseBtn}
              type="button"
              onClick={(e) => { e.stopPropagation(); document.getElementById('file-input').click(); }}
            >
              BROWSE FILES
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      {currentFile && (
        <button className={styles.clearBtn} type="button" onClick={onClear}>
          ✕ REMOVE IMAGE
        </button>
      )}

      {/* Dataset chips */}
      <div className={styles.chips}>
        {['CASIA2','CG-1050','CIFAKE','CoMoFoD','DETECTAIVSHUMAN'].map(c => (
          <span key={c} className={styles.chip}>{c}</span>
        ))}
      </div>
    </div>
  );
}
