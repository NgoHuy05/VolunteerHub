const express = require("express");
const router = express.Router();
const controllers = require("../controllers/auth.controller");

// -------------------------
// 🔹 Auth CRUD cơ bản
// -------------------------
router
  .post("/register", controllers.register)
  .post("/login", controllers.login);

module.exports = router;
