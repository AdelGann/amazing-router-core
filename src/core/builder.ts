import { logger } from "@amazing_router/utils";
import { BuilderConfigInterface } from "@amazing_router/config";
import BuilderConfig from "@amazing_router/config/builder.config";

import path from "node:path";
import fs from "node:fs";

class BuildRouter {
  private config: BuilderConfig;
  private filesFound: string[] = [];

  constructor(userOptions?: BuilderConfigInterface) {
    this.config = new BuilderConfig(userOptions);
  }

  public build(): string {
    logger.info("Initializing router.");
    try {
      // scan folders from config;
      logger.success("Scanning directory");
      this.scanner();

      logger.success("Router initialized successfully!");
      logger.info("routes found: 20 new routes.");
    } catch (e) {
      logger.error("Something went wrong while building router", e);
      throw e;
    }
    return "";
  }

  private scanner() {
    this.filesFound = [];
    for (const folderPath of this.config.paths) {
      const absolutePath = path.resolve(process.cwd(), folderPath);

      if (fs.existsSync(absolutePath)) {
        this.walkDir(absolutePath);
      } else {
        logger.warn(
          `La carpeta configurada no existe y será ignorada: ${folderPath}`,
        );
      }
    }
  }
  private walkDir(arg: unknown) {}

  private loader() {}
}

export default BuildRouter;
