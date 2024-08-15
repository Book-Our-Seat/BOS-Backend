const { body, validationResult } = require("express-validator");

const signupCreateAccountMiddleware = [
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let message = errors.errors[0].msg;
            return res.status(400).json({ message });
        }
        next();
    },
];

const otpRequestValidationMiddleware = [
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
    body("email").isEmail().withMessage("Invalid email number"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let message = errors.errors[0].msg;
            return res.status(400).json({ message });
        }
        next();
    },
];

module.exports = {
    signupCreateAccountMiddleware,
    otpRequestValidationMiddleware
};
