import { Compiler } from "webpack";
import BuildRouter from "@amazing_router/core/builder";
import { BuilderConfigInterface, RouteNode } from "../types";
import fs from "node:fs";
import path from "node:path";

/**
 * Webpack plugin for Amazing Router.
 * It synchronizes the file system with the routing tree during the
 * Webpack compilation lifecycle.
 */
export class AmazingRouterPlugin {
  private router: BuildRouter;
  private outputPath: string;

  /**
   * @param options - Configuration for the route builder (paths, extensions, etc.)
   */
  constructor(options?: BuilderConfigInterface) {
    this.router = new BuildRouter(options);
    this.outputPath = path.resolve(
      process.cwd(),
      ".amazing-router/routes.json",
    );
  }

  /**
   * The entry point for the Webpack plugin system.
   * @param compiler - The Webpack compiler instance.
   */
  public apply(compiler: Compiler): void {
    /**
     * Internal helper to trigger the route generation logic.
     */
    const generate = (): void => {
      const tree: RouteNode[] = this.router.build();

      const dir = path.dirname(this.outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.outputPath, JSON.stringify(tree, null, 2));
    };

    /**
     * Hook: run
     * Triggered for standard production builds.
     */
    compiler.hooks.run.tap("AmazingRouterWebpackPlugin", (): void => {
      generate();
    });

    /**
     * Hook: watchRun
     * Triggered during development (webpack --watch) when a file changes.
     */
    compiler.hooks.watchRun.tap("AmazingRouterWebpackPlugin", (): void => {
      generate();
    });
  }
}
