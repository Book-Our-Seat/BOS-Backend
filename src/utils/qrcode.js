const generateQRCode = async (data) => {
    var QRCode = require("qrcode");
    try {
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.log("Error generating QR. " + err);
        return -1;
    }
};

module.exports = { generateQRCode };
