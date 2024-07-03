const express = require("express");
const UserModel = require("../../models/UserModel");
const { generateAccessToken } = require("../../services/tokenService");
const TokenModel = require("../../models/Auth/TokenModel");
const tokenController = express.Router();

const accessTokenHandler = async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "No token found!" });
    }

    const savedToken = await TokenModel.findOne({ where: { token } });

    if (!savedToken) {
        return res.status(403).json({ message: "Invalid token!" });
    }

    try {
        jwt.verify(token, process.env.REFRESH_SECRET_KEY);
        const accessToken = generateAccessToken({ id: savedToken.userId });
        res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

tokenController.post("/access-token", accessTokenHandler);

module.exports = tokenController;
