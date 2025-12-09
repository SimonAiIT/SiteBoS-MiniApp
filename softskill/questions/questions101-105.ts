import { Question } from "../types";

export const questions101to105: Question[] = [
  {
    num: 101,
    scenario: "Devi lasciare un \"messaggio\" su WhatsApp a qualcuno. Che \"tono\" usi di solito?",
    instructions: [
      "Immagine di un testo scritto in caratteri piccoli e formali,  tono distaccato e impersonale.",
      "Immagine di emoticon sorridenti e linguaggio semplice e diretto,  tono cordiale ma neutro.",
      "Immagine di emoticon espressive e linguaggio colloquiale e coinvolgente,  tono amichevole e \"vicino\".",
      "Immagine emoji \"esplosive\" e linguaggio iper-entusiasta,  tono enfatico e \"sopra le righe\"."
    ],
    captions: [
      "Messaggio Formale",
      "Messaggio Cordiale",
      "Messaggio Amichevole",
      "Messaggio Entusiasta"
    ],
    options: [
      {
        value: "Messaggio Formale",
        text: "(Negativo: percezione di distacco e freddezza relazionale e di eccessiva rigidità e formalità nella comunicazione interpersonale, rischio di non creare empatia o connessione umana con l'interlocutore e di non essere percepito come \"caloroso\" o \"umano\" nelle relazioni interpersonali, approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore calore umano, empatia, vicinanza emotiva e informalità nella comunicazione) (Positivo: massima professionalità e rispetto delle distanze gerarchiche e dei ruoli formali, approccio serio, impeccabile e orientato alla massima precisione e chiarezza comunicativa senza ambiguità o fraintendimenti, persona percepita come affidabile, seria, professionale, competente e non eccessivamente informale o \"confidenziale\" in contesti lavorativi o formali che richiederebbero un certo grado di distacco e rispetto dei ruoli e delle gerarchie pre-definite)."
      },
      {
        value: "Messaggio Cordiale",
        text: "(Negativo: potenziale mancanza di personalizzazione e di \"calore umano\" percepito nel messaggio e rischio di apparire un po' \"neutro\", \"anonimo\" o eccessivamente \"standardizzato\" nella comunicazione, percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore empatia, calore umano, vicinanza emotiva e capacità di creare una connessione personale e significativa con l'interlocutore) (Positivo: massima chiarezza, semplicità, efficacia e comprensibilità del messaggio per tutti i tipi di interlocutori e in ogni contesto comunicativo, approccio diretto, pragmatico, funzionale e orientato all'obiettivo primario della comunicazione che è la trasmissione chiara e inequivocabile del messaggio stesso senza \"fronzoli\" o \"complicazioni\" inutili o fuorvianti, persona percepita come educata, gentile, cordiale, professionale e attenta a mantenere un tono appropriato e rispettoso in ogni situazione comunicativa interpersonale)."
      },
      {
        value: "Messaggio Amichevole",
        text: "(Positivo: comunicazione empatica, calorosa, coinvolgente e orientata alla creazione di un clima relazionale positivo e disteso, approccio informale e amichevole che facilita la connessione umana e la creazione di legami interpersonali più forti e significativi, persona percepita come socievole, estroversa, empatica, affabile, \"alla mano\", facile da approcciare e con cui è piacevole e naturale comunicare e interagire anche a livello informale e personale) (Negativo: potenziale rischio di apparire eccessivamente informale, confidenziale o poco professionale in contesti lavorativi o formali che richiederebbero maggiore sobrietà, distacco e rispetto delle distanze gerarchiche e dei ruoli formali, percezione di approccio forse non sempre ottimizzato per situazioni comunicative che richiederebbero massima serietà, formalità, riserbo e rispetto dei protocolli e delle procedure aziendali o formali e non eccessiva spontaneità, leggerezza o informalità comunicativa)."
      },
      {
        value: "Messaggio Entusiasta",
        text: "(Positivo: massimo impatto emotivo e capacità di trasmettere energia positiva, entusiasmo contagioso e forte coinvolgimento emotivo dell'interlocutore, approccio comunicativo iper-dinamico, energico, vitale, stimolante e orientato a \"caricare\" e \"motivare\" l'interlocutore con la forza dell'entusiasmo e dell'energia positiva e contagiosa, persona percepita come carismatica, trascinante, entusiasmante, iper-dinamica, fonte di energia positiva e di forte stimolo e motivazione per gli altri) (Negativo: potenziale rischio di apparire eccessivamente enfatico, \"sopra le righe\", poco autentico o addirittura \"manipolatorio\" a causa dell'eccessiva enfasi e forzatura dell'entusiasmo e della positività comunicativa, percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore sobrietà, moderazione, equilibrio emotivo, razionalità, concretezza e capacità di comunicare anche contenuti \"difficili\" o \"negativi\" con calma, lucidità e senza eccessiva enfasi o forzatura della positività a tutti i costi)."
      }
    ],
    softSkill: "Presentazione, ComunicazioneEfficace",
    characteristics: "Stile di Presentazione, Stile di Comunicazione, Capacità Persuasiva"
  },
  {
    num: 102,
    scenario: "Devi presentare una soluzione innovativa ad un cliente. Su cosa \"punti\"?",
    instructions: [
      "Immagine di una lavagna piena di formule matematiche complesse e grafici,  focus sulla complessità tecnica.",
      "Immagine di una freccia che indica dritta verso un cartello con scritto \"SOLUZIONE\",  focus diretto e lineare sulla soluzione.",
      "Immagine di un prisma che scompone la luce bianca in un arcobaleno di colori brillanti,  focus sull'attrattiva e la completezza della soluzione.",
      "Immagine di un attore teatrale che recita con passione e gesti enfatici,  focus sulla performance persuasiva e coinvolgente."
    ],
    captions: [
      "Schema Tecnico",
      "Via Diretta",
      "Arcobaleno di Soluzioni",
      "Spettacolo Persuasivo"
    ],
    options: [
      {
        value: "Schema Tecnico",
        text: "(Negativo: rischio di confondere e alienare il cliente non esperto di tecnica e di non riuscire a comunicare in modo efficace il valore e i vantaggi concreti della soluzione innovativa per le sue esigenze specifiche, percezione di presentazione eccessivamente tecnica, incomprensibile, oscura, distaccata dalle reali necessità del cliente e non sempre utile o funzionale ai fini della persuasione e della vendita efficace della soluzione innovativa) (Positivo: massima enfasi sulla competenza tecnica specialistica e sull'innovazione pura e dura della soluzione proposta, approccio orientato a impressionare il cliente con la complessità, la profondità e il rigore scientifico e tecnologico della soluzione innovativa e a dimostrare una padronanza assoluta della materia e della tecnologia sottostante, potenziale appeal per clienti esperti o tecnici particolarmente sensibili al prestigio della competenza tecnica e dell'innovazione allo stato puro)."
      },
      {
        value: "Via Diretta",
        text: "(Negativo: presentazione potenzialmente piatta, fredda, poco coinvolgente emotivamente e non particolarmente memorabile o entusiasmante per il cliente, rischio di non catturare l'attenzione e l'interesse del pubblico in modo sufficiente e di non riuscire a trasmettere appieno il valore e l'impatto innovativo della soluzione proposta oltre la pura e semplice descrizione asettica e lineare delle sue caratteristiche tecniche e funzionali) (Positivo: massima chiarezza, efficienza, linearità e comprensibilità del messaggio e della presentazione per tutti i tipi di clienti anche non esperti di tecnica, approccio pragmatico, diretto e focalizzato sull'obiettivo primario della comunicazione che è la trasmissione semplice, chiara e inequivocabile delle informazioni chiave e del messaggio essenziale senza fronzoli o complicazioni inutili o fuorvianti, massimizzazione della probabilità di essere compresi e seguiti dal cliente anche non esperto di tecnica e non particolarmente interessato a dettagli eccessivamente tecnici o complessi)."
      },
      {
        value: "Arcobaleno di Soluzioni",
        text: "(Positivo: presentazione ricca, completa, attraente e colorata che valorizza la varietà, la completezza e l'ampiezza della soluzione innovativa e che mira a creare un'immagine appetibile e desiderabile agli occhi del cliente attraverso la molteplicità dei vantaggi e delle funzionalità offerte, approccio orientato a sedurre e conquistare il cliente con la promessa di una soluzione a 360 gradi e chiavi in mano in grado di soddisfare ogni sua esigenza o aspettativa in modo completo e definitivo, percezione di offerta generosa, abbondante, ricca e piena di vantaggi e di valore aggiunto per il cliente) (Negativo: potenziale rischio di dispersività e di effetto brochure troppo promozionale e poco focalizzato sui bisogni specifici e sulle esigenze reali del cliente specifico che potrebbe sentirsi perso o confuso di fronte a un eccessivo bombardamento di informazioni e di vantaggi indifferenziati e non sempre pertinenti o rilevanti per la sua situazione specifica, percezione di approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore precisione, focalizzazione sui bisogni specifici del cliente, capacità di andare dritto al punto e di comunicare in modo chiaro, sintetico e inequivocabile il valore essenziale e specifico della soluzione innovativa per il cliente specifico e non solo una generica e indifferenziata lista della spesa di vantaggi e funzionalità potenzialmente poco rilevanti o interessanti per il cliente reale e concreto)."
      },
      {
        value: "Spettacolo Persuasivo",
        text: "(Positivo: massimo impatto emotivo e capacità di infiammare e trascinare il cliente con l'entusiasmo, la passione e la forza persuasiva della presentazione, approccio carismatico, coinvolgente, entusiasmante e orientato a vendere un sogno e un'esperienza emotiva positiva prima ancora che una pura e semplice soluzione tecnica o un prodotto o servizio standardizzato, persona percepita come leader carismatico, comunicatore eccezionale, persuasivo, entusiasmante e capace di conquistare e sedurre il cliente con la forza della parola e della propria energia e passione comunicativa) (Negativo: potenziale rischio di essere percepito come eccessivamente enfatico, sopra le righe, poco credibile o addirittura manipolatorio o truffaldino a causa dell'eccessiva enfasi sull'emozione e sulla pura retorica persuasiva a scapito della sostanza, della concretezza, della razionalità e della dimostrazione oggettiva e verificabile del valore e dei vantaggi reali e tangibili della soluzione innovativa per il cliente specifico, percezione di approccio forse non sempre ottimizzato per clienti particolarmente razionali, scettici, pragmatici e orientati all'analisi oggettiva dei dati e dei fatti piuttosto che alle promesse o alle emozioni suscitati da una presentazione eccessivamente teatrale o enfaticamente persuasiva)."
      }
    ],
    softSkill: "Presentazione, ComunicazioneEfficace",
    characteristics: "Stile di Presentazione, Stile di Comunicazione, Capacità Persuasiva"
  },
  {
    num: 103,
    scenario: "Devi presentare un prodotto con un \"lato oscuro\" nascosto. Come lo presenti?",
    instructions: [
      "Immagine di un prestigiatore che nasconde un coniglio nel cappello con un sorriso furbo,  nascondere completamente il lato oscuro.",
      "Immagine di un spettacolo di ombre cinesi,  non nascondere del tutto ma \"velare\" il lato oscuro.",
      "Immagine di una bilancia che pesa pregi e difetti di un oggetto,  presentare entrambi i lati in modo equilibrato.",
      "Immagine di un riflettore potente che illumina un'ombra scura proiettata sul muro,  massima trasparenza anche sugli aspetti negativi."
    ],
    captions: [
      "Trucco di Magia",
      "Velo Leggero",
      "Risvolto della Medaglia",
      "Ombra in Piena Luce"
    ],
    options: [
      {
        value: "Trucco di Magia",
        text: "(Negativo: mancanza di etica e trasparenza, rischio di perdita di fiducia a lungo termine, approccio manipolatorio,  percezione di scarsa affidabilità etica) (Positivo: massimizzazione impatto immediato, alta persuasività istantanea, massima efficacia nel closing a breve termine, focus sul risultato immediato, successo percepito nell'immediato)."
      },
      {
        value: "Velo Leggero",
        text: "(Negativo: trasparenza parziale, rischio di percepita opacità o reticenza, non completa onestà intellettuale, potenziale danno alla fiducia se il lato oscuro viene scoperto in seguito) (Positivo: approccio diplomatico e di mediazione, equilibrio tra etica e persuasione, tentativo di gestire la complessità, rassicurazione velata, compromesso tra onestà e vendibilità)."
      },
      {
        value: "Risvolto della Medaglia",
        text: "(Positivo: massima trasparenza e onestà intellettuale, costruzione di fiducia solida e duratura, approccio etico ineccepibile, percezione di massima affidabilità e integrità morale, relazione win-win basata sulla fiducia reciproca e consapevolezza) (Negativo: potenziale effetto deterrente su alcuni clienti, rischio di indebolire l'appeal commerciale immediato, percezione di eccessiva rigidità etica o poca flessibilità commerciale, presentazione meno entusiasmante e più realistica)."
      },
      {
        value: "Ombra in Piena Luce",
        text: "(Positivo: massima onestà e trasparenza radicale, integrità assoluta, costruzione di una relazione basata sulla fiducia totale e trasparenza estrema, percezione di persona di altissima integrità e correttezza morale totale) (Negativo: potenziale autosabotaggio commerciale, rischio di allarmare eccessivamente il cliente, percezione di approccio poco pragmatico in contesti competitivi, eccessivo idealismo etico che potrebbe limitare l'efficacia commerciale immediata)."
      }
    ],
    softSkill: "Presentazione, EticaProfessionale",
    characteristics: "Etica della Presentazione, Stile di Comunicazione, Onestà vs. Persuasività"
  },
  {
    num: 104,
    scenario: "La nave sta affondando. Come distribuisci le scialuppe di salvataggio?",
    instructions: [
      "Immagine di donne e bambini che vengono aiutati a salire per primi sulle scialuppe,  priorità assoluta ai più vulnerabili.",
      "Immagine di persone che estraggono a sorte dei biglietti per salire sulle scialuppe,  distribuzione casuale ed equa per tutti.",
      "Immagine di persone che corrono e spingono per salire per primi sulle scialuppe,  \"si salvi chi può\",  legge del più forte.",
      "Immagine di membri dell'equipaggio esperti e persone in forma fisica che vengono incaricati di gestire le scialuppe,  priorità a chi può \"fare la differenza\" per la sopravvivenza di più persone."
    ],
    captions: [
      "Prima i Fragili",
      "Sorteggio per Tutti",
      "Si Salvi Chi Può",
      "Ai Più Utili"
    ],
    options: [
      {
        value: "Prima i Fragili",
        text: "(Positivo: massima priorità ai vulnerabili, compassione e solidarietà umana ai massimi livelli, scelta etica nobile e altruista, persona percepita come profondamente umana e altruista) (Negativo: potenziale minore efficacia nel salvare il massimo numero di vite totali, rischio di decisioni non sempre razionali in ottica di massimizzazione della sopravvivenza, percezione di approccio eccessivamente emotivo e meno pragmatico in contesti di emergenza estrema)."
      },
      {
        value: "Sorteggio per Tutti",
        text: "(Positivo: massima equità e imparzialità nel processo decisionale, uguali opportunità per tutti, evitamento di favoritismi o discriminazioni, percezione di persona giusta e democratica e rispettosa delle pari opportunità) (Negativo: potenziale minore efficacia nel salvare il massimo numero di vite totali, rischio di non considerare le diverse probabilità di sopravvivenza, percezione di eccessivo formalismo o applicazione rigida di un principio astratto di equità, approccio forse non pienamente ottimizzato per la massima utilità collettiva in emergenza)."
      },
      {
        value: "Si Salvi Chi Può",
        text: "(Negativo: totale mancanza di equità e responsabilità sociale, prevalenza dell'egoismo individuale, scarsa solidarietà umana, approccio socialmente inaccettabile in contesti civili, percezione di persona spietata, egoista e priva di empatia) (Positivo: massima velocità decisionale, efficienza nel salvataggio individuale per chi ce la fa, approccio realistico e crudo, efficienza spartana e iper-individualista, massimizzazione della velocità di azione e reazione individuale in emergenza estrema)."
      },
      {
        value: "Ai Più Utili",
        text: "(Positivo: massimizzazione del potenziale di sopravvivenza collettiva, approccio utilitarista e pragmatico, valorizzazione delle competenze utili in emergenza, scelta razionale orientata al bene comune, percezione di leadership responsabile e focalizzata sul risultato massimo per il gruppo) (Negativo: potenziale sacrificio dell'equità individuale, rischio di discriminazione percepita, approccio utilitarista che può apparire freddo o calcolatore e non pienamente umano, percezione di scarsa compassione verso i meno utili in ottica di sopravvivenza collettiva)."
      }
    ],
    softSkill: "Equità, ResponsabilitaSociale",
    characteristics: "Equità, Responsabilità Sociale, Prioritizzazione Etica"
  },
  {
    num: 105,
    scenario: "Stai scalando una montagna difficoltosa dove tanti falliscono. Come la affronti?",
    instructions: [
      "Immagine di uno scalatore solitario che procede spedito senza curarsi del sentiero,  solo la vetta conta,  nessuna attenzione all'impatto.",
      "Immagine di uno scalatore che procede con attenzione sul sentiero,  concentrato sulla salita ma attento a non danneggiare l'ambiente,  equilibrio tra vetta e sentiero.",
      "Immagine di uno scalatore che si ferma ad aiutare un altro scalatore in difficoltà,  priorità alla responsabilità sociale e all'aiuto reciproco.",
      "Immagine di uno scalatore che rinuncia a scalare la montagna,  nessun impegno,  nessuna \"traccia\" lasciata,  rinuncia a mettersi in gioco."
    ],
    captions: [
      "Vedo Solo la Vetta",
      "Vedo il Sentiero",
      "Vedo Chi Resta Indietro",
      "Rinuncio alla Salita"
    ],
    options: [
      {
        value: "Vedo Solo la Vetta",
        text: "(Negativo: ego-centrismo e scarsa attenzione all'impatto altrui, potenziale danno collaterale per raggiungere i propri scopi, percezione di individualismo spinto e mancanza di sensibilità sociale o ambientale) (Positivo: massima focalizzazione su obiettivi personali, ottimizzazione performance individuale, efficienza nel raggiungimento del successo personale, approccio diretto e senza compromessi, massima spinta alla performance individuale pura)."
      },
      {
        value: "Vedo il Sentiero",
        text: "(Positivo: equilibrio tra ambizione personale e responsabilità sociale e attenzione all'impatto sistemico, approccio responsabile e sostenibile, percezione di persona equilibrata e consapevole del proprio ruolo nel contesto più ampio) (Negativo: potenziale limitazione del successo individuale massimo, rischio di performance individuale non massimizzata per attenzione alla responsabilità sociale, percezione di ambizione personale moderata, non sempre massimizzata a scapito di tutto il resto)."
      },
      {
        value: "Vedo Chi Resta Indietro",
        text: "(Positivo: massima responsabilità sociale e solidarietà umana, attenzione al bene comune, valorizzazione del gruppo e della cooperazione, percezione di persona altruista, generosa e profondamente umana e orientata al servizio) (Negativo: potenziale sacrificio eccessivo dello sviluppo personale, rischio di non raggiungere appieno obiettivi individuali ambiziosi, percezione di scarsa ambizione personale, eccessiva enfasi sull'altruismo e auto-sacrificio)."
      },
      {
        value: "Rinuncio alla Salita",
        text: "(Negativo: rinuncia alla crescita personale, immobilismo e stagnazione, mancanza di iniziativa e coraggio di affrontare le sfide, potenziale frustrazione e rimpianto per non aver provato a mettersi in gioco, percezione di passività e mancanza di ambizione personale e coraggio) (Positivo: evitamento rischi, conservatorismo, prudenza, mantenimento status quo sicuro, assenza di impatto negativo attivo, approccio minimalista e non invasivo)."
      }
    ],
    softSkill: "SviluppoPersonale, ResponsabilitaSociale",
    characteristics: "Sviluppo Personale vs. Impatto Sociale, Responsabilità, Altruismo"
  }
];
