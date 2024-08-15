const express = require("express");
const { authorizeAdminMiddleware } = require("../middlewares/authMiddleware");
const {
    getUsersHandler,
    approveUserHandler,
    updateCoinsHandler,
} = require("../controllers/admin/adminController");

const adminRouter = express.Router();

adminRouter.post("/users/coins", authorizeAdminMiddleware, updateCoinsHandler);

adminRouter.post("/approve", authorizeAdminMiddleware, approveUserHandler);

adminRouter.get("/users", authorizeAdminMiddleware, getUsersHandler);

module.exports = adminRouter;
