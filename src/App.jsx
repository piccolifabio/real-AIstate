function LandingPage() {
  return (
    <div style={{fontFamily: 'sans-serif', padding: '3rem', textAlign: 'center'}}>
      <h1 style={{fontSize: '2.5rem'}}>Vendi e compra casa senza agenzia</h1>
      <p style={{marginTop: '1rem'}}>
        RealAIstate è il primo assistente immobiliare 100% AI che ti guida in ogni fase
        della vendita o dell'acquisto di un immobile. Nessuna provvigione, nessun agente.
      </p>

      <ul style={{textAlign:'left', maxWidth:'500px', margin:'2rem auto'}}>
        <li>Genera l'annuncio perfetto con l'AI</li>
        <li>Stima il valore della tua casa in tempo reale</li>
        <li>Prepara i documenti e pubblica l’annuncio online</li>
        <li>Parla con gli acquirenti tramite un agente AI</li>
        <li>Gestisci la negoziazione con AI</li>
        <li><strong>Bonus:</strong> se vendi e ricompri su RealAIstate, ti rimborsiamo lo 0,5 % del valore</li>
      </ul>

      <form action="#" style={{display:'flex', gap:'8px', justifyContent:'center'}}>
        <input type="email" required placeholder="Inserisci la tua email"
               style={{padding:'10px', flex:'1 1 250px'}} />
        <button style={{padding:'10px 24px'}}>Unisciti alla lista</button>
      </form>

      <p style={{marginTop:'1rem', fontSize:'0.9rem', color:'#666'}}>
        Lancio estate 2025 · Iscriviti ora per l'accesso prioritario e uno sconto esclusivo
      </p>
    </div>
  );
}

export default LandingPage;
