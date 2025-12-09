import { Question } from "../types";

export const questions116to120: Question[] = [
  {
    num: 116,
    scenario: "Il tuo partner ha paura che in futuro il vostro rapporto finisca, questo come ti fa sentire?",
    instructions: [
      "Immagine di un disco rotto che salta ripetendo sempre lo stesso punto,  ripetizione Standard di argomentazioni generiche.",
      "Immagine di una mano che accarezza frettolosamente un oggetto fragile,  rassicurazione superficiale e generica.",
      "Immagine di una pergamena antica sigillata con ceralacca,  prova di valore \"certificato\" e duraturo,  testimonianze e casi studio.",
      "Immagine di un architetto che mostra i solidi pilastri di un edificio destinato a durare nel tempo,  accordo personalizzato e impegno a lungo termine sulla \"solidità\"."
    ],
    captions: [
      "Disco Rotto",
      "Carezza Veloce",
      "Pergamena Sigillata",
      "Pilastri Portanti"
    ],
    options: [
      {
        value: "Disco Rotto",
        text: "(Negativo: inefficacia rassicurazione e mancanza concretezza, percezione inaffidabilità e approccio standardizzato e superficiale) (Positivo: efficienza immediata e minimo sforzo, semplicità e velocità, approccio sbrigativo e senza fronzoli)."
      },
      {
        value: "Carezza Veloce",
        text: "(Negativo: rassicurazioni vaghe e mancanza impegno tangibile, percezione superficialità e non affronta a fondo la paura del cliente, rischio di non convincere) (Positivo: informalità e rassicurazione di base, velocità interazione e costo minimo, tentativo di creare clima positivo, approccio leggero e rassicurante senza eccessivo formalismo)."
      },
      {
        value: "Pergamena Sigillata",
        text: "(Positivo: concretezza delle prove e dimostrazione affidabilità con fatti, costruzione credibilità tramite terzi, rassicurazione più convincente delle sole parole, approccio oggettivo e basato su dati) (Negativo: potenziale impersonalità percepita e non sempre tailored, richiede tempo presentazione prove, percezione di formalismo e burocrazia, approccio forse non sempre caldo e empatico)."
      },
      {
        value: "Pilastri Portanti",
        text: "(Positivo: massimo impegno e garanzie forti e personalizzate, costruzione fiducia solida e duratura, offerta tailored e attenzione massima al cliente, percezione di massima serietà, affidabilità e solidità dell'offerta) (Negativo: alto investimento risorse e problema di scalabilità potenziale, rischio percepito di promesse eccessive, complessità gestionale, approccio forse non sempre sostenibile per tutti i clienti e poco agile in termini di velocità e semplificazione del processo di vendita)."
      }
    ],
    softSkill: "GestioneDelleObiezioni, FidelizzazioneDelCliente",
    characteristics: "Gestione delle Obiezioni, Costruzione della Fiducia del Cliente, Costanza, Abilità di Vendita"
  },
  {
    num: 117,
    scenario: "Un cliente si lancia in un saluto affettuoso.  Cosa fai?",
    instructions: [
      "Immagine di una mano a indicare alt fermo,  rifiuto netto di ogni approccio \"personale\",  confine etico invalicabile.",
      "Immagine di una mano che resta tesa alla stretta di mano,  esitazione di fronte all'approccio \"personale\",  confine etico vacillante.",
      "Immagine di due persone che si abbracciano,  approccio \"personale\" vigoroso da una parte,  confine etico sfumato.",
      "Immagine di persone che si scambiano un abbraccio affettuoso,  accettazione esplicita dell'approccio \"personale\" per la vendita,  confine etico superato."
    ],
    captions: [
      "Mano in Avanti",
      "Mano Tesa",
      "Subisci il saluto",
      "Ricambi con affetto"
    ],
    options: [
      {
        value: "Mano in Avanti",
        text: "(Positivo: massima integrità etica e chiarezza dei confini professionali, nessuna ambiguità o fraintendimento, approccio inequivocabilmente corretto e trasparente, persona percepita come integra e affidabile sul piano etico e professionale) (Negativo: potenziale perdita dell'affare e mancata conversione del cliente, percezione di eccessiva rigidità etica e mancanza di flessibilità commerciale, approccio forse non sempre ottimizzato per la performance commerciale pura)."
      },
      {
        value: "Mano Tesa",
        text: "(Positivo: tentativo di mantenere aperta la porta alla vendita e di non chiudere completamente la relazione con il cliente e approccio cauto e non rigido, flessibilità moderata e non eccessiva) (Negativo: ambiguità del messaggio e rischio di fraintendimenti, confine etico non chiaro, percezione di approccio attendista e non pienamente trasparente o diretto)."
      },
      {
        value: "Subisci il saluto",
        text: "(Negativo: alto rischio etico e confine labile e pericoloso, potenziale fraintendimento grave e danno reputazionale e all'etica professionale, percezione di approccio manipolatorio, scorretto e potenzialmente molesto) (Positivo: tentativo di creare una connessione personale con il cliente senza scoprirsi troppo e approccio astuto e abile nel gestire la relazione in modo ambiguo e velato, potenziale vantaggio competitivo in termini di manipolazione sottile della relazione, *ma positivo da valutare eticamente*)."
      },
      {
        value: "Ricambi con affetto",
        text: "(Negativo: violazione etica e superamento del confine professionale, approccio non etico e danno reputazionale, percezione di persona priva di scrupoli etici e pronta a tutto per il denaro) (Positivo: massimizzazione delle probabilità di closing immediato e raggiungimento dell'obiettivo economico a breve termine senza se e senza ma, approccio iper-focalizzato sul risultato immediato e massima determinazione nel chiudere l'affare a qualunque costo, *ma positivo solo in ottica di performance economica spregiudicata e non etica*)."
      }
    ],
    softSkill: "GestioneDelleObiezioni, RelazioniImproprie",
    characteristics: "Etica Professionale, Gestione delle Obiezioni, Integrità"
  },
  {
    num: 118,
    scenario: "Il tuo capo ti risponde per l'ennesima volta \"Non si può fare!\", come te lo immagini in quel momento.",
    instructions: [
      "Immagine di un seme rinsecchito che non germoglia,  scoraggiamento totale di fronte al primo ostacolo.",
      "Immagine di una balla di fieno nel deserto,  iniziale difficoltà ma tentativo di crescita nonostante le obiezioni.",
      "Immagine di una pianta che cresce rigogliosa anche in un terreno difficile,  crescita guidata e supportata per superare le obiezioni.",
      "Immagine di un albero maestoso che svetta solitario e forte in cima a una montagna impervia,  crescita autonoma e resiliente che supera ogni obiezione da solo."
    ],
    captions: [
      "Seme Rinsecchito",
      "Balla di Fieno",
      "Terreno Arido",
      "Albero Solitario"
    ],
    options: [
      {
        value: "Seme Rinsecchito",
        text: "(Negativo: bassa resilienza e scoraggiamento facile, evitamento ostacoli e mancanza di perseveranza, opportunità di crescita mancate, percezione di fragilità e scarsa tenacia) (Positivo: evitamento frustrazione e approccio pragmatico di resa di fronte a ostacoli insormontabili, non accanimento inutile e gestione dello stress da fallimento potenziale, accettazione dei limiti apparenti)."
      },
      {
        value: "Balla di Fieno",
        text: "(Positivo: resilienza iniziale e volontà di riprovare nonostante le difficoltà, capacità di reagire allo scoraggiamento iniziale, approccio tenace anche se non immediatamente vincente, persona percepita come non molla subito e prova a rialzarsi) (Negativo: crescita lenta e faticosa e potenziale arresto di fronte a ostacoli maggiori, percezione di resilienza moderata e non sempre sufficiente, approccio forse non sempre ottimizzato per superare obiezioni persistenti e complesse)."
      },
      {
        value: "Terreno Arido",
        text: "(Positivo: consapevolezza dei propri limiti e ricerca di aiuto esterno per superarli, valorizzazione del supporto e della guida altrui, approccio collaborativo alla crescita personale, persona percepita come intelligente che sa chiedere aiuto e valorizzare le competenze altrui per il proprio sviluppo) (Negativo: potenziale dipendenza da supporto esterno e rischio di non sviluppare piena autonomia nel superamento ostacoli, percezione di non completa autosufficienza nella crescita personale e nel superamento autonomo delle obiezioni, approccio forse non sempre ottimizzato per l'indipendenza e l'auto-apprendimento autonomo)."
      },
      {
        value: "Albero Solitario",
        text: "(Positivo: massima resilienza e autonomia nel superamento delle difficoltà, forte fiducia nelle proprie risorse personali, approccio self-made e indipendente, persona percepita come forte, autonoma e indipendente e con grande forza interiore) (Negativo: potenziale eccessivo individualismo e rischio di non valorizzare il supporto altrui, percezione di eccessiva sicurezza di sé e autosufficienza, mancanza di apertura alla collaborazione e al mentoring come risorse preziose per la crescita, approccio forse non sempre ottimizzato per la crescita collaborativa e il teamwork come moltiplicatori del potenziale di sviluppo personale e professionale)."
      }
    ],
    softSkill: "SviluppoPersonale, GestioneDelleObiezioni",
    characteristics: "Resilienza, Approccio alla Crescita Personale, Gestione delle Avversità"
  },
  {
    num: 119,
    scenario: "Vai a vivere in campagna, lasci tutto a cosa ti dedichi?",
    instructions: [
      "Immagine di un campo di fiori di lavanda che sboccia,  priorità assoluta alla crescita personale,  focus sul proprio \"fiorire\".",
      "Immagine di un campo di alberi giovani che iniziano a dare i primi frutti,  crescita personale bilanciata con l'inizio del \"dare frutti\" per gli altri.",
      "Immagine di una coltivazione di ortaggi,  crescita personale orientata soprattutto a \"dare frutti\" per gli altri (clienti).",
      "Immagine di un campo arato e pronto per la semina,  rinuncia alla \"fioritura\" personale immediata,  priorità assoluta alla preparazione per \"dare frutti\" futuri per gli altri."
    ],
    captions: [
      "Coltivo Fiori",
      "Coltivo Alberi da Frutta",
      "Coltivo Ortaggi",
      "Coltivo Cereali"
    ],
    options: [
      {
        value: "Coltivo Fiori",
        text: "(Positivo: massima attenzione allo sviluppo personale e ricerca della bellezza e dell'espressione individuale, valorizzazione del talento personale unico e originale, approccio artistico e individualista, persona percepita come creativa e originale) (Negativo: potenziale ego-centrismo e mancanza di orientamento al servizio o al bene comune, rischio di isolamento e percezione di eccessivo individualismo o narcisismo, sviluppo personale fine a sé stesso)."
      },
      {
        value: "Coltivo Alberi da Frutta",
        text: "(Positivo: equilibrio armonioso tra crescita personale e contributo per gli altri, integrazione tra realizzazione individuale e responsabilità sociale, approccio umanistico e olistico, persona percepita come equilibrata e responsabile) (Negativo: potenziale limitazione della crescita personale massima e rischio di non raggiungere il picco della auto-realizzazione individuale, percezione di ambizione personale moderata, approccio forse non sempre ottimizzato per la massima performance individuale pura e ego-centrica)."
      },
      {
        value: "Coltivo Ortaggi",
        text: "(Positivo: forte orientamento al servizio e al beneficio altrui, sviluppo personale finalizzato a generare valore per la comunità, approccio altruista e dedicato agli altri, persona percepita come generosa e profondamente orientata al servizio e al bene comune) (Negativo: potenziale rischio di burnout per eccessivo dono di sé e sacrificio eccessivo dei bisogni personali, percezione di squilibrio tra dare e ricevere, approccio forse non sempre sostenibile nel lungo periodo in termini di benessere personale e auto-cura)."
      },
      {
        value: "Coltivo Cereali",
        text: "(Positivo: massima visione a lungo termine e pianificazione strategica orientata al futuro, sacrificio del presente per un beneficio futuro maggiore per la comunità, approccio previdente e progettuale, persona percepita come visionaria e strategica) (Negativo: potenziale sacrificio eccessivo del presente e rischio di rimandare sempre la gratificazione personale, percezione di eccessiva serietà e orientamento al dovere e sacrificio, approccio forse non sempre equilibrato tra oggi e domani e tra realizzazione personale immediata e beneficio collettivo futuro)."
      }
    ],
    softSkill: "SviluppoPersonale, OrientamentoAlCliente",
    characteristics: "Bilanciamento Sviluppo Personale/Sociale, Altruismo, Proiezione Futuro"
  },
  {
    num: 120,
    scenario: "Un collega fa battute inappropriate a una collega. Cosa fai?",
    instructions: [
      "Immagine di tre scimmie sagge: \"non vedo, non sento, non parlo\",  ignora completamente la situazione,  non si intromette.",
      "Immagine di una persona che tossisce discretamente per segnalare il problema,  intervento indiretto e \"velato\".",
      "Immagine di una persona che offre un bicchiere d'acqua alla collega \"vittima\" con sguardo di supporto,  aiuto \"discreto\" e supporto silenzioso alla vittima.",
      "Immagine di un cavaliere che si erge in armatura e spada sguainata,  intervento diretto e deciso contro il comportamento inappropriato."
    ],
    captions: [
      "Non Vedo, Non Sento, Non Parlo",
      "Tosse Imbarazzata",
      "Bicchiere d'Acqua",
      "Cavaliere Bianco"
    ],
    options: [
      {
        value: "Non Vedo, Non Sento, Non Parlo",
        text: "(Negativo: omissione di soccorso e mancanza di supporto alla vittima, perpetuazione di un clima di tolleranza verso molestie, percezione di persona indifferente, egoista e non affidabile) (Positivo: evitamento conflitto diretto e massimizzazione sicurezza personale, non coinvolgimento in rogne, approccio prudente e non rischioso per sé stesso, mantenimento neutralità formale)."
      },
      {
        value: "Tosse Imbarazzata",
        text: "(Negativo: inefficacia nel fermare il comportamento inappropriato e segnalazione debole e ambigua, mancanza di supporto chiaro alla vittima, percezione di persona timida, indecisa e non pienamente coraggiosa) (Positivo: approccio non confrontazionale e diplomatico, tentativo di sensibilizzazione soft, minimo segnale di disapprovazione senza scontro aperto, volontà di non ignorare completamente il problema)."
      },
      {
        value: "Bicchiere d'Acqua",
        text: "(Positivo: supporto concreto e immediato alla vittima e solidarietà femminile ed empatia, approccio umano e compassionevole, persona percepita come sensibile, attenta e solidale) (Negativo: azione non risolutiva del problema alla radice e mancanza di intervento diretto sul molestatore, rischio di non fermare il comportamento inappropriato, percezione di approccio limitato all'aiuto individuale e non sempre sufficiente a livello collettivo e sistemico)."
      },
      {
        value: "Cavaliere Bianco",
        text: "(Positivo: intervento diretto e coraggioso contro le molestie e difesa attiva della vittima, affermazione di valori etici e di rispetto e leadership morale e azione risolutiva e protettiva verso la vittima, persona percepita come coraggiosa, integra, assertiva e paladina della giustizia) (Negativo: potenziale escalation del conflitto e rischio di creare tensione nel team, percezione di approccio eccessivamente aggressivo o giustizialista e mancanza di diplomazia e mediazione, approccio forse non sempre ottimale in contesti che richiederebbero maggiore negoziazione e mediazione)."
      }
    ],
    softSkill: "RelazioniImproprie, TematicheSociali",
    characteristics: "Affrontare Molestie, Condotta Etica, Assertività"
  }
];
