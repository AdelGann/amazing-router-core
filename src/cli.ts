#!/usr/bin/env node

/**
 * Amazing Router CLI - Orchestrator
 * * This file serves as the main entry point for the Command Line Interface.
 * Built with 'cac', it delegates specific routing logic to specialized
 * command handlers, maintaining a clean and scalable architecture.
 * * @module CLI
 * @author Adel Gannem
 */

import { cac } from "cac";
import { initializeProject } from "./commands/init";
import { createNewFile } from "./commands/new";
import { listRoutes } from "./commands/list";
import { exportRoutes } from "./commands/export";

/**
 * Initialize CAC (Command And Conquer) instance.
 * The 'amazing' name will be used as the binary command prefix.
 */
const cli = cac("amazing");

/**
 * Command: init
 * Sets up the project environment by creating 'amazing.config.ts'
 * and the internal '.amazing-router' directory.
 */
cli
  .command("init", "Initialize a new amazing-router project")
  .action(initializeProject);

/**
 * Command: new <type>
 * Scaffolds new routing files (page, layout, or middleware).
 * @param type - The file category (page | layout | middleware).
 * @option --at - The relative directory path from the app root.
 */
cli
  .command("new <type>", "Generate a new routing file")
  .option("--at <path>", "Directory path for the file", { default: "/" })
  .action(createNewFile);

/**
 * Command: list
 * Triggers the RouteBuilder to scan the file system and renders
 * a visual tree hierarchy directly in the terminal.
 */
cli
  .command("list", "Show a visual representation of the current route tree")
  .action(listRoutes);

/**
 * Command: export
 * Serializes the current route tree into a JSON structure.
 * Supports file output (-o) and human-readable formatting (-p).
 */
cli
  .command("export", "Export the route tree to JSON format")
  .option("-o, --out <file>", "Output file path")
  .option("-p, --pretty", "Pretty-print the JSON output")
  .action(exportRoutes);

/** * Global Configuration:
 * - help: Generates automatic documentation for all commands.
 * - version: Syncs the CLI version with the package version.
 */
cli.help();
cli.version("1.0.0");

/** * Execution Engine:
 * Parses process.argv and executes the matched action.
 * Gracefully exits on parsing errors to prevent stack traces in the terminal.
 */
try {
  cli.parse();
} catch (error) {
  /** SILENT FAIL: Handled by CAC's internal error reporting */
  process.exit(1);
}
