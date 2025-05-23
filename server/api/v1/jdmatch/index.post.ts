import Task from "~/shared/integrations/queue";
import { randomBytes } from "crypto";
import { store } from "~/shared/utils/cache";

export default defineEventHandler(async (event) => {
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

  await Task.instance.publishJSON({
    url: targetUrl,
    method: "POST",
    body: info,
  });

  await store.set(fileId, {
    status: JDMATCH_STATUS.QUEUED,
  });

  setResponseStatus(event, 200, "Task Created");

  return { fileId };
});
