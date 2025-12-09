import { Question } from "../types";

export const questions121to125: Question[] = [
  {
    num: 121,
    scenario: "Rifiutano qualcosa che ti eri impegnato a fare con tanto impegno, cosa vedi?",
    instructions: [
      "Immagine di un vaso rotto in mille pezzi,  sforzo inutile,  impegno \"frantumato\" dal rifiuto.",
      "Immagine di un vaso crepato ma ancora integro,  sforzo \"intaccato\" dal rifiuto,  ma resilienza parziale.",
      "Immagine di un vaso scheggiato ma ancora utilizzabile,  sforzo \"provato\" dal rifiuto,  ma volontà di riparare e riprovare.",
      "Immagine di un vaso integro e perfetto su una base solida,  rifiuto percepito come irrilevante,  fiducia incrollabile nel proprio valore e impegno."
    ],
    captions: [
      "Vaso Rotto",
      "Vaso Crepato",
      "Vaso Scheggiato",
      "Vaso Intatto"
    ],
    options: [
      {
        value: "Vaso Rotto",
        text: "(Negativo: scoraggiamento totale e percezione di fallimento personale, bassa resilienza e frustrazione paralizzante, difficoltà a ripartire dopo il rifiuto, opportunità di crescita mancate per blocco emotivo) (Positivo: autenticità emotiva e profondità dei sentimenti, umanità nella reazione alla delusione, non rimozione o negazione delle emozioni negative, approccio autentico e non artefatto alla gestione della frustrazione e del rifiuto)."
      },
      {
        value: "Vaso Crepato",
        text: "(Positivo: resilienza moderata e capacità di reazione al rifiuto, volontà di non arrendersi completamente e di riparare la situazione, approccio costruttivo e non distruttivo, persona percepita come tenace e non facilmente abbattibile) (Negativo: resilienza non completa o non perfetta e rischio di insicurezza residua, potenziale ombra del rifiuto passato, percezione di fragilità emotiva residua o non completa guarigione dalla ferita del rifiuto)."
      },
      {
        value: "Terreno Arido",
        text: "(Positivo: resilienza attiva e proattiva e ricerca di soluzioni per superare le obiezioni, approccio costruttivo e orientato al miglioramento e alla crescita attraverso il rifiuto, persona percepita come pragmatica e orientata alla soluzione) (Negativo: potenziale dipendenza da supporto esterno per la crescita e rischio di non sviluppare piena autonomia nel superamento ostacoli, percezione di non completa autosufficienza nella crescita personale e nel superamento autonomo delle obiezioni, approccio forse non sempre ottimizzato per l'indipendenza e l'auto-apprendimento autonomo)."
      },
      {
        value: "Vaso Intatto",
        text: "(Positivo: massima autostima e resilienza totale e fiducia incrollabile nel proprio valore e nelle proprie capacità, indifferenza al giudizio esterno negativo, approccio self-confident e indipendente, persona percepita come forte e sicura di sé) (Negativo: potenziale mancanza di autocritica costruttiva e rischio di non imparare dagli errori, percezione di eccessiva autostima auto-referenziale e narcisistica, mancanza di umiltà e apertura al feedback negativo come fonte di miglioramento e crescita personale e professionale)."
      }
    ],
    softSkill: "SviluppoPersonale,GestioneDelleObiezioni",
    characteristics: "Resilienza,Reazione al Rifiuto,Fiducia in Sé"
  },
  {
    num: 122,
    scenario: "Il tuo partner deve trasferirsi lontano per lavoro che strada scegli?",
    instructions: [
      "Immagine di un bivio con due strade separate,  scelta di strade separate,  priorità allo sviluppo personale \"separato\".",
      "Immagine di due strade parallele che proseguono affiancate ma distanti,  scelta di mantenere una \"distanza\" ma con una certa \"vicinanza\" parallela.",
      "Immagine di due strade che convergono in un'unica strada,  ricerca di un \"punto di incontro\" tra sviluppo personale e relazione,  convergenza graduale.",
      "Immagine di grande svincolo stradale dove più strade sifondono completamente in un'unica strada ampia e condivisa,  priorità assoluta alla relazione,  sviluppo personale \"integrato\" nella coppia."
    ],
    captions: [
      "Strade Separate",
      "Strade Parallele",
      "Strade Convergenti",
      "Strada Comune"
    ],
    options: [
      {
        value: "Strade Separate",
        text: "(Negativo: perdita cliente e mancata fidelizzazione, approccio non orientato alla relazione a distanza, opportunità di business future potenzialmente mancate, percezione di scarsa flessibilità e adattabilità al cambiamento geografico della clientela) (Positivo: semplificazione gestione e focalizzazione risorse su clientela locale, efficienza operativa geografica, approccio pragmatico e local-centric, ottimizzazione risorse su area geografica circoscritta)."
      },
      {
        value: "Strade Parallele",
        text: "(Positivo: mantenimento relazione cliente a distanza e tentativo di fidelizzazione non invasivo, utilizzo di strumenti remoti per la comunicazione e il servizio, approccio ibrido che bilancia presenza fisica e supporto virtuale, flessibilità e adattabilità moderata al cambiamento geografico) (Negativo: relazione meno calda e personale a distanza e richiede maggiore sforzo comunicativo per mantenere vivo il rapporto, percezione di minore vicinanza e presenza fisica, efficacia relazionale potenzialmente inferiore rispetto a interazioni in presenza)."
      },
      {
        value: "Strade Convergenti",
        text: "(Positivo: forte adattabilità al cambiamento e volontà di mantenere la relazione attivamente nonostante la distanza, ricerca di soluzioni creative per la fidelizzazione a distanza, approccio proattivo e orientato alla soluzione, persona percepita come flessibile e adattabile) (Negativo: richiede sforzo di adattamento e relazione a distanza non sempre ottimale come quella in presenza, potenziale percezione di approccio forzato o non completamente naturale nel mantenere la relazione a distanza, efficacia della relazione potenzialmente inferiore rispetto a interazioni face-to-face ideali)."
      },
      {
        value: "Strada Comune",
        text: "(Positivo: massimo impegno per la fidelizzazione totale e estrema attenzione al cliente, disponibilità a cambiamenti radicali per mantenere la relazione, approccio customer-centric spinto all'estremo, persona percepita come estremamente dedicata al cliente e affidabile al 100%) (Negativo: cambiamento radicale e potenzialmente stressante per la vita privata e non scalabilità, rischio di dipendenza eccessiva da singolo cliente, percezione di approccio non sempre razionale in termini di costo-beneficio e sostenibilità a lungo termine, eccessivo sacrificio personale per la fidelizzazione estrema)."
      }
    ],
    softSkill: "FidelizzazioneDelCliente,GestioneDelCambiamento",
    characteristics: "Fidelizzazione del Cliente,Adattabilità,Orientamento al Servizio"
  },
  {
    num: 123,
    scenario: "Sei al ristorante, ordini un piatto costoso e decantato da tutti, ma non ti piace. Come reagisci?",
    instructions: [
      "Immagine di una persona che indossa una maschera sorridente mentre mangia,  sopporta in silenzio la delusione,  pazienza \"forzata\".",
      "Immagine di un piatto elegantemente \"abbandonato\" intonso sul tavolo,  rifiuto silenzioso e \"distaccato\",  non consuma e basta.",
      "Immagine di una campanella da tavolo per chiamare il cameriere,  richiesta di attenzione e  interazione \"controllata\" per esprimere il problema.",
      "Immagine di una \"bomba\" fumante con miccia accesa sopra il piatto,  protesta eclatante e \"distruttiva\",  recensione negativa \"esplosiva\"."
    ],
    captions: [
      "Lo Finisco Ugualmente",
      "Non lo Mangio",
      "Chiedo la Sostituzione",
      "Recensione Negativa"
    ],
    options: [
      {
        value: "Lo Finisco Ugualmente",
        text: "(Negativo: insoddisfazione inespressa e mancanza di feedback costruttivo, opportunità persa di migliorare il servizio, percezione di passività o eccessiva tolleranza, rischio di non essere sincero e autentico nel feedback) (Positivo: approccio pacifico e non confrontazionale, evitamento scene e complicazioni, massimizzazione semplicità e velocità, mantenimento forma e bon ton, priorità all'armonia e all'evitamento del conflitto diretto)."
      },
      {
        value: "Non lo Mangio",
        text: "(Negativo: insoddisfazione non comunicata al ristorante e mancanza di feedback diretto e costruttivo, opportunità persa di migliorare il servizio immediatamente, ristorante non consapevole del problema, rischio di insoddisfazione latente e non gestita) (Positivo: approccio discreto e non invadente e evitamento scene e lamentele, massimizzazione semplicità della gestione individuale della situazione, non disturbo del ristorante, approccio riservato e silenzioso)."
      },
      {
        value: "Chiedo la Sostituzione",
        text: "(Positivo: comunicazione diretta e costruttiva dell'insoddisfazione e ricerca di una soluzione dialogica e win-win, feedback immediato e potenzialmente utile per il ristorante, approccio assertivo ma non aggressivo e orientato alla risoluzione del problema in modo civile e collaborativo) (Negativo: richiede un certo sforzo comunicativo e potenziale leggero disagio nella situazione, soluzione non sempre garantita al 100%, percezione di approccio formale o non completamente spontaneo, rischio di non ottenere piena soddisfazione nonostante l'intervento educato)."
      },
      {
        value: "Recensione Negativa",
        text: "(Negativo: danno reputazionale permanente e non costruttivo e mancanza di feedback privato e diretto per il miglioramento, percezione di approccio vendicativo e aggressivo, poco collaborativo e impersonale, non orientato alla soluzione ma alla punizione pubblica) (Positivo: massima espressione della propria insoddisfazione in modo plateale e inequivocabile, vendetta simbolica contro il ristorante, potenziale sfogo emotivo e catartico, approccio tranchant e senza mezzi termini, denuncia pubblica della cattiva esperienza)."
      }
    ],
    softSkill: "SoddisfazioneDelCliente,FidelizzazioneDelCliente",
    characteristics: "Gestione della Insoddisfazione,Stile di Feedback,Approccio alla Critica"
  },
  {
    num: 124,
    scenario: "Hai un evento importante da organizzare, come lo pubblicizzi?",
    instructions: [
      "Immagine di un segnale radio che trasmette a onde larghe a tutti,  pubblicità massiccia e indiscriminata.",
      "Immagine di un gruppo di persone impegnate sui social,  campagna mirata su piattaforme social (Meta).",
      "Immagine di una lettera sigillata con ceralacca,  inviti privati via email,  comunicazione riservata e \"one-to-one\".",
      "Immagine di persone che si passano un segreto sussurrando all'orecchio,  passaparola esclusivo e \"underground\"."
    ],
    captions: [
      "Agenzia di Marketing",
      "Campagna Social",
      "Email Private",
      "Passaparola"
    ],
    options: [
      {
        value: "Agenzia di Marketing",
        text: "(Negativo: perdita di esclusività e rischio di diluizione del valore premium dell'evento, minore controllo sulla qualità del pubblico, potenziale effetto spam o percezione di evento non realmente esclusivo, mancanza di selezione e targetizzazione del pubblico) (Positivo: massima visibilità virale potenziale e portata amplissima e democratica, raggiungimento di un pubblico di massa, massimizzazione della quantità di persone raggiunte, approccio aperto e inclusivo in termini di visibilità)."
      },
      {
        value: "Campagna Social",
        text: "(Positivo: visibilità mirata a target specifici e controllo del pubblico interessato, ottimizzazione del budget pubblicitario, approccio professionale e data-driven, massimizzazione del ritorno sull'investimento pubblicitario e migliore qualificazione del pubblico intercettato) (Negativo: esclusività non massima e rischio di raggiungere pubblico non targettizzato, percezione di approccio commerciale standard, mancanza di effetto esclusività e rarità percepita, non ottimizzazione del prestigio e valore percepito dell'evento ultra-esclusivo)."
      },
      {
        value: "Email Private",
        text: "(Positivo: massima esclusività e selezione personalizzata del pubblico e controllo totale sugli invitati, creazione di un senso di privilegio e rarità per gli invitati, approccio ultra-premium e personalizzato, massimizzazione del valore percepito di esclusività e prestigio) (Negativo: portata limitata a pochi eletti e mancanza di visibilità di massa, non sfrutta il potenziale virale dei social, potenziale percezione di eccessivo elitarismo o snobismo, non massimizzazione della quantità di partecipanti)."
      },
      {
        value: "Passaparola",
        text: "(Positivo: massima esclusività in assoluto e creazione di un evento leggendario e mitico per pochi iniziati, effetto buzz elevatissimo nel cerchio ristretto degli eletti, approccio ultra-esclusivo e misterioso, massimizzazione del desiderio e della curiosità nel pubblico target, effetto alone di segretezza e prestigio estremo) (Negativo: portata ridottissima e quasi invisibile al di fuori della cerchia ristretta, rischio di non raggiungere neanche un pubblico target sufficientemente ampio, percezione di eccessivo elitarismo, snobismo e chiusura, approccio non scalabile e non gestibile in termini di partecipazione)."
      }
    ],
    softSkill: "Presentazione,SicurezzaDigitale",
    characteristics: "Stile di Promozione,Gestione della Privacy,Portata vs. Esclusività"
  },
  {
    num: 125,
    scenario: "Vedi un nuovo modello innovativo di cellulare, che fai?",
    instructions: [
      "Immagine di un cellulare come una fortezza medievale inespugnabile,  chiusura totale all'innovazione esterna,  \"noi siamo i migliori così\".",
      "Immagine di una persona che guarda di sfuggita un nuovo cellulare con aria distratta,  attenzione superficiale all'innovazione,  minimo adattamento.",
      "Immagine di un architetto che rivede i progetti alla luce di nuove tendenze,  rielaborazione moderata e adattamento parziale all'innovazione.",
      "Immagine di un camaleonte che cambia colore per mimetizzarsi perfettamente nel nuovo ambiente,  adattamento radicale e completo all'innovazione,  \"tabula rasa\" e ripartenza da zero."
    ],
    captions: [
      "Tengo il Mio",
      "Sguardo di Sfuggita",
      "Studio le Caratteristiche",
      "Entro a Provarlo"
    ],
    options: [
      {
        value: "Tengo il Mio",
        text: "(Negativo: rischio di obsolescenza e perdita di competitività nel lungo periodo, mancanza di adattabilità e visione miope, percezione di rigidità e chiusura mentale e mancanza di spirito innovativo) (Positivo: coerenza con identità e valorizzazione tradizione, approccio conservativo e focalizzato su stabilità e continuità, rassicurazione della clientela tradizionalista e avversa al rischio innovativo)."
      },
      {
        value: "Sguardo di Sfuggita",
        text: "(Negativo: rischio di sottovalutare la portata dell'innovazione e adattamento insufficiente e tiepido, potenziale perdita di terreno competitivo nel medio-lungo periodo, percezione di miopia strategica o falsa sicurezza) (Positivo: focalizzazione sul core business e approccio pragmatico e solido, evitamento distrazioni inutili e prudenza nel valutare mode passeggere, mantenimento rotta consolidata)."
      },
      {
        value: "Studio le Caratteristiche",
        text: "(Positivo: apertura all'innovazione controllata e adattamento ragionato e selettivo, integrazione di elementi validi dell'innovazione altrui senza stravolgere il proprio modello, approccio intelligente che bilancia tradizione e innovazione, persona percepita come aggiornata e dinamica) (Negativo: adattamento moderato forse non sufficiente per competere con innovazione radicale e rischio di non cogliere appieno il potenziale del cambiamento dirompente, percezione di innovazione controllata ma non rivoluzionaria, approccio forse non sempre ottimizzato per la massima disruption e rottura degli schemi consolidati)."
      },
      {
        value: "Entro a Provarlo",
        text: "(Positivo: massima apertura al cambiamento e all'innovazione radicale e capacità di reinventarsi completamente e ripartire da zero se necessario, approccio disruptive e rivoluzionario, persona percepita come visionaria e coraggiosa e iper-adattabile e pronta a cogliere ogni sfida del cambiamento radicale) (Negativo: rischio di perdita identità distintiva e potenziale percezione di opportunismo o imitazione acritica, sostenibilità a lungo termine incerta di cambiamenti troppo radicali, percezione di approccio camaleontico e non sempre autentico o coerente con la propria storia e brand identity)."
      }
    ],
    softSkill: "FidelizzazioneDelCliente,MenteAperta",
    characteristics: "Adattabilità al Cambiamento,Apertura Mentale,Prontezza Innovativa"
  }
];