const UserModel = require("../../models/UserModel");

const getUserInfoHandler = async (req, res, next) => {
    const user = req.user;
    try {
        const userInfo = await UserModel.findOne({
            where: { role: "user", id: user.id },
            attributes: [
                "id",
                "name",
                "email",
                "approvalStatus",
                "coins",
                "phone",
                "email",
                "address",
            ],
        });
        res.status(200).json({ userInfo });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateUserInfoHandler = async (req, res, next) => {
    const { id } = req.user;
    try {
        let { userInfo } = req.body;
        const user = await UserModel.findOne({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ message: "No user found!" });
        }
        user.name = userInfo.name;
        user.email = userInfo.email;
        user.address = userInfo.address;
        user.city = userInfo.city;
        user.state = userInfo.state;
        user.pincode = userInfo.pincode;
        await user.save();
        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    getUserInfoHandler,
    updateUserInfoHandler,
};
