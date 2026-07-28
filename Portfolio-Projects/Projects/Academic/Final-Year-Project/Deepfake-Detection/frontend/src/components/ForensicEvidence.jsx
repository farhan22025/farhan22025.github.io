import { motion } from 'framer-motion';
import styles from './ForensicEvidence.module.css';

const FAKE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const REAL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function ForensicEvidence({ prediction, reasons = [] }) {
  const isFake = prediction?.includes('FAKE') || prediction?.includes('Fake');

  if (!reasons.length) return null;

  return (
    <motion.div
      className={`${styles.card} ${isFake ? styles.cardFake : styles.cardReal}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      {/* Header label bar */}
      <div className={`${styles.labelBar} ${isFake ? styles.labelBarFake : styles.labelBarReal}`}>
        <div className={styles.labelLeft}>
          <div className={`${styles.labelIcon} ${isFake ? styles.iconFake : styles.iconReal}`}>
            {isFake ? FAKE_ICON : REAL_ICON}
          </div>
          <span className={styles.labelTitle}>
            {isFake ? 'PROOF OF MANIPULATION' : 'PROOF OF AUTHENTICITY'}
          </span>
        </div>
        <div className={`${styles.badge} ${isFake ? styles.badgeFake : styles.badgeReal}`}>
          {isFake ? 'EVIDENCE: FORGERY DETECTED' : 'EVIDENCE: AUTHENTIC CONTENT'}
        </div>
      </div>

      {/* Separator line */}
      <div className={`${styles.divider} ${isFake ? styles.dividerFake : styles.dividerReal}`} />

      {/* Bullet points */}
      <ul className={styles.bullets}>
        {reasons.map((reason, i) => (
          <motion.li
            key={i}
            className={`${styles.bullet} ${isFake ? styles.bulletFake : styles.bulletReal}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <span className={`${styles.dot} ${isFake ? styles.dotFake : styles.dotReal}`} />
            {reason}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
