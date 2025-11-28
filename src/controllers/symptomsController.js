// functions/src/controllers/symptomsController.js
const admin = require("firebase-admin");
const db = admin.firestore();

exports.listSymptoms = async (req, res) => {
  const { userId, limit = 50 } = req.query;
  if (!userId) return res.status(400).json({ ok: false, error: "userId query param required" });
  try {
    const q = db.collection("symptoms").where("userId", "==", userId).orderBy("date", "desc").limit(parseInt(limit));
    const snap = await q.get();
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ ok: true, symptoms: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.createSymptom = async (req, res) => {
  const payload = req.body;
  if (!payload.userId || !payload.description) return res.status(400).json({ ok: false, error: "userId and description required" });
  try {
    const ref = await db.collection("symptoms").add({ ...payload, date: payload.date ? admin.firestore.Timestamp.fromDate(new Date(payload.date)) : admin.firestore.FieldValue.serverTimestamp() });
    res.json({ ok: true, id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
