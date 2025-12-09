import { Question } from "../types";

export const questions136to140: Question[] = [
  {
    num: 136,
    scenario: "Sei in gruppo con amici, ti allontani un attimo e Trovi una Banconota. Come la dividi?",
    instructions: [
      "Immagine di una persona che si \"spazza via\" tutto il bottino senza lasciare niente all'altro,  massima priorità al guadagno personale,  negoziazione \"predatoria\".",
      "Immagine di una bilancia che pesa i due lati del bottino in modo da dividerlo perfettamente a metà,  divisione equa e  paritaria,  negoziazione \"bilanciata\".",
      "Immagine di una persona che offre la parte più grande e preziosa del bottino all'altro,  generosità e  priorità alla soddisfazione altrui nella divisione,  negoziazione \"altruista\".",
      "Immagine di due persone che rinunciano al bottino e si allontanano insieme,  rinuncia al guadagno materiale per preservare la relazione,  non negoziazione e  priorità alla relazione stessa."
    ],
    captions: [
      "Prendo Tutto Io",
      "A Tutti una Parte Uguale",
      "La Spendo per Tutti",
      "La Dono in Beneficenza"
    ],
    options: [
      {
        value: "Prendo Tutto Io",
        text: "(Negativo: approccio predatorio e non etico e danneggiamento potenziale della relazione con l'altra parte, percezione di persona avida e egoista e poco affidabile sul piano relazionale e collaborativo, rischio di bruciare opportunità future di collaborazione) (Positivo: massimizzazione del guadagno personale immediato e efficacia nel massimizzare il profitto nella singola transazione, approccio iper-competitivo e orientato al risultato economico senza compromessi, massima efficienza nel capitalizzare immediatamente l'opportunità di guadagno, *ma positivo solo in ottica strettamente economica e non etica o relazionale*)."
      },
      {
        value: "Meta a Testa",
        text: "(Positivo: massima equità e giustizia percepita nella divisione e soddisfazione paritaria di entrambe le parti, creazione di un clima di fiducia e reciprocità, approccio collaborativo e win-win, persona percepita come corretta e affidabile) (Negativo: potenziale non massimizzazione del guadagno personale estremo e rinuncia a sfruttare eventuali asimmetrie di potere a proprio vantaggio, percezione di ambizione personale moderata e non sempre massimizzata in ottica di profitto individuale puro, approccio forse non sempre ottimizzato per la massima performance ego-centrica senza compromessi etici o di equità)."
      },
      {
        value: "A Te la Parte Migliore",
        text: "(Positivo: massima attenzione alla soddisfazione altrui e approccio generoso e altruista, costruzione di una relazione forte e duratura basata sulla fiducia e reciprocità, persona percepita come leale e generosa e profondamente orientata alla relazione e alla soddisfazione altrui) (Negativo: sacrificio guadagno personale immediato e non massimizzazione profitto individuale diretto, percezione di eccessivo altruismo o generosità non sempre giustificata in contesti competitivi o meramente commerciali, approccio forse non sempre ottimizzato per la massima performance economica ego-centrica e profit-oriented senza compromessi)."
      },
      {
        value: "La Dono in Beneficenza",
        text: "(Positivo: massima priorità alla relazione e all'armonia e approccio non materialista e idealista, valorizzazione dei legami umani sopra il guadagno economico, persona percepita come profondamente umana e empatica e orientata alla relazione e non corrotta dal denaro, massima importanza data ai valori umani e relazionali) (Negativo: rinuncia totale al guadagno economico e approccio non pragmatico in contesti competitivi, perdita di opportunità economica concreta, percezione di eccessivo idealismo o utopismo in contesti meramente materialistici e profit-oriented, approccio forse non sempre ottimizzato per la massima performance economica tout court)."
      }
    ],
    softSkill: "Negoziazione, OrientamentoAlCliente",
    characteristics: "Stile di Negoziazione, Orientamento al Guadagno, Priorità Relazionali vs. Economiche"
  },
  {
    num: 137,
    scenario: "Il tuo team ha vinto un premio aziendale: una giornata libera e un budget per un'attività di team building. Cosa decidi fare?",
    instructions: [
      "Immagine di una persona che decide per tutti senza consultare il gruppo,  scelta unilaterale e autocratica.",
      "Immagine di persone che votano separatamente per schede,  voto democratico e  maggioranza decide.",
      "Immagine di persone che discutono insieme animatamente per trovare un accordo,  vengono elencate diverse opzioni",
      "Immagine di una persona che cede il premio al team e si mette da parte,  rinuncia al premio a beneficio altrui,  generosità e  altruismo."
    ],
    captions: [
      "Propongo Subito un'Iniziativa",
      "Vince la Maggioranza",
      "Offro Opzioni",
      "Fate Vobis"
    ],
    options: [
      {
        value: "Propongo Subito un'Iniziativa",
        text: "(Negativo:  **scarsa negoziazione**:  nessun tentativo di negoziazione o compromesso con il team,  approccio unilaterale. **Scarso orientamento al cliente (team)**:  non considera le preferenze o la soddisfazione del team,  approccio autocratico e  non partecipativo,  rischio di demotivazione del team) (Positivo: **massima efficienza decisionale**:  decisione rapida e  senza perdite di tempo,  utile in situazioni urgenti.  Chiarezza e  direzione univoca,  evita ambiguità.  Leadership decisa,  anche se autoritaria. Massimizzazione della velocità decisionale e  operativa)."
      },
      {
        value: "Vince la Maggioranza",
        text: "(Negativo:  **negoziazione limitata**:  negoziazione ridotta alla fase di presentazione delle proposte,  ma non vera mediazione o ricerca di consenso. **Orientamento al cliente (team) parziale**:  considera le preferenze del team in modo formale, ma non garantisce la soddisfazione di tutti, minoranza potenzialmente frustrata. Rischio di decisione percepita come  fredda o  distaccata) (Positivo: **equità formale**:  processo decisionale percepito come  equo e  democratico,  rispetto formale delle opinioni di tutti.  Efficienza decisionale moderata,  più rapido del consenso,  accettabile compromesso tra velocità e  partecipazione.  Coinvolgimento di base del team nel processo decisionale)."
      },
      {
        value: "Offro Opzioni",
        text: "(Positivo: **alta negoziazione**:  massimo impegno nella negoziazione e  ricerca di un accordo che soddisfi tutti,  priorità al consenso. **Forte orientamento al cliente (team)**:  massima attenzione alla soddisfazione e all'armonia del team,  valorizzazione delle preferenze di tutti,  massimizzazione della coesione di gruppo.  Team building potenziale,  rafforzamento legami) (Negativo: **lentezza decisionale**:  processo decisionale potenzialmente lungo e  faticoso,  rischio di compromessi eccessivi o  decisioni \"annacquate\".  Inefficienza potenziale se il team è  troppo eterogeneo o  conflittuale.  Richiede tempo e  abilità di mediazione)."
      },
      {
        value: "Fate Vobis",
        text: "(Positivo: **massimo orientamento al cliente (team)**:  fiducia totale nel team e  massima autonomia decisionale concessa al gruppo,  valorizzazione dell'iniziativa e  responsabilizzazione del team.  Forte empowerment del team,  clima di fiducia e  autonomia.  Minimo sforzo decisionale per il leader,  delega completa.  Flessibilità e  adattamento alle preferenze del team) (Negativo: **negoziazione indiretta/assente**:  nessuna negoziazione diretta da parte del leader,  delega totale della negoziazione interna al team (se presente).  Rischio di decisioni non ottimali per l'azienda o  non allineate con obiettivi strategici.  Perdita di controllo e  direzione da parte del leader.  Potenziale inefficienza o  decisioni caotiche se il team non è  autonomo o  responsabile)."
      }
    ],
    softSkill: "Negoziazione, OrientamentoAlCliente",
    characteristics: "Stile di Negoziazione, Orientamento al Cliente (Gruppo), Equità, Generosità"
  },
  {
    num: 138,
    scenario: "Hai un \"extra\" inaspettato che potresti investire ma hai un debito, che fai?",
    instructions: [
      "Immagine di una persona che taglia una pesante catena,  priorità assoluta all'eliminazione del debito,  liberazione dal fardello finanziario.",
      "Immagine di una bilancia che pesa da un lato il debito e dall'altro un investimento,  equilibrio tra riduzione del debito e  investimento per il futuro.",
      "Immagine di una cassaforte aperta per metà con una parte dei soldi depositatie l'altra parte pronta per essere investita,  equilibrio tra risparmio \"sicuro\" e  investimento \"rischioso\" per il futuro.",
      "Immagine di una cassaforte chiusa,  massima priorità all'accumulo e alla conservazione,  avversione totale al debito e al rischio."
    ],
    captions: [
      "Taglio del Debito",
      "Bilancia Perfetta",
      "Investo e Conservo",
      "Cassaforte Chiusa"
    ],
    options: [
      {
        value: "Taglio del Debito",
        text: "(Positivo: massima sicurezza finanziaria immediata e liberazione dal peso del debito, approccio pragmatico e responsabile, riduzione dello stress e dell'ansia legati al debito, persona percepita come affidabile e previdente) (Negativo: mancata massimizzazione della crescita del patrimonio e rinuncia a potenziali guadagni da investimento, percezione di eccessiva avversione al rischio e cautela, approccio forse non sempre ottimizzato per la massima crescita finanziaria a lungo termine e dinamicità del portafoglio finanziario complessivo)."
      },
      {
        value: "Bilancia Perfetta",
        text: "(Positivo: approccio equilibrato e razionale e bilanciamento tra sicurezza immediata (riduzione debito) e potenziale crescita futura (investimento), gestione oculata e responsabile delle risorse finanziarie extra, persona percepita come ponderata e pragmatica) (Negativo: non massimizzazione della velocità di riduzione del debito e non massimizzazione del potenziale di crescita dell'investimento, percezione di approccio moderato e non estremo in nessuna direzione, rischio di non eccellere né nella sicurezza estrema né nella crescita massima, approccio forse non pienamente ottimizzato per la massima performance finanziaria in assoluto in nessuna delle due direzioni estreme)."
      },
      {
        value: "Investo e Conservo",
        text: "(Positivo: diversificazione del portafoglio finanziario e bilanciamento tra sicurezza (risparmio) e potenziale di crescita (investimento), approccio prudente ma non passivo e orientato alla crescita controllata, gestione diversificata del rischio e delle opportunità, persona percepita come equilibrata e versatile) (Negativo: non massimizzazione della sicurezza del capitale e non punta alla massima crescita potenziale, non considera minimamente la priorità di ridurre il debito, potenzialmente trascurando un impegno finanziario esistente e essere percepito come non sempre sufficientemente audace o ambizioso in termini di massimizzazione della crescita del patrimonio)."
      },
      {
        value: "Cassaforte Chiusa",
        text: "(Positivo: massima sicurezza del capitale conservato e approccio iper-difensivo e massimamente prudente, evitamento assoluto di rischi finanziari e perdite potenziali, massimizzazione della protezione del patrimonio esistente, persona percepita come previdente e attenta alla sicurezza) (Negativo: rinuncia totale alla crescita potenziale del capitale extra e non sfrutta le opportunità di investimento potenzialmente redditizie, non considera minimamente la possibilità di usare l'extra per ridurre il debito, ignorando un aspetto importante della responsabilità finanziaria complessiva e essere percepito come eccessivamente avaro o ossessionato dalla sicurezza e non sempre razionale in termini di massimizzazione del potenziale di crescita del patrimonio nel lungo periodo)."
      }
    ],
    softSkill: "FinanzaPersonale, ResponsabilitaSociale",
    characteristics: "Prudenza Finanziaria, Gestione del Debito, Propensione al Rischio, Orientamento alla Sicurezza"
  },
  {
    num: 139,
    scenario: "Un collega usa la chat aziendale in modo \"troppo personale\". Come reagisci?",
    instructions: [
      "Immagine di una persona che spegne il computer con gesto deciso,  ignora completamente il messaggio inappropriato,  \"disconnessione\" totale.",
      "Immagine di un \"semaforo giallo\" acceso,  risposta \"tiepida\" e  ambigua,  segnalazione indiretta di \"disagio\" senza affrontare il problema apertamente.",
      "Immagine di una \"bolla di sapone\" che allontana il messaggio inappropriato con delicatezza,  risposta ferma ma \"soft\" e  \"non aggressiva\" per \"respingere\" l'avance.",
      "Immagine di un \"firewall\" invalicabile che blocca il messaggio inappropriato,  segnalazione formale e blocco immediato del comportamento,  tolleranza zero."
    ],
    captions: [
      "Disconnetto e Ignoro",
      "Semaforo Giallo",
      "Bolla di Sapone",
      "Blocco Immediato"
    ],
    options: [
      {
        value: "Disconnetto e Ignoro",
        text: "(Negativo: non gestione della relazione impropria e mancanza di feedback al collega sul comportamento inappropriato, perpetuazione potenziale di dinamiche relazionali ambigue o sbagliate, percezione di persona evitante e distaccata) (Positivo: massima distanza di sicurezza professionale e non alimentazione dinamiche improprie, evitamento conflitto diretto, mantenimento focus rigorosamente professionale, approccio tranchant che taglia corto dinamiche ambigue o inopportune)."
      },
      {
        value: "Semaforo Giallo",
        text: "(Negativo: messaggio ambiguo e poco chiaro e rischio di non essere compreso o preso sul serio dal collega, mancanza di fermezza e chiarezza nel porre i confini professionali, percezione di persona indecisa e poco assertiva) (Positivo: approccio diplomatico e non confrontazionale e tentativo di sensibilizzazione soft, minimo segnale di disagio senza scontro aperto, volontà di non ignorare completamente il problema, pur senza esporsi direttamente e rischiare in prima persona, mantenimento di un clima relativamente disteso e non conflittuale apertamente)."
      },
      {
        value: "Bolla di Sapone",
        text: "(Positivo: assertività gentile ed efficace nel respingere l'avance e chiarimento dei confini in modo non aggressivo, mantenimento della forma e della leggerezza, gestione ferma ma educata della situazione inappropriata, persona percepita come abile nella comunicazione assertiva soft e professionale) (Negativo: potenziale percezione di non sufficiente fermezza o chiarezza e rischio di fraintendimento della gentilezza come apertura, non scoraggiamento completo di comportamenti futuri inappropriati, percezione di assertività moderata e non sempre ottimale in contesti che richiederebbero maggiore risolutezza e chiarezza inequivocabile nel respingere in modo netto avances inopportune e non gradite)."
      },
      {
        value: "Blocco Immediato",
        text: "(Positivo: massima fermezza e chiarezza nel respingere comportamenti inappropriati e tolleranza zero verso molestie o dinamiche non professionali, affermazione inequivocabile di confini professionali rigidi e non negoziabili, massima protezione della vittima potenziale e dell'etica professionale, persona percepita come integra e corretta) (Negativo: potenziale escalation del conflitto e rischio di creare tensione nel team, percezione di approccio eccessivamente severo o intransigente e non sempre incline alla mediazione o alla comprensione umana delle debolezze altrui, approccio forse non sempre ottimizzato per la massima armonia e distensione delle dinamiche relazionali nel team)."
      }
    ],
    softSkill: "RelazioniImproprie, SicurezzaDigitale",
    characteristics: "Gestione di Relazioni Inappropriate, Confini Professionali, Assertività"
  },
  {
    num: 140,
    scenario: "Un cliente ti chiede esplicitamente uno strumento \"sbagliato\" per il lavoro che deve fare. Che fai?",
    instructions: [
      "Immagine di una pacco di consegna anonimo,  asseconda la richiesta senza obiezioni,  servizio \"passivo\".",
      "Immagine di una mano che porge un punto interrogativo,  dubbio sull'attrezzo giusto,  servizio \"incerto\".",
      "Immagine di un venditore che mostra diversi attrezzi \"spiegando\" quale sarebbe il migliore per quel lavoro,  guida il cliente verso la scelta \"giusta\",  servizio \"consultivo\".",
      "Immagine di una mano che prende un l'attrezzo dalle mani del cliente,  \"corregge\" attivamente l'errore del cliente,  servizio \"proattivo\" e  \"correttivo\"."
    ],
    captions: [
      "Accontento e Consegno",
      "Consegno, Ma Ho Dubbi",
      "Ti Guardo e Ti Spiego",
      "Correggo l'Errore"
    ],
    options: [
      {
        value: "Accontento e Consegno",
        text: "(Negativo: servizio non ottimale per il cliente e rischio di insoddisfazione futura del cliente per la scelta sbagliata, mancanza di valore aggiunto consulenziale, percezione di approccio passivo e non proattivo e poco orientato alla vera soddisfazione del cliente nel lungo periodo) (Positivo: massima efficienza operativa immediata e semplicità e velocità della transazione, evitamento complicazioni e discussioni, approccio diretto e sbrigativo, focalizzazione sulla velocità e semplificazione del processo di vendita immediato)."
      },
      {
        value: "Consegno, Ma Ho Dubbi",
        text: "(Positivo: segnalazione velata del potenziale problema e approccio cauto e non impositivo, rispetto della volontà del cliente, pur esprimendo una riserva professionale, persona percepita come prudente e non invadente) (Negativo: efficacia limitata del suggerimento velato e rischio che il cliente non colga appieno il consiglio, mancanza di guida attiva e diretta verso la soluzione ottimale, percezione di consulenza incompleta o non pienamente efficace nel problem-solving, approccio forse non sempre ottimizzato per la massima soddisfazione del cliente nel lungo periodo)."
      },
      {
        value: "Ti Guardo e Ti Spiego",
        text: "(Positivo: massima attenzione ai bisogni veri del cliente e approccio problem-solving e solution-oriented, guida esperta e personalizzata verso la scelta ottimale, creazione di valore aggiunto consulenziale, persona percepita come competente e affidabile) (Negativo: richiede tempo per la consulenza e potenziale allungamento tempi di vendita, approccio forse non sempre gradito da clienti impazienti o poco interessati alla consulenza approfondita, percezione di lentezza o eccessivo dettaglio tecnico o verbosità accademica)."
      },
      {
        value: "Correggo l'Errore",
        text: "(Positivo: massima proattività nel correggere l'errore del cliente e approccio iper-protettivo e orientato alla soluzione ottimale a tutti i costi, volontà di evitare al cliente una scelta sbagliata e le conseguenze negative che ne deriverebbero, persona percepita come sicura di sé e determinata) (Negativo: potenziale paternalismo percepito e rischio di scavalcare la volontà del cliente, percezione di approccio troppo direttivo e poco rispettoso dell'autonomia decisionale altrui, mancanza di negoziazione e compromesso, approccio forse non sempre ottimizzato per la massima soddisfazione del cliente in termini di percezione di controllo e libertà di scelta individuale)."
      }
    ],
    softSkill: "VenditaConsultiva, ServizioAlCliente",
    characteristics: "Stile di Vendita, Orientamento al Cliente, Capacità di Guida, Autonomia vs. Paternalismo"
  }
];