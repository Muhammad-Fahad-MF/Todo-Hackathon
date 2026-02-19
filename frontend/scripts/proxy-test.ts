/**
 * Proxy Smoke Test Script
 * 
 * This script verifies the Next.js Proxy (BFF) logic by sending requests 
 * to localhost:3000/api/external/... and ensuring they reach the backend. 
 * 
 * Run with: npx tsx scripts/proxy-test.ts
 */

const FRONTEND_URL = "http://localhost:3000";
// Use the session token - if this expires, we'll need to grab a new one from the DB/Browser
const SESSION_TOKEN = "2Ijf2o3D1RcFd6j1Mn7MZnpEJOZOFFTu";

async function testProxy() {
  console.log("🚀 Starting Frontend Proxy Test (Port 3000)...");

  const headers = {
    "Content-Type": "application/json",
    // Simulate the cookie being sent by the browser
    "Cookie": `better-auth.session_token=${SESSION_TOKEN}`
  };

  try {
    // 1. Check Health (via direct backend check, just to be sure we aren't chasing ghosts)
    // We can't easily check backend health via proxy unless we expose a proxy route for it, 
    // but we can try listing tasks which should work if health is good.

    // 2. List Tasks via Proxy
    // Note: We use /api/external/api/v1/tasks/ 
    // The proxy at /api/external/[...slug] should map this to BACKEND_URL/api/v1/tasks/
    console.log("\n--- Testing GET /api/external/api/v1/tasks/ ---");
    const listUrl = `${FRONTEND_URL}/api/external/api/v1/tasks/`;
    console.log(`Requesting: ${listUrl}`);
    
    const listRes = await fetch(listUrl, { headers });
    
    if (listRes.status === 401) {
        console.error("❌ 401 Unauthorized. The session token might be invalid or cookies are not being passed.");
        console.error("Please login in the browser, grab the 'better-auth.session_token' cookie, and update the script.");
        process.exit(1);
    }
    
    if (listRes.status !== 200) {
        console.error(`❌ Unexpected status: ${listRes.status}`);
        console.log(await listRes.text());
        process.exit(1);
    }

    const tasks = await listRes.json();
    console.log("✅ Proxy Success! Tasks found:", tasks.length);

    // 3. Create a Task via Proxy
    console.log("\n--- Testing POST /api/external/api/v1/tasks/ ---");
    const createRes = await fetch(`${FRONTEND_URL}/api/external/api/v1/tasks/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "Proxy Test Task",
        description: "Created via Next.js Proxy"
      })
    });
    
    if (createRes.status !== 200 && createRes.status !== 201) {
         console.error(`❌ Create Failed: ${createRes.status}`);
         console.log(await createRes.text());
    } else {
        const newTask = await createRes.json();
        console.log("✅ Task Created via Proxy:", newTask);

        // 4. Delete the Task via Proxy
        if (newTask.id) {
            console.log(`\n--- Testing DELETE /api/external/api/v1/tasks/${newTask.id} ---`);
            const deleteRes = await fetch(`${FRONTEND_URL}/api/external/api/v1/tasks/${newTask.id}`, {
                method: "DELETE",
                headers
            });
            if (deleteRes.ok) {
                console.log("✅ Task Deleted via Proxy");
            } else {
                console.error(`❌ Delete Failed: ${deleteRes.status}`);
                console.log(await deleteRes.text());
            }
        }
    }

  } catch (error) {
    console.error("\n❌ Proxy test failed. Is the Frontend running on port 3000?");
    console.error(error);
    process.exit(1);
  }
}

testProxy();

export {};
