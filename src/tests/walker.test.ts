import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import BuilderConfig from "@amazing_router/config/builder.config";
import { Walker } from "@amazing_router/core";
import { logger } from "@amazing_router/utils";

describe("Walker - File System Scanner", () => {
  const TEST_DIR = path.join(process.cwd(), ".temp-walker-test");

  before(() => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    fs.mkdirSync(path.join(TEST_DIR, "usuarios"));
    fs.mkdirSync(path.join(TEST_DIR, "utils"));

    fs.writeFileSync(path.join(TEST_DIR, "page.tsx"), "// mock root page");
    fs.writeFileSync(
      path.join(TEST_DIR, "usuarios", "layout.tsx"),
      "// mock layout",
    );
    fs.writeFileSync(
      path.join(TEST_DIR, "usuarios", "styles.css"),
      "/* mock css */",
    );
    fs.writeFileSync(
      path.join(TEST_DIR, "utils", "helper.ts"),
      "// mock helper",
    );
  });

  after(() => {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("Should scan correctly, respecting extensions and path exclusions", () => {
    const mockConfig = {
      accepted_paths: [TEST_DIR],
      accepted_extensions: ["ts", "tsx"],
      excluded_paths: [path.join(TEST_DIR, "utils")],
    };

    const config = new BuilderConfig(mockConfig);
    const results = Walker(TEST_DIR, config);

    logger.info("\n--- Walker Test Result: Files Found ---");
    results.forEach((file) => logger.info(` -> ${file}`));

    assert.equal(results.length, 2, "Should only find 2 valid routing files");

    const hasRootPage = results.some((r) => r.endsWith("page.tsx"));
    const hasUsersLayout = results.some((r) => r.endsWith("layout.tsx"));

    assert.equal(hasRootPage, true, "Should find the root page.tsx");
    assert.equal(hasUsersLayout, true, "Should find the usuarios/layout.tsx");

    const hasCss = results.some((r) => r.endsWith("styles.css"));
    const hasExcludedHelper = results.some((r) => r.endsWith("helper.ts"));

    assert.equal(hasCss, false, "Should completely ignore .css files");
    assert.equal(
      hasExcludedHelper,
      false,
      "Should completely ignore files in the utils directory",
    );
  });
});
