const express = require("express");
const { authorizeUserMiddleware } = require("../middlewares/authMiddleware");
const {
    getUsersHandler,
    approveUserHandler,
    updateCoinsHandler,
} = require("../controllers/admin/adminController");
const { getUserInfoHandler } = require("../controllers/user/userController");

const userRouter = express.Router();

userRouter.get("/info", authorizeUserMiddleware, getUserInfoHandler)

module.exports = userRouter;
