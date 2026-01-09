import { getStore } from "@netlify/blobs";

// CHANGE THIS PASSWORD TO YOUR OWN
const ADMIN_PASSWORD = "admin123";

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

    // Handle different admin operations
    if (input.operation === "import") {
      // Import full backup data
      const data = {
        brackets: input.data.brackets || [],
        results: input.data.results || {}
      };
      await store.setJSON("data", data);
      return new Response(JSON.stringify({ success: true, message: "Data imported successfully" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (input.operation === "clear") {
      // Clear all data
      const data = { brackets: [], results: {} };
      await store.setJSON("data", data);
      return new Response(JSON.stringify({ success: true, message: "All data cleared" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Unknown operation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to perform operation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
