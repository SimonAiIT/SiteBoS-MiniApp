import { Question } from "../types";

export const questions126to130: Question[] = [
  {
    num: 126,
    scenario: "Immagina che la tua \"tazza di caffè\" preferita cambi sapore all'improvviso. Come reagisci?",
    instructions: [
      "Immagine di una tazza di caffè intatta e abbandonata sul tavolo,  rifiuto netto del cambiamento,  \"non bevo questa roba\".",
      "Immagine di una persona che beve il caffè nuovo con una smorfia di disappunto,  accettazione passiva e silenziosa del cambiamento.",
      "Immagine di una persona che assaggia il caffè nuovo con attenzione e  chiede al barista \"cosa è cambiato?\",  analisi e  dialogo per capire il cambiamento.",
      "Immagine di una persona che aggiunge zucchero, latte e aromi al caffè nuovo per \"aggiustarlo\" a suo gusto,  adattamento attivo e  \"personalizzazione\" per rendere accettabile il cambiamento."
    ],
    captions: [
      "Non la Bevo",
      "Bevo e Non Dico Niente",
      "Chiedo Cosa è Cambiato",
      "Cambio Caffetteria"
    ],
    options: [
      {
        value: "Non la Bevo",
        text: "(Negativo: resistenza rigida al cambiamento e mancanza di adattabilità, perdita di opportunità di gestire il cambiamento in modo costruttivo, percezione di persona inflessibile e poco incline al compromesso e all'accettazione del nuovo) (Positivo: affermazione decisa delle proprie preferenze e non accettazione passiva del cambiamento imposto, coerenza con le proprie aspettative, approccio diretto e senza ambiguità, massima coerenza e integrità rispetto al proprio gusto personale)."
      },
      {
        value: "Bevo e Non Dico Niente",
        text: "(Negativo: insoddisfazione latente non gestita e mancanza di feedback utile per il miglioramento, opportunità persa di comunicare le proprie preferenze e influenzare il cambiamento futuro, percezione di persona passiva, rassegnata e poco proattiva) (Positivo: approccio non conflittuale e collaborativo e mantenimento armonia e pace sociale, evitamento tensioni e problemi, gestione silenziosa e non invasiva della propria insoddisfazione, priorità all'equilibrio relazionale e alla convivenza pacifica)."
      },
      {
        value: "Chiedo Cosa è Cambiato",
        text: "(Positivo: approccio razionale e orientato alla comprensione e alla ricerca di soluzioni, dialogo costruttivo e ricerca di informazioni utili per adattarsi al cambiamento, gestione attiva e non passiva del cambiamento, persona percepita come curiosa e aperta al dialogo) (Negativo: potenziale lentezza nell'adattamento emotivo e approccio cerebrale che potrebbe non cogliere appieno la dimensione emotiva del cambiamento, richiede tempo e sforzo per l'analisi e il dialogo, percezione di approccio troppo razionale e meno spontaneo o istintivo nella reazione al cambiamento)."
      },
      {
        value: "Cambio Caffetteria",
        text: "(Negativo: reazione eccessiva e sproporzionata e rischio di decisioni impulsive e non sempre ponderate, perdita potenziale di aspetti positivi del locale, percezione di intolleranza e rigidità e mancanza di flessibilità, approccio forse non sempre ottimizzato in termini di massima razionalità e value for money complessivo nel lungo periodo) (Positivo: decisione rapida e senza compromessi e affermazione decisa del proprio gusto, massima coerenza con la propria insoddisfazione e scelta radicale e definitiva per evitare ulteriori esperienze negative, approccio tranchant e senza ripensamenti)."
      }
    ],
    softSkill: "GestioneDelCambiamento, SoddisfazioneDelCliente",
    characteristics: "Adattabilità al Cambiamento, Soddisfazione, Approccio alla Novità"
  },
  {
    num: 127,
    scenario: "Devi preparare la cena a casa",
    instructions: [
      "Immagine di uno chef che crea un piatto elaborato e sofisticato seguendo solo la sua ispirazione,  priorità all'espressione artistica personale.",
      "Immagine di un rider in scooter che consegna cibo pronto,  delega a \"fornitori esterni\" per massimizzare la comodità.",
      "Immagine di un tavolo imbandito con un piatto \"classico\" e rassicurante,  piacere ai commensali con una scelta \"sicura\" e collaudata.",
      "Immagine di un tavolo imbandito con un menu gourmet a più portate,  impegno massimo per sorprendere e deliziare i commensali con una \"esperienza\" culinaria unica."
    ],
    captions: [
      "Io non Cucino, Creo",
      "Telefono e Ordino",
      "Classico Imbattibile",
      "Menu Degustazione"
    ],
    options: [
      {
        value: "Io non Cucino, Creo",
        text: "(Negativo: potenziale disallineamento con le aspettative del cliente e rischio di non soddisfare i gusti altrui, approccio autoreferenziale e poco orientato al servizio, percezione di chef artista ma forse poco attento al cliente reale) (Positivo: massima libertà creativa e espressione autentica del talento personale, valorizzazione della visione artistica individuale e approccio puro e senza compromessi in termini di integrità artistica)."
      },
      {
        value: "Telefono e Ordino",
        text: "(Positivo: massima comodità e risparmio di tempo e energie personali, approccio efficiente che delega attività non core a esperti esterni, ottimizzazione del tempo libero e del relax personale, massimizzazione del comfort e del piacere immediato) (Negativo: mancanza di cura e affettività nel gesto del cucinare per gli altri e non sviluppo abilità personali in cucina, percezione di approccio delegante e poco personale, mancanza di coinvolgimento diretto nella preparazione e nella condivisione del cibo fatto in casa)."
      },
      {
        value: "Classico Imbattibile",
        text: "(Positivo: massima probabilità di accontentare tutti e scelta sicura e collaudata, evitamento di rischi e esperimenti culinari potenzialmente fallimentari, approccio rassicurante e orientato al consenso e all'armonia conviviale, persona percepita come affidabile e prevedibile nelle scelte culinarie) (Negativo: mancanza di originalità e innovazione e approccio conformista e poco audace, percezione di prevedibilità e ripetitività, mancanza di sorpresa e novità, non massimizzazione del potenziale di stimolazione e curiosità culinaria dei commensali)."
      },
      {
        value: "Menu Degustazione",
        text: "(Positivo: massimo impegno e dedizione per la soddisfazione del cliente e creazione di una esperienza culinaria memorabile e straordinaria, volontà di stupire e deliziare i commensali con qualcosa di unico e speciale, approccio generoso e orientato all'eccellenza e all'effetto wow, persona percepita come creativa e ambiziosa) (Negativo: alto investimento di risorse e potenziale eccessiva sofisticazione percepita come non necessaria o fuori luogo in contesti informali, rischio di non incontrare i gusti di tutti, percezione di eccessiva enfasi sull'apparenza e sulla performance culinaria estrema a scapito della semplicità e della convivialità spontanea)."
      }
    ],
    softSkill: "OrientamentoAlCliente, SviluppoPersonale",
    characteristics: "Orientamento al Cliente, Ambizione, Creatività, Stili di Cucina"
  },
  {
    num: 128,
    scenario: "Ti accorgi in lontananza di un crimine potenzialmente violento. Cosa fai?",
    instructions: [
      "Immagine di una persona che devia rapidamente il proprio percorso,  cambia strada per evitare ogni coinvolgimento.",
      "Immagine di una persona che urla a distanza verso l'orizzonte,  intervento simbolico ma a distanza di sicurezza.",
      "Immagine di una persona che compone rapidamente un numero di emergenza sul cellulare,  richiesta di aiuto esterno e \"formale\".",
      "Immagine di un eroe dei fumetti che corre a gran velocità verso il pericolo,  intervento eroico e  diretto,  senza esitazione."
    ],
    captions: [
      "Cambio Strada",
      "Urlo e Filmo",
      "Telefono Aiuto",
      "Corro Verso l'Azione"
    ],
    options: [
      {
        value: "Cambio Strada",
        text: "(Negativo: omissione di soccorso potenziale e mancanza di solidarietà verso la vittima, perpetuazione dell'ingiustizia per non intervento, percezione di persona egoista, indifferente e poco coraggiosa) (Positivo: massimizzazione sicurezza personale e evitamento rischi non necessari, approccio razionale e non impulsivo, priorità alla propria incolumità e sopravvivenza individuale, approccio pragmatico e self-preservation-oriented)."
      },
      {
        value: "Urlo e Filmo",
        text: "(Positivo: minimo intervento simbolico e non rischioso per sé stesso, tentativo di dare l'allarme senza esporsi direttamente, approccio prudente che bilancia non intervento totale e rischio personale, volontà di non ignorare completamente il crimine pur senza esporsi troppo) (Negativo: inefficacia quasi totale dell'intervento e segnalazione vaga e inutile, mancanza di aiuto concreto alla vittima, percezione di approccio tiepido, poco coraggioso e non pienamente utile o efficace)."
      },
      {
        value: "Telefono Aiuto",
        text: "(Positivo: attivazione rapida dei soccorsi professionali e approccio responsabile e orientato alla soluzione strutturata e formale del problema, massimizzazione potenziale di intervento efficace da parte delle autorità competenti, persona percepita come responsabile e pragmatica) (Negativo: mancanza di intervento immediato e diretto sulla scena del crimine e potenziale perdita di tempo prezioso nell'attesa di soccorsi esterni, percezione di approccio un po' burocratico o troppo dipendente dalle procedure formali e meno reattivo e tempestivo nell'azione immediata e diretta)."
      },
      {
        value: "Corro Verso l'Azione",
        text: "(Positivo: massimo coraggio e determinazione nell'intervento diretto e azione eroica e immediata per fermare il crimine, massima priorità all'aiuto attivo e tempestivo della vittima in prima persona, persona percepita come estremamente coraggiosa, integra e assertiva e paladina della giustizia) (Negativo: rischio personale estremo e potenzialmente autolesionista, azione impulsiva e non sempre ponderata, percezione di eccessiva avventatezza e incoscienza, mancanza di valutazione razionale dei rischi e delle proprie reali capacità di intervento efficace)."
      }
    ],
    softSkill: "TematicheSociali, SviluppoDellePersone",
    characteristics: "Coraggio Civile, Responsabilità Sociale, Impulsività vs. Cautela"
  },
  {
    num: 129,
    scenario: "Il vicino ti chiede un attrezzo, come rispondi?",
    instructions: [
      "Immagine di una mano che porge un martello standard,  offerta di uno strumento \"standard\" senza approfondire le esigenze.",
      "Immagine di una cassetta degli attrezzi stracolma di ogni tipo di strumento,  mostra tutte le opzioni disponibili in modo generico.",
      "Immagine di una persona che ascolta attentamente il cliente con metro e notes alla mano,  approccio consultivo basato sull'ascolto e l'analisi dei bisogni.",
      "Immagine di una casetta per le bambole perfettamente costruita e rifinita,  offre la \"soluzione completa\" già pronta,  servizio \"chiavi in mano\"."
    ],
    captions: [
      "Ho un Martello",
      "Tieni la Mia Cassetta",
      "Cosa Devi Fare?",
      "Lo Faccio Io"
    ],
    options: [
      {
        value: "Ho un Martello",
        text: "(Negativo: approccio non consultivo e mancanza di attenzione ai bisogni specifici, rischio di offrire una soluzione sbagliata o non ottimale per il cliente, percezione di vendita aggressiva e non personalizzata, scarsa attenzione alla vera soddisfazione del cliente nel lungo periodo) (Positivo: massima velocità e semplicità nella risposta, approccio diretto e senza fronzoli, efficienza operativa immediata e minimo dispendio di tempo in analisi e ascolto)."
      },
      {
        value: "Tieni la Mia Cassetta",
        text: "(Negativo: approccio non guidato e dispersivo e cliente confuso dalla troppa scelta, mancanza di supporto nella decisione, rischio di non soddisfare il cliente per indecisione o scelta sbagliata a causa della mancanza di guida esperta, percezione di approccio incompleto e non pienamente orientato al servizio personalizzato) (Positivo: offerta completa e trasparente e libertà di scelta al cliente, approccio non direttivo e non invasivo, rispetto dell'autonomia decisionale del cliente, evitamento di suggerimenti potenzialmente indebiti o non richiesti)."
      },
      {
        value: "Cosa Devi Fare?",
        text: "(Positivo: massima attenzione ai bisogni specifici del cliente e approccio tailored e personalizzato, offerta della soluzione migliore per quel cliente specifico, costruzione di fiducia e relazione solida e duratura, percezione di consulenza esperta e attenta e orientata alla vera soddisfazione del cliente) (Negativo: richiede tempo e impegno nella consulenza e analisi e potenziale allungamento dei tempi di vendita, non sempre scalabile per tutti i clienti, percezione di approccio dispendioso in termini di tempo/risorse se applicato sempre e a tutti)."
      },
      {
        value: "Lo Faccio Io",
        text: "(Positivo: massima comodità e semplicità per il cliente e soluzione completa e pronta all'uso, approccio problem-solving spinto all'estremo, offerta di un servizio premium e senza pensieri per il cliente, massimizzazione della facilità d'acquisto e della user experience) (Negativo: potenziale infantilizzazione del cliente e mancanza di empowerment e crescita del cliente, percezione di approccio paternalistico e troppo semplificato, rischio di non educare il cliente al valore intrinseco della soluzione, non massimizzazione della consapevolezza e autonomia del cliente)."
      }
    ],
    softSkill: "VenditaConsultiva, ServizioAlCliente",
    characteristics: "Approccio alla Vendita, Orientamento al Cliente, Stile di Consulenza"
  },
  {
    num: 130,
    scenario: "Un collega fa una gaffe veramente imbarazzante . Come reagisci?",
    instructions: [
      "Immagine di una statua di cera perfettamente immobile e inespressiva,  reazione assente,  ignora la gaffe.",
      "Immagine di qualcuno che sussurra discretamente all'orecchio del collega,  intervento laterale e \"privato\".",
      "Immagine di un prestigiatore che distrae il pubblico con un gesto ampio,  cambio di discorso per \"coprire\" la gaffe e  deviare l'attenzione.",
      "Immagine di un fulmine che incenerisce una figura stilizzata,  reazione \"fulminante\" e  giudicante,  sguardo di disapprovazione \"mortificante\"."
    ],
    captions: [
      "Statua di Cera",
      "Sussurro all'Orecchio",
      "Cambio Discorso",
      "Lo Fulmini con lo Sguardo"
    ],
    options: [
      {
        value: "Statua di Cera",
        text: "(Negativo: mancanza di empatia e supporto al collega in difficoltà e percezione di freddezza e distacco emotivo, non gestione della situazione socialmente imbarazzante, clima potenzialmente gelido e non collaborativo) (Positivo: massima discrezione e rispetto apparente della privacy del collega, evitamento di pubblicità negativa della gaffe, non alimentazione del gossip e del pettegolezzo, approccio non giudicante in pubblico, mantenimento di un clima formalmente neutro)."
      },
      {
        value: "Sussurro all'Orecchio",
        text: "(Positivo: aiuto discreto e privato al collega e tentativo di proteggere la sua immagine pubblica, approccio solidale e non giudicante in pubblico, attenzione alla sensibilità e alla vulnerabilità del collega in quel momento, gestione soft e non invasiva della gaffe) (Negativo: efficacia parziale dell'intervento indiretto e rischio di ambiguità del messaggio sottovoce, non risoluzione immediata dell'imbarazzo pubblico, percezione di aiuto discreto ma non pienamente efficace o risolutivo in tempo reale)."
      },
      {
        value: "Cambio Discorso",
        text: "(Positivo: intervento tempestivo e salva-situazione immediato e protezione del collega dall'imbarazzo pubblico, gestione proattiva della situazione critica, volontà di risolvere rapidamente l'imbarazzo collettivo, persona percepita come pronta di riflessi e abile nel gestire situazioni delicate) (Negativo: potenziale eccessività percepita e rischio di apparire forzato o troppo teatrale, percezione di artificialità e non sempre spontaneità, approccio forse non sempre ottimale in termini di naturalezza e discrezione nel gestire l'imbarazzo collettivo)."
      },
      {
        value: "Lo Fulmini con lo Sguardo",
        text: "(Negativo: reazione eccessiva e punitiva e mortificazione pubblica del collega, creazione di un clima di giudizio e condanna implacabile, mancanza di empatia e comprensione umana, percezione di persona rigida e giudicante) (Positivo: affermazione forte di disapprovazione e messaggio inequivocabile di intolleranza, approccio tranchant e senza ambiguità, massima chiarezza nel giudizio negativo e condanna non verbale del comportamento sbagliato, affermazione di standard elevati di perfezione e zero tolleranza verso errori e gaffe pubbliche)."
      }
    ],
    softSkill: "RelazioniImproprie, Presentazione",
    characteristics: "Gestione dell'Imbarazzo, Empatia, Stile di Comunicazione Non Verbale"
  }
];