const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.user = decoded; // attach user info if needed later
    next();
  } catch (err) {
    console.error("Token error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyAdmin;
