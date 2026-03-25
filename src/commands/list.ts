import BuildRouter from "@amazing_router/core/builder";
import { RouteNode } from "../types";
import { logger } from "../utils";
import picocolors from "picocolors";

/**
 * Recursively renders the route tree in a visual terminal format.
 */
const renderTree = (
  nodes: RouteNode[],
  indent: string = "",
  isLast: boolean = true,
): string => {
  let result = "";

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const lastChild = i === nodes.length - 1;
    const branch = lastChild ? "└── " : "├── ";

    /** Colorize different parts: Path in blue, ID in gray */
    const label = `${picocolors.blue(node.path)} ${picocolors.gray(`(${node.id})`)}`;
    result += `${indent}${branch}${label}\n`;

    if (node.children && node.children.length > 0) {
      const newIndent = indent + (lastChild ? "    " : "│   ");
      result += renderTree(node.children, newIndent, lastChild);
    }
  }

  return result;
};

/**
 * Command: list
 * Scans the project and displays a beautiful tree of the current routes.
 */
export const listRoutes = (): void => {
  try {
    const router = new BuildRouter();
    const tree = router.build();

    if (tree.length === 0) {
      logger.warn(
        "No routes found. Try running 'amazing init' or check your config.",
      );
      return;
    }

    console.log(`\n${picocolors.bold("Mapped Route Hierarchy:")}`);
    console.log(picocolors.gray("-------------------------"));
    console.log(renderTree(tree));
    console.log(picocolors.gray("-------------------------"));
    logger.success(`Total root nodes: ${tree.length}`);
  } catch (error) {
    logger.error(
      "Failed to list routes. Make sure your config and paths are correct.",
    );
  }
};
