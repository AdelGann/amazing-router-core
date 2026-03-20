import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import RouteParser from "@amazing_router/core/parser";
import RouterBuilder from "@amazing_router/core/router";
import { logger } from "@amazing_router/utils";

describe("RouteBuilder - Tree Assembly", () => {
  let parser: RouteParser;
  let builder: RouterBuilder;
  const MOCK_BASE_DIR = path.normalize("C:/proyecto/src/app");

  beforeEach(() => {
    parser = new RouteParser(MOCK_BASE_DIR);
    builder = new RouterBuilder();
  });

  it("Should assemble a nested tree from flat about and dashboard routes", () => {
    const files = [
      path.normalize("C:/proyecto/src/app/layout.tsx"),
      path.normalize("C:/proyecto/src/app/page.tsx"),
      path.normalize("C:/proyecto/src/app/about/page.tsx"),
      path.normalize("C:/proyecto/src/app/dashboard/page.tsx"),
      path.normalize("C:/proyecto/src/app/dashboard/settings/page.tsx"),
    ];

    const flatNodes = parser.parse(files);

    const tree = builder.buildTree(flatNodes);

    logger.info("\n--- Final Route Tree Structure ---");
    logger.info(JSON.stringify(tree, null, 2));
    assert.equal(tree.length, 1);
    assert.equal(tree[0].path, "/");

    assert.equal(tree[0].children?.length, 2);

    const dashboardNode = tree[0].children?.find(
      (n) => n.path === "/dashboard",
    );
    assert.ok(dashboardNode);
    assert.equal(dashboardNode.children?.length, 1);
    assert.equal(dashboardNode.children![0].path, "/dashboard/settings");

    logger.success("Tree assembly verified: Hierarchy is correct.");
  });
});
