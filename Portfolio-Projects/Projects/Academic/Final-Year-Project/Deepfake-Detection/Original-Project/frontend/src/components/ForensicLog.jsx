import { motion } from 'framer-motion';
import styles from './ForensicLog.module.css';

const SESSION_ID = `#${Math.floor(Math.random() * 90000 + 10000)}`;

export default function ForensicLog({ notes = [] }) {
  return (
    <motion.div
      className={styles.log}
      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
    >
      <div className={styles.logHeader}>
        <div className={styles.logTitle}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="15" height="15">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
          FORENSIC ANALYSIS LOG
        </div>
        <span className={styles.session}>SESSION {SESSION_ID}</span>
      </div>

      <div className={styles.logBody}>
        {/* System init lines */}
        <div className={styles.sysLine}>
          <span className={styles.ts}>[{new Date().toLocaleTimeString()}]</span>
          <span className={styles.sys}>SYSTEM</span>
          <span className={styles.sysTxt}>Neural inference complete. Generating forensic report...</span>
        </div>

        {notes.map((note, i) => {
          const isImage   = note.startsWith('[IMAGE]');
          const isText    = note.startsWith('[TEXT]');
          const isFakeImg = isImage && note.toLowerCase().includes('forgery');
          const isFakeTxt = isText  && note.toLowerCase().includes('ai-generation detected');

          return (
            <motion.div
              key={i}
              className={styles.entry}
              initial={{ opacity:0, x:-8 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.1 + i * 0.12 }}
            >
              <span className={styles.ts}>[{new Date().toLocaleTimeString()}]</span>
              <span className={`${styles.channel} ${isImage ? styles.chanImg : isText ? styles.chanTxt : styles.chanSys}`}>
                {isImage ? 'IMG' : isText ? 'TXT' : 'SYS'}
              </span>
              <span className={`${styles.noteText} ${(isFakeImg || isFakeTxt) ? styles.noteFake : styles.noteSafe}`}>
                {note.replace('[IMAGE]','').replace('[TEXT]','').trim()}
              </span>
            </motion.div>
          );
        })}

        <div className={styles.cursor}>▋</div>
      </div>
    </motion.div>
  );
}
