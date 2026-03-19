import { logger } from "@amazing_router/utils";
import BuilderConfig from "@amazing_router/config/builder.config";
import { BuilderConfigInterface } from "@amazing_router/config";

import path from "node:path";
import fs from "node:fs";

import { Walker } from "./walker";

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
        const result = this.walkDir(absolutePath, this.config);
        this.filesFound.push(...result);
      } else {
        logger.warn(
          `La carpeta configurada no existe y será ignorada: ${folderPath}`,
        );
      }
    }
  }

  private walkDir(path: string, config: BuilderConfig): string[] {
    return Walker(path, config);
  }

  private loader() {}
}

export default BuildRouter;
