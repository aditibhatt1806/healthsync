// functions/src/controllers/usersController.js
const admin = require("firebase-admin");
const db = admin.firestore();

exports.createOrUpdateUser = async (req, res) => {
  const payload = req.body;
  if (!payload.uid) return res.status(400).json({ ok: false, error: "uid required" });
  try {
    // Upsert user by uid
    const snapshot = await db.collection("users").where("uid", "==", payload.uid).get();
    if (snapshot.empty) {
      const ref = db.collection("users").doc();
      await ref.set({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      return res.json({ ok: true, id: ref.id });
    } else {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ ...payload, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
      return res.json({ ok: true, id: docRef.id });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

exports.getUserByUid = async (req, res) => {
  const uid = req.params.uid;
  try {
    const snap = await db.collection("users").where("uid", "==", uid).limit(1).get();
    if (snap.empty) return res.status(404).json({ ok: false, error: "User not found" });
    return res.json({ ok: true, user: { id: snap.docs[0].id, ...snap.docs[0].data() } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const uid = req.params.uid;
  const updates = req.body;
  try {
    const snap = await db.collection("users").where("uid", "==", uid).limit(1).get();
    if (snap.empty) return res.status(404).json({ ok: false, error: "User not found" });
    await snap.docs[0].ref.update({ ...updates, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
