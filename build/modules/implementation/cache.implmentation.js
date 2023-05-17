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
Object.defineProperty(exports, "__esModule", { value: true });
const conect_redis_1 = require("../../config/conect.redis");
class CacheRepo {
    constructor() {
        this.cacheoperator = conect_redis_1.redisClient;
    }
    getItemsFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.cacheoperator.get(key);
            return JSON.parse(data);
        });
    }
    addItemToCache(key, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cacheoperator.set(key, JSON.stringify(payload));
        });
    }
    getItemFromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.cacheoperator.get(key);
            return JSON.parse(data);
        });
    }
    deletefromCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cacheoperator.del(key);
        });
    }
    updateDataInCache(key, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.deletefromCache(key);
            this.addItemToCache(key, payload);
        });
    }
}
exports.default = CacheRepo;
