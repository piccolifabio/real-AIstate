// Landing page MVP per RealAIstate
// Framework: React (esportabile su Vercel, Netlify, ecc.)

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Vendi e compra casa senza agenzia.
        </h1>
        <p className="text-lg text-gray-600">
          RealAIstate è il primo assistente immobiliare 100% AI che ti guida in ogni fase della vendita o dell'acquisto di un immobile. Nessuna provvigione, nessun agente.
        </p>
        <ul className="text-left text-gray-600 list-disc list-inside">
          <li>Genera l'annuncio perfetto con l'AI</li>
          <li>Stima il valore della tua casa in tempo reale</li>
          <li>Prepara i documenti e pubblica l’annuncio online</li>
          <li>Parla con gli acquirenti tramite un agente AI</li>
          <li>Gestisci la negoziazione con AI</li>
          <li><strong>Bonus:</strong> se vendi e ricompri su RealAIstate, ti rimborsiamo lo 0,5% del valore</li>
        </ul>

        <div className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <Input placeholder="Inserisci la tua email per l'accesso anticipato" className="flex-1" />
          <Button className="w-full sm:w-auto">Unisciti alla lista</Button>
        </div>

        <p className="text-sm text-gray-400">
          Lancio estate 2025 · Iscriviti ora per l'accesso prioritario e uno sconto esclusivo
        </p>
      </div>
    </div>
  );
}
