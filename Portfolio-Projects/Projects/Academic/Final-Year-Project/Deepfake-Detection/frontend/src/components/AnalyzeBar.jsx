import styles from './AnalyzeBar.module.css';

export default function AnalyzeBar({ hasImage, hasText, onAnalyze, disabled }) {
  const mode =
    hasImage && hasText ? 'MULTIMODAL — IMAGE + TEXT' :
    hasImage            ? 'VISUAL FORENSICS ONLY' :
    hasText             ? 'DOCUMENT LINGUISTICS ONLY' :
                          'AWAITING EVIDENCE INPUT';

  const ready = hasImage || hasText;

  return (
    <div className={styles.bar}>
      <div className={styles.modeBlock}>
        <span className={styles.modeLabel}>ANALYSIS MODE</span>
        <span className={`${styles.modeValue} ${ready ? styles.modeReady : ''}`}>{mode}</span>
      </div>

      <button
        className={`${styles.scanBtn} ${ready ? styles.scanReady : ''}`}
        type="button"
        onClick={onAnalyze}
        disabled={disabled || !ready}
        id="analyze-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
        INITIATE SCAN
      </button>
    </div>
  );
}
