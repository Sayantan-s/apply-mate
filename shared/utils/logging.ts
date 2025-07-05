import winston from "winston";
import crypto from "node:crypto";
const { combine, timestamp } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp()),
  transports: [new winston.transports.Console()],
});

export class Logging {
  id: string;
  logger: winston.Logger;
  private static instance: Logging | undefined;
  constructor(loggerId?: string) {
    this.id = loggerId || crypto.randomUUID();
    this.logger = logger.child({ requestId: this.id });
  }

  static get client() {
    if (!Logging.instance?.id) Logging.instance = new Logging();
    return Logging.instance;
  }

  init(loggerId: string) {
    Logging.instance = new Logging(loggerId);
  }
}
