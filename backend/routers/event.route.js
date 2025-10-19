const express = require("express");
const router = express.Router();
const controllers = require("../controllers/event.controller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

router.get("/all", authMiddleware, roleMiddleware(["admin"]), controllers.getAllEvent);
router.get("/available", authMiddleware, controllers.getApprovedEventsUserNotJoined);
router.get("/all/approved", authMiddleware, controllers.getAllEventApprovedByUserId);
router.get("/all/rejected", authMiddleware, controllers.getAllEventRejectedByUserId);
router.get("/all/completed", authMiddleware, controllers.getAllEventCompletedByUserId);
router.get("/all/pending", authMiddleware, controllers.getAllEventPendingByUserId);
router.get("/all/createdBy", authMiddleware, controllers.getAllEventCreatedBy);
router.get("/all/createdByAndStatus", authMiddleware, controllers.getAllEventCreatedByAndStatus);
router.get("/:id", authMiddleware, controllers.getEventById);
router.post("/create", authMiddleware, roleMiddleware(["admin", "manager"]), upload.single("banner"), controllers.createEvent);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin", "manager"]), controllers.deleteEvent);
router.patch("/update/:id", authMiddleware, roleMiddleware(["admin", "manager"]), controllers.updateEvent);
router.patch("/approve/:id", authMiddleware, roleMiddleware(["admin",]), controllers.approveEvent);

module.exports = router;