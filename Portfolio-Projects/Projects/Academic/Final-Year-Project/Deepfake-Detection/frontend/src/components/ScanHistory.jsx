import { useEffect, useState } from 'react';
import { getHistory, deleteHistoryItem } from '../api/detect';
import styles from './ScanHistory.module.css';

export default function ScanHistory({ refreshKey }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbOnline, setDbOnline] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setRecords(data);
      setDbOnline(true);
    } catch {
      setDbOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const handleDelete = async (id) => {
    await deleteHistoryItem(id);
    load();
  };

  if (!dbOnline) return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>SCAN HISTORY</span>
      </div>
      <div className={styles.offline}>
        <span className={styles.offlineDot}/>
        MongoDB offline — history unavailable
      </div>
    </aside>
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>SCAN HISTORY</span>
        <span className={styles.count}>{records.length}</span>
      </div>
      {loading && <div className={styles.loading}>LOADING...</div>}
      {!loading && records.length === 0 && (
        <div className={styles.empty}>No scans recorded yet.</div>
      )}
      <div className={styles.list}>
        {records.map((r) => {
          const isFake = r.prediction?.includes('FAKE');
          return (
            <div key={r._id} className={`${styles.record} ${isFake ? styles.recFake : styles.recReal}`}>
              <div className={styles.recTop}>
                <span className={`${styles.recVerdict} ${isFake ? styles.verdFake : styles.verdReal}`}>
                  {isFake ? '⚠ FAKE' : '✓ REAL'}
                </span>
                <span className={styles.recConf}>{r.confidence}</span>
                <button className={styles.delBtn} onClick={() => handleDelete(r._id)}>✕</button>
              </div>
              <div className={styles.recMeta}>
                <span>{r.mode}</span>
                <span>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
