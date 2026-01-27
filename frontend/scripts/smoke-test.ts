/**
 * Smoke Test Script
 * 
 * This script mimics the frontend's API logic to verify connectivity 
 * and backend functionality without a browser.
 * 
 * Run with: npx tsx scripts/smoke-test.ts
 */

const API_URL = "http://localhost:8000";
// Use the session token we found in the DB earlier
const SESSION_TOKEN = "eMeixOa1HZpsbXKrVZn9Sk5T3FISDzZT";

async function testConnection() {
  console.log("🚀 Starting Frontend-to-Backend Smoke Test...");

  const headers = {
    "Content-Type": "application/json",
    "Cookie": `better-auth.session_token=${SESSION_TOKEN}`
  };

  try {
    // 1. Check Health
    console.log("\n--- Checking Backend Health ---");
    const healthRes = await fetch(`${API_URL}/health`);
    console.log("Health Status:", healthRes.status, await healthRes.json());

    // 2. List Tasks (Verifying Trailing Slash fix)
    console.log("\n--- Testing GET /api/v1/tasks/ ---");
    const listRes = await fetch(`${API_URL}/api/v1/tasks/`, { headers });
    const tasks = await listRes.json();
    console.log("Tasks found:", tasks.length);
    console.log(JSON.stringify(tasks, null, 2));

    // 3. Create a Task
    console.log("\n--- Testing POST /api/v1/tasks/ ---");
    const createRes = await fetch(`${API_URL}/api/v1/tasks/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Smoke Test Task",
        description: "Created via TypeScript script"
      })
    });
    const newTask = await createRes.json();
    console.log("Created Task:", newTask);

    // 4. Delete the Task
    if (newTask.id) {
      console.log(`\n--- Testing DELETE /api/v1/tasks/${newTask.id} ---`);
      const deleteRes = await fetch(`${API_URL}/api/v1/tasks/${newTask.id}`, {
        method: "DELETE",
        headers
      });
      console.log("Delete Status:", deleteRes.status, await deleteRes.json());
    }

    console.log("\n✅ All connectivity tests passed!");
  } catch (error) {
    console.error("\n❌ Smoke test failed:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();

export {};
