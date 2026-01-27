import { pool } from "./src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDb() {
    try {
        console.log("Dropping existing tables...");
        await pool.query("DROP TABLE IF EXISTS tasks;");
        await pool.query("DROP TABLE IF EXISTS users;");

        console.log("Reading schema.sql...");
        const schemaPath = path.join(__dirname, "schema.sql");
        const schemaSql = fs.readFileSync(schemaPath, "utf8");

        console.log("applying schema...");
        await pool.query(schemaSql);

        console.log("Database reset successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error resetting DB:", err);
        process.exit(1);
    }
}

resetDb();
