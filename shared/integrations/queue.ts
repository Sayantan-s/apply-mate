import { Client } from "@upstash/qstash";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Task {
  private static client: Client | null = null;

  private constructor() {}

  public static get instance() {
    if (!Task.client) {
      const config = useRuntimeConfig();
      const token = config.QSTASH_TOKEN as string;
      if (!token) {
        throw new Error("QSTASH_TOKEN is not defined in runtime config");
      }
      Task.client = new Client({ token });
    }
    return Task.client;
  }
}
