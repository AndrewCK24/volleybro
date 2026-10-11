#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkWorkflow } from "./check-workflow.js";
import { validateSnapshot } from "./g1-snapshot.js";

async function runDeliveryGate(root, document, expected) {
  const workflowDiagnostics = await checkWorkflow(root);
  const snapshot = validateSnapshot(document, expected);
  return {
    valid: workflowDiagnostics.length === 0 && snapshot.valid,
    diagnostics: [...workflowDiagnostics, ...snapshot.diagnostics],
    metadata: snapshot.valid ? snapshot.metadata : undefined,
  };
}

function parseArguments(argv) {
  const names = new Set(["--snapshot-json", "--team-id", "--change"]);
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const name = argv[index];
    if (!names.has(name)) throw new Error(`unknown option: ${name}`);
    if (options[name]) throw new Error(`${name} may be provided only once`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${name} requires a value`);
    }
    options[name] = value;
    index += 1;
  }
  for (const name of names) {
    if (!options[name]) throw new Error(`${name} requires a value`);
  }
  return options;
}

async function main() {
  const argv = process.argv.slice(2);
  try {
    const options = parseArguments(argv);
    const exportPath = path.resolve(options["--snapshot-json"]);

    let document;
    try {
      document = JSON.parse(await readFile(exportPath, "utf8"));
    } catch (error) {
      throw new Error(`cannot read Linear document export: ${error.message}`);
    }
    const result = await runDeliveryGate(process.cwd(), document, {
      teamId: options["--team-id"],
      change: options["--change"],
    });
    if (!result.valid) {
      for (const diagnostic of result.diagnostics)
        console.error(`- ${diagnostic}`);
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify(result.metadata, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
