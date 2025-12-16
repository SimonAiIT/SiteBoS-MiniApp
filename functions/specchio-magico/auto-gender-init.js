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
    // Hide brand-selection and show gender-section briefly
    const brandSection = document.getElementById('brand-selection');
    const genderSection = document.getElementById('gender-section');
    
    if (brandSection) brandSection.classList.add('hidden');
    if (genderSection) genderSection.classList.remove('hidden');
    
    // Auto-select gender programmatically
    if (typeof selectGender === 'function') {
      setTimeout(() => {
        selectGender(gender);
        console.log(`🎯 Gender auto-selected: ${gender}`);
        
        // If coming from photo session, auto-proceed to camera
        if (fromPhotoSession) {
          console.log('📸 From Photo Session - proceeding to camera...');
          setTimeout(() => {
            if (typeof startCamera === 'function') {
              startCamera();
            }
          }, 500);
        }
      }, 100);
    } else {
      console.error('❌ selectGender() not found!');
    }
  }
})();

console.log('✅ Auto-gender init loaded');