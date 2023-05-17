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
exports.redisClient = exports.redisStore = void 0;
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const redishost = process.env.REDIS_HOST || "localhost";
const redisport = +process.env.REDIS_PORT;
const redisConnection = (0, redis_1.createClient)();
exports.redisClient = redisConnection;
(() => __awaiter(void 0, void 0, void 0, function* () {
    redisConnection.on("connect", () => {
        console.log(`Redis connection on host ${redishost} and on port ${redisport}`);
    });
    redisConnection.on("error", (error) => {
        console.log(`Redis connection failed ${error}`);
    });
    yield redisConnection.connect().catch(console.error);
}))();
const redisStore = new connect_redis_1.default({
    client: redisConnection,
});
exports.redisStore = redisStore;
