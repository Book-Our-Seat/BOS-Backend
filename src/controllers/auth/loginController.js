const becrypt = require("bcryptjs");
const express = require("express");
const UserModel = require("../../models/UserModel");
const { generateAccessToken, generateRefreshToken } = require("../../services/tokenService");
const loginController = express.Router();

const loginHandler = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Invalid email or password" });

        const passwordIsValid = becrypt.compareSync(password, user.password);
        if (!passwordIsValid)
            return res.status(401).json({ message: "Invalid email or password" });

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

loginController.post("/", loginHandler);

module.exports = loginController;
