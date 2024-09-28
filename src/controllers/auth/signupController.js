const express = require("express");
const { Op } = require("@sequelize/core");
const UserModel = require("../../models/UserModel");
const becrypt = require("bcryptjs");

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

const signupCreateAccountHandler = async (req, res, next) => {
    let { name, phone, email, password } = req.body;

    try {
        email = email.toLowerCase();
        let { isTaken, msg } = await isAlreadyTaken(phone, email);
        if (isTaken) {
            return res.status(400).json({ message: msg });
        }
        
        await UserModel.create({
            name,
            phone,
            email,
            password: becrypt.hashSync(password, 8),
        });

        res.status(201).json({
            message: "User creation successful",
        });
    } catch (error) {
        next(error);
    }
};

const signupMoreDetailsHandler = async (req, res, next) => {
    const { address } = req.body;
    try {
        await UserModel.update(
            { address: address },
            { where: { id: req.user.id } }
        );
        //TODO: Complete this!
        res.status(200).json({ message: "Profile Updated" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signupCreateAccountHandler,
    signupMoreDetailsHandler,
};
