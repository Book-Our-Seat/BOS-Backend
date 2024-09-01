const express = require("express");
const jwt = require("jsonwebtoken");

const UserModel = require("../../models/UserModel");
const { generateAccessToken } = require("../../services/tokenService");
const TokenModel = require("../../models/Auth/TokenModel");

const accessTokenHandler = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).json({ message: "No token found!" });
    }

    const savedToken = await TokenModel.findOne({
        where: { token: refreshToken },
    });

    if (!savedToken) {
        return res.status(401).json({ message: "Invalid refresh token!" });
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        const accessToken = generateAccessToken({ id: savedToken.userId });
        res.status(201).json({ accessToken });
    } catch (error) {
        next(error);
    }
};

module.exports = accessTokenHandler;
