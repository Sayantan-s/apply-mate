export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, "fileId");
  const redisKey = `file:${fileId}`;
  const value = await redisClient.get(redisKey);
  if (!value)
    throw createError({ statusCode: 404, statusMessage: "File not found!" });
  if (value === JDMATCH_STATUS.MATCHED) await redisClient.del(redisKey);
  return { status: value };
});
