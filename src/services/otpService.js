const generateAndSendOTP = (email, phoneNumber) => {
    var otp = "";
    for (let i = 1; i <= 4; i++) {
        otp = otp + Math.floor(Math.random() * 10);
    }
    console.log(`::OTP: ${otp}`);
    return otp;
};

module.exports = generateAndSendOTP;
