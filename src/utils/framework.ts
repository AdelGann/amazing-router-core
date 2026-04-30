import fs from "node:fs";
import path from "node:path";

export type Framework = "react" | "vue" | "unknown";

/**
 * Detects if the current project is using Vue or React
 * by inspecting the local package.json dependencies.
 */
export function detectFramework(): Framework {
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    if (!fs.existsSync(pkgPath)) return "unknown";
    
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    
    if (deps.vue) return "vue";
    if (deps.react || deps["react-dom"]) return "react";
    
    return "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Returns the appropriate file extension and boilerplate code
 * for the given framework and routing file type.
 */
export function getTemplateForFramework(
  framework: Framework, 
  type: string, 
  name: string
): { extension: string; content: string } {
  const isMiddleware = type === "middleware";
  
  if (isMiddleware) {
    return {
      extension: ".ts",
      content: `export default function middleware() {\n  // your middleware logic\n}\n`
    };
  }

  const componentName = type.charAt(0).toUpperCase() + type.slice(1);
  const displayName = name === "/" || name === "page" ? componentName.toLowerCase() : name;

  if (framework === "vue") {
    return {
      extension: ".vue",
      content: `<script setup lang="ts">\n</script>\n\n<template>\n  <div>${displayName}</div>\n</template>\n`
    };
  }

  // Default to React (.tsx) formatting
  return {
    extension: ".tsx",
    content: `export default function ${componentName}() {\n  return (\n    <div>${displayName}</div>\n  )\n}`
  };
}
