// modules-mapping.js
// Mappa statica dei 4 moduli tematici con divisione domande

const MODULE_MAPPING = {
  modulo1: {
    name: "L'Io Interiore: Fondamenta e Resilienza",
    icon: "🧘",
    description: "Esplora il tuo mondo interiore. Scopri come gestisci lo stress, la tua autodisciplina, la fiducia in te stesso e come reagisci di fronte alle sfide e ai fallimenti.",
    // 40 domande - Domande 1-40 (prime 40)
    questions: [1, 2, 5, 7, 10, 12, 15, 18, 20, 23, 25, 28, 31, 34, 37, 40, 43, 47, 52, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 91, 94, 97, 100, 103, 106, 109, 112, 115],
    targetSkills: ["Resilienza", "GestioneDelloStress", "Autocritica", "Autodisciplina", "FiduciaInSeStessi", "SviluppoPersonale"]
  },
  
  modulo2: {
    name: "Tu e gli Altri: Dinamiche Sociali e Comunicazione",
    icon: "👥",
    description: "Analizza il tuo modo di interagire con gli altri. Dalla comunicazione all'empatia, dalla gestione dei conflitti alla capacità di leadership, scopri il tuo stile relazionale.",
    // 40 domande - Mix domande sociali/comunicazione
    questions: [3, 4, 6, 8, 11, 13, 16, 19, 21, 24, 26, 29, 32, 35, 38, 41, 44, 46, 49, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110],
    targetSkills: ["RelazioniInterpersonali", "ComunicazioneEfficace", "Empatia", "GestioneDeiConflitti", "Leadership", "GestioneDelTeam", "Negoziazione"]
  },
  
  modulo3: {
    name: "Modus Operandi: Strategia e Azione",
    icon: "⚙️",
    description: "Metti a fuoco il tuo modo di agire. Dalla risoluzione dei problemi alla pianificazione, dall'apertura all'innovazione alla presa di decisioni, scopri come trasformi le idee in realtà.",
    // 35 domande - Domande strategia/azione
    questions: [9, 14, 17, 22, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108, 111, 114, 117],
    targetSkills: ["ProblemSolving", "PensieroCritico", "DecisionMaking", "DecisionMakingStrategico", "PianificazioneEOrganizzazione", "GestioneDelTempo", "Innovazione", "MenteAperta", "Adattabilita", "SoddisfazioneDelCliente", "FidelizzazioneDelCliente", "GestioneFinanziaria", "FinanzaPersonale", "PropensioneAlRischio", "GestioneDelleObiezioni"]
  },
  
  modulo4: {
    name: "La Bussola Morale: Valori e Principi",
    icon: "⚖️",
    description: "Scopri la tua bussola interiore. Questo percorso analizza i tuoi principi, il tuo senso etico, la tua percezione di equità e il tuo approccio a temi come la diversità e la responsabilità sociale.",
    // 35 domande - Ultime 35 domande (116-150)
    questions: [113, 116, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150],
    targetSkills: ["EticaProfessionale", "Integrita", "Equita", "TematicheSociali", "DiversitaEInclusione", "ResponsabilitaSociale", "SicurezzaSulLavoro", "SicurezzaDigitale", "CoraggioCivile", "RelazioniImproprie"]
  }
};

// Export per uso in altri file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MODULE_MAPPING };
}