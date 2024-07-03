const express = require("express");
const signupController = require("../controllers/auth/signupController");
const loginController = require("../controllers/auth/loginController");
const forgotPasswordController = require("../controllers/auth/forgotPasswordController");
const tokenController = require("../controllers/auth/tokenController");
const authRouter = express.Router();

//FIXME: Move router code from controller to this place.
authRouter.use("/signup", signupController);
authRouter.use("/login", loginController);
authRouter.use("/forgot-password", forgotPasswordController);
authRouter.use("/token", tokenController)

module.exports = authRouter;
