const express = require("express");
const { verifyAccessToken } = require("../services/tokenService");
const authMiddleware = (req, res, next) => {
    {
        let token = req.headers["authorization"];
        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }

        try {
            //TODO: validate and revoke tokens!
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token!" });
        }
    }
    next();
};

module.exports = authMiddleware;
