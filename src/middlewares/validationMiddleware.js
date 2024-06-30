const { body, validationResult } = require("express-validator");

const signupStep1ValidationMiddleware = [
    body("phone").isMobilePhone().withMessage("Invalid phone number"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let message = Array(errors).join(",");
            return res.status(400).json({ message });
        }
        next();
    },
];


module.exports = {
    signupStep1ValidationMiddleware,
};
