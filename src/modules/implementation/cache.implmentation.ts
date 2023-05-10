// import { RedisClientType } from "@redis/client";
import * as redis from "redis";
import { redisClient, RedisConnectionType } from "../../config/conect.redis";
import { TGroup } from "./group.implementation";
import { TUser } from "./user.implementation";

import ICacheRepo from "../repository/cache.repository";

export default class CacheRepo implements ICacheRepo {
  private cacheoperator: RedisConnectionType;
  constructor() {
    this.cacheoperator = redisClient;
  }
  async getItemsFromCache<T>(key: string): Promise<T[]> {
    const data = await this.cacheoperator.get(key);
    return JSON.parse(data);
  }

  async addItemToCache<T>(key: string, payload: T): Promise<void> {
    await this.cacheoperator.set(key, JSON.stringify(payload));
  }

  async getItemFromCache<T>(key: string): Promise<T> {
    const data = await this.cacheoperator.get(key);
    return JSON.parse(data) as T;
  }

  async deletefromCache(key: string): Promise<void> {
    await this.cacheoperator.del(key);
  }

  async updateDataInCache<T>(key: string, payload: T): Promise<void> {
    this.deletefromCache(key);
    this.addItemToCache(key, payload);
  }
}
