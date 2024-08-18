const express = require("express");
const { authorizeUserMiddleware } = require("../middlewares/authMiddleware");
const { getUserInfoHandler, updateUserInfoHandler } = require("../controllers/user/userController");

const userRouter = express.Router();

userRouter.get("/info", authorizeUserMiddleware, getUserInfoHandler)
userRouter.post("/info", authorizeUserMiddleware, updateUserInfoHandler)

module.exports = userRouter;
