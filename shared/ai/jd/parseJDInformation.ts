import type { H3Event, EventHandlerRequest } from "h3";
import path from "path";

interface IParseConfig {
  fileId: string;
}

export default async function (
  event: H3Event<EventHandlerRequest>,
  config: IParseConfig
) {
  const formData = await readMultipartFormData(event);

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No files uploaded",
    });
  }

  const [url, file] = formData;

  const storage = useStorage("uploads");

  const fileName = `${config.fileId}-${file.filename}`;

  await storage.setItemRaw(`${fileName}`, file.data);

  const rootProjectPath = process.cwd();

  const candidateResumePath = path.resolve(
    rootProjectPath,
    "public",
    "uploads",
    fileName
  );

  const JD_URL = url.data.toString("utf-8");

  return {
    info: {
      candidateResumePath,
      JD_URL,
      fileName,
    },
  };
}
