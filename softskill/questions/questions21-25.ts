import { Question } from "../types";

export const questions21to25: Question[] = [
  {
    num: 21,
    scenario: "Vedi una persona che fa qualcosa di strano.  Cosa pensi di solito?",
    instructions: [
      "Immagine di un camaleonte che cambia colore per adattarsi all'ambiente.",
      "Immagine di una bilancia della giustizia perfettamente in equilibrio.",
      "Immagine di un paesaggio nebbioso che oscura la vista.",
      "Immagine di un orologio a cucù con un uccello cucù che esce in modo caotico."
    ],
    captions: [
      "Cerco di Capire Sempre Tutti",
      "Cerco di Essere Logico",
      "A Volte Non Capisco",
      "Ma Che Gli Salta in Mente?"
    ],
    options: [
      {
        value: "Cerco di Capire Sempre Tutti",
        text: "(Positivo: alta empatia e comprensione universale,  approccio inclusivo e  tollerante verso la diversità,  massima apertura mentale e  accettazione del diverso come valore) (Negativo: eccessiva giustificazione e potenziale mancanza di giudizio critico di fronte a comportamenti oggettivamente sbagliati,  rischio di buonismo eccessivo e  ingenuità nel valutare comportamenti borderline o  inaccettabili,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore analisi critica e  capacità di discernimento oggettivo tra comportamenti  semplicemente  strani e  comportamenti oggettivamente problematici o  inaccettabili eticamente o  socialmente)."
      },
      {
        value: "Cerco di Essere Logico",
        text: "(Positivo: approccio logico e tentativo di comprensione razionale,  ricerca di spiegazioni logiche e  coerenti ai comportamenti altrui,  approccio analitico e  orientato alla comprensione razionale del perché le persone fanno ciò che fanno) (Negativo: rigidità logica e potenziale incomprensione di comportamenti non lineari o  non razionali in apparenza,  rischio di forzare la realtà in schemi logici predefiniti e  pre-concetti che potrebbero non aderire pienamente alla complessità e  irrazionalità del comportamento umano reale,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore flessibilità mentale,  apertura all' irrazionalità e  tolleranza dell'ambiguità e  della non linearità del comportamento umano reale e  complesso)."
      },
      {
        value: "A Volte Non Capisco",
        text: "(Positivo: onestà intellettuale e riconoscimento dei limiti della propria comprensione,  umiltà nel riconoscere che non sempre si può capire tutto del comportamento umano,  approccio realistico e  consapevole dei limiti della ragione e della comprensione razionale totale e  universale del comportamento umano) (Negativo: potenziale rinuncia alla comprensione e mancanza di impegno empatico costruttivo e  proattivo per superare i propri limiti di comprensione e  andare oltre la facile rassegnazione all' incomprensibilità,  rischio di passività o  rinuncia precoce di fronte alla sfida della comprensione empatica del comportamento diverso o  strano altrui,  percezione di approccio rassegnato o  poco ambizioso in termini di vera comprensione empatica profonda e  non solo superficiale o  limitata)."
      },
      {
        value: "Ma Che Gli Salta in Mente?",
        text: "(Negativo: scarsa empatia e difficoltà a comprendere punti di vista diversi,  approccio giudicante e  poco incline alla comprensione empatica del perché gli altri fanno ciò che fanno,  mancanza di curiosità autentica verso la diversità e  complessità del comportamento umano,  percezione di chiusura mentale e  pregiudizio verso ciò che è diverso dalla propria norma personale o  culturale) (Positivo: coerenza interna e senso di normalità e  rassicurante familiarità con il proprio sistema di riferimento logico e  culturale,  approccio diretto e  senza ambiguità nel giudizio immediato istintivo senza complicazioni analitiche o  empatiche eccessive,  massimizzazione della semplicità e  immediatezza del giudizio istintivo senza dubbi o  incertezze empatiche eccessive che potrebbero rallentare o  complicare la chiarezza del giudizio immediato e  istintivo puro)."
      }
    ],
    softSkill: "Empatia, Comprensione",
    characteristics: "Empatia, Ragionamento Logico, Assunzione di Prospettiva"
  },
  {
    num: 22,
    scenario: "Pensa ai tuoi soldi. Quanta parte di quello che guadagni metti via per il futuro?",
    instructions: [
      "Immagine di un deserto arido e senza vita.",
      "Immagine di un piccolo germoglio che spunta dalla terra.",
      "Immagine di un giovane albero con alcuni frutti.",
      "Immagine di un granaio che trabocca di grano."
    ],
    captions: [
      "Salvadanaio Vuoto",
      "Salvadanaio Appena Iniziato",
      "Salvadanaio Abbastanza Pieno",
      "Salvadanaio Pieno Zeppo"
    ],
    options: [
      {
        value: "Salvadanaio Vuoto",
        text: "(Negativo: imprevidenza finanziaria e mancanza pianificazione a lungo termine, vulnerabilità economica futura e assenza sicurezza finanziaria, approccio spendaccione e noncurante conseguenze future) (Positivo: gratificazione immediata e godimento presente senza preoccupazioni future, approccio carpe diem che massimizza piacere ora e minimizza stress pianificazione futura)."
      },
      {
        value: "Salvadanaio Appena Iniziato",
        text: "(Positivo: consapevolezza necessità risparmiare, approccio moderatamente previdente e non completamente irresponsabile, tentativo di creare minimo paracadute finanziario futuro) (Negativo: risparmio insufficiente e vulnerabilità finanziaria elevata, mancanza strategia finanziaria solida, approccio inadeguato per obiettivi finanziari ambiziosi, percezione di fragilità e non piena autonomia economica futura)."
      },
      {
        value: "Salvadanaio Abbastanza Pieno",
        text: "(Positivo: equilibrio tra presente e futuro e gestione responsabile denaro, approccio bilanciato e razionale che considera esigenze attuali e sicurezza futura, gestione finanziaria oculata e senza eccessi, percezione di persona equilibrata e responsabile) (Negativo: potenziale limitazione crescita finanziaria a lungo termine per eccessiva moderazione risparmio, approccio non sempre ottimizzato per massima performance finanziaria pura e assoluta nel tempo, rinuncia a slancio più ambizioso e proattivo gestione patrimonio)."
      },
      {
        value: "Salvadanaio Pieno Zeppo",
        text: "(Positivo: massima sicurezza finanziaria futura e forte pianificazione a lungo termine, approccio iper-previdente e massimamente orientato a sicurezza economica assoluta, massimizzazione protezione patrimonio futuro da ogni imprevisto, percezione di persona previdente e totalmente affidabile gestione finanziaria) (Negativo: sacrificio eccessivo presente e potenziale rigidità finanziaria ossessiva, approccio iper-controllante che limita spontaneità e godimento presente e genera stress eccessivo, percezione di approccio eccessivamente rigido e ansioso e non sempre ottimizzato per benessere psicofisico attuale)."
      }
    ],
    softSkill: "FinanzaPersonale, Autodisciplina",
    characteristics: "Pianificazione Finanziaria, Abitudini di Risparmio, Orientamento al Futuro, Responsabilità Finanziaria"
  },
  {
    num: 23,
    scenario: "Come ti comporti quando devi dire le cose chiare a qualcuno, senza giri di parole?",
    instructions: [
      "Immagine di un Leone.",
      "Immagine di un Gufo",
      "Immagine di un Gattino.",
      "Immagine di un Pesce."
    ],
    captions: [
      "Parlo Chiaro e Forte",
      "Chiaro, ma con Cautela",
      "Non Voglio Essere Diretto",
      "Muto"
    ],
    options: [
      {
        value: "Parlo Chiaro e Forte",
        text: "(Positivo: comunicazione diretta ed efficace,  massima chiarezza e trasparenza senza filtri,  approccio tranchant e  senza ambiguità,  persona percepita come schietta,  diretta e  che non le manda a dire,  massima efficienza comunicativa in contesti che richiedono parlare chiaro senza perdersi in chiacchiere inutili) (Negativo: aggressività percepita e potenziale conflittualità,  rischio di ferire la sensibilità altrui con eccessiva direttezza e  franchezza brutale,  mancanza di diplomazia e  tatto,  percezione di persona eccessivamente aggressiva,  prepotente o  maleducata,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore sensibilità,  empatia,  diplomazia e  mediazione soft e  non frontale aggressiva)."
      },
      {
        value: "Chiaro, ma con Cautela",
        text: "(Positivo: comunicazione chiara e diplomatica,  massima efficacia comunicativa unita al tatto e alla diplomazia,  approccio assertivo ma non aggressivo,  persona percepita come professionale,  competente,  chiara ma rispettosa e  attenta alla sensibilità altrui) (Negativo: potenziale mancanza di incisività e messaggio annacquato per eccessiva cautela,  rischio di diluire il messaggio chiave per eccessiva preoccupazione di non offendere,  percezione di approccio moderato e  non sempre sufficientemente incisivo o  diretto al punto,  comunicazione forse non sempre ottimizzata per contesti che richiederebbero massima forza persuasiva e  chiarezza senza compromessi o  eufemismi)."
      },
      {
        value: "Non Voglio Essere Diretto",
        text: "(Positivo: evitamento del conflitto e mantenimento dell'armonia e gentilezza,  approccio pacifico e  non confrontazionale che preserva le relazioni interpersonali positive e  non conflittuali,  valorizzazione dell' armonia e del clima sereno anche a scapito della chiarezza diretta e tranchant,  percezione di persona gentile,  pacifica,  diplomatica e  orientata al consenso e all' armonia relazionale prima di tutto) (Negativo: mancanza di chiarezza e potenziale inefficacia nel risolvere i problemi davvero alla radice,  messaggio annacquato e  poco incisivo,  rischio di non essere compreso pienamente o  di non raggiungere l'obiettivo comunicativo primario per eccessiva preoccupazione di non essere troppo diretti,  evitamento problemi ma non risoluzione vera dei problemi sottostanti,  percezione di persona poco assertiva,  non sempre trasparente e  non pienamente efficace nel problem-solving comunicativo diretto e  aperto e  senza eufemismi)."
      },
      {
        value: "Muto",
        text: "(Negativo: mancanza di comunicazione e incapacità di esprimere le proprie opinioni e passività estrema di fronte alla necessità di comunicare chiaramente senza giri di parole,  rinuncia totale all' assertività e all' efficacia comunicativa diretta e  trasparente,  approccio passivo e  rinunciatario che evita completamente la sfida della comunicazione diretta e tranchant,  isolamento comunicativo e  non partecipazione attiva alla dinamica comunicativa interpersonale diretta e  aperta) (Positivo: evitamento di errori comunicativi e autoprotezione dal rischio di dire cose sbagliate o offensive o  di essere frainteso,  massima prudenza e  controllo della comunicazione,  approccio iper-cauto e  difensivo che minimizza il rischio di conflitto o  giudizio negativo altrui,  percezione di persona prudente,  controllata,  non impulsiva e  attenta a non sbagliare parola,  massimizzazione della sicurezza e dell' evitamento del rischio comunicativo a tutti i costi)."
      }
    ],
    softSkill: "ComunicazioneEfficace, GestioneDeiConflitti",
    characteristics: "Assertività, Capacità di Comunicazione, Gestione dei Conflitti, Sicurezza di Sé"
  },
  {
    num: 24,
    scenario: "Come ti poni di solito quando devi dare indicazioni o guidare gli altri?",
    instructions: [
      "Immagine di un Parlamento Democratico",
      "Immagine di una biblioteca",
      "Immagine di una stazione di pompieri",
      "Immagine di una caserma"
    ],
    captions: [
      "Chiedo Sempre Aiuto",
      "Suggerisco, Non Comando",
      "Guido con Gentilezza",
      "Comando e Basta"
    ],
    options: [
      {
        value: "Chiedo Sempre Aiuto",
        text: "(Positivo: leadership democratica e inclusiva, valorizza contributo team e decisioni condivise, massima apertura dialogo e partecipazione, approccio collaborativo che valorizza intelligenza collettiva) (Negativo: lentezza decisionale e mancanza direzione chiara, rischio processi decisionali farraginosi e inefficienti in contesti rapidi, percezione di leadership debole in emergenze che richiedono comando diretto)."
      },
      {
        value: "Suggerisco, Non Comando",
        text: "(Positivo: leadership gentile e rispettosa autonomia, approccio non direttivo che ispira senza imporre, clima di lavoro autonomo e responsabilizzante, approccio soft e rispettoso sensibilità altrui) (Negativo: potenziale mancanza assertività e guida incisiva, rischio apparire indeciso in situazioni guida forte, percezione leadership troppo soft e poco determinata in contesti competitivi)."
      },
      {
        value: "Guido con Gentilezza",
        text: "(Positivo: leadership autorevole e rispettosa, guida gentile e attenta alle persone, equilibrio tra direzione e rispetto, approccio umano che bilancia efficacia e sensibilità, persona percepita autorevole ma empatica) (Negativo: potenziale mancanza fermezza decisionale in situazioni critiche, rischio apparire troppo gentile e poco incisivo in contesti comando diretto, approccio non sempre ottimizzato per contesti che premiano velocità decisionale e leadership tranchant)."
      },
      {
        value: "Comando e Basta",
        text: "(Positivo: leadership decisa e forte, efficienza decisionale e chiarezza direzione, massima velocità decisionale e operativa, approccio direttivo e focalizzato su risultato senza perdite di tempo, persona percepita determinata e orientata a azione rapida) (Negativo: autoritarismo e demotivazione team e clima poco collaborativo, rischio demotivare team e soffocare iniziativa altrui per accentramento decisionale, percezione leadership autoritaria e poco incline a delega, clima di lavoro potenzialmente teso e poco stimolante per iniziativa spontanea)."
      }
    ],
    softSkill: "Leadership, GestioneDelTeam",
    characteristics: "Stile di Leadership, Autoritarismo, Collaborazione"
  },
  {
    num: 25,
    scenario: "Secondo te, quanto riesci a influenzare gli altri con il tuo modo di essere?",
    instructions: [
      "Immagine di un manichino di alta moda con un abito unico e originale in un atelier vuoto.",
      "Immagine di una persona che si guarda allo specchio e vede riflessa una figura con un abbigliamento simile ma non identico, \"ispirato\".",
      "Immagine di una vetrina di negozio con diversi manichini che indossano abiti con un tema stilistico comune, una tendenza che si diffonde.",
      "Immagine di una folla oceanica di persone vestite in modo identico, come un esercito di \"cloni\" fashion."
    ],
    captions: [
      "Stile Unico, Nessuno Mi Copia",
      "Qualcuno Mi Copia un Po'",
      "Mi Imitano Abbastanza",
      "Tutti Vogliono Essere Come Me"
    ],
    options: [
      {
        value: "Stile Unico, Nessuno Mi Copia",
        text: "(Positivo: originalità e indipendenza e autonomia,  approccio non convenzionale e  fuori dagli schemi,  valorizzazione della unicità personale e  della distinzione dalla massa,  percezione di persona originale,  indipendente e  non omologata e  non influenzabile dalle mode o  dal giudizio altrui) (Negativo: mancanza di leadership e scarsa influenza sugli altri,  potenziale isolamento individualistico e  mancanza di impatto sociale ampio,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore capacità di fare breccia nel cuore e nella mente degli altri e di guidare e influenzare grandi gruppi o  folle,  percezione di persona originale e  indipendente ma poco leader o  influente su larga scala)."
      },
      {
        value: "Qualcuno Mi Copia un Po'",
        text: "(Positivo: un certo grado di influenza limitata e stile personale riconoscibile in una cerchia ristretta e modestia non ostentata,  approccio umile e  non narcisistico alla percezione della propria influenza limitata ma esistente,  valorizzazione della discrezione e  della non ostentazione della propria influenza potenziale ma non esagerata) (Negativo: influenza limitata e potenziale mancanza di ambizione di leadership su vasta scala,  approccio modesto che potrebbe auto-limitare il proprio potenziale di leadership e  influenza più ampia e  incisiva,  mancanza di slancio ambizioso verso una leadership di massa o  su larga scala,  percezione di ambizione di leadership circoscritta e  non massimizzata oltre la cerchia ristretta e informale)."
      },
      {
        value: "Mi Imitano Abbastanza",
        text: "(Positivo: influenza significativa e capacità di essere un punto di riferimento per molti,  approccio leaderistico naturale e  riconosciuto da un certo numero di persone,  valorizzazione di un certo grado di influenza sociale senza eccessi di protagonismo o  narcisismo,  percezione di persona influente,  carismatica quanto basta e  punto di riferimento per molti ma non per tutti,  approccio equilibrato tra influenza e modestia non esagerata) (Negativo: potenziale eccessiva concentrazione sulla propria immagine esteriore e ricerca di approvazione esterna e  riconoscimento sociale diffuso,  rischio di dipendenza dal giudizio altrui e  dall' approvazione esterna come fonte di autostima e  conferma sociale,  percezione di fragilità nascosta dietro l' apparente sicurezza di sé sociale e  ricerca di conferma esteriore continua per alimentare l' autostima vacillante interiore,  approccio forse non sempre ottimizzato per la massima autenticità e  indipendenza dal giudizio altrui e dalla ricerca di approvazione esterna come fonte di autostima primaria e fondamentale)."
      },
      {
        value: "Tutti Vogliono Essere Come Me",
        text: "(Positivo: forte influenza di massa,  carisma trascinante e  capacità di creare tendenze su larga scala,  leadership carismatica innata e  potente che fa tendenza e  detta la moda,  approccio dominante e  protagonistico che impone il proprio stile e la propria visione a molti,  percezione di persona leader nato,  carismatico,  influente oltre la norma e capace di  lasciare il segno in modo indelebile sulla società e sulla cultura di massa) (Negativo: eccessivo egocentrismo e narcisismo ipertrofico e potenziale manipolazione degli altri per mantenere il proprio status di guru incontrastato e  in eterno,  rischio di deriva autoritaria e  manipolatoria,  percezione di leadership eccessivamente accentratrice,  narcisistica,  autoreferenziale e  poco incline alla condivisione autentica del potere e dell' influenza con altri potenziali leader emergenti,  approccio forse non sempre ottimizzato per la massima collaborazione paritaria e  distribuita e per la creazione di un vero team leaderistico diffuso e  non accentrato in modo eccessivo e  personalistico intorno alla figura carismatica del leader indiscusso e onnipotente)."
      }
    ],
    softSkill: "Leadership, GestioneDelTeam",
    characteristics: "Influenza, Carisma, Role Modeling, Leadership (potenziale)"
  }
];
