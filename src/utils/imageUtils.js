const s3 = require("../../config/s3Config");

const saveS3Image = async (image, tag = "profile-") => {
    try {
        // Input validation
        if (typeof image !== "string" || !image.includes(";base64,")) {
            throw new Error("Invalid image data. Expected base64 string.");
        }

        // Extract file extension and base64 data
        const matches = image.match(/^data:image\/(\w+);base64,(.+)$/);
        if (!matches) {
            throw new Error("Invalid image data format.");
        }

        const fileExtension = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        const filename = `${tag}${Date.now()}.${fileExtension}`;

        const params = {
            Bucket: process.env.ASSETS_BUCKET,
            Key: filename,
            Body: buffer,
            ContentType: `image/${fileExtension}`,
            ACL: "public-read", // This makes the object publicly readable
        };

        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location; // This is the public URL of the uploaded image
    } catch (error) {
        console.error("Error saving image to S3:", error);
        throw error;
    }
};

module.exports = { saveS3Image };
