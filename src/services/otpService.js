const generateAndSendOtp = (email, phone) => {
    console.log(`::${email} ${phone}`)
    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();
    console.log(`::EmailOtp: ${emailOtp} | PhoneOtp: ${phoneOtp}`);
    return {emailOtp, phoneOtp};
};

const generateOtp = () => {
    var otp = "";
    for (let i = 1; i <= 4; i++) {
        otp = otp + Math.floor(Math.random() * 10);
    }
    return otp
}

module.exports = generateAndSendOtp;
