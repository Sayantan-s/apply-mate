import { Media } from "~/shared/utils/media";

interface IReqBody {
  url: string;
}

export default defineEventHandler(async (event) => {
  Logging.client.logger.info(`starting downloadFile()`);
  const { url } = await readBody<IReqBody>(event);
  await Media.file.download(url, "");
  Logging.client.logger.info(`ending downloadFile()`);
  return { url };
});
