import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("brackets");

  // Handle GET - return all data
  if (req.method === "GET") {
    try {
      const data = await store.get("data", { type: "json" });

      // Return empty structure if no data exists yet
      if (!data) {
        return new Response(JSON.stringify({ brackets: [], results: {} }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Handle POST - submit a bracket
  if (req.method === "POST") {
    try {
      const input = await req.json();

      if (!input.name || !input.picks) {
        return new Response(JSON.stringify({ error: "Invalid bracket data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Get current data
      let data = await store.get("data", { type: "json" });
      if (!data) {
        data = { brackets: [], results: {} };
      }

      // Check if bracket already exists for this name
      const existingIndex = data.brackets.findIndex(b => b.name === input.name);

      const bracketData = {
        name: input.name,
        url: 'Bracket Picker',
        picks: input.picks
      };

      if (existingIndex >= 0) {
        // Update existing bracket
        data.brackets[existingIndex] = bracketData;
      } else {
        // Add new bracket
        data.brackets.push(bracketData);
      }

      // Save data
      await store.setJSON("data", data);

      return new Response(JSON.stringify({ success: true, message: "Bracket submitted successfully" }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to save bracket" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
};
