import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";

const redishost: string = process.env.REDIS_HOST;
const redisport: number = +process.env.REDIS_PORT;

const redisConnection = createClient({
  socket: { host: redishost, port: redisport },
  legacyMode: true,
});

(async () => {
  redisConnection.on("connect", () => {
    console.log(
      `Redis connection on host ${redishost} and on port ${redisport}`
    );
  });
  redisConnection.on("error", (error: any) => {
    console.log(`Redis connection failed ${error}`);
  });

  await redisConnection.connect();
})();

const redisStore = new RedisStore({
  client: redisConnection,
});

export { redisStore };
