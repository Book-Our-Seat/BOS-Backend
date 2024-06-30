const express = require("express");
const signupController = require("../controllers/signupController");
const loginController = require("../controllers/loginController");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const authRouter = express.Router();

authRouter.use("/signup", signupController);
authRouter.use("/login", loginController);
authRouter.use("/forgot-password", forgotPasswordController);

module.exports = authRouter;
