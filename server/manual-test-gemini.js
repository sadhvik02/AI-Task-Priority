import { getPriorityFromGemini } from "./src/services/gemini.js";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

async function testGemini() {
    console.log("Testing Gemini API...");

    const mockTasks = [
        {
            id: 1,
            title: "Fix critical bug in production",
            description: "Users are unable to login.",
            due_date: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour from now
            urgency: 5,
            workload: 3
        },
        {
            id: 2,
            title: "Update documentation",
            description: "Add new API endpoints to docs.",
            due_date: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(), // 7 days from now
            urgency: 2,
            workload: 1
        }
    ];

    try {
        const result = await getPriorityFromGemini(mockTasks);
        console.log("✅ Gemini API Response received!");
        console.log(JSON.stringify(result, null, 2));

        if (Array.isArray(result) && result.length > 0) {
            console.log("Structure looks correct.");
        } else {
            console.error("❌ Unexpected structure or empty result.");
        }
    } catch (error) {
        console.error("❌ Gemini API Test Failed:", error);
    }
}

testGemini();
