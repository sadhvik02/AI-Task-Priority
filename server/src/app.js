
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { tasksRouter } from "./routes/tasks.js";
import { initDb } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize DB
initDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Task Priority API is running");
});

app.use("/api/tasks", tasksRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
