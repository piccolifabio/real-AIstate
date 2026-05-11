// Tipologie standard di documenti mostrate nella sezione "Documenti" di
// ogni scheda immobile published. Lista non definitiva: andrà estesa con
// verbali assembleari, spese condominiali, certificazione impianti, ecc.
// Aggiungere/togliere = una riga qui.
//
// Quando avremo la tabella documenti_immobile dedicata (post-MVP), questi
// item diventeranno il TEMPLATE rispetto a cui mostrare upload reali del
// venditore (status: uploaded/missing) — finché allora restano tutti
// "su richiesta" per immobili non-demo.

export const DOCUMENT_TYPES = [
  {
    key: "atto_provenienza",
    label: "Atto di provenienza",
    description: "Origine della proprietà",
  },
  {
    key: "visura_catastale",
    label: "Visura catastale aggiornata",
    description: "Dati identificativi catastali",
  },
  {
    key: "planimetria",
    label: "Planimetria catastale",
    description: "Pianta dell'immobile depositata in Catasto",
  },
  {
    key: "conformita_urbanistica",
    label: "Conformità urbanistica/edilizia",
    description: "Regolarità rispetto ai titoli edilizi",
  },
  {
    key: "visura_ipotecaria",
    label: "Visura ipotecaria",
    description: "Eventuali ipoteche e gravami",
  },
  {
    key: "ape",
    label: "APE — Attestato Prestazione Energetica",
    description: "Classe energetica",
  },
];

export const PROPOSAL_TEMPLATE = {
  key: "proposta_template",
  label: "Template proposta d'acquisto",
  description: "Modulo standard, disponibile a tutti",
  url: "/proposta_acquisto_template.html",
};
