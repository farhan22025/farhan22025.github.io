import styles from './Loader.module.css';

const LINES = [
  'Initializing neural inference engine...',
  'Loading EfficientNetV2-S feature extractor...',
  'Applying Grad-CAM attention mapping...',
  'Running DistilRoBERTa semantic analysis...',
  'Performing fusion verdict computation...',
];

export default function Loader() {
  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.ringOuter} />
        <div className={styles.ringInner} />
        <div className={styles.iconCenter}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#00f5c8" strokeWidth="1.5" width="28" height="28">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>
      <div className={styles.label}>ANALYZING EVIDENCE</div>
      <div className={styles.lines}>
        {LINES.map((l, i) => (
          <div key={i} className={styles.line} style={{ animationDelay: `${i * 0.5}s` }}>
            <span className={styles.arrow}>&gt;</span> {l}
          </div>
        ))}
      </div>
    </div>
  );
}
