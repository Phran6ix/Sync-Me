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
const nodemailer_1 = __importDefault(require("nodemailer"));
class Email {
    constructor(message, subject, user_email) {
        // FOR CONNECTION
        this.host = process.env.SMTP_HOST;
        this.port = +process.env.SMTP_PORT;
        this.user = process.env.SMTP_USER;
        this.pass = process.env.SMTP_PASS;
        this.from = "Sync Me";
        this.message = message;
        this.subject = subject;
        this.user_email = user_email;
        this.createConnection();
    }
    createConnection() {
        return (this.transpoter = nodemailer_1.default.createTransport({
            host: this.host,
            port: this.port,
            auth: {
                user: this.user,
                pass: this.pass,
            },
        }));
    }
    sendEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.transpoter
                    .sendMail({
                    to: this.user_email,
                    from: this.from,
                    subject: this.subject,
                    text: this.message,
                })
                    .then(() => {
                    console.log("EMAIL SENT");
                });
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.default = Email;
