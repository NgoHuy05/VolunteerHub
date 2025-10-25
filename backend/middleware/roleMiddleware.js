const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toLowerCase(); 

    if (!roles.map((r) => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  };
};

module.exports = roleMiddleware;
