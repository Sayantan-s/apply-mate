import Task from "~/shared/integrations/queue";
import { randomBytes } from "crypto";
import { store } from "~/shared/utils/cache";
import { Logging } from "~/shared/utils/logging";

export default defineEventHandler(async (event) => {
  Logging.client.logger.info(`starting jdmatch()`);
  const runtimeConfig = useRuntimeConfig(event);
  const API_URL = runtimeConfig.API_URL as string;
  const fileId = randomBytes(16).toString("hex");

  await store.set(fileId, {
    status: JDMATCH_STATUS.PARSING,
  });

  const { info } = await parseJDInformation(event, {
    fileId,
  });

  const targetUrl = `${API_URL}/jdmatch/consumer`;

  const headers = {
    "x-logging-id": Logging.client.id,
  };

  Logging.client.logger.info(`Publishing task of ${fileId}`);

  await Task.instance.publishJSON({
    url: targetUrl,
    method: "POST",
    body: info,
    headers,
  });

  Logging.client.logger.info(`Published task of ${fileId}`);

  await store.set(fileId, {
    status: JDMATCH_STATUS.QUEUED,
  });

  setResponseStatus(event, 200, "Task Created");
  Logging.client.logger.info(`ending jdmatch()`);
  return { fileId };
});
