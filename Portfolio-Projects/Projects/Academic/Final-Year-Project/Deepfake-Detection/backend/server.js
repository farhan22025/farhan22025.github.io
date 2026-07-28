require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const multer   = require('multer');
const mongoose = require('mongoose');
const fetch    = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const FormData = require('form-data');

const app  = express();
const PORT = process.env.PORT || 3001;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Multer: keep files in memory for forwarding
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// ── MongoDB ───────────────────────────────────────────────
let mongoOnline = false;

const ScanSchema = new mongoose.Schema({
  prediction:    String,
  confidence:    String,
  mode:          String,
  image_details: Object,
  text_details:  Object,
  notes:         [String],
  createdAt:     { type: Date, default: Date.now },
});
const Scan = mongoose.model('Scan', ScanSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(() => { mongoOnline = true; console.log('[DeepTrace] MongoDB connected'); })
  .catch(() => console.warn('[DeepTrace] MongoDB not available — history disabled'));

// ── POST /api/detect ─ proxy to FastAPI ─────────────────
app.post('/api/detect', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'doc_file', maxCount: 1 }]), async (req, res) => {
  try {
    const form = new FormData();

    // Forward image if present
    if (req.files && req.files.file) {
      const file = req.files.file[0];
      form.append('file', file.buffer, {
        filename:    file.originalname,
        contentType: file.mimetype,
      });
    }

    // Forward doc_file if present
    if (req.files && req.files.doc_file) {
      const doc = req.files.doc_file[0];
      form.append('doc_file', doc.buffer, {
        filename:    doc.originalname,
        contentType: doc.mimetype,
      });
    }

    // Forward text if present
    if (req.body.text_content) {
      form.append('text_content', req.body.text_content);
    }

    const fapiRes  = await fetch(`${FASTAPI_URL}/api/detect`, { method: 'POST', body: form });
    const data     = await fapiRes.json();

    // Persist to MongoDB if online
    if (mongoOnline && data.status === 'success') {
      const mode =
        req.file && req.body.text_content ? 'MULTIMODAL' :
        req.file                          ? 'IMAGE'       : 'TEXT';
      await Scan.create({
        prediction:    data.prediction,
        confidence:    data.confidence,
        mode,
        image_details: data.image_details,
        text_details:  data.text_details,
        notes:         data.notes,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('[DeepTrace] /api/detect error:', err.message);
    res.status(502).json({ status: 'error', message: 'Failed to reach FastAPI inference engine.' });
  }
});

// ── GET /api/history ─────────────────────────────────────
app.get('/api/history', async (req, res) => {
  if (!mongoOnline) return res.status(503).json([]);
  try {
    const records = await Scan.find().sort({ createdAt: -1 }).limit(20).lean();
    res.json(records);
  } catch (err) {
    res.status(500).json([]);
  }
});

// ── DELETE /api/history/:id ───────────────────────────────
app.delete('/api/history/:id', async (req, res) => {
  if (!mongoOnline) return res.status(503).json({ ok: false });
  try {
    await Scan.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch {
    res.status(400).json({ ok: false });
  }
});

// ── Health check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mongo: mongoOnline, fastapi: FASTAPI_URL });
});

app.listen(PORT, () => {
  console.log(`[DeepTrace] Express proxy running on http://localhost:${PORT}`);
  console.log(`[DeepTrace] Forwarding /api/detect → ${FASTAPI_URL}/api/detect`);
});
