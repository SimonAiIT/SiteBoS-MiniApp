// modules-mapping.js
// Mappa statica DEFINITIVA con tutte le 150 domande verificate

const MODULE_MAPPING = {
  modulo1: {
    name: "L'Io Interiore: Fondamenta e Resilienza",
    icon: "🧘",
    description: "Esplora il tuo mondo interiore. Scopri come gestisci lo stress, la tua autodisciplina, l'organizzazione personale e la fiducia in te stesso.",
    // Totale: 39 domande
    questions: [
      1, 2, 5, 9, 15, 22, 26, 28, 31, 33, 
      34, 35, 36, 38, 40, 47, 53, 54, 55, 56, 
      57, 58, 67, 68, 71, 75, 77, 82, 84, 87, 
      88, 93, 97, 98, 118, 119, 121, 133, 143
    ],
    targetSkills: [
      "GestioneDelloStress", "Autodisciplina", "Resilienza", "FiduciaInSeStessi", 
      "Autocritica", "SviluppoPersonale", "FinanzaPersonale", 
      "PianificazioneEOrganizzazione"
    ]
  },
  
  modulo2: {
    name: "Tu e gli Altri: Dinamiche Sociali e Comunicazione",
    icon: "👥",
    description: "Analizza il tuo modo di interagire. Dalla comunicazione all'ascolto attivo, dalla gestione dei conflitti alla negoziazione e alla leadership.",
    // Totale: 41 domande (Aggiunta la 72 qui)
    questions: [
      4, 13, 14, 17, 18, 20, 21, 23, 24, 25, 
      27, 29, 30, 32, 37, 39, 41, 44, 46, 51, 
      59, 60, 62, 63, 64, 66, 72, 83, 85, 89, // <-- 72 inserita qui
      90, 92, 96, 101, 102, 113, 130, 134, 137, 140, 
      142
    ],
    targetSkills: [
      "RelazioniInterpersonali", "ComunicazioneEfficace", "Empatia", 
      "GestioneDeiConflitti", "Leadership", "GestioneDelTeam", 
      "SviluppoDellePersone", "AscoltoAttivo", "Negoziazione", "Presentazione"
    ]
  },
  
  modulo3: {
    name: "Modus Operandi: Strategia e Azione",
    icon: "⚙️",
    description: "Metti a fuoco il tuo modo di agire. Dalla risoluzione dei problemi alla strategia, dall'innovazione alla vendita e alla presa di decisioni operative.",
    // Totale: 40 domande
    questions: [
      6, 7, 8, 10, 11, 12, 16, 42, 43, 45, 
      48, 61, 69, 73, 74, 76, 78, 80, 91, 94, 
      95, 99, 114, 115, 116, 122, 123, 124, 125, 126, 
      127, 129, 135, 138, 141, 145, 147, 148, 149, 150
    ],
    targetSkills: [
      "ProblemSolving", "PensieroCritico", "DecisionMaking", "DecisionMakingStrategico",
      "PianificazioneEOrganizzazione", "GestioneDelTempo", "Innovazione", "MenteAperta",
      "Adattabilita", "SoddisfazioneDelCliente", "FidelizzazioneDelCliente", 
      "VenditaConsultiva", "GestioneDelleObiezioni", "OrientamentoAlCliente", 
      "ServizioAlCliente"
    ]
  },
  
  modulo4: {
    name: "La Bussola Morale: Valori e Principi",
    icon: "⚖️",
    description: "Scopri la tua bussola interiore. Questo percorso analizza i tuoi principi, il tuo senso etico, l'equità, la sicurezza e la responsabilità sociale.",
    // Totale: 30 domande
    questions: [
      3, 19, 49, 50, 52, 65, 70, 79, 81, 86, 
      100, 103, 104, 105, 106, 107, 108, 109, 110, 111, 
      112, 117, 120, 128, 131, 132, 136, 139, 144, 146
    ],
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
