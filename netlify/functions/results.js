import { getStore } from "@netlify/blobs";

// CHANGE THIS PASSWORD TO YOUR OWN
const ADMIN_PASSWORD = "MY-BRACKET-IS-BEST";

export default async (req, context) => {
  const store = getStore("brackets");

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const input = await req.json();

    // Verify admin password
    if (!input.password || input.password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!input.results) {
      return new Response(JSON.stringify({ error: "Invalid results data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get current data
    let data = await store.get("data", { type: "json" });
    if (!data) {
      data = { brackets: [], results: {} };
    }

    // Update results
    data.results = input.results;

    // Save data
    await store.setJSON("data", data);

    return new Response(JSON.stringify({ success: true, message: "Results updated successfully" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save results" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
