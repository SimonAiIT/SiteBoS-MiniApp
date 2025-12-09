import { Question } from "../types";

export const questions106to110: Question[] = [
  {
    num: 106,
    scenario: "Immagina che suoni l'allarme antincendio in ufficio. Qual è la tua reazione immediata?",
    instructions: [
      "Immagine di una persona che segue un flusso di persone ordinate verso l'uscita di sicurezza,  evacuazione calma e disciplinata.",
      "Immagine di una persona che indica la via d'uscita ad altri colleghi,  guida gli altri verso la salvezza.",
      "Immagine di una persona che alza il telefono per fare una chiamata,  verifica la situazione prima di agire.",
      "Immagine di una persona seduta tranquillamente alla scrivania che ignora la sirena,  indifferenza al pericolo."
    ],
    captions: [
      "Fuga Organizzata",
      "Guida gli Altri",
      "Verifica Prima di Uscire",
      "Resto al Mio Posto"
    ],
    options: [
      {
        value: "Fuga Organizzata",
        text: "(Positivo: massima priorità alla sicurezza, efficienza nell'evacuazione, calma e disciplina, rispetto delle procedure di sicurezza, approccio responsabile e affidabile in emergenza) (Negativo: potenziale mancanza di iniziativa personale, rischio di passività di fronte a situazioni complesse, percezione di leadership non spiccata in emergenza, approccio un po' gregario e dipendente dalle direttive altrui)."
      },
      {
        value: "Guida gli Altri",
        text: "(Positivo: massima attenzione alla sicurezza altrui, leadership proattiva in emergenza, altruismo e senso di responsabilità verso il team, percezione di persona coraggiosa, altruista e leader) (Negativo: potenziale rischio per la propria sicurezza, rischio di sottovalutare i pericoli individuali, percezione di eccessivo eroismo o non sempre prudenza nella gestione dei rischi personali in emergenza)."
      },
      {
        value: "Verifica Prima di Uscire",
        text: "(Positivo: approccio cauto e ponderato, importanza data alla verifica delle informazioni prima di agire, razionalità e controllo della situazione, percezione di persona riflessiva, pragmatica e non impulsiva) (Negativo: potenziale perdita di tempo prezioso in emergenza, rischio di ritardare l'evacuazione, percezione di lentezza decisionale, eccessiva razionalità in contesti che richiederebbero maggiore istintività e rapidità d'azione)."
      },
      {
        value: "Resto al Mio Posto",
        text: "(Negativo: sottovalutazione del pericolo, inosservanza protocolli sicurezza, potenziale comportamento rischioso per sé e per gli altri, percezione di persona negligente, inconsapevole del pericolo o eccessivamente sicura di sé e poco prudente) (Positivo: calma e sangue freddo, mantenimento della produttività, approccio stoico e focalizzato, non si lascia distrarre dal panico, massimizzazione dell'efficienza immediata, apparente coraggio di fronte al pericolo, *ma positivo solo in apparenza e non in termini di sicurezza reale*)."
      }
    ],
    softSkill: "SicurezzaSulLavoro, GestioneDelloStress",
    characteristics: "Consapevolezza Sicurezza sul Lavoro, Valutazione del Rischio, Responsabilità"
  },
  {
    num: 107,
    scenario: "Noti un collega che viola le norme di sicurezza sul lavoro. Come reagisci?",
    instructions: [
      "Immagine di uno struzzo che nasconde la testa sotto la sabbia,  ignora la violazione per non intervenire.",
      "Immagine di qualcuno che dà una leggera \"gomitata\" di lato al collega,  segnalazione indiretta e poco invasiva.",
      "Immagine di un vigile urbano che indica la strada con un gesto chiaro e gentile,  richiamo diretto ma educato alle regole.",
      "Immagine di una mano che tira con forza la leva dell'allarme antincendio,  segnalazione immediata e formale ai superiori."
    ],
    captions: [
      "Faccio Finta di Niente",
      "Un Segnale Discreto",
      "Richiamo con Gentilezza",
      "Allarme Immediato"
    ],
    options: [
      {
        value: "Faccio Finta di Niente",
        text: "(Negativo:  negligenza sicurezza e evitamento confronto, mancanza di senso di responsabilità, potenziale rischio per la sicurezza altrui, percezione di irresponsabilità e superficialità) (Positivo:  evitamento conflitti interpersonali e mantenimento di un clima di lavoro disteso, approccio \"laissez-faire\" e non giudicante, rispetto apparente autonomia altrui)."
      },
      {
        value: "Un Segnale Discreto",
        text: "(Positivo: approccio non confrontazionale e tentativo di risolvere il problema in modo soft, attenzione alla relazione con il collega e volontà di evitare pubblicità negativa e imbarazzo, approccio diplomatico) (Negativo: inefficacia potenziale del segnale indiretto, rischio di fraintendimento, mancanza di chiarezza e incisività, percezione di scarsa determinazione nel far rispettare le regole e proteggere la sicurezza)."
      },
      {
        value: "Richiamo con Gentilezza",
        text: "(Positivo: approccio diretto ma educato e comunicazione chiara delle regole, attenzione sia alla sicurezza che alla relazione con il collega e ricerca di una soluzione collaborativa e non aggressiva, percezione di persona responsabile, educata e assertiva al punto giusto) (Negativo: potenziale mancanza di incisività con colleghi non collaborativi, rischio di perdita di tempo in situazioni urgenti, percezione di approccio forse non sempre sufficientemente fermo e risolutivo in contesti che richiederebbero maggiore autorità e rapidità d'azione)."
      },
      {
        value: "Allarme Immediato",
        text: "(Positivo: massima priorità alla sicurezza, applicazione rigorosa dei protocolli, garanzia di intervento immediato e tutela della sicurezza collettiva, percezione di persona responsabile, affidabile e orientata alla sicurezza e al rispetto delle regole) (Negativo: potenziale rigidità percepita, burocraticità eccessiva, rischio di clima di lavoro teso o eccessivamente controllato, percezione di approccio poco flessibile e non sempre attento alle dinamiche relazionali e al contesto umano)."
      }
    ],
    softSkill: "SicurezzaSulLavoro, ResponsabilitaSociale",
    characteristics: "Consapevolezza Sicurezza sul Lavoro, Responsabilità, Assertività"
  },
  {
    num: 108,
    scenario: "Noti una falla nella sicurezza del tuo posto di lavoro. Come ti muovi?",
    instructions: [
      "Immagine di una persona con gli occhi bendati che cammina oltre la porta aperta,  ignora il problema,  non si sente responsabile.",
      "Immagine di qualcuno che alza le spalle con noncuranza di fronte alla porta aperta,  segnalazione informale ma senza impegno attivo.",
      "Immagine di una persona che chiude la porta e gira la chiave con decisione,  iniziativa personale per risolvere il problema.",
      "Immagine di una mano che suona una sirena d'allarme per segnalare il problema,  segnalazione formale e immediata alle autorità competenti."
    ],
    captions: [
      "Occhi Chiusi",
      "Alzata di Spalle",
      "Chiave in Mano",
      "Sirena di Allarme"
    ],
    options: [
      {
        value: "Occhi Chiusi",
        text: "(Negativo: mancanza di responsabilità e negligenza sicurezza, indifferenza e potenziale rischio per la sicurezza aziendale, percezione di superficialità e menefreghismo) (Positivo: efficienza personale immediata, evitamento rogne, approccio minimalista, focalizzazione sulle proprie attività core, massimizzazione tempo personale)."
      },
      {
        value: "Alzata di Spalle",
        text: "(Negativo: mancanza di follow-through e rischio che il problema non venga risolto, responsabilità diluita, percezione di consapevolezza incompleta o mancanza di reale senso di responsabilità attivo e concreto) (Positivo: segnalazione minima del problema, approccio collaborativo informale, non si carica di eccessive responsabilità, mantiene una certa leggerezza, consapevolezza di base senza eccessivo coinvolgimento personale)."
      },
      {
        value: "Chiave in Mano",
        text: "(Positivo: massima iniziativa personale e proattività, risoluzione diretta del problema, forte senso di responsabilità e attenzione alla sicurezza, percezione di persona efficiente, responsabile e problem-solver concreto e affidabile) (Negativo: potenziale cortocircuito delle procedure formali, rischio di non informare figure responsabili, approccio individualista, percezione di scarsa attenzione alle gerarchie formali e ai protocolli di sicurezza, eccessiva iniziativa personale che potrebbe non essere sempre coordinata)."
      },
      {
        value: "Sirena di Allarme",
        text: "(Positivo: massima priorità alla sicurezza e applicazione rigorosa dei protocolli, garanzia di intervento formale e strutturato, tutela della sicurezza collettiva e rispetto delle procedure, percezione di persona responsabile, affidabile e orientata alla sicurezza e al rispetto delle regole e procedure formali e aziendali) (Negativo: potenziale eccessiva burocratizzazione, rischio di lentezza nella risoluzione pratica del problema, percezione di rigidità procedurale, eccessiva dipendenza dai protocolli formali e non sempre azione diretta e immediata, approccio forse non sempre ottimizzato per l'efficienza e la rapidità di risoluzione pratica del problema immediato)."
      }
    ],
    softSkill: "SicurezzaSulLavoro, ResponsabilitaSociale",
    characteristics: "Consapevolezza Sicurezza sul Lavoro, Responsabilità, Proattività"
  },
  {
    num: 109,
    scenario: "Quando cammini in città, quanto sei \"in allerta\" per la tua sicurezza personale?",
    instructions: [
      "Immagine di un sonnambulo che cammina ad occhi chiusi,  totale inconsapevolezza del pericolo.",
      "Immagine di un cavallo con i paraocchi che limita la visione laterale,  consapevolezza parziale e limitata.",
      "Immagine di un suricato che scruta l'orizzonte vigile ma sereno,  attenzione vigile ma rilassata.",
      "Immagine di una molla compressa al massimo,  iper-vigilanza e tensione costante."
    ],
    captions: [
      "Sonnambulo Distratto",
      "Paraocchi Sociali",
      "Suricato Sentinella",
      "Molla Tesa"
    ],
    options: [
      {
        value: "Sonnambulo Distratto",
        text: "Bassa consapevolezza della sicurezza personale in pubblico,  potenzialmente negligente e vulnerabile ai rischi (negativo:  scarsa consapevolezza sicurezza,  negligenza,  vulnerabilità ai rischi,  percezione di imprudenza e  superficialità),  ma  vive il momento senza preoccupazioni e  si gode la \"passeggiata\" senza ansie e  approccio \"spensierato\" e  fiducioso (positivo:  spensieratezza,  godimento del momento presente,  assenza di ansia,  approccio \"leggero\",  fiducia nell'ambiente circostante,  non si lascia condizionare dalla \"paura\")."
      },
      {
        value: "Paraocchi Sociali",
        text: "Moderata consapevolezza dell'ambiente circostante,  ma le distrazioni possono ridurre il tempo di reazione alle minacce,  moderata consapevolezza della sicurezza (positivo:  moderata attenzione all'ambiente,  equilibrio tra vigilanza e  relax,  consapevolezza \"sufficiente\" senza eccessivo allarmismo,  approccio \"normale\" e  \"non paranoico\"),  ma  le distrazioni possono ridurre la prontezza di riflessi e  aumentare il rischio di imprevisti e  essere percepito come  non sempre \"sufficientemente\" attento o  un po' \"distratto\" in situazioni potenzialmente rischiose (negativo:  potenziale riduzione prontezza di riflessi per distrazioni,  rischio di imprevisti per minore attenzione,  percezione di attenzione \"moderata\" ma non \"massima\",  approccio forse non sempre \"ottimale\" in termini di \"prevenzione\" e  \"sicurezza proattiva\")."
      },
      {
        value: "Suricato Sentinella",
        text: "Bilancia consapevolezza e comfort,  generalmente attento all'ambiente circostante senza essere eccessivamente ansioso,  buona consapevolezza della sicurezza (positivo:  buona consapevolezza del contesto,  equilibrio tra attenzione e  relax,  vigilanza \"attiva\" ma non \"ansiosa\",  approccio \"responsabile\" e  \"consapevole\" senza eccessi,  percezione di persona \"attenta\" e  \"presente\" ma non \"paranoica\"),  ma  l'attenzione \"rilassata\" potrebbe non cogliere segnali di pericolo \"subdoli\" o  \"molto rapidi\" e  non massimizzare la \"reattività\" in caso di emergenza improvvisa e  essere percepito come  non sempre \"iper-vigilante\" o  pronto a reagire \"fulmineamente\" in situazioni di pericolo \"estremo\" (negativo:  potenziale minore reattività di fronte a pericoli \"improvvisi\" o  \"subdoli\",  rischio di non intercettare segnali di allarme \"impercettibili\" ad un occhio \"non allenato\" all'iper-vigilanza,  percezione di vigilanza \"buona\" ma non \"massima\" in contesti di pericolo \"estremo\" e  \"immediato\")."
      },
      {
        value: "Molla Tesa",
        text: "Estremamente attento alla sicurezza,  costantemente in allerta,  potenzialmente ansioso o eccessivamente cauto nelle situazioni quotidiane (positivo:  massima attenzione alla sicurezza,  iper-vigilanza e  massima \"prontezza\" di reazione di fronte al pericolo,  approccio \"iper-protettivo\" e  orientato alla \"prevenzione assoluta\",  percezione di persona estremamente \"attenta\",  \"responsabile\" e  \"pronta\" a reagire in emergenza \"estrema\"),  ma  potrebbe vivere in uno stato di ansia costante e  percepire pericoli ovunque e  essere percepito come  eccessivamente \"paranoico\" o  stressato e  non godersi appieno la \"passeggiata\" e  vivere il quotidiano con eccessiva tensione e  allarmismo (negativo:  stress e ansia elevati,  percezione di paranoia,  eccessiva cautela limitante,  approccio \"iper-vigilante\" che può diventare \"stressante\" e  \"controproducente\" nel lungo periodo per il benessere psicofisico,  mancanza di \"leggerezza\" e  \"spontaneità\" nel vivere il quotidiano)."
      }
    ],
    softSkill: "SicurezzaSulLavoro, GestioneDelloStress",
    characteristics: "Consapevolezza Sicurezza, Valutazione del Rischio, Livelli di Stress"
  },
  {
    num: 110,
    scenario: "L'azienda introduce nuove difese sicurezza informatica. Come ti poni?",
    instructions: [
      "Immagine di un cavaliere che indossa subito e con entusiasmo una nuova armatura scintillante,  adozione proattiva e immediata delle nuove difese.",
      "Immagine di un cavaliere che esamina attentamente l'armatura nuova,  leggendo le istruzioni prima di indossarla,  approccio cauto e  ponderato.",
      "Immagine di un cavaliere che chiede aiuto a uno scudiero per indossare l'armatura,  ricerca di supporto esterno per l'implementazione.",
      "Immagine di un cavaliere che rifiuta l'armatura e continua a combattere senza protezioni,  resistenza al cambiamento e rifiuto delle nuove difese."
    ],
    captions: [
      "Armatura Subito Indossata",
      "Armatura Sotto Esame",
      "Aiuto per Indossare",
      "Armatura Rifiutata"
    ],
    options: [
      {
        value: "Armatura Subito Indossata",
        text: "(Positivo: massima proattività e velocità nell'adottare le nuove difese, forte senso di responsabilità verso la sicurezza, approccio reattivo e all'avanguardia, persona percepita come sul pezzo e attenta alla protezione) (Negativo: potenziale mancanza di analisi critica approfondita, rischio di adozione acritica di mode o soluzioni non sempre ottimali, percezione di entusiasmo ingenuo o non sempre basato su valutazione razionale e ponderata)."
      },
      {
        value: "Armatura Sotto Esame",
        text: "(Positivo: approccio cauto e ponderato, attenzione ai dettagli e alla comprensione profonda delle nuove misure, valutazione accurata prima dell'implementazione, persona percepita come responsabile, attenta e metodica) (Negativo: potenziale lentezza nell'implementazione, rischio di ritardare l'adozione di misure urgenti, percezione di eccessiva cautela o lentezza decisionale, mancanza di agilità e velocità di reazione di fronte a nuove minacce e cambiamenti rapidi)."
      },
      {
        value: "Aiuto per Indossare",
        text: "(Positivo: riconoscimento dell'importanza della competenza specialistica e ricerca di supporto qualificato, approccio collaborativo e orientato al team e volontà di delegare a esperti e non improvvisare, persona percepita come intelligente che sa delegare e valorizzare le competenze altrui) (Negativo: potenziale dipendenza da supporto esterno, rischio di non sviluppare autonomia e competenza personale, percezione di dipendenza e non piena autosufficienza nella gestione della sicurezza in prima persona)."
      },
      {
        value: "Armatura Rifiutata",
        text: "(Negativo: resistenza al cambiamento e sottovalutazione importanza sicurezza, potenziale vulnerabilità a minacce cyber, approccio negativo verso l'innovazione e il miglioramento della sicurezza, percezione di persona refrattaria al cambiamento, poco collaborativa e non sempre affidabile in termini di sicurezza aziendale) (Positivo: apparente semplificazione operativa nel breve termine, evitamento complicazioni procedurali immediate, mantenimento routine consolidate, massimizzazione apparente efficienza operativa immediata, *ma positivo solo nel brevissimo termine e non in ottica di sicurezza e prevenzione a lungo termine*)."
      }
    ],
    softSkill: "SicurezzaDigitale, Adattabilita",
    characteristics: "Consapevolezza Cybersecurity, Adattabilità a Nuovi Protocolli, Proattività"
  }
];

export const questions111to115: Question[] = [
  {
    num: 111,
    scenario: "Ricevi una email sospetta che ti chiede le credenziali di accesso. Come reagisci?",
    instructions: [
      "Immagine di un aspirapolvere che \"risucchia\" immediatamente l'email sospetta,  eliminazione istantanea e senza esitazione.",
      "Immagine di un buttafuori corpulento che blocca l'accesso all'email,  marchio come spam e blocco proattivo.",
      "Immagine di una detective che esamina la email sospetta con una lente d'ingrandimento e la passa ad un superiore,  inoltro agli esperti per la verifica.",
      "Immagine del vaso di Pandora appena aperto da cui escono fumo e ombre minacciose,  apertura \"cautelativamente curiosa\" ma rischiosa."
    ],
    captions: [
      "Aspirapolvere",
      "Buttafuori",
      "Detective",
      "Apertura Curiosa"
    ],
    options: [
      {
        value: "Aspirapolvere",
        text: "(Positivo: massima priorità alla sicurezza e decisione rapida e netta,  evitamento di ogni potenziale rischio e approccio \"zero tolerance\" verso minacce cyber,  persona percepita come pragmatica, efficiente e orientata alla protezione) (Negativo: potenziale mancanza di approfondimento della minaccia e rischio di non imparare dalla minaccia stessa,  percezione di approccio eccessivo o troppo drastico e mancanza di curiosità investigativa e analisi più approfondita)."
      },
      {
        value: "Buttafuori",
        text: "(Positivo: proattività nella sicurezza e prevenzione di future minacce,  approccio orientato alla difesa proattiva e implementazione di barriere di sicurezza preventive e future-proof, persona percepita come previdente e attenta alla sicurezza a lungo termine) (Negativo: potenziale superficialità nell'analisi della minaccia specifica e rischio di non cogliere dettagli utili dalla singola email,  percezione di approccio generico e non sempre mirato alla minaccia specifica, eccessiva enfasi sulla prevenzione di massa a scapito dell'analisi puntuale)."
      },
      {
        value: "Detective",
        text: "(Positivo: delega appropriata a esperti e valorizzazione del team di sicurezza IT, rispetto dei protocolli aziendali e approccio collaborativo e strutturato,  persona percepita come responsabile che sa delegare e valorizzare le competenze altrui) (Negativo: potenziale ritardo nella risposta alla minaccia e rischio di dipendenza eccessiva da supporto esterno,  percezione di non piena autonomia e competenza personale in materia di sicurezza, approccio forse non sempre ottimizzato per la velocità di reazione e l'azione immediata)."
      },
      {
        value: "Apertura Curiosa",
        text: "(Negativo: alto rischio di cadere vittima di truffe cyber e imprudenza e ingenuità, esposizione volontaria a pericoli reali,  percezione di scarsa consapevolezza del rischio e approccio non sicuro e potenzialmente autolesionista in termini di sicurezza informatica, curiosità pericolosa e non sempre utile) (Positivo: curiosità intellettuale e desiderio di approfondire la conoscenza delle minacce cyber e approccio investigativo e proattivo nella comprensione del pericolo e volontà di non ignorare potenziali minacce, *ma positivo con riserva etica e di sicurezza*)."
      }
    ],
    softSkill: "SicurezzaDigitale, SicurezzaSulLavoro",
    characteristics: "Consapevolezza Cybersecurity, Valutazione del Rischio, Proattività"
  },
  {
    num: 112,
    scenario: "Ricevi una richiesta di amicizia sui social da uno sconosciuto con \"amici in comune\". Come ti comporti?",
    instructions: [
      "Immagine di una porta che si apre completamente e senza esitazione,  accettazione immediata senza filtri.",
      "Immagine di una porta socchiusa con una persona che spia da dietro,  accettazione cauta dopo una rapida \"sbirciatina\" al profilo.",
      "Immagine di due persone che parlano sottovoce \"chiedendo referenze\" prima di aprire la porta,  verifica tramite \"amici in comune\" prima di accettare.",
      "Immagine di una porta blindata con catenaccio e spioncino chiuso,  rifiuto netto e priorità assoluta alla privacy."
    ],
    captions: [
      "Porta Sempre Aperta",
      "Sbircio il Profilo",
      "Chiedo Referenze",
      "Porta Blindata"
    ],
    options: [
      {
        value: "Porta Sempre Aperta",
        text: "(Positivo: massima apertura sociale e facilità a creare nuove connessioni, approccio fiducioso e open-minded verso gli altri, valorizzazione del networking e delle relazioni sociali ampie) (Negativo: potenziale rischio per la privacy e ingenuità, eccessiva apertura indiscriminata e scarsa selettività, vulnerabilità potenziale a truffe o profili fake)."
      },
      {
        value: "Sbircio il Profilo",
        text: "(Positivo: cautela ragionevole e attenzione minima alla sicurezza online, approccio pragmatico che bilancia apertura sociale e prudenza, persona percepita come normale e non paranoica, gestione equilibrata della privacy) (Negativo: protezione non massima e rischio residuo di accettare profili fake ben costruiti, percezione di cautela moderata ma non estrema, valutazione del rischio forse non sempre approfondita)."
      },
      {
        value: "Chiedo Referenze",
        text: "(Positivo: massima prudenza e verifica tramite fonti fidate, approccio responsabile e orientato alla sicurezza informata, riduzione del rischio di accettare profili fake o non affidabili, persona percepita come accorta e responsabile) (Negativo: potenziale perdita di nuove connessioni valide per eccessiva cautela, rischio di eccessiva dipendenza dal giudizio altrui, percezione di diffidenza o non sempre spontaneità nelle nuove relazioni, approccio forse un po' troppo prudente e controllato a livello sociale)."
      },
      {
        value: "Porta Blindata",
        text: "(Positivo: massima protezione della privacy online e approccio iper-protettivo e orientato alla sicurezza massima, riduzione del rischio di contatti indesiderati o minacce alla privacy, persona percepita come estremamente attenta e responsabile) (Negativo: potenziale isolamento sociale online e mancanza di networking, perdita di opportunità relazionali, percezione di eccessiva chiusura, diffidenza e rigidità sociale online, approccio forse non sempre ottimale in termini di apertura e networking professionale o sociale)."
      }
    ],
    softSkill: "SicurezzaDigitale, RelazioniInterpersonali",
    characteristics: "Consapevolezza Privacy Online, Abitudini di Networking Sociale, Valutazione del Rischio"
  },
  {
    num: 113,
    scenario: "Devi fare un acquisto. Quanto \"tiri sul prezzo\" di solito?",
    instructions: [
      "Immagine di una mano che porge dei soldi senza contrattare,  accetta il prezzo senza discutere.",
      "Immagine di una mano che indica il prezzo con un'espressione interrogativa,  chiede un piccolo sconto con educazione.",
      "Immagine di due mani che si stringono sopra un contratto,  negoziazione moderata e \"win-win\".",
      "Immagine di un avvoltoio che stringe tra gli artigli un sacco di monete,  negoziazione aggressiva e spietata per il prezzo minimo."
    ],
    captions: [
      "Paga e Non Chiede",
      "Chiede un Favore",
      "Stretta di Mano Affare Fatto",
      "Avvoltoio Affamato"
    ],
    options: [
      {
        value: "Paga e Non Chiede",
        text: "(Positivo: semplicità e rapidità nell'acquisto, evitamento dello stress della negoziazione, valorizzazione della comodità e del tempo, persona percepita come diretta e senza fronzoli) (Negativo: mancanza di risparmio potenziale e spreco di denaro evitabile, percezione di scarsa attenzione al value for money, eccessiva fiducia o ingenuità commerciale)."
      },
      {
        value: "Chiede un Favore",
        text: "(Positivo: approccio educato e non conflittuale, rispetto per il venditore e per le regole del gioco, tentativo di ottenere un piccolo vantaggio senza forzare la mano, persona percepita come cortese e non aggressiva commercialmente) (Negativo: risparmio limitato e non massimizzazione del potenziale di sconto, percezione di scarsa abilità negoziale o eccessiva timidezza commerciale, non sempre ottimizzazione del value for money)."
      },
      {
        value: "Stretta di Mano Affare Fatto",
        text: "(Positivo: approccio negoziale equilibrato e ricerca di un giusto prezzo, capacità di dialogare con il venditore per un accordo reciprocamente vantaggioso, persona percepita come abile nella negoziazione win-win e orientata alla soddisfazione reciproca) (Negativo: potenziale non massimizzazione del risparmio estremo e rischio di non ottenere il prezzo minimo di mercato, percezione di scarsa aggressività commerciale o eccessiva enfasi sul compromesso e relazione a scapito del prezzo migliore)."
      },
      {
        value: "Avvoltoio Affamato",
        text: "(Positivo: massimizzazione del risparmio e capacità di ottenere sempre il prezzo minimo possibile, approccio aggressivo e senza compromessi nella negoziazione, persona percepita come abile, determinata e orientata al risultato economico massimo) (Negativo: rischio di danneggiare relazioni commerciali e percezione di aggressività eccessiva e spietatezza, clima di tensione e conflittualità, approccio non sempre orientato alla relazione positiva e collaborativa, potenziale danno reputazionale se percepito come eccessivamente avido o sfruttatore)."
      }
    ],
    softSkill: "Negoziazione, VenditaConsultiva",
    characteristics: "Stile di Negoziazione, Assertività, Sensibilità al Prezzo"
  },
  {
    num: 114,
    scenario: "Pensa a come il tuo lavoro genera \"acqua\" per l'azienda.",
    instructions: [
      "Immagine di una sorgente d'acqua nascosta sottoterra,  lavoro interno senza fatturazione diretta,  ruolo di supporto \"invisibile\".",
      "Immagine di un piccolo affluente che si unisce a un fiume più grande,  lavoro connesso indirettamente alla fatturazione,  possibile contributo indiretto.",
      "Immagine del flusso principale di un fiume che alimenta un sistema di irrigazione,  lavoro essenziale per prodotti fatturabili,  contributo diretto alla \"produzione di acqua\".",
      "Immagine di un rubinetto che eroga acqua direttamente in un bicchiere,  lavoro direttamente fatturato al cliente,  generazione diretta di \"acqua\"."
    ],
    captions: [
      "Sorgente Nascosta",
      "Affluente Indiretto",
      "Flusso Principale",
      "Rubinetto Diretto"
    ],
    options: [
      {
        value: "Sorgente Nascosta",
        text: "(Positivo: ruolo essenziale dietro le quinte e supporto fondamentale alle funzioni front-line, contribuisce indirettamente ma in modo cruciale al successo aziendale complessivo, approccio disinteressato e orientato al supporto silenzioso ma indispensabile) (Negativo: mancanza di visibilità diretta del contributo al fatturato e potenziale percezione di ruolo meno centrale o meno riconosciuto in termini di generazione di ricchezza, soddisfazione indiretta e meno tangibile)."
      },
      {
        value: "Affluente Indiretto",
        text: "(Positivo: contribuisce alla generazione di valore complessivo e fornisce un apporto indiretto ma rilevante al flusso di entrate, approccio collaborativo e orientato al supporto attivo delle funzioni core e front-line, percezione di ruolo importante anche se non direttamente visibile in termini di fatturato diretto) (Negativo: legame indiretto con il fatturato e misurabilità meno diretta della performance economica, potenziale percezione di ruolo meno centrale in termini di generazione di ricchezza diretta, soddisfazione legata a risultati indiretti e meno tangibili)."
      },
      {
        value: "Flusso Principale",
        text: "(Positivo: contribuisce in modo diretto e misurabile alla creazione di prodotti e servizi fatturabili, ruolo centrale nella catena del valore aziendale e nella generazione di ricchezza, approccio pragmatico e orientato alla produzione e creazione di valore tangibile per il cliente e l'azienda) (Negativo: potenziale focus eccessivo sulla produzione a scapito della relazione con il cliente finale e legame indiretto con la vendita e la negoziazione commerciale, percezione di ruolo centrale nella produzione ma meno nella dinamica commerciale e relazionale con il cliente finale)."
      },
      {
        value: "Rubinetto Diretto",
        text: "(Positivo: massima visibilità e misurabilità del contributo diretto al fatturato e legame tangibile e immediato tra lavoro e guadagno economico, approccio imprenditoriale e orientato al risultato economico diretto, percezione di ruolo chiave e fondamentale per la sopravvivenza economica dell'azienda e per la generazione di ricchezza immediata e diretta) (Negativo: esposizione diretta a pressione per risultati economici immediati e dipendenza dalla volontà di spesa del cliente, rischio di instabilità del reddito, percezione di orientamento eccessivo al breve termine e meno alla visione strategica a lungo raggio, potenziale stress da performance commerciale diretta e immediata)."
      }
    ],
    softSkill: "ServizioAlCliente, VenditaConsultiva",
    characteristics: "Ruolo Lavorativo, Relazione con la Generazione di Entrate, Responsabilità verso il Cliente"
  },
  {
    num: 115,
    scenario: "Un cliente ti fa i complimenti per un ottimo lavoro. Come \"coltivi\" questa soddisfazione?",
    instructions: [
      "Immagine di un vaso di fiori solitario e abbandonato,  nessuna \"cura\" per la relazione,  feedback ignorato.",
      "Immagine di un vaso con un cartellino standard di ringraziamento generico,  cura minima e \"formale\".",
      "Immagine di un giardiniere che annaffia con cura un fiore in un vaso,  cura personalizzata e attenzione specifica al feedback positivo.",
      "Immagine di un giardiniere che trapianta un fiore in un vaso più grande e fertile,  cura proattiva e investimento a lungo termine sulla relazione."
    ],
    captions: [
      "Fiore Abbandonato",
      "Biglietto di Ringraziamento",
      "Annaffiatura Mirata",
      "Trapianto Prezioso"
    ],
    options: [
      {
        value: "Fiore Abbandonato",
        text: "(Negativo: mancata fidelizzazione e sottovalutazione feedback positivo, opportunità persa per rafforzare relazione, percezione di disinteresse e noncuranza) (Positivo: efficienza operativa immediata e nessun costo aggiuntivo, semplicità e velocità di gestione del feedback, approccio lean e senza fronzoli)."
      },
      {
        value: "Biglietto di Ringraziamento",
        text: "(Negativo: non massimizzazione del potenziale del feedback positivo per la fidelizzazione, risposta standardizzata e poco memorabile, mancanza di personalizzazione e calore umano, percezione di approccio formale ma non sincero o coinvolgente) (Positivo: cortesia e professionalità formale, approccio misurato e non invadente, rispetto della distanza professionale, evitamento eccessivo entusiasmo percepito come non sincero o eccessivo)."
      },
      {
        value: "Annaffiatura Mirata",
        text: "(Positivo: apprezzamento personalizzato e non standardizzato, rafforzamento della relazione cliente, consolidamento interazioni positive, miglioramento della percezione di valore da parte del cliente, approccio umano e attento al singolo cliente) (Negativo: potenziale percezione di calcolata personalizzazione e rischio di non creare legame emotivo profondo e duraturo, follow-up buono ma non eccezionale in termini di effetto wow, approccio non sempre percepito come totalmente spontaneo e autentico)."
      },
      {
        value: "Trapianto Prezioso",
        text: "(Positivo: massima valorizzazione del feedback positivo e impegno totale per la fidelizzazione, costruzione di relazioni forti e durature, approccio proattivo e orientato all'eccellenza nella gestione della relazione cliente, percezione di cura e attenzione straordinarie e memorabili) (Negativo: alto investimento di risorse e potenziale problema di scalabilità, rischio di creare aspettative eccessive nel cliente, percezione di approccio non scalabile e troppo costoso in termini di tempo/risorse se applicato a tutti i clienti, sostenibilità economica non sempre garantita)."
      }
    ],
    softSkill: "FidelizzazioneDelCliente, SoddisfazioneDelCliente",
    characteristics: "Fidelizzazione del Cliente, Apprezzamento del Cliente, Costruzione della Relazione"
  }
];