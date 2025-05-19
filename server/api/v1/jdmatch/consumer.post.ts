import analyseIfTextStructureIsAJD from "~/shared/ai/jd/analyseIfTextStructureIsAJD";
import isJdLinkOrDescription from "~/shared/ai/jd/isJdLinkOrDescription";
import { JDMATCH_STATUS } from "~/shared/constants/jd";

export default defineEventHandler(async (event) => {
  const info = await readBody<
    Awaited<ReturnType<typeof parseJDInformation>>["info"]
  >(event);

  const storage = useStorage("uploads");

  const { candidateResumePath, JD_URL: jd_data, fileName } = info;

  const [fileId] = fileName.split("-");
  const redisKey = `file:${fileId}`;

  const isJDLink = isJdLinkOrDescription(jd_data);

  await redisClient.set(
    redisKey,
    isJDLink ? JDMATCH_STATUS.EXTRACTING : JDMATCH_STATUS.ANALYZING
  );

  const jd = isJDLink
    ? await extractJD(event, {
        url: jd_data,
      })
    : await analyseIfTextStructureIsAJD(jd_data);

  await redisClient.set(redisKey, JDMATCH_STATUS.GENERATING);

  const data = await generateCandidateScore(event, {
    jd,
    candidateResumePath,
  });

  await saveJDMatchInfo({ jd, file_id: fileId, ...data });

  await redisClient.set(redisKey, JDMATCH_STATUS.MATCHED);

  await storage.removeItem(fileName);

  setResponseStatus(event, 200);

  return { message: "SUCCESS" };
});
