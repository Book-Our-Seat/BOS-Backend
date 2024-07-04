const becrypt = require("bcryptjs");
const UserModel = require("../../models/UserModel");

//TODO: Not handling password length do it on client side.
//TODO: Transaction!
const resetPasswordHandler = async (req, res, next) => {
    const { newPassword } = req.body;
    const user = req.user;
    try {
        let password = becrypt.hashSync(newPassword, 8);
        await UserModel.update({ password }, { where: { id: user.id } });
        res.status(200).json({ message: "Password Updated" });
    } catch (error) {
        console.log("did we send?", error)
        next(error);
    }
};

module.exports = resetPasswordHandler;
