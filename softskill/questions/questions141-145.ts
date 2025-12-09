import { Question } from "../types";

export const questions141to145: Question[] = [
  {
    num: 141,
    scenario: "Devi comprare un elettrodomestico nuovo ma è rimasto solo quello in esposizione, come reagisci?",
    instructions: [
      "Immagine di una mano che prende l'elettrodomestico \"esposto\" senza esitare,  accettazione immediata dello \"status quo\" e  della \"seconda scelta\".",
      "Immagine di una persona che osserva attentamente l'elettrodomestico esposto cercando \"difetti\",  esitazione e  verifica \"minuziosa\" prima di accettare.",
      "Immagine di una persona che indica un cartello \"SCONTO\" al venditore,  negoziazione attiva per ottenere un \"vantaggio\" economico in cambio dell' \"usato garantito\".",
      "Immagine di una persona che esce dal negozio lasciando l'elettrodomestico esposto \"al suo posto\",  rifiuto netto e ricerca di un prodotto \"nuovo\" \"altrove\"."
    ],
    captions: [
      "Prendo Quello Che C'è",
      "Controllo Bene i Graffi",
      "Voglio un Prezzo Speciale",
      "Cerco il Nuovo Perfetto"
    ],
    options: [
      {
        value: "Prendo Quello Che C'è",
        text: "(Negativo: potenziale sottovalutazione della qualità e rischio di vendita non ottimale in termini di value for money reale, percezione di approccio superficiale o eccessivamente orientato alla velocità e comodità immediata a scapito della qualità e della scelta ponderata e informata) (Positivo: massima velocità e semplicità dell'acquisto e approccio pragmatico e senza fronzoli, efficienza e rapidità decisionale, non si perde in dettagli o complicazioni, massimizzazione della velocità e immediatezza della transazione commerciale pura)."
      },
      {
        value: "Controllo Bene i Graffi",
        text: "(Positivo: approccio cauto e attento alla qualità e verifica delle condizioni del prodotto esposto, attenzione al value for money concreto, volontà di non accettare compromessi sulla qualità essenziale, persona percepita come accorta e attenta ai dettagli) (Negativo: potenziale eccessivo perfezionismo e iper-controllo e rischio di perdere tempo prezioso in verifiche eccessive, percezione di pignoleria e diffidenza eccessiva, approccio forse non sempre ottimizzato per la velocità decisionale e la capacità di cogliere le opportunità al volo)."
      },
      {
        value: "Voglio un Prezzo Speciale",
        text: "(Positivo: massimizzazione del risparmio e ottenimento di un prezzo vantaggioso e commisurato alle condizioni del prodotto esposto, approccio negoziale e assertivo, attenzione al value for money spinto, persona percepita come abile nella negoziazione e orientata al risultato economico) (Negativo: potenziale tensione nella negoziazione e rischio di danneggiare la relazione commerciale per eccessiva insistenza sul prezzo, percezione di eccessiva attenzione al risparmio e tirchieria, approccio forse non sempre ottimizzato per la massima armonia relazionale e velocità di conclusione della transazione commerciale complessiva)."
      },
      {
        value: "Cerco il Nuovo Perfetto",
        text: "(Negativo: potenziale spreco di tempo nella ricerca ossessiva della perfezione e rischio di non trovare niente di meglio o di spendere di più per un vantaggio non sostanziale, percezione di pignoleria e ossessione per la perfezione formale non necessaria, approccio forse non sempre ottimizzato per il miglior rapporto qualità-prezzo reale e per l'efficienza complessiva del processo di acquisto) (Positivo: massima attenzione alla qualità e all'integrità del prodotto nuovo e ricerca della perfezione e dell'eccellenza assoluta, approccio rigoroso e senza compromessi sulla qualità intrinseca del prodotto nuovo, persona percepita come esigente e attenta alla qualità)."
      }
    ],
    softSkill: "SoddisfazioneDelCliente, GestioneDelleObiezioni",
    characteristics: "Stile di Acquisto, Negoziazione, Attenzione al Dettaglio, Ricerca della Perfezione"
  },
  {
    num: 142,
    scenario: "Come fai crescere il tuo giardino?",
    instructions: [
      "Immagine di un giardino selvaggio e incolto,  \"lascia fare alla natura\",  minimo intervento,  leadership \"laissez-faire\".",
      "Immagine di un giardino curato con \"tutori\" di supporto per le piante,  fornisce un \"supporto essenziale\" ma lascia autonomia di crescita.",
      "Immagine di un giardiniere che \"potatura\" e \"guida\" la crescita di ogni pianta individualmente,  guida personalizzata e mentoring attivo.",
      "Immagine di un giardino geometrico e rigidamente \"controllato\" in ogni dettaglio,  controllo totale e direttivo sulla crescita,  leadership autoritaria."
    ],
    captions: [
      "Lascio Fare alla Natura",
      "Supporto Essenziale",
      "Guida Personalizzata",
      "Controllo Totale"
    ],
    options: [
      {
        value: "Lascio Fare alla Natura",
        text: "(Positivo: massima autonomia e libertà di crescita individuale, valorizzazione dell'iniziativa personale, approccio non direttivo e non invasivo che rispetta la spontaneità e l'auto-responsabilità) (Negativo: mancanza di guida e supporto attivo, rischio di crescita non ottimizzata e sottoutilizzo del potenziale, percezione di leadership assente o poco presente per una crescita strutturata)."
      },
      {
        value: "Supporto Essenziale",
        text: "(Positivo: supporto sufficiente per la crescita senza eccessivo controllo, equilibrio tra guida e autonomia, valorizzazione di una crescita autonoma ma supportata, percezione di leadership presente ma non oppressiva) (Negativo: guida non sempre sufficiente per chi ha bisogno di maggiore supporto, rischio di crescita non pienamente ottimizzata, percezione di leadership non sempre attiva o incisiva per il massimo sviluppo guidato)."
      },
      {
        value: "Guida Personalizzata",
        text: "(Positivo: massima attenzione allo sviluppo individuale, guida personalizzata e mirata sui bisogni specifici, valorizzazione del potenziale unico di ogni persona, approccio people-centric e orientato allo sviluppo reale delle persone) (Negativo: alto investimento di tempo e risorse, potenziale problema di scalabilità per team numerosi, rischio di creare dipendenza dalla guida del leader e percezione di micromanagement a scapito della dinamica di gruppo)."
      },
      {
        value: "Controllo Totale",
        text: "(Positivo: massima conformità a standard predefiniti, controllo totale sulla direzione della crescita, apparente efficienza nel breve termine per obiettivi specifici, approccio direttivo e orientato all'esecuzione rigorosa) (Negativo: soffocamento della creatività e dell'iniziativa individuale, demotivazione e rischio di burnout per eccessiva pressione, percezione di leadership autoritaria e poco incline alla delega, clima di lavoro potenzialmente teso e poco stimolante)."
      }
    ],
    softSkill: "SviluppoDellePersone, Leadership",
    characteristics: "Stili di Leadership, Approccio allo Sviluppo del Team, Delega vs. Controllo"
  },
  {
    num: 143,
    scenario: "Ti sei perso in una foresta piena di rumori, come trovi la strada per uscire?",
    instructions: [
      "Immagine di una persona persa e confusa in un bosco fitto,  ignora le \"voci\" intorno,  navigazione \"a caso\" senza ascolto.",
      "Immagine di una persona che segue un sentiero tracciato ignorando i suoni della foresta,  ascolto \"selettivo\" e  focalizzato solo sulla \"direzione\" predefinita.",
      "Immagine di una persona che si orienta con una bussola e ascolta i suoni della foresta,  ascolto attivo e  orientamento \"consapevole\" e  \"multisensoriale\".",
      "Immagine di una persona paralizzata e bloccata dall'eccessiva analisi di ogni singolo suono della foresta,  iper-analisi e \"paralisi da ascolto\" eccessivo."
    ],
    captions: [
      "Chiamo i Soccorsi",
      "Cerco il Sentiero",
      "Riferimenti e Orecchio",
      "Focalizzato sui Suoni"
    ],
    options: [
      {
        value: "Chiamo i Soccorsi",
        text: "(Negativo: dipendenza eccessiva da aiuto esterno e mancanza di autonomia e self-reliance, rinuncia a sviluppare le proprie capacità di orientamento e problem-solving autonomo, percezione di persona dipendente e poco autonoma) (Positivo: massimizzazione probabilità di successo rapido grazie a intervento esterno, approccio pragmatico che riconosce i propri limiti, valorizzazione aiuto esterno come risorsa legittima ed efficace, realismo e consapevolezza dei propri limiti e della necessità di chiedere aiuto quando necessario)."
      },
      {
        value: "Cerco il Sentiero",
        text: "(Positivo: sviluppo personale focalizzato e diretto verso obiettivi chiari e ottimizzazione delle energie e del tempo per raggiungere mete prestabilite, approccio efficiente e orientato all'obiettivo, persona percepita come determinata e focalizzata) (Negativo: mancanza di apertura a feedback inattesi e rischio di visione limitata dal sentiero predefinito, opportunità di crescita mancate fuori dal percorso prestabilito, percezione di rigidità e focalizzazione eccessiva sugli obiettivi preimpostati, approccio forse non sempre ottimizzato per la massima esplorazione creativa e non convenzionale del proprio potenziale a 360 gradi)."
      },
      {
        value: "Riferimenti e Orecchio",
        text: "(Positivo: approccio olistico e multisensoriale alla crescita e equilibrio tra guida interna e ascolto esterno, valorizzazione sia dell'intuizione personale che del feedback altrui, approccio completo e versatile, persona percepita come equilibrata e consapevole) (Negativo: richiede maggiore sforzo di analisi e integrazione e potenziale lentezza decisionale, approccio forse non sempre ottimizzato per la massima velocità e immediatezza della reazione e dell'azione, percezione di approccio meno diretto e più complesso e articolato)."
      },
      {
        value: "Focalizzato sui Suoni",
        text: "(Negativo: paralisi decisionale da eccesso di analisi e blocco della crescita personale per iper-ascolto, approccio iper-razionale che soffoca l'azione e la spontaneità, percezione di persona insicura e bloccata, rischio di burnout da eccessivo carico informativo e iper-analisi) (Positivo: massima attenzione al feedback a 360 gradi e volontà di non trascurare nessuna voce potenzialmente utile, approccio iper-analitico e iper-razionale, ricerca della completezza informativa assoluta prima di agire, persona percepita come coscienziosa e attenta ai dettagli)."
      }
    ],
    softSkill: "SviluppoPersonale, AscoltoAttivo",
    characteristics: "Ascolto Attivo, Stile di Apprendimento, Approccio al Feedback"
  },
  {
    num: 144,
    scenario: "Stai giocando con i tuoi amici e scopri una \"scorciatoia\" per vincere. Che fai?",
    instructions: [
      "Immagine di un atleta che taglia il traguardo con una scorciatoia nascosta,  vittoria \"solitaria\" e ottenuta con mezzi \"sleali\",  priorità assoluta al vincere \"a ogni costo\".",
      "Immagine di un bivio con un cartello \"scorciatoia\" che indica una strada laterale \"tentatrice\",  tentazione di usare la scorciatoia ma esitazione etica.",
      "Immagine di una persona che indica la scorciatoia scoperta a tutti gli altri amici giocatori,  condivisione della \"scorciatoia\" per rendere il gioco \"equo\" per tutti.",
      "Immagine di una persona che sorride mentre segue il percorso \"lungo\" e \"difficile\" ma \"corretto\",  rinuncia alla scorciatoia per rispetto delle regole e del \"fair play\",  priorità all'integrità del gioco e alla \"partecipazione\" \"leale\"."
    ],
    captions: [
      "Solo la Vittoria Conta",
      "Scorciatoia Tentatrice",
      "Scorciatoia per Tutti",
      "Gusto della Sfida"
    ],
    options: [
      {
        value: "Solo la Vittoria Conta",
        text: "(Negativo: compromesso etico e danno alla relazione con gli amici e percezione di slealtà e egoismo e eccessiva competitività non sana, mancanza di fair play e rispetto per le regole del gioco e per la lealtà verso gli amici) (Positivo: massimizzazione delle probabilità di vittoria personale e approccio strategico e orientato al risultato individuale, determinazione ferrea nel vincere e raggiungere l'obiettivo primario (la vittoria a tutti i costi), persona percepita come competitiva e ambiziosa)."
      },
      {
        value: "Scorciatoia Tentatrice",
        text: "(Positivo: consapevolezza della scorciatoia come opportunità di vantaggio competitivo e percezione della tentazione e del dilemma etico, approccio non totalmente rigido o puritano che considera la possibilità di piegare le regole per ottenere un vantaggio, ma con consapevolezza e senso critico) (Negativo: compromesso etico non risolto e rischio di perdita di rispetto di sé, ambivalenza e conflitto interiore non risolto, percezione di integrità non totale o non pienamente affidabile sul piano etico, approccio moralmente ambiguo e non pienamente coerente con i propri valori ideali)."
      },
      {
        value: "Scorciatoia per Tutti",
        text: "(Positivo: massima priorità all'equità e al fair play per tutti e approccio trasparente e collaborativo, condivisione del vantaggio con il gruppo, valorizzazione dello spirito di squadra e della lealtà verso gli amici compagni di gioco, persona percepita come generosa e leale) (Negativo: rinuncia al vantaggio competitivo personale e non massimizzazione della performance individuale pura, percezione di approccio non sempre ottimizzato per la massima competizione individuale e vittoria personale a tutti i costi, approccio forse troppo altruista o collettivista e meno individualista e competitivo in senso stretto)."
      },
      {
        value: "Gusto della Sfida",
        text: "(Positivo: massima integrità personale e rispetto delle regole del gioco e valorizzazione della competizione leale e autentica, approccio etico e sportivo, persona percepita come integra e leale e rispettosa delle regole e orientata al vero spirito del gioco e della competizione sana e leale) (Negativo: rinuncia a una potenziale vittoria facile e immediata e non massimizzazione del risultato pratico vittoria tout court, percezione di eccessivo purismo etico o rigidità morale, approccio forse non sempre ottimizzato per la massima efficienza e pragmatismo nella competizione pura e semplice orientata al risultato immediato vittoria)."
      }
    ],
    softSkill: "DecisionMakingStrategico, Integrità",
    characteristics: "Etica, Fair Play, Integrità, Stile Competitivo, Pragmatismo"
  },
  {
    num: 145,
    scenario: "Ti perdi in un labirinto intricato. Come trovi la via d'uscita?",
    instructions: [
      "Immagine di una persona che corre nel labirinto,  azione impulsiva e  \"testa bassa\",  approccio \"trial and error\" senza metodo.",
      "Immagine di una persona che segue la folla sperando che qualcuno conosca la strada,  affidamento passivo al \"gregge\",  mancanza di pensiero critico autonomo.",
      "Immagine di una persona che consulta una bussola per orientarsi nel labirinto,  approccio metodico e  pianificato,  pensiero critico \"strumentale\".",
      "Immagine di una persona che sale su una torre per avere una \"visione d'insieme\" del labirinto dall'alto,  pensiero critico \"strategico\" e  \"olistico\",  analisi \"panoramica\" del problema."
    ],
    captions: [
      "Vado da Solo",
      "Seguo la Folla",
      "Uso la Bussola",
      "Mi Arrampico"
    ],
    options: [
      {
        value: "Vado da Solo",
        text: "(Negativo: mancanza di metodo e pianificazione, approccio impulsivo e inefficiente, rischio di perdersi ulteriormente, percezione di scarsa capacità di problem-solving strategico e strutturato, approccio caotico e poco efficace in contesti complessi che richiederebbero maggiore pianificazione e pensiero critico organizzato) (Positivo: approccio dinamico e action-oriented, velocità nell'azione, approccio pragmatico e learning-by-doing, massimizzazione della velocità di reazione e azione immediata di fronte al problema, approccio non paralizzato dall'analisi eccessiva)."
      },
      {
        value: "Seguo la Folla",
        text: "(Negativo: mancanza di autonomia decisionale e di pensiero critico personale, dipendenza dalle decisioni altrui, rischio di omologazione e pensiero gregario, approccio passivo e non protagonista nella risoluzione dei problemi, percezione di persona dipendente, non autonoma e poco incline all'iniziativa e al pensiero critico personale) (Positivo: evitamento del rischio di sbagliare strada da soli, affidamento alla saggezza della folla (ipotetica), approccio collaborativo (apparente), senso di sicurezza nel seguire la massa, non isolamento di fronte al problema, approccio sociale e di adeguamento al gruppo)."
      },
      {
        value: "Uso la Bussola",
        text: "(Positivo: approccio metodico e pianificato, utilizzo di strumenti oggettivi e affidabili per l'orientamento, massimizzazione della precisione e dell'efficacia nell'orientamento, approccio razionale e data-driven, percezione di persona organizzata, metodica, affidabile e orientata alla soluzione efficace e razionale) (Negativo: potenziale dipendenza eccessiva da strumenti esterni, rischio di non sviluppare pienamente l'intuito e l'orientamento autonomo, percezione di rigidità metodologica, eccessiva fiducia nella tecnologia e nei sistemi predefiniti, approccio forse non sempre ottimizzato per contesti in cui le mappe non sono disponibili o non completamente affidabili e è richiesta maggiore autonomia e capacità di improvvisazione e problem-solving creativo senza guide esterne predefinite)."
      },
      {
        value: "Mi Arrampico",
        text: "(Positivo: massima capacità di analisi strategica e visione d'insieme, approccio olistico che considera il problema da una prospettiva superiore e panoramica, individuazione di pattern e soluzioni non immediatamente evidenti a livello superficiale, percezione di persona intelligente, analitica, visionaria e dotata di pensiero critico profondo e strategico) (Negativo: potenziale lentezza nel passare all'azione concreta, rischio di analisi paralysis per eccessiva focalizzazione sulla teoria e visione d'insieme a scapito della pratica e tempestività, percezione di approccio troppo analitico e poco pragmatico o tempestivo in contesti che richiederebbero maggiore velocità di reazione e azione immediata e concreta per risolvere il problema urgente qui e ora, approccio forse non sempre ottimizzato per la massima efficienza e rapidità nella risoluzione di problemi pratici che richiedono azione tempestiva e immediata più che analisi teorica approfondita e visione d'insieme panoramica)."
      }
    ],
    softSkill: "ProblemSolving, PensieroCritico",
    characteristics: "Problem Solving, Pensiero Critico, Approccio alla Risoluzione dei Problemi, Stili Cognitivi"
  }
];
