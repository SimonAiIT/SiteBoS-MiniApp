import { Question } from "../types";

export const questions: Question[] = [
  {
    num: 46,
    scenario: "Quanto spesso si rivolgono proprio a te per un consiglio?",
    instructions: [
      "Immagine di un libro polveroso e dimenticato su uno scaffale, nessuno lo nota.",
      "Immagine di una lampada semi-illuminata in una stanza, notata solo a volte.",
      "Immagine di una lampada luminosa e accesa in una stanza, usata frequentemente.",
      "Immagine di un guru o una figura saggia seduta in cima a una montagna, circondata da persone che cercano consiglio."
    ],
    captions: [
      "Non Mi Chiede Mai Nessuno",
      "Qualcuno Ogni Tanto",
      "Spesso Chiedono a Me",
      "Punto di Riferimento per Tutti"
    ],
    options: [
      {
        value: "Non Mi Chiede Mai Nessuno",
        text: "(Negativo:  scarsa autorevolezza  percepita  e  potenziale  bassa  autostima  e  insicurezza  riguardo  alle  proprie  competenze  e  capacità  di  dare  consigli  utili  e  pertinenti  agli  altrui,  percezione  di  non  essere  considerato  un  punto  di  riferimento  affidabile  o  un  consigliere  valido  e  apprezzato  dagli  altri,  rischio  di  isolamento  sociale  o  professionale  e  di  non  essere  coinvolto  nelle  dinamiche  decisionali  e  nei  processi  di  problem-solving  del  team  o  del  gruppo) (Positivo:  massima concentrazione  sui  propri  compiti  e  priorità  e  gestione  efficiente  del  tempo  senza  essere  distratto  o  sovraccaricato  da  richieste  di  consiglio  altrui,  evitamento  del  rischio  di  burnout  da  eccessiva  disponibilità  e  iper-responsabilizzazione  verso  i  problemi  e  le  esigenze  altrui,  approccio  forse  più  adatto  a  contesti  che  premiano  l' autonomia,  l' indipendenza  e  la  capacità  di  lavorare  in  modo  focalizzato  e  self-directed  senza  eccessive  interferenze  o  distrazioni  provenienti  dall' esterno)."
      },
      {
        value: "Qualcuno Ogni Tanto",
        text: "(Positivo:  disponibilità occasionale  al  supporto  e  all' aiuto  verso  gli  altri  senza  eccessivo  protagonismo  o  eccessiva  visibilità,  approccio  modesto  e  non  ostentato  nell' offrire  il  proprio  consiglio  solo  quando  richiesto  e  senza  imporre  il  proprio  punto  di  vista  o  la  propria  esperienza  in  modo  invadente  o  prevaricante,  gestione  equilibrata  della  propria  influenza  e  autorevolezza  senza  eccessi  di  protagonismo  o  senza  sottovalutare  il  proprio  potenziale  di  supporto  e  di  guida  per  gli  altri) (Negativo:  potenziale mancanza  di  autorevolezza  e  leadership  pienamente  riconosciuta  e  valorizzata  dagli  altrui,  influenza  limitata  e  non  sempre  incisiva  nelle  dinamiche  decisionali  e  nei  processi  di  problem-solving  del  team  o  del  gruppo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  iniziativa,  assertività  e  capacità  di  emergere  come  leader  e  punto  di  riferimento  autorevole  e  riconosciuto  da  tutti  in  modo  chiaro  e  inequivocabile)."
      },
      {
        value: "Spesso Chiedono a Me",
        text: "(Positivo:  autorevolezza riconosciuta  e  apprezzata  dagli  altrui  e  capacità  di  influenzare  positivamente  le  scelte  e  le  decisioni  degli  altri  con  il  proprio  consiglio  e  la  propria  esperienza,  competenza  percepita  e  fiducia  accordata  dalle  persone  che  cercano  attivamente  il  proprio  parere  e  il  proprio  suggerimento  prima  di  prendere  decisioni  importanti  o  di  affrontare  problemi  complessi,  percezione  di  persona  affidabile,  competente,  esperta  e  punto  di  riferimento  autorevole  e  riconosciuto  da  molti  nel  proprio  ambiente  sociale  e  professionale) (Negativo:  rischio di sovraccarico  di  richieste  di  consiglio  e  potenziale  dispendio  di  tempo  e  di  energie  personali  nel  supportare  e  consigliare  gli  altrui  a  scapito  delle  proprie  priorità  e  dei  propri  compiti  e  obiettivi  personali  e  professionali,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  efficienza  e  gestione  del  tempo  e  per  la  capacità  di  delegare  e  di  non  farsi  sopraffare  eccessivamente  dalle  richieste  e  dalle  esigenze  altrui  a  scapito  del  proprio  benessere  e  della  propria  performance  personale  e  individuale)."
      },
      {
        value: "Punto di Riferimento per Tutti",
        text: "(Positivo:  massima autorevolezza  e  influenza  e  leadership  pienamente  riconosciuta  e  confermata  dal  ruolo  di  \"guru\"  o  figura  saggia  e  di  riferimento  per  tutti,  forte  competenza  percepita  e  fiducia  totale  accordata  dalle  persone  che  si  rivolgono  a  sé  come  fonte  privilegiata  e  indiscussa  di  consiglio,  guida  e  saggezza,  persona  percepita  come  leader  naturale,  carismatico,  influente  oltre  la  norma  e  punto  di  riferimento  indiscusso  e  riconosciuto  da  tutti  nel  proprio  ambiente  sociale  e  professionale  e  oltre) (Negativo:  potenziale eccessivo  accentramento  del  potere  decisionale  e  della  responsabilità  di  guida  e  di  consiglio  nelle  proprie  mani,  rischio  di  creare  dipendenza  altrui  dal  proprio  consiglio  e  dalla  propria  approvazione  e  di  non  favorire  lo  sviluppo  dell' autonomia  e  della  capacità  di  problem-solving  e  decision-making  indipendente  nei  membri  del  team  o  del  gruppo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  collaborazione  paritaria,  la  leadership  distribuita  e  la  valorizzazione  del  potenziale  e  delle  competenze  di  tutti  i  membri  del  team  o  del  gruppo  in  modo  equilibrato  e  sinergico  e  non  eccessivamente  centrato  e  polarizzato  intorno  alla  figura  carismatica  e  onnisciente  del  \"guru\"  o  leader  indiscusso  e  onnipresente)."
      }
    ],
    softSkill: "ProblemSolving, ComunicazioneEfficace",
    characteristics: "Potenziale di Leadership, Risoluzione dei Problemi, Competenza"
  },
  {
    num: 47,
    scenario: "Come la vivi il percorso per andare al lavoro tutti i giorni?",
    instructions: [
      "Immagine di una persona che medita pacificamente su un treno con un paesaggio rilassante che scorre fuori dal finestrino.",
      "Immagine di una persona che pedala con costanza su una bicicletta lungo una strada dritta e infinita.",
      "Immagine di un'auto bloccata in un ingorgo stradale, circondata da altre auto e gas di scarico.",
      "Immagine di una persona stipata in una carrozza della metropolitana sovraffollata durante l'ora di punta, con persone che spingono e si accalcano."
    ],
    captions: [
      "Relax e Concentrazione",
      "Lungo, Ma Si Fa",
      "Tempo Perso e Stress",
      "Un Incubo Insopportabile"
    ],
    options: [
      {
        value: "Relax e Concentrazione",
        text: "(Positivo: massima capacità di trasformare un momento potenzialmente stressante in un'opportunità di benessere e preparazione mentale al lavoro, approccio mindful e orientato alla gestione positiva dello stress quotidiano e alla valorizzazione del tempo personale anche durante gli spostamenti casa-lavoro) (Negativo: potenziale isolamento eccessivo e mancanza di interazione sociale e relazionale durante gli spostamenti, rischio di apparire distaccato, poco socievole o non interessato alle dinamiche interpersonali e alle opportunità di networking informale che potrebbero presentarsi durante il tragitto casa-lavoro, percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore apertura sociale, estroversione e capacità di creare connessioni umane e relazionali anche in situazioni casuali o informali come gli spostamenti quotidiani)."
      },
      {
        value: "Lungo, Ma Si Fa",
        text: "(Positivo: buona resilienza e capacità di adattamento alla routine e agli aspetti meno piacevoli o gratificanti del lavoro quotidiano, approccio pragmatico e orientato alla sopravvivenza e alla gestione delle difficoltà senza eccessive lamentele o reazioni negative eccessivamente prolungate nel tempo, accettazione realistica dei vincoli e delle limitazioni inevitabili della vita lavorativa e quotidiana) (Negativo: potenziale passività e rassegnazione di fronte a situazioni stressanti o poco soddisfacenti, rischio di non cercare attivamente soluzioni per migliorare la qualità della vita e di accontentarsi di situazioni solo tollerabili o \"sopportabili\" senza ambire a un vero benessere psicofisico e a un miglioramento concreto e significativo della propria esperienza quotidiana, percezione di approccio forse non sempre ottimizzato per la massima proattività, iniziativa personale e volontà di cambiamento e di miglioramento attivo e costruttivo della propria realtà lavorativa e personale)."
      },
      {
        value: "Tempo Perso e Stress",
        text: "(Negativo: percezione negativa e stressante della routine quotidiana e del tempo speso negli spostamenti casa-lavoro, fonte di stress quotidiano e di insoddisfazione persistente legata alla percezione di spreco di tempo e di energie preziose in attività percepite come inutili o non gratificanti e non valorizzanti del proprio tempo e delle proprie risorse personali) (Positivo: consapevolezza lucida e non negazionista del problema e del proprio disagio e insoddisfazione e potenziale spinta motivazionale al cambiamento e alla ricerca di soluzioni alternative e migliorative per la propria qualità della vita e per la gestione più efficiente e soddisfacente del proprio tempo e delle proprie energie quotidiane)."
      },
      {
        value: "Un Incubo Insopportabile",
        text: "(Negativo: stress estremo e ansia intensa legati alla percezione del percorso casa-lavoro come un \"incubo insopportabile\" e fonte di sofferenza quotidiana e persistente, forte impatto negativo sulla qualità della vita e sul benessere psicofisico complessivo e potenziale rischio di esaurimento emotivo e burnout a causa dello stress cronico e prolungato nel tempo) (Positivo: massima consapevolezza estrema e non eludibile del proprio disagio profondo e intollerabile e chiara indicazione inequivocabile della necessità urgente e improrogabile di un cambiamento radicale e significativo della propria situazione lavorativa e personale per ritrovare un minimo di benessere e qualità della vita sostenibile e vivibile nel lungo periodo)."
      }
    ],
    softSkill: "GestioneDelloStress, Resilienza",
    characteristics: "Preferenza per la Routine, Sensibilità allo Stress, Valori Equilibrio Vita-Lavoro"
  },
  {
    num: 48,
    scenario: "Ti offrono il lavoro della tua vita,  ma devi cambiare città e prendere meno soldi.  Che fai?",
    instructions: [
      "Immagine di una fortezza inamovibile e ben difesa.",
      "Immagine di una bussola che indica direzioni diverse in modo incerto.",
      "Immagine di una freccia che punta decisa verso un orizzonte lontano.",
      "Immagine di un mappamondo aperto e illuminato, che mostra diverse città del mondo."
    ],
    captions: [
      "Resto",
      "Ci Penso",
      "Parto",
      "Il Mondo - Casa Mia"
    ],
    options: [
      {
        value: "Resto",
        text: "(Positivo: massima valorizzazione della stabilità affettiva e dei legami personali e radicamento nel proprio contesto di vita,  priorità assoluta alla sicurezza emotiva e alla comfort zone affettiva e relazionale consolidata nel tempo,  approccio conservativo e orientato alla preservazione dei legami affettivi e alla continuità della propria esistenza senza stravolgimenti o cambiamenti radicali percepiti come rischiosi o destabilizzanti) (Negativo: potenziale rinuncia a opportunità professionali uniche e irripetibili e limitazione della propria crescita e realizzazione professionale per eccessivo attaccamento alla comfort zone e alla routine consolidata,  rischio di non cogliere occasioni di avanzamento di carriera significative e di rimanere bloccati in una situazione professionale statica o poco stimolante nel lungo periodo,  percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore audacia,  propensione al rischio e capacità di cogliere al volo opportunità uniche e irripetibili anche a costo di sacrificare la stabilità e la prevedibilità della propria vita personale e affettiva)."
      },
      {
        value: "Ci Penso",
        text: "(Positivo: prudenza e ponderazione nella valutazione dei pro e contro e approccio razionale e pragmatico nella decisione,  analisi attenta dei costi e dei benefici reali e potenziali del cambiamento proposto senza lasciarsi guidare solo dall' entusiasmo iniziale o da false promesse,  realismo nelle aspettative e volontà di non fare \"salti nel buio\" eccessivamente rischiosi o azzardati senza una valutazione accurata e approfondita di tutti i fattori in gioco) (Negativo: eccessiva cautela e indecisione e potenziale tendenza a procrastinare la decisione e a rimandare scelte importanti e significative per la propria carriera e il proprio futuro professionale,  rischio di lasciarsi sfuggire opportunità preziose e irripetibili per paura di cambiare o per eccessiva prudenza o attendismo,  percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore velocità decisionale,  coraggio e capacità di cogliere al volo occasioni uniche e irripetibili anche quando implicano un certo grado di rischio o incertezza iniziale)."
      },
      {
        value: "Parto",
        text: "(Positivo: massima priorità alla realizzazione professionale e alla crescita di carriera e determinazione ferrea nel cogliere al volo l'opportunità lavorativa percepita come \"il lavoro della vita\",  approccio dinamico,  proattivo e orientato al successo professionale che valorizza la sfida,  il cambiamento e la mobilità geografica come strumenti per raggiungere i propri obiettivi ambiziosi e sfidanti,  disponibilità totale al cambiamento e all' adattamento a nuovi contesti e nuove realtà geografiche e culturali pur di non lasciarsi sfuggire l'occasione professionale unica e irripetibile) (Negativo: potenziale squilibrio vita-lavoro e rischio di trascurare aspetti importanti della vita personale e affettiva per eccessiva focalizzazione sulla carriera e sul successo professionale a tutti i costi,  percezione di approccio forse non sempre ottimizzato per il benessere psicofisico e per una qualità della vita equilibrata e armoniosa che tenga conto anche delle esigenze affettive,  relazionali e personali oltre che di quelle puramente professionali e materiali,  rischio di sradicamento affettivo e di instabilità emotiva e relazionale a lungo termine a causa di eccessiva mobilità geografica e di priorità assoluta e totalizzante accordata alla carriera e al successo professionale in senso stretto)."
      },
      {
        value: "Il Mondo - Casa Mia",
        text: "(Positivo: massima apertura mentale e orizzonti globali e visione cosmopolita della vita e della carriera professionale,  approccio dinamico,  intraprendente e orientato all' esplorazione e alla scoperta di nuove culture,  nuovi contesti e nuove opportunità professionali in ogni angolo del mondo,  valorizzazione della mobilità internazionale e del cambiamento continuo come fonte di arricchimento personale e professionale e come stile di vita pienamente scelto e consapevolmente abbracciato,  percezione di persona aperta,  flessibile,  adattabile,  cosmopolita e non legata a radici territoriali o vincoli geografici specifici e limitanti) (Negativo: potenziale mancanza di radici e di stabilità affettiva e rischio di vivere una vita sradicata,  frenetica e superficiale senza veri legami profondi e duraturi con luoghi e persone specifiche,  percezione di approccio forse non sempre ottimizzato per la costruzione di relazioni affettive profonde e significative nel lungo periodo e per la creazione di un senso di appartenenza stabile e duraturo a una comunità o a un territorio specifico e definito,  rischio di isolamento emotivo e di superficialità relazionale a causa di eccessiva mobilità geografica e di un approccio alla vita e alla carriera percepito come eccessivamente \"nomade\", \"fluido\" e poco incline alla stabilità,  alla profondità e alla radicamento affettivo e territoriale)."
      }
    ],
    softSkill: "Adattabilita, PropensioneAlRischio",
    characteristics: "Adattabilità, Preferenza Geografica, Priorità di Carriera"
  },
  {
    num: 49,
    scenario: "Un nuovo collega di diversa cultura entra nel team. Come lo accogli di solito?",
    instructions: [
      "Immagine di un muro di mattoni che separa due spazi.",
      "Immagine di una stretta di mano frettolosa e distaccata.",
      "Immagine di una porta aperta che invita ad entrare.",
      "Immagine di un cerchio di persone che si tengono per mano, includendo una nuova persona nel cerchio."
    ],
    captions: [
      "Si Adatti",
      "Saluto Formale",
      "Presentazioni e Spiegazioni",
      "Integrazione Totale"
    ],
    options: [
      {
        value: "Si Adatti",
        text: "(Negativo:  massima chiusura  culturale  e  mancanza  totale  di  inclusività  e  di  sensibilità  verso  la  diversità  e  le  esigenze  di  integrazione  dei  nuovi  arrivati,  approccio  etnocentrico  e  poco  aperto  all' accoglienza  e  alla  valorizzazione  di  culture  diverse  dalla  propria,  percezione  di  persona  rigida,  poco  empatica,  non  inclusiva  e  non  sensibile  alle  tematiche  della  diversità  culturale  e  dell' integrazione  sociale  e  professionale) (Positivo:  massimo mantenimento  delle  proprie  routine  consolidate  e  evitamento  di  complicazioni  o  sconvolgimenti  legati  all' inserimento  di  nuove  figure  nel  team,  approccio  focalizzato  sulla  propria  comfort  zone  e  sulla  preservazione  della  propria  identità  culturale  senza  aperture  o  contaminazioni  eccessive  o  non  desiderate  verso  l' esterno,  massimizzazione  dell' efficienza  e  della  velocità  operativa  senza  perdite  di  tempo  in  attività  percepite  come  superflue  o  non  strettamente  necessarie  come  l' inclusione  e  l' integrazione  culturale  dei  nuovi  colleghi)."
      },
      {
        value: "Saluto Formale",
        text: "(Positivo:  rispetto delle  norme  sociali  minime  di  cortesia  e  di  buona  educazione  formale,  approccio  distaccato  e  non  invadente  che  non  forza  la  relazione  e  che  lascia  spazio  all' autonomia  e  all' iniziativa  del  nuovo  collega  nell' integrarsi  nel  team,  volontà  di  non  essere  eccessivamente  \"invadenti\"  o  \"Pressanti\"  nel  tentativo  di  integrare  forzatamente  o  artificiosamente  il  nuovo  arrivato  nel  gruppo) (Negativo:  inclusione superficiale  e  non  autentica  e  mancanza  di  un  vero  impegno  personale  e  proattivo  per  favorire  l' integrazione  reale  e  profonda  del  nuovo  collega  nel  team,  mantenimento  di  una  distanza  relazionale  e  di  una  freddezza  formale  che  potrebbe  far  sentire  il  nuovo  arrivato  non  pienamente  accolto  o  valorizzato  nel  suo  bisogno  di  integrazione  e  di  appartenenza  al  nuovo  contesto  lavorativo  e  sociale,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  calore  umano,  empatia,  sensibilità  culturale  e  volontà  di  creare  un  clima  di  lavoro  veramente  inclusivo,  accogliente  e  valorizzante  della  diversità  come  risorsa  e  non  solo  come  elemento  formale  o  superficiale  da  gestire  burocraticamente  o  con  mera  cortesia  di  facciata)."
      },
      {
        value: "Presentazioni e Spiegazioni",
        text: "(Positivo:  impegno concreto  e  attivo  per  favorire  l' inclusione  del  nuovo  collega  nel  team  e  per  metterlo  a  suo  agio  nel  nuovo  contesto  lavorativo,  accoglienza  calorosa  e  volontà  di  fornire  tutte  le  informazioni  e  le  spiegazioni  necessarie  per  facilitare  l' integrazione  e  l' ambientamento  del  nuovo  arrivato,  approccio  collaborativo  e  orientato  al  team  che  valorizza  l' importanza  dell' accoglienza  e  dell' inclusione  come  fattori  chiave  per  il  successo  collettivo  e  per  la  creazione  di  un  clima  di  lavoro  positivo  e  stimolante) (Negativo:  inclusione parziale  e  potenziale  superficialità  nella  comprensione  e  valorizzazione  delle  specificità  culturali  del  nuovo  collega,  rischio  di  fermarsi  a  un  livello  formale  di  accoglienza  e  di  integrazione  senza  approfondire  davvero  la  conoscenza  e  la  comprensione  della  cultura  di  provenienza  e  delle  esigenze  specifiche  del  nuovo  arrivato  in  quanto  persona  portatrice  di  una  diversità  culturale  che  va  valorizzata  e  non  solo  \"gestita\"  burocraticamente  o  con  mera  cortesia  formale,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  sensibilità  culturale,  empatia  profonda  e  volontà  di  creare  un  vero  dialogo  interculturale  e  di  integrazione  reciproca  e  bidirezionale  tra  culture  diverse  presenti  nel  team)."
      },
      {
        value: "Integrazione Totale",
        text: "(Positivo:  massimo impegno  personale  e  proattivo  per  favorire  una  vera  e  completa  integrazione  del  nuovo  collega  nel  team  e  per  valorizzare  appieno  la  sua  diversità  culturale  come  risorsa  e  valore  aggiunto  per  il  gruppo,  approccio  iper-inclusivo  e  orientato  all' accoglienza  totale  e  senza  riserve  e  alla  creazione  di  un  clima  di  lavoro  veramente  interculturale,  aperto,  stimolante  e  arricchente  per  tutti  i  membri  del  team,  volontà  di  superare  barriere  culturali  e  pregiudizi  e  di  promuovere  un  dialogo  autentico  e  profondo  tra  culture  diverse  presenti  nel  contesto  lavorativo) (Negativo:  potenziale focus  eccessivo  sull' inclusione  e  sulla  dimensione  culturale  che  potrebbe  far  passare  in  secondo  piano  altri  aspetti  importanti  del  lavoro  o  delle  dinamiche  del  team,  rischio  di  apparire  eccessivamente  \"invadente\"  o  \"Pressante\"  nel  tentativo  di  integrare  \"a  tutti  i  costi\"  il  nuovo  collega  e  di  forzare  eccessivamente  la  mano  per  creare  un  clima  interculturale  \"ideale\"  o  \"perfetto\"  ma  forse  non  sempre  spontaneo  o  naturale,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  spontaneità,  naturalezza  e  semplicità  delle  relazioni  interpersonali  e  per  un  equilibrio  armonioso  tra  attenzione  all' inclusione  e  valorizzazione  della  diversità  e  altre  priorità  o  esigenze  del  contesto  lavorativo  specifico)."
      }
    ],
    softSkill: "DiversitaEInclusione, RelazioniInterpersonali",
    characteristics: "Inclusività, Empatia, Apertura Culturale"
  },
  {
    num: 50,
    scenario: "In riunione, un collega fa una battuta razzista. Come reagisci?",
    instructions: [
      "Immagine di una maschera che ride, nascondendo la vera reazione.",
      "Immagine di una statua di sale che si scioglie lentamente.",
      "Immagine di un interruttore della luce che viene spento bruscamente.",
      "Immagine di un megafono che amplifica una voce decisa e ferma."
    ],
    captions: [
      "Risata Educata",
      "Silenzio Imbarazzato",
      "Cambio Discorso, Evito Problemi",
      "Non lo sopporto,  Lo Dico Chiaro e Tondo"
    ],
    options: [
      {
        value: "Risata Educata",
        text: "(Negativo: omertà e  mancanza di reazione  di fronte a  comportamenti  inaccettabili  e  discriminatori,  perpetuazione  silenziosa  di  pregiudizi  e  stereotipi  dannosi,  mancato supporto  ai  valori  di  inclusione  e  rispetto  universale  della  dignità  umana,  percezione  di  persona  indifferente,  egoista  e  non  affidabile  in  contesti  che  richiederebbero  coraggio  civile  e  presa  di  posizione  netta  e  inequivocabile  contro  ogni  forma  di  razzismo  e  discriminazione) (Positivo: mantenimento dell' armonia  apparente  del  gruppo  e  del  clima  di  lavoro  formalmente  disteso  e  non  conflittuale,  evitamento  del  conflitto  immediato  e  di  rogne  personali,  massimizzazione  della  sicurezza  personale  e  dell' evitamento  di  problemi  e  conseguenze  negative  tangibili  e  immediate  per  sé  stessi,  approccio  prudente  e  conservativo  che  privilegia  la  comfort  zone  personale  e  la  non  esposizione  diretta  a  rischi  o  conseguenze  negative  immediate)."
      },
      {
        value: "Silenzio Imbarazzato",
        text: "(Negativo: passività e  omissione  di  soccorso  di  fronte  a  comportamenti  razzisti  e  discriminatori  che  richiederebbero  un  intervento  attivo  e  tempestivo  per  essere  contrastati  e  condannati  senza  ambiguità,  mancanza  di  coraggio  civile  e  di  assertività  nel  prendere  posizione  apertamente  contro  l' ingiustizia  e  la  discriminazione,  percezione  di  persona  non  pienamente  affidabile  nel  supportare  e  difendere  i  valori  fondamentali  di  equità,  rispetto  e  inclusione  in  modo  concreto  e  tangibile) (Positivo: consapevolezza  del  problema  e  disapprovazione  implicita  e  non  verbale  della  battuta  razzista  (seppur  passiva  e  non  esplicita  o  assertiva),  minima  espressione  di  disagio  silenzioso  che  segnala  comunque  una  certa  sensibilità  etica  e  consapevolezza  del  problema  pur  senza  esporsi  attivamente  e  direttamente  e  senza  rischiare  il  conflitto  aperto,  approccio  cauto  e  non  confrontazionale  che  evita  rischi  personali  e  conflitti  diretti  e  plateali)."
      },
      {
        value: "Cambio Discorso, Evito Problemi",
        text: "(Positivo: tentativo  di  smorzare  la  tensione  e  di  alleggerire  il  clima  di  lavoro  con  un  approccio  comunicativo  indiretto  e  non  conflittuale,  volontà  di  non  esacerbare  il  conflitto  apertamente  e  in  modo  frontale  e  di  mantenere  un  clima  di  lavoro  formalmente  collaborativo  e  non  ostile  o  polarizzato,  approccio  diplomatico  e  moderato  che  cerca  di  mediare  tra  diverse  esigenze  e  sensibilità  senza  prendere  posizioni  troppo  nette  o  radicali  che  potrebbero  dividere  o  polarizzare  eccessivamente  il  gruppo) (Negativo: inefficacia  nel  contrastare  direttamente  e  apertamente  il  comportamento  razzista  e  discriminatorio  e  rischio  di  non  fermare  o  scoraggiare  comportamenti  simili  in  futuro  per  mancanza  di  una  presa  di  posizione  chiara  e  inequivocabile,  mancata  condanna  esplicita  e  diretta  della  battuta  razzista  e  rischio  di  legittimare  implicitamente  comportamenti  inaccettabili  con  il  proprio  silenzio-assenso  di  fatto,  percezione  di  approccio  forse  non  pienamente  efficace  nel  promuovere  un  vero  cambiamento  culturale  profondo  e  radicale  nel  team  e  nell' organizzazione  nel  lungo  periodo  in  termini  di  inclusione,  rispetto  e  valorizzazione  della  diversità)."
      },
      {
        value: "Non lo sopporto,  Lo Dico Chiaro e Tondo",
        text: "(Positivo: forte e  chiaro  impegno  personale  per  l' etica,  la  giustizia  sostanziale  e  i  valori  di  inclusione  e  rispetto  universale,  difesa  attiva  e  senza  ambiguità  dei  più  deboli  e  di  chi  viene  ingiustamente  discriminato  o  offeso,  affermazione  di  valori  etici  non  negoziabili  di  rispetto  e  parità  di  dignità  umana  e  condanna  esplicita  e  inequivocabile  di  ogni  forma  di  razzismo  e  discriminazione  manifesta) (Negativo: potenziale generazione  di  conflitti  diretti  e  aperti  e  creazione  di  un  clima  di  lavoro  teso  o  polarizzato,  rischio  di  essere  percepito  come  eccessivamente  rigido  o  moralizzatore  e  poco  incline  al  compromesso  o  alla  mediazione  anche  quando  non  strettamente  necessario  o  non  utile  ai  fini  della  vera  soluzione  pratica  e  concreta  del  problema  in  ottica  di  massima  efficacia  e  pragmatismo  complessivo  nel  lungo  periodo  (che  potrebbe  anche  richiedere  talvolta  strategie  più  sfumate,  indirette  o  diplomatiche  per  raggiungere  un  vero  cambiamento  sostenibile  nel  tempo  a  livello  sistemico  e  culturale  profondo  e  non  solo  immediato  e  apparente  in  superficie  con  la  pura  forza  assertiva  diretta  e  frontale  immediata)))."
      }
    ],
    softSkill: "DiversitaEInclusione, CoraggioCivile",
    characteristics: "Consapevolezza Diversità, Condotta Etica, Assertività"
  }
];
