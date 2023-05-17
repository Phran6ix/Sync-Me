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
// import "dotenv/config";
// import dotenv from "dotenv";
require("dotenv").config();
const config_1 = __importDefault(require("./database/config"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
// const chcek = dotenv.config();
// const checkenv = (process.env.NODE_ENV = "test");
const port = +process.env.PORT || 4000;
const server = http_1.default.createServer(app_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, config_1.default)();
        server.listen(port, () => {
            console.log(`App connected on port ${port}`);
        });
    });
}
startServer();
