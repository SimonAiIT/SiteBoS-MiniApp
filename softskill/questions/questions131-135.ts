import { Question } from "../types";

export const questions131to135: Question[] = [
  {
    num: 131,
    scenario: "Devi scegliere chi far \"salire sul palco\" ad un evento per speaker. Come ti orienti?",
    instructions: [
      "Immagine di un palco illuminato da un unico riflettore che punta su un solo oratore \"standard\" e omogeneo,  scelta di un solo oratore \"rappresentativo\" di un unico gruppo dominante.",
      "Immagine di un palco con poche persone,  inclusione simbolica e \"di facciata\" di una minoranza per \"decoro\".",
      "Immagine di un palco con un \"coro\" multiculturale di oratori diversi per genere, etnia, età,  vera inclusione e  rappresentanza \"plurale\" e  \"autentica\" della diversità.",
      "Immagine di un megafono che amplifica le voci \"dal basso\",  priorità a voci \"inaudite\" e  tradizionalmente escluse dal \"palco\",  focus sull'equità \"sostanziale\" e  \"redistributiva\" (e non solo \"formale\")."
    ],
    captions: [
      "Voce Unica",
      "Goccia di Colore",
      "Coro Polifonico",
      "Testimonianze Personali"
    ],
    options: [
      {
        value: "Voce Unica",
        text: "(Negativo: esclusione della diversità e visione mono-culturale, mancanza di rappresentanza plurale, percezione di approccio non inclusivo e poco attento all'equità, omogeneizzazione forzata del palco) (Positivo: semplificazione scelta e messaggio univoco e coerente, massimizzazione linearità e omogeneità comunicativa, approccio diretto e senza complicazioni, apparente chiarezza e semplicità della linea dell'evento)."
      },
      {
        value: "Goccia di Colore",
        text: "(Negativo: inclusione di facciata e non sostanziale e rischio di tokenismo e sfruttamento simbolico della diversità, mancanza di reale equità e rappresentanza paritaria, percezione di approccio superficiale e opportunistico e non pienamente autentico o sincero nell'impegno per l'inclusione vera) (Positivo: minimo segnale di apertura alla diversità e approccio cauto e graduale verso l'inclusione controllata, tentativo di conciliazione tra inclusione e tradizione, rassicurazione formale di apertura alla diversità senza eccessi, gestione moderata e non dirompente dell'inclusione)."
      },
      {
        value: "Coro Polifonico",
        text: "(Positivo: massima inclusione e rappresentanza autentica e paritaria della diversità e valorizzazione della pluralità di voci e prospettive, approccio autenticamente inclusivo e orientato all'equità, percezione di evento ricco e variegato e davvero rappresentativo della società multiculturale) (Negativo: potenziale complessità gestionale di un palco plurale e rischio di messaggio meno univoco e lineare, percezione di evento meno semplice o immediatamente decodificabile rispetto a format più omogenei e tradizionali, approccio forse non sempre ottimizzato per la massima semplicità e linearità comunicativa a tutti i costi)."
      },
      {
        value: "Testimonianze Personali",
        text: "(Positivo: massima priorità all'equità sostanziale e azione riparatoria e redistributiva per dare voce a chi è tradizionalmente escluso, approccio militante e attivista per la diversità e l'inclusione vera e radicale, persona percepita come impegnata e coraggiosa) (Negativo: potenziale polarizzazione del dibattito e rischio di non intercettare pienamente il gusto del pubblico mainstream, percezione di approccio ideologico o partigiano, non sempre neutro o equilibrato, formato evento forse non sempre ottimizzato per la massima fruibilità e godibilità da parte di un pubblico eterogeneo)."
      }
    ],
    softSkill: "DiversitaEInclusione, Equita",
    characteristics: "Inclusività, Equità, Sensibilità Sociale, Approccio alla Diversità"
  },
  {
    num: 132,
    scenario: "Un collega ti chiede una di \"confidenza delicata su un cliente\". Che fai?",
    instructions: [
      "Immagine di un muro di mattoni invalicabile,  rifiuto netto di compromettere l'etica,  confine invalicabile.",
      "Immagine di un muro con una piccola \"crepa\" appena visibile,  esitazione etica,  leggera \"apertura\" al compromesso,  confine \"incrinato\".",
      "Immagine di una porta aperta \"a metà\",  valutazione del \"pro e contro\" del compromesso etico,  equilibrio incerto tra etica e favore al cliente.",
      "Immagine di una porta spalancata che invita ad entrare senza esitazione,  compromesso etico totale per accontentare il cliente,  confine etico \"superato\"."
    ],
    captions: [
      "Mi spiace, non Posso",
      "Lo Conosco, Dai ",
      "Ci Devo Pensare",
      "Ci Sentiamo Dopo"
    ],
    options: [
      {
        value: "Mi spiace, non Posso",
        text: "(Positivo: massima integrità etica e coerenza con i propri valori, affermazione di principi non negoziabili, tutela della propria reputazione e affidabilità morale a lungo termine, persona percepita come integra e affidabile) (Negativo: rischio di perdere il cliente e danneggiare la relazione commerciale nel breve termine e percezione di eccessiva rigidità o poca flessibilità e non sempre orientato al cliente a tutti i costi)."
      },
      {
        value: "Lo Conosco, Dai ",
        text: "(Positivo: tentativo di mediazione tra etica e fidelizzazione del cliente e approccio pragmatico che cerca un compromesso sostenibile, volontà di non perdere il cliente senza rinunciare completamente all'etica, persona percepita come flessibile e negoziatrice) (Negativo: rischio di danno reputazionale a lungo termine per compromesso etico e percezione di ambiguità o non piena trasparenza, soluzione non pienamente soddisfacente né sul piano etico né su quello della massima fidelizzazione, approccio potenzialmente fragile e non pienamente convincente)."
      },
      {
        value: "Ci Devo Pensare",
        text: "(Positivo: approccio ponderato che valuta le diverse implicazioni e ricerca di un equilibrio tra etica e vantaggio commerciale, volontà di prendere una decisione consapevole e non impulsiva, persona percepita come razionale e analitica) (Negativo: rischio di apparire esitante e poco affidabile sul piano etico e percezione di approccio calcolatore e opportunista, mancanza di spontaneità e autenticità percepita, potenziale danno alla fiducia del cliente a lungo termine se percepisce esitazione e compromesso eccessivo sull'etica)."
      },
      {
        value: "Ci Sentiamo Dopo",
        text: "(Negativo: compromesso etico totale e scelta non etica inequivocabile, danno potenziale alla propria integrità morale e alla reputazione a lungo termine, approccio moralmente inaccettabile in contesti etici rigorosi, percezione di persona priva di scrupoli etici e opportunista) (Positivo: massimizzazione della fidelizzazione immediata e approccio iper-customer-centric e totalmente orientato al cliente, massima flessibilità e disponibilità percepita verso le esigenze del cliente a tutti i costi, persona percepita come estremamente dedicata al cliente e pronta a tutto per accontentarlo e mantenerlo fedele nel breve periodo, *ma positivo solo in ottica strettamente commerciale e non etica*)."
      }
    ],
    softSkill: "EticaProfessionale, FidelizzazioneDelCliente",
    characteristics: "Etica, Fidelizzazione del Cliente, Processo Decisionale Etico"
  },
  {
    num: 133,
    scenario: "Per dispetto, all'ultimo minuto \"cambiano le regole del gioco\". Come reagisci?",
    instructions: [
      "Immagine di una scacchiera rovesciata con i pezzi sparsi ovunque,  frustrazione e rifiuto del cambiamento improvviso,  tabula rasa rabbiosa.",
      "Immagine di mani che riordinano con cura i pezzi sulla scacchiera,  riorganizzazione \"forzata\" e  un po'ansiosa per adattarsi.",
      "Immagine di una strategia di attacco sulla scacchiera,  adattamento strategico e  flessibile alle nuove regole,  cambiamento come \"sfida\" stimolante.",
      "Immagine di una persona che prende una nuova scacchiera \"innovativa\" e abbandona la vecchia senza rimpianti,  entusiasmo per il cambiamento radicale e  le nuove opportunità."
    ],
    captions: [
      "Mi Ribello",
      "Riorganizzo i Pezzi",
      "Nuova Strategia",
      "Propongo Nuovo Gioco"
    ],
    options: [
      {
        value: "Mi Ribello",
        text: "(Negativo: bassa tolleranza al cambiamento improvviso e reazione emotiva negativa e distruttiva, mancanza di flessibilità e adattabilità, percezione di ingiustizia e caos, approccio rigido e non costruttivo di fronte all'imprevisto) (Positivo: reazione assertiva e non passiva, affermazione netta del proprio disappunto, non sottomissione al cambiamento imposto, approccio non remissivo e non attendista, reazione forte anche se negativa e non costruttiva)."
      },
      {
        value: "Riorganizzo i Pezzi",
        text: "(Positivo: adattabilità di base al cambiamento e volontà di non arrendersi e trovare una soluzione pur in condizioni di incertezza e stress, approccio volenteroso e non completamente passivo, impegno a riorganizzarsi pur in una situazione scomoda e non ideale) (Negativo: stress e ansia percepiti e adattamento faticoso e non pienamente naturale o fluido, percezione di sforzo e disagio, fiducia in sé stessi non piena o incrinata di fronte all'imprevisto, approccio reattivo e non proattivo o entusiasta di fronte al cambiamento inatteso)."
      },
      {
        value: "Nuova Strategia",
        text: "(Positivo: resilienza attiva e proattiva e adattamento strategico e flessibile, cambiamento percepito come sfida positiva e stimolante, approccio problem-solving e challenge-oriented, persona percepita come dinamica e adattabile) (Negativo: potenziale minimizzazione delle difficoltà altrui e rischio di apparire superficiale o eccessivamente entusiasta di fronte a situazioni che possono generare reale disagio o difficoltà negli altri, percezione di approccio forse non sempre pienamente empatico o sensibile alle emozioni altrui di fronte al cambiamento imposto)."
      },
      {
        value: "Propongo Nuovo Gioco",
        text: "(Positivo: massima fiducia in sé stessi e nel cambiamento e entusiasmo contagioso e proattivo verso la novità, visione del cambiamento come opportunità e sfida positiva, approccio dinamico e innovativo e future-oriented, persona percepita come carismatica e visionaria) (Negativo: potenziale sottovalutazione difficoltà concrete del cambiamento e rischio di apparire eccessivamente ottimista o idealista, percezione di approccio non sempre realista o pragmatico, mancanza di attenzione alle resistenze e paure altrui di fronte al cambiamento imposto o non desiderato)."
      }
    ],
    softSkill: "FiduciaInSeStessi, GestioneDelCambiamento",
    characteristics: "Resilienza, Adattabilità, Ottimismo, Gestione del Cambiamento"
  },
  {
    num: 134,
    scenario: "\"Non mi serviva questo, grazie\". Come reagisci?",
    instructions: [
      "Immagine di una persona che si tappa le orecchie con le mani,  rifiuto totale di ascoltare l'obiezione del cliente,  chiusura difensiva.",
      "Immagine di una persona che parla \"sopra\" la voce del cliente,  interrompendo e  sovrapponendosi per \"contro-battere\" all'obiezione,  non ascolto attivo ma \"contro-replica\" immediata.",
      "Immagine di una persona che si avvicina al cliente con un orecchio teso in avanti,  ascolto attivo e  focalizzato sulla \"voce\" del cliente per capire l'obiezione.",
      "Immagine di una persona che getta via il feedback del cliente in un cestino,  rifiuto totale del feedback \"negativo\",  \"cestinamento\" dell'obiezione."
    ],
    captions: [
      "Ti Serve, Fidati",
      "Pensavo ti Servisse",
      "Spiegami Per Favore",
      "Provalo, Usalo, Casomai lo Riprendo"
    ],
    options: [
      {
        value: "Ti Serve, Fidati",
        text: "(Negativo: mancanza di ascolto attivo e rifiuto feedback cliente, non gestione obiezioni e perdita opportunità di miglioramento, percezione di chiusura e non volontà di capire il punto di vista altrui) (Positivo: massima sicurezza delle proprie convinzioni e evitamento dubbi e crisi, approccio assertivo negativamente e non influenzabilità dal feedback negativo, mantenimento integrità delle proprie certezze, *ma positivo solo in ottica di rigidità e chiusura e non di crescita e miglioramento*)."
      },
      {
        value: "Pensavo ti Servisse",
        text: "(Negativo: mancanza di ascolto attivo reale e approccio contro-argomentativo che non crea un dialogo costruttivo, rischio di alienare il cliente e non risolvere l'obiezione, percezione di persona poco empatica e non orientata al cliente) (Positivo: massima velocità di reazione e approccio reattivo e pronto alla difesa, affermazione immediata della propria posizione, non si lascia incalzare dalle obiezioni, persona percepita come pronta e reattiva, *ma positivo solo in ottica di prontezza difensiva e non di costruttività e dialogo*)."
      },
      {
        value: "Spiegami Per Favore",
        text: "(Positivo: massimo ascolto attivo e vera attenzione al cliente e approccio empatico e orientato alla comprensione profonda delle ragioni altrui, volontà di capire prima di replicare, persona percepita come attenta e curiosa) (Negativo: richiede tempo per l'ascolto attivo e risposta non immediata, potenziale percezione di lentezza nella reazione difensiva, approccio forse non sempre ottimizzato per la velocità e l'immediatezza della contro-replica, priorità all'ascolto e alla comprensione profonda prima di reagire velocemente)."
      },
      {
        value: "Provalo, Usalo, Casomai lo Riprendo",
        text: "(Positivo: massima efficacia nella gestione dell'obiezione e superamento della resistenza del cliente, conversione dell'obiezione in opportunità di vendita, dimostrazione di competenza consulenziale superiore, creazione di valore aggiunto per il cliente oltre il prodotto) (Negativo: richiede alta competenza consulenziale non sempre replicabile e potenziale minore scalabilità per obiezioni standard, investimento di tempo e risorse maggiore, percezione di approccio non sempre ottimizzato per la velocità e la scalabilità massiva del processo di vendita standardizzato)."
      }
    ],
    softSkill: "AscoltoAttivo, GestioneDelleObiezioni",
    characteristics: "Ascolto Attivo, Gestione delle Obiezioni, Reazione al Feedback Negativo"
  },
  {
    num: 135,
    scenario: "Disegno a Mano contro Grafica Computerizzata Schierati",
    instructions: [
      "Immagine di una mano d'artista che traccia un segno intenso e materico con carboncino su carta ruvida,  anima e autenticità del tratto manuale.",
      "Immagine di una mano che digitalizza uno schizzo su uno schermo,  integrazione tra manualità e digitale,  tradizione che si evolve.",
      "Immagine di una tavoletta grafica con uno stilo che crea linee vettoriali nitide e precise,  precisione e versatilità del digitale,  innovazione \"pulita\".",
      "Immagine di un'opera d'arte vettoriale astratta e futuristica con colori vibranti e linee dinamiche,  potenziale illimitato e avanguardia del digitale,  superamento dei \"limiti\" del tratto manuale."
    ],
    captions: [
      "Anima nel Sacrificio",
      "Cuore e Cervello",
      "Precisione Vettoriale",
      "Oltre i Limiti Umani"
    ],
    options: [
      {
        value: "Anima nel Sacrificio",
        text: "(Positivo: massima valorizzazione autenticità e unicità del tratto manuale e focus sull'espressività artistica pura e non mediata dalla tecnologia, approccio romantico e nostalgico che celebra la vera arte artigianale, persona percepita come tradizionalista e purista) (Negativo: potenziale chiusura all'innovazione digitale e rischio di rigidità e immobilismo, percezione di approccio superato o non al passo coi tempi, mancanza di apertura verso le opportunità offerte dal digitale in ambito artistico e creativo)."
      },
      {
        value: "Cuore e Cervello",
        text: "(Positivo: approccio ibrido e versatile che unisce anima della tradizione e forza dell'innovazione, ricerca di un equilibrio tra passato e futuro, valorizzazione sia della manualità che del digitale, persona percepita come equilibrata e pragmatica) (Negativo: potenziale mancanza di radicalità e profondità in nessuna delle due direzioni e rischio di approccio moderato che non eccelle né nell'uno né nell'altro, percezione di tiepidezza o mancanza di slancio verso un approccio estremo e non convenzionale in nessuna direzione, approccio forse non sempre ottimizzato per la massima specializzazione e distintività in un campo specifico estremo)."
      },
      {
        value: "Precisione Vettoriale",
        text: "(Positivo: massima valorizzazione di precisione e nitidezza e versatilità del digitale e approccio moderno e orientato all'efficienza e alla chiarezza comunicativa, massimizzazione della pulizia formale e della scalabilità e adattabilità del prodotto digitale, persona percepita come moderna ed efficiente) (Negativo: potenziale mancanza di calore umano e emotività e rischio di approccio percepito come freddo o eccessivamente razionale e distaccato, mancanza di imperfezione artistica voluta e ricercata come valore aggiunto espressivo e autentico, approccio forse non sempre ottimizzato per la massima espressività emotiva e artistica pura e non mediata dalla freddezza della tecnologia vettoriale)."
      },
      {
        value: "Oltre i Limiti Umani",
        text: "(Positivo: massima apertura all'innovazione radicale e visione futurista e senza limiti, entusiasmo per le nuove frontiere del digitale e superamento dei vincoli del passato, approccio avanguardista e visionario, persona percepita come coraggiosa e innovativa) (Negativo: potenziale distacco dalla tradizione artistica manuale e rischio di eccessivo entusiasmo acritico per la tecnologia fine a sé stessa, percezione di approccio non radicato in una storia artistica personale e autentica, mancanza di calore umano e profondità emotiva potenzialmente sacrificate sull'altare dell'innovazione tecnologica pura e fredda)."
      }
    ],
    softSkill: "Innovazione, MenteAperta",
    characteristics: "Apertura all'Innovazione, Stile Creativo, Propensione al Digitale"
  }
];