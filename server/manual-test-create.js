// Native fetch is available in Node 18+

// Polyfill fetch for Node environments if needed (though node 18+ has it native, this import might fail if not module or old node)
// Since package.json says "type": "module", we can use import. 
// If node version is recent, global fetch exists. If not, we might need node-fetch but it's not in package.json.
// Let's rely on native fetch (Node 18+ as per PREREQUISITES).

async function testCreateTask() {
    const url = 'http://localhost:4000/api/tasks';
    const newTask = {
        title: "Test Task from Backend Script",
        description: "This task was created to verify the backend API functionality.",
        due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        urgency: 3,
        workload: 2
    };

    try {
        console.log(`Sending POST request to ${url}...`);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${text}`);
        }

        const createdTask = await response.json();
        console.log("✅ Task created successfully!");
        console.log("Created Task:", createdTask);
    } catch (error) {
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
            console.error("❌ Connection refused. Is the server running on port 4000?");
        } else {
            console.error("❌ Error creating task:", error.message);
        }
        process.exit(1);
    }
}

testCreateTask();
