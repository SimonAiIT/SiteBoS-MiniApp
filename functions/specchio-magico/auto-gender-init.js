// ========================================
// AUTO-GENDER INITIALIZATION
// Handles URL params from Photo Session
// ========================================

(function() {
  console.log('🔍 Checking URL params for auto-gender...');
  
  const urlParams = new URLSearchParams(window.location.search);
  const genderFromURL = urlParams.get('gender');
  const fromPhotoSession = urlParams.get('fromPhotoSession') === 'true';
  
  if (genderFromURL && ['F', 'M', 'X'].includes(genderFromURL)) {
    console.log(`✅ Auto-selecting gender: ${genderFromURL}`);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => autoSelectGender(genderFromURL, fromPhotoSession));
    } else {
      autoSelectGender(genderFromURL, fromPhotoSession);
    }
  } else {
    console.log('ℹ️ No gender in URL, showing selection');
  }
  
  function autoSelectGender(gender, fromPhotoSession) {
    // Auto-select gender programmatically
    if (typeof selectGender === 'function') {
      setTimeout(() => {
        selectGender(gender);
        console.log(`🎯 Gender auto-selected: ${gender}`);
        
        // If coming from photo session:
        // - Photos are already in sessionStorage
        // - Skip gender section
        // - Skip camera section
        // - Go directly to brand-selection
        if (fromPhotoSession) {
          console.log('📸 From Photo Session - skipping camera, using stored photos');
          
          const genderSection = document.getElementById('gender-section');
          const cameraSection = document.getElementById('camera-section');
          const brandSection = document.getElementById('brand-selection');
          
          // Hide sections we want to skip
          if (genderSection) genderSection.classList.add('hidden');
          if (cameraSection) cameraSection.classList.add('hidden');
          
          // Show brand selection
          if (brandSection) brandSection.classList.remove('hidden');
          
          console.log('✅ Ready for brand selection (photos already captured)');
        }
      }, 100);
    } else {
      console.error('❌ selectGender() not found!');
    }
  }
})();

console.log('✅ Auto-gender init loaded');