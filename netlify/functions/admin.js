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

    if (input.operation === "delete") {
      // Delete a specific bracket by name
      if (!input.name) {
        return new Response(JSON.stringify({ error: "Name is required for delete operation" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Get current data
      let data = await store.get("data", { type: "json" });
      if (!data) {
        data = { brackets: [], results: {} };
      }

      // Filter out the bracket with the specified name
      const originalLength = data.brackets.length;
      data.brackets = data.brackets.filter(b => b.name !== input.name);

      if (data.brackets.length === originalLength) {
        return new Response(JSON.stringify({ error: "Bracket not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Save updated data
      await store.setJSON("data", data);
      return new Response(JSON.stringify({ success: true, message: "Bracket deleted successfully" }), {
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
