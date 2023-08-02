import { createClient } from "redis";
import RedisStore from "connect-redis";
import { RedisClientType } from "redis";

const redishost: string = process.env.REDIS_HOST || "redis";
const redisport: number = +process.env.REDIS_PORT || 6379;
let redisConnection: RedisClientType;

if (process.env.NODE_ENV == "production") {
  redisConnection = createClient({ url: process.env.REDIS_URL });
}

if (process.env.NODE_ENV == "development") {
  redisConnection = createClient({
    socket: { host: redishost, port: 6379 },
    // legacyMode: true,
  });
}

export type RedisConnectionType = typeof redisConnection;

(async () => {
  redisConnection.on("connect", () => {
    console.log(
      `Redis connection on host ${redishost} and on port ${redisport}`
    );
  });
  redisConnection.on("error", (error: any) => {
    console.log(`Redis connection failed ${error}`);
  });

  await redisConnection.connect().catch(console.error);
})();

const redisStore = new RedisStore({
  client: redisConnection,
});

export { redisStore, redisConnection as redisClient };
