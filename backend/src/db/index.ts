import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "chat.db");
const db = new sqlite3.Database(dbPath);

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

export default db;
