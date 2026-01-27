import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { validateRegistration } from "../utils/validation.js";

export const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// POST /api/auth/register
authRouter.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate
        const error = validateRegistration(username, password);
        if (error) return res.status(400).json({ error });

        // Check existing
        const existing = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", user: result.rows[0] });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];

        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, username: user.username } });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});
