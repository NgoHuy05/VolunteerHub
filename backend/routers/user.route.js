const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/all", authMiddleware, roleMiddleware(["admin"]), controllers.getAllUser);
router.get("/profile", authMiddleware, controllers.getProfileUser);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin"]), controllers.deleteUser);
router.patch("/update", authMiddleware, controllers.updateUser);
router.patch("/update/:id", authMiddleware, roleMiddleware(["admin"]), controllers.adminUpdateUser);
router.put("/changePassword", authMiddleware, controllers.changePassword);

module.exports = router;
