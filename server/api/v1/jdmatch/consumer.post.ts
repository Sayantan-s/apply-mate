import { JDMATCH_STATUS } from "~/shared/constants/jd";

export default defineEventHandler(async (event) => {
  const info = await readBody<
    Awaited<ReturnType<typeof parseJDInformation>>["info"]
  >(event);

  const storage = useStorage("uploads");

  const { candidateResumePath, JD_URL, fileName } = info;

  const [fileId] = fileName.split("-");
  const redisKey = `file:${fileId}`;

  await redisClient.set(redisKey, JDMATCH_STATUS.EXTRACTING);

  const jd = await extractJD(event, {
    url: JD_URL,
  });

  await redisClient.set(redisKey, JDMATCH_STATUS.GENERATING);

  const data = await generateCandidateScore(event, {
    jd,
    candidateResumePath,
  });

  const res = await supabase.from("jd_match_dtl").insert([
    {
      file_id: fileId,
      jd,
      ...data,
    },
  ]);

  if (res.error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to insert data into Supabase",
    });

  await redisClient.set(redisKey, JDMATCH_STATUS.MATCHED);

  await storage.removeItem(fileName);

  setResponseStatus(event, 200);

  return { message: "SUCCESS" };
});
