import { RouteNode } from "../types";

/**
 * RouterBuilder is the orchestrator responsible for transforming a flat array
 * of RouteNodes into a hierarchical tree structure.
 * It resolves parent-child relationships based on URL segment depth.
 */
export default class RouterBuilder {
  /**
   * Assembles a nested route tree from a flat list of nodes.
   * Processes each node to find its correct parent or marks it as a new root.
   * Handles two special cases:
   *   1. Group layout nodes (virtual key starting with "__group__") → pathless wrappers
   *   2. Regular nodes inside a group folder → nest under the group layout wrapper
   *
   * @param flatNodes - The array of grouped nodes provided by the RouteParser.
   * @returns A root-level array containing the hierarchical route tree.
   */
  public buildTree(flatNodes: RouteNode[]): RouteNode[] {
    const sortedNodes = [...flatNodes].sort((a, b) => {
      const aDepth = !a.path || a.path === "/" ? 0 : a.path.split("/").length;
      const bDepth = !b.path || b.path === "/" ? 0 : b.path.split("/").length;
      return aDepth - bDepth;
    });

    const nodeMap = new Map<string, RouteNode>();
    const virtualKeyMap = new Map<string, RouteNode>(); // __group__ key → node
    const tree: RouteNode[] = [];

    for (const node of sortedNodes) {
      node.children = [];
      if (node.path !== undefined) {
        nodeMap.set(node.path, node);
      }
    }

    // First pass: index group layout nodes by their virtual key
    for (const raw of flatNodes) {
      // The routeMap in parser uses virtual keys starting with __group__ as the map key,
      // but we need to find them. We stored them with path=undefined.
      // We re-derive the group key by inspecting layoutPath.
      if (raw.layoutPath && !raw.pagePath && raw.path === undefined) {
        virtualKeyMap.set(this.deriveGroupKey(raw.layoutPath), raw);
      }
    }

    for (const node of sortedNodes) {
      if (node.path === "/") {
        tree.push(node);
        continue;
      }

      // Group layout wrapper node (path is undefined → pathless route)
      if (node.path === undefined) {
        const groupKey = this.deriveGroupKey(node.layoutPath!);
        const parentPath = this.extractGroupParentPath(groupKey);
        if (parentPath !== null && nodeMap.has(parentPath)) {
          nodeMap.get(parentPath)!.children!.push(node);
        } else {
          tree.push(node);
        }
        continue;
      }

      // Regular node: check if it belongs to a group with a layout wrapper
      const absolutePath = node.layoutPath || node.pagePath;
      const groupNode = this.findGroupParent(absolutePath, virtualKeyMap);

      if (groupNode) {
        groupNode.children!.push(node);
        continue;
      }

      // Standard parent resolution
      const parentPath = this.findClosestParent(node.path, nodeMap, absolutePath);

      if (parentPath && nodeMap.has(parentPath)) {
        const parent = nodeMap.get(parentPath)!;
        parent.children!.push(node);
      } else {
        tree.push(node);
      }
    }

    return tree;
  }

  /**
   * Derives a virtual group key from the absolute layout path.
   * For "(auth)/layout.tsx", the key would be "__group__/(auth)".
   * This mirrors what the parser generates so we can cross-reference.
   */
  private deriveGroupKey(absoluteLayoutPath: string): string {
    const normalized = absoluteLayoutPath.replace(/\\/g, "/");
    const parts = normalized.split("/");
    parts.pop(); // remove "layout.tsx"
    const groupFolder = parts[parts.length - 1]; // e.g. "(auth)"
    // Not a group layout
    if (!groupFolder || !/^\(.*\)$/.test(groupFolder)) return "";
    // Rebuild parent path (everything before the group folder, excluding groups)
    const prior = parts.slice(0, -1).filter((seg) => !/^\(.*\)$/.test(seg));
    const priorPath = prior.length ? "/" + prior.join("/") : "/";
    return `__group__${priorPath}/${groupFolder}`;
  }

  /**
   * Extracts the real parent URL path from a virtual group key.
   * "__group__/(auth)"     → "/"
   * "__group__/dashboard/(auth)" → "/dashboard"
   */
  private extractGroupParentPath(groupKey: string): string | null {
    if (!groupKey.startsWith("__group__")) return null;
    const withoutPrefix = groupKey.replace("__group__", ""); // "/(auth)" or "/dashboard/(auth)"
    const lastSlash = withoutPrefix.lastIndexOf("/");
    const parentPath = withoutPrefix.substring(0, lastSlash) || "/";
    return parentPath;
  }

  /**
   * Looks for a group layout wrapper node that covers the given file path.
   * Returns the RouteNode of the group layout if found, or null.
   */
  private findGroupParent(
    absoluteFilePath?: string,
    virtualKeyMap?: Map<string, RouteNode>,
  ): RouteNode | null {
    if (!absoluteFilePath || !virtualKeyMap || virtualKeyMap.size === 0)
      return null;

    const normalized = absoluteFilePath.replace(/\\/g, "/");

    for (const [groupKey, groupNode] of virtualKeyMap) {
      // The group key encodes the group folder, e.g. "__group__/(auth)"
      // Extract the group folder name: "(auth)"
      const withoutPrefix = groupKey.replace("__group__", "");
      const lastSegment = withoutPrefix.split("/").pop(); // "(auth)"
      if (lastSegment && normalized.includes(`/${lastSegment}/`)) {
        return groupNode;
      }
    }

    return null;
  }

  /**
   * Determines if a file represents the root of a Route Group.
   */
  private isGroupRoot(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");

    const fileName = parts.pop();
    const folderName = parts.pop();

    return (
      (fileName?.startsWith("layout") &&
        folderName?.startsWith("(") &&
        folderName?.endsWith(")")) ||
      false
    );
  }

  /**
   * Recursively trims the current URL path to find the nearest existing parent node.
   */
  private findClosestParent(
    currentPath: string,
    nodeMap: Map<string, RouteNode>,
    absoluteFilePath?: string,
  ): string | null {
    if (absoluteFilePath && absoluteFilePath.includes("(")) {
      if (this.isGroupRoot(absoluteFilePath)) {
        return null;
      }
    }

    const segments = currentPath.split("/").filter(Boolean);
    while (segments.length > 0) {
      segments.pop();
      const potentialParent = "/" + segments.join("/");
      const cleanParent = potentialParent === "//" ? "/" : potentialParent;

      if (nodeMap.has(cleanParent)) return cleanParent;
    }

    return nodeMap.has("/") ? "/" : null;
  }
}
