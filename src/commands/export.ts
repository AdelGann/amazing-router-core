import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils";
import picocolors from "picocolors";
import BuildRouter from "@amazing_router/core/builder";

interface ExportOptions {
  out?: string;
  pretty?: boolean;
}

/**
 * Command: export
 * Exports the generated route tree to a JSON format.
 */
export const exportRoutes = (options: ExportOptions): void => {
  try {
    const router = new BuildRouter();
    const tree = router.build();

    const jsonOutput = JSON.stringify(tree, null, options.pretty ? 2 : 0);

    if (options.out) {
      const outputPath = path.resolve(process.cwd(), options.out);
      const dir = path.dirname(outputPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(outputPath, jsonOutput);
      logger.success(`Route tree exported to: ${picocolors.cyan(outputPath)}`);
      return;
    }

    console.log(jsonOutput);
  } catch (error) {
    logger.error("Failed to export route tree.");
    if (error instanceof Error) logger.info(error.message);
  }
};
