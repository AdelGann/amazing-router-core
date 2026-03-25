import fs from "node:fs";
import path from "node:path";
import { logger } from "../utils";

interface NewOptions {
  at: string;
}

/**
 * Handles the creation of new routing files (page, layout, etc.)
 */
export const createNewFile = (type: string, options: NewOptions): void => {
  const validTypes = ["page", "layout", "middleware"];

  if (!validTypes.includes(type)) {
    logger.error(`Invalid type: "${type}". Use: page, layout, or middleware.`);
    process.exit(1);
  }

  /** Assuming src/app as base, but could be dynamic from config */
  const targetDir = path.resolve(process.cwd(), "src/app", options.at);
  const extension = type === "middleware" ? ".ts" : ".tsx";
  const filePath = path.join(targetDir, `${type}${extension}`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(filePath)) {
    logger.warn(`File already exists: ${filePath}`);
    return;
  }

  const template = `/** Generated ${type} for ${options.at} */\nexport default function ${type.toUpperCase()}() { return null; }`;

  fs.writeFileSync(filePath, template);
  logger.success(`Created ${type} at ${options.at}`);
};
