/**
 * Amazing Router - File-System Based Routing Core
 * @author Adel Gannem a.k.a im_adelg
 */

/** Core Logic */
export { default as BuildRouter } from "./core/builder";
export { default as RouteParser } from "./core/parser";
export { default as RouterBuilder } from "./core/router";
export { Walker } from "./core/walker";

/** Build Tool Plugins */
export { amazingRouterPlugin } from "./plugins/vite";
export { AmazingRouterPlugin } from "./plugins/webpack";

/** Configuration & Types */
export { default as BuilderConfig } from "./config/builder.config";
export * from "./types";
