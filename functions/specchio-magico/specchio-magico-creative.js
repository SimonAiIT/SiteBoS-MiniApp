// ========================================
// SPECCHIO MAGICO AI - CREATIVE COLORS SYSTEM
// Sistema Pigmentazione Pura per Genere Fluid (Rainbow/Fashion Colors)
// ========================================

// ========================================
// CREATIVE COLORS DATABASE (40+ Colors)
// ========================================

const CREATIVE_COLORS = {
  // ========== PASTELS (10) ==========
  'pastel-pink': { 
    name: 'Rosa Pastello', 
    hex: '#FFB3D9', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Blush',
      'pravana': 'Pink',
      'manic-panic': 'Cotton Candy Pink',
      'arctic-fox': 'Girls Night'
    }
  },
  'pastel-blue': { 
    name: 'Blu Pastello', 
    hex: '#B4D7FF', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Powder',
      'pravana': 'Blue',
      'manic-panic': 'Blue Angel'
    }
  },
  'pastel-lavender': { 
    name: 'Lavanda', 
    hex: '#E6CCFF', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Lilac',
      'arctic-fox': 'Purple Rain'
    }
  },
  'pastel-mint': { 
    name: 'Menta', 
    hex: '#B3FFD9', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Sea Glass',
      'manic-panic': 'Mermaid'
    }
  },
  'pastel-peach': { 
    name: 'Pesca', 
    hex: '#FFD4B3', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Blush',
      'arctic-fox': 'Sunset Orange (diluted)'
    }
  },
  'pastel-lilac': { 
    name: 'Lillà', 
    hex: '#E8D5FF', 
    category: 'pastel',
    brands: {
      'pravana': 'Violet',
      'arctic-fox': 'Purple Rain'
    }
  },
  'pastel-yellow': { 
    name: 'Giallo Chiaro', 
    hex: '#FFF4B3', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Lemon',
      'arctic-fox': 'Cosmic Sunshine'
    }
  },
  'pastel-coral': { 
    name: 'Corallo', 
    hex: '#FFB8B3', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Cupid',
      'arctic-fox': 'Sunset Orange'
    }
  },
  'pastel-turquoise': { 
    name: 'Turchese Chiaro', 
    hex: '#B3F0FF', 
    category: 'pastel',
    brands: {
      'pulp-riot': 'Aquatic',
      'manic-panic': 'Atomic Turquoise'
    }
  },
  'pastel-rose': { 
    name: 'Rosa Antico', 
    hex: '#FFD9E6', 
    category: 'pastel',
    brands: {
      'arctic-fox': 'Frose',
      'pravana': 'Pink'
    }
  },

  // ========== VIVIDS (15) ==========
  'vivid-pink': { 
    name: 'Fucsia', 
    hex: '#FF1493', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Candy',
      'pravana': 'Magenta',
      'manic-panic': 'Hot Hot Pink'
    }
  },
  'vivid-blue': { 
    name: 'Blu Elettrico', 
    hex: '#0080FF', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Nirvana',
      'manic-panic': 'Electric Blue',
      'arctic-fox': 'Poseidon'
    }
  },
  'vivid-purple': { 
    name: 'Viola Intenso', 
    hex: '#9932CC', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Jam',
      'pravana': 'Violet',
      'arctic-fox': 'Purple Rain'
    }
  },
  'vivid-green': { 
    name: 'Verde Smeraldo', 
    hex: '#00FF7F', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Absinthe',
      'manic-panic': 'Green Envy',
      'arctic-fox': 'Phantom Green'
    }
  },
  'vivid-orange': { 
    name: 'Arancione', 
    hex: '#FF6600', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Fireball',
      'arctic-fox': 'Sunset Orange'
    }
  },
  'vivid-red': { 
    name: 'Rosso Fuoco', 
    hex: '#FF0000', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Candy',
      'manic-panic': 'Pillarbox Red',
      'pravana': 'Red'
    }
  },
  'vivid-yellow': { 
    name: 'Giallo Sole', 
    hex: '#FFD700', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Lemon',
      'arctic-fox': 'Cosmic Sunshine'
    }
  },
  'vivid-turquoise': { 
    name: 'Turchese', 
    hex: '#00CED1', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Aquatic',
      'manic-panic': 'Atomic Turquoise'
    }
  },
  'vivid-magenta': { 
    name: 'Magenta', 
    hex: '#FF00FF', 
    category: 'vivid',
    brands: {
      'pravana': 'Magenta',
      'pulp-riot': 'Candy'
    }
  },
  'vivid-lime': { 
    name: 'Verde Lime', 
    hex: '#BFFF00', 
    category: 'vivid',
    brands: {
      'manic-panic': 'Electric Lizard',
      'arctic-fox': 'Phantom Green'
    }
  },
  'vivid-aqua': { 
    name: 'Acquamarina', 
    hex: '#00FFFF', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Aquatic',
      'manic-panic': 'Siren\'s Song'
    }
  },
  'vivid-violet': { 
    name: 'Violetto', 
    hex: '#8B00FF', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Jam',
      'arctic-fox': 'Purple Rain'
    }
  },
  'vivid-coral': { 
    name: 'Corallo Vivace', 
    hex: '#FF7F50', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Cupid',
      'arctic-fox': 'Sunset Orange'
    }
  },
  'vivid-rose': { 
    name: 'Rosa Shocking', 
    hex: '#FF007F', 
    category: 'vivid',
    brands: {
      'pravana': 'Magenta',
      'manic-panic': 'Hot Hot Pink'
    }
  },
  'vivid-indigo': { 
    name: 'Indaco', 
    hex: '#4B0082', 
    category: 'vivid',
    brands: {
      'pulp-riot': 'Nightfall',
      'manic-panic': 'Shocking Blue'
    }
  },

  // ========== NEONS (8) ==========
  'neon-pink': { 
    name: 'Neon Pink', 
    hex: '#FF10F0', 
    category: 'neon',
    brands: {
      'manic-panic': 'Electric Amethyst',
      'pravana': 'Neon Pink'
    }
  },
  'neon-yellow': { 
    name: 'Neon Yellow', 
    hex: '#FFFF00', 
    category: 'neon',
    brands: {
      'pravana': 'Neon Yellow',
      'pulp-riot': 'Lemon'
    }
  },
  'neon-green': { 
    name: 'Neon Green', 
    hex: '#39FF14', 
    category: 'neon',
    brands: {
      'pravana': 'Neon Green',
      'manic-panic': 'Electric Lizard'
    }
  },
  'neon-orange': { 
    name: 'Neon Orange', 
    hex: '#FF6600', 
    category: 'neon',
    brands: {
      'pravana': 'Neon Orange',
      'arctic-fox': 'Cosmic Sunshine'
    }
  },
  'neon-blue': { 
    name: 'Neon Blue', 
    hex: '#00D4FF', 
    category: 'neon',
    brands: {
      'pravana': 'Neon Blue',
      'manic-panic': 'Electric Blue'
    }
  },
  'neon-purple': { 
    name: 'Neon Purple', 
    hex: '#BF00FF', 
    category: 'neon',
    brands: {
      'pravana': 'Neon Purple',
      'arctic-fox': 'Purple Rain'
    }
  },
  'neon-magenta': { 
    name: 'Neon Magenta', 
    hex: '#FF00AA', 
    category: 'neon',
    brands: {
      'manic-panic': 'Electric Amethyst'
    }
  },
  'neon-coral': { 
    name: 'Neon Coral', 
    hex: '#FF6F61', 
    category: 'neon',
    brands: {
      'arctic-fox': 'Sunset Orange'
    }
  },

  // ========== METALLICS (7) ==========
  'metallic-silver': { 
    name: 'Argento Metallico', 
    hex: '#C0C0C0', 
    category: 'metallic',
    brands: {
      'pravana': 'Silver',
      'pulp-riot': 'Mercury'
    }
  },
  'metallic-rose-gold': { 
    name: 'Rose Gold', 
    hex: '#B76E79', 
    category: 'metallic',
    brands: {
      'arctic-fox': 'Frose',
      'pulp-riot': 'Blush'
    }
  },
  'metallic-copper': { 
    name: 'Rame', 
    hex: '#B87333', 
    category: 'metallic',
    brands: {
      'pravana': 'Copper',
      'pulp-riot': 'Barcelona'
    }
  },
  'metallic-platinum': { 
    name: 'Platino', 
    hex: '#E5E4E2', 
    category: 'metallic',
    brands: {
      'pravana': 'Silver',
      'pulp-riot': 'Ice'
    }
  },
  'metallic-bronze': { 
    name: 'Bronzo', 
    hex: '#CD7F32', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Bronze',
      'pravana': 'Wild Orchid'
    }
  },
  'metallic-gold': { 
    name: 'Oro', 
    hex: '#FFD700', 
    category: 'metallic',
    brands: {
      'pulp-riot': 'Lemon',
      'arctic-fox': 'Cosmic Sunshine'
    }
  },
  'metallic-pearl': { 
    name: 'Perla', 
    hex: '#F0EAD6', 
    category: 'metallic',
    brands: {
      'pravana': 'Silver (toned)',
      'pulp-riot': 'Ice'
    }
  }
};

// ========================================
// CATEGORY LABELS
// ========================================

const CREATIVE_CATEGORIES = {
  'pastel': { label: '🌸 Pastelli', icon: '🌸' },
  'vivid': { label: '🔥 Vivaci', icon: '🔥' },
  'neon': { label: '⚡ Neon', icon: '⚡' },
  'metallic': { label: '✨ Metallici', icon: '✨' }
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function getCreativeColorsByCategory(category) {
  return Object.entries(CREATIVE_COLORS)
    .filter(([id, color]) => color.category === category)
    .map(([id, color]) => ({ id, ...color }));
}

function getAllCreativeColors() {
  return Object.entries(CREATIVE_COLORS)
    .map(([id, color]) => ({ id, ...color }));
}

function getCreativeColorById(id) {
  return CREATIVE_COLORS[id] || null;
}

// ========================================
// EXPORT
// ========================================

if (typeof window !== 'undefined') {
  window.CREATIVE_COLORS = CREATIVE_COLORS;
  window.CREATIVE_CATEGORIES = CREATIVE_CATEGORIES;
  window.getCreativeColorsByCategory = getCreativeColorsByCategory;
  window.getAllCreativeColors = getAllCreativeColors;
  window.getCreativeColorById = getCreativeColorById;
}

console.log('✅ Creative Colors System loaded (' + Object.keys(CREATIVE_COLORS).length + ' colors)');