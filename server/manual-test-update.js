
async function testUpdateWithOverride() {
    const baseUrl = 'http://localhost:4000/api/tasks';

    // 1. Create a dummy task
    console.log("Creating dummy task...");
    const createRes = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: "Test Task for Override",
            urgency: 1,
            workload: 1
        })
    });
    const task = await createRes.json();
    console.log("Created Task:", task.id, "Priority:", task.priority_score);

    // 2. Update it with manual override
    console.log("Updating task with manual priority 100...");
    const updateRes = await fetch(`${baseUrl}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...task,
            priority_score: 100,
            priority_reason: "Manual Override Test"
        })
    });

    if (updateRes.ok) {
        const updatedTask = await updateRes.json();
        console.log("✅ Update Success!");
        console.log("New Priority:", updatedTask.priority_score);
        console.log("New Reason:", updatedTask.priority_reason);

        if (updatedTask.priority_score === 100) {
            console.log("🎉 Verification Passed: Priority was overridden.");
        } else {
            console.error("❌ Verification Failed: Priority mismatch.");
        }

        // Cleanup
        await fetch(`${baseUrl}/${task.id}`, { method: 'DELETE' });
    } else {
        console.error("Update failed:", await updateRes.text());
    }
}

testUpdateWithOverride();
