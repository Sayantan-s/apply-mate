import Redis from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.once("connect", () => {
  Logging.client.logger.info("Redis client connected...");
});

redisClient.once("ready", () => {
  Logging.client.logger.info("Redis client ready...");
});

redisClient.once("error", (err) => {
  Logging.client.logger.info(`Redis client error: ${JSON.stringify(err)}`, err);
});

redisClient.ping();
