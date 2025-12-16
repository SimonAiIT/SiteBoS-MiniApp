// ========================================
// SPECCHIO MAGICO - PILASTRI COMPLETI
// Modulo separato per evitare troncamento file principale
// ========================================

// ========================================
// PILASTRO 1: TEXTURE & AFRO (INCLUSIVE HAIR)
// ========================================

const HAIR_TEXTURES = {
  F: [
    { id: 'straight-1', label: 'Lisci (Type 1)', prompt: 'straight type 1 hair texture, sleek and smooth' },
    { id: 'wavy-2', label: 'Mossi (Type 2)', prompt: 'wavy type 2 hair texture, natural movement' },
    { id: 'curly-3', label: 'Ricci (Type 3)', prompt: 'curly type 3 hair texture, defined curls' },
    { id: 'coily-4', label: 'Afro/Coily (Type 4)', prompt: 'coily type 4 afro texture, tight curls' },
    { id: 'silk-press', label: 'Silk Press (Afro Liscio)', prompt: 'silk press on textured hair, smooth finish with volume and healthy shine' }
  ],
  M: [
    { id: 'straight', label: 'Lisci', prompt: 'straight hair texture' },
    { id: 'wavy', label: 'Mossi', prompt: 'wavy hair texture' },
    { id: 'curly', label: 'Ricci', prompt: 'curly hair texture, defined curls' },
    { id: 'coily', label: 'Afro/Coily', prompt: 'coily afro texture, tight curls' }
  ],
  X: [
    { id: 'straight', label: 'Lisci', prompt: 'straight hair texture' },
    { id: 'wavy', label: 'Mossi', prompt: 'wavy hair texture' },
    { id: 'curly-3', label: 'Ricci (Type 3)', prompt: 'curly type 3 hair texture' },
    { id: 'coily-4', label: 'Afro (Type 4)', prompt: 'coily type 4 afro texture' },
    { id: 'silk-press', label: 'Silk Press', prompt: 'silk press smooth finish with volume' }
  ]
};

const PROTECTIVE_STYLES = [
  { 
    id: 'box-braids', 
    label: 'Box Braids', 
    prompt: 'long box braids protective style, neat square parts, kanekalon extension texture',
    icon: '🪮'
  },
  { 
    id: 'cornrows', 
    label: 'Cornrows (Trecce Aderenti)', 
    prompt: 'neat cornrows braided close to scalp, straight back or patterned design',
    icon: '🤝'
  },
  { 
    id: 'bantu-knots', 
    label: 'Bantu Knots', 
    prompt: 'geometric bantu knots all over head, defined sections and twisted buns',
    icon: '🌿'
  },
  { 
    id: 'faux-locs', 
    label: 'Faux Locs', 
    prompt: 'faux locs protective style, loc extensions with natural texture',
    icon: '🌾'
  },
  { 
    id: 'afro-puff', 
    label: 'Afro Puff (Raccolto Alto)', 
    prompt: 'high voluminous afro puff, natural type 4c texture, defined volume',
    icon: '☁️'
  }
];

// ========================================
// PILASTRO 2: TECNICHE DI COLORAZIONE COMPLETE
// AGGIORNATO: + Shatush + Degradé + Highlights + Lowlights + Bleach & Tone + Gloss
// ========================================

const COLOR_TECHNIQUES = [
  // === SERVIZI FULL COVERAGE ===
  { 
    id: 'global', 
    label: '🎨 Tinta Globale (Full Head)', 
    prompt: 'uniform all-over hair color from roots to tips, consistent full coverage',
    description: 'Colore uniforme radice-punte, copertura totale',
    type: 'permanent'
  },
  
  // === SERVIZI PARTIAL / DIMENSIONAL ===
  { 
    id: 'root-melt', 
    label: '🌑 Root Melt / Shadow Root', 
    prompt: 'darker root melting seamlessly into lighter lengths, shadow root transition, soft blended gradient',
    description: 'Radice scura che sfuma impercettibilmente nel colore chiaro',
    type: 'partial'
  },
  { 
    id: 'balayage', 
    label: '☀️ Balayage / Foilyage', 
    prompt: 'hand-painted balayage technique, sun-kissed dimension, depth at roots with lighter ends, natural gradient',
    description: 'Schiaritura a mano libera, effetto "baciata dal sole"',
    type: 'partial'
  },
  { 
    id: 'shatush', 
    label: '☁️ Shatush (Cotonatura)', 
    prompt: 'shatush technique with backcombing, strong gradient from dark roots to light ends, cloud-like effect with visible demarcation',
    description: 'Schiaritura con cotonatura radice (effetto nuvola, stacco più netto)',
    type: 'partial'
  },
  { 
    id: 'degrade', 
    label: '🌿 Degr adé Joelle', 
    prompt: 'degrade hair color technique, vertical natural blending, multi-tonal seamless gradient, Italian school method',
    description: 'Sfumatura verticale naturale tipica scuola italiana (Joelle)',
    type: 'partial'
  },
  { 
    id: 'highlights', 
    label: '✨ Mèches / Colpi di Sole (Highlights)', 
    prompt: 'classic foil highlights from roots to ends, evenly distributed defined streaks, high contrast or blended dimensional lightening',
    description: 'Schiariture regolari dalla radice (Stagnola) - Classico',
    type: 'partial'
  },
  { 
    id: 'lowlights', 
    label: '🌙 Lowlights (Colpi di Buio)', 
    prompt: 'lowlights technique, darker strands intermixed with lighter hair to add depth and dimension, reverse highlights',
    description: 'Inserimento ciocche scure per dare profondità',
    type: 'partial'
  },
  { 
    id: 'babylights', 
    label: '👶 Babylights (Micro-Tessitura)', 
    prompt: 'ultra-fine babylights, microscopic highlights blended throughout for natural diffused blonde, no visible stripes',
    description: 'Micro-ciocche finissime per biondo naturale diffuso',
    type: 'partial'
  },
  { 
    id: 'money-piece', 
    label: '💰 Money Piece / Face Framing', 
    prompt: 'distinct bright face-framing highlights, two frontal strands much lighter than base color, frames the face',
    description: 'Due ciocche frontali molto più chiare per incorniciare il viso',
    type: 'partial'
  },
  { 
    id: 'airtouch', 
    label: '💨 Airtouch (Tecnica Russa)', 
    prompt: 'airtouch technique using blow dryer separation, seamless hyper-realistic blonde blending, no demarcation lines',
    description: 'Il "non plus ultra" del biondo freddo con sfumatura impossibile',
    type: 'partial'
  },
  
  // === SERVIZI EXTREME / CREATIVE ===
  { 
    id: 'bleach-tone', 
    label: '🧊 Total Bleach & Tone (Platino)', 
    prompt: 'platinum blonde all-over bleach and tone, solid ice blonde color from roots to ends, no dark areas, ultra-light result',
    description: 'Decolorazione totale + Tonalizzante (Marilyn/Gwen Stefani)',
    type: 'creative'
  },
  { 
    id: 'color-block', 
    label: '🎭 Color Block / Split Dye', 
    prompt: 'geometric color blocking, half-and-half split dye or sharp contrasting sections, bold statement',
    description: 'Metà testa di un colore, metà dell\'altro (o blocchi geometrici)',
    type: 'creative'
  },
  
  // === SERVIZI FINISHING / GLOSS ===
  { 
    id: 'gloss', 
    label: '✨ Gloss / Tonalizzante (Lucidante)', 
    prompt: 'hair gloss treatment, extremely shiny finish, subtle sheer color overlay, healthy glossy look, no lift',
    description: 'Servizio lucidante rapido al lavatesta (ravviva/spegne toni)',
    type: 'gloss'
  }
];

// ========================================
// NUOVO: STYLING & PIEGA (Il Finish)
// ========================================

const STYLING_OPTIONS = [
  { 
    id: 'natural', 
    label: '🌿 Naturale (Asciugatura Libera)', 
    prompt: 'natural air-dried finish, effortless texture',
    category: 'natural'
  },
  { 
    id: 'smooth-blowout', 
    label: '💨 Piega Liscia Spaghetto', 
    prompt: 'smooth sleek blowout, straight as spaghetti, glossy finish',
    category: 'straight'
  },
  { 
    id: 'volume-90s', 
    label: '🎆 Volume 90s (Big Hair)', 
    prompt: '90s voluminous blowout, lifted roots, bouncy body',
    category: 'straight'
  },
  { 
    id: 'inward-tips', 
    label: '➡️ Punte in Dentro (Classic Bob)', 
    prompt: 'classic blowout with tips curled inward, sophisticated finish',
    category: 'straight'
  },
  { 
    id: 'beach-waves', 
    label: '🌊 Beach Waves', 
    prompt: 'effortless beach waves, tousled texture, salt-spray effect',
    category: 'wavy'
  },
  { 
    id: 'hollywood-waves', 
    label: '✨ Hollywood Waves (Vintage)', 
    prompt: 'glamorous vintage hollywood waves, defined S-curves, red carpet style',
    category: 'wavy'
  },
  { 
    id: 'soft-waves', 
    label: '🌼 Onde Morbide', 
    prompt: 'soft romantic waves, gentle movement, natural flow',
    category: 'wavy'
  },
  { 
    id: 'low-bun', 
    label: '🧘 Chignon Basso', 
    prompt: 'elegant low bun chignon, sleek and polished',
    category: 'updo'
  },
  { 
    id: 'high-ponytail', 
    label: '👇 Coda Alta (Ponytail)', 
    prompt: 'high sleek ponytail, tight and polished',
    category: 'updo'
  },
  { 
    id: 'french-twist', 
    label: '🇫🇷 Banana (French Twist)', 
    prompt: 'classic french twist banana updo, sophisticated roll',
    category: 'updo'
  },
  { 
    id: 'messy-bun', 
    label: '🎀 Messy Bun', 
    prompt: 'casual messy bun, effortless chic, loose texture',
    category: 'updo'
  },
  { 
    id: 'french-braid', 
    label: '🪮 Treccia alla Francese', 
    prompt: 'classic french braid, neat and tight, traditional weave',
    category: 'braids'
  },
  { 
    id: 'fishtail-braid', 
    label: '🐟 Spina di Pesce', 
    prompt: 'intricate fishtail braid, herringbone pattern',
    category: 'braids'
  }
];

// ========================================
// NUOVO: EXTENSION & INFOLTIMENTO
// ========================================

const EXTENSIONS = [
  { 
    id: 'none', 
    label: '❌ Nessuno', 
    prompt: '',
    massMultiplier: 1.0
  },
  { 
    id: 'volume-wefts', 
    label: '💪 Infoltimento Volume (Wefts)', 
    prompt: 'wearing volumizing hair wefts for extra thickness and body',
    massMultiplier: 1.3
  },
  { 
    id: 'tape-in-length', 
    label: '📏 Allungamento Tape-In', 
    prompt: 'wearing tape-in hair extensions for extra length',
    massMultiplier: 1.5
  },
  { 
    id: 'keratin-bonds', 
    label: '🔥 Cheratina (Bonds)', 
    prompt: 'wearing keratin bond hair extensions, seamless blend',
    massMultiplier: 1.4
  },
  { 
    id: 'flash-highlights', 
    label: '⚡ Punti Luce (Flash Color)', 
    prompt: 'flash color highlights extensions for dimensional color effect without bleaching',
    massMultiplier: 1.0
  }
];

// ========================================
// PILASTRO 3: BARBERING AVANZATO (SFUMATURE TECNICHE)
// ========================================

const ADVANCED_FADES = [
  { 
    id: 'skin-fade', 
    label: '🪒 Skin Fade (Sfumatura a Pelle)', 
    prompt: 'skin fade starting from zero with razor, gradual transition to length on top, clean shaved sides',
    description: 'Parte da 0mm (rasoio) e sale gradualmente'
  },
  { 
    id: 'taper-fade', 
    label: '🧑‍🦱 Taper Fade (Classico)', 
    prompt: 'classic taper fade, blended sides and neck with maintained length above ears, professional look',
    description: 'Sfumatura solo nuca e basette, più classico'
  },
  { 
    id: 'burst-fade', 
    label: '🔥 Burst Fade (Circolare Orecchio)', 
    prompt: 'burst fade circular around the ear, arc-shaped fade, often paired with mohawk or mullet',
    description: 'Sfumatura circolare solo attorno all\'orecchio'
  },
  { 
    id: 'drop-fade', 
    label: '📉 Drop Fade (Curva Nuca)', 
    prompt: 'drop fade with curved line dropping behind the ear and around back of head, low arc shape',
    description: 'La linea di sfumatura si abbassa curvando dietro la nuca'
  },
  { 
    id: 'edgar-cut', 
    label: '🔱 Edgar Cut / Takuache', 
    prompt: 'edgar haircut with straight geometric forehead fringe, high skin fade on sides, sharp caesar-like cut',
    description: 'Frangia dritta geometrica + sfumatura alta (Trend USA/Messico)'
  },
  { 
    id: 'temp-fade', 
    label: '⚡ Temp Fade / Brooklyn Fade', 
    prompt: 'temple fade focused on sides of forehead and temples, clean line-up, precise edge work',
    description: 'Sfumatura solo sulle tempie e attaccatura frontale'
  }
];

// ========================================
// FUNZIONI DI POPOLAZIONE SELETTORI
// ========================================

function populateHairTexture() {
  const select = document.getElementById('hair-texture');
  if (!select || !selectedGender) return;
  
  select.innerHTML = '';
  
  HAIR_TEXTURES[selectedGender].forEach(texture => {
    const option = document.createElement('option');
    option.value = texture.id;
    option.textContent = texture.label;
    select.appendChild(option);
  });
  
  select.addEventListener('change', () => {
    const protectiveSection = document.getElementById('protective-styles-section');
    if (select.value.includes('coily') || select.value.includes('silk-press')) {
      protectiveSection.classList.remove('hidden');
      populateProtectiveStyles();
    } else {
      protectiveSection.classList.add('hidden');
    }
  });
}

function populateProtectiveStyles() {
  const select = document.getElementById('protective-style');
  if (!select) return;
  
  const noneOption = select.querySelector('option[value="none"]');
  select.innerHTML = '';
  if (noneOption) select.appendChild(noneOption);
  
  PROTECTIVE_STYLES.forEach(style => {
    const option = document.createElement('option');
    option.value = style.id;
    option.textContent = `${style.icon} ${style.label}`;
    select.appendChild(option);
  });
}

function populateColorTechniques() {
  const select = document.getElementById('color-technique');
  if (!select) return;
  
  select.innerHTML = '';
  
  COLOR_TECHNIQUES.forEach(technique => {
    const option = document.createElement('option');
    option.value = technique.id;
    option.textContent = technique.label;
    option.title = technique.description;
    select.appendChild(option);
  });
}

function populateStylingOptions() {
  const select = document.getElementById('styling-finish');
  if (!select) return;
  
  select.innerHTML = '';
  
  STYLING_OPTIONS.forEach(style => {
    const option = document.createElement('option');
    option.value = style.id;
    option.textContent = style.label;
    select.appendChild(option);
  });
}

function populateExtensions() {
  const select = document.getElementById('extensions-type');
  if (!select) return;
  
  select.innerHTML = '';
  
  EXTENSIONS.forEach(ext => {
    const option = document.createElement('option');
    option.value = ext.id;
    option.textContent = ext.label;
    select.appendChild(option);
  });
}

function populateAdvancedFades() {
  const select = document.getElementById('fade-type');
  if (!select) return;
  
  const noneOption = select.querySelector('option[value="none"]');
  select.innerHTML = '';
  if (noneOption) select.appendChild(noneOption);
  
  ADVANCED_FADES.forEach(fade => {
    const option = document.createElement('option');
    option.value = fade.id;
    option.textContent = fade.label;
    option.title = fade.description;
    select.appendChild(option);
  });
}

// ========================================
// GENERATORE PROMPT AI COMPLETO (AGGIORNATO)
// ========================================

function generateAIPrompt() {
  const genderLabels = { F: 'Woman', M: 'Man', X: 'Person' };
  
  let prompt = `Professional salon photography of a ${genderLabels[selectedGender]} `;
  
  // 1. TEXTURE
  const textureEl = document.getElementById('hair-texture');
  if (textureEl && textureEl.value) {
    const texture = HAIR_TEXTURES[selectedGender].find(t => t.id === textureEl.value);
    if (texture) {
      prompt += `with ${texture.prompt}. `;
    }
  }
  
  // 2. HAIRCUT
  const haircutEl = document.getElementById('haircut');
  if (haircutEl && haircutEl.value) {
    prompt += `Hairstyle: ${haircutEl.value}. `;
  }
  
  // 3. PROTECTIVE STYLE (se selezionato)
  const protectiveEl = document.getElementById('protective-style');
  if (protectiveEl && protectiveEl.value !== 'none') {
    const style = PROTECTIVE_STYLES.find(s => s.id === protectiveEl.value);
    if (style) {
      prompt += `${style.prompt}. `;
    }
  }
  
  // 4. EXTENSION (se selezionate)
  const extensionEl = document.getElementById('extensions-type');
  if (extensionEl && extensionEl.value !== 'none') {
    const ext = EXTENSIONS.find(e => e.id === extensionEl.value);
    if (ext && ext.prompt) {
      prompt += `${ext.prompt}. `;
    }
  }
  
  // 5. FORMULA COLORE
  const formulaEl = document.getElementById('formula-code');
  if (formulaEl) {
    const formula = formulaEl.textContent;
    let colorDesc = `Hair color formula: ${formula}`;
    
    if (typeof primaryReflect !== 'undefined' && primaryReflect) {
      const primaryReflectData = REFLECTS[primaryReflect];
      if (primaryReflectData) {
        colorDesc += ` (${primaryReflectData.nameEN || primaryReflectData.name}`;
        
        if (typeof primaryIntensified !== 'undefined' && primaryIntensified) {
          colorDesc += ' INTENSIFIED';
        }
        
        if (typeof secondaryReflect !== 'undefined' && secondaryReflect) {
          const secondaryReflectData = REFLECTS[secondaryReflect];
          if (secondaryReflectData) {
            colorDesc += ` + ${secondaryReflectData.nameEN || secondaryReflectData.name}`;
          }
        }
        colorDesc += ')';
      }
    }
    
    prompt += colorDesc + '. ';
  }
  
  // 6. TECNICA DI APPLICAZIONE
  const techniqueEl = document.getElementById('color-technique');
  if (techniqueEl && techniqueEl.value) {
    const technique = COLOR_TECHNIQUES.find(t => t.id === techniqueEl.value);
    if (technique) {
      prompt += `Color applied as: ${technique.prompt}. `;
    }
  }
  
  // 7. STYLING FINALE
  const stylingEl = document.getElementById('styling-finish');
  if (stylingEl && stylingEl.value && stylingEl.value !== 'natural') {
    const styling = STYLING_OPTIONS.find(s => s.id === stylingEl.value);
    if (styling) {
      prompt += `Styled with ${styling.prompt}. `;
    }
  }
  
  // 8. FADE (se uomo e selezionato)
  const fadeEl = document.getElementById('fade-type');
  if (fadeEl && fadeEl.value !== 'none') {
    const fade = ADVANCED_FADES.find(f => f.id === fadeEl.value);
    if (fade) {
      prompt += `${fade.prompt}. `;
    }
  }
  
  // 9. MAKEUP (se presente)
  const eyeMakeupEl = document.getElementById('eye-makeup');
  if (eyeMakeupEl && eyeMakeupEl.value !== 'Nessuno') {
    prompt += `Eye makeup: ${eyeMakeupEl.value}. `;
  }
  
  const activeLip = document.querySelector('[data-lip].active');
  if (activeLip && activeLip.dataset.lip !== 'none') {
    const lipColor = LIP_COLORS.find(l => l.code === activeLip.dataset.lip);
    if (lipColor) {
      prompt += `Lip color: ${lipColor.name}. `;
    }
  }
  
  // 10. BEARD (se presente)
  const beardStyleEl = document.getElementById('beard-style');
  if (beardStyleEl && beardStyleEl.value !== 'none') {
    prompt += `Beard style: ${beardStyleEl.value}. `;
    
    const activeBeard = document.querySelector('[data-beard].active');
    if (activeBeard) {
      const beardColor = BEARD_COLORS.find(b => b.code === activeBeard.dataset.beard);
      if (beardColor) {
        prompt += `Beard color: ${beardColor.name}. `;
      }
    }
  }
  
  prompt += 'Studio lighting, professional hair salon result, high quality photography.';
  
  console.log('🎨 AI PROMPT COMPLETO:', prompt);
  return prompt;
}

// ========================================
// AUTO-INIT (Chiamato dopo selectGender nel file principale)
// ========================================

function initPillars() {
  populateHairTexture();
  populateColorTechniques();
  populateStylingOptions();
  populateExtensions();
  
  if (selectedGender === 'M' || selectedGender === 'X') {
    populateAdvancedFades();
  }
  
  console.log('✅ Pilastri inizializzati: Texture, Color, Styling, Extensions, Fades');
}

// Export per uso nel file principale
if (typeof window !== 'undefined') {
  window.initPillars = initPillars;
  window.generateAIPrompt = generateAIPrompt;
  window.HAIR_TEXTURES = HAIR_TEXTURES;
  window.PROTECTIVE_STYLES = PROTECTIVE_STYLES;
  window.COLOR_TECHNIQUES = COLOR_TECHNIQUES;
  window.STYLING_OPTIONS = STYLING_OPTIONS;
  window.EXTENSIONS = EXTENSIONS;
  window.ADVANCED_FADES = ADVANCED_FADES;
}