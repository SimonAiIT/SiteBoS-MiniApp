import { Question } from "../types";

export const questions16to20: Question[] = [
  {
    num: 16,
    scenario: "L'azienda cambia software, e tutti devono imparare ad usarlo. Tu come ti comporti?",
    instructions: [
      "Immagine di una roccia inamovibile.",
      "Immagine di uno studente di scuola guida.",
      "Immagine di uno studente che studia sotto un albero.",
      "Immagine di un softhware developer concentrato a programmare."
    ],
    captions: [
      "Software Nuovo? No Grazie",
      "Uso il Minimo Indispensabile",
      "Imparo le Basi, Poi Piano Piano",
      "Divento Esperto Subito"
    ],
    options: [
      {
        value: "Software Nuovo? No Grazie",
        text: "(Negativo: resistenza al cambiamento e chiusura novità, poca adattabilità e flessibilità, approccio immobilista e poco incline aggiornamento, persona percepita rigida e poco dinamica) (Positivo: competenza sistema esistente, massima sicurezza e comfort professionale, approccio conservativo e non rischioso, valorizzazione stabilità e prevedibilità, evita stress apprendimento nuovi sistemi complessi)."
      },
      {
        value: "Uso il Minimo Indispensabile",
        text: "(Negativo: scarso impegno e adattamento superficiale, approccio minimalista e poco proattivo, mancanza curiosità e iniziativa per nuove opportunità software, persona percepita poco coinvolta e non affidabile nei cambiamenti) (Positivo: gestione stress cambiamento con approccio minimalista, adattamento sufficiente senza problemi immediati, evita eccessivo coinvolgimento emotivo per preservare energie su priorità percepite come più importanti)."
      },
      {
        value: "Imparo le Basi, Poi Piano Piano",
        text: "(Positivo: apertura al cambiamento e apprendimento graduale, approccio cauto e pianificato, gestione moderata stress cambiamento, volontà di adeguarsi al cambiamento con calma) (Negativo: lentezza apprendimento e svantaggio competitivo, rischio di rimanere indietro rispetto a colleghi più veloci, approccio non sempre ottimizzato per contesti che richiederebbero velocità apprendimento e adattamento rapido)."
      },
      {
        value: "Divento Esperto Subito",
        text: "(Positivo: massimo entusiasmo novità e apprendimento rapido, approccio sfidante e orientato a eccellenza e massima performance, volontà di diventare subito esperto) (Negativo: rischio stress da performance eccessiva, potenziale superficialità apprendimento frettoloso, approccio iper-focalizzato su velocità e performance individuale immediata trascura teamwork a lungo periodo, approccio non sempre ottimizzato per sostenibilità lungo periodo e benessere team)."
      }
    ],
    softSkill: "GestioneDelCambiamento, Adattabilita",
    characteristics: "Adattabilità ai Nuovi Sistemi, Prontezza al Cambiamento, Proattività"
  },
  {
    num: 17,
    scenario: "Parli al telefono con qualcuno.  Quanto ti viene naturale far capire come ti senti, solo con la voce?",
    instructions: [
      "Immagine di giocatore di poker durante una partita.",
      "Immagine di una faccia con una piccola smorfia, appena accennata.",
      "Immagine di una faccia espressiva ma non esagerata.",
      "Immagine di una attore sul palco."
    ],
    captions: [
      "Faccia da Poker.",
      "Emozioni Minime.",
      "Emozioni Misurate.",
      "Faccio Teatro, come sempre."
    ],
    options: [
      {
        value: "Faccia da Poker.",
        text: "(Negativo: difficoltà nella comunicazione emotiva a voce e potenziale percezione di freddezza o distacco emotivo,  mancanza di calore umano e  empatia percepita attraverso la voce,  rischio di incomprensioni o  fraintendimenti a livello emotivo nelle relazioni interpersonali) (Positivo: controllo totale delle proprie emozioni che non traspaiono  all'esterno,  approccio distaccato e  razionale che evita interferenze emotive non necessarie o  controproducenti  in  contesti  professionali  o  formali,  massimizzazione della concentrazione sul contenuto  oggettivo  della  comunicazione  verbale  e  non  distrazione  causata  da  dinamiche  emotive  eccessivamente  coinvolgenti  o  fuorvianti)."
      },
      {
        value: "Emozioni Minime.",
        text: "(Negativo: potenziale ambiguità emotiva e scarsa espressività percepita a voce,  rischio di non essere pienamente compreso a livello emotivo dal proprio interlocutore telefonico,  mancanza di calore umano e  coinvolgimento emotivo percepito attraverso la voce in modo chiaro e  inequivocabile) (Positivo: discrezione e riservatezza apprezzabili in contesti professionali formali o delicati,  approccio misurato e  non invadente sul piano emotivo,  evitamento di eccessiva espressività emotiva percepita come non appropriata o  inopportuna  in  certi  contesti  professionali  o  formali,  mantenimento di un certo  controllo  e  riserbo  sulle  proprie  emozioni  trasmesse)."
      },
      {
        value: "Emozioni Giuste.",
        text: "(Positivo: comunicazione emotiva naturale ed efficace al telefono,  capacità di trasmettere chiaramente e in modo naturale le proprie emozioni  attraverso la voce,  approccio equilibrato che bilancia espressività emotiva e  controllo  professionale,  percezione di persona autentica,  trasparente,  empatica e  capace di creare connessione umana e  relazionale  anche  solo  attraverso la  voce  al  telefono) (Negativo: potenziale mancanza di controllo emotivo in alcune situazioni particolari di stress o tensione,  rischio di trasparire emozioni non pienamente controllate o  non del tutto adeguate  al  contesto  professionale  specifico,  percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero massimo self-control e  distacco  emotivo  totale  e  non  espressione  aperta  delle  proprie  emozioni  personali  al  telefono)."
      },
      {
        value: "Faccio Teatro, come sempre.",
        text: "(Positivo: massima espressività emotiva e apertura totale nella comunicazione a voce,  capacità di coinvolgere emotivamente l'interlocutore telefonico e di  trasmettere  passione  ed  entusiasmo  attraverso la  voce,  approccio carismatico e  orientato all' impatto emotivo massimo  sulla  persona  all'  altro  capo  del  telefono) (Negativo: eccessiva drammaticità o invadenza emotiva percepita al telefono,  rischio di apparire non autentico o troppo teatrale e  poco credibile o  spontaneo,  reazioni emotive potenzialmente sproporzionate o  non sempre adeguate al contesto professionale specifico,  percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore sobrietà,  misura,  discrezione e  controllo emotivo  e  non eccessiva  enfasi  sull'  espressione  plateale  e    non sempre  appropriata  delle  proprie  emozioni  personali  al  telefono)."
      }
    ],
    softSkill: "ComunicazioneEfficace, Empatia",
    characteristics: "Espressività Emotiva, Stile di Comunicazione, Consapevolezza Emotiva"
  },
  {
    num: 18,
    scenario: "Quanto pensi di essere capace di ispirare e guidare le persone?",
    instructions: [
      "Immagine di lupo che cammina da solo, nessuno lo segue.",
      "Immagine di un gruppetto di lupi che cammina insieme, senza una guida chiara.",
      "Immagine di un gruppo branco di lupi che segue uno.",
      "Immagine di una folla oceanica di lupi che ulula al leader sulla rupe, con entusiasmo."
    ],
    captions: [
      "Lupo Solitario",
      "Siamo una Piccola Banda",
      "Seguito Quel Tanto che Basta",
      "Voglio essere Acclamato dalla Folla"
    ],
    options: [
      {
        value: "Lupo Solitario",
        text: "(Negativo: mancanza di leadership e tendenza all'isolamento,  difficoltà a lavorare in team e  a influenzare gli altri,  scarsa ambizione di guidare gruppi ampi,  percezione di individualismo spinto e  poca inclinazione alla collaborazione e alla guida) (Positivo: autonomia e indipendenza decisionale e operativa,  massima libertà d'azione individuale e  focus sul lavoro personale senza distrazioni o  compromessi legati alla leadership,  valorizzazione della solitudine come fonte di forza e  indipendenza,  approccio self-sufficient e  non dipendente dal bisogno di seguito o  approvazione altrui)."
      },
      {
        value: "Siamo una Piccola Banda",
        text: "(Positivo: leadership informale e influenza nel proprio cerchio ristretto,  capacità di creare legami stretti e  personali con un gruppo limitato di persone,  modestia e  approccio umile alla leadership senza manie di grandezza,  valorizzazione delle relazioni paritarie e  non gerarchiche all'interno di un team ristretto) (Negativo: limitata ambizione di leadership su vasta scala e influenza circoscritta a un piccolo gruppo,  mancanza di visione macro e  capacità di ispirare e guidare grandi team o  folle,  potenziale difficoltà a emergere come leader in contesti ampi e  competitivi che richiederebbero maggiore visibilità e  carisma su larga scala,  percezione di leadership modesta ma non incisiva oltre la cerchia ristretta)."
      },
      {
        value: "Seguito Quel Tanto che Basta",
        text: "(Positivo: leadership funzionale e pragmatica e realismo,  capacità di guidare un team in modo efficace e  operativo senza eccessi di protagonismo o  carisma esagerato,  approccio concreto e  orientato al risultato pratico e  misurabile,  valorizzazione dell' efficacia e  della funzionalità della leadership operativa quotidiana) (Negativo: mancanza di carisma ispirazionale e leadership ordinaria senza slancio visionario o  trascinante,  potenziale difficoltà a motivare e  ispirare grandi gruppi con un carisma straordinario e  non convenzionale,  percezione di leadership solida e  affidabile ma non memorabile o  eccezionale in termini di carisma puro e  capacità di infiammare le folle con visioni trascendenti e  idealistiche,  approccio forse non sempre ottimizzato per contesti che richiederebbero leadership ispirazionale carismatica pura e  non solo funzionale e  pragmatica)."
      },
      {
        value: "Voglio essere Acclamato dalla Folla",
        text: "(Positivo: forte leadership innata e  carisma naturale capacità di ispirare e motivare grandi gruppi e folle oceaniche con visioni ambiziose e  trascinanti,  approccio leaderistico carismatico per vocazione innata e  istintiva,  massima fiducia in sé stessi e nel proprio ascendente naturale sugli altri,  percezione di persona predestinata alla leadership di nascita e  per vocazione innata e  naturale e  non artificiale o  costruita a tavolino) (Negativo: potenziale autoritarismo e narcisismo ipertrofico,  rischio di leadership accentratrice e  poco incline alla delega e al teamwork paritario e  collaborativo,  percezione di eccessiva sicurezza di sé che sconfina nell' arroganza o  narcisismo,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore umiltà,  collaborazione paritaria e  leadership distribuita e condivisa invece che accentrata e  verticistica iper-carismatica,  rischio di culto della personalità eccessivo e  non sempre funzionale al vero bene del team e dell' organizzazione nel lungo periodo e  in ottica di sostenibilità etica e  manageriale autentica)."
      }
    ],
    softSkill: "Leadership, GestioneDelTeam",
    characteristics: "Potenziale di Leadership, Carisma, Influenza Sociale"
  },
  {
    num: 19,
    scenario: "Vedi un collega che prende in giro e tratta male un altro collega più giovane. Come reagisci?",
    instructions: [
      "Immagine di uno struzzo con la testa sotto la sabbia.",
      "Immagine di una persona di schiena, che dà le spalle alla scena.",
      "Immagine di una mano che passa di nascosto un biglietto di supporto a un'altra mano.",
      "Immagine di un pugno chiuso che si alza in segno di protesta."
    ],
    captions: [
      "Faccio Spallucce",
      "Disagio Silenzioso",
      "Aiuto in Privato",
      "Rimprovero il Collega"
    ],
    options: [
      {
        value: "Faccio Spallucce",
        text: "(Negativo: indifferenza e mancato supporto alla vittima e potenziale passività di fronte a comportamenti inaccettabili,  omissione di soccorso di fronte a prepotenze e  ingiustizie,  mancanza di coraggio civile e  solidarietà verso i più deboli,  percezione di persona egoista,  indifferente e  poco affidabile in contesti che richiederebbero maggiore sensibilità etica e  intervento attivo in difesa dei valori condivisi e  dell'equità sociale e  professionale) (Positivo: evitamento del conflitto personale diretto e mantenimento di una posizione neutrale e  non coinvolta,  massimizzazione della sicurezza personale e  dell'evitamento di rogne e  complicazioni inutili in dinamiche interpersonali altrui,  approccio pragmatico e  focalizzato sui propri affari senza distrazioni emotive o   interferenze esterne)."
      },
      {
        value: "Disagio Silenzioso",
        text: "(Negativo: omissione di soccorso e mancato supporto attivo alla vittima per paura del conflitto e  per timidezza o  vigliaccheria,  mancanza di coraggio civile nell'affrontare apertamente comportamenti prepotenti e  ingiusti,  percezione di persona non assertiva,  poco coraggiosa e  non pienamente affidabile nel supportare attivamente i colleghi vittime di prepotenze altrui) (Positivo: consapevolezza del problema e disapprovazione, seppur passiva e  non esplicita,  minima espressione di disagio silenzioso che segnala comunque una certa sensibilità etica e  consapevolezza del problema pur senza esporsi attivamente e  direttamente,  approccio cauto e  non confrontazionale che evita rischi personali e  conflitti aperti)."
      },
      {
        value: "Aiuto in Privato",
        text: "(Positivo: supporto concreto alla vittima in modo discreto e  non plateale,  tentativo di aiuto reale e  non solo simbolico,  approccio solidale e  orientato alla cura privata della vittima,  percezione di persona umana,  sensibile e  solidale dietro le quinte e  non solo a parole o  in pubblico) (Negativo: mancata denuncia pubblica del comportamento sbagliato e potenziale inefficacia dell'intervento discreto nel fermare il molestatore e  nel prevenire future prepotenze,  rischio di non risolvere il problema alla radice e di non scoraggiare pubblicamente comportamenti inaccettabili simili in futuro,  percezione di approccio non completamente risolutivo in termini di prevenzione pubblica e  deterrenza esemplare verso altri potenziali molestatori,  azione limitata all'aiuto individuale e  privato e  non estesa alla tutela collettiva e  pubblica dei valori condivisi e  del rispetto universale in azienda)."
      },
      {
        value: "Rimprovero il Collega",
        text: "(Positivo: forte senso di giustizia e difesa dei più deboli e assertività,  intervento diretto e coraggioso contro le prepotenze inaccettabili,  affermazione pubblica di valori etici e  di rispetto universale,  approccio tranchant e  senza compromessi in difesa dei più deboli,  percezione di persona coraggiosa, assertiva,  integra,  paladina della giustizia e  pronta a metterci la faccia in prima persona per difendere i valori condivisi e  proteggere i più deboli dalle prepotenze altrui) (Negativo: potenziale conflittualità e percezione di eccessiva aggressività o giustizialismo,  rischio di escalation del conflitto e  di reazioni negative da parte del molestatore e di chi non approva metodi troppo diretti e  confrontazionali, percezione di persona eccessivamente aggressiva,  giustizialista o  poco incline alla mediazione e al compromesso diplomatico e non conflittuale a tutti i costi,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore diplomazia,  mediazione e  gestione soft e  non frontale dei conflitti e delle dinamiche relazionali complesse)."
      }
    ],
    softSkill: "TematicheSociali, DiversitaEInclusione",
    characteristics: "Affrontare Molestie, Condotta Etica, Assertività"
  },
  {
    num: 20,
    scenario: "Sei al ristorante, bar, o un posto simile.  Come ti comporti di solito con chi ci lavora?",
    instructions: [
      "Immagine di una persona stilizzata, seduta ad un tavolino di un bar.",
      "Immagine di due sagome stilizzate che si passano un pacco, transazione veloce.",
      "Immagine di tre sagome stilizzate che parlano amichevolmente,  cerchio sociale ristretto.",
      "Immagine di tante sagome stilizzate che fanno festa insieme,  integrazione totale."
    ],
    captions: [
      "Cliente Fantasma",
      "Consumazione Veloce e Via",
      "Quattro Chiacchiere e Ciao",
      "Festa con Tutti"
    ],
    options: [
      {
        value: "Cliente Fantasma",
        text: "(Negativo: scarsa socievolezza e potenziale freddezza relazionale,  mancanza di interazione umana e  chiusura sociale,  opportunità relazionali mancate e  percezione di distacco e  isolamento) (Positivo: rispetto della privacy altrui e discrezione,  approccio efficiente e  focalizzato sull'essenziale,  massima autonomia e  indipendenza nella fruizione del servizio,  evitamento di interazioni superflue e  perdite di tempo in chiacchiere inutili,  massimizzazione della velocità e  semplicità dell'interazione commerciale pura)."
      },
      {
        value: "Consumazione Veloce e Via",
        text: "(Positivo: efficienza e focalizzazione sull'obiettivo,  approccio formale ed educato ma diretto al punto,  rispetto dei ruoli e delle distanze professionali,  massimizzazione della velocità e della linearità dell'interazione commerciale pura) (Negativo: percezione di freddezza e mancato coinvolgimento sociale,  mancanza di calore umano e  empatia,  opportunità mancate di interazione sociale spontanea e  informale,  approccio forse non sempre ottimizzato per contesti che valorizzerebbero maggiormente la relazione umana e  la connessione personale anche in ambito commerciale o di servizio)."
      },
      {
        value: "Quattro Chiacchiere e Ciao",
        text: "(Positivo: socievolezza equilibrata e gentilezza,  approccio umano e  cordiale che crea un clima positivo,  capacità di interazione sociale sufficiente per creare un contatto piacevole e  non freddo o  distaccato,  gestione equilibrata delle relazioni interpersonali in contesti sociali casuali) (Negativo: interazioni superficiali e potenziale chiusura relazionale,  mancanza di approfondimento delle relazioni e  di vera connessione umana profonda,  approccio moderato che potrebbe non cogliere appieno le opportunità di networking e  di vera socializzazione autentica,  percezione di limitatezza o  superficialità delle interazioni sociali effettive)."
      },
      {
        value: "Festa con Tutti",
        text: "(Positivo: estroversione, apertura e socievolezza spinte all'estremo,  massima facilità a creare nuove connessioni e  relazioni informali e  spontanee,  approccio aperto,  coinvolgente ed entusiasta,  valorizzazione della socialità e dell' interazione umana come fonte di arricchimento e  piacere primario,  percezione di persona carismatica,  estroversa,  aperta e  molto socievole e coinvolgente in contesti informali) (Negativo: potenziale invadenza e difficoltà a rispettare i confini altrui,  rischio di essere percepito come eccessivamente espansivo o  invadente e  non sempre attento ai segnali di disagio o  riservatezza altrui,  mancanza di discrezione e  rispetto della privacy e dello spazio personale altrui,  approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore riservatezza,  formalità e  rispetto dei confini personali altrui)."
      }
    ],
    softSkill: "RelazioniInterpersonali, ComunicazioneEfficace",
    characteristics: "Introversione vs. Estroversione, Comfort Sociale, Apertura"
  }
];
