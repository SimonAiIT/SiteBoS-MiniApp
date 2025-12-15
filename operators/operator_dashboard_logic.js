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
    
    if (data.status === 'success' && data.stakeholder) {
      // Map stakeholder document to dashboard format
      operatorData = mapStakeholderToDashboard(data.stakeholder);
      
      // Store in sessionStorage
      sessionStorage.setItem('operator_data', JSON.stringify(operatorData));
      sessionStorage.setItem('stakeholder_raw', JSON.stringify(data.stakeholder));
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
// MAPPER: Stakeholder Document → Dashboard Data
// ============================================

function mapStakeholderToDashboard(stakeholder) {
  return {
    // IDENTITY
    identity: {
      name: stakeholder.identity?.full_name?.split(' ')[0] || 'Operatore',
      surname: stakeholder.identity?.full_name?.split(' ').slice(1).join(' ') || '',
      full_name: stakeholder.identity?.full_name || 'Operatore',
      email: stakeholder.identity?.primary_contact?.email || '',
      phone: stakeholder.identity?.primary_contact?.phone || ''
    },
    
    // PROFESSIONAL PROFILE
    professional_profile: {
      current_role: stakeholder.identity?.professional_background?.current_role || 'Operatore',
      years_experience: stakeholder.professional_profile?.years_experience || '0',
      primary_skills: stakeholder.professional_profile?.hard_skills?.slice(0, 5) || [],
      secondary_skills: stakeholder.professional_profile?.hard_skills?.slice(5) || [],
      all_skills: stakeholder.professional_profile?.hard_skills || [],
      certifications: parseCertifications(stakeholder.professional_profile?.certifications),
      education: [{ 
        degree: stakeholder.identity?.professional_background?.education || 'N/A',
        institution: '',
        year: ''
      }]
    },
    
    // SOFT SKILLS
    soft_skills: {
      completed_questions: calculateCompletedQuestions(stakeholder.professional_profile?.soft_skills_modules),
      total_questions: 150,
      completion_percentage: calculateSoftSkillsCompletion(stakeholder.professional_profile?.soft_skills_modules),
      modules_completed: getCompletedModules(stakeholder.professional_profile?.soft_skills_modules),
      learning_history: stakeholder.professional_profile?.learning_history || {
        videos_completed: [],
        total_videos_watched: 0,
        last_learning_activity: null
      }
    },
    
    // GAMIFICATION (mock - da implementare in stakeholder schema)
    gamification: {
      xp: stakeholder.gamification?.xp || 0,
      level: stakeholder.gamification?.level || 1,
      streak: stakeholder.gamification?.streak || 0,
      streak_best: stakeholder.gamification?.streak_best || 0,
      badges: stakeholder.gamification?.badges || []
    },
    
    // TASKS (mock - da implementare)
    tasks: {
      active: stakeholder.tasks?.active || 0,
      completed_today: stakeholder.tasks?.completed_today || 0,
      pending: stakeholder.tasks?.pending || 0,
      overdue: stakeholder.tasks?.overdue || 0
    },
    
    // PERFORMANCE (mock - da implementare)
    performance: {
      hours_this_week: stakeholder.performance?.hours_this_week || 0,
      hours_today: stakeholder.performance?.hours_today || 0,
      tasks_completed_week: stakeholder.performance?.tasks_completed_week || 0,
      average_rating: stakeholder.performance?.average_rating || 0
    },
    
    // SYSTEM ACCESS
    system_access: {
      telegram_chat_id: stakeholder.system_access?.telegram_chat_id || '',
      onboarding_completed_at: stakeholder.system_access?.invitation_metadata?.invited_at || stakeholder.metadata?.created_at,
      linked_owner: {
        vat_number: stakeholder.system_access?.linked_owner?.vat_number || '',
        ragione_sociale: stakeholder.system_access?.linked_owner?.company_name || 'Company',
        logo_url: null
      }
    },
    
    // NOTIFICATIONS
    notifications: generateWelcomeNotifications(stakeholder),
    
    // METADATA
    metadata: {
      status: stakeholder.metadata?.status || 'ACTIVE',
      stakeholder_type: stakeholder.metadata?.stakeholder_type || 'OPERATOR',
      created_at: stakeholder.metadata?.created_at
    }
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function parseCertifications(certString) {
  if (!certString) return [];
  
  const certArray = certString.split(',').map(c => c.trim());
  
  return certArray.map(cert => {
    const yearMatch = cert.match(/\((\d{4})\)/);
    const year = yearMatch ? yearMatch[1] : '';
    const title = cert.replace(/\(\d{4}\)/, '').trim();
    
    return { title, year };
  }).slice(0, 5);
}

function calculateCompletedQuestions(softSkillsModules) {
  if (!softSkillsModules || typeof softSkillsModules !== 'object') return 0;
  
  let total = 0;
  Object.values(softSkillsModules).forEach(module => {
    if (module?.progress?.questions_answered) {
      total += module.progress.questions_answered;
    }
  });
  
  return total;
}

function calculateSoftSkillsCompletion(softSkillsModules) {
  const completed = calculateCompletedQuestions(softSkillsModules);
  return Math.round((completed / 150) * 100);
}

function getCompletedModules(softSkillsModules) {
  if (!softSkillsModules) return [];
  
  return Object.entries(softSkillsModules)
    .filter(([key, module]) => module?.completed === true)
    .map(([key, module]) => ({
      name: key,
      score: module?.score || 0
    }));
}

function generateWelcomeNotifications(stakeholder) {
  const notifications = [];
  
  notifications.push({
    id: 'welcome',
    icon: '🎉',
    title: `Benvenuto in ${stakeholder.system_access?.linked_owner?.company_name || 'Team'}!`,
    time: 'oggi',
    read: false
  });
  
  const softSkillsProgress = calculateSoftSkillsCompletion(stakeholder.professional_profile?.soft_skills_modules);
  if (softSkillsProgress < 100) {
    notifications.push({
      id: 'softskills',
      icon: '🎯',
      title: 'Completa il tuo Profilo Comportamentale',
      time: 'oggi',
      read: false
    });
  }
  
  if (!stakeholder.professional_profile?.hard_skills?.length) {
    notifications.push({
      id: 'skills',
      icon: '🧠',
      title: 'Aggiungi le tue competenze tecniche',
      time: 'oggi',
      read: false
    });
  }
  
  return notifications;
}

// ============================================
// POPULATE DASHBOARD
// ============================================

function populateDashboard() {
  if (!operatorData) return;
  
  // Header
  const fullName = operatorData.identity.full_name;
  document.getElementById('operatorName').innerText = fullName;
  
  const role = operatorData.professional_profile.current_role;
  document.getElementById('operatorRole').innerText = role;
  
  const companyName = operatorData.system_access.linked_owner.ragione_sociale;
  document.getElementById('companyName').innerText = companyName;
  
  const memberSince = operatorData.system_access.onboarding_completed_at 
    ? new Date(operatorData.system_access.onboarding_completed_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })
    : 'oggi';
  document.getElementById('memberSince').innerText = memberSince;
  
  // Avatar con logo owner
  loadOwnerLogo();
  
  // Stats
  populateStats();
  
  // Growth section
  populateGrowth();
  
  // Recommended modules
  loadRecommendedModules();
  
  // Notifications
  loadNotifications();
}

function loadOwnerLogo() {
  const ownerVat = operatorData.system_access.linked_owner.vat_number;
  const avatarDiv = document.getElementById('operator-avatar');
  
  if (!ownerVat || !avatarDiv) return;
  
  const extensions = ['png', 'jpg', 'jpeg', 'svg'];
  let currentIndex = 0;
  
  function tryLoadLogo() {
    if (currentIndex >= extensions.length) {
      return;
    }
    
    const ext = extensions[currentIndex];
    const logoPath = `../logos/logo_${ownerVat}.${ext}`;
    
    const img = new Image();
    img.onload = function() {
      avatarDiv.innerHTML = `<img src="${logoPath}" alt="Logo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    };
    img.onerror = function() {
      currentIndex++;
      tryLoadLogo();
    };
    img.src = logoPath;
  }
  
  tryLoadLogo();
}

function populateStats() {
  const activeTasks = operatorData.tasks.active;
  document.getElementById('stat-tasks').innerText = activeTasks;
  document.getElementById('sub-tasks').innerText = `${activeTasks} in corso`;
  
  const hoursWeek = operatorData.performance.hours_this_week;
  document.getElementById('stat-hours').innerText = `${hoursWeek}h`;
  
  const xp = operatorData.gamification.xp;
  const level = calculateLevel(xp);
  document.getElementById('stat-level').innerText = level;
  
  const streak = operatorData.gamification.streak;
  document.getElementById('stat-streak').innerText = streak;
  
  const badgesUnlocked = operatorData.gamification.badges.length;
  document.getElementById('sub-badges').innerText = `${badgesUnlocked}/12 sbloccati`;
}

function populateGrowth() {
  const skillsProgress = calculateSkillsProgress();
  document.getElementById('progress-skills').style.width = `${skillsProgress}%`;
  document.getElementById('percent-skills').innerText = `${skillsProgress}%`;
  
  const softSkillsProgress = operatorData.soft_skills.completion_percentage;
  document.getElementById('progress-softskills').style.width = `${softSkillsProgress}%`;
  document.getElementById('percent-softskills').innerText = `${softSkillsProgress}%`;
  
  const avgProgress = Math.round((skillsProgress + softSkillsProgress) / 2);
  document.getElementById('sub-growth').innerText = `Profilo: ${avgProgress}%`;
}

function calculateSkillsProgress() {
  if (!operatorData.professional_profile) return 0;
  
  const profile = operatorData.professional_profile;
  let filled = 0;
  let total = 6;
  
  if (profile.current_role && profile.current_role !== 'Operatore') filled++;
  if (profile.years_experience && profile.years_experience !== '0') filled++;
  if (profile.primary_skills?.length) filled++;
  if (profile.secondary_skills?.length) filled++;
  if (profile.certifications?.length) filled++;
  if (profile.education?.[0]?.degree !== 'N/A') filled++;
  
  return Math.round((filled / total) * 100);
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
  // Passa vat (owner) e user_id (operator chat_id) al sistema soft skills
  window.location.href = `../softskill/dashboard.html?vat=${ownerVat}&user_id=${chatId}&role=operator`;
}

function openModule(title) {
  tg.HapticFeedback.impactOccurred('light');
  alert(`🎬 Apertura modulo: ${title}`);
}

function openSettings() {
  tg.HapticFeedback.impactOccurred('light');
  window.location.href = `edit_operator.html?chat_id=${chatId}&vat=${ownerVat}`;
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