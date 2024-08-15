const UserModel = require("../../models/UserModel");

const getUserInfoHandler = async (req, res, next) => {
    const user = req.user;
    try {
        const userInfo = await UserModel.findOne({
            where: { role: "user", id: user.id },
            attributes: ["id", "name", "email", "approvalStatus", "coins"],
        });
        res.status(200).json({ userInfo });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    getUserInfoHandler,
};
