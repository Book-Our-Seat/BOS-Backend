const express = require("express");
const { Op } = require("@sequelize/core");
const SignupSessionModel = require("../../models/Auth/SignupSessionModel")
const generateAndSendOtp = require("../../services/otpService");
const UserModel = require("../../models/UserModel");
const becrypt = require("bcryptjs");
const {
    signupStep1ValidationMiddleware,
} = require("../../middlewares/validationMiddleware");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
} = require("../../services/tokenService");
const { authMiddleware }  = require("../../middlewares/authMiddleware");

const signupController = express.Router();

const isAlreadyTaken = async (phone, email) => {
    const user = await UserModel.findOne({
        where: {
            [Op.or]: [{ phone }, { email }],
        },
    });

    if (user) {
        if (user.phone === phone) {
            return { isTaken: true, msg: "Phone number already taken" };
        }
        if (user.email === email) {
            return { isTaken: true, msg: "Email address already taken" };
        }
    }
    return { isTaken: false, msg: "" };
};

const signupStep1Handler = async (req, res, next) => {
    const { name, phone, email, password } = req.body;

    try {
        let { isTaken, msg } = isAlreadyTaken(phone, email);

        if (isTaken) {
            return res.status(400).json({ message: msg });
        }

        const session = await SignupSessionModel.create({
            name,
            phone,
            email,
            password,
        });

        const otp = generateAndSendOtp(phone, email);
        session.otp = otp;

        await session.save();
        res.status(201).json({
            message: "Step 1 complete, OTP sent",
            sessionId: session.id,
        });
    } catch (error) {
        next(error);
    }
};

const signupStep2Handler = async (req, res, next) => {
    const { sessionId, otp } = req.body;
    try {
        const session = await SignupSessionModel.findByPk(sessionId);
        if (session && session.otp === otp) {
            //TODO: this has to be a transaction!
            let user = await UserModel.create({
                name: session.name,
                phone: session.phone,
                email: session.email,
                password: becrypt.hashSync(session.password, 8),
            });
            session.isValid = false;
            await session.save();

            let accessToken = generateAccessToken(user);
            let refreshToken = await generateRefreshToken(user);
            // send refresh token and access token
            res.status(201).json({
                message: "Account created!",
                userId: user.id,
                name: user.name,
                email: user.email,
                accessToken,
                refreshToken,
            });
        } else {
            res.status(400).json({ message: "Invalid OTP or Session" });
        }
    } catch (error) {
        next(error);
    }
};

const signupStep3Handler = async (req, res, next) => {
    const { address, userId } = req.body;
    try {
        await UserModel.upsert({ address: address }, { where: { id: userId } });
        //TODO: Complete this!
        res.status(200).json({ message: "Profile Updated" });
    } catch (error) {
        next(error);
    }
};

signupController.post(
    "/step1",
    signupStep1ValidationMiddleware,
    signupStep1Handler
);
signupController.post("/step2", signupStep2Handler);
signupController.post("/step3", authMiddleware, signupStep3Handler);

module.exports = signupController;
