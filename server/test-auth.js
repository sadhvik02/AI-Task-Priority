
// import fetch from 'node-fetch'; // Built-in in Node 18+


async function testAuth() {
    const BASE = 'http://localhost:4000/api';

    // 1. Register
    console.log("Registering user...");
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const password = "password123";

    let res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        console.error("Register failed:", await res.text());
        return;
    }
    const regData = await res.json();
    console.log("Registered:", regData);

    // 2. Login
    console.log("Logging in...");
    res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        console.error("Login failed:", await res.text());
        return;
    }
    const loginData = await res.json();
    const token = loginData.token;
    console.log("Logged in, token received.");

    // 3. Create Task (Protected)
    console.log("Creating task...");
    res = await fetch(`${BASE}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: "Authenticated Task",
            category: "Work",
            urgency: 5
        })
    });

    if (!res.ok) {
        console.error("Create Task failed:", await res.text());
        return;
    }
    const task = await res.json();
    console.log("Task created:", task);

    // 4. List Tasks
    console.log("Listing tasks...");
    res = await fetch(`${BASE}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await res.json();
    console.log("Tasks found:", tasks.length);

    if (tasks.find(t => t.id === task.id)) {
        console.log("PASS: Task verified in list.");
    } else {
        console.error("FAIL: Task not found in list.");
    }

    // 5. Test Access Denied
    console.log("Testing unauthorized access...");
    res = await fetch(`${BASE}/tasks`);
    if (res.status === 401) {
        console.log("PASS: Unauthorized access blocked (401).");
    } else {
        console.error("FAIL: Expected 401 for no token, got", res.status);
    }
}

testAuth();
