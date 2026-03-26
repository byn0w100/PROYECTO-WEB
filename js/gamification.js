// ═══════════════════════════════════════════════════════════════════════════
// GAMIFICATION.JS — XP, niveles, racha diaria + estadísticas avanzadas
// Persistencia completa en localStorage
// ═══════════════════════════════════════════════════════════════════════════

const Gamification = (() => {
  // ── NIVELES (10 niveles para más progresión) ──────────────────────────
  const LEVELS = [
    { min: 0,    max: 99,    name: 'Novato',         icon: '🌱', color: '#8b949e', rank: 1 },
    { min: 100,  max: 249,   name: 'Aprendiz',       icon: '📘', color: '#58a6ff', rank: 2 },
    { min: 250,  max: 499,   name: 'Hacker Jr.',     icon: '💻', color: '#3fb950', rank: 3 },
    { min: 500,  max: 799,   name: 'Operador',       icon: '🔧', color: '#39d353', rank: 4 },
    { min: 800,  max: 1199,  name: 'Pentester',      icon: '🔓', color: '#e3b341', rank: 5 },
    { min: 1200, max: 1699,  name: 'Hacker',         icon: '☠️', color: '#f0883e', rank: 6 },
    { min: 1700, max: 2299,  name: 'Red Team',       icon: '🔴', color: '#f85149', rank: 7 },
    { min: 2300, max: 2999,  name: 'Cyber Ninja',    icon: '🥷', color: '#d2a8ff', rank: 8 },
    { min: 3000, max: 3999,  name: 'Elite',          icon: '👑', color: '#f0883e', rank: 9 },
    { min: 4000, max: 99999, name: 'Leyenda',        icon: '⚡', color: '#ff7b72', rank: 10 },
  ];

  let xp = 0;
  let completedLessons = new Set();

  // ── STREAK ────────────────────────────────────────────────────────────
  let streak = {
    currentDays: 0,
    lastLoginDate: null,  // 'YYYY-MM-DD'
    longestStreak: 0,
    freezesUsed: 0,
    totalDays: 0,
  };

  const STREAK_BONUSES = [
    { days: 3,  xp: 75,  msg: '🔥 ¡Racha de 3 días! +75 XP' },
    { days: 7,  xp: 150, msg: '💥 ¡Semana completa! +150 XP' },
    { days: 14, xp: 250, msg: '🌟 ¡2 semanas! +250 XP' },
    { days: 30, xp: 500, msg: '⚡ ¡30 días seguidos! +500 XP' },
  ];

  // ── INICIALIZACIÓN ────────────────────────────────────────────────────
  function init() {
    xp = parseInt(localStorage.getItem('linuxlab_xp') || '0');
    const savedLessons = localStorage.getItem('linuxlab_done');
    if (savedLessons) completedLessons = new Set(JSON.parse(savedLessons));
    const savedStreak = localStorage.getItem('linuxlab_streak');
    if (savedStreak) streak = JSON.parse(savedStreak);
    checkStreak();
  }

  function save() {
    localStorage.setItem('linuxlab_xp', String(xp));
    localStorage.setItem('linuxlab_done', JSON.stringify([...completedLessons]));
    localStorage.setItem('linuxlab_streak', JSON.stringify(streak));
  }

  // ── STREAK LOGIC ──────────────────────────────────────────────────────
  function getToday() {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  }

  function daysBetween(d1, d2) {
    const a = new Date(d1), b = new Date(d2);
    return Math.round(Math.abs((a - b) / (1000 * 60 * 60 * 24)));
  }

  function checkStreak() {
    const today = getToday();
    if (streak.lastLoginDate === today) return; // Already checked today

    if (!streak.lastLoginDate) {
      // First ever login
      streak.currentDays = 1;
      streak.lastLoginDate = today;
      streak.totalDays = 1;
    } else {
      const gap = daysBetween(streak.lastLoginDate, today);
      if (gap === 1) {
        // Consecutive day!
        streak.currentDays++;
        streak.totalDays++;
        streak.lastLoginDate = today;

        // Check for milestone bonuses
        STREAK_BONUSES.forEach(sb => {
          if (streak.currentDays === sb.days) {
            addXP(sb.xp, 'streak');
            showStreakBonus(sb);
          }
        });
      } else if (gap > 1) {
        // Streak broken
        streak.currentDays = 1;
        streak.lastLoginDate = today;
        streak.totalDays++;
      }
    }

    if (streak.currentDays > streak.longestStreak) {
      streak.longestStreak = streak.currentDays;
    }

    save();

    // Track for achievements
    if (typeof Achievements !== 'undefined') {
      Achievements.trackStreak(streak.currentDays);
    }
  }

  function showStreakBonus(sb) {
    const notif = document.createElement('div');
    notif.className = 'streak-bonus-notif';
    notif.innerHTML = `
      <div class="streak-bonus-icon">🔥</div>
      <div class="streak-bonus-text">${sb.msg}</div>
    `;
    document.body.appendChild(notif);
    requestAnimationFrame(() => notif.classList.add('show'));
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 500);
    }, 3000);
  }

  // ── XP ────────────────────────────────────────────────────────────────
  function addXP(amount, source = 'unknown') {
    const prevLevel = getLevel();
    xp = Math.max(0, xp + amount);
    save();
    updateXPDisplay();

    if (amount > 0) showXPPopup(amount);

    const newLevel = getLevel();
    if (newLevel.name !== prevLevel.name && amount > 0) {
      showLevelUp(newLevel);
    }
  }

  function getXP() { return xp; }

  function getLevel() {
    for (const level of LEVELS) {
      if (xp >= level.min && xp <= level.max) return level;
    }
    return LEVELS[LEVELS.length - 1];
  }

  function getNextLevel() {
    const current = getLevel();
    const idx = LEVELS.indexOf(current);
    return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  }

  function getProgressToNextLevel() {
    const level = getLevel();
    const next = getNextLevel();
    if (!next) return 100;
    const range = level.max - level.min + 1;
    const progress = xp - level.min;
    return Math.round((progress / range) * 100);
  }

  // ── LECCIONES ─────────────────────────────────────────────────────────
  function markLessonDone(lessonId) {
    if (completedLessons.has(lessonId)) {
      completedLessons.delete(lessonId);
    } else {
      completedLessons.add(lessonId);
      addXP(50, 'lesson');
    }
    save();

    // Track for achievements
    if (typeof Achievements !== 'undefined') {
      Achievements.trackLessonComplete(completedLessons.size,
        typeof flatLessons !== 'undefined' ? flatLessons.length : 21);
    }

    return completedLessons.has(lessonId);
  }

  function isLessonDone(lessonId) { return completedLessons.has(lessonId); }
  function getDoneLessons() { return completedLessons; }

  // ── UI ────────────────────────────────────────────────────────────────
  function updateXPDisplay() {
    const level = getLevel();
    const next = getNextLevel();
    const progress = getProgressToNextLevel();

    const levelEl = document.getElementById('xp-level-text');
    const amountEl = document.getElementById('xp-amount');
    const barEl = document.getElementById('xp-bar');
    const nextEl = document.getElementById('xp-next-level');
    const iconEl = document.getElementById('xp-level-icon');

    if (levelEl) levelEl.textContent = level.name;
    if (iconEl) iconEl.textContent = level.icon;
    if (amountEl) amountEl.textContent = `${xp} XP`;
    if (barEl) barEl.style.width = `${progress}%`;
    if (nextEl) {
      nextEl.textContent = next ? `${next.min - xp} XP para ${next.name}` : '¡Nivel máximo!';
    }

    // Streak display
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = streak.currentDays;

    // Lab stats
    const statEl = document.getElementById('lab-stat-xp');
    if (statEl) statEl.textContent = xp;
    const statLevelEl = document.getElementById('lab-stat-level');
    if (statLevelEl) statLevelEl.textContent = level.icon + ' ' + level.name;
  }

  function showXPPopup(amount) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = `+${amount} XP`;
    popup.style.top = '80px';
    popup.style.left = '140px';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
  }

  function showLevelUp(level) {
    const notif = document.createElement('div');
    notif.className = 'level-up-modal';
    notif.style.setProperty('--level-color', level.color);
    notif.innerHTML = `
      <div class="level-up-glow"></div>
      <div class="level-up-icon">${level.icon}</div>
      <div class="level-up-label">¡NIVEL ALCANZADO!</div>
      <div class="level-up-name" style="color:${level.color}">${level.name}</div>
      <div class="level-up-rank">Rango ${level.rank}/10</div>
      <div class="level-up-sub">Sigue resolviendo retos para subir de nivel</div>
    `;
    document.body.appendChild(notif);

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.value = 0.08;
        osc.start(ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
        osc.stop(ctx.currentTime + i * 0.15 + 0.4);
      });
    } catch(e) {}

    setTimeout(() => {
      notif.style.opacity = '0';
      setTimeout(() => notif.remove(), 600);
    }, 3000);
  }

  // ── RESET ─────────────────────────────────────────────────────────────
  function reset() {
    xp = 0;
    completedLessons.clear();
    streak = { currentDays: 0, lastLoginDate: null, longestStreak: 0, freezesUsed: 0, totalDays: 0 };
    localStorage.removeItem('linuxlab_xp');
    localStorage.removeItem('linuxlab_done');
    localStorage.removeItem('linuxlab_challenges');
    localStorage.removeItem('linuxlab_streak');
    localStorage.removeItem('linuxlab_achievements');
    localStorage.removeItem('linuxlab_achv_stats');
    save();
    updateXPDisplay();
  }

  return {
    init, addXP, getXP, getLevel, getNextLevel, getProgressToNextLevel,
    markLessonDone, isLessonDone, getDoneLessons, updateXPDisplay, reset,
    LEVELS,
    get streak() { return streak; },
  };
})();
