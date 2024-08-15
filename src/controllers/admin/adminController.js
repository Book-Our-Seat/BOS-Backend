const UserModel = require("../../models/UserModel");

const getUsersHandler = async (req, res, next) => {
    try {
        const users = await UserModel.findAll({
            where: { role: "user" },
            attributes: ["id", "name", "email", "approvalStatus", "coins"],
        });
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const approveUserHandler = async (req, res, next) => {
    const { id } = req.body;
    try {
        const user = await UserModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        user.approvalStatus = true;
        await user.save();
        res.status(201).json({ message: "Approval Successful!" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateCoinsHandler = async (req, res, next) => {
    const { id, updatedCoins } = req.body;
    try {
        const user = await UserModel.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        user.coins += updatedCoins;
        await user.save();
        res.status(201).json({ message: "Coins Updated Successfully!" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    getUsersHandler,
    approveUserHandler,
    updateCoinsHandler
};
