import findJDMatchInfo from "~/shared/ai/jd/findJDMatchInfo";

export default defineEventHandler(async (event) => {
  const params = getQuery(event);
  const { fileId } = params;
  const data = await findJDMatchInfo({
    fileId: fileId as string,
    select: "file_id, jd, score, missing_skills, matching_skills, explanation",
  });
  return data;
});
