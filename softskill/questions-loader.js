// Questions Loader - Carica direttamente i file TypeScript
// Parser migliorato per gestire caratteri speciali e sintassi complessa

let allQuestions = [];

// Lista di tutti i file delle domande
const questionFiles = [
  'questions1-5.ts',
  'questions6-10.ts',
  'questions11-15.ts',
  'questions16-20.ts',
  'questions21-25.ts',
  'questions26-30.ts',
  'questions31-35.ts',
  'questions36-40.ts',
  'questions41-45.ts',
  'questions46-50.ts',
  'questions51-55.ts',
  'questions56-60.ts',
  'questions61-65.ts',
  'questions66-70.ts',
  'questions71-75.ts',
  'questions76-80.ts',
  'questions81-85.ts',
  'questions86-90.ts',
  'questions91-95.ts',
  'questions96-100.ts',
  'questions101-105.ts',
  'questions106-110.ts',
  'questions111-115.ts',
  'questions116-120.ts',
  'questions121-125.ts',
  'questions126-130.ts',
  'questions131-135.ts',
  'questions136-140.ts',
  'questions141-145.ts',
  'questions146-150.ts'
];

/**
 * Pulisce una stringa per il JSON rimuovendo caratteri problematici
 */
function cleanString(str) {
  // Mantieni solo caratteri validi e gestisci gli escape
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/\n/g, '\\n')    // Escape newlines
    .replace(/\r/g, '\\r')    // Escape carriage returns
    .replace(/\t/g, '\\t');   // Escape tabs
}

/**
 * Carica e parsifica un singolo file TypeScript con parser migliorato
 */
async function loadQuestionFile(filename) {
  try {
    const response = await fetch(`questions/${filename}`);
    const tsContent = await response.text();
    
    // Estrae l'array questions dal file TypeScript
    const match = tsContent.match(/export const questions.*?=\s*(\[[\s\S]*?\]);\s*$/m);
    if (!match) {
      console.warn(`⚠️ Nessuna question trovata in ${filename}`);
      return [];
    }
    
    let arrayString = match[1];
    
    // Pulizia più aggressiva per convertire TS in JSON valido
    
    // 1. Rimuovi trailing commas
    arrayString = arrayString.replace(/,\s*\]/g, ']');
    arrayString = arrayString.replace(/,\s*\}/g, '}');
    
    // 2. Converti chiavi senza virgolette in chiavi con virgolette
    // Gestisce anche chiavi già con virgolette
    arrayString = arrayString.replace(/([,{]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
    
    // 3. Rimuovi commenti inline (// e /* */)
    arrayString = arrayString.replace(/\/\/.*$/gm, '');
    arrayString = arrayString.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // 4. Gestisci stringhe con apici singoli -> doppi apici
    // ATTENZIONE: questo è delicato, potrebbe rompere stringhe con apici
    // Ma i file TypeScript usano virgolette doppie quindi dovrebbe andare
    
    // Parse del JSON
    let questions;
    try {
      questions = JSON.parse(arrayString);
    } catch (parseError) {
      // Se il parse fallisce, prova un approccio più sicuro usando eval
      console.warn(`⚠️ JSON.parse fallito per ${filename}, provo con eval...`);
      
      // Usa eval in modo sicuro (solo per array letterali)
      // Aggiungi parentesi per forzare valutazione come espressione
      const evalString = `(${arrayString})`;
      
      try {
        questions = eval(evalString);
      } catch (evalError) {
        console.error(`❌ Impossibile parsare ${filename}:`, evalError);
        console.error('Contenuto problematico:', arrayString.substring(0, 500));
        return [];
      }
    }
    
    console.log(`✅ ${filename}: ${questions.length} domande caricate`);
    return questions;
    
  } catch (error) {
    console.error(`❌ Errore caricando ${filename}:`, error);
    return [];
  }
}

/**
 * Carica tutte le domande da tutti i file
 */
async function loadAllQuestions() {
  console.log('🚀 Caricamento domande...');
  allQuestions = [];
  
  for (const filename of questionFiles) {
    const questions = await loadQuestionFile(filename);
    allQuestions.push(...questions);
  }
  
  console.log(`✨ Totale: ${allQuestions.length} domande caricate!`);
  return allQuestions;
}

/**
 * Ottiene tutte le domande (carica se necessario)
 */
async function getQuestions() {
  if (allQuestions.length === 0) {
    await loadAllQuestions();
  }
  return allQuestions;
}

// Export per uso in altri moduli
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadAllQuestions, getQuestions };
}
