import { motion } from 'framer-motion';
import styles from './EvidenceGrid.module.css';

export default function EvidenceGrid({ originalSrc, heatmapSrc, hasImage }) {
  if (!hasImage) return null;

  return (
    <div className={styles.grid}>
      {/* Original */}
      <motion.div
        className={styles.panel}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.panelHeader}>
          <span className={styles.tag}>EXHIBIT A — ORIGINAL</span>
          <span className={styles.ts}>{new Date().toLocaleTimeString()}</span>
        </div>
        <div className={styles.imgWrap}>
          {originalSrc
            ? <img src={originalSrc} alt="Original" className={styles.img} />
            : <div className={styles.placeholder}>NO IMAGE</div>
          }
          <div className={styles.corner} data-pos="tl" />
          <div className={styles.corner} data-pos="tr" />
          <div className={styles.corner} data-pos="bl" />
          <div className={styles.corner} data-pos="br" />
        </div>
      </motion.div>

      {/* Heatmap */}
      <motion.div
        className={`${styles.panel} ${styles.heatPanel}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className={styles.panelHeader}>
          <span className={`${styles.tag} ${styles.tagHeat}`}>EXHIBIT B — GRAD-CAM HEATMAP</span>
          <span className={styles.ts}>XAI OUTPUT</span>
        </div>
        <div className={styles.imgWrap}>
          {heatmapSrc
            ? <img src={heatmapSrc} alt="Heatmap" className={styles.img} />
            : <div className={styles.placeholder}>NO HEATMAP</div>
          }
          {/* scan sweep */}
          <div className={styles.scanSweep} />
          <div className={styles.corner} data-pos="tl" />
          <div className={styles.corner} data-pos="tr" />
          <div className={styles.corner} data-pos="bl" />
          <div className={styles.corner} data-pos="br" />
        </div>
        <div className={styles.legend}>
          <span className={styles.legItem}><span className={`${styles.lc} ${styles.cool}`} />LOW</span>
          <span className={styles.legItem}><span className={`${styles.lc} ${styles.warm}`} />MED</span>
          <span className={styles.legItem}><span className={`${styles.lc} ${styles.hot}`}  />HIGH</span>
        </div>
      </motion.div>
    </div>
  );
}
