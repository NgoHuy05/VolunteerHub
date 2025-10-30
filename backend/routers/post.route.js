const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const controllers = require("../controllers/post.controller");
const upload = require("../middleware/upload");


router.get("/all", authMiddleware, controllers.getAllPost);
router.get("/all/approved", authMiddleware, controllers.getAllPostApproved);
router.get("/event/approved/:eventId", authMiddleware, controllers.getPostByIdEventApproved);
router.get("/event/post-pending", authMiddleware, controllers.getEventApprovedWithPostByIdEventPending);
router.get("/event/:eventId", authMiddleware, controllers.getPostByIdEvent);
router.get("/user/:userId", authMiddleware, controllers.getPostByIdUser);
router.get("/:id", authMiddleware, controllers.getPostById);

router.post("/create", authMiddleware, upload.array("images"), controllers.createPost);
router.post("/filter", authMiddleware, controllers.filterPost);
router.delete("/delete/:id", authMiddleware, roleMiddleware(["admin", "manager"]), controllers.deletePost);
router.patch("/update/:id", authMiddleware, controllers.updatePost);
router.patch("/approve/:id", authMiddleware, roleMiddleware(["admin"]), controllers.approvePost);

module.exports = router;
