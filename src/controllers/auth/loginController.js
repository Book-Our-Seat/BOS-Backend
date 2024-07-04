const becrypt = require("bcryptjs");
const express = require("express");
const UserModel = require("../../models/UserModel");
const {
    generateAccessToken,
    generateRefreshToken,
    revokeToken,
} = require("../../services/tokenService");

const loginHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ where: { email } });
        if (!user)
            return res
                .status(404)
                .json({ message: "Invalid email or password" });

        const passwordIsValid = becrypt.compareSync(password, user.password);
        if (!passwordIsValid)
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.status(200).json({
            userId: user.id,
            name: user.name,
            email: user.email,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

const logoutHandler = async (req, res, next) => {
    try {
        let refreshToken = req["authorization"].split(" ")[1];
        await revokeToken(refreshToken);
        res.send(201).json({ message: "Logout successful " });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginHandler,
    logoutHandler,
};
