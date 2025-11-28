// functions/src/controllers/medsController.js
const admin = require("firebase-admin");
const db = admin.firestore();

exports.listMedications = async (req, res) => {
  const { userId, limit = 50 } = req.query;
  if (!userId) return res.status(400).json({ ok: false, error: "userId query param required" });
  try {
    const q = db.collection("medications").where("userId", "==", userId).orderBy("createdAt", "desc").limit(parseInt(limit));
    const snap = await q.get();
    const meds = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ ok: true, meds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.createMedication = async (req, res) => {
  const payload = req.body;
  if (!payload.userId || !payload.name) return res.status(400).json({ ok: false, error: "userId and name are required" });
  try {
    const ref = await db.collection("medications").add({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp(), taken: false });
    res.json({ ok: true, id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.updateMedication = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  try {
    await db.collection("medications").doc(id).update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

exports.deleteMedication = async (req, res) => {
  const id = req.params.id;
  try {
    await db.collection("medications").doc(id).delete();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
