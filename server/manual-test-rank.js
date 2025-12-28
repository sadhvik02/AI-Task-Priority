// Native fetch in Node 18+

async function testRankEndpoint() {
    const url = 'http://localhost:4000/api/tasks/rank';

    try {
        console.log(`Sending POST request to ${url}...`);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${text}`);
        }

        const result = await response.json();
        console.log("✅ Rank endpoint success!");
        console.log(`Updated ${result.updated} tasks.`);

        if (result.tasks && result.tasks.length > 0) {
            const firstTask = result.tasks[0];
            console.log("Sample Task Priority:", firstTask.priority_score);
            console.log("Sample Task Reason:", firstTask.priority_reason);

            if (firstTask.priority_reason && firstTask.priority_reason.toLowerCase().includes("fallback")) {
                console.warn("⚠️  WARNING: It seems to be using FALLBACK ranking.");
            } else {
                console.log("🎉  Success: It seems to be using AI ranking.");
            }
        }
    } catch (error) {
        console.error("❌ Error calling rank endpoint:", error.message);
    }
}

testRankEndpoint();
