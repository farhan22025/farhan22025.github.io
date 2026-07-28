import { motion } from 'framer-motion';
import styles from './VerdictBanner.module.css';

export default function VerdictBanner({ prediction, confidence }) {
  const isFake = prediction?.includes('FAKE') || prediction?.includes('Fake');
  const isReal = prediction?.includes('REAL') || prediction?.includes('Real');

  return (
    <motion.div
      className={`${styles.banner} ${isFake ? styles.fake : isReal ? styles.real : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated bg sweep */}
      <div className={styles.bgSweep} />

      {/* Left: label + verdict */}
      <div className={styles.left}>
        <div className={styles.label}>
          <span className={styles.labelDot} />
          FORENSIC VERDICT
        </div>
        <div className={`${styles.verdict} ${isFake ? styles.verdictFake : isReal ? styles.verdictReal : ''}`}>
          {prediction ?? '—'}
        </div>
      </div>

      {/* Center icon */}
      <div className={styles.iconWrap}>
        {isFake && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, delay: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="52" height="52">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </motion.div>
        )}
        {isReal && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, delay: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="52" height="52">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </motion.div>
        )}
      </div>

      {/* Right: confidence */}
      <div className={styles.right}>
        <div className={styles.label}>CONFIDENCE SCORE</div>
        <div className={`${styles.conf} ${isFake ? styles.confFake : isReal ? styles.confReal : ''}`}>
          {confidence ?? '—'}
        </div>
      </div>

      {/* Corner brackets */}
      <span className={`${styles.c} ${styles.ctlo}`} />
      <span className={`${styles.c} ${styles.ctro}`} />
      <span className={`${styles.c} ${styles.cblo}`} />
      <span className={`${styles.c} ${styles.cbro}`} />
    </motion.div>
  );
}
