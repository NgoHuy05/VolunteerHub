const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "No token"})
    };
    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({message: "Invalid token"})
    }

}

module.exports = authMiddleware;