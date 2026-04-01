import path from "node:path";
import { RouteNode } from "../types";
import { FOLDER_PATTERNS } from "../utils/variables";
import { extractMetadata } from "@amazing_router/utils/extractMetaData";

/**
 * RouteParser is responsible for transforming raw file system paths into
 * structured RouteNode objects. It handles URL normalization, dynamic
 * segment transformation, and grouping of related routing files.
 */
export default class RouteParser {
  private baseDir: string;
  private routeMap: Map<string, RouteNode>;

  /**
   * @param baseDir - The absolute path to the application's root directory (e.g., src/app).
   */
  constructor(baseDir: string) {
    this.baseDir = baseDir;
    this.routeMap = new Map();
  }

  /**
   * Main entry point for the parsing logic.
   * Processes a list of absolute file paths and returns an array of unique RouteNodes.
   * * @param files - Array of absolute file paths found by the Walker.
   * @returns An array of uniquely grouped RouteNode objects.
   */
  public parse(files: string[]): RouteNode[] {
    for (const file of files) {
      this.processFile(file);
    }

    return Array.from(this.routeMap.values());
  }

  /**
   * Handles the classification of a single file and its association with a route.
   * If the route does not exist in the map, a new RouteNode is initialized.
   * * @param absolutePath - The full system path of the file being processed.
   */
  private processFile(absolutePath: string): void {
    const webPath = this.buildWebPath(absolutePath);
    const parsedPath = path.parse(absolutePath);
    const fileName = parsedPath.name;

    let routeNode = this.routeMap.get(webPath);
    if (!routeNode) {
      routeNode = {
        id: this.generateRouteId(webPath),
        path: webPath.startsWith("__group__") ? undefined : webPath,
        meta: {},
      };
      this.routeMap.set(webPath, routeNode);
    }

    if (fileName === "page" || fileName === "layout") {
      const newMeta = extractMetadata(absolutePath);

      routeNode.meta = {
        ...routeNode.meta,
        ...newMeta,
      };
    }

    switch (fileName) {
      case "page":
        routeNode.pagePath = absolutePath;
        break;
      case "layout":
        routeNode.layoutPath = absolutePath;
        break;
      case "middleware":
        routeNode.middlewarePath = absolutePath;
        break;
      // ... otros casos
    }
  }

  /**
   * Transforms a physical file system path into a clean web-standard URL.
   * Special case: layout.tsx files directly inside a route group folder (e.g., (auth)/layout.tsx)
   * return a virtual key like "__group__/(auth)" to avoid colliding with their parent URL,
   * and to allow the tree builder to wire them as pathless layout wrappers.
   */
  private buildWebPath(absolutePath: string): string {
    const webPath: string[] = [];

    const normalizedRelative = path
      .relative(this.baseDir, absolutePath)
      .replace(/\\/g, "/");

    const relativePath: string[] = normalizedRelative.split("/");

    relativePath.pop(); // remove filename

    const fileName = path.parse(absolutePath).name;

    // If a layout.tsx lives directly inside a group folder, it's a group layout wrapper.
    // Give it a virtual key so it doesn't overwrite the parent URL node.
    if (fileName === "layout" && relativePath.length > 0) {
      const directParent = relativePath[relativePath.length - 1];
      if (FOLDER_PATTERNS.group.test(directParent)) {
        // Virtual key: __group__(auth) — unique per group folder name
        return `__group__${directParent}`;
      }
    }

    for (const item of relativePath) {
      if (FOLDER_PATTERNS.group.test(item)) continue;

      if (FOLDER_PATTERNS.catchAll.test(item)) {
        const paramName = item.slice(4, -1);
        webPath.push(`*${paramName}`);
        continue;
      }

      if (FOLDER_PATTERNS.dynamic.test(item)) {
        const paramName = item.slice(1, -1);
        webPath.push(`:${paramName}`);
        continue;
      }

      webPath.push(item);
    }

    const finalUrl = "/" + webPath.filter(Boolean).join("/");

    return finalUrl === "//" ? "/" : finalUrl;
  }

  /**
   * Generates a unique, URL-safe string identifier for a specific route.
   * * @example "/users/:id" -> "users-id"
   * @param webPath - The normalized web URL.
   * @returns A kebab-case string ID.
   */
  private generateRouteId(webPath: string): string {
    return webPath
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .join("-");
  }
}
