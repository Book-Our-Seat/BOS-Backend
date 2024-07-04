const express = require("express");
const {
    signupCreateAccountHandler,
    signupMoreDetailsHandler,
} = require("../controllers/auth/signupController");
const {
    loginHandler, logoutHandler
} = require("../controllers/auth/loginController")
const resetPasswordController = require("../controllers/auth/resetPasswordController");
const accessTokenHandler = require("../controllers/auth/tokenController");
const {
    signupCreateAccountMiddleware,
} = require("../middlewares/validationMiddleware");
const {
    authorizeUserMiddleware,
    authorizeAdminMiddleware,
} = require("../middlewares/authMiddleware");
const {
    generateOtpHandler,
    validateOtpHandler,
} = require("../controllers/otp/otpController");
const authRouter = express.Router();

//FIXME: Move router code from controller to this place.
authRouter.post(
    "/signup/create-account",
    signupCreateAccountMiddleware,
    signupCreateAccountHandler
);

authRouter.post(
    "/signup/more-details",
    authorizeUserMiddleware,
    signupMoreDetailsHandler
);

authRouter.post("/login", loginHandler);
authRouter.post("/logout", authorizeUserMiddleware, logoutHandler )
authRouter.post(
    "/reset-password",
    authorizeUserMiddleware,
    resetPasswordController
);

authRouter.post("/generate-otp", generateOtpHandler);
authRouter.post("/validate-otp", validateOtpHandler);

authRouter.post("/access-token", accessTokenHandler);

module.exports = authRouter;
