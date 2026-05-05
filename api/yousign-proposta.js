import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { compratore_email, compratore_nome, venditore_email, venditore_nome, immobile, importo, condizioni, data_rogito, note } = req.body;

  const YOUSIGN_API_KEY = process.env.YOUSIGN_API_KEY;
  const YOUSIGN_BASE = "https://api-sandbox.yousign.app/v3";

  try {
    // 1. Crea il documento HTML compilato
    const htmlContent = generateHTML({ compratore_email, compratore_nome, venditore_email, venditore_nome, immobile, importo, condizioni, data_rogito, note });
    
    // 2. Converti HTML in base64
   const base64Doc = await generatePDF({ compratore_nome, compratore_email, venditore_nome, venditore_email, immobile, importo, condizioni, data_rogito, note });

    // 3. Crea la firma request su Yousign
    const signatureResponse = await fetch(`${YOUSIGN_BASE}/signature_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YOUSIGN_API_KEY}`,
      },
      body: JSON.stringify({
        name: `Proposta acquisto — ${immobile.indirizzo}`,
        delivery_mode: "email",
        timezone: "Europe/Rome",
       signers: [
  {
    info: { 
      first_name: compratore_nome.split(" ")[0], 
      last_name: compratore_nome.split(" ").slice(1).join(" ") || "—", 
      email: compratore_email,
      locale: "it"
    },
    signature_level: "electronic_signature",
    signature_authentication_mode: "no_otp",
  },
  {
    info: { 
      first_name: venditore_nome.split(" ")[0], 
      last_name: venditore_nome.split(" ").slice(1).join(" ") || "—", 
      email: venditore_email,
      locale: "it"
    },
    signature_level: "electronic_signature",
    signature_authentication_mode: "no_otp",
  },
],
documents: [
  {
    name: "Proposta_Acquisto_RealAIstate.pdf",
    content_type: "application/pdf",
    content: base64Doc,
    nature: "signable_document",
  },
],
      }),
    });

    const signatureData = await signatureResponse.json();
    
    if (!signatureResponse.ok) {
      console.error("Yousign error:", signatureData);
      return res.status(500).json({ error: "Errore Yousign", detail: signatureData });
    }

    // 4. Attiva la signature request
    await fetch(`${YOUSIGN_BASE}/signature_requests/${signatureData.id}/activate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${YOUSIGN_API_KEY}`,
      },
    });

    return res.status(200).json({ ok: true, signature_request_id: signatureData.id });
  } catch (err) {
    return res.status(500).json({ error: "Errore server", detail: err.message });
  }
}

async function generatePDF({ compratore_nome, compratore_email, venditore_nome, venditore_email, immobile, importo, condizioni, data_rogito, note }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const red = rgb(0.85, 0.19, 0.15);
  const black = rgb(0.1, 0.1, 0.1);
  const gray = rgb(0.4, 0.4, 0.4);
  
  let y = height - 50;
  
  // Logo
  page.drawText("REAL", { x: 50, y, size: 22, font: fontBold, color: black });
  page.drawText("AI", { x: 96, y, size: 22, font: fontBold, color: red });
  page.drawText("STATE", { x: 118, y, size: 22, font: fontBold, color: black });
  
  // Titolo
  page.drawText("PROPOSTA D'ACQUISTO", { x: 350, y, size: 13, font: fontBold, color: black });
  page.drawText(`Data: ${new Date().toLocaleDateString("it-IT")}`, { x: 350, y: y - 16, size: 9, font: fontRegular, color: gray });
  
  // Linea rossa
  y -= 30;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 2, color: red });
  
  y -= 20;
  // Nota legale
  page.drawText("La presente proposta diventa vincolante per entrambe le parti con la firma digitale del Venditore.", { x: 50, y, size: 8, font: fontRegular, color: gray });
  page.drawText("RealAIstate non e' un'agenzia immobiliare e non svolge attivita' di mediazione ai sensi della L. 39/1989.", { x: 50, y: y - 12, size: 8, font: fontRegular, color: gray });
  
  y -= 40;
  
  // Sezione Immobile
  page.drawText("1 · IMMOBILE", { x: 50, y, size: 9, font: fontBold, color: red });
  y -= 18;
  page.drawText(`Indirizzo: ${immobile.indirizzo}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 14;
  page.drawText(`Zona: ${immobile.zona}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 14;
  page.drawText(`Prezzo richiesto: € ${immobile.prezzo.toLocaleString("it-IT")}`, { x: 50, y, size: 11, font: fontBold, color: black });
  y -= 14;
  page.drawText(`Superficie catastale: ${immobile.superficie} m²`, { x: 50, y, size: 10, font: fontRegular, color: black });
  
  y -= 30;
  
  // Sezione Compratore
  page.drawText("2 · PROPONENTE (COMPRATORE)", { x: 50, y, size: 9, font: fontBold, color: red });
  y -= 18;
  page.drawText(`Nome: ${compratore_nome}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 14;
  page.drawText(`Email: ${compratore_email}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  
  y -= 30;
  
  // Sezione Venditore
  page.drawText("3 · VENDITORE", { x: 50, y, size: 9, font: fontBold, color: red });
  y -= 18;
  page.drawText(`Nome: ${venditore_nome}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 14;
  page.drawText(`Email: ${venditore_email}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  
  y -= 30;
  
  // Sezione Proposta
  page.drawText("4 · PROPOSTA ECONOMICA", { x: 50, y, size: 9, font: fontBold, color: red });
  y -= 18;
  const diff = Number(importo) - immobile.prezzo;
  const perc = Math.round(Math.abs(diff) / immobile.prezzo * 100);
  const diffLabel = diff >= 0 ? `+${perc}% sopra prezzo` : `${perc}% sotto prezzo`;
  page.drawText(`Importo offerto: € ${Number(importo).toLocaleString("it-IT")} (${diffLabel})`, { x: 50, y, size: 11, font: fontBold, color: black });
  y -= 14;
  page.drawText(`Condizioni: ${condizioni || "—"}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 14;
  page.drawText(`Data rogito proposta: ${data_rogito || "Da concordare"}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  if (note) {
    y -= 14;
    page.drawText(`Note: ${note}`, { x: 50, y, size: 10, font: fontRegular, color: black });
  }
  
  y -= 30;
  
  // Fee RealAIstate
  page.drawText("5 · CORRISPETTIVO REALAISTATE", { x: 50, y, size: 9, font: fontBold, color: red });
  y -= 18;
  page.drawText("A carico del Compratore: € 2.000", { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 14;
  page.drawText("A carico del Venditore: € 499", { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 12;
  page.drawText("Dovuto esclusivamente a transazione completata con rogito notarile.", { x: 50, y, size: 8, font: fontRegular, color: gray });
  
  y -= 50;
  
  // Firme
  page.drawText("FIRME", { x: 50, y, size: 9, font: fontBold, color: red });
  y -= 20;
  
  // Compratore
  page.drawText("Proponente (Compratore)", { x: 50, y, size: 8, font: fontBold, color: gray });
  y -= 14;
  page.drawText(compratore_nome, { x: 50, y, size: 10, font: fontRegular, color: black });
  y -= 40;
  page.drawLine({ start: { x: 50, y }, end: { x: 260, y }, thickness: 1, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("Firma digitale FEA", { x: 50, y: y - 12, size: 7, font: fontRegular, color: gray });
  
  // Venditore
  page.drawText("Venditore — Accettazione", { x: 300, y: y + 54, size: 8, font: fontBold, color: gray });
  page.drawText(venditore_nome, { x: 300, y: y + 40, size: 10, font: fontRegular, color: black });
  page.drawLine({ start: { x: 300, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("Firma digitale FEA per accettazione", { x: 300, y: y - 12, size: 7, font: fontRegular, color: gray });
  
  // Footer
  page.drawLine({ start: { x: 50, y: 40 }, end: { x: 545, y: 40 }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });
  page.drawText("REALAISTATE · realaistate.ai · info@realaistate.ai · RealAIstate non e' un'agenzia immobiliare", { x: 50, y: 25, size: 7, font: fontRegular, color: rgb(0.7, 0.7, 0.7) });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}