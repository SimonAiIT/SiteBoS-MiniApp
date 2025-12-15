// operator_dashboard_logic.js

const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Config
const API_ENDPOINT = 'https://trinai.api.workflow.dcmake.it/webhook/2e3376d7-6a5a-4fc1-a908-4b8b9501c583';

// URL Params
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chat_id');
const ownerVat = urlParams.get('vat');

// Check params
if (!chatId) {
  alert('❌ Parametri mancanti: chat_id');
  tg.close();
}

// State
let operatorData = null;

// ============================================
// INIT
// ============================================

async function init() {
  showLoader();
  
  try {
    await loadOperatorData();
    populateDashboard();
    hideLoader();
    
    // Welcome haptic
    tg.HapticFeedback.impactOccurred('light');
    
  } catch (error) {
    console.error('Init error:', error);
    alert('❌ Errore nel caricamento dei dati');
    hideLoader();
  }
}

// ============================================
// API CALLS
// ============================================

async function loadOperatorData() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'get_operator_dashboard',
        chat_id: chatId,
        owner_vat: ownerVat
      })
    });
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    
    if (data.status === 'success') {
      operatorData = data.operator;
      
      // Store in sessionStorage
      sessionStorage.setItem('operator_data', JSON.stringify(operatorData));
      sessionStorage.setItem('operator_chat_id', chatId);
      sessionStorage.setItem('owner_vat', ownerVat);
      
    } else {
      throw new Error(data.message || 'Failed to load data');
    }
    
  } catch (error) {
    console.error('Load operator error:', error);
    
    // Fallback to sessionStorage if exists
    const cached = sessionStorage.getItem('operator_data');
    if (cached) {
      operatorData = JSON.parse(cached);
      console.warn('Using cached data');
    } else {
      throw error;
    }
  }
}

// ============================================
// POPULATE DASHBOARD
// ============================================

function populateDashboard() {
  if (!operatorData) return;
  
  // Header
  const fullName = `${operatorData.identity?.name || ''} ${operatorData.identity?.surname || ''}`.trim() || 'Operatore';
  document.getElementById('operatorName').innerText = fullName;
  
  const role = operatorData.professional_profile?.current_role || 'Operatore';
  document.getElementById('operatorRole').innerText = role;
  
  const companyName = operatorData.system_access?.linked_owner?.ragione_sociale || 'Company';
  document.getElementById('companyName').innerText = companyName;
  
  const memberSince = operatorData.system_access?.onboarding_completed_at 
    ? new Date(operatorData.system_access.onboarding_completed_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })
    : 'oggi';
  document.getElementById('memberSince').innerText = memberSince;
  
  // Avatar initial
  const initial = (operatorData.identity?.name?.[0] || '👤').toUpperCase();
  document.getElementById('operator-avatar').innerText = initial;
  
  // Stats
  populateStats();
  
  // Growth section
  populateGrowth();
  
  // Recommended modules
  loadRecommendedModules();
  
  // Notifications
  loadNotifications();
}

function populateStats() {
  // Task attivi (mock - da implementare)
  const activeTasks = operatorData.tasks?.active || 0;
  document.getElementById('stat-tasks').innerText = activeTasks;
  document.getElementById('sub-tasks').innerText = `${activeTasks} in corso`;
  
  // Ore settimana (mock)
  const hoursWeek = operatorData.performance?.hours_this_week || 0;
  document.getElementById('stat-hours').innerText = `${hoursWeek}h`;
  
  // Level (calcolo da XP)
  const xp = operatorData.gamification?.xp || 0;
  const level = calculateLevel(xp);
  document.getElementById('stat-level').innerText = level;
  
  // Streak
  const streak = operatorData.gamification?.streak || 0;
  document.getElementById('stat-streak').innerText = streak;
  
  // Badge
  const badgesUnlocked = operatorData.gamification?.badges?.length || 0;
  document.getElementById('sub-badges').innerText = `${badgesUnlocked}/12 sbloccati`;
}

function populateGrowth() {
  // Competenze tecniche (professional profile)
  const skillsProgress = calculateSkillsProgress();
  document.getElementById('progress-skills').style.width = `${skillsProgress}%`;
  document.getElementById('percent-skills').innerText = `${skillsProgress}%`;
  
  // Soft skills
  const softSkillsProgress = calculateSoftSkillsProgress();
  document.getElementById('progress-softskills').style.width = `${softSkillsProgress}%`;
  document.getElementById('percent-softskills').innerText = `${softSkillsProgress}%`;
  
  // Summary
  const avgProgress = Math.round((skillsProgress + softSkillsProgress) / 2);
  document.getElementById('sub-growth').innerText = `Profilo: ${avgProgress}%`;
}

function calculateSkillsProgress() {
  if (!operatorData.professional_profile) return 0;
  
  const profile = operatorData.professional_profile;
  let filled = 0;
  let total = 6; // fields da valutare
  
  if (profile.current_role) filled++;
  if (profile.years_experience) filled++;
  if (profile.primary_skills?.length) filled++;
  if (profile.secondary_skills?.length) filled++;
  if (profile.certifications?.length) filled++;
  if (profile.education?.length) filled++;
  
  return Math.round((filled / total) * 100);
}

function calculateSoftSkillsProgress() {
  if (!operatorData.soft_skills) return 0;
  
  const softSkills = operatorData.soft_skills;
  const totalQuestions = 150; // from softskill system
  const answeredQuestions = softSkills.completed_questions || 0;
  
  return Math.round((answeredQuestions / totalQuestions) * 100);
}

function calculateLevel(xp) {
  const levels = [
    { level: 1, xp: 0 },
    { level: 2, xp: 500 },
    { level: 3, xp: 1500 },
    { level: 4, xp: 3000 },
    { level: 5, xp: 5000 },
    { level: 6, xp: 8000 },
    { level: 7, xp: 12000 },
    { level: 8, xp: 17000 },
    { level: 9, xp: 23000 },
    { level: 10, xp: 30000 }
  ];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      return levels[i].level;
    }
  }
  
  return 1;
}

function loadRecommendedModules() {
  const container = document.getElementById('recommended-modules');
  
  // Mock modules (da integrare con sistema formazione)
  const modules = [
    { title: 'Comunicazione Efficace', duration: '30 min', icon: '🗣️' },
    { title: 'Problem Solving', duration: '25 min', icon: '🧩' },
    { title: 'Team Leadership', duration: '45 min', icon: '👥' }
  ];
  
  if (modules.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">Nessun modulo disponibile al momento</div>';
    return;
  }
  
  container.innerHTML = modules.map(m => `
    <div style="display:flex; align-items:center; gap:12px; padding:12px; background:rgba(255,255,255,0.03); border-radius:8px; margin-bottom:8px; cursor:pointer;" onclick="openModule('${m.title}')">
      <div style="font-size:28px;">${m.icon}</div>
      <div style="flex:1;">
        <div style="font-weight:600; font-size:14px;">${m.title}</div>
        <div style="font-size:11px; color:var(--text-muted);">${m.duration}</div>
      </div>
      <i class="fas fa-chevron-right" style="color:var(--text-muted);"></i>
    </div>
  `).join('');
  
  document.getElementById('sub-training').innerText = `${modules.length} moduli disponibili`;
}

function loadNotifications() {
  const container = document.getElementById('notifications-list');
  
  // Mock notifications
  const notifications = operatorData.notifications || [];
  
  if (notifications.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:13px;">Nessuna notifica</div>';
    return;
  }
  
  container.innerHTML = notifications.slice(0, 3).map(n => `
    <div style="display:flex; align-items:start; gap:10px; padding:10px; border-bottom:1px solid var(--glass-border);">
      <div style="font-size:20px;">${n.icon || '🔔'}</div>
      <div style="flex:1;">
        <div style="font-size:13px; font-weight:600;">${n.title}</div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${n.time}</div>
      </div>
    </div>
  `).join('');
}

// ============================================
// NAVIGATION
// ============================================

function navTo(section) {
  tg.HapticFeedback.impactOccurred('light');
  
  const routes = {
    'growth': 'operator_growth.html',
    'tasks': 'operator_tasks.html',
    'badges': 'operator_badges.html',
    'training': 'operator_training.html',
    'calendar': 'operator_calendar.html'
  };
  
  const page = routes[section];
  
  if (page) {
    window.location.href = `${page}?chat_id=${chatId}&vat=${ownerVat}`;
  } else {
    alert(`⚠️ Sezione "${section}" in sviluppo`);
  }
}

function navToSkills() {
  tg.HapticFeedback.impactOccurred('light');
  alert('🛠️ Sezione "Profilo Competenze" in sviluppo');
}

function goToSoftSkills() {
  tg.HapticFeedback.impactOccurred('light');
  
  // Redirect to softskill complete-profile
  window.location.href = `../softskill/complete-profile.html?chat_id=${chatId}&role=operator`;
}

function openModule(title) {
  tg.HapticFeedback.impactOccurred('light');
  alert(`🎬 Apertura modulo: ${title}`);
}

function openSettings() {
  tg.HapticFeedback.impactOccurred('light');
  alert('⚙️ Impostazioni operatore in sviluppo');
}

// ============================================
// LOADER
// ============================================

function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
  document.getElementById('app-content').classList.add('hidden');
}

function hideLoader() {
  document.getElementById('loader').classList.add('hidden');
  document.getElementById('app-content').classList.remove('hidden');
}

// ============================================
// INIT ON LOAD
// ============================================

document.addEventListener('DOMContentLoaded', init);