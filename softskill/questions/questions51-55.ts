import { Question } from "../types";

export const questions51to55: Question[] = [
  {
    num: 51,
    scenario: "Scegli un ristorante per la pausa pranzo con tutti i tuoi colleghi",
    instructions: [
      "Immagine di un ristorante di lusso, elegante e con prezzi elevati, magari con una sola persona seduta.",
      "Immagine di un fast food anonimo e standardizzato,  con poca atmosfera.",
      "Immagine di un ristorantino familiare accogliente e informale,  con tavoli apparecchiati in modo semplice.",
      "Immagine di un ristorante vegano/vegetariano luminoso e accogliente,  con un menu che indica opzioni senza glutine e per diverse intolleranze."
    ],
    captions: [
      "Ristorante Stellato",
      "Fast Food",
      "Ristorantino Familiare",
      "Vegano/Vegetariano"
    ],
    options: [
      {
        value: "Ristorante Stellato",
        text: "(Positivo:  massima attenzione alla qualità  e  all' eccellenza  culinaria  e  ricerca  di  un' esperienza  gastronomica  di  alto  livello  anche  nella  pausa  pranzo,  valorizzazione  del  gusto  personale  e  della  propria  idea  di  qualità  senza  compromessi  o  mediazioni  eccessive,  standard  elevati  e  volontà  di  offrire  il  meglio  anche  ai  colleghi  (almeno  secondo  i  propri  criteri  personali  di  massima  qualità  e  di  lusso)) (Negativo:  potenziale esclusività  e  mancanza  di  attenzione  al  budget  e  alle  esigenze  economiche  di  tutti  i  colleghi,  rischio  di  non  incontrare  i  gusti  e  le  preferenze  di  tutti  e  di  apparire  snob,  elitario  o  poco  sensibile  alla  diversità  di  gusti  e  di  possibilità  economiche  presenti  nel  team,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  inclusività,  attenzione  alla  diversità  e  capacità  di  mediazione  e  compromesso  per  trovare  soluzioni  condivise  e  soddisfacenti  per  tutti  e  non  solo  per  una  minoranza  o  per  i  gusti  e  le  priorità  personali  di  chi  decide  per  tutti  senza  consultare  o  coinvolgere  attivamente  gli  altri  nella  scelta)."
      },
      {
        value: "Fast Food",
        text: "(Positivo:  massima efficienza  e  velocità  e  ottimizzazione  del  tempo  della  pausa  pranzo  per  massimizzare  il  tempo  effettivo  da  dedicare  al  lavoro,  approccio  pragmatico  e  orientato  all' obiettivo  primario  del  pranzo  come  mera  funzione  fisiologica  e  non  come  occasione  di  socializzazione  o  di  piacere  estetico  o  gastronomico,  massimizzazione  della  semplicità,  della  rapidità  e  della  linearità  della  pausa  pranzo  senza  perdere  tempo  in  fronzoli  o  complicazioni  eccessive) (Negativo:  mancanza di  convivialità  e  di  creazione  di  un  ambiente  piacevole  e  rilassante  per  la  pausa  pranzo,  rischio  di  trascurare  l' aspetto  sociale  e  relazionale  della  pausa  pranzo  come  occasione  di  team-building  informale  e  di  rafforzamento  dei  legami  interpersonali  tra  colleghi,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  valorizzerebbero  maggiormente  la  qualità  della  vita  lavorativa,  il  benessere  psicofisico  dei  dipendenti  e  la  creazione  di  un  clima  di  lavoro  positivo,  stimolante  e  orientato  alla  collaborazione  e  alla  coesione  del  team  nel  suo  complesso)."
      },
      {
        value: "Ristorantino Familiare",
        text: "(Positivo:  attenzione all' atmosfera  conviviale  e  accogliente  e  ricerca  di  un  ambiente  rilassato,  informale  e  \"familiare\"  dove  i  colleghi  possano  sentirsi  a  proprio  agio  e  socializzare  in  modo  spontaneo  e  naturale,  approccio  inclusivo  \"nella  normalità\"  che  mira  a  creare  un  clima  di  lavoro  positivo  e  collaborativo  senza  eccessive  pretese  di  originalità  o  di  sofisticatezza  o  di  inclusività  spinta  o  eccessivamente  \"ideologica\",  valorizzazione  della  semplicità,  della  genuinità  e  dell' autenticità  delle  relazioni  umane  anche  in  ambito  lavorativo) (Negativo:  potenziale mancanza  di  originalità  o  di  attenzione  a  esigenze  alimentari  particolari  o  specifiche  di  alcuni  colleghi  con  intolleranze  o  scelte  etiche  o  religiose  specifiche,  rischio  di  non  soddisfare  pienamente  chi  cerca  esperienze  culinarie  più  originali,  innovative  o  sofisticate  o  chi  invece  ha  esigenze  alimentari  particolari  che  richiederebbero  maggiore  attenzione  e  sensibilità  nella  scelta  del  ristorante  e  del  menu,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  inclusività  e  per  la  valorizzazione  della  diversità  anche  in  ambito  alimentare  e  gastronomico)."
      },
      {
        value: "Vegano/Vegetariano",
        text: "(Positivo:  massima inclusività  e  attenzione  alle  esigenze  alimentari  di  tutti  e  in  particolare  verso  chi  ha  scelte  specifiche  per  motivi  etici,  religiosi,  di  salute  o  di  altro  tipo,  approccio  sensibile  e  rispettoso  della  diversità  e  delle  preferenze  individuali  anche  in  ambito  alimentare  e  gastronomico,  volontà  di  creare  un  ambiente  di  lavoro  inclusivo  e  accogliente  per  tutti  senza  escludere  o  penalizzare  nessuno  in  base  alle  proprie  scelte  o  esigenze  alimentari  specifiche  e  personali) (Negativo:  potenziale limitazione  della  scelta  e  del  menu  per  chi  non  apprezza  particolarmente  la  cucina  vegana  o  vegetariana  o  per  chi  invece  preferirebbe  una  cucina  più  tradizionale  o  meno  orientata  a  scelte  etiche  o  ideologiche  specifiche,  rischio  di  essere  percepito  come  eccessivamente  \"ideologico\"  o  \"militante\"  nella  scelta  del  ristorante  e  di  imporre  indirettamente  le  proprie  scelte  alimentari  personali  anche  a  chi  non  le  condivide  pienamente  o  non  le  considera  prioritarie  o  indispensabili  in  ambito  lavorativo  e  sociale,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  neutralità,  flessibilità  e  capacità  di  mediazione  e  compromesso  per  trovare  soluzioni  che  soddisfino  il  maggior  numero  possibile  di  persone  senza  imporre  scelte  troppo  radicali  o  ideologiche  che  potrebbero  dividere  o  polarizzare  eccessivamente  il  gruppo  o  il  team  di  lavoro)."
      }
    ],
    softSkill: "RelazioniInterpersonali, Empatia",
    characteristics: "Lavoro di Squadra, Empatia, Inclusività, Stile Decisionale"
  },
  {
    num: 52,
    scenario: " Una collega subisce molestie verbali pesanti da un altro collega. Come reagisci?",
    instructions: [
      "Immagine di una mano tesa, pronta ad afferrare un'altra mano in difficoltà.",
      "Immagine di una mano che porge una spazzola per \"spazzare via\" lo sporco, minimizzando il problema.",
      "Immagine di due mani che si stringono di nascosto sotto un tavolo,  accordo informale.",
      "Immagine di una mano che alza un cartello di \"stop\" con forza,  segnalazione formale."
    ],
    captions: [
      "Scelgo di Aiutare",
      "Scelgo di Minimizzare",
      "Scelgo la Gestione Informale",
      "Scelgo la Segnalazione Formale"
    ],
    options: [
      {
        value: "Scelgo di Aiutare",
        text: "(Positivo:  forte empatia e  spiccata  sensibilità  verso  la  vittima  e  la  sua  sofferenza,  massima solidarietà  femminile  e  impegno  personale  e  concreto  nell' offrire  aiuto  e  supporto  attivo  alla  collega  molestata,  approccio  proattivo  e  orientato  all' azione  immediata  e  diretta  per  soccorrere  e  proteggere  chi  è  in  difficoltà  e  vittima  di  ingiustizia  e  prepotenza  altrui) (Negativo:  potenziale impulsività  e  rischio  di  reagire  in  modo  non  sempre  strategico  o  efficace  nel  lungo  periodo,  mancanza  di  valutazione  pienamente  ponderata  di  tutte  le  conseguenze  possibili  del  proprio  intervento  impulsivo  e  non  sempre  mirato  o  ottimizzato  per  la  massima  efficacia  e  pragmatismo  complessivo  nella  gestione  di  situazioni  complesse  e  delicate  come  le  molestie  verbali  persistenti  e  non  sempre  facili  da  provare  o  da  contrastare  con  la  sola  buona  volontà  e  l' aiuto  diretto  e  immediato  alla  vittima  in  quanto  tale  senza  un  piano  d' azione  più  articolato,  strutturato  e  sostenibile  nel  tempo  a  livello  sistemico  e  organizzativo  complessivo)."
      },
      {
        value: "Scelgo di Minimizzare",
        text: "(Negativo:  grave omissione  di  soccorso  e  mancato  supporto  alla  vittima  di  molestie  verbali  pesanti,  completa  deresponsabilizzazione  di  fronte  a  comportamenti  gravi  e  inaccettabili  eticamente  e  professionalmente,  perpetuazione  di  dinamiche  tossiche  e  omertose  che  danneggiano  la  vittima  e  l' intero  clima  di  lavoro  e  la  cultura  aziendale  nel  suo  complesso) (Positivo:  massimo evitamento  di  rogne  personali  e  di  coinvolgimento  diretto  in  dinamiche  conflittuali  o  problematiche  altrui,  mantenimento  di  un  clima  di  lavoro  apparentemente  tranquillo  e  non  conflittuale  e  di  una  posizione  neutrale  e  non  compromettente  o  rischiosa  per  la  propria  posizione  personale  e  professionale,  approccio  egoista  e  opportunistico  che  privilegia  la  propria  comfort  zone  e  l' evitamento  di  problemi  e  responsabilità  altrui  anche  a  costo  di  sacrificare  l' etica,  la  giustizia  e  la  solidarietà  umana  e  professionale  verso  chi  è  vittima  di  prepotenze  e  ingiustizie  sul  posto  di  lavoro)."
      },
      {
        value: "Scelgo la Gestione Informale",
        text: "(Positivo:  tentativo di  risolvere  il  problema  in  modo  discreto,  interno  e  meno  traumatico  per  tutte  le  parti  coinvolte,  approccio  pragmatico  e  orientato  alla  ricerca  di  una  soluzione  rapida  e  \"interna\"  alla  dinamica  relazionale  problematica  senza  coinvolgere  eccessivamente  l' azienda  o  le  risorse  umane  con  procedure  formali  e  burocratiche  percepite  come  eccessivamente  rigide  o  complicate,  volontà  di  privilegiare  il  dialogo  e  la  mediazione  informale  e  non  confrontazionale  per  risolvere  il  conflitto  e  ripristinare  un  clima  di  lavoro  sereno  e  collaborativo) (Negativo:  potenziale inefficacia  nel  risolvere  il  problema  alla  radice  e  di  non  tutelare  pienamente  e  adeguatamente  la  vittima  di  molestie  verbali  persistenti  e  pesanti,  rischio  di  sottovalutare  la  gravità  oggettiva  del  comportamento  molesto  e  di  non  dare  un  segnale  forte  e  chiaro  contro  ogni  forma  di  molestia  verbale  e  di  prepotenza  sul  posto  di  lavoro,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  garantire  la  massima  tutela  e  protezione  della  vittima  e  per  prevenire  efficacemente  e  in  modo  sostenibile  nel  tempo  la  ripetizione  di  comportamenti  molesti  simili  in  futuro  a  livello  sistemico  e  organizzativo  complessivo)."
      },
      {
        value: "Segnalo Subito all'HR",
        text: "(Positivo:  massima tutela  e  protezione  della  vittima  e  attivazione  immediata  di  procedure  formali  e  strutturate  per  gestire  la  situazione  in  modo  professionale,  trasparente  e  secondo  le  normative  aziendali  e  legali  vigenti,  ricorso  a  canali  ufficiali  e  a  figure  professionali  competenti  e  preposte  per  la  gestione  di  questioni  delicate  e  complesse  come  le  molestie  verbali  e  il  mobbing  sul  posto  di  lavoro,  garanzia  di  un  intervento  strutturato,  trasparente  e  formalizzato  che  mira  a  fare  chiarezza,  a  fare  giustizia  e  a  prevenire  la  ripetizione  di  comportamenti  simili  in  futuro  a  livello  aziendale  e  sistemico) (Negativo:  potenziale irrigidimento  del  clima  aziendale  e  burocratizzazione  eccessiva  della  gestione  del  problema  con  procedure  formali  e  \"fredde\"  che  potrebbero  non  tenere  pienamente  conto  della  dimensione  umana  e  relazionale  della  vicenda  e  delle  esigenze  specifiche  e  personali  della  vittima,  rischio  di  creare  tensioni  e  polarizzazioni  nel  team  e  nell' ambiente  di  lavoro  a  causa  della  \"formalizzazione\"  eccessiva  e  \"pubblicizzazione\"  della  questione  con  procedure  interne  aziendali  e  eventualmente  anche  legali  o  sindacali  che  potrebbero  essere  percepite  come  eccessivamente  rigide,  burocratiche  o  \"punitive\"  e  non  sempre  ottimizzate  per  la  massima  efficacia  e  per  la  vera  e  profonda  risoluzione  del  problema  a  livello  umano  e  relazionale  prima  ancora  che  giuridico  o  formale  e  burocratico  in  senso  stretto)."
      }
    ],
    softSkill: "TematicheSociali, RelazioniImproprie",
    characteristics: "Scelta Etica, Affrontare Molestie, Assertività"
  },
  {
    num: 53,
    scenario: "Quanto ti senti osservato e \"sotto esame\" dagli altri, di solito?",
    instructions: [
      "Immagine di mani che piantano un seme con gesto sicuro e determinato, ignorando l'ambiente circostante.",
      "Immagine di mani che lavorano a maglia in modo fluido e regolare,  con un'occhiata occasionale all'esterno.",
      "Immagine di mani che si stringono nervosamente e si nascondono sotto un tavolo.",
      "Immagine di mani completamente bloccate e immobili,  come statue di cera."
    ],
    captions: [
      "Scelgo di Ignorare gli Sguardi",
      "Scelgo di Essere Consapevole, Ma Non Ossessionato",
      "Scelgo di Nascondermi dal Giudizio",
      "Scelgo la Paralisi Totale"
    ],
    options: [
      {
        value: "Scelgo di Ignorare gli Sguardi",
        text: "(Positivo: massima indipendenza dal giudizio altrui e  forte autonomia  e  autodeterminazione, approccio  focalizzato  sui  propri  obiettivi  e  priorità  senza  distrazioni  o  condizionamenti  esterni,  valorizzazione  della  libertà  di  azione  e  della  capacità  di  seguire  la  propria  strada  senza  farsi  influenzare  eccessivamente  dalle  opinioni  o  dalle  aspettative  altrui) (Negativo: potenziale chiusura  al  feedback  e  mancanza  di  sensibilità  verso  il  contesto  sociale  e  le  dinamiche  relazionali  interpersonali,  rischio  di  apparire  distaccato,  poco  empatico  o  eccessivamente  concentrato  su  sé  stessi  e  sui  propri  affari  senza  considerare  adeguatamente  le  esigenze,  le  aspettative  o  i  punti  di  vista  altrui,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  collaborazione,  lavoro  di  squadra  e  capacità  di  integrare  il  proprio  operato  con  quello  degli  altri  in  modo  sinergico  e  coordinato)."
      },
      {
        value: "Scelgo di Essere Consapevole, Ma Non Ossessionato",
        text: "(Positivo:  consapevolezza sociale  equilibrata  e  capacità  di  gestire  il  giudizio  altrui  senza  farsi  né  paralizzare  né  ossessionare  eccessivamente,  approccio  moderato  e  realistico  che  valorizza  la  presenza  scenica  senza  eccessi  di  protagonismo  o  autocelebrazione,  persona percepita come  sicura di sé  quanto basta,  competente,  affidabile  e  non  bisognosa  di  eccessiva  attenzione  o  applausi  esterni  per  validare  la  propria  autostima  e  il  proprio  valore  professionale) (Negativo:  potenziale eccessiva  attenzione  all' opinione  altrui  e  rischio  di  non  essere  pienamente  spontanei  o  autentici  per  eccessiva  preoccupazione  di  non  dispiacere  o  di  non  essere  giudicati  negativamente,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  libertà  di  espressione  personale,  per  l' originalità,  per  la  capacità  di  pensare  \"fuori  dagli  schemi\"  e  di  non  conformarsi  eccessivamente  alle  aspettative  sociali  prevalenti  o  al  giudizio  altrui  in  modo  acritico  o  passivo)."
      },
      {
        value: "Scelgo di Nascondermi dal Giudizio",
        text: "(Positivo:  forte ricerca  di  privacy  e  di  discrezione  e  valorizzazione  della  riservatezza  e  dell' intimità  personale,  approccio  introspettivo  e  focalizzato  sul  proprio  mondo  interiore  e  sulla  propria  vita  privata  lontano  da  sguardi  indiscreti  o  giudizi  esterni  non  desiderati,  gestione  dell' ansia  sociale  attraverso  l' evitamento  dell' esposizione  pubblica  e  la  ricerca  di  ambienti  protetti  e  non  eccessivamente  stimolanti  o  \"giudicanti\") (Negativo: potenziale isolamento  sociale  e  chiusura  verso  l' esterno  e  verso  nuove  relazioni  e  opportunità  sociali  e  professionali,  rischio  di  auto-limitarsi  e  di  non  sfruttare  appieno  il  proprio  potenziale  e  le  proprie  capacità  per  paura  del  giudizio  altrui  o  per  eccessiva  preoccupazione  di  essere  osservati  o  \"messi  sotto  esame\"  dagli  altri,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  visibilità,  estroversione,  capacità  di  fare  networking  e  di  gestire  con  sicurezza  di  sé  l' esposizione  pubblica  e  il  confronto  con  il  giudizio  altrui  anche  quando  non  pienamente  positivo  o  benevolo)."
      },
      {
        value: "Scelgo la Paralisi Totale",
        text: "(Negativo:  forte ansia sociale  paralizzante  e  blocco  emotivo  di  fronte  alla  percezione  di  essere  costantemente  osservati  e  giudicati  dagli  altri,  bassa  autostima  e  vulnerabilità  estrema  al  giudizio  altrui  percepito  come  annientante  e  distruttivo  per  la  propria  immagine  e  per  il  proprio  valore  personale,  approccio  iper-emotivo  e  iper-reattivo  alle  dinamiche  sociali  e  alla  percezione  del  giudizio  altrui  che  impedisce  di  agire  in  modo  lucido,  razionale  e  proattivo  e  che  genera  un  senso  di  impotenza  e  di  paralisi  operativa  e  decisionale) (Positivo:  consapevolezza estrema  e  lucida  della  propria  ansia  sociale  e  del  proprio  disagio  profondo  e  paralizzante  di  fronte  al  giudizio  altrui,  potenziale  campanello  d' allarme  utile  per  affrontare  le  proprie  paure  in  modo  costruttivo  e  cercare  supporto  esterno  per  superare  il  blocco  emotivo  e  la  paralisi  psicologica  causati  dalla  paura  del  futuro  e  dall' incertezza  esistenziale, *ma  positivo  solo  come  punto  di  partenza  per  un  cambiamento  attivo  e  costruttivo  e  non  come  atteggiamento  stabile  e  persistente  nel  tempo  di  fronte  al  futuro  inevitabilmente  incerto  per  tutti  gli  esseri  umani)."
      }
    ],
    softSkill: "FiduciaInSeStessi, Autocritica",
    characteristics: "Scelta Emotiva, Gestione dell'Ansia Sociale, Fiducia in Sé"
  },
  {
    num: 54,
    scenario: "Lavoro da sogno o stabilità affettiva?",
    instructions: [
      "Immagine di una casa accogliente e familiare, interni rassicuranti.",
      "Immagine di una persona pensierosa che guarda un orizzonte lontano, indecisa.",
      "Immagine di un biglietto del treno pronto per essere timbrato, simbolo di partenza.",
      "Immagine di una bussola che indica tutte le direzioni cardinali contemporaneamente, libertà totale."
    ],
    captions: [
      "Casa è Casa",
      "Ci Penso Su",
      "Nuove Avventure",
      "Il Mondo Mi Aspetta"
    ],
    options: [
      {
        value: "Casa è Casa",
        text: "(Positivo:  massima priorità  accordata  alla  stabilità  affettiva,  alla  sicurezza  emotiva  e  alla  preservazione  dei  legami  personali  e  familiari  considerati  valori  primari  e  fondamentali  per  il  proprio  benessere  e  per  la  propria  qualità  della  vita,  forte  attaccamento  al  proprio  luogo  di  origine  e  al  proprio  contesto  di  vita  familiare  e  sociale  consolidato  nel  tempo,  approccio  prudente  e  orientato  alla  sicurezza  e  alla  continuità  senza  salti  nel  buio  o  cambiamenti  radicali  percepiti  come  eccessivamente  rischiosi  o  destabilizzanti) (Negativo:  potenziale rinuncia  a  opportunità  professionali  uniche  e  irripetibili  e  limitazione  della  propria  crescita  e  realizzazione  professionale  per  eccessiva  paura  del  cambiamento  o  per  attaccamento  eccessivo  alla  comfort  zone  affettiva  e  relazionale  pre-esistente,  rischio  di  non  sfruttare  appieno  il  proprio  potenziale  e  le  proprie  ambizioni  professionali  e  di  rimanere  bloccati  in  una  situazione  lavorativa  non  pienamente  soddisfacente  o  stimolante  nel  lungo  periodo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  audacia,  ambizione,  propensione  al  rischio  e  capacità  di  cogliere  al  volo  opportunità  uniche  e  irripetibili  anche  a  costo  di  sacrificare  la  stabilità  e  la  prevedibilità  della  propria  vita  personale  e  affettiva)."
      },
      {
        value: "Ci Penso Su",
        text: "(Positivo:  approccio razionale  e  ponderato  e  volontà  di  valutare  attentamente  tutti  i  pro  e  i  contro  prima  di  prendere  una  decisione  importante  e  non  affrettata  o  impulsiva,  ricerca  di  un  equilibrio  ragionevole  tra  esigenze  professionali  e  personali  e  tra  desiderio  di  cambiamento  e  bisogno  di  stabilità  e  sicurezza,  prudenza  e  realismo  nel  valutare  le  implicazioni  concrete  di  una  scelta  che  potrebbe  avere  un  impatto  significativo  sulla  propria  vita  e  su  quella  dei  propri  cari) (Negativo:  potenziale indecisione  e  procrastinazione  eccessiva  nel  prendere  una  decisione  importante  e  urgente,  rischio  di  perdere  l' opportunità  per  eccessiva  esitazione  o  attendismo  e  di  rimanere  bloccati  in  una  fase  di  stallo  e  di  incertezza  prolungata  e  non  sempre  utile  o  proficua,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  velocità  decisionale,  intuito  e  capacità  di  \"fiutare\"  l' affare  e  di  cogliere  al  volo  le  occasioni  uniche  e  irripetibili  senza  troppe  analisi  e  ponderazioni  eccessivamente  prolungate  o  paralizzanti)."
      },
      {
        value: "Nuove Avventure",
        text: "(Positivo:  massima priorità  accordata  alla  realizzazione  professionale  e  alla  crescita  di  carriera  e  forte  attrazione  verso  le  novità,  le  sfide  stimolanti  e  le  opportunità  di  cambiamento  e  di  avventura  professionale  e  personale,  approccio  dinamico,  proattivo  e  orientato  al  futuro  e  alla  massima  espansione  del  proprio  potenziale  e  delle  proprie  ambizioni  professionali  anche  a  costo  di  sacrificare  la  stabilità  e  la  routine  consolidata) (Negativo:  potenziale sottovalutazione  dell' impatto  del  cambiamento  radicale  sulla  vita  affettiva  e  personale  e  rischio  di  agire  in  modo  eccessivamente  impulsivo  e  non  pienamente  consapevole  delle  conseguenze  a  lungo  termine  delle  proprie  scelte  e  decisioni,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  il  benessere  psicofisico  e  per  una  qualità  della  vita  equilibrata  e  armoniosa  che  tenga  conto  anche  delle  esigenze  affettive,  relazionali  e  personali  oltre  che  di  quelle  puramente  professionali  e  materiali,  rischio  di  sradicamento  affettivo  e  di  instabilità  emotiva  e  relazionale  nel  lungo  periodo  a  causa  di  scelte  troppo  frettolose  o  poco  ponderate  e  non  sempre  funzionali  al  vero  benessere  personale  e  alla  felicità  autentica  e  duratura)."
      },
      {
        value: "Il Mondo Mi Aspetta",
        text: "(Positivo:  massima apertura  mentale  e  visione  globale  e  cosmopolita  della  vita  e  della  carriera  professionale,  approccio  dinamico,  intraprendente  e  iper-adattabile  che  valorizza  la  mobilità  internazionale,  il  cambiamento  continuo  e  l' esplorazione  di  nuove  culture  e  nuovi  contesti  come  fonti  di  arricchimento  personale  e  professionale  senza  limiti  o  vincoli  geografici  o  territoriali  precostituiti,  massima  priorità  accordata  alla  realizzazione  professionale  e  alla  ricerca  del  \"lavoro  giusto\"  ovunque  esso  si  trovi  nel  mondo) (Negativo:  potenziale mancanza  di  radicamento  e  di  stabilità  affettiva  e  rischio  di  vivere  una  vita  eccessivamente  nomade,  frenetica  e  superficiale  senza  veri  legami  profondi  e  duraturi  con  luoghi  e  persone  specifiche,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  costruzione  di  relazioni  affettive  profonde  e  significative  nel  lungo  periodo  e  per  la  creazione  di  un  senso  di  appartenenza  stabile  e  duraturo  a  una  comunità  o  a  un  territorio  specifico  e  definito,  rischio  di  isolamento  emotivo  e  di  superficialità  relazionale  a  causa  di  un  approccio  alla  vita  e  alla  carriera  percepito  come  eccessivamente  individualista,  sradicato  e  poco  incline  alla  stabilità,  alla  profondità  e  al  radicamento  affettivo  e  territoriale)."
      }
    ],
    softSkill: "Adattabilita, PropensioneAlRischio",
    characteristics: "Adattabilità, Preferenza Geografica, Priorità di Carriera"
  },
  {
    num: 55,
    scenario: "Che \"stagione\" ti sembra di vivere?",
    instructions: [
      "Immagine di un campo di grano dorato e rigoglioso al sole,  simbolo di abbondanza e prosperità.",
      "Immagine di un cielo sereno e limpido,  senza nuvole,  calma e stabilità.",
      "Immagine di un cielo leggermente nuvoloso,  qualche nube passeggera,  incertezza moderata.",
      "Immagine di un cielo tempestoso e scuro,  fulmini e tempesta in arrivo,  difficoltà e crisi."
    ],
    captions: [
      "Estate",
      "Primavera",
      "Autunno",
      "Inverno"
    ],
    options: [
      {
        value: "Estate",
        text: "(Positivo:  massimo ottimismo  e  fiducia  nel  futuro  e  nelle  proprie  capacità  di  successo  e  realizzazione,  percezione  di  prosperità,  abbondanza  e  di  un  periodo  di  piena  fioritura  e  di  raccolta  dei  frutti  del  proprio  lavoro  e  dei  propri  sforzi,  visione  rosea  e  rassicurante  del  domani  e  del  proprio  futuro  economico  e  professionale  percepito  come  radioso  e  pieno  di  promesse  e  di  opportunità) (Negativo:  eccessivo ottimismo  e  potenziale  ingenuità  e  sottovalutazione  dei  rischi  e  delle  sfide  future  inevitabili,  illusione  di  una  prosperità  eterna  e  non  realistica  e  mancanza  di  preparazione  e  di  strategie  preventive  per  affrontare  eventuali  \"inverni\"  o  momenti  di  difficoltà  o  crisi  economiche  e  professionali  che  potrebbero  presentarsi  in  futuro  in  modo  inatteso  o  improvviso)."
      },
      {
        value: "Primavera",
        text: "(Positivo:  senso di equilibrio  e  stabilità  e  percezione  di  una  fase  di  calma,  tranquillità  e  normalità  senza  particolari  scossoni  o  turbolenze  eccessive,  gestione  del  presente  e  focalizzazione  sul  \"qui  e  ora\"  senza  ansie  o  preoccupazioni  eccessive  riguardo  al  futuro  o  rimpianti  o  nostalgie  riguardo  al  passato,  approccio  sereno  e  rassicurante  che  valorizza  la  stabilità,  la  prevedibilità  e  la  routine  come  fonti  di  sicurezza  e  di  benessere  psicofisico  quotidiano) (Negativo:  potenziale mancanza  di  ambizione  e  di  slancio  verso  nuove  sfide  e  opportunità  di  crescita  e  sviluppo  professionale  e  personale,  rischio  di  adagiarsi  sugli  allori  e  di  non  cogliere  appieno  il  proprio  potenziale  e  le  proprie  capacità  di  superare  i  propri  limiti  e  di  raggiungere  obiettivi  più  ambiziosi  e  sfidanti  in  futuro,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  dinamismo,  proattività,  ambizione  e  voglia  di  emergere  e  di  distinguersi  e  di  non  accontentarsi  della  mera  stabilità  o  della  routine  rassicurante  ma  potenzialmente  appiattente  o  poco  stimolante  nel  lungo  periodo)."
      },
      {
        value: "Autunno",
        text: "(Positivo:  realismo e  lucida  consapevolezza  delle  incertezze,  delle  fragilità  e  delle  difficoltà  moderate  che  il  futuro  potrebbe  riservare,  approccio  pragmatico  e  orientato  alla  preparazione  e  alla  prevenzione  per  affrontare  al  meglio  eventuali  problemi  o  crisi  future  prevedibili  o  inevitabili,  capacità  di  gestire  le  difficoltà  moderate  senza  farsi  sopraffare  eccessivamente  dall' ansia  o  dallo  stress  e  di  mantenere  un  certo  controllo  sulla  situazione  anche  in  momenti  di  incertezza  o  turbamento  moderato) (Negativo:  potenziale ansia  e  preoccupazione  eccessiva  e  prolungata  e  rischio  di  vivere  in  uno  stato  di  allerta  e  ipervigilanza  costanti  che  compromettono  il  benessere  psicofisico  quotidiano,  eccessiva  focalizzazione  sui  problemi  e  sulle  difficoltà  e  mancanza  di  una  visione  pienamente  ottimistica  e  fiduciosa  nel  futuro  e  nelle  proprie  capacità  di  superare  le  avversità  e  di  cogliere  anche  le  opportunità  nascoste  dietro  le  sfide  e  gli  ostacoli  inevitabili  della  vita,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  resilienza  emotiva,  l' ottimismo  e  la  capacità  di  affrontare  le  sfide  e  le  difficoltà  con  grinta,  energia  positiva  e  slancio  proattivo  e  non  solo  con  preoccupazione,  ansia  o  ipervigilanza  eccessive  e  controproducenti  nel  lungo  periodo)."
      },
      {
        value: "Inverno",
        text: "(Negativo:  pessimismo e  ansia  eccessivi  e  prolungati  di  fronte  a  un  futuro  percepito  come  minaccioso,  incerto  e  pieno  di  difficoltà  e  crisi  imminenti  o  inevitabili,  sensazione  di  pericolo,  instabilità  e  vulnerabilità  estrema  di  fronte  a  prospettive  future  preoccupanti  e  non  rassicuranti,  approccio  negativo  e  autodistruttivo  che  blocca  l' azione  proattiva  e  impedisce  di  affrontare  costruttivamente  le  sfide  e  le  difficoltà  percepite  come  insormontabili  o  inevitabili) (Positivo:  potenziale riflessione  profonda  e  introspezione  e  capacità  di  utilizzare  i  momenti  di  crisi  e  difficoltà  come  opportunità  di  cambiamento  radicale  e  di  \"rinascita\"  personale  e  professionale,  approccio  resiliente  e  orientato  alla  sopravvivenza  e  alla  preparazione  per  un  futuro  percepito  come  sfidante  e  ostile,  consapevolezza  lucida  della  propria  vulnerabilità  e  dei  propri  limiti  che  potrebbe  spingere  a  cercare  nuove  strategie,  nuove  risorse  e  nuovi  percorsi  per  superare  la  crisi  e  per  \"rinascere  a  nuova  vita\"  con  maggiore  consapevolezza,  forza  e  determinazione)."
      }
    ],
    softSkill: "FinanzaPersonale, GestioneDelTempo",
    characteristics: "Stabilità Finanziaria, Prospettive Economiche, Capacità di Gestione Finanziaria"
  }
];
