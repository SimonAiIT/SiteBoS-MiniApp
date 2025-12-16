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
        // Set global selectedGender variable
        selectGender(gender);
        console.log(`🎯 Gender auto-selected: ${gender}`);
        
        // If coming from photo session:
        // - Photos are already in sessionStorage
        // - Skip gender section
        // - Skip camera section  
        // - Go directly to brand-selection
        // - When user selects brand, selectSystem() will automatically go to config
        if (fromPhotoSession) {
          console.log('📸 From Photo Session detected');
          console.log('🚀 Fast-track: Skip gender/camera, go to brand selection');
          console.log('📄 Photos in sessionStorage, ready to use');
          
          const genderSection = document.getElementById('gender-section');
          const cameraSection = document.getElementById('camera-section');
          const brandSection = document.getElementById('brand-selection');
          
          // Hide sections we want to skip
          if (genderSection) genderSection.classList.add('hidden');
          if (cameraSection) cameraSection.classList.add('hidden');
          
          // Show brand selection immediately
          if (brandSection) {
            brandSection.classList.remove('hidden');
            console.log('✅ Brand selection shown - user must choose system');
            console.log('💡 After brand selection, will auto-proceed to config');
          }
        }
      }, 100);
    } else {
      console.error('❌ selectGender() not found!');
    }
  }
})();

console.log('✅ Auto-gender init loaded');