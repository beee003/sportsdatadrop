import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputDir = join(__dirname, "..", ".vercel", "output");

// Fix render function runtime (check both possible paths)
const renderPaths = [
  join(outputDir, "functions", "render", ".vc-config.json"),
  join(outputDir, "functions", "render.func", ".vc-config.json"),
];

for (const renderConfigPath of renderPaths) {
  if (existsSync(renderConfigPath)) {
    const config = JSON.parse(readFileSync(renderConfigPath, "utf-8"));
    if (config.runtime === "nodejs18.x") {
      config.runtime = "nodejs20.x";
      writeFileSync(renderConfigPath, JSON.stringify(config, null, 2));
      console.log("✓ Fixed render function runtime to nodejs20.x");
      break;
    }
  }
}

// Fix API function runtime (if exists)
const apiConfigPath = join(outputDir, "functions", "api", ".vc-config.json");
if (existsSync(apiConfigPath)) {
  const config = JSON.parse(readFileSync(apiConfigPath, "utf-8"));
  if (config.runtime === "nodejs18.x") {
    config.runtime = "nodejs20.x";
    writeFileSync(apiConfigPath, JSON.stringify(config, null, 2));
    console.log("✓ Fixed API function runtime to nodejs20.x");
  }
}

console.log("Runtime fix completed");

