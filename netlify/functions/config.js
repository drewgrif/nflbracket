import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("brackets");

  // Handle GET - return current config (no auth needed)
  if (req.method === "GET") {
    try {
      const data = await store.get("data", { type: "json" });

      // Return default config if no data or config exists
      if (!data || !data.config) {
        return new Response(JSON.stringify({
          config: {
            afc: ["Chiefs", "Bills", "Ravens", "Texans", "Chargers", "Steelers", "Broncos"],
            nfc: ["Lions", "Eagles", "Buccaneers", "Rams", "Vikings", "Packers", "Commanders"]
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ config: data.config }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch config" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Handle POST - save config (requires password)
  if (req.method === "POST") {
    try {
      const input = await req.json();
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

      // Verify admin password
      if (!ADMIN_PASSWORD || !input.password || input.password !== ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Validate config structure
      if (!input.config || !input.config.afc || !input.config.nfc) {
        return new Response(JSON.stringify({ error: "Invalid config format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      if (input.config.afc.length !== 7 || input.config.nfc.length !== 7) {
        return new Response(JSON.stringify({ error: "Each conference must have exactly 7 teams" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Get current data
      let data = await store.get("data", { type: "json" });
      if (!data) {
        data = { brackets: [], results: {}, config: null };
      }

      // Update config
      data.config = input.config;

      // Save data
      await store.setJSON("data", data);

      return new Response(JSON.stringify({ success: true, message: "Config saved successfully" }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to save config" }), {
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
