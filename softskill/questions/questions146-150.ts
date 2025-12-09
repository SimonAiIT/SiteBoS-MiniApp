import { Question } from "../types";

export const questions146to150: Question[] = [
  {
    num: 146,
    scenario: "Dopo una lunga attesa allo sportello, ti accorgi che hai sbagliato fila. Che fai?",
    instructions: [
      "Immagine di una persona che sussurra al commesso e gli porge di nascosto una banconota,  tentativo di \"ungere le ruote\" per ottenere un trattamento speciale.",
      "Immagine di una persona che alza la mano timidamente per chiedere informazioni a chi è nella fila giusta,  richiesta di chiarimenti \"formale\" e  \"rispettosa della fila\".",
      "Immagine di una persona che si sposta mestamente in fondo a una fila lunghissima,  accettazione paziente del proprio errore e della \"punizione\" della lunga attesa.",
      "Immagine di una persona che volta le spalle allo sportello e si allontana con rabbia,  rinuncia impulsiva e  \"vendicativa\" al servizio per frustrazione."
    ],
    captions: [
      "Chiedo un'eccezione al commesso",
      "Chiedo se sono il prossimo nella fila giusta",
      "Cambio fila, pazienza",
      "Vado via, ritorno domani"
    ],
    options: [
      {
        value: "Chiedo un'eccezione al commesso",
        text: "(Negativo: approccio non etico e corruttivo, violazione del principio di equità e fair play, percezione di persona opportunista, arrivista e poco rispettosa delle regole e della parità di trattamento per tutti, rischio di danno reputazionale se scoperto) (Positivo: massimizzazione efficienza e velocità, approccio pragmatico e risolutivo, ottenimento del servizio senza attese, furbizia percepita come abilità nel farsi strada e ottenere vantaggi individuali in contesti competitivi o burocratici, ma positivo solo in ottica strettamente individualista e non etica)."
      },
      {
        value: "Chiedo se sono il prossimo nella fila giusta",
        text: "(Positivo: approccio corretto e rispettoso delle regole e dell'ordine della fila, tentativo di risolvere il problema in modo legittimo e trasparente, ricerca di una soluzione equa e non privilegiata, percezione di persona educata, rispettosa, corretta e orientata alla giustizia e all'equità formale) (Negativo: potenziale perdita di tempo in chiacchiere inutili, rischio di non risolvere il problema velocemente e direttamente, percezione di approccio ingenuo o eccessivamente fiducioso nella bontà del sistema e nella disponibilità altrui, approccio forse non sempre ottimizzato per la massima efficienza e velocità nella risoluzione del problema pratico immediato)."
      },
      {
        value: "Cambio fila, pazienza",
        text: "(Positivo: massimo rispetto per le regole e per gli altri, approccio responsabile che si assume le conseguenze dei propri errori senza scaricarle sugli altri, senso civico e fair play ineccepibili, percezione di persona corretta, responsabile, paziente e rispettosa delle regole e del tempo altrui) (Negativo: auto-penalizzazione eccessiva, perdita di tempo non necessaria, mancanza di iniziativa nel cercare soluzioni alternative legittime, percezione di passività o eccessiva autocolpevolizzazione, approccio forse non sempre ottimizzato per la massima efficienza e ottimizzazione del tempo e delle risorse personali, eccessiva enfasi sul senso del dovere e colpa personale a scapito della pragmaticità e della ricerca di soluzioni alternative legittime e creative)."
      },
      {
        value: "Vado via, ritorno domani",
        text: "(Negativo: reazione impulsiva e non costruttiva, bassa tolleranza alla frustrazione e all'attesa, rinuncia al servizio desiderato per rabbia e orgoglio, approccio capriccioso e poco maturo e paziente, percezione di persona impulsiva, poco paziente, capricciosa e non sempre affidabile nel gestire la frustrazione e i contrattempi in modo adulto e costruttivo) (Positivo: affermazione estrema della libertà di scelta individuale, reazione assertiva e non passiva, non sottomissione alla frustrazione, approccio non remissivo e non attendista, reazione forte anche se negativa e autolesionista, percezione di forte carattere e individualità spiccata)."
      }
    ],
    softSkill: "Integrità, TematicheSociali",
    characteristics: "Senso Civico, Equità, Rispetto delle Regole, Pazienza"
  },
  {
    num: 147,
    scenario: "Stai giocando a 'Indovina Chi?'. Hai un biglietto sulla fronte con un personaggio. Qual è la tua prima domanda: 'È un...?'",
    instructions: [
      "Immagine di un pittore rinascimentale che dipinge una rockband.",
      "Immagine di una lente di ingrandimento puntata sul simbolo di \"genere\" maschio e femmina.",
      "Immagine di una lente di ingrandimento puntata sulla \"testa\" di un personaggio calvo,  focalizzazione su una caratteristica \"fisica\".",
      "Immagine di una lapide di cimitero."
    ],
    captions: [
      "Artista",
      "Uomo",
      "Calvo",
      "Vivente"
    ],
    options: [
      {
        value: "Artista",
        text: "(Positivo: originalità e creatività, approccio laterale e non convenzionale, tenta di spiazzare l'avversario con una domanda inattesa, percezione di persona brillante, originale e non ordinaria nel pensiero, approccio innovativo e stimolante che rompe gli schemi prevedibili) (Negativo: domanda vaga e ampia poco efficace per restringere il campo subito, rischio di disorientare più che informare, percezione di eccentricità o eccessiva originalità fine a sé stessa, approccio forse non sempre ottimizzato per la massima efficacia pratica e velocità nel vincere concretamente la partita qui e ora)."
      },
      {
        value: "Uomo",
        text: "(Positivo: massima efficienza statistica, approccio razionale e quantitativo, massimizzazione delle probabilità di restringere il campo velocemente e in modo significativo con una sola domanda, approccio diretto e pragmatico orientato all'ottimizzazione matematica delle probabilità di vittoria rapida) (Negativo: approccio troppo ovvio o banale, mancanza di finezza strategica o intuito psicologico, percezione di eccessiva enfasi sulla statistica bruta a scapito di strategie più sofisticate e creative, approccio forse non sempre ottimizzato per la massima eleganza e sofisticazione del pensiero critico e strategico puro)."
      },
      {
        value: "Calvo",
        text: "(Positivo: efficacia pratica nello scremare un buon numero di personaggi visivamente in modo rapido, approccio diretto e concreto che punta all'efficacia immediata e tangibile, focalizzazione su caratteristiche fisiche evidenti che facilitano l'identificazione visiva e rapida dei problemi da escludere, percezione di persona pragmatica, concreta e orientata all'efficacia immediata e visiva del problem-solving) (Negativo: efficacia limitata nel restringere il campo in modo davvero significativo, domanda forse non pienamente ottimizzata in termini di massima strategicità e portata complessiva, approccio pragmatico ma forse non sempre sufficientemente lungimirante o strategico in senso ampio, percezione di limitata visione d'insieme strategica del gioco e del problem-solving complessivo)."
      },
      {
        value: "Vivente",
        text: "(Positivo: approccio logico-deduttivo e razionale, esclusione di una categorie ampia e non rilevanti, focalizzazione del campo di ricerca su una categoria più ristretta e pertinente, approccio metodico e step-by-step che delimita il campo gradualmente, percezione di persona razionale, logica, metodica e orientata alla precisione e alla circoscrizione graduale del problema) (Negativo: efficacia limitata nel restringere il campo in modo davvero incisivo e rapido, domanda logica ma non ottimizzata per la massima velocità e immediatezza nel closing, approccio razionale ma forse non sempre sufficientemente brillante o strategicamente efficace per vincere velocemente e con poche mosse)."
      }
    ],
    softSkill: "ProblemSolving, PensieroCritico",
    characteristics: "Pensiero Strategico, Efficacia, Creatività, Originalità"
  },
  {
    num: 148,
    scenario: "Stai appendendo qualcosa e sfortunatamente fori un tubo d'acqua. Di corsa chiudi il rubinetto generale e poi?",
    instructions: [
      "Immagine di una persona che telefona frettolosamente ad un contatto in rubrica,  richiesta di aiuto \"informale\" a una \"persona di fiducia\" non esperta.",
      "Immagine di qualcuno che armeggia con nastro adesivo e mastice per bloccare la falla alla \"bell'e meglio\",  improvvisazione \"casalinga\" e soluzione \"temporanea\" \"di fortuna\".",
      "Immagine di un idraulico professionista al telefono,  ricerca di aiuto \"esperto\" e \"qualificato\".",
      "Immagine di una persona china su un manuale di \"idraulica fai da te\" con strumenti in mano,  studio \"autonomo\" e  tentativo di riparazione \"fai da te\" basato sull' \"apprendimento\" \"immediato\"."
    ],
    captions: [
      "Chiamo Subito Mio Cugino",
      "Tappo Alla Meglio",
      "Chiamo un Idraulico",
      "Studio la Riparazione"
    ],
    options: [
      {
        value: "Chiamo Subito Mio Cugino",
        text: "(Negativo: approccio non professionale e poco efficace per problemi tecnici complessi, rischio di soluzioni improvvisate e non definitive, mancanza di valorizzazione della competenza specialistica e certificata, percezione di ingenuità o eccessiva fiducia nell'aiuto informale non qualificato, approccio forse non sempre ottimizzato per la massima efficacia e risoluzione definitiva di problemi tecnici complessi) (Positivo: massima velocità di attivazione di un aiuto, approccio informale e caloroso, valorizzazione legami personali e aiuto amichevole, massimizzazione della rapidità e semplicità della risposta immediata, approccio rassicurante e confortevole sul piano personale e emotivo)."
      },
      {
        value: "Tappo Alla Meglio",
        text: "(Negativo: rischio di soluzione temporanea e non definitiva, approccio improvvisato e potenzialmente inefficace o rischioso per problemi tecnici complessi, mancanza di metodo e pianificazione professionale, percezione di approccio superficiale, approssimativo e non pienamente affidabile o sicuro nel lungo periodo per problemi tecnici seri) (Positivo: massima autonomia e iniziativa personale nel problem-solving immediato, approccio creativo e hands-on, valorizzazione dell'ingegno e della capacità di arrangiarsi in emergenza con mezzi limitati, massimizzazione della velocità di reazione e azione immediata di fronte al problema urgente, approccio pragmatico e orientato all'azione tempestiva qui e ora)."
      },
      {
        value: "Chiamo un Idraulico",
        text: "(Positivo: massima efficacia e professionalità nella risoluzione del problema tecnico, approccio razionale e data-driven che valorizza la competenza certificata e l'expertise specifica, massimizzazione della probabilità di risolvere il problema in modo definitivo e sicuro, percezione di persona responsabile, pragmatica, orientata alla soluzione efficace e non incline all'improvvisazione rischiosa in contesti tecnici complessi) (Negativo: non si cura del costo economico, attesa per l'arrivo dei soccorsi professionali, potenziale dipendenza da aiuto esterno, mancanza di autonomia e iniziativa personale nel problem-solving immediato, approccio forse non sempre ottimizzato per la massima velocità e tempestività della risposta urgente di fronte a problemi che richiederebbero azione immediata qui e ora e non attesa di aiuto esterno non immediato)."
      },
      {
        value: "Studio la Riparazione",
        text: "(Positivo: massima autonomia e iniziativa personale nel problem-solving, approccio proattivo e autodidatta orientato all'apprendimento sul campo, sviluppo di nuove competenze pratiche e utili per il futuro, percezione di persona intraprendente, autonoma, curiosa e orientata all'auto-miglioramento e all'apprendimento continuo) (Negativo: rischio di problem-solving inefficace o non sicuro, potenziale aggravamento del problema per imperizia, richiede tempo e impegno non sempre giustificato in relazione all'efficacia e alla sicurezza del risultato fai da te, percezione di approccio azzardato, imprudente e non sempre realistico nel valutare i propri limiti e i rischi del fai da te improvvisato in contesti tecnici complessi)."
      }
    ],
    softSkill: "ProblemSolving, PensieroCritico",
    characteristics: "Problem Solving, Autonomia, Intraprendenza, Propensione al Fai-da-te"
  },
  {
    num: 149,
    scenario: "Devi creare la tua squadra di tiro alla fune, chi perde va nel fango. Hai vinto il sorteggio e cominci tu, che fai?",
    instructions: [
      "Immagine di un gruppo di amici più cari,  priorità ai legami affettivi e alla \"simpatia\" personale nella scelta del team.",
      "Immagine di un gruppo di persone dall'aspetto \"divertente\" o \"simpatico\".",
      "Immagine di un gruppo di persone dall aspetto furbo.",
      "Immagine di un gruppo di persone muscolose e \"forti\" fisicamente,  priorità assoluta alla \"forza bruta\" e al potenziale di \"vittoria\" \"fisica\" nella selezione del team."
    ],
    captions: [
      "Prendo i Miei Amici",
      "Scelgo Per Divertirmi",
      "Ho il Mio Piano",
      "Scelgo i Forti"
    ],
    options: [
      {
        value: "Prendo i Miei Amici",
        text: "(Positivo: massimizzazione armonia del gruppo e del piacere di stare insieme tra amici, valorizzazione legami affettivi e della coesione pre-esistente, approccio sociale e relazionale che punta al benessere emotivo del gruppo di amici, percezione di persona leale, affettuosa e orientata all'armonia e al piacere di stare insieme prima di tutto) (Negativo: rischio di squadra non competitiva e non ottimizzata per la vittoria, mancanza di strategia competitiva basata su criteri di performance oggettiva e misurabile, approccio non razionale o poco pragmatico in ottica di massimizzazione delle probabilità di vittoria competitiva pura, percezione di scelta ingenua o eccessivamente emotiva e poco razionale e strategica in contesti competitivi che richiederebbero maggiore focalizzazione sul risultato oggettivo vittoria)."
      },
      {
        value: "Scelgo Per Divertirmi",
        text: "(Positivo: massimizzazione del divertimento e del piacere di giocare insieme prima di tutto, approccio leggero e spensierato che de-drammatizza l'aspetto competitivo e agonistico del gioco, valorizzazione dell'esperienza ludica e sociale in sé al di là del risultato, percezione di persona giocosa, leggera, autoironica e non ossessionata dalla performance a tutti i costi) (Negativo: rischio di squadra non competitiva e non ottimizzata per la vittoria, mancanza di strategia competitiva basata su criteri di performance oggettiva e misurabile, approccio poco serio o superficiale in contesti che richiederebbero maggiore focalizzazione sul risultato vittoria, percezione di persona leggera, giocosa e non sempre affidabile in contesti competitivi che richiederebbero maggiore determinazione e orientamento al risultato oggettivo vittoria)."
      },
      {
        value: "Ho il Mio Piano",
        text: "(Negativo: massima imprevedibilità e incertezza del risultato, approccio irrazionale e non metodologico, mancanza di controllo sulla composizione del team, percezione di scelta casuale, non ponderata e non responsabile, approccio non ottimizzato per la massima probabilità di vittoria in contesti competitivi che richiederebbero maggiore pianificazione strategica e selezione razionale basata su criteri oggettivi e misurabili) (Positivo: massima imprevedibilità e originalità della scelta, approccio non convenzionale e fuori dagli schemi, elemento sorpresa e casualità che può rendere il gioco più stimolante e divertente, percezione di persona originale, creativa e non convenzionale che osa scelte inaspettate e non ortodosse, approccio ludico e giocoso che de-drammatizza l'aspetto competitivo e agonistico e valorizza l'imprevedibilità e la sorpresa inattesa del fato e del caso)."
      },
      {
        value: "Scelgo i Forti",
        text: "(Positivo: massimizzazione delle probabilità di vittoria competitiva pura e oggettiva, approccio iper-competitivo e orientato al risultato massimo (la vittoria a tutti i costi), selezione basata su criteri oggettivi e misurabili di performance fisica pura, percezione di persona determinata, competitiva, focalizzata sulla performance e non disposta a compromessi pur di vincere, approccio spartano e orientato all'eccellenza competitiva pura e senza fronzoli) (Negativo: potenziale squilibrio del team sul piano umano e relazionale, rischio di creare un clima eccessivamente competitivo e poco collaborativo, percezione di approccio troppo selettivo, spietato, competitivo e poco incline al compromesso e alla mediazione per creare un team veramente vincente nel complesso, approccio forse non sempre ottimizzato per la massima performance del team nel suo complesso che richiede anche coesione, collaborazione e dinamiche relazionali positive e sinergiche e non solo forza bruta individuale)."
      }
    ],
    softSkill: "DecisionMakingStrategico, Integrità",
    characteristics: "Decision Making, Strategia, Integrità, Leadership"
  },
  {
    num: 150,
    scenario: "Hai l'opportunità di parlare con un personaggio della storia: chi scegli?",
    instructions: [
      "Immagine di Albert Einstein,  icona della genialità visionaria e della soluzione di problemi tecnologici complessi attraverso l'innovazione radicale.",
      "Immagine di Cristoforo Colombo che scruta l'orizzonte marino con una bussola in mano,  simbolo di esplorazione strategica e  problem-solving orientato alla scoperta e all'ignoto.",
      "Immagine di Gandhi in meditazione pacifica,  icona della leadership etica e della risoluzione non violenta dei problemi sociali complessi.",
      "Immagine di Alessandro Magno che guida l'esercito in battaglia con una spada sguainata,  simbolo di leadership decisionale \"tranchant\" e  problem-solving militare strategico su vasta scala."
    ],
    captions: [
      "Einstein",
      "Colombo",
      "Gandhi",
      "Alessandro"
    ],
    options: [
      {
        value: "Einstein",
        text: "(Positivo: valorizzazione innovazione, focus su soluzioni tecnologiche avanzate, approccio visionario e futurista, creatività scientifica e tecnologica spinta all'estremo, percezione di persona brillante, geniale e orientata al futuro e alla frontiera della conoscenza scientifica e tecnologica) (Negativo: potenziale iper-tecnicismo, rischio di sottovalutare dimensioni umane o sociali del problem-solving, percezione di approccio freddo o eccessivamente razionale e tecnocratico, mancanza di attenzione alle implicazioni etiche o sociali delle soluzioni tecnologiche pure e non contaminate da considerazioni umane o sociali esterne alla logica tecnica pura e semplice)."
      },
      {
        value: "Colombo",
        text: "(Positivo: valorizzazione esplorazione, propensione al rischio calcolato, approccio pionieristico e orientato alla scoperta, capacità di affrontare l'ignoto con intuito e determinazione, percezione di persona coraggiosa, intraprendente, esplorativa e non paralizzata dall'incertezza o dalla paura dell'ignoto) (Negativo: potenziale temerarietà, rischio di sottovalutare i pericoli reali dell'ignoto, percezione di approccio azzardato o eccessivamente fiducioso nella fortuna, mancanza di enfasi sulla pianificazione meticolosa e razionale, approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore prudenza, pianificazione e gestione del rischio razionale e calcolata prima di agire impulsivamente gettandosi nell'ignoto)."
      },
      {
        value: "Gandhi",
        text: "(Positivo: valorizzazione leadership etica, approccio pacifico e non violento alla risoluzione dei conflitti, massima attenzione al bene comune e all'inclusione, approccio umanistico e socialmente responsabile, percezione di persona empatica, altruista, pacifista e profondamente orientata ai valori morali e sociali superiori) (Negativo: potenziale utopismo, rischio di inefficacia pratica in contesti che richiederebbero maggiore azione diretta e risolutiva immediata, percezione di approccio troppo idealistico e meno pragmatico o realistico in contesti competitivi o di emergenza, eccessiva enfasi sull'etica ideale a scapito dell'efficacia pratica immediata nella risoluzione di problemi urgenti o complessi)."
      },
      {
        value: "Alessandro",
        text: "(Positivo: massima leadership decisionale tranchant e orientamento all'azione rapida e risolutiva, approccio direttivo e comando e controllo efficace in contesti militari o competitivi che richiedono decisioni rapide e risolutive senza esitazioni, percezione di persona forte, carismatica, decisionista, risoluta e orientata all'azione rapida ed efficace anche in contesti ostili e competitivi estremi) (Negativo: potenziale autoritarismo, rischio di decisioni top-down e poco condivise, mancanza di valorizzazione della collaborazione orizzontale e del teamwork paritario, percezione di leadership eccessivamente direttiva e poco incline alla delega e al coinvolgimento partecipativo del team, approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore collaborazione, condivisione decisionale e coinvolgimento attivo del team nel problem-solving collettivo)."
      }
    ],
    softSkill: "DecisionMakingStrategico, PensieroCritico",
    characteristics: "Stili Decisionali, Leadership, Approccio al Problem Solving, Visione Strategica"
  }
];
