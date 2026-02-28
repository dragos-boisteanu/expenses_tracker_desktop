import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Migration name from CLI
const rawName = process.argv[2];
if (!rawName) {
  console.error("Please provide a migration name.");
  process.exit(1);
}

// Function to convert camelCase / PascalCase to snake_case
const toSnakeCase = (str) =>
  str
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // add _ between lowerUpper
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2") // handle consecutive capitals
    .toLowerCase();

// Convert migration name to snake_case
const name = toSnakeCase(rawName);

// Build timestamp: HH_MM_SS_DD_MM_YYYY
const now = new Date();
const pad = (n) => n.toString().padStart(2, "0");
const timestamp = [
  pad(now.getHours()),
  pad(now.getMinutes()),
  pad(now.getSeconds()),
  pad(now.getDate()),
  pad(now.getMonth() + 1),
  now.getFullYear(),
].join("_");

// Final filename
const fileName = `${timestamp}_${name}.ts`;

// Ensure migrations folder exists
const migrationsDir = path.join(__dirname, "../migrations");
if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true });

const filePath = path.join(migrationsDir, fileName);

// Migration template
const template = `import { Database } from 'better-sqlite3';

export default (db: Database) => {
  // Write your migration here
};
`;

fs.writeFileSync(filePath, template);
console.log(`Migration created: ${fileName}`);
