const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controllers = require("../controllers/userEvent.controller");

router.get("/all/:id", authMiddleware, controllers.countAllUserByEventId);
router.get("/pending/:id", authMiddleware, controllers.countPendingUserByEventId);
router.get("/joining/:id", authMiddleware, controllers.countJoiningUserByEventId);

router.get("/all", authMiddleware, controllers.getUserEvent);
router.get("/events", authMiddleware, controllers.getEventByUserId);
router.get("/events-status", authMiddleware, controllers.getEventByUserIdAndStatus);
router.get("/pending-user", authMiddleware, controllers.getPendingUsersWithApprovedEvents);

router.post("/create", authMiddleware, controllers.createUserEvent);
router.post("/approve/:id", authMiddleware, controllers.approveUserJoinEvent);

router.post("/delete", authMiddleware, controllers.deleteUserEvent);

module.exports = router;
