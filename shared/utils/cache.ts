import { getRedisClient } from "../integrations/redis";

interface Cache {
  keyPrefix: string;
}

function cache({ keyPrefix }: Cache) {
  return {
    set: async <T>(key: string, value: T) => {
      const redisClient = getRedisClient();
      const { logger } = Logging.client;
      const redisKey = `${keyPrefix}:${key}`;
      logger.info(`caching -> ${key} > ${value}`);
      await redisClient.set(redisKey, JSON.stringify(value));
      logger.info(`cached -> ${key} > ${value}`);
    },

    get: async <T>(key: string): Promise<T | null> => {
      const redisClient = getRedisClient();
      const { logger } = Logging.client;
      const redisKey = `${keyPrefix}:${key}`;
      logger.info(`getting cache -> ${key}`);
      const value = await redisClient.get(redisKey);
      logger.info(`fetched cache -> ${key}`);
      if (!value) return null;
      return JSON.parse(value) as T;
    },

    del: async (key: string) => {
      const redisClient = getRedisClient();
      const { logger } = Logging.client;
      const redisKey = `${keyPrefix}:${key}`;
      logger.info(`removing cache -> ${key}`);
      await redisClient.del(redisKey);
      logger.info(`removed cache -> ${key}`);
    },
  };
}

export const store = cache({
  keyPrefix: "file",
});
