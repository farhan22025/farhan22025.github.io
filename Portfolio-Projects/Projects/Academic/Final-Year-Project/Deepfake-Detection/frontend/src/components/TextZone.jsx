import { useDropzone } from 'react-dropzone';
import styles from './TextZone.module.css';

export default function TextZone({ value, onChange, documentFile, onDocumentDrop, onClearDocument }) {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onDocumentDrop(acceptedFiles[0]);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
    noClick: true
  });

  return (
    <div className={styles.card} {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={styles.cardHead}>
        <div className={styles.headLeft}>
          <div className={`${styles.channelIcon} ${styles.textIcon}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <div className={styles.cardTitle}>DOCUMENT LINGUISTICS</div>
            <div className={styles.cardSub}>AI authorship & semantic anomaly detection</div>
          </div>
        </div>
        <div className={`${styles.badge} ${styles.textBadge}`}>TXT / DOC</div>
      </div>

      <div className={`${styles.textAreaWrap} ${isDragActive ? styles.dragActive : ''}`}>
        <div className={styles.corner} data-pos="tl" />
        <div className={styles.corner} data-pos="tr" />
        <div className={styles.corner} data-pos="bl" />
        <div className={styles.corner} data-pos="br" />
        
        <div className={styles.promptLine}>
          <span className={styles.promptSymbol}>&gt;_</span>
          <span className={styles.promptLabel}>INPUT TEXT OR DROP DOCUMENT</span>
          <button type="button" className={styles.browseBtn} onClick={open}>
            BROWSE FILES
          </button>
        </div>

        {documentFile ? (
          <div className={styles.documentPreview}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span className={styles.documentName}>{documentFile.name}</span>
            <span className={styles.documentSize}>{(documentFile.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : (
          <textarea
            id="text-input"
            className={styles.textarea}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste text or upload a PDF/DOCX/Image document for AI authorship analysis..."
            rows={7}
          />
        )}

        <div className={styles.footer}>
          {!documentFile && <span className={styles.charCount}>{value.length} CHARS</span>}
          {documentFile && <span className={styles.charCount}>DOCUMENT ATTACHED</span>}
          
          {(value.length > 0 || documentFile) && (
            <button className={styles.clearBtn} type="button" onClick={() => {
              onChange('');
              if (onClearDocument) onClearDocument();
            }}>CLEAR</button>
          )}
        </div>
      </div>

      <div className={styles.chips}>
        {['Certificates','Emails','Reports','Technical Docs','AI-Generated Text'].map(c => (
          <span key={c} className={styles.chip}>{c}</span>
        ))}
      </div>
    </div>
  );
}
