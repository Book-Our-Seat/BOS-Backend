const becrypt = require("bcryptjs");
const express = require("express");
const UserModel = require("../../models/UserModel");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../services/tokenService");
const {
    otpRequestValidationMiddleware,
} = require("../../middlewares/validationMiddleware");
const OtpSessionModel = require("../../models/Otp/OtpSessionModel")
const generateAndSendOtp = require("../../services/otpService");
const loginController = express.Router();
const otpController = express.Router();

const generateOtpHandler = async (req, res, next) => {
    const { email, phone } = req.body;

    try {
        const { emailOtp, phoneOtp } = generateAndSendOtp(email, phone);
        const session = await OtpSessionModel.create({
            email,
            phone,
            emailOtp,
            phoneOtp,
        });
        res.status(201).json({ message: "Otps sent!", sessionId: session.id });
    } catch (error) {
        next(error);
    }
};

const validateOtpHandler = async (req, res, next) => {
    const { sessionId, emailOtp, phoneOtp } = req.body;
    try {
        const session = await OtpSessionModel.findOne({
            where: { id: sessionId },
        });

        if (
            session &&
            session.emailOtp == emailOtp &&
            session.phoneOtp == phoneOtp
        ) {
            session.isVerified = true;
            await session.save();

            res.status(201).json({ message: "otps are valid!", sessionId });
        } else {
            res.status(400).json({ message: "Invalid otp or session" });
        }
    } catch (error) {
        next(error);
    }
};

otpController.post(
    "/generate-otp",
    otpRequestValidationMiddleware,
    generateOtpHandler
);
otpController.post("/validate-otp", validateOtpHandler);
module.exports = loginController;
