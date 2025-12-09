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
        text: "(Negativo: negligenza sicurezza e evitamento confronto, mancanza di senso di responsabilità, potenziale rischio per la sicurezza altrui, percezione di irresponsabilità e superficialità) (Positivo: evitamento conflitti interpersonali e mantenimento di un clima di lavoro disteso, approccio \"laissez-faire\" e non giudicante, rispetto apparente autonomia altrui)."
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
        text: "(Negativo: scarsa consapevolezza sicurezza, negligenza, vulnerabilità ai rischi, percezione di imprudenza e superficialità) (Positivo: spensieratezza, godimento del momento presente, assenza di ansia, approccio \"leggero\", fiducia nell'ambiente circostante, non si lascia condizionare dalla \"paura\")."
      },
      {
        value: "Paraocchi Sociali",
        text: "(Positivo: moderata attenzione all'ambiente, equilibrio tra vigilanza e relax, consapevolezza \"sufficiente\" senza eccessivo allarmismo, approccio \"normale\" e \"non paranoico\") (Negativo: potenziale riduzione prontezza di riflessi per distrazioni, rischio di imprevisti per minore attenzione, percezione di attenzione \"moderata\" ma non \"massima\", approccio forse non sempre \"ottimale\" in termini di \"prevenzione\" e \"sicurezza proattiva\")."
      },
      {
        value: "Suricato Sentinella",
        text: "(Positivo: buona consapevolezza del contesto, equilibrio tra attenzione e relax, vigilanza \"attiva\" ma non \"ansiosa\", approccio \"responsabile\" e \"consapevole\" senza eccessi, percezione di persona \"attenta\" e \"presente\" ma non \"paranoica\") (Negativo: potenziale minore reattività di fronte a pericoli \"improvvisi\" o \"subdoli\", rischio di non intercettare segnali di allarme \"impercettibili\" ad un occhio \"non allenato\" all'iper-vigilanza, percezione di vigilanza \"buona\" ma non \"massima\" in contesti di pericolo \"estremo\" e \"immediato\")."
      },
      {
        value: "Molla Tesa",
        text: "(Positivo: massima attenzione alla sicurezza, iper-vigilanza e massima \"prontezza\" di reazione di fronte al pericolo, approccio \"iper-protettivo\" e orientato alla \"prevenzione assoluta\", percezione di persona estremamente \"attenta\", \"responsabile\" e \"pronta\" a reagire in emergenza \"estrema\") (Negativo: stress e ansia elevati, percezione di paranoia, eccessiva cautela limitante, approccio \"iper-vigile\" che può diventare \"stressante\" e \"controproducente\" nel lungo periodo per il benessere psicofisico, mancanza di \"leggerezza\" e \"spontaneità\" nel vivere il quotidiano)."
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
      "Immagine di uno scudiero che veste un cavaliere,  ricerca di supporto esterno per l'implementazione.",
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
