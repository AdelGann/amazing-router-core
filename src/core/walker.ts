import fs from "node:fs";
import path from "node:path";
import BuilderConfig from "@amazing_router/config/builder.config";

export function Walker(dir: string, config: BuilderConfig): string[] {
  const filesFound: string[] = [];

  const excludedAbsolutePaths = config.excluded_paths
    ? config.excluded_paths.map((p) => path.resolve(process.cwd(), p))
    : [];

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
}
