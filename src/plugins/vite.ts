import { Plugin, ViteDevServer } from "vite";
import { BuilderConfigInterface } from "../types";
import fs from "node:fs";
import path from "node:path";
import BuildRouter from "@amazing_router/core/builder";

/**
 * Vite plugin for Amazing Router.
 * It automates the generation of the route tree during the build process
 * and watches for file changes during development.
 */
export function amazingRouterPlugin(options?: BuilderConfigInterface): Plugin {
  const router = new BuildRouter(options);
  const outputPath = path.resolve(process.cwd(), ".amazing-router/routes.json");

  const generate = () => {
    const tree = router.build();
    if (!fs.existsSync(path.dirname(outputPath))) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(tree, null, 2));
  };

  return {
    name: "vite-plugin-amazing-router",

    buildStart() {
      generate();
    },

    configureServer(server: ViteDevServer): void {
      server.watcher.on("add", (file: string) => {
        if (file.includes("page.tsx") || file.includes("layout.tsx")) {
          generate();
          server.ws.send({ type: "full-reload" });
        }
      });

      server.watcher.on("unlink", (file: string) => {
        if (file.includes("page.tsx") || file.includes("layout.tsx")) {
          generate();
          server.ws.send({ type: "full-reload" });
        }
      });
    },
  };
}
