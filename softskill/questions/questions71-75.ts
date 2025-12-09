import { Question } from "../types";

export const questions71to75: Question[] = [
  {
    num: 71,
    scenario: "Quale immagine associ al tuo percorso nella vita?",
    instructions: [
      "Immagine di un'autostrada dritta e soleggiata,  percorso chiaro e senza ostacoli,  sicurezza di sé.",
      "Immagine di una strada di campagna con qualche curva,  percorso generalmente agevole ma con imprevisti gestibili.",
      "Immagine di un sentiero di montagna con salite e discese,  percorso impegnativo e altalenante.",
      "Immagine di un labirinto intricato e buio,  percorso confuso e pieno di incertezze,  senso di inadeguatezza."
    ],
    captions: [
      "Autostrada Spianata",
      "Strada di Campagna",
      "Sentiero di Montagna",
      "Labirinto Buio"
    ],
    options: [
      {
        value: "Autostrada Spianata",
        text: "(Positivo:  percezione di  massima sicurezza di sé e  fiducia  nelle  proprie  capacità  di  gestire  il  proprio  percorso  di  vita  senza  ostacoli  o  difficoltà  insormontabili,  approccio  lineare  e  diretto  alla  vita  e  agli  obiettivi  senza  eccessive  complicazioni  o  deviazioni  dal  percorso  prestabilito,  forte  senso  di  controllo  e  padronanza  della  propria  esistenza  e  del  proprio  destino  personale  e  professionale) (Negativo:  potenziale sottovalutazione delle  difficoltà  reali  e  degli  imprevisti  inevitabili  della  vita,  rischio  di  non  essere  preparato  adeguatamente  ad  affrontare  sfide  inattese  o  cambiamenti  repentini  di  scenario,  percezione  di  eccessiva  sicurezza  di  sé  che  potrebbe  sconfinare  nell'  ingenuità  o  nell'  illusione  di  onnipotenza  e  di  controllo  totale  e  assoluto  sulla  realtà  complessa  e  imprevedibile  del  mondo  esterno)."
      },
      {
        value: "Strada di Campagna",
        text: "(Positivo:  realismo e  pragmatismo  e  fiducia  nelle  proprie  capacità  di  adattamento  e  di  problem-solving  di  fronte  agli  ostacoli  e  agli  imprevisti  inevitabili  della  vita,  approccio  flessibile  e  versatile  che  valorizza  la  capacità  di  gestire  la  varietà  e  l'  imprevedibilità  del  percorso  di  vita  con  relativa  calma  e  sicurezza  interiore,  aspettative  realistiche  e  consoni  alla  normalità  della  vita  vera  con  le  sue  sfide  e  le  sue  opportunità  senza  illusioni  eccessive  o  pessimistiche  rassegnazioni) (Negativo:  potenziale mancanza di  ambizione  spinta  e  di  slancio  verso  obiettivi  davvero  eccezionali  o  straordinari,  rischio  di  accontentarsi  di  traguardi  \"normali\"  e  non  eccessivamente  sfidanti  o  impegnativi  e  di  non  sfruttare  appieno  il  proprio  potenziale  per  raggiungere  mete  più  ambiziose  e  significative  nel  lungo  periodo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  premiano  la  massima  ambizione,  la  competizione  spinta  e  la  ricerca  ossessiva  dell' eccellenza  e  del  superamento  costante  dei  propri  limiti  e  delle  proprie  zone  di  comfort  rassicuranti  ma  potenzialmente  limitanti  nel  lungo  periodo)."
      },
      {
        value: "Sentiero di Montagna",
        text: "(Positivo:  consapevolezza delle  difficoltà  e  delle  sfide  inevitabili  della  vita  e  approccio  resiliente  e  combattivo  che  valorizza  la  crescita  personale  e  professionale  attraverso  il  superamento  degli  ostacoli  e  delle  avversità,  volontà  di  non  mollare  mai  e  di  perseverare  con  tenacia  e  determinazione  anche  di  fronte  a  percorsi  ardui  e  incerti  e  non  sempre  facili  o  prevedibili,  percezione  di  persona  forte,  coraggiosa,  determinata,  resiliente  e  non  facilmente  scoraggiabile  o  abbattibile  di  fronte  alle  difficoltà  e  alle  sfide  inevitabili  del  percorso  di  vita  personale  e  professionale) (Negativo:  stress eccessivo  e  prolungato  nel  tempo  causato  dalla  percezione  di  un  percorso  di  vita  costantemente  arduo,  incerto  e  impegnativo,  rischio  di  vivere  in  uno  stato  di  lotta  continua  e  di  non  godersi  appieno  il  viaggio  e  la  bellezza  del  percorso  in  sé  per  eccessiva  focalizzazione  sulla  fatica,  sugli  ostacoli  e  sulla  meta  finale  da  raggiungere  a  tutti  i  costi,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  il  benessere  psicofisico  e  per  la  qualità  della  vita  nel  lungo  periodo  a  causa  dell'  eccessiva  tensione  e  iper-focalizzazione  sulla  lotta,  sulla  resistenza  e  sul  superamento  delle  difficoltà  come  unico  orizzonte  e  unico  obiettivo  primario  e  fondamentale  della  propria  esistenza)."
      },
      {
        value: "Labirinto Buio",
        text: "(Negativo:  senso di  smarrimento  e  confusione  e  percezione  di  inadeguatezza  e  impotenza  di  fronte  alle  sfide  e  alle  incognite  del  percorso  di  vita,  approccio  pessimistico  e  scoraggiato  che  rischia  di  bloccare  l' azione  proattiva  e  di  impedire  di  affrontare  costruttivamente  le  difficoltà  e  di  cercare  soluzioni  efficaci  per  superare  l' impasse  e  ritrovare  la  direzione  e  la  motivazione  per  proseguire  il  cammino,  percezione  di  bassa  autostima,  insicurezza,  vittimismo  e  mancanza  di  fiducia  nelle  proprie  risorse  interiori  e  nelle  proprie  capacità  di  farcela  e  di  uscire  dal  \"labirinto\"  esistenziale  percepito  come  inestricabile  e  senza  via  d' uscita) (Positivo:  potenziale spinta  alla  riflessione  profonda  e  all' introspezione  e  alla  ricerca  di  nuove  direzioni  e  di  nuove  strategie  per  orientarsi  e  uscire  dalla  confusione  e  dallo  smarrimento  iniziale,  consapevolezza  dei  propri  limiti  e  delle  proprie  fragilità  e  potenziale  apertura  alla  richiesta  di  aiuto  e  di  supporto  esterno  per  superare  il  blocco  emotivo  e  la  paralisi  psicologica  causati  dalla  percezione  di  essere  \"persi\"  e  \"inadeguati\"  di  fronte  alle  sfide  complesse  e  imprevedibili  della  vita, *ma  positivo  solo  come  punto  di  partenza  per  un  cambiamento  attivo  e  costruttivo  e  non  come  atteggiamento  stabile  e  persistente  nel  tempo  di  fronte  alle  difficoltà  e  alle  sfide  inevitabili  della  vita  per  tutti  gli  esseri  umani*)."
      }
    ],
    softSkill: "FiduciaInSeStessi, Autocritica",
    characteristics: "Autostima, Percezione di Sé, Livelli di Fiducia"
  },
  {
    num: 72,
    scenario: "Vedi un incendio. Come reagisci?",
    instructions: [
      "Immagine di una persona che urla scompostamente agitando le braccia,  reazione isterica e  inefficace.",
      "Immagine di una persona che cerca freneticamente una bottiglia d'acqua,  azione immediata e  istintiva per \"spegnere subito\".",
      "Immagine di una persona che compone rapidamente il numero di emergenza al telefono,  ricerca di aiuto esterno e  delegato.",
      "Immagine di una persona che si addentra tra le fiamme per cercare persone da salvare,  azione empatica e  focalizzata sulle \"vittime\"."
    ],
    captions: [
      "Comincio ad Urlare",
      "Cerco Subito Acqua",
      "Chiamo i Pompieri",
      "Cerco Superstiti"
    ],
    options: [
      {
        value: "Comincio ad Urlare",
        text: "(Negativo:  reazione  emotiva  eccessiva  e  inefficace  e  potenziale  escalation  del  panico  e  della  confusione,  approccio  impulsivo  e  poco  lucido  che  rischia  di  peggiorare  la  situazione  invece  di  risolverla  o  di  gestirla  in  modo  costruttivo,  percezione  di  persona  poco  controllata,  emotivamente  instabile  e  non  sempre  utile  o  affidabile  in  situazioni  di  emergenza  o  di  crisi  che  richiederebbero  calma,  lucidità  e  capacità  di  azione  rapida  e  coordinata) (Positivo:  reazione  istintiva  di  allarme  e  segnalazione  immediata  del  pericolo  e  dell' urgenza  della  situazione,  espressione  emotiva  diretta  e  autentica  di  fronte  a  un  pericolo  evidente  e  imminente,  rottura  del  silenzio  e  richiamo  all' attenzione  collettiva  sul  problema  e  sulla  necessità  di  intervenire  tempestivamente  per  evitare  conseguenze  negative  più  gravi)."
      },
      {
        value: "Cerco Subito Acqua",
        text: "(Positivo:  azione immediata e  diretta  e  approccio  pragmatico  e  orientato  alla  soluzione  rapida  e  concreta  del  problema  urgente,  volontà  di  intervenire  tempestivamente per  limitare  i  danni  e  le  conseguenze  negative  immediate,  massimizzazione  dell' efficienza  e  della  velocità  nella  risposta  iniziale  all' emergenza  e  nel  tentativo  di  risolvere  praticamente  il  problema  in  modo  rapido  e  tempestivo) (Negativo:  rischio di  risoluzione superficiale e  incompleta  e  mancanza  di  analisi  approfondita  delle  cause  profonde  del  problema,  approccio  forse  troppo  sbrigativo,  frettoloso,  superficiale  e  non  sempre  ottimizzato  per  la  gestione  di  emergenze  complesse  che  richiederebbero  un  intervento  più  organico,  coordinato  e  strategico  e  non  solo  una  reazione  istintiva  e  immediata  ma  potenzialmente  limitata  o  inefficace  nel  lungo  periodo,  percezione  di  approccio  forse  troppo  focalizzato  sulla  \"superficie\"  del  problema  e  non  sempre  attento  alle  implicazioni  emotive  e  relazionali  e  alla  necessità  di  una  soluzione  davvero  completa  e  definitiva  e  non  solo  di  un  intervento  \"tampone\"  e  provvisorio)."
      },
      {
        value: "Chiamo i Pompieri",
        text: "(Positivo:  approccio responsabile e  consapevole  dei  propri  limiti  e  della  necessità  di  delegare  la  gestione  dell' emergenza  a  figure  esperte  e  competenti,  attivazione  tempestiva  di  risorse  esterne  specializzate  e  dotate  di  competenze  e  strumenti  adeguati  per  fronteggiare  l' emergenza  in  modo  efficace  e  risolutivo,  evitamento  del  coinvolgimento  diretto  e  personale  e  massimizzazione  della  sicurezza  personale  e  dell' efficienza  complessiva  della  risposta  all' emergenza) (Negativo:  potenziale mancanza di  assunzione  di  responsabilità  diretta  e  personale  e  percezione  di  eccessiva  delega  a  figure  esterne  e  di  scarsa  iniziativa  e  protagonismo  personale  nella  gestione  diretta  dell' emergenza,  rischio  di  apparire  poco  coraggioso,  poco  coinvolto  emotivamente  o  non  pienamente  responsabile  di  fronte  a  una  situazione  che  richiederebbe  maggiore  impegno  e  azione  diretta  e  in  prima  persona,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  premiano  la  leadership  diretta  e  operativa,  il  protagonismo  personale  e  la  capacità  di  assumersi  rischi  e  responsabilità  in  prima  persona  anche  di  fronte  a  situazioni  di  emergenza  o  di  crisi  complesse  e  imprevedibili)."
      },
      {
        value: "Cerco Superstiti",
        text: "(Positivo:  massima empatia e  attenzione  alle  persone  e  al  benessere  emotivo  e  psicologico,  approccio  altruista  e  orientato  al  soccorso  e  all' aiuto  concreto  e  immediato  verso  chi  si  trova  in  difficoltà  o  in  pericolo,  valorizzazione  della  solidarietà  umana,  della  compassione  e  della  cura  verso  il  prossimo  come  valori  primari  e  fondamentali  di  fronte  a  situazioni  di  crisi  o  di  emergenza  collettiva) (Negativo:  potenziale trascuratezza della  risoluzione  pratica  del  problema  alla  radice  e  iper-focalizzazione  sugli  aspetti  emotivi  e  relazionali  a  scapito  dell' efficacia  operativa  e  della  gestione  razionale  e  oggettiva  dell' emergenza  nel  suo  complesso,  rischio  di  non  affrontare  direttamente  le  cause  profonde e  di  limitarsi  a  un  intervento  solo  parziale  e  non  sempre  risolutivo  \"nel  merito\"  del  problema  specifico  e  circoscritto,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  capacità  di  problem-solving  pratico  e  tempestivo,  efficienza  operativa  e  gestione  razionale  e  oggettiva  dell' emergenza  nel  suo  complesso  e  non  solo  attenzione  prioritaria  agli  aspetti  emotivi  e  relazionali  e  al  benessere  psicologico  delle  vittime  coinvolte  nell' emergenza  specifica  e  circoscritta)."
      }
    ],
    softSkill: "RelazioniInterpersonali, GestioneDeiConflitti",
    characteristics: "Stile di Conflitto, Approccio Interpersonale, Empatia"
  },
  {
    num: 73,
    scenario: "Pensa al tuo ritmo abituale nello svolgere un compito.  Ti senti più...?",
    instructions: [
      "Immagine di un'autostrada deserta e rettilinea,  flusso libero e veloce,  senza intoppi.",
      "Immagine di una strada scorrevole con traffico fluido,  ritmo regolare e senza fretta.",
      "Immagine di traffico cittadino intenso ma ancora in movimento,  ritmo variabile e a volte affannoso.",
      "Immagine di un ingorgo stradale completamente bloccato,  ritmo caotico e stressante,  senza controllo."
    ],
    captions: [
      "Autostrada Deserta",
      "Strada Scorrevole",
      "Traffico Cittadino",
      "Ingorgo Totale"
    ],
    options: [
      {
        value: "Autostrada Deserta",
        text: "(Positivo:  massima efficienza e  rapidità  nell' esecuzione  dei  compiti  e  raggiungimento  di  alti  livelli  di  produttività  in  tempi  ottimizzati,  approccio  fluido  e  scorrevole  che  valorizza  la  velocità  e  l'  immediatezza  operativa  senza  intoppi  o  rallentamenti  eccessivi,  massimizzazione  della  performance  e  della  capacità  di  portare  a  termine  un  gran  numero  di  compiti  in  tempi  rapidi  e  con  ritmi  di  lavoro  sostenuti  e  costanti) (Negativo:  potenziale superficialità e  scarsa  attenzione  ai  dettagli  e  alla  qualità  intrinseca  del  lavoro  svolto  per  eccessiva  focalizzazione  sulla  velocità  e  sulla  quantità  a  scapito  della  cura  e  dell' accuratezza,  rischio  di  commettere  errori  o  imprecisioni  per  fretta  e  mancanza  di  tempo  sufficiente  per  verificare  e  controllare  adeguatamente  il  proprio  operato,  percezione  di  approccio  forse  troppo  frettoloso,  sbrigativo,  superficiale  e  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  precisione,  accuratezza,  attenzione  ai  dettagli  e  qualità  intrinseca  del  lavoro  svolto  prima  ancora  che  pura  velocità  e  quantità  di  output  prodotto  in  tempi  rapidi)."
      },
      {
        value: "Strada Scorrevole",
        text: "(Positivo:  ottimo equilibrio tra  efficienza  e  qualità  e  gestione  del  tempo  bilanciata  e  sostenibile  nel  lungo  periodo,  approccio  metodico  e  organizzato  che  permette  di  procedere  con  ritmo  regolare  e  costante  senza  eccessiva  fretta  o  rallentamenti  ingiustificati,  valorizzazione  di  una  performance  affidabile,  costante  e  di  qualità  senza  sacrificare  il  benessere  personale  o  la  precisione  e  l' accuratezza  del  lavoro  svolto) (Negativo:  velocità  non  sempre  ottimizzata  per  contesti  che  richiederebbero  massima  rapidità  decisionale  e  operativa  e  potenziale  mancanza  di  picchi  di  produttività  o  di  performance  eccezionali  o  straordinarie  in  situazioni  di  particolare  urgenza  o  pressione,  percezione  di  approccio  forse  troppo  moderato,  prudente,  poco  incline  a  rischiare  o  a  spingersi  oltre  i  propri  limiti  per  raggiungere  risultati  davvero  eccezionali  o  memorabili  in  termini  di  massima  performance  e  produttività  pura  e  assoluta  nel  breve  termine)."
      },
      {
        value: "Traffico Cittadino",
        text: "(Positivo:  elevata adattabilità a  ritmi  di  lavoro  variabili  e  imprevedibili  e  capacità  di  gestire  picchi  di  lavoro  intenso  e  periodi  di  maggiore  calma  con  relativa  flessibilità  e  resilienza,  approccio  dinamico  e  versatile  che  permette  di  affrontare  situazioni  complesse  e  mutevoli  senza  perdersi  d' animo  o  stressarsi  eccessivamente,  massimizzazione  della  capacità  di  reagire  prontamente  e  di  adattarsi  rapidamente  a  cambiamenti  di  priorità  o  a  nuove  esigenze  operative  anche  in  corso  d' opera) (Negativo:  stress intermittente e  potenziale  sensazione  di  affanno  e  di  non  avere  un  ritmo  di  lavoro  costante  e  prevedibile,  rischio  di  dispersione  di  energie  e  di  non  ottimizzare  al  massimo  l' efficienza  e  la  produttività  a  causa  della  frammentazione  e  della  variabilità  eccessiva  dei  ritmi  di  lavoro,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  massima  concentrazione  prolungata,  ritmo  costante  e  prevedibile  e  gestione  del  tempo  rigida  e  iper-controllata  per  garantire  la  massima  efficienza  e  produttività  in  compiti  complessi  e  delicati  che  richiedono  attenzione  costante  e  minima  dispersione  di  energie  e  di  risorse  nel  tempo  e  nello  spazio  operativo)."
      },
      {
        value: "Ingorgo Totale",
        text: "(Negativo:  ritmo di  lavoro  caotico  e  stressante  e  gestione  del  tempo  inefficiente  e  problematica,  approccio  disorganizzato  e  poco  strutturato  che  genera  confusione,  frustrazione  e  senso  di  perdita  di  controllo  sulla  situazione,  percezione  di  bassa  produttività  e  di  scarsa  capacità  di  gestire  il  proprio  tempo  e  il  proprio  lavoro  in  modo  efficace  e  sostenibile  nel  lungo  periodo) (Positivo:  potenziale creatività nel  caos  e  capacità  di  problem-solving  reattivo  e  immediato  sotto  pressione  e  in  situazioni  di  emergenza  o  di  crisi,  approccio  inatteso  e  non  convenzionale  che  potrebbe  favorire  soluzioni  innovative  e  originali  proprio  grazie  alla  gestione  del  caos  e  dell' imprevedibilità  come  stimolo  alla  creatività  e  all' improvvisazione  operativa, *ma  positivo  solo  in  ottica  di  valorizzazione  estrema  della  creatività  e  del  problem-solving  reattivo  e  tempestivo  e  non  necessariamente  auspicabile  o  funzionale  in  contesti  che  richiederebbero  maggiore  organizzazione,  pianificazione,  ritmo  costante  e  prevedibile  e  gestione  del  tempo  efficiente  e  non  solo  capacità  di  improvvisazione  e  problem-solving  creativo  in  situazioni  di  emergenza  o  di  caos  operativo  persistente  e  prolungato  nel  tempo*)."
      }
    ],
    softSkill: "GestioneDelTempo, PianificazioneEOrganizzazione",
    characteristics: "Ritmo di Lavoro, Gestione della Pressione, Efficienza"
  },
  {
    num: 74,
    scenario: "Quale immagine descrive meglio il tuo stile di vendita?",
    instructions: [
      "Immagine di un giardiniere che cura amorevolmente una pianta,  focus sulla relazione con il cliente.",
      "Immagine di un artista che mostra con orgoglio la sua opera,  focus sul valore del prodotto.",
      "Immagine di un cacciatore che punta la preda con decisione,  focus sul risultato di vendita.",
      "Immagine di un sarto che adatta un vestito su misura,  focus sulle esigenze del cliente."
    ],
    captions: [
      "Giardiniere",
      "Artista",
      "Cacciatore",
      "Sarto"
    ],
    options: [
      {
        value: "Giardiniere",
        text: "(Positivo:  massima priorità alla  costruzione  di  relazioni  solide  e  durature  e  alla  fidelizzazione  del  cliente  nel  lungo  periodo,  approccio  orientato  alla  cura  e  all' ascolto  attento  delle  esigenze  del  cliente  e  alla  creazione  di  un  rapporto  di  fiducia  reciproca  e  di  valore  aggiunto  nel  tempo,  persona  percepita  come  affidabile,  attenta,  dedicata  al  cliente  e  non  solo  interessata  alla  pura  transazione  commerciale  immediata  e  superficiale) (Negativo:  potenziale trascuratezza degli  obiettivi  di  vendita  a  breve  termine  e  rischio  di  non  essere  sufficientemente  aggressivo  o  proattivo  nel  chiudere  affari  e  nel  massimizzare  il  profitto  immediato,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  massima  velocità  e  incisività  commerciale,  forte  orientamento  al  risultato  economico  immediato  e  massimizzazione  del  profitto  nel  breve  periodo  e  non  solo  valorizzazione  della  relazione  umana  e  della  fidelizzazione  nel  lungo  termine)."
      },
      {
        value: "Artista",
        text: "(Positivo:  forte focus sul  valore  intrinseco  del  prodotto  e  massima  convinzione  della  qualità  e  dei  vantaggi  unici  e  distintivi  di  ciò  che  si  vende,  approccio  appassionato  e  entusiasta  che  valorizza  le  caratteristiche  e  i  benefici  del  prodotto  come  elemento  centrale  e  fondamentale  della  proposta  commerciale,  persona  percepita  come  competente,  credibile,  esperta  del  prodotto  e  capace  di  comunicarne  il  valore  in  modo  efficace  e  persuasivo) (Negativo:  potenziale rigidità nell' approccio  commerciale  e  rischio  di  non  adattarsi  sufficientemente  alle  esigenze  specifiche  e  individuali  di  ogni  cliente,  percezione  di  approccio  forse  troppo  focalizzato  sul  prodotto  e  non  sempre  ottimizzato  per  la  massima  personalizzazione  dell' offerta  e  per  l' ascolto  attento  e  attivo  dei  bisogni  e  delle  aspettative  del  cliente  specifico,  rischio  di  apparire  eccessivamente  insistente  o  poco  attento  alla  relazione  umana  e  alla  dinamica  interpersonale  con  il  cliente  nel  processo  di  vendita  e  di  persuasione  commerciale)."
      },
      {
        value: "Cacciatore",
        text: "(Positivo:  massimo orientamento al  risultato  e  all' obiettivo  di  vendita  e  forte  determinazione  nel  raggiungere  target  ambiziosi  e  sfidanti,  approccio  competitivo  e  aggressivo  che  valorizza  l' efficacia,  la  velocità  e  la  capacità  di  chiudere  affari  e  di  massimizzare  i  guadagni  e  il  profitto  nel  breve  termine,  persona  percepita  come  dinamica,  proattiva,  focalizzata  sull' obiettivo,  determinata,  competitiva  e  non  facilmente  scoraggiabile  o  abbattibile  di  fronte  alle  difficoltà  o  alle  resistenze  del  mercato  e  della  concorrenza) (Negativo:  potenziale approccio eccessivamente  aggressivo  e  manipolatorio  e  rischio  di  danneggiare  le  relazioni  a  lungo  termine  con  i  clienti  per  eccessiva  focalizzazione  sulla  chiusura  dell' affare  immediato  e  sulla  massimizzazione  del  profitto  a  breve  termine  anche  a  costo  di  compromettere  la  fiducia  e  la  soddisfazione  del  cliente  nel  lungo  periodo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  etica  commerciale,  trasparenza,  correttezza,  attenzione  alla  relazione  umana  e  alla  fidelizzazione  del  cliente  nel  lungo  periodo  e  non  solo  massimizzazione  del  profitto  immediato  e  della  pura  performance  di  vendita  a  breve  termine)."
      },
      {
        value: "Sarto",
        text: "(Positivo:  massima attenzione al  cliente  e  alle  sue  esigenze  specifiche  e  individuali  e  approccio  iper-personalizzato  e  orientato  alla  soddisfazione  totale  e  completa  del  cliente  anche  a  costo  di  un  impegno  maggiore  e  di  un  dispendio  di  tempo  e  di  risorse  superiore  alla  media,  valorizzazione  di  un  servizio  \"su  misura\"  e  di  alta  qualità  che  mira  a  creare  un  rapporto  di  fiducia  e  di  soddisfazione  duratura  e  non  solo  a  concludere  una  transazione  commerciale  standardizzata  e  superficiale,  persona  percepita  come  attenta,  dedicata,  orientata  al  cliente  e  alla  qualità  del  servizio  offerto  e  non  solo  al  profitto  immediato  e  alla  massimizzazione  delle  vendite  a  breve  termine) (Negativo:  potenziale inefficienza in  termini  di  tempo  e  di  scalabilità  del  servizio  e  rischio  di  non  raggiungere  volumi  di  vendita  elevati  a  causa  dell' eccessiva  focalizzazione  sulla  personalizzazione  estrema  e  sulla  cura  minuziosa  del  singolo  cliente,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  velocità,  standardizzazione,  scalabilità  e  capacità  di  gestire  un  gran  numero  di  clienti  contemporaneamente  senza  perdersi  in  dettagli  eccessivi  o  in  un  iper-personalizzazione  non  sempre  necessaria  o  funzionale  alla  massima  efficienza  e  produttività  complessiva  dell' azienda  o  del  team  di  vendita)."
      }
    ],
    softSkill: "ServizioAlCliente, OrientamentoAlCliente",
    characteristics: "Approccio alla Vendita, Orientamento al Cliente, Stile di Persuasione"
  },
  {
    num: 75,
    scenario: "Quale immagine descrive meglio il tuo paesaggio emotivo?",
    instructions: [
      "Immagine di una barchetta di carta che affonda in un bicchiere d'acqua agitata,  fragilità e sopraffazione anche per piccole difficoltà.",
      "Immagine di una casa con le finestre che sbattono durante un temporale,  turbamento e difficoltà, ma la struttura regge.",
      "Immagine di un faro che svetta nella tempesta,  luce ferma e rassicurante nel caos,  calma interiore nonostante tutto.",
      "Immagine di una lastra di ghiaccio immobile e insensibile sotto una tormenta di neve,  distacco emotivo e nessuna reazione apparente."
    ],
    captions: [
      "Barchetta",
      "Casa",
      "Faro",
      "Ghiaccio"
    ],
    options: [
      {
        value: "Barchetta",
        text: "(Negativo:  estrema vulnerabilità emotiva e  ipersensibilità  e  bassa  resilienza  di  fronte  alle  avversità  e  alle  difficoltà  anche  minori,  tendenza  a  sentirsi  facilmente  sopraffatto  e  travolto  dalle  emozioni  negative  e  dagli  stress  esterni  anche  di  lieve  entità,  percezione  di  fragilità  emotiva  e  di  scarsa  capacità  di  gestire  lo  stress,  l' ansia  e  le  pressioni  inevitabili  della  vita  quotidiana) (Positivo:  altissima sensibilità  emotiva  e  spiccata  empatia  e  capacità  di  percepire  e  comprendere  profondamente  le  emozioni  altrui  e  di  sintonizzarsi  finemente  con  gli  stati  d' animo  e  le  sofferenze  delle  persone  intorno,  approccio  iper-sensibile  e  iper-ricettivo  che  valorizza  la  comprensione  empatica  e  la  connessione  emotiva  profonda  come  valori  primari  e  fondamentali  nelle  relazioni  interpersonali  e  nella  vita  sociale  in  generale)."
      },
      {
        value: "Casa",
        text: "(Positivo:  resilienza moderata e  capacità  di  resistere  alle  turbolenze  emotive  e  agli  stress  esterni  pur  provando  turbamento  e  difficoltà  e  senza  crollare  o  disintegrarsi  di  fronte  alle  avversità,  approccio  equilibrato  che  bilancia  fragilità  e  forza  interiore  e  che  permette  di  superare  le  tempeste  emotive  e  le  difficoltà  della  vita  pur  senza  essere  completamente  imperturbabile  o  indistruttibile,  persona  percepita  come  umana,  autentica,  non  invulnerabile  ma  neanche  eccessivamente  fragile  o  incapace  di  reagire  e  di  resistere  di  fronte  alle  sfide  e  alle  avversità  inevitabili) (Negativo:  potenziale somatizzazione dello  stress  e  rischio  di  accumulare  tensione  emotiva  repressa  nel  tempo  senza  elaborare  pienamente  e  in  modo  consapevole  le  emozioni  negative  e  i  traumi  psicologici,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  la  massima  gestione  dello  stress  e  per  la  prevenzione  del  burnout  emotivo  e  psicofisico  a  causa  di  un  accumulo  eccessivo  di  tensione  repressa  e  non  elaborata  in  modo  sano  e  costruttivo  e  nel  lungo  periodo)."
      },
      {
        value: "Faro",
        text: "(Positivo:  alta resilienza e  massima  calma  e  lucidità  anche  in  situazioni  di  caos  o  di  emergenza  o  di  forte  stress  esterno,  capacità  di  mantenere  la  stabilità  emotiva  e  di  essere  un  punto  di  riferimento  rassicurante  e  affidabile  per  sé  stessi  e  per  gli  altri  anche  di  fronte  alle  turbolenze  e  alle  tempeste  emotive  e  psicologiche,  persona  percepita  come  forte,  sicura  di  sé,  imperturbabile,  affidabile  al  100%  e  capace  di  gestire  lo  stress  e  le  pressioni  esterne  senza  crollare  o  perdere  la  lucidità  e  il  controllo  della  situazione) (Negativo:  potenziale repressione delle  proprie  emozioni  e  rischio  di  apparire  freddo  o  distaccato  e  poco  empatico  o  comprensivo  verso  le  fragilità  e  le  vulnerabilità  altrui,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  calore  umano,  empatia,  sensibilità  e  capacità  di  esprimere  e  condividere  le  proprie  emozioni  e  fragilità  in  modo  autentico  e  trasparente  e  non  solo  di  mantenere  un  controllo  ferreo  e  una  fredda  imperturbabilità  di  fronte  alle  turbolenze  emotive  e  alle  difficoltà  della  vita  quotidiana  e  delle  sfide  professionali  e  personali  complesse  e  imprevedibili)."
      },
      {
        value: "Ghiaccio",
        text: "(Negativo:  eccessivo distacco emotivo e  potenziale  rigidità  emotiva  e  incapacità  di  connettersi  profondamente  con  le  proprie  emozioni  e  con  quelle  altrui,  rischio  di  apparire  freddo,  insensibile,  poco  empatico  e  non  sempre  capace  di  comprendere  e  condividere  le  gioie  e  i  dolori  delle  persone  intorno,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  calore  umano,  empatia,  sensibilità,  intelligenza  emotiva  e  capacità  di  creare  legami  affettivi  profondi  e  autentici  basati  sulla  reciprocità  emotiva  e  sulla  condivisione  della  propria  vulnerabilità  e  delle  proprie  fragilità  personali) (Positivo:  massimo controllo emotivo  e  apparente  imperturbabilità  di  fronte  alle  turbolenze  e  alle  tempeste  emotive  e  psicologiche,  approccio  iper-razionale  e  orientato  al  controllo  totale  e  assoluto  delle  proprie  emozioni  e  alla  non  manifestazione  esterna  di  alcuna  debolezza  o  fragilità  emotiva  anche  in  situazioni  di  forte  stress  o  di  pressione  estrema,  valorizzazione  della  razionalità,  della  lucidità  e  del  self-control  come  valori  primari  e  fondamentali  per  affrontare  le  sfide  e  le  avversità  della  vita  professionale  e  personale, *ma  positivo  solo  in  ottica  di  massimizzazione  estrema  del  controllo  emotivo  e  della  fredda  razionalità  e  non  necessariamente  auspicabile  o  funzionale  in  contesti  che  richiederebbero  maggiore  autenticità  emotiva,  empatia,  calore  umano  e  capacità  di  esprimere  e  condividere  le  proprie  emozioni  e  fragilità  in  modo  aperto  e  trasparente  e  non  solo  di  reprimerle  o  nasconderle  dietro  una  maschera  di  fredda  imperturbabilità  e  distacco  emotivo*)."
      }
    ],
    softSkill: "Resilienza, GestioneDelloStress",
    characteristics: "Resilienza, Tolleranza allo Stress, Reattività Emotiva"
  }
];
