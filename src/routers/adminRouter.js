const express = require("express");
const { authorizeAdminMiddleware } = require("../middlewares/authMiddleware");
const {
    getUsersHandler,
    updateUserInfoHandler,
    verifyBookingHandler,
} = require("../controllers/admin/adminController");

const adminRouter = express.Router();

adminRouter.post("/users/update", authorizeAdminMiddleware, updateUserInfoHandler);
adminRouter.get("/users", authorizeAdminMiddleware, getUsersHandler);
adminRouter.post("/verify-booking", authorizeAdminMiddleware, verifyBookingHandler);



module.exports = adminRouter;
