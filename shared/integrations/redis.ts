import Redis from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.once("connect", () => {
  console.log("Redis client connected...");
});

redisClient.once("ready", () => {
  console.log("Redis client ready...");
});

redisClient.once("error", (err) => {
  console.error("Redis client error:", err);
});

redisClient.ping();
