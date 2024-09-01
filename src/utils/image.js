
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, "../uploads");

const getImage = (absoluteImagePath) => {
    try {
        // Check if the profileImage is already a data URL
        if (!absoluteImagePath.startsWith("data:image")) {
            const imagePath = path.resolve(
                path.join(__dirname, "../../", absoluteImagePath)
            );
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString("base64");
            const mimeType = path.extname(imagePath).slice(1);
            return `data:image/${mimeType};base64,${base64Image}`;
        }
    } catch (error) {
        console.error("Error processing profile image:", error);
        return null;
    }
};

const saveImage = (profileImage, tag = "profile-") => {
    try {
        // Input validation
        if (typeof profileImage !== 'string' || !profileImage.includes(';base64,')) {
            throw new Error('Invalid image data. Expected base64 string.');
        }

        // Extract file extension and base64 data
        const matches = profileImage.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
            throw new Error('Invalid image data format.');
        }

        const fileExtension = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const filename = `${tag}${Date.now()}.${fileExtension}`;
        const filePath = path.join(uploadDir, filename);

        // Save the new image
        fs.writeFileSync(filePath, buffer);

        return `/uploads/${filename}`;
    } catch (error) {
        console.error("Error saving image:", error);
        throw error; // Re-throw to allow caller to handle the error
    }
};

module.exports = {getImage, saveImage}