import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data.db");
const db = new Database(dbPath);

// Run schema on startup
const schema = fs.readFileSync(
  path.join(__dirname, "schema.sql"),
  "utf8"
);

db.exec(schema);

export default db;
