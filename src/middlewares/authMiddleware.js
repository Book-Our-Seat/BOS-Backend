const express = require("express");
const { verifyAccessToken } = require("../services/tokenService");
const UserModel = require("../models/UserModel");

const authMiddleware = async (req, res, next) => {
    {
        let token = req.headers["authorization"];
        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }
        try {
            let id = verifyAccessToken(token);
            let user = await UserModel.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token!" });
        }
    }
    next();
};

const adminAuthMiddleware = async (req, res, next) => {
    //TODO: Check from database if user role is admin.
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ message: "No token provided!" });
    }

    try {
        let id = verifyAccessToken(token);
        let user = await UserModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (user.role != "admin") {
            return res.status(403).json({ message: "Not Authorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token!" });
    }
    next();
};

module.exports = { authMiddleware, adminAuthMiddleware };
