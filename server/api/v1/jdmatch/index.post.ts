import Task from "~/shared/integrations/queue";
import { randomBytes } from "crypto";
import { store } from "~/shared/utils/cache";

export default defineEventHandler(async (event) => {
<<<<<<< Updated upstream
=======
  Logging.client.logger.info(`starting jdmatch()`);
>>>>>>> Stashed changes
  const runtimeConfig = useRuntimeConfig(event);
  const API_URL = runtimeConfig.API_URL as string;
  const fileId = randomBytes(16).toString("hex");

  await store.set(fileId, {
    status: JDMATCH_STATUS.PARSING,
  });

  const { info } = await parseJDInformation(event, {
    fileId,
  });

<<<<<<< Updated upstream
  const targetUrl = `${API_URL}/jdmatch/consumer`;

=======
  const headers = {
    "x-logging-id": Logging.client.id,
  };

  const targetUrl = `${API_URL}/jdmatch/consumer`;

  Logging.client.logger.info(`Publishing task of ${fileId}`);
>>>>>>> Stashed changes
  await Task.instance.publishJSON({
    url: targetUrl,
    method: "POST",
    body: info,
  });
<<<<<<< Updated upstream
=======
  Logging.client.logger.info(`Published task of ${fileId}`);
>>>>>>> Stashed changes

  await store.set(fileId, {
    status: JDMATCH_STATUS.QUEUED,
  });

  setResponseStatus(event, 200, "Task Created");

<<<<<<< Updated upstream
=======
  Logging.client.logger.info(`ending jdmatch()`);
>>>>>>> Stashed changes
  return { fileId };
});
