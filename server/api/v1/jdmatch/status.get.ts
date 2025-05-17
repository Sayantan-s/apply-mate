export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const { fileId } = params;
  const redisKey = `file:${fileId}`;
  const value = await redisClient.get(redisKey);
  if (!value)
    throw createError({ statusCode: 404, statusMessage: "File not found!" });
  return { status: value };
});
