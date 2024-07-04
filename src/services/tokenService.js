const jwt = require("jsonwebtoken");
const TokenModel = require("../models/Auth/TokenModel");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "15m" });
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, {
        expiresIn: "7d",
    });

    await TokenModel.create({ token: refreshToken, userId: user.id });
    return refreshToken;
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

const verifyRefreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET_KEY);
        const storedToken = await TokenModel.findOne({ where: { token } });
        if (!storedToken) throw new Error("Invalid refresh token");
        return decoded;
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
};

const revokeToken = async (refreshToken) => {
    await TokenModel.destroy({ where: { refreshToken } });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    revokeToken,
};
