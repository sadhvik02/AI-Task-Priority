import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    console.log("Listing models...");
    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models?key=" + GEMINI_API_KEY
    );
    const data = await response.json();
    if (data.models) {
        console.log("Available Models:");
        data.models.forEach(m => {
            console.log(`- ${m.name} (${m.supportedGenerationMethods.join(", ")})`);
        });
    } else {
        console.log("Error:", JSON.stringify(data, null, 2));
    }
}

listModels();
