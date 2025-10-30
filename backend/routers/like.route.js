const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const controllers = require("../controllers/like.controller");


router.post("/LikeUnLike", authMiddleware, controllers.LikeUnLike);
router.post("/count", authMiddleware, controllers.countLike);
router.get("/liked", authMiddleware, controllers.getLikedPosts);

module.exports = router;
