const UserModel = require("../../models/UserModel");
const { saveS3Image } = require("../../utils/imageUtils");

const getUserInfoHandler = async (req, res, next) => {
    const user = req.user;
    try {
        let userInfo = await UserModel.findOne({
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
                "profileImage",
                "city",
                "state",
                "pincode",
                "emergencyContactPersonNumber",
                "emergencyContactPersonName",
                "bloodGroup"
            ],
        });
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }
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
        user.emergencyContactPersonNumber = userInfo.emergencyContactPersonNumber;
        user.emergencyContactPersonName = userInfo.emergencyContactPersonName;
        user.bloodGroup = userInfo.bloodGroup;

        if(userInfo.profileImage) {
            user.profileImage = await saveS3Image(userInfo.profileImage);
        }
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