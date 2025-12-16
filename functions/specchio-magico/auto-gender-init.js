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
    console.log('ℹ️ No gender in URL, showing normal flow');
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
        // - REMOVE gender and camera sections completely (not just hide)
        // - Wait for photo to load
        // - Go directly to brand-selection
        if (fromPhotoSession) {
          console.log('📸 From Photo Session detected');
          console.log('🔥 Removing unnecessary sections from DOM...');
          
          const genderSection = document.getElementById('gender-section');
          const cameraSection = document.getElementById('camera-section');
          const brandSection = document.getElementById('brand-selection');
          
          // REMOVE sections completely (not hide - eliminate from DOM)
          if (genderSection) {
            genderSection.remove();
            console.log('🗑️ Gender section removed');
          }
          if (cameraSection) {
            cameraSection.remove();
            console.log('🗑️ Camera section removed');
          }
          
          // Wait for photo to be loaded from sessionStorage
          console.log('⏳ Waiting for photo to load from sessionStorage...');
          
          const checkPhotoInterval = setInterval(() => {
            // Check if capturedPhotoBlob is ready (loaded by specchio-magico.js)
            if (typeof capturedPhotoBlob !== 'undefined' && capturedPhotoBlob !== null) {
              clearInterval(checkPhotoInterval);
              
              console.log('✅ Photo loaded from sessionStorage');
              console.log('🚀 Ready to proceed - showing brand selection');
              
              // Show brand selection
              if (brandSection) {
                brandSection.classList.remove('hidden');
                console.log('✅ Brand selection shown');
                console.log('💡 User selects brand → auto-proceeds to config');
              }
            }
          }, 100); // Check every 100ms
          
          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(checkPhotoInterval);
            if (typeof capturedPhotoBlob === 'undefined' || capturedPhotoBlob === null) {
              console.error('❌ Photo not loaded after 5s - showing brand selection anyway');
              if (brandSection) brandSection.classList.remove('hidden');
            }
          }, 5000);
        }
      }, 100);
    } else {
      console.error('❌ selectGender() not found!');
    }
  }
})();

console.log('✅ Auto-gender init loaded');