async function testSortOrder() {
    const url = 'http://localhost:4000/api/tasks';
    try {
        const response = await fetch(url);
        const tasks = await response.json();

        console.log(`Fetched ${tasks.length} tasks.`);

        let isSorted = true;
        for (let i = 0; i < tasks.length - 1; i++) {
            const current = tasks[i].priority_score || 0;
            const next = tasks[i + 1].priority_score || 0;

            if (current < next) {
                console.error(`❌ Sort Error at index ${i}: Task ${tasks[i].id} (Score: ${current}) is before Task ${tasks[i + 1].id} (Score: ${next})`);
                isSorted = false;
            }
        }

        if (isSorted) {
            console.log("✅ Tasks are correctly sorted by priority descending.");
            // Log top 3
            tasks.slice(0, 3).forEach((t, i) => {
                console.log(`Rank #${i + 1}: ${t.title} (Score: ${t.priority_score})`);
            });
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

testSortOrder();
