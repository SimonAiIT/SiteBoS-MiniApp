import { Question } from "../types";

export const questions31to35: Question[] = [
  {
    num: 31,
    scenario: "Immagina di essere al centro dell'attenzione.  Come ti senti di solito in queste situazioni?",
    instructions: [
      "Immagine di un attore che si gode il palco.",
      "Immagine di un oratore che parla davanti a un pubblico.",
      "Immagine di qualcuno che canta ad un karaoke",
      "Immagine di qualcuno che scappa via dal palcoscenico."
    ],
    captions: [
      "Star del Palco",
      "Attenzione ok, Ma Non Troppa",
      "Un Poco a Disagio",
      "Panico da Palcoscenico"
    ],
    options: [
      {
        value: "Star del Palco",
        text: "(Positivo: sicurezza di sé e naturalezza in pubblico, forte carisma e dominio della scena, leadership assertiva e visibile, persona percepita carismatica e leader naturale) (Negativo: potenziale egocentrismo e ricerca approvazione esterna, rischio di apparire narcisista o eccessivamente protagonista, approccio non sempre adatto a contesti che richiedono modestia e leadership discreta)."
      },
      {
        value: "Attenzione ok, Ma Non Troppa",
        text: "(Positivo: equilibrio estroversione/introversione e gestione visibilità pubblica, approccio equilibrato che valorizza presenza scenica senza eccessi, persona percepita competente e affidabile e non bisognosa di eccessiva attenzione) (Negativo: potenziale sottoutilizzo leadership e influenza su grandi gruppi, rischio di non emergere in contesti competitivi che richiedono visibilità carismatica, approccio non sempre ottimizzato per leadership carismatica che conquista folle)."
      },
      {
        value: "Un Poco a Disagio",
        text: "(Positivo: modestia e umiltà e preferenza profilo basso, approccio introspettivo e orientato alla sostanza, persona percepita autentica e concentrata su qualità lavoro) (Negativo: potenziale evitamento opportunità crescita e visibilità professionale, rischio di auto-limitarsi in contesti estroversi, approccio non sempre ottimizzato per contesti che premiano visibilità e comunicazione efficace)."
      },
      {
        value: "Panico da Palcoscenico",
        text: "(Negativo: forte ansia sociale e blocco emotivo di fronte a esposizione pubblica, disagio estremo in situazioni visibilità, approccio iper-introverso e focalizzato su insicurezza, persona percepita timida e non adatta a leadership visibile) (Positivo: potenziale eccellenza in ruoli riservati e introspettivi, valorizzazione autenticità e sostanza lavoro indipendentemente da apprezzamento esterno, approccio più adatto a contesti che premiano qualità lavoro riservato)."
      }
    ],
    softSkill: "FiduciaInSeStessi, Autocritica",
    characteristics: "Introversione vs. Estroversione, Ansia Sociale, Fiducia in Sé"
  },
  {
    num: 32,
    scenario: "Quanto è facile di solito fare accettare le tue idee agli altri?",
    instructions: [
      "Immagine di semi di tarassaco che volano leggeri nel vento.",
      "Immagine di una mano che accoglie delicatamente un uccellino.",
      "Immagine di una persona che spinge con forza una porta pesante per aprirla.",
      "Immagine di una palla che rimbalza contro un muro di gomma e torna indietro."
    ],
    captions: [
      "Le mie Idee Volano",
      "Mi Ascoltano con Qualche Riserva",
      "Devo Spingere per Farle Passare",
      "Trovo sempre un Muro di Gomma"
    ],
    options: [
      {
        value: "Le mie Idee Volano",
        text: "(Positivo:  massima capacità persuasiva e  naturalezza nel  convincere gli altri,  forte  ascendente  e  facilità  nell' ottenere  consensi  e  approvazione  unanimi,  approccio  carismatico  e  leaderistico  che  ispira  fiducia  e  adesione  spontanea  alle  proprie  visioni) (Negativo:  eccessiva  sicurezza  di  sé  e  potenziale  arroganza  o  prepotenza,  rischio  di  non  ascoltare  i  feedback  altrui  e  di  imporre  le  proprie  idee  senza  vera  condivisione  o  consenso  autentico  e  spontaneo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  umiltà,  collaborazione  paritaria  e  leadership  distribuita  e  condivisa  invece  che  accentrata  e  personalistica)."
      },
      {
        value: "Mi Ascoltano con Qualche Riserva",
        text: "(Positivo:  buona capacità di  argomentazione  e  persuasione  e  capacità  di  convincere  gli  altri  con  la  logica  e  la  ragione,  approccio  razionale  e  pragmatico  che  valorizza  il  dialogo  e  il  confronto  costruttivo  per  raggiungere  un  accordo  condiviso,  volontà  di  mediare  e  negoziare  per  trovare  un  compromesso  accettabile  per  tutte  le  parti  in  gioco) (Negativo:  lentezza  nel  processo  di  persuasione  e  potenziale  inefficacia  con  interlocutori  poco  razionali  o  resistenti  al  cambiamento,  rischio  di  non  riuscire  a  far  accettare  idee  troppo  innovative  o  controcorrente  che  richiederebbero  maggiore  slancio  visionario  e  capacità  di  rompere  gli  schemi  preconcetti,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  massima  velocità  decisionale  e  capacità  di  persuadere  rapidamente  anche  interlocutori  difficili  o  ostili  a  priori  verso  le  novità  o  le  idee  non  convenzionali)."
      },
      {
        value: "Devo Spingere per Farle Passare",
        text: "(Positivo:  forte  perseveranza  e  determinazione  nel  difendere  le  proprie  idee  e  nel  non  mollare  mai  di  fronte  alle  resistenze  altrui,  approccio  combattivo  e  resiliente  che  valorizza  la  tenacia  e  la  forza  di  volontà  nel  superare  gli  ostacoli  e  le  opposizioni  per  raggiungere  il  proprio  obiettivo  comunicativo  e  persuasivo) (Negativo:  potenziale  conflittualità  e  tensione  interpersonale  e  percezione  di  eccessiva  testardaggine  o  rigidità,  rischio  di  generare  frustrazione  e  ostilità  negli  altri  con  un  approccio  troppo  insistente  e  forzato,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  contesti  che  richiederebbero  maggiore  diplomazia,  mediazione  e  capacità  di  costruire  consenso  in  modo  collaborativo  e  non  impositivo  o  confrontazionale  a  tutti  i  costi)."
      },
      {
        value: "Trovo sempre un Muro di Gomma",
        text: "(Negativo:  scarsa  autostima  e  percezione  di  impotenza  e  frustrazione  di  fronte  alla  difficoltà  di  essere  ascoltato  e  considerato  dagli  altri,  approccio  rinunciatario  e  passivo  che  evita  il  confronto  e  la  sfida  della  persuasione  e  della  comunicazione  efficace,  percezione  di  persona  non  assertiva,  poco  influente  e  non  sempre  abile  nel  farsi  valere  e  nel  far  accettare  le  proprie  idee  in  contesti  competitivi  o  poco  collaborativi) (Positivo:  adattabilità  e  capacità  di  evitare  frustrazioni  inutili  e  dispersioni  di  energie  in  tentativi  di  persuasione  percepite  come  inutili  o  controproducenti,  approccio  pragmatico  e  orientato  all'  efficienza  che  privilegia  l'  evitamento  di  conflitti  e  resistenze  inutili  e  la  concentrazione  su  attività  percepite  come  più  facili  o  più  proficue  in  altre  direzioni  o  ambiti  operativi,  valorizzazione  della  flessibilità  e  della  capacità  di  adattarsi  a  contesti  ostili  o  poco  ricettivi  alle  proprie  idee  senza  perdersi  d'animo  o  demotivarsi  eccessivamente  di  fronte  alle  difficoltà  comunicative  e  relazionali)."
      }
    ],
    softSkill: "Negoziazione, ComunicazioneEfficace",
    characteristics: "Capacità di Persuasione, Influenza, Efficacia Comunicativa"
  },
  {
    num: 33,
    scenario: "Quando sei diventato/a indipendente economicamente, senza l'aiuto dei tuoi genitori?",
    instructions: [
      "Immagine di un ragazzino che cammina sicuro.",
      "Immagine di un giovane adulto che sorride.",
      "Immagine di una persona adulta, nel pieno delle sue forze.",
      "Immagine di una persona anziana che guarda lontano."
    ],
    captions: [
      "Indipendente da Adolescente",
      "Indipendente da Giovane",
      "Indipendente da Adulto ",
      "Indipendente Tardi"
    ],
    options: [
      {
        value: "Indipendente da Adolescente",
        text: "(Positivo: massima autonomia precoce e spirito di iniziativa, approccio proattivo e orientato all'autosufficienza economica da subito, persona percepita forte e indipendente fin da giovane età) (Negativo: potenziale \"bruciatura\" tappe adolescenziali e mancanza esperienze formative tipiche, rischio distacco familiare precoce e non pieno supporto genitoriale in fase delicata, approccio non sempre ottimizzato per benessere psicologico ed equilibrio crescita personale oltre dimensione economica)."
      },
      {
        value: "Indipendente da Giovane",
        text: "(Positivo: indipendenza economica in età giovanile \"canonica\", rispetto tappe sociali e rassicurazione sociale per aver fatto \"le cose per bene\", approccio equilibrato che concilia autonomia e integrazione sociale) (Negativo: potenziale conformismo e mancanza originalità scelte di vita, rischio percorso troppo convenzionale senza osare scelte personali e creative, approccio non sempre ottimizzato per massima realizzazione personale e valorizzazione potenziale unico anche uscendo da schemi predefiniti)."
      },
      {
        value: "Indipendente da Adulto ",
        text: "(Positivo: crescita graduale senza forzature, consolidamento autonomia economica con tempi personali e senza fretta, approccio ponderato che valorizza maturazione graduale e solidità basi per indipendenza futura) (Negativo: potenziale ritardo in autonomia economica e prolungata dipendenza famiglia, rischio rinuncia esperienze precoci indipendenza e autonomia decisionale, approccio non sempre ottimizzato per velocità acquisizione autonomia e capacità di gestire destino economico rapidamente)."
      },
      {
        value: "Indipendente Tardi",
        text: "(Negativo: indipendenza tardiva e potenziale dipendenza prolungata famiglia oltre età \"normale\", percezione di \"ritardo\" rispetto a tappe sociali e potenziale inadeguatezza, non raggiungimento indipendenza economica in tempi \"ottimali\") (Positivo: potenziale maturazione più completa prima indipendenza economica, acquisizione competenze più solide e base sicura per affrontare indipendenza futura, approccio prudente che valorizza solidità e sicurezza nel lungo periodo, approccio più adatto a contesti che premiano solidità e preparazione accurata piuttosto che velocità autonomia economica)."
      }
    ],
    softSkill: "Autodisciplina, Autocritica",
    characteristics: "Indipendenza, Responsabilità, Livello di Maturità"
  },
  {
    num: 34,
    scenario: "Devi svolgere un lavoro che ti annoia molto. Come ti comporti di solito per portare a termine il compito?",
    instructions: [
      "Immagine di una sedia vuota davanti a una scrivania ingombra di scartoffie.",
      "Immagine di una catena di montaggio veloce e ripetitiva",
      "Immagine di una persona che sgranocchia snack e beve bibite mentre lavora.",
      "Immagine di un Monaco che medita pazientemente in un giardino zen."
    ],
    captions: [
      "Rimando a Domani ",
      "Faccio il Compitino e Via",
      "Mi Distraggo e Cerco di Farlo Passare",
      "Trovo un Senso Anche nella Noia"
    ],
    options: [
      {
        value: "Rimando a Domani",
        text: "(Negativo:  massima procrastinazione e  tendenza a rimandare  compiti  percepiti come  sgradevoli o  noiosi,  scarsa gestione della noia e  bassa  tolleranza  verso  attività  ripetitive  o  poco  stimolanti,  approccio  evitante  e  non  proattivo  nell' affrontare  le  sfide  e  le  responsabilità  anche  quando  poco  piacevoli  o  gratificanti  immediatamente) (Positivo:  gestione dello stress  immediato  e  ricerca  di  un  momentaneo  sollievo  dalla  noia,  auto-concessione  di  una  pausa  e  tentativo  di  rimandare  il  compito  ad  un  momento  percepito  come  più  propizio  o  meno  sgradevole,  approccio  orientato  all' evitamento  della  sofferenza  e  del  disagio  immediato  anche  a  costo  di  rinviare  la  soluzione  del  problema  o  l' esecuzione  del  compito  sgradevole  a  più  tardi)."
      },
      {
        value: "Faccio il Compitino e Via",
        text: "(Positivo:  pragmatismo e  focalizzazione  sull' essenziale  senza  dispersioni  di  energie  inutili,  approccio  minimalista  e  orientato  all' efficienza  nel  fare  il  minimo  indispensabile  per  portare  a  termine  il  compito  senza  sprechi  di  tempo  o  risorse  eccessive,  gestione  oculata  delle  energie  personali  e  concentrazione  sulle  attività  percepite  come  più  importanti  o  gratificanti) (Negativo:  qualità del lavoro  solo  sufficiente  o  mediocre  e  non  orientata  all' eccellenza  o  alla  massima  performance,  rischio  di  non  raggiungere  standard  elevati  e  di  fornire  un  lavoro  di  bassa  qualità  o  non  pienamente  soddisfacente  per  sé  stessi  e  per  gli  altri,  potenziale  insoddisfazione  professionale  e  mancanza  di  stimoli  e  sfide  intrinsecamente  motivanti  e  gratificanti  nel  lungo  periodo)."
      },
      {
        value: "Mi Distraggo e Cerco di Farlo Passare",
        text: "(Positivo:  capacità di rendere  meno  sgradevole  un  compito  noioso  attraverso  la  distrazione  e  la  creatività,  gestione  della  noia  e  tentativo  di  evadere  dalla  routine  opprimente  con  strategie  alternative  e  non  convenzionali,  volontà  di  mantenere  alto  il  morale  e  di  non  farsi  sopraffare  dalla  demotivazione  anche  in  situazioni  poco  stimolanti  o  ripetitive) (Negativo:  calo di concentrazione  e  dell' attenzione  e  conseguente  riduzione  dell' efficienza  e  della  produttività,  rischio  di  perdere  il  focus  sul  compito  e  di  commettere  errori  o  imprecisioni  per  distrazione  e  superficialità,  potenziale  riduzione  della  qualità  del  lavoro  e  mancanza  di  un  approccio  pienamente  focalizzato  sulla  massima  performance  e  sull' eccellenza  professionale)."
      },
      {
        value: "Trovo un Senso Anche nella Noia",
        text: "(Positivo:  forte autodisciplina  e  capacità  di  trovare  motivazione  intrinseca  anche  in  compiti  noiosi  o  ripetitivi,  approccio  orientato  all' etica  del  lavoro  e  al  senso  del  dovere  anche  quando  il  compito  non  è  intrinsecamente  gratificante  o  stimolante,  trasformazione  della  routine  in  sfida  personale  e  opportunità  di  crescita  attraverso  la  disciplina  e  la  perseveranza) (Negativo:  eccessiva rigidità  e  inflessibilità  e  potenziale  difficoltà  a  riconoscere  i  limiti  dei  compiti  eccessivamente  ripetitivi  o  demotivanti,  rischio  di  stress  eccessivo  e  burnout  per  eccessiva  autodisciplina  e  iper-impegno  anche  in  attività  poco  significative  o  gratificanti  nel  lungo  periodo,  percezione  di  approccio  forse  non  sempre  ottimizzato  per  il  benessere  psicofisico  e  per  una  gestione  equilibrata  del  tempo  e  delle  energie  personali  che  tenga  conto  anche  della  necessità  di  svolgere  attività  intrinsecamente  motivanti  e  gratificanti  per  mantenere  alto  l' entusiasmo  e  la  soddisfazione  professionale  nel  lungo  termine)."
      }
    ],
    softSkill: "Autodisciplina, PianificazioneEOrganizzazione",
    characteristics: "Gestione della Noia, Autodisciplina, Motivazione Intrinseca, Resilienza alla Routine"
  },
  {
    num: 35,
    scenario: "Ti fanno una critica, che non meriti. Come reagisci?",
    instructions: [
      "Immagine di un diamante splendente e intatto.",
      "Immagine di un fiume che scorre placido e continua il suo corso.",
      "Immagine di una persona seduta in posa pensierosa con degli ingranaggi che girano nella testa.",
      "Immagine di una scultura di vetro fragile che si frantuma in mille pezzi."
    ],
    captions: [
      "Non a Me",
      "Ok, Avanti il Prossimo",
      "Ci Penso Su",
      "Mi Distruggono"
    ],
    options: [
      {
        value: "Non a Me",
        text: "(Negativo: eccessiva autostima e chiusura al feedback, arroganza percepita, rischio di non migliorare per mancanza autocritica, persona percepita troppo sicura e poco umile) (Positivo: forte autostima e resilienza a critiche ingiuste, capacità di mantenere fiducia in sé, approccio indipendente da giudizio altrui e focalizzato su autovalutazione)."
      },
      {
        value: "Ok, Avanti il Prossimo",
        text: "(Positivo: capacità elaborare rapidamente critiche e non destabilizzarsi, approccio pragmatico e orientato all'azione senza perdersi in rimuginazioni, volontà di andare avanti senza scoraggiarsi) (Negativo: potenziale superficialità elaborazione feedback e rischio non cogliere spunti utili miglioramento, mancanza approfondimento e riflessione critica su feedback ricevuto, approccio non sempre ottimizzato per massima crescita personale che richiede ascolto attivo feedback)."
      },
      {
        value: "Ci Penso Su",
        text: "(Positivo: apertura al feedback e volontà miglioramento continuo, approccio riflessivo e orientato a crescita personale tramite analisi critica feedback, volontà di imparare da errori e critiche per migliorare performance) (Negativo: potenziale rimuginazione eccessiva su critiche e rischio farsi condizionare troppo da giudizio esterno, rischio perdere sicurezza di sé per eccessiva preoccupazione di non essere all'altezza, approccio non sempre ottimizzato per massima resilienza emotiva e gestione stress da giudizio altrui)."
      },
      {
        value: "Mi Distruggono",
        text: "(Negativo: estrema vulnerabilità alla critica e bassa autostima, ipersensibilità al giudizio altrui, approccio emotivamente fragile e poco resiliente, persona percepita emotivamente sensibile ma eccessivamente vulnerabile) (Positivo: potenziale autoconsapevolezza profonda e desiderio intenso di miglioramento, approccio iper-sensibile alle critiche indice di umanità e forte senso responsabilità, *ma positivo solo in ottica di estrema sensibilità emotiva e non sempre funzionale in contesti che richiedono maggiore resilienza emotiva*)."
      }
    ],
    softSkill: "Resilienza, Autocritica",
    characteristics: "Resilienza Emotiva, Sensibilità alla Critica, Autostima"
  }
];
