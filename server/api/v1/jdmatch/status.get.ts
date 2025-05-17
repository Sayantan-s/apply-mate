export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const { fileId } = params;
  const redisKey = `file:${fileId}`;
  const value = await redisClient.get(redisKey);
  if (!value)
    throw createError({ statusCode: 404, statusMessage: "File not found!" });
  if (value === JDMATCH_STATUS.MATCHED) await redisClient.del(redisKey);
  return { status: value };
});
