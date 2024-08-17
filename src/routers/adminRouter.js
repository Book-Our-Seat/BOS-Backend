const express = require("express");
const { authorizeAdminMiddleware } = require("../middlewares/authMiddleware");
const {
    getUsersHandler,
    approveUserHandler,
    updateCoinsHandler,
    updateUserInfoHandler
} = require("../controllers/admin/adminController");

const adminRouter = express.Router();

adminRouter.post("/users/update", authorizeAdminMiddleware, updateUserInfoHandler);
adminRouter.get("/users", authorizeAdminMiddleware, getUsersHandler);



module.exports = adminRouter;
