"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const yup_1 = require("yup");
const signupSchema = (0, yup_1.object)({
    email: (0, yup_1.string)()
        .required()
        .email("PLease input a valid email")
        .lowercase()
        .trim(),
    password: (0, yup_1.string)()
        .required("Password field cannot be empty")
        .min(8, "Password must be more than 8 characters")
        .trim(),
    fullname: (0, yup_1.string)().required(),
    username: (0, yup_1.string)()
        .required()
        .min(8, "Username should have more than 8 characters")
        .trim(),
});
exports.signupSchema = signupSchema;
const loginSchema = (0, yup_1.object)({
    username: (0, yup_1.string)().optional().trim(),
    email: (0, yup_1.string)().optional().email().lowercase().trim(),
    password: (0, yup_1.string)().required("Please input password").trim(),
});
exports.loginSchema = loginSchema;
const resetPasswordSchema = (0, yup_1.object)({
    password: (0, yup_1.string)()
        .trim()
        .min(8, "Password should be a minimum of 8 characters"),
});
exports.resetPasswordSchema = resetPasswordSchema;
