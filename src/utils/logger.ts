// src/utils/logger.ts
import pc from "picocolors";

const PREFIX = pc.dim("[Amazing Router]");

export const logger = {
  info(message: string) {
    console.log(`${PREFIX} ${pc.blue("ℹ")} ${message}`);
  },
  success(message: string) {
    console.log(`${PREFIX} ${pc.green("✔")} ${message}`);
  },
  warn(message: string) {
    console.warn(`${PREFIX} ${pc.yellow("⚠")} ${pc.yellow(message)}`);
  },
  error(message: string, error?: unknown) {
    console.error(`${PREFIX} ${pc.red("✖")} ${pc.red(message)}`);
    if (error instanceof Error && error.stack) {
      console.error(pc.dim(error.stack));
    }
  },
};
