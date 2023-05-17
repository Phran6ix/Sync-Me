"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupSchema = void 0;
const yup_1 = require("yup");
const groupSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required().trim(),
    description: (0, yup_1.string)().optional(),
});
exports.groupSchema = groupSchema;
