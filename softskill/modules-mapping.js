// modules-mapping.js
// Mappa statica aggiornata e verificata sui dati reali

const MODULE_MAPPING = {
  modulo1: {
    name: "L'Io Interiore: Fondamenta e Resilienza",
    icon: "🧘",
    description: "Esplora il tuo mondo interiore. Scopri come gestisci lo stress, la tua autodisciplina, la fiducia in te stesso e come reagisci di fronte alle sfide e ai fallimenti.",
    // Focus: Introspezione, Gestione di sé, Finanza personale, Resilienza
    questions: [
      1, 2, 5, 9, 15, 22, 26, 28, 31, 33, 
      34, 35, 38, 40, 47, 53, 54, 55, 56, 57, 
      58, 67, 71, 75, 82, 84, 87, 88, 93, 97, 
      118, 119, 121, 133, 143
    ],
    // Rimosso "Motivazione" se non presente come key specifica, mantenuto quelle standard
    targetSkills: [
      "GestioneDelloStress", "Autodisciplina", "Resilienza", "FiduciaInSeStessi", 
      "Autocritica", "SviluppoPersonale", "FinanzaPersonale"
    ]
  },
  
  modulo2: {
    name: "Tu e gli Altri: Dinamiche Sociali e Comunicazione",
    icon: "👥",
    description: "Analizza il tuo modo di interagire con gli altri. Dalla comunicazione all'empatia, dalla gestione dei conflitti alla capacità di leadership, scopri il tuo stile relazionale.",
    // Focus: Relazioni, Leadership, Team, Comunicazione
    questions: [
      4, 14, 17, 18, 20, 21, 23, 24, 25, 27, 
      29, 30, 32, 37, 39, 41, 44, 46, 51, 59, 
      60, 62, 63, 64, 66, 83, 85, 89, 90, 92, 
      96, 101, 102, 130, 137, 142
    ],
    targetSkills: [
      "RelazioniInterpersonali", "ComunicazioneEfficace", "Empatia", 
      "GestioneDeiConflitti", "Leadership", "GestioneDelTeam", "SviluppoDellePersone"
    ]
  },
  
  modulo3: {
    name: "Modus Operandi: Strategia e Azione",
    icon: "⚙️",
    description: "Metti a fuoco il tuo modo di agire. Dalla risoluzione dei problemi alla pianificazione, dall'apertura all'innovazione alla presa di decisioni, scopri come trasformi le idee in realtà.",
    // Focus: Operatività, Vendita, Organizzazione, Problem Solving
    questions: [
      6, 7, 8, 10, 11, 12, 13, 16, 36, 42, 
      43, 45, 48, 61, 68, 69, 73, 74, 76, 77, 
      78, 80, 91, 94, 95, 98, 99, 113, 114, 115, 
      116, 122, 123, 124, 125, 126, 127, 129, 134, 135, 
      138, 140, 141, 145, 147, 148, 149, 150
    ],
    targetSkills: [
      "ProblemSolving", "PensieroCritico", "DecisionMaking", "DecisionMakingStrategico",
      "PianificazioneEOrganizzazione", "GestioneDelTempo", "Innovazione", "MenteAperta",
      "Adattabilita", "SoddisfazioneDelCliente", "FidelizzazioneDelCliente", 
      "VenditaConsultiva", "GestioneDelleObiezioni", "AscoltoAttivo", 
      "OrientamentoAlCliente", "ServizioAlCliente", "Negoziazione", "Presentazione"
    ]
  },
  
  modulo4: {
    name: "La Bussola Morale: Valori e Principi",
    icon: "⚖️",
    description: "Scopri la tua bussola interiore. Questo percorso analizza i tuoi principi, il tuo senso etico, la tua percezione di equità e il tuo approccio a temi come la diversità e la sicurezza.",
    // Focus: Etica, Sicurezza, Inclusione, Integrità
    questions: [
      3, 19, 49, 50, 52, 65, 70, 79, 81, 86, 
      100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 
      112, 117, 120, 128, 131, 132, 136, 139, 144, 146
    ],
    // CORRETTO: Rimosso "CoraggioCivile" (non presente nei dati raw come key)
    // Aggiunto "TematicheSociali" che copre quei casi.
    targetSkills: [
      "EticaProfessionale", "Integrita", "Equita", "TematicheSociali",
      "DiversitaEInclusione", "ResponsabilitaSociale", "SicurezzaSulLavoro",
      "SicurezzaDigitale", "RelazioniImproprie"
    ]
  }
};

// Export per uso in altri file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MODULE_MAPPING };
}
