import Task from "~/shared/integrations/queue";
import { randomBytes } from "crypto";
import { store } from "~/shared/utils/cache";
import { Logging } from "~/shared/utils/logging";

export default defineEventHandler(async (event) => {
  const { id: loggerId, logger } = Logging.client;
  logger.info(`starting jdmatch()`);
  const runtimeConfig = useRuntimeConfig(event);
  const API_URL = runtimeConfig.API_URL as string;
  const fileId = randomBytes(16).toString("hex");

  await store.set(fileId, {
    status: JDMATCH_STATUS.PARSING,
  });

  const { info } = await parseJDInformation(event, {
    fileId,
  });

  const headers = {
    "x-logging-id": loggerId,
  };

  const targetUrl = `${API_URL}/jdmatch/consumer`;

  logger.info(`Publishing task of ${fileId}`);
  await Task.instance.publishJSON({
    url: targetUrl,
    method: "POST",
    body: info,
    headers,
  });
  logger.info(`Published task of ${fileId}`);

  await store.set(fileId, {
    status: JDMATCH_STATUS.QUEUED,
  });

  setResponseStatus(event, 200, "Task Created");

  logger.info(`ending jdmatch()`);
  return { fileId };
});
