
import { Question } from "../types";

export const questions: Question[] = [
  {
    num: 1,
    scenario: "Cosa pensi sia meglio tra attendere per un grosso risultato o una gratifica immediata?",
    instructions: [
      "Immagine di un seme che viene piantato.",
      "Immagine di una bilancia in equilibrio",
      "Immagine di una persona che si gode il sole",
      "Immagine di una mano che afferra con forza un mazzetta di denaro."
    ],
    captions: [
      "Investimento",
      "Compromesso",
      "Presente",
      "Ricompensa Immediata"
    ],
    options: [
      {
        value: "Investimento",
        text: "(Positivo: massima pianificazione strategica e visione a lungo termine, forte orientamento al futuro e ai risultati differiti, perseveranza e costanza nel perseguire obiettivi ambiziosi, approccio paziente e disciplinato che valorizza i benefici a lungo termine, persona affidabile e orientata alla costruzione di valore duraturo) (Negativo: lenta gratificazione e rinuncia al godimento del presente, approccio rigido e poco flessibile di fronte a opportunità immediate, potenziale frustrazione e demotivazione nel breve termine per mancanza di feedback immediato, rischiodi non cogliere occasioni irripetibili nel \"qui e ora\")."
      },
      {
        value: "Compromesso",
        text: "(Positivo: equilibrio ideale tra visione futura e godimento del presente, approccio flessibile e adattabile a diverse situazioni e priorità, capacità di cogliere opportunità immediate senza sacrificare obiettivi a lungo termine, persona versatile, pragmatica e capace di mediare tra diverse esigenze e scelte) (Negativo: rischio di non massimizzare pienamente né i risultati a lungo termine, né la gratificazione immediata, approccio moderato che potrebbe non eccellere in nessuna direzione estrema, percezione di tiepidezza o mancanza di radicalità nelle scelte, rischio di perdersi il meglio di entrambi i mondi senza primeggiare in nessuno)."
      },
      {
        value: "Presente",
        text: "(Positivo: massima capacità di godersi appieno il presente e cogliere ogni opportunità immediata, approccio carpe diem e orientato al piacere hic et nunc, valorizzazione delle emozioni e delle esperienze immediate e tangibili, persona spontanea, entusiasta, focata sul vivere a pieno ogni singolo istante) (Negativo: forte imprevidenza e scarsa pianificazione a lungo termine, approccio miope che rischia di trascurare le conseguenze future delle scelte impulsive, potenziale mancanza di responsabilità e visione strategica nella gestione del tempo e delle risorse, percezione di eccessiva leggerezza o mancanza di serietà e affidabilità in contesti che richiederebbero maggiore visione futura e pianificazione responsabile)."
      },
      {
        value: "Ricompensa Immediata",
        text: "(Positivo: massima gratificazione immediata e piacere tangibile subito, approccio istintivo e orientato all'azione rapida e concreta, valorizzazione delle soddisfazioni immediate e palpabili, persona dinamica, reattiva, focalizzata sul risultato immediato e concreto e poco incline a rimandare a domani la gioia di vivere e di godersi la vita hic et nunc) (Negativo: forte impulsività decisionale e mancanza di visione strategica a lungo termine, approccio miope che privilegia il piacere immediato senza considerare le conseguenze future negative potenziali, rischio di scelte avventate e non ponderate che possono compromettere la sicurezza e il benessere futuro, percezione di eccessiva leggerezza, superficialità e mancanza di serietà e responsabilità in contesti che richiederebbero maggiore visione futura e pianificazione oculata)."
      }
    ],
    softSkill: "Autodisciplina, GestioneDelTempo",
    characteristics: "Impulsività vs. Pianificazione, Preferenza Temporale, Pensiero a Lungo Termine"
  },
  {
    num: 2,
    scenario: "Come ti vedi quando le persone ti causano stress o preoccupazioni?",
    instructions: [
      "Immagine di un uomo in meditazione in un lago paradisiaco",
      "Immagine di una barca a largo con un cielo leggermente nuvoloso.",
      "Immagine di un uomo con un ombrello in un temporale",
      "Immagine di una tempesta furiosa."
    ],
    captions: [
      "Sereno",
      "Impassibile",
      "Preparato",
      "Tempestoso"
    ],
    options: [
      {
        value: "Sereno",
        text: "(Positivo: calma e sicurezza interiore, totale fiducia nelle proprie risorse, approccio zen e distaccato alle turbolenze esterne, persona imperturbabile e non influenzabile da fattori di stress esterni) (Negativo: potenziale distacco emotivo e mancanza di empatia verso le difficoltà altrui, rischio di apparire freddo o indifferente alle preoccupazioni delle persone vicine, percezione di eccessiva autosufficienza o mancanza di sensibilità e calore umano in contesti relazionali che richiederebbero maggiore vicinanza e partecipazione emotiva)."
      },
      {
        value: "Impassibile",
        text: "(Positivo: sangue freddo e lucidità di fronte allo stress, capacità di mantenere la calma e il controllo anche in situazioni difficili, approccio razionale e focalizzato sulla gestione pratica dei problemi, persona affidabile e capace di tenere la barra dritta anche in momenti di incertezza e tensione) (Negativo: potenziale sottovalutazione dei problemi reali o dei segnali di pericolo, rischio di apparire distaccato o poco coinvolto emotivamente, mancanza di empatia e comprensione verso l'ansia e le preoccupazioni altrui, percezione di eccessivo self-control o mancanza di calore umano e vicinanza emotiva in contesti che richiederebbero maggiore partecipazione e condivisione emotiva)."
      },
      {
        value: "Preparato",
        text: "(Positivo: preparazione e attenzione ai segnali di pericolo e alle potenziali difficoltà, approccio previdente e orientato alla prevenzione, capacità di anticipare i problemi e prepararsi ad affrontarli, persona responsabile, attenta e pronta a reagire di fronte alle avversità, atteggiamento vigile e proattivo di fronte alle sfide) (Negativo: ansia e preoccupazione eccessive e prolungate, rischio di ipervigilanza e stress cronico, potenziale affaticamento emotivo e sovraccarico di preoccupazioni anticipatorie, percezione di persona ansiosa, apprensiva e forse eccessivamente allarmista o pessimista nella visione delle relazioni interpersonali e dell'ambiente circostante, approccio forse non sempre ottimizzato per il benessere emotivo quotidiano e la serenità interiore)."
      },
      {
        value: "Tempestoso",
        text: "(Positivo: alta sensibilità emotiva e profonda consapevolezza dell'ambiente emotivo circostante, capacità di percepire e dare nome allo stress e alle preoccupazioni reali causate dalle dinamiche relazionali tossiche o problematiche con persone difficili, approccio autentico e non negazionista di fronte alle emozioni negative reali causate da fattori di stress esterni e oggettivi) (Negativo: stress e preoccupazione significativi e frequenti a causa delle persone intorno, alta vulnerabilità allo stress esterno e alle dinamiche relazionali negative, rischio di vivere in modo conflittuale e difficile le relazioni interpersonali, percezione di persona ipersensibile, emotivamente fragile e non sempre abile nel gestire lo stress e le pressioni esterne quotidiane, approccio forse non ottimizzato per il benessere emotivo e la resilienza interiore di fronte a fattori di stress inevitabili o persistenti nel tempo)."
      }
    ],
    softSkill: "GestioneDelloStress, Resilienza",
    characteristics: "Livelli di Ansia, Resilienza Emotiva, Comfort Sociale"
  },
  {
    num: 3,
    scenario: "In una riunione di team, una collega fa una proposta che ti sembra interessante, ma un collega uomo la liquida con un commento sprezzante. Come reagisci?",
    instructions: [
      "Immagine di un placido fiume.",
      "Immagine di qualcuno che fa \"un like\" su un social",
      "Immagine di qualcuno che si complimenta con una collega donna.",
      "Immagine di qualcuno che rimprovera un collega uomo."
    ],
    captions: [
      "Faccio Finta di Niente",
      "Le dò un Like e vado avanti",
      "Riprendo l'Idea e Apro la Discussione",
      "Difendo la Collega e Condanno il Gesto"
    ],
    options: [
      {
        value: "Faccio Finta di Niente",
        text: "(Negativo: omertà e mancato supporto all'inclusione, perpetuazione dinamiche tossiche e irrispettose, mancanza di assunzione di responsabilità sociale e civile, percezione di persona indifferente, egoista e non affidabile in contesti che richiederebbero coraggio civile e presa di posizione netta e inequivocabile in difesa di valori fondamentali come l' equità e il rispetto reciproco) (Positivo: evitamento del conflitto immediato e di rogne personali, mantenimento di un clima di lavoro apparentemente tranquillo e non conflittuale, massimizzazione della sicurezza personale e dell' evitamento di problemi immediati e tangibili, approccio prudente e conservativo che privilegia la comfort zone personale e la non esposizione diretta a rischi o conseguenze negative immediate per sé stessi)."
      },
      {
        value: "Le dò un Like e vado avanti",
        text: "(Negativo: supporto parziale e mancato intervento deciso contro dinamiche irrispettose e tossiche, rischio di non cambiare concretamente la situazione e di legittimare implicitamente comportamenti inaccettabili con il proprio silenzio-assenso di fatto, percezione di persona tiepida, non pienamente coraggiosa e poco incline a prendere posizione nettamente in difesa di valori come l' equità e il rispetto reciproco in modo aperto e inequivocabile) (Positivo: riconoscimento formale dell'idea della collega e tentativo soft di smorzare la tensione e non farne una questione personale, approccio diplomatico e moderato che cerca di mediare tra diverse esigenze e sensibilità, volontà di non esacerbare il conflitto apertamente e in modo frontale, mantenimento di un clima di lavoro formalmente educato e non ostile apertamente)."
      },
      {
        value: "Riprendo l'Idea Apro la Discussione",
        text: "(Positivo: supporto attivo e concreto all'inclusione e valorizzazione delle idee di tutti senza distinzioni di genere, affermazione di un approccio paritario e meritocratico, promozione di un clima di lavoro collaborativo e rispettoso delle diversità di genere e di opinione, percezione di persona attenta all'inclusione, orientata al team e non sorda alle dinamiche di genere problematiche esistenti sul posto di lavoro) (Negativo: condanna indiretta e non esplicita del comportamento irrispettoso (manca presa di posizione diretta contro il molestatore verbale), rischio di non fermare completamente dinamiche patriarcali e tossiche con un approccio solo indiretto e non pienamente assertivo in prima persona contro il molestatore verbale in quanto tale, percezione di approccio forse non pienamente risolutivo alla radice del problema specifico del sessismo verbale manifesto in quel momento (pur essendo utile a livello generale per promuovere l'inclusione in modo ampio e continuativo nel tempo))."
      },
      {
        value: "Difendo la Collega e Condanno il Gesto",
        text: "(Positivo: forte e chiaro impegno personale per l'equità e la giustizia sostanziale, difesa attiva e senza ambiguità dei più deboli e di chi viene ingiustamente messo a tacere, affermazione di valori etici non negoziabili di rispetto e parità di genere, approccio assertivo e coraggioso che non teme il conflitto per difendere i più deboli e per denunciare comportamenti inaccettabili apertamente e senza mezzi termini in difesa di valori superiori, percezione di persona integra, coraggiosa, assertiva, paladina della giustizia e non disposta a cedere di fronte a prepotenze o ingiustizie manifeste) (Negativo: potenziale generazione di conflitti diretti e aperti e creazione di un clima di lavoro teso o polarizzato, rischio di essere percepito come eccessivamente aggressivo o inflessibile e poco incline al compromesso o alla mediazione anche quando non strettamente necessario o non utile ai fini della vera soluzione pratica e concreta del problema in ottica di massima efficacia e pragmatismo complessivo nel lungo periodo (che potrebbe anche richiedere talvolta strategie più sfumate, indirette o diplomatiche per raggiungere un vero cambiamento sostenibile nel tempo a livello sistemico e culturale profondo e non solo immediato e apparente in superficie con la pura forza assertiva diretta e frontale immediata)))."
      }
    ],
    softSkill: "TematicheSociali, DiversitaEInclusione",
    characteristics: "Affrontare Comportamenti Patriarcali, Promuovere Inclusione, Assertività"
  },
  {
    num: 4,
    scenario: "In Azienda cambia tutto, e alcuni dei tuoi colleghi non vogliono saperne. Come ti comporti?",
    instructions: [
      "Immagine di un rullo compressore che schiaccia i sassi.",
      "Immagine di un uomo che fa un \"ok\" mentre si allontana.",
      "Immagine di un professore che spiega.",
      "Immagine di uno leader politico in un comizio."
    ],
    captions: [
      "Impongo la mia Filosofia",
      "Io Vado Avanti da Solo",
      "Cerco di Spiegargli",
      "Faccio da Portavoce"
    ],
    options: [
      {
        value: "Impongo la mia Filosofia",
        text: "(Positivo: decisionismo e rapidità d'azione, massima velocità decisionale e operativa, approccio tranchant e senza esitazioni, leadership forte e direttiva orientata all' azione rapida e risolutiva) (Negativo: autoritarismo e alienazione del team, mancanza di ascolto e coinvolgimento del team, rischio di demotivazione e ostilità del gruppo, percezione di leadership aggressiva, autoritaria e poco incline al dialogo e alla collaborazione, danno potenziale al clima di lavoro e al morale del team nel lungo periodo)."
      },
      {
        value: "Io Vado Avanti da Solo",
        text: "(Positivo: fermezza e chiarezza decisionale, Leadership ferma e determinata, non indecisa o titubante, messaggio univoco e non ambiguo di direzione chiara e decisione presa senza possibilità di ripensamenti) (Negativo: mancanza di ascolto e inclusività, non tiene conto del feedback e delle preoccupazioni altrui, rischio di resistenza passiva o boicottaggio silenzioso da parte del team non coinvolto e non ascoltato, percezione di leadership poco inclusiva, non partecipativa e non sempre sostenibile nel lungo periodo in termini di coesione e collaborazione del team, mancanza di empatia e comprensione verso le paure e le resistenze legittime al cambiamento imposto dall'alto senza dialogo preventivo e coinvolgimento attivo del team nella fase decisionale iniziale)."
      },
      {
        value: "Cerco di Spiegargli",
        text: "(Positivo: supporto al team e accompagnamento al cambiamento, leadership supportiva e orientata al team, volontà di convincere e accompagnare il team nel cambiamento con la spiegazione e il supporto attivo, approccio rassicurante e orientato alla gestione umana del cambiamento) (Negativo: lentezza e dispendio di energie, potenziale rallentamento del processo decisionale e operativo, rischio di inefficienza e perdita di tempo nel convincere i resistenti ad ogni costo, percezione di approccio troppo lento o dispersivo in contesti che richiederebbero maggiore velocità e decisionismo tranchant e risolutivo immediato, non sempre ottimizzato per la massima efficienza e rapidità operativa tout court)."
      },
      {
        value: "Faccio da Portavoce",
        text: "(Positivo: lavoro di squadra e ricerca di soluzioni condivise e inclusive, massima valorizzazione del team e del lavoro di squadra, approccio democratico e partecipativo che mira al consenso e alla condivisione delle decisioni, percezione di leadership inclusiva, collaborativa e orientata al team e alla coesione di gruppo) (Negativo: inefficacia decisionale e compromessi eccessivi, potenziale paralisi decisionale per eccessiva ricerca di consenso unanime, rischio di decisioni annacquate o poco incisive per accontentare tutti, approccio forse non sempre ottimizzato per la massima efficacia e rapidità decisionale in contesti che richiederebbero decisioni forti e tempestive anche senza consenso unanime, percezione di leadership troppo debole o poco incisiva quando serve davvero decidere rapidamente e senza troppi compromessi al ribasso per accontentare tutti a ogni costo)."
      }
    ],
    softSkill: "GestioneDelCambiamento, Leadership",
    characteristics: "Leadership del Cambiamento, Gestione della Resistenza, Coinvolgimento del Team"
  },
  {
    num: 5,
    scenario: "Hai continue discussioni con un collega che la vuole sempre vinta. Come reagisci di solito?",
    instructions: [
      "Immagine di una bandiera bianca.",
      "Immagine di una persona che si allontana sbuffando.",
      "Immagine di un bodybuilder che solleva un peso enorme.",
      "Immagine di una macchina da F1 che sfreccia via."
    ],
    captions: [
      "Mollo Subito",
      "Mi lamento, ma evito lo scontro",
      "Testa Bassa e Vado Avanti",
      "Riparto alla Grande"
    ],
    options: [
      {
        value: "Mollo Subito",
        text: "(Negativo: scarsa resilienza e tendenza a evitare le sfide, rinuncia a affrontare le difficoltà, approccio passivo di fronte agli ostacoli, percezione di fragilità e scarsa determinazione nel superare le avversità) (Positivo: evitamento dello stress, preservazione energie personali, approccio minimalista e non conflittuale, concentrazione su attività percepite come più facili o meno dispendiose in termini di lotta e confronto, ricerca della comfort zone e dell' evitamento di situazioni problematiche o stressanti in modo radicale)."
      },
      {
        value: "Mi lamento, ma evito lo scontro",
        text: "(Negativo: frustrazione e mancata risoluzione del conflitto alla radice, accumulo di tensione repressa, approccio attendista e non pienamente efficace nel gestire dinamiche conflittuali persistenti, percezione di persona non assertiva, poco incline al confronto aperto e diretto e non sempre ottimizzata per la gestione proattiva e risolutiva dei conflitti interpersonali persistenti e non evitabili) (Positivo: reazione e ritorno in pista dopo un po', capacità di rimettersi in gioco pur non affrontando il problema direttamente, approccio resiliente a modo suo che permette di superare (anche se non risolvere alla radice) la situazione problematica, volontà di non farsi abbattere completamente e di proseguire nonostante la frustrazione e il disagio personale, gestione parziale dello stress che permette di andare avanti nonostante tutto pur senza risolvere davvero il problema conflittuale di fondo)."
      },
      {
        value: "Testa Bassa e Vado Avanti",
        text: "(Positivo: perseveranza e determinazione incrollabili, forte tenacia nel non mollare mai e andare avanti nonostante tutto, approccio combattivo e resiliente che valorizza la lotta e la resistenza di fronte alle avversità, percezione di persona forte, determinata, tenace e non facilmente scoraggiabile o abbattibile di fronte alle difficoltà persistenti e agli ostacoli ripetuti) (Negativo: rischio di burnout e mancata gestione dello stress accumulato nel tempo, potenziale cieca testardaggine che impedisce di vedere soluzioni alternative o più efficaci per risolvere il problema conflittuale alla radice, approccio iper-focalizzato sulla lotta e la resistenza che potrebbe trascurare il benessere personale e la qualità della vita nel lungo periodo, percezione di persona eccessivamente dura, inflessibile e poco incline al compromesso o alla ricerca di soluzioni collaborative win-win per superare davvero il conflitto alla radice e in modo sostenibile nel tempo senza stress eccessivo prolungato per nessuna delle parti in gioco)."
      },
      {
        value: "Riparto alla Grande",
        text: "(Positivo: resilienza costruttiva e apprendimento attivo dagli errori e dalle sconfitte, approccio proattivo e orientato alla crescita personale e professionale attraverso le difficoltà e i conflitti, valorizzazione del fallimento come opportunità di miglioramento continuo e automiglioramento costante, percezione di persona matura, resiliente, ottimista e orientata alla crescita personale e professionale nel lungo periodo) (Negativo: focus eccessivo sulla performance e potenziale trascuratezza dell'aspetto relazionale del conflitto (manca attenzione alla relazione con il collega difficile e alla gestione empatica del conflitto interpersonale in quanto tale prima ancora che come occasione di crescita personale e professionale per sé stessi), rischio di approccio troppo auto-centrico e iper-focalizzato sul proprio miglioramento personale e professionale a scapito della vera risoluzione empatica e collaborativa del conflitto interpersonale in quanto tale prima ancora che come strumento utile per la propria crescita personale e professionale, percezione di approccio forse non sempre ottimizzato per la massima efficacia relazionale e collaborativa nel team nel lungo periodo (che potrebbe anche richiedere talvolta maggiore attenzione alla relazione umana e empatia prima ancora che focus esclusivo sulla pura performance e crescita personale e professionale individuale fine a sé stessa)))."
      }
    ],
    softSkill: "Resilienza, GestioneDelloStress",
    characteristics: "Resilienza, Perseveranza, Ottimismo, Approccio alla Risoluzione dei Problemi"
  }
];
