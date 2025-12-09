import { Question } from "../types";

export const questions: Question[] = [
  {
    num: 6,
    scenario: "Un collega spiega una cosa complicata, ma non si capisce niente. Tu che fai?",
    instructions: [
      "Immagine di qualcuno che annuisce.",
      "Immagine di qualcuno che ascolta educatamente ma pensa ad altro.",
      "Immagine di una/uno studente che alza la mano",
      "Immagine di un dibattito tra due candidati"
    ],
    captions: [
      "Va Bene, non Capisco, Me lo Spiega Qualcun Altro",
      "Ascolto, Con Educazione ma Penso ad Altro",
      "Chiedo Chiarimenti, per Capire se Sbaglio Io",
      "Ti Dico Chiaramente, Ma che Stai Dicendo?"
    ],
    options: [
      {
        value: "Va Bene, non Capisco, Me lo Spiega Qualcun Altro",
        text: "(Negativo: mancanza di comprensione reale e potenziale rischio di errore per non aver capito, approccio passivo e non proattivo nell'affrontare la difficoltà di comprensione, opportunità mancate di apprendimento e chiarezza immediata, percezione di superficialità o mancanza di impegno nel capire a fondo) (Positivo: mantenimento dell'armonia relazionale e del bon ton in riunione, evitamento di interruzioni o domande percepite come inopportune o stupide in pubblico, approccio prudente che privilegia l'armonia del gruppo e l'evitamento di far perdere tempo agli altri con proprie difficoltà di comprensione personali, massimizzazione dell'efficienza apparente della riunione nel breve termine)."
      },
      {
        value: "Ascolto, Con Educazione ma Penso ad Altro",
        text: "(Negativo: disinteresse di fatto verso la spiegazione del collega, mancata attenzione ai dettagli e potenziale perdita di informazioni importanti, approccio passivo-aggressivo che evita il confronto diretto ma non si impegna davvero per capire e risolvere il problema di comunicazione, percezione di superficialità, distrazione e mancanza di reale coinvolgimento e interesse verso la comunicazione efficace nel team e la comprensione reciproca approfondita) (Positivo: mantenimento di un clima formalmente educato e non conflittuale in apparenza, evitamento di interruzioni e domande percepite come inopportune o fuori luogo in pubblico, massimizzazione dell'efficienza apparente della riunione nel breve termine, approccio prudente e conservativo che privilegia la forma e l'evitamento di problemi immediati e tangibili in apparenza)."
      },
      {
        value: "Chiedo Chiarimenti, per Capire se Sbaglio Io",
        text: "(Positivo: tentativo attivo di comprensione e volontà di superare la difficoltà comunicativa, approccio proattivo e orientato alla soluzione del problema di comprensione, impegno per la chiarezza della comunicazione, percezione di persona attiva, curiosa, impegnata e non rassegnata di fronte alle difficoltà di comprensione comunicativa) (Negativo: comprensione ancora superficiale e non pienamente approfondita, rischio di rimanere con lacune nella comprensione e di non cogliere dettagli importanti successivamente, approccio a metà strada che si accontenta di una comprensione parziale e non completa e definitiva, percezione di non piena perseveranza o determinazione nel capire a fondo davvero tutto fino in fondo e senza accontentarsi di una comprensione superficiale o approssimativa)."
      },
      {
        value: "Ti Dico Chiaramente, Ma che Stai Dicendo?",
        text: "(Positivo: massima accuratezza e comprensione approfondita, impegno totale per la chiarezza assoluta della comunicazione, approccio perfezionista e orientato all'eccellenza nella comprensione e nella comunicazione efficace, volontà di non lasciare niente in sospeso o non capito e di verificare ogni dettaglio fino in fondo per garantire la massima precisione e completezza della comprensione, percezione di persona meticolosa, precisa, affidabile al 100% e orientata alla massima chiarezza e accuratezza comunicativa a tutti i costi) (Negativo: pedanteria e potenziale rallentamento eccessivo della comunicazione e della riunione, rischio di apparire eccessivamente puntiglioso o pedante e non sempre ottimizzato per la velocità e l'efficienza operativa complessiva del team, percezione di approccio troppo rigido o formale e poco incline alla flessibilità e alla tolleranza dell'ambiguità e dell'incertezza inevitabile in contesti complessi e non sempre perfettamente chiari e comprensibili al 100% fin da subito)."
      }
    ],
    softSkill: "AscoltoAttivo, ComunicazioneEfficace",
    characteristics: "Ascolto Attivo, Capacità di Comunicazione, Comprensione"
  },
  {
    num: 7,
    scenario: "Ti hanno chiesto di portare a termine alcuni compiti in azienda, hai carta bianca tu che fai?",
    instructions: [
      "Immagine di manager che ascolta una presentazione di un collega",
      "Immagine di un team che fa brainstorming.",
      "Immagine di capitano di calcio che guida in campo .",
      "Immagine di un viaggiatore con un enorme zaino che indossa a fatica."
    ],
    captions: [
      "Relax, ci pensa la mia squadra",
      "Divido il Carico con i colleghi",
      "Mi Prendo la Guida del Gruppo",
      "Io Devo Finire il Lavoro, Punto"
    ],
    options: [
      {
        value: "Relax, ci pensa la mia squadra",
        text: "(Positivo: delega efficace e fiducia nel team, massima fiducia nel team e nelle capacità altrui, approccio delegante che valorizza l'autonomia e la responsabilizzazione dei membri del team, alleggerimento del carico di lavoro personale e ottimizzazione delle risorse umane collettive) (Negativo: mancanza di controllo diretto sulla situazione e sui risultati finali, rischio di perdere di vista i dettagli e le dinamiche operative concrete, potenziale deresponsabilizzazione eccessiva e percezione di leadership distaccata o poco presente e attiva nella gestione diretta dei compiti e del team operativo, approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore controllo diretto, supervisione attiva e leadership presente e tangibile in prima persona)."
      },
      {
        value: "Divido il Carico con i colleghi",
        text: "(Positivo: lavoro di squadra e condivisione delle responsabilità, massima valorizzazione del teamwork e della collaborazione paritaria, approccio inclusivo e democratico che coinvolge attivamente il team nella gestione dei compiti e nella divisione del carico di lavoro collettivo) (Negativo: diluizione della responsabilità individuale e lentezza decisionale, potenziale rallentamento del processo decisionale per eccessiva condivisione e brainstorming collettivo, rischio di decisioni annacquate o eccessivamente compromissorie per accontentare tutti, percezione di leadership meno incisiva o troppo collegiale e poco direttiva quando serve davvero decisioni rapide e unilaterali, approccio forse non sempre ottimizzato per la massima efficienza e velocità decisionale in contesti che richiederebbero decisioni forti e tempestive anche senza consenso unanime)."
      },
      {
        value: "Mi Prendo la Guida del Gruppo",
        text: "(Positivo: assunzione di responsabilità e gestione del carico di lavoro in prima persona senza delegare eccessivamente, approccio responsabile e orientato all'azione diretta, volontà di guidare attivamente il team e dare l'esempio in prima persona senza delegare eccessivamente agli altri, percezione di leadership presente, attiva, responsabile e non delegante eccessivamente le proprie responsabilità primarie di leadership) (Negativo: sottoutilizzo del team e potenziale limitazione della crescita altrui, rischio di micromanagement e controllo eccessivo che soffoca l'iniziativa e l'autonomia del team, potenziale sottoutilizzo delle competenze specifiche dei singoli membri del team, percezione di leadership accentratrice, poco incline alla delega e non sempre ottimizzata per la massima crescita e valorizzazione del potenziale individuale e collettivo del team nel lungo periodo (che potrebbe anche richiedere maggiore delega, autonomia e fiducia nelle capacità altrui invece che iper-controllo direttivo e accentratore del leader in prima persona))."
      },
      {
        value: "Io Devo Finire il Lavoro, Punto",
        text: "(Positivo: forte senso di responsabilità e dedizione estrema al compito, massimo impegno personale per portare a termine il lavoro a tutti i costi, approccio iper-responsabile e iper-dedicato che valorizza il senso del dovere personale prima di tutto, percezione di persona affidabile al 100%, iper-responsabile e pronta al sacrificio personale estremo pur di portare a termine il compito assegnato senza cedimenti o compromessi di sorta anche a costo del burnout) (Negativo: alto rischio di burnout e difficoltà nella delega, stress cronico e affaticamento psicofisico estremo da sovraccarico di lavoro prolungato, mancanza di sostenibilità nel lungo periodo, approccio non ottimizzato per la massima efficienza e produttività reale nel lungo termine (che potrebbe anche richiedere maggiore delega, organizzazione, pianificazione e distribuzione del carico di lavoro tra i membri del team per evitare colli di bottiglia, inefficienze e rischi di burnout individuale e collettivo a catena nel tempo), percezione di leadership non sostenibile nel lungo periodo, poco scalabile, non replicabile su larga scala e non sempre ottimizzata per il benessere psicofisico personale e del team nel suo complesso)."
      }
    ],
    softSkill: "GestioneDelTempo, GestioneDelloStress",
    characteristics: "Responsabilità, Rischio di Burnout, Orientamento al Team"
  },
  {
    num: 8,
    scenario: "Ti accorgi per primo di un problema da risolvere. che fai?",
    instructions: [
      "Immagine di qualcuno che chiede aiuto.",
      "Immagine di una squadra di tiro alla fune.",
      "Immagine di uno scalatore ad alta quota.",
      "Immagine di vigile urbano sotto la pioggia che dirige il traffico."
    ],
    captions: [
      "Lo faccio notare ad un responsabile",
      "Chiedo aiuto ai colleghi",
      "Se c'è un problema, io la scalo anche da solo",
      "Lo Affronto, Io Proteggo il mio Team"
    ],
    options: [
      {
        value: "Lo faccio notare ad un responsabile",
        text: "(Negativo: evitamento della responsabilità e potenziale deresponsabilizzazione, approccio passa-palla che non si assume direttamente l'onere della risoluzione, mancanza di iniziativa personale e protagonismo nella gestione del problema, percezione di persona poco incline a sporcarsi le mani e a farsi carico in prima persona dei casini altrui) (Positivo: efficienza nel delegare e attivare le risorse giuste, ottimizzazione delle risorse e delle competenze altrui, approccio manageriale che valorizza la delega e la divisione del lavoro, massimizzazione della probabilità di risoluzione efficace del problema affidandosi a figure autoritarie e competenti preposte per quel tipo di problema specifico, approccio pragmatico e orientato all'efficienza burocratica e organizzativa formale)."
      },
      {
        value: "Chiedo aiuto ai colleghi",
        text: "(Negativo: lentezza e diluizione della responsabilità, potenziale rallentamento della risoluzione per eccessiva condivisione e processi decisionali collettivi più farraginosi e meno rapidi e incisivi, rischio di diluizione della responsabilità individuale e di scarso protagonismo e iniziativa personale nella gestione del problema in prima persona, percezione di approccio troppo collegiale e poco decisionista e individualmente responsabile quando serve davvero azioni rapide e unilaterali) (Positivo: lavoro di squadra e condivisione della responsabilità, massima valorizzazione del teamwork e della collaborazione paritaria, approccio inclusivo e democratico che coinvolge attivamente il team nella ricerca di soluzioni e nella gestione del problema in modo condiviso e collettivo, promozione di un clima di lavoro collaborativo, partecipativo e orientato al team e alla coesione di gruppo)."
      },
      {
        value: "Se c'è un problema, io la scalo anche da solo",
        text: "(Positivo: iniziativa e proattività nella risoluzione dei problemi, massima autonomia e self-reliance nel problem-solving, approccio proattivo e orientato all'azione immediata e diretta, valorizzazione della sfida e del superamento degli ostacoli come occasione di crescita personale e professionale, percezione di persona intraprendente, coraggiosa, autonoma e orientata all'azione risolutiva in prima persona) (Negativo: rischio di sovraccarico e difficoltà nel chiedere aiuto quando serve davvero, potenziale isolamento autoreferenziale nel problem-solving individuale, mancanza di valorizzazione del teamwork e della collaborazione come risorsa utile e preziosa per risolvere i problemi in modo più efficace e efficiente, percezione di approccio iper-individualista e poco incline alla delega e al lavoro di squadra collaborativo quando opportuno e utile davvero per massimizzare l'efficacia complessiva della risoluzione del problema nel lungo periodo)."
      },
      {
        value: "Lo Affronto, Io Proteggo il mio Team",
        text: "(Positivo: disponibilità e spirito di servizio spiccati verso gli altri e verso il team, approccio altruista e orientato al servizio e al supporto proattivo dei colleghi, volontà di farsi carico dei problemi altrui e di alleggerire il carico di lavoro dei colleghi, percezione di persona disponibile, generosa, altruista e orientata al supporto e all'aiuto proattivo verso gli altri) (Negativo: rischio di sfruttamento e mancanza di confini sani, potenziale burnout per eccessivo carico di lavoro non equamente distribuito, rischio di non riuscire a gestire tutti i problemi da solo in modo efficace e tempestivo e senza delegare quando necessario davvero, percezione di persona troppo disponibile, poco assertiva nel dire di no e non sempre ottimizzata per la massima efficienza personale e del team nel lungo periodo (che potrebbe anche richiedere maggiore assertività nel definire confini chiari e non superabili e nel delegare responsabilità e compiti agli altri quando opportuno e necessario per evitare il sovraccarico personale e il burnout nel lungo periodo))."
      }
    ],
    softSkill: "GestioneDeiConflitti, Negoziazione",
    characteristics: "Assertività, Confini, Equilibrio del Carico di Lavoro"
  },
  {
    num: 9,
    scenario: "Pensa ai tuoi obiettivi top, quelli che ti stanno più a cuore. Quanto ti pesa raggiungerli?",
    instructions: [
      "Immagine di una piuma che vola leggera.",
      "Immagine di qualcuno che cammina in salita.",
      "Immagine di uno scalatore appeso su una parete rocciosa, sudato.",
      "Immagine di un muro imponente."
    ],
    captions: [
      "Non sono affaticato",
      "Mi Impegno",
      "Faccio Fatica",
      "Un Muro Invalicabile"
    ],
    options: [
      {
        value: "Non sono affaticato",
        text: "(Positivo: ottimismo di facciata e apparente fiducia nelle proprie capacità, approccio easygoing e non stressato, percezione di persona sicura di sé e non tormentata da dubbi o paure riguardo al futuro e alla propria capacità di raggiungere gli obiettivi senza troppa fatica, approccio leggero e spensierato alla vita e agli obiettivi percepiti come facili e non impegnativi davvero a fondo) (Negativo: sottovalutazione ingenua delle difficoltà reali e potenziale mancanza di impegno concreto e proattivo per raggiungere gli obiettivi davvero importanti, rischio di delusione e frustrazione quando la realtà si scontra con l'illusione di facilità e assenza di fatica, percezione di persona superficiale, poco realista e non pienamente consapevole della vera natura impegnativa e sfidante degli obiettivi ambiziosi e significativi davvero nel lungo periodo)."
      },
      {
        value: "Mi Impegno",
        text: "(Positivo: forte impegno e determinazione nel mettersi in gioco e affrontare la fatica necessaria per raggiungere gli obiettivi desiderati, approccio proattivo e orientato all'azione concreta e immediata, volontà di non tirarsi indietro di fronte alle sfide e agli ostacoli inevitabili del percorso verso il successo, fiducia realistica nelle proprie capacità e nella possibilità di farcela con l'impegno costante e determinato) (Negativo: potenziale sottovalutazione dell'effettivo sforzo reale necessario e rischio di frustrazione e scoraggiamento di fronte a difficoltà inaspettate o superiori alle previsioni, percezione di eccessiva sicurezza di sé iniziale che potrebbe non preparare adeguatamente ad affrontare ostacoli imprevisti e difficoltà reali e concrete lungo il percorso, approccio forse non sempre ottimizzato per la massima gestione dello stress e della frustrazione inevitabili di fronte alle sfide complesse e impegnative nel mondo reale)."
      },
      {
        value: "Faccio Fatica",
        text: "(Positivo: perseveranza e tenacia incrollabili nonostante le difficoltà percepite come reali e significative, forte determinazione nel non mollare mai e andare avanti ostinatamente anche quando è dura davvero, approccio combattivo e iper-resiliente che valorizza la lotta e la resistenza eroica di fronte alle avversità estreme, percezione di persona forte, tenace, instancabile e non facilmente scoraggiabile o abbattibile neanche di fronte a sfide considerate insormontabili da molti altri) (Negativo: stress eccessivo e prolungato nel tempo causato dalla percezione di fatica estrema e sforzo sovrumano costante e persistente necessario per raggiungere gli obiettivi desiderati, mancato godimento del percorso e della bellezza del viaggio in sé per eccessiva focalizzazione ossessiva sulla vetta e sull'arrivo finale ad ogni costo, rischio di burnout per iper-impegno prolungato e non sostenibile nel lungo periodo a ritmi massacranti, percezione di approccio iper-stressante e non sempre ottimizzato per il benessere psicofisico personale nel lungo termine)."
      },
      {
        value: "Un Muro Invalicabile",
        text: "(Negativo: scarsa autostima, tendenza a rinunciare di fronte agli ostacoli, senso di impotenza e scoraggiamento totale, percezione di obiettivi troppo grandi e fuori portata, mancanza di fiducia nelle proprie capacità e risorse interiori per superare le difficoltà percepite come insormontabili e paralizzanti) (Positivo: Molto Realismo e Autoprotezione)."
      }
    ],
    softSkill: "Resilienza, Autocritica",
    characteristics: "Motivazione, Rischio di Burnout, Perseveranza"
  },
  {
    num: 10,
    scenario: "Quale di queste immagini ti piace di più?",
    instructions: [
      "Immagine di una strada trafficata di città.",
      "Immagine di una montagna serena.",
      "Immagine di una spiaggia tranquilla al tramonto.",
      "Immagine di una foresta piena di vita."
    ],
    captions: [
      "Città Viva",
      "Montagna Maestosa",
      "Spiaggia Solitaria",
      "Foresta Misteriosa"
    ],
    options: [
      {
        value: "Città Viva",
        text: "(Positivo: energia e vitalità, apertura a stimolazione sensoriale, ricerca esperienze variegate, valorizzazione vita sociale attiva) (Negativo: difficoltà a gestire calma e tranquillità, dipendenza da stimoli esterni, rischio di sovraccarico sensoriale, approccio non sempre adatto a contesti che richiedono riflessività e introspezione)."
      },
      {
        value: "Montagna Maestosa",
        text: "(Positivo: apprezzamento per la grandiosità della natura, ricerca di ispirazione in paesaggi imponenti, valorizzazione forza interiore e resilienza) (Negativo: preferenza per solitudine e distanza sociale, rischio di isolamento emotivo, difficoltà in contesti urbani caotici, approccio non sempre adatto a contesti che richiedono estroversione)."
      },
      {
        value: "Spiaggia Solitaria",
        text: "(Positivo: ricerca di tranquillità e relax, apprezzamento solitudine rigenerante, valorizzazione silenzio e meditazione, ricerca rifugio nella natura per equilibrio interiore) (Negativo: tendenza all'isolamento sociale eccessivo, rischio di evitamento interazioni stressanti, approccio non sempre adatto a contesti che richiedono dinamismo relazionale)."
      },
      {
        value: "Foresta Misteriosa",
        text: "(Positivo: apertura al mistero e ignoto, apprezzamento natura selvaggia, attrazione per ambienti enigmatici e stimolanti, valorizzazione complessità e profondità) (Negativo: preferenza per ambiguità e complessità crea difficoltà in situazioni lineari, rischio di disagio in contesti prevedibili, approccio non sempre adatto a contesti che richiedono concretezza e pragmatismo)."
      }
    ],
    softSkill: "MenteAperta, Innovazione",
    characteristics: "Le tue preferenze raccontano qualcosa di te e delle esperienze che cerchi."
  }
];
