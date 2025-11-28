// functions/src/middleware/verifyToken.js
const admin = require("firebase-admin");

module.exports = async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) {
    return res.status(401).json({ ok: false, error: "Missing Authorization header" });
  }
  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || null
    };
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
};
