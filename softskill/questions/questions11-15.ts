import { Question } from "../types";

export const questions: Question[] = [
  {
    num: 11,
    scenario: "Un cliente si lamenta per un piccolo errore, subito risolto, ma è comunque arrabbiato. Cosa fai per calmarlo?",
    instructions: [
      "Immagine di un giudice che sentenzia dall'alto di un trono.",
      "Immagine di un cameriere che porge sbrigativamente uno scontrino senza guardare il cliente negli occhi.",
      "Immagine di un medico che ausculta attentamente il paziente.",
      "Immagine di un tappeto rosso srotolato fino ai piedi del cliente, con tanto di valletto che porge un cuscino di velluto."
    ],
    captions: [
      "Tutti possiamo sbagliare",
      "Porgi le tue Scuse",
      "Mi Scuso, Spiego e Rassicuro",
      "Super-Scuse e Omaggio"
    ],
    options: [
      {
        value: "Tutti possono sbagliare",
        text: "(Negativo: mancanza di empatia e minimizzazione disagio cliente, distacco e poca immedesimazione, rigidità e insensibilità verso emozioni cliente, rischio di alienazione cliente) (Positivo: professionalità e autostima, approccio diretto senza inutili autocolpevolizzazioni, rassicurazione implicita su errore umano e risoluzione rapida, sicurezza di sé e non servilismo inautentico)."
      },
      {
        value: "Porgi le tue Scuse",
        text: "(Negativo: superficialità e scarsa empatia, sbrigativo e poco sentito, mancanza di attenzione e cura verso cliente arrabbiato, rischio di aumentare frustrazione cliente) (Positivo: efficienza e rapidità scuse formali, approccio veloce e senza perdite di tempo, massimizzazione velocità operativa e semplificazione gestione lamentela, evitamento complicazioni burocratiche e relazionali prolungate)."
      },
      {
        value: "Mi Scuso, Spiego e Rassicuro",
        text: "(Positivo: empatia e rassicurazione attiva cliente arrabbiato, approccio orientato a soluzione collaborativa e fidelizzazione, volontà di riconquistare fiducia cliente con comprensione e spiegazioni, massimizzazione probabilità di trasformare criticità in opportunità di fidelizzazione) (Negativo: potenziale inefficienza temporale e focus eccessivo su singolo cliente problematico, rischio di perdere tempo prezioso per singole lamentele non sempre giustificato in termini di efficienza operativa complessiva, approccio non sempre ottimizzato per massima efficienza operativa e gestione del tempo in contesti che richiedono velocità e focalizzazione sulla quantità)."
      },
      {
        value: "Super-Scuse e Omaggio",
        text: "(Positivo: massima attenzione a soddisfazione cliente a tutti i costi e fidelizzazione estrema con omaggi extra, approccio iper-customer-centric per coccolare cliente arrabbiato oltre aspettative e trasformare negatività in fidelizzazione massima, volontà di creare effetto wow memorabile anche con spese extra) (Negativo: rischio di eccessiva accondiscendenza e creazione aspettative irrealistiche e non sostenibili per azienda, potenziale assuefazione cliente a super-trattamenti non scalabili per clientela media, approccio non sempre pragmatico in termini di costo-beneficio reale per azienda nel lungo periodo, rischio di standard di servizio troppo elevati e non replicabili su larga scala)."
      }
    ],
    softSkill: "SoddisfazioneDelCliente, RelazioniInterpersonali",
    characteristics: "Soddisfazione del Cliente, Gestione della Frustrazione, Recupero Proattivo del Servizio"
  },
  {
    num: 12,
    scenario: "Pensa al tuo lavoro e alla tua carriera. ",
    instructions: [
      "Immagine di uno in ufficio, tranquillo e sistemato.",
      "Immagine di un trasloco ben Organizzato.",
      "Immagine di un piccolo negozio con il proprietario orgoglioso",
      "Immagine di un paracadutista, senza paura."
    ],
    captions: [
      "Nello Stesso Posto Tutta la Vita",
      "Un Posto Fisso anche con un Cambiamento",
      "Mi Impegno per Fare Qualcosa di Mio",
      "Mi Lancio Senza Paura"
    ],
    options: [
      {
        value: "Nello Stesso Posto Tutta la Vita",
        text: "(Positivo: ricerca di massima sicurezza e stabilità nel percorso professionale,  forte avversione al rischio e  valorizzazione della prevedibilità e della comfort zone lavorativa,  approccio tradizionalista e  conservativo che privilegia la certezza del posto fisso a tutti i costi) (Negativo:  potenziale mancanza di ambizione e  rinuncia a opportunità di crescita e cambiamento professionale,  rischio di monotonia e  routine appiattente nel lungo periodo,  percezione di approccio poco dinamico e  non pienamente allineato con un mercato del lavoro moderno e in continua evoluzione,  mancanza di slancio imprenditoriale e  di spirito di iniziativa personale nel creare attivamente il proprio futuro professionale invece che subirlo passivamente o adeguarsi ad esso  in modo conformista)."
      },
      {
        value: "Un Posto Fisso anche con un Cambiamento",
        text: "(Positivo: desiderio di stabilità e sicurezza del posto fisso anche in un contesto di cambiamento e  mobilità professionale,  approccio prudente e  pianificato al cambiamento che non rinuncia alla sicurezza di base del posto fisso,  volontà di conciliare sicurezza e  crescita senza salti nel buio eccessivamente rischiosi o  azzardati senza paracadute di sorta) (Negativo: eccessiva paura di perdere la sicurezza del posto fisso che frena la piena realizzazione del desiderio di fare qualcosa di proprio e  limitare davvero il potenziale di crescita e cambiamento reale e significativo,  approccio troppo prudente o  attendista che rischia di rimandare sempre il vero cambiamento desiderato e di rimanere bloccato in una zona di comfort solo apparente e non pienamente soddisfacente nel lungo periodo,  percezione di eccessiva cautela e  mancanza di slancio imprenditoriale e di vera propensione al rischio quando serve davvero  per cogliere al volo opportunità uniche e irripetibili di crescita e cambiamento  reale e significativo)."
      },
      {
        value: "Provo a Fare Qualcosa di Mio",
        text: "(Positivo: spirito imprenditoriale e desiderio di mettersi in proprio e creare qualcosa di personale,  approccio graduale e realistico che non brucia i ponti alle spalle ma esplora con cautela nuove strade e opportunità imprenditoriali anche partendo dal basso e senza salti nel buio eccessivamente rischiosi,  volontà di costruire gradualmente il proprio futuro professionale senza rinunciare del tutto alla sicurezza iniziale del posto fisso) (Negativo: mancanza di audacia e  coraggio nel lanciarsi davvero senza rete di protezione alcuna nel mondo imprenditoriale competitivo e incerto,  approccio troppo cauto o  graduale che rischia di limitare davvero le opportunità di successo rapido e  significativo in contesti competitivi e dinamici e non sempre pazienti o tolleranti verso chi procede troppo lentamente e con eccessiva cautela,  percezione di ambizione imprenditoriale moderata o  non pienamente sviluppata e matura per competere davvero nel mondo imprenditoriale reale e non solo idealizzato o immaginato in teoria)."
      },
      {
        value: "Mi Lancio Senza Paura",
        text: "(Positivo: massima ambizione e  coraggio nel lanciarsi senza paura nel mondo imprenditoriale competitivo e incerto,  forte propensione al rischio e  determinazione ferrea nel raggiungere il successo imprenditoriale a tutti i costi,  approccio dinamico,  aggressivo e  iper-competitivo che valorizza la sfida estrema e  la vittoria personale sopra ogni altra cosa) (Negativo: impulsività e eccessiva propensione al rischio non calcolato,  pericolo di decisioni avventate e  non ponderate che possono compromettere la sicurezza economica personale e familiare,  approccio troppo rischioso e  poco prudente e non sempre sostenibile nel lungo periodo in contesti economici incerti e volatili,  percezione di eccessiva temerarietà,  impulsività e  mancanza di cautela e  pianificazione responsabile e a lungo termine)."
      }
    ],
    softSkill: "DecisionMakingStrategico, PianificazioneEOrganizzazione",
    characteristics: "Spirito Imprenditoriale, Propensione al Rischio, Proattività"
  },
  {
    num: 13,
    scenario: "Un cliente ti spiega cosa vuole, cosa fai per capirlo bene?",
    instructions: [
      "Immagine di un blocco notes e una penna abbandonati su una scrivania deserta.",
      "Immagine di un binocolo puntato verso un orizzonte nebbioso e indistinto.",
      "Immagine di una lente di ingrandimento che esamina un testo fitto e complesso.",
      "Immagine di una stanza illuminata da una lampada puntata su un soggetto \"sotto torchio\"."
    ],
    captions: [
      "Annuisco e Scrivo Tutto, Cerchero di Capire Dopo.",
      "Contestualizzo le Richieste e Cerco di Capire.",
      "Chiedo Documentazioni e Spiegazioni.",
      "Lo Interrogo, Devo Capire per Aiutare il Cliente"
    ],
    options: [
      {
        value: "Annuisco e Scrivo Tutto, Cerchero di Capire Dopo.",
        text: "(Negativo: scarso impegno iniziale e delega comprensione, approccio superficiale e poco responsabile verso info importanti, poca iniziativa in problem-solving comunicativo, percezione di persona poco coinvolta e non affidabile nel capire subito) (Positivo: pragmatismo e uso del team come risorsa, gestione pragmatica situazione imbarazzante, evita blocchi riunione per difficoltà personali, approccio collaborativo che usa team per lacune individuali, massimizza efficienza apparente riunione a breve termine)."
      },
      {
        value: "Contestualizzo le Richieste e Cerco di Capire.",
        text: "(Negativo: comprensione superficiale e imprecisa, rischio di perdere dettagli importanti per fretta, approccio sbrigativo e non ottimizzato per precisione info tecniche complesse, percezione di approccio un po' superficiale e poco rigoroso per evitare errori futuri) (Positivo: efficienza e tentativo comprensione rapida idea generale, approccio pragmatico e orientato all'azione che privilegia velocità comprensione essenziale, volontà di non rallentare riunione con domande eccessive, massimizzazione velocità operativa e gestione tempo in contesti rapidi)."
      },
      {
        value: "Chiedo Documentazioni e Spiegazioni.",
        text: "(Positivo: impegno attivo per comprensione vera e attenzione a dettagli precisi, approccio responsabile orientato a qualità comprensione prima di andare avanti, volontà di chiarire ogni dubbio per evitare errori futuri, percezione di persona coscienziosa, attenta ai dettagli e orientata a accuratezza comunicazione) (Negativo: potenziale lentezza e focus eccessivo su dettagli non essenziali per comprensione generale, rischio di perdersi in dettagli eccessivi e non rilevanti per problema comunicativo immediato, approccio non sempre ottimizzato per massima efficienza e rapidità operativa in contesti che richiedono velocità azione concreta)."
      },
      {
        value: "Lo Interrogo, Devo Capire per Aiutare il Cliente",
        text: "(Positivo: massima accuratezza e comprensione totale, impegno estremo per chiarezza assoluta comunicazione, approccio perfezionista orientato a eccellenza comunicativa, volontà di non lasciare nulla non capito e verificare ogni dettaglio per massima precisione comprensione) (Negativo: pedanteria e potenziale rallentamento estremo comunicazione, rischio di paralisi da analisi per eccessiva perfezione comunicativa a scapito di velocità operativa, percezione di persona eccessivamente puntigliosa, pedante, perfezionista e non sempre ottimizzata per massima efficienza operativa in contesti che richiedono velocità e sintesi)."
      }
    ],
    softSkill: "AscoltoAttivo, ComunicazioneEfficace",
    characteristics: "Ascolto Attivo, Capacità di Comunicazione, Comprensione"
  },
  {
    num: 14,
    scenario: "Come usi di solito la bilancia del giudizio?",
    instructions: [
      "Immagine di una bilancia, che pende dal lato delle persone multietniche.",
      "Immagine di una bilancia, che pende dal lato dei divertimenti, un parco divertimenti sopra il piatto.",
      "Immagine di una bilancia, che pende dal lato delle responsabilità, una casa sopra il piatto",
      "Immagine di una bilancia, che pende dal lato degli sport."
    ],
    captions: [
      "Pesano di Più i Rapporti Umani",
      "Pesano di Più i Divertimenti",
      "Pesano di Più le Responsabilità",
      "Pesa di Più il mio Benessere"
    ],
    options: [
      {
        value: "Pesano di Più i Rapporti Umani",
        text: "(Positivo: valorizzazione profonda delle relazioni umane ed empatia spiccata, priorità assoluta ai legami affettivi e alla connessione umana come valore primario e fondamentale, approccio umanistico e altruista che mette al centro le persone e le relazioni positive e costruttive) (Negativo: potenziale irrazionalità e decisioni influenzate eccessivamente dalle emozioni a scapito della logica e dell' obiettività, rischio di soggettività e parzialità nel giudizio, approccio forse non sempre ottimizzato per contesti che richiederebbero maggiore distacco emotivo, obiettività razionale e decisioni imparziali e non influenzate da fattori emotivi o personali eccessivamente coinvolgenti)."
      },
      {
        value: "Pesano di Più i Divertimenti",
        text: "(Positivo: leggerezza e ottimismo contagiosi, approccio spensierato e gioioso alla vita che valorizza il piacere, il divertimento e la leggerezza, persona easygoing, rilassata e non ossessionata da stress e preoccupazioni eccessive e paralizzanti) (Negativo: mancanza di serietà e potenziale superficialità in contesti che richiedono impegno, responsabilità e serietà massima, rischio di apparire poco affidabile o non pienamente responsabile in situazioni che richiederebbero maggiore serietà e impegno formale e sostanziale, percezione di approccio troppo leggero, superficiale e poco incline all' assunzione di responsabilità serie e prolungate nel tempo)."
      },
      {
        value: "Pesano di Più le Responsabilità",
        text: "(Positivo: affidabilità e senso di responsabilità spiccati, massimo impegno personale nell' assumersi le proprie responsabilità e nel portarle a termine con serietà e dedizione, approccio responsabile, affidabile e orientato al dovere e all' impegno personale  prima di tutto) (Negativo: rischio di sovraccarico e stress eccessivo per iper-responsabilizzazione, potenziale difficoltà a delegare e a fidarsi pienamente degli altri, percezione di approccio troppo serioso, rigido, iper-responsabile e poco incline alla leggerezza e al  lasciarsi andare  e  delegare  quando  opportuno e  necessario per evitare il burnout e il sovraccarico  personale e  non sempre  utile  nel lungo periodo per la massima efficienza e  benessere  complessivo)."
      },
      {
        value: "Pesa di Più il mio Benessere",
        text: "(Positivo: forte attenzione al benessere personale e all'equilibrio vita-lavoro, ricerca di armonia e sostenibilità nel lungo periodo, approccio olistico che integra performance e benessere personale in modo equilibrato e sinergico  e non conflittuale o  dicotomico) (Negativo: potenziale percezione di scarsa ambizione e dedizione totale al lavoro (priorità al benessere prima della performance  a tutti i costi), rischio di performance non massimizzata in contesti iper-competitivi che richiederebbero maggiore dedizione esclusiva al lavoro e al  successo professionale  a scapito del benessere  personale  in senso stretto, percezione di persona forse non pienamente allineata con contesti lavorativi che premiano l' iper-performance e la dedizione estrema al lavoro  anche a costo del benessere  personale)."
      }
    ],
    softSkill: "Equita , Empatia",
    characteristics: "Equità, Pregiudizio, Lealtà, Obiettività"
  },
  {
    num: 15,
    scenario: "Pensa al futuro. Come ti senti di solito quando pensi a cosa ti aspetta?",
    instructions: [
      "Immagine di qualcuno che cammina dritto senza paura.",
      "Immagine di uno zaino in spalla, pronto a partire.",
      "Immagine di qualcuno che guarda una mappa, un po'perso.",
      "Immagine di qualcuno bloccato dalla paura, paralizzato."
    ],
    captions: [
      "Futuro? Zero Problemi",
      "Pronto ad Ogni Caso",
      "Boh, Chi lo Sa?",
      "Futuro? Panico Totale"
    ],
    options: [
      {
        value: "Futuro? Zero Paranoie",
        text: "(Positivo: ottimismo incrollabile e fiducia totale nel futuro,  approccio proattivo e  senza paura di fronte all'ignoto,  visione rosea e  rassicurante del domani,  persona forte,  coraggiosa e  non intimidita dalle incognite del futuro) (Negativo: eccessivo ottimismo e potenziale imprudenza e sottovalutazione dei rischi reali e delle sfide concrete che il futuro inevitabilmente riserva,  approccio forse non sempre realistico o  pragmatico e  poco incline alla prudenza e alla preparazione necessarie per affrontare davvero le incognite e i pericoli  del futuro  in modo efficace e responsabile nel lungo periodo)."
      },
      {
        value: "Pronto ad Ogni Caso",
        text: "(Positivo: preparazione meticolosa e  pianificazione dettagliata per affrontare qualsiasi evenienza futura,  approccio previdente e  orientato al controllo e alla gestione proattiva dei rischi e delle incognite del futuro,  volontà di non farsi cogliere impreparato e di avere un piano per tutto anche di fronte all' imprevedibilità intrinseca del futuro) (Negativo: ansia anticipatoria e ipercontrollo eccessivi e  potenzialmente paralizzanti,  rischio di vivere in uno stato di allerta e preoccupazione costanti che compromettono il benessere psicofisico quotidiano,  approccio troppo rigido,  iper-controllante e  poco incline alla spontaneità e all' accettazione dell' imprevedibilità e dell' incertezza  intrinseca del futuro,  percezione di persona ansiosa,  apprensiva e  ossessionata dal controllo e dalla pianificazione minuziosa e forse eccessiva e non sempre funzionale al vero benessere psicofisico nel lungo periodo)."
      },
      {
        value: "Boh, Chi lo Sa?",
        text: "(Positivo: capacità di vivere pienamente il presente e non farsi sopraffare dall'ansia del futuro,  approccio mindfulness e  orientato al qui e ora,  valorizzazione dell' incertezza del futuro come stimolo alla creatività e all' improvvisazione nel presente,  persona spontanea,  flessibile,  adattabile e  non ossessionata dalla pianificazione e dal controllo eccessivo del futuro  incerto per sua natura) (Negativo: mancanza di pianificazione e potenziale imprevidenza e  rischio di non essere preparato ad affrontare sfide future prevedibili o inevitabili,  approccio troppo leggero e  superficiale che evita di confrontarsi seriamente con le responsabilità e le scadenze  del futuro  prossimo o remoto,  percezione di persona impreparata,  non affidabile nel lungo periodo,  poco responsabile e non sempre incline alla serietà e all' impegno necessari per costruire un futuro sicuro e stabile per sé stessi e per gli altri  che dipendono dalle sue decisioni e azioni  nel presente)."
      },
      {
        value: "Futuro? Panico Totale",
        text: "(Negativo: ansia paralizzante e pessimismo eccessivi di fronte al futuro incerto,  approccio negativo e  autodistruttivo che blocca l'azione proattiva e  impedisce di affrontare costruttivamente le sfide future prevedibili o inevitabili,  mancanza di fiducia in sé stessi e  nelle proprie risorse interiori per affrontare il futuro con coraggio e determinazione,  percezione di persona fragile,  insicura,  vittima della paura e non pienamente padrona del proprio destino e delle proprie scelte future) (Positivo: consapevolezza lucida della propria ansia e potenziale campanello d'allarme utile per affrontare le proprie paure in modo costruttivo e  cercare supporto esterno per superare il blocco emotivo e la paralisi psicologica causati dalla paura del futuro  e dall' incertezza  esistenziale, *ma positivo solo come punto di partenza per un cambiamento attivo e costruttivo e non come atteggiamento stabile e persistente nel tempo di fronte al futuro  inevitabilmente incerto per tutti gli esseri umani)."
      }
    ],
    softSkill: "PianificazioneEOrganizzazione, GestioneDelloStress",
    characteristics: "Livelli di Ansia, Proattività, Orientamento al Futuro"
  },
];
