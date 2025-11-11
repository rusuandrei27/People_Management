const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: "Unauthorized access!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Unauthorized access!" });
        }

        req.user = decoded; // idUser, email, role
        next();
    });
}

module.exports = verifyToken;
