interface JDMatchInfo extends IGenerateCandidateScoreData {
  file_id: string;
  jd: string;
}

export default async function (info: JDMatchInfo) {
  const res = await supabase.from("jd_match_dtl").insert([info]);

  if (res.error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to insert data into Supabase",
    });
}
