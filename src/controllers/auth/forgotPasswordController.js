const becrypt = require("bcryptjs");
const express = require("express");
const UserModel = require("../../models/UserModel");
const generateAndSendOtp = require("../../services/otpService");
const ForgotPasswordSessionModel = require("../models/ForgotPasswordSessionModel");
const forgotPasswordController = express.Router();

const generateOtpHandler = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "Invalid Email" });
        let otp = generateAndSendOtp(user);
        const session = await ForgotPasswordSessionModel.create({ otp, email });

        res.status(201).json({ message: "Otp sent!", sessionId: session.id });
    } catch (error) {
        next(error);
    }
};

const validateOtpHandler = async (req, res, next) => {
    const { otp, sessionId } = req.body;
    try {
        const session = await ForgotPasswordSessionModel.findOne({
            where: { id: sessionId },
        });
        if (session && session.isValid == true && otp == session.otp) {
            session.isVerified = true;
            await session.save();
            res.status(200).json({
                message: "Verified OTP",
                sessionId: session.id,
            });
        } else {
            res.status(400).json({ message: "Invalid OTP or Session" });
        }
    } catch (error) {
        next(error);
    }
};

//TODO: Not handling password length do it on client side.
//TODO: Transaction!
const resetPasswordHandler = async (req, res, next) => {
    const { password, sessionId } = req.body;
    try {
        const session = await ForgotPasswordSessionModel.findOne({
            where: { id: sessionId },
        });
        if (session && session.isVerified == true && session.isValid == true) {
            const user = await UserModel.findOne({
                where: { email: session.email },
            });
            user.password = becrypt.hashSync(password, 8);
            session.isValid = false
            await user.save();
            await session.save();
            res.status(201).json({ message: "Password updated!" });
        } else {
            res.status(400).json({ message: "Invalid Session" });
        }
    } catch (error) {
        next(error);
    }
};

forgotPasswordController.post("/generate-otp", generateOtpHandler);
forgotPasswordController.post("/validate-otp", validateOtpHandler);
forgotPasswordController.post("/reset-password", resetPasswordHandler);

module.exports = forgotPasswordController;
