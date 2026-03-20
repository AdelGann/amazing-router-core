import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import RouterBuilder from "@amazing_router/core/router";
import { RouteNode } from "@amazing_router/types";
import { logger } from "@amazing_router/utils";

describe("RouterBuilder - Unit Tests", () => {
  let builder: RouterBuilder;

  beforeEach(() => {
    builder = new RouterBuilder();
  });

  it("Should nest a child route under its direct parent", () => {
    const flatNodes: RouteNode[] = [
      { id: "root", path: "/" },
      { id: "about", path: "/about" },
    ];

    const tree = builder.buildTree(flatNodes);

    logger.info("\n--- Tree Result: Simple Nesting ---");
    logger.info(JSON.stringify(tree, null, 2));

    assert.equal(tree.length, 1);
    assert.equal(tree[0].path, "/");
    assert.equal(tree[0].children?.length, 1);
    assert.equal(tree[0].children![0].id, "about");
  });

  it("Should handle deep nesting and multiple siblings", () => {
    const flatNodes: RouteNode[] = [
      { id: "root", path: "/" },
      { id: "dashboard", path: "/dashboard" },
      { id: "settings", path: "/dashboard/settings" },
      { id: "profile", path: "/dashboard/settings/profile" },
    ];

    const tree = builder.buildTree(flatNodes);

    logger.info("\n--- Tree Result: Deep Nesting ---");
    logger.info(JSON.stringify(tree, null, 2));

    const dashboard = tree[0].children?.find((n) => n.id === "dashboard");
    assert.ok(dashboard);

    const settings = dashboard.children?.find((n) => n.id === "settings");
    assert.ok(settings);

    assert.equal(settings.children?.length, 1);
    assert.equal(settings.children![0].id, "profile");
  });
});
