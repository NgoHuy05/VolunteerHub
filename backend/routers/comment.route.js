const express = require("express")
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controllers = require("../controllers/comment.controller")

router.post("/create", authMiddleware, controllers.createComment);
router.get("/:postId", authMiddleware, controllers.getCommentByPostId);

module.exports = router;