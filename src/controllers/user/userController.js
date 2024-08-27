const UserModel = require("../../models/UserModel");
// const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
            ],
        });
        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        if (userInfo.profileImage) {
            userInfo = getImage(userInfo, userInfo.profileImage);
        }
        res.status(200).json({ userInfo });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const uploadDir = path.join(__dirname, "../../uploads");

const getImage = (userInfo, imagePath) => {
    try {
        // Check if the profileImage is already a data URL
        if (!userInfo.profileImage.startsWith("data:image")) {
            const imagePath = path.resolve(
                path.join(__dirname, "../../", userInfo.profileImage)
            );
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString("base64");
            const mimeType = path.extname(imagePath).slice(1);
            userInfo.profileImage = `data:image/${mimeType};base64,${base64Image}`;
        }
    } catch (error) {
        console.error("Error processing profile image:", error);
        userInfo.profileImage = null;
    }
    return userInfo;
};

const saveImage = (user, profileImage) => {
    // Assuming profileImage is a base64 string
    const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const filename = "profile-" + Date.now() + ".png";
    const filePath = path.join(uploadDir, filename);

    // Delete old profile image if it exists
    if (user.profileImage) {
        const oldImagePath = path.join(
            uploadDir,
            path.basename(user.profileImage)
        );
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
    }

    // Save the new image
    fs.writeFileSync(filePath, buffer);
    user.profileImage = `/uploads/${filename}`;
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

        if (userInfo.profileImage) {
            saveImage(user, userInfo.profileImage);
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

/* Using multer for image upload */
// const uploadDir = path.join(__dirname, "../../uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, "profile-" + Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
// });
