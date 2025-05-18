import findJDMatchInfo from "~/shared/ai/jd/findJDMatchInfo";

export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, "fileId");
  const data = await findJDMatchInfo({
    fileId: fileId,
    select: "file_id, jd, score, missing_skills, matching_skills, explanation",
  });
  return data;
});
