import { motion } from 'framer-motion';
import styles from './MetricsRow.module.css';

function ConfidenceRing({ pct }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? '#00f5c8' : pct >= 40 ? '#f5a623' : '#ff2d55';

  return (
    <div className={styles.ringWrap}>
      <svg className={styles.ring} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6"/>
        <motion.circle
          cx="40" cy="40" r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className={styles.ringCenter} style={{ color }}>{pct}%</div>
    </div>
  );
}

function MiniBar({ pct, isFake }) {
  const color = isFake ? '#ff2d55' : '#22ff7a';
  return (
    <div className={styles.miniBarOuter}>
      <motion.div
        className={styles.miniBarFill}
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function MetricsRow({ imageDetails, textDetails, overallConf }) {
  const confPct = parseFloat(overallConf) || 0;
  const imgPct  = imageDetails ? Math.round(imageDetails.confidence * 100) : null;
  const txtPct  = textDetails  ? Math.round(textDetails.confidence  * 100) : null;
  const imgFake = imageDetails?.class?.toLowerCase().includes('fake');
  const txtFake = textDetails?.class?.toLowerCase().includes('fake');

  return (
    <div className={styles.row}>
      {/* Image metric */}
      <motion.div
        className={styles.block}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
      >
        <div className={styles.blockLabel}>
          <span className={`${styles.dot} ${styles.visionDot}`}/>
          IMAGE ANALYSIS
        </div>
        {imageDetails ? (
          <>
            <div className={`${styles.result} ${imgFake ? styles.fake : styles.real}`}>
              {imageDetails.class}
            </div>
            <MiniBar pct={imgPct} isFake={imgFake} />
            <div className={styles.pct}>{imgPct}%</div>
          </>
        ) : <div className={styles.na}>NOT ANALYZED</div>}
      </motion.div>

      {/* Text metric */}
      <motion.div
        className={styles.block}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
      >
        <div className={styles.blockLabel}>
          <span className={`${styles.dot} ${styles.textDot}`}/>
          TEXT ANALYSIS
        </div>
        {textDetails ? (
          <>
            <div className={`${styles.result} ${txtFake ? styles.fake : styles.real}`}>
              {textDetails.class}
            </div>
            <MiniBar pct={txtPct} isFake={txtFake} />
            <div className={styles.pct}>{txtPct}%</div>
          </>
        ) : <div className={styles.na}>NOT ANALYZED</div>}
      </motion.div>

      {/* Fusion ring */}
      <motion.div
        className={`${styles.block} ${styles.fusionBlock}`}
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
      >
        <div className={styles.blockLabel}>
          <span className={`${styles.dot} ${styles.fusionDot}`}/>
          FUSION SCORE
        </div>
        <ConfidenceRing pct={confPct} />
      </motion.div>
    </div>
  );
}
