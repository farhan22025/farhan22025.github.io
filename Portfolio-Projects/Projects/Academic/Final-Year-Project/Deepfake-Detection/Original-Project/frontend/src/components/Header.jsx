import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logoGroup}>
          <svg className={styles.logoHex} viewBox="0 0 44 44" fill="none">
            <polygon points="22,2 41,12 41,32 22,42 3,32 3,12"
              stroke="#00f5c8" strokeWidth="1.4" fill="rgba(0,245,200,0.05)" />
            <polygon points="22,8 35,15.5 35,28.5 22,36 9,28.5 9,15.5"
              stroke="#00f5c8" strokeWidth="0.7" fill="none" opacity="0.35" />
            <circle cx="22" cy="22" r="5.5" fill="#00f5c8" opacity="0.9" />
            <circle cx="22" cy="22" r="3" fill="#04050a" />
            <line x1="22" y1="2"  x2="22" y2="8"   stroke="#00f5c8" strokeWidth="1" />
            <line x1="22" y1="36" x2="22" y2="42"  stroke="#00f5c8" strokeWidth="1" />
            <line x1="3"  y1="12" x2="9"  y2="15.5" stroke="#00f5c8" strokeWidth="1" />
            <line x1="35" y1="28.5" x2="41" y2="32" stroke="#00f5c8" strokeWidth="1" />
            <line x1="41" y1="12" x2="35" y2="15.5" stroke="#00f5c8" strokeWidth="1" />
            <line x1="9"  y1="28.5" x2="3" y2="32" stroke="#00f5c8" strokeWidth="1" />
          </svg>
          <div className={styles.logoText}>
            <span className={styles.logoName}>DEEP<span className={styles.logoAccent}>TRACE</span></span>
            <span className={styles.logoSub}>FORENSIC INTELLIGENCE PLATFORM v2.1</span>
          </div>
        </div>

        {/* Nav indicators */}
        <div className={styles.navRight}>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            <span>NEURAL ENGINE ONLINE</span>
          </div>
          <div className={styles.modelTag}>EfficientNetV2-S</div>
          <div className={styles.modelTag}>DistilRoBERTa</div>
        </div>
      </div>
    </header>
  );
}
