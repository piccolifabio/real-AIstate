import { handleCors } from "./_lib/cors.js";

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
 
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email non valida" });
  }
 
  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
      }),
    });
 
    if (response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true });
    }
 
    const data = await response.json();
    // Contact already exists = still a success for us
    if (data.code === "duplicate_parameter") {
      return res.status(200).json({ success: true });
    }
 
    return res.status(500).json({ error: "Errore Brevo", detail: data });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
