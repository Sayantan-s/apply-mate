interface Cache {
  keyPrefix: string;
}

function cache({ keyPrefix }: Cache) {
  return {
    set: async <T>(key: string, value: T) => {
      const redisKey = `${keyPrefix}:${key}`;
      await redisClient.set(redisKey, JSON.stringify(value));
    },

    get: async <T>(key: string): Promise<T | null> => {
      const redisKey = `${keyPrefix}:${key}`;
      const value = await redisClient.get(redisKey);
      if (!value) return null;
      return JSON.parse(value) as T;
    },

    del: async (key: string) => {
      const redisKey = `${keyPrefix}:${key}`;
      await redisClient.del(redisKey);
    },
  };
}

export const store = cache({
  keyPrefix: "file",
});
