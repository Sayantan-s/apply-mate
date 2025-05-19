import { Stagehand } from "@browserbasehq/stagehand";
import { LLM } from "./llm";

interface IBrowsingAgentProps {
  apiKey: string;
  executablePath: string;
  model?: string;
}

export default async function ({
  apiKey,
  executablePath,
  model = LLM.model.gemini.FLASH_V2,
}: IBrowsingAgentProps) {
  const stagehand = new Stagehand({
    env: "LOCAL",
    modelName: model,
    modelClientOptions: {
      apiKey,
    },
    localBrowserLaunchOptions: {
      executablePath,
      headless: true,
    },
  });

  await stagehand.init();

  return {
    page: stagehand.page,
    close: async () => {
      await stagehand.close();
    },
  };
}
