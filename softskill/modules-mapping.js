// modules-mapping.js
// Mappa statica dei 4 moduli tematici con divisione domande

const MODULE_MAPPING = {
  modulo1: {
    name: "L'Io Interiore: Fondamenta e Resilienza",
    icon: "🧘",
    description: "Esplora il tuo mondo interiore. Scopri come gestisci lo stress, la tua autodisciplina, la fiducia in te stesso e come reagisci di fronte alle sfide e ai fallimenti.",
    // 39 domande - Modulo 1: Q1-Q39 (GestioneDelloStress, Autodisciplina, Resilienza, FiduciaInSeStessi, Autocritica, SviluppoPersonale)
    questions: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
      31, 32, 33, 34, 35, 36, 37, 38, 39
    ],
    targetSkills: ["GestioneDelloStress", "Autodisciplina", "Resilienza", "FiduciaInSeStessi", "Autocritica", "SviluppoPersonale"]
  },
  
  modulo2: {
    name: "Tu e gli Altri: Dinamiche Sociali e Comunicazione",
    icon: "👥",
    description: "Analizza il tuo modo di interagire con gli altri. Dalla comunicazione all'empatia, dalla gestione dei conflitti alla capacità di leadership, scopri il tuo stile relazionale.",
    // 37 domande - Modulo 2: Q40-Q76 (RelazioniInterpersonali, ComunicazioneEfficace, Empatia, GestioneDeiConflitti, Leadership, GestioneDelTeam, Negoziazione)
    questions: [
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
      50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
      70, 71, 72, 73, 74, 75, 76
    ],
    targetSkills: ["RelazioniInterpersonali", "ComunicazioneEfficace", "Empatia", "GestioneDeiConflitti", "Leadership", "GestioneDelTeam", "Negoziazione"]
  },
  
  modulo3: {
    name: "Modus Operandi: Strategia e Azione",
    icon: "⚙️",
    description: "Metti a fuoco il tuo modo di agire. Dalla risoluzione dei problemi alla pianificazione, dall'apertura all'innovazione alla presa di decisioni, scopri come trasformi le idee in realtà.",
    // 40 domande - Modulo 3: Q77-Q116 (ProblemSolving, PensieroCritico, DecisionMaking, PianificazioneEOrganizzazione, GestioneDelTempo, Innovazione, MenteAperta, Adattabilita, GestioneFinanziaria, PropensioneAlRischio, SoddisfazioneDelCliente, FidelizzazioneDelCliente, GestioneDelleObiezioni)
    questions: [
      77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
      87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
      97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
      107, 108, 109, 110, 111, 112, 113, 114, 115, 116
    ],
    targetSkills: [
      "ProblemSolving", "PensieroCritico", "DecisionMaking", "DecisionMakingStrategico",
      "PianificazioneEOrganizzazione", "GestioneDelTempo", "Innovazione", "MenteAperta",
      "Adattabilita", "SoddisfazioneDelCliente", "FidelizzazioneDelCliente",
      "GestioneFinanziaria", "FinanzaPersonale", "PropensioneAlRischio", "GestioneDelleObiezioni"
    ]
  },
  
  modulo4: {
    name: "La Bussola Morale: Valori e Principi",
    icon: "⚖️",
    description: "Scopri la tua bussola interiore. Questo percorso analizza i tuoi principi, il tuo senso etico, la tua percezione di equità e il tuo approccio a temi come la diversità e la responsabilità sociale.",
    // 34 domande - Modulo 4: Q117-Q150 (EticaProfessionale, Integrita, Equita, TematicheSociali, DiversitaEInclusione, ResponsabilitaSociale, SicurezzaSulLavoro, SicurezzaDigitale, CoraggioCivile, RelazioniImproprie)
    questions: [
      117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
      127, 128, 129, 130, 131, 132, 133, 134, 135, 136,
      137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
      147, 148, 149, 150
    ],
    targetSkills: [
      "EticaProfessionale", "Integrita", "Equita", "TematicheSociali",
      "DiversitaEInclusione", "ResponsabilitaSociale", "SicurezzaSulLavoro",
      "SicurezzaDigitale", "CoraggioCivile", "RelazioniImproprie"
    ]
  }
};

// Export per uso in altri file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MODULE_MAPPING };
}