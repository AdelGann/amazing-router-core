import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import BuildRouter from "@amazing_router/core/builder";
import { logger } from "@amazing_router/utils";

describe("BuildRouter - Integration Test", () => {
  const TMP_APP_DIR = path.join(process.cwd(), ".temp-app");

  before(() => {
    fs.mkdirSync(path.join(TMP_APP_DIR, "about"), { recursive: true });
    fs.mkdirSync(path.join(TMP_APP_DIR, "dashboard/settings"), {
      recursive: true,
    });

    fs.writeFileSync(path.join(TMP_APP_DIR, "layout.tsx"), "");
    fs.writeFileSync(path.join(TMP_APP_DIR, "page.tsx"), "");
    fs.writeFileSync(path.join(TMP_APP_DIR, "about/page.tsx"), "");
    fs.writeFileSync(path.join(TMP_APP_DIR, "dashboard/settings/page.tsx"), "");
  });

  after(() => {
    fs.rmSync(TMP_APP_DIR, { recursive: true, force: true });
  });

  it("Should run the full pipeline and return a valid Route Tree", () => {
    const router = new BuildRouter({
      accepted_paths: [TMP_APP_DIR],
      accepted_extensions: ["tsx"],
    });

    const routeTree = router.build();

    logger.info("\n--- Final Integrated Tree ---");
    logger.info(JSON.stringify(routeTree, null, 2));

    assert.ok(Array.isArray(routeTree));
    assert.equal(routeTree[0].path, "/");

    const hasAbout = routeTree[0].children?.some((n) => n.path === "/about");
    assert.ok(hasAbout, "The tree should contain the /about route");
  });
});
