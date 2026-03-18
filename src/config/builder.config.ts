import { logger } from "@amazing_router/utils";
import { BuilderConfigInterface } from "./types";

// default config
const builder_config: BuilderConfigInterface = {
  accepted_paths: ["./src/app", "./src/pages", "./src/views"],
  accepted_extensions: ["js", "ts", "tsx", "jsx", "vue"],
  excluded_paths: [],
};

class BuilderConfig {
  private _paths: string[];
  private _extensions: string[];
  private _excluded_paths: string[];

  constructor(config?: BuilderConfigInterface) {
    const initPaths = config?.accepted_paths || builder_config.accepted_paths!;
    const initExtensions =
      config?.accepted_extensions || builder_config.accepted_extensions!;
    const initExcludedPaths =
      config?.excluded_paths || builder_config.excluded_paths!;

    const normalizedPaths =
      typeof initPaths === "string" ? [initPaths] : initPaths;
    const normalizedExtensions =
      typeof initExtensions === "string" ? [initExtensions] : initExtensions;
    const normalizedExcluded =
      typeof initExcludedPaths === "string"
        ? [initExcludedPaths]
        : initExcludedPaths;

    this.validatePaths(normalizedPaths);
    this.validateExtensions(normalizedExtensions);
    this.validateExcludedPaths(normalizedExcluded);

    this._paths = normalizedPaths;
    this._extensions = normalizedExtensions;
    this._excluded_paths = normalizedExcluded;
  }

  private validateFormat(name: string, arr: unknown[]) {
    const isValid = arr.every((item) => typeof item === "string");
    if (!isValid) {
      const msj = `Error de configuración: '${name}' debe contener solo strings.`;
      logger.error(msj);
      throw new Error(msj);
    }
  }

  get paths(): string[] {
    return this._paths;
  }

  set paths(new_path: string | string[]) {
    const normalized = typeof new_path === "string" ? [new_path] : new_path;
    this.validatePaths(normalized);
    this._paths = normalized;
  }

  get extensions(): string[] {
    return this._extensions;
  }

  set extensions(new_extensions: string | string[]) {
    const normalized =
      typeof new_extensions === "string" ? [new_extensions] : new_extensions;
    this.validateExtensions(normalized);
    this._extensions = normalized;
  }

  get excluded_paths(): string[] {
    return this._excluded_paths;
  }

  set excluded_paths(new_path: string | string[]) {
    const normalized = typeof new_path === "string" ? [new_path] : new_path;
    this.validateExcludedPaths(normalized);
    this._excluded_paths = normalized;
  }

  private validatePaths(paths: any[]) {
    this.validateFormat("accepted_paths", paths);
  }

  private validateExtensions(extensions: any[]) {
    this.validateFormat("accepted_extensions", extensions);
  }

  private validateExcludedPaths(paths: any[]) {
    this.validateFormat("excluded_paths", paths);
  }
}

export default BuilderConfig;
