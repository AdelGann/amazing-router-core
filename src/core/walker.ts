import fs from "node:fs";
import path from "node:path";
import BuilderConfig from "@amazing_router/config/builder.config";
import { ADMIT_FILE_NAME } from "@amazing_router/utils";

/**
 * Recursively traverses the file system starting from a given directory to collect
 * valid routing files.
 * * This scanner acts as the primary file-system engine for the router. It filters out
 * explicitly excluded paths, strictly enforces accepted file extensions, and evaluates
 * file and folder names against the router's internal conventions (e.g., ensuring files
 * are named "page", "layout", "middleware", etc., and identifying dynamic folder patterns).
 *
 * @param dir - The absolute path of the directory where the scan begins.
 * @param config - The normalized builder configuration containing accepted extensions and excluded paths.
 * @returns An array of absolute file paths that passed all exclusion, extension, and convention filters.
 */
export const Walker = (dir: string, config: BuilderConfig): string[] => {
  const filesFound: string[] = [];

  // Convert excluded relative paths to absolute paths once before scanning
  const excludedAbsolutePaths = config.excluded_paths
    ? config.excluded_paths.map((p) => path.resolve(process.cwd(), p))
    : [];

  /**
   * Internal recursive function to explore directories.
   * Modifies the outer `filesFound` array directly.
   */
  function exploreDir(currentDir: string): void {
    const elements = fs.readdirSync(currentDir);

    for (const element of elements) {
      const absoluteDir = path.join(currentDir, element);

      const isExcluded = excludedAbsolutePaths.some((excludedPath) => {
        if (absoluteDir === excludedPath) return true;
        if (absoluteDir.startsWith(excludedPath + path.sep)) return true;
        return false;
      });

      if (isExcluded) {
        continue;
      }

      const stat = fs.statSync(absoluteDir);

      if (stat.isFile()) {
        const extension = path.extname(absoluteDir).slice(1);
        const fileName = path.parse(absoluteDir).name;
        const isValidFile = ADMIT_FILE_NAME.includes(fileName);

        if (!isValidFile) {
          continue;
        }

        if (config.extensions?.includes(extension)) {
          filesFound.push(absoluteDir);
        }
      }

      if (stat.isDirectory()) {
        exploreDir(absoluteDir);
      }
    }
  }

  exploreDir(dir);

  return filesFound;
};
