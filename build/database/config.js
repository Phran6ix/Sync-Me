"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let MONGO_URL = process.env.DB_URL;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production")
    MONGO_URL = process.env.MONGO_URI.replace("<password>", `${process.env.MONGO_PASSWORD}`);
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        return mongoose_1.default
            .connect(MONGO_URL)
            .then(() => console.log("DB connected"))
            .catch((error) => {
            console.error(error);
        });
    });
}
exports.default = connectDB;
