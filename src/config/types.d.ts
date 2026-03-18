export interface BuilderConfigInterface {
  // accepted files for the router, for example: ["js", "ts", "tsx", "jsx"] || "tsx"
  accepted_extensions?: string | string[];

  // accepted paths for the router, for example: ["src/app", "src/pages"] || "src/pages",
  accepted_paths?: string | string[];

  // exclude paths for the router, for example: ["src/app/excluded_folder/**", "src/app/excluded_file/file.{extension}"] || "src/app/excluded_file/file.{extension}"
  excluded_paths?: string | string[];
}
