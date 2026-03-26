// ═══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS.JS — Sistema de logros/badges con detección automática
// 15+ logros desbloqueables con notificaciones y persistencia
// ═══════════════════════════════════════════════════════════════════════════

const Achievements = (() => {
  // ── DEFINICIÓN DE LOGROS ──────────────────────────────────────────────
  const BADGE_DATA = [
    // TERMINAL
    { id: 'first_command',  icon: '⌨️', title: 'Primera Línea',     desc: 'Ejecuta tu primer comando en la terminal', xp: 25,  category: 'Terminal' },
    { id: 'ten_commands',   icon: '🖥️', title: 'Operador',          desc: 'Ejecuta 10 comandos diferentes',           xp: 50,  category: 'Terminal' },
    { id: 'fifty_commands', icon: '⚡', title: 'Power User',        desc: 'Ejecuta 50 comandos en total',             xp: 100, category: 'Terminal' },
    { id: 'explorer',       icon: '🗂️', title: 'Explorador',        desc: 'Visita 5 directorios diferentes',          xp: 50,  category: 'Terminal' },
    { id: 'deep_diver',     icon: '🤿', title: 'Deep Diver',        desc: 'Navega hasta un directorio de 4+ niveles', xp: 75,  category: 'Terminal' },
    { id: 'grep_master',    icon: '🔎', title: 'Grep Master',       desc: 'Usa grep 5 veces',                         xp: 50,  category: 'Terminal' },

    // CTF
    { id: 'first_flag',     icon: '🚩', title: 'Primera Flag',      desc: 'Resuelve tu primer reto CTF',              xp: 50,  category: 'CTF' },
    { id: 'three_flags',    icon: '🏅', title: 'Cazador de Flags',  desc: 'Resuelve 3 retos CTF',                     xp: 100, category: 'CTF' },
    { id: 'ctf_master',     icon: '🏆', title: 'CTF Master',        desc: 'Completa todos los retos CTF',             xp: 200, category: 'CTF' },
    { id: 'no_hints',       icon: '🧠', title: 'Sin Ayuda',         desc: 'Resuelve un reto sin usar ninguna pista',  xp: 75,  category: 'CTF' },
    { id: 'speed_runner',   icon: '⏱️', title: 'Speed Runner',      desc: 'Resuelve un reto en menos de 60 segundos', xp: 100, category: 'CTF' },

    // STREAK
    { id: 'streak_3',       icon: '🔥', title: 'En Racha x3',       desc: 'Mantén una racha de 3 días',               xp: 75,  category: 'Streak' },
    { id: 'streak_7',       icon: '💥', title: 'Semana On Fire',    desc: 'Mantén una racha de 7 días',               xp: 150, category: 'Streak' },
    { id: 'streak_30',      icon: '🌟', title: 'Leyenda',           desc: 'Mantén una racha de 30 días',              xp: 500, category: 'Streak' },

    // LEARNING
    { id: 'first_lesson',   icon: '🐣', title: 'Primer Paso',       desc: 'Completa tu primera lección',              xp: 25,  category: 'Aprendizaje' },
    { id: 'five_lessons',   icon: '📚', title: 'Estudiante',        desc: 'Completa 5 lecciones',                     xp: 75,  category: 'Aprendizaje' },
    { id: 'all_lessons',    icon: '🎓', title: 'Graduado',          desc: 'Completa todas las lecciones',             xp: 300, category: 'Aprendizaje' },

    // SPECIAL
    { id: 'cat_secret',     icon: '🐱', title: 'Curioso',           desc: 'Lee un archivo oculto por primera vez',    xp: 30,  category: 'Especial' },
    { id: 'find_passwd',    icon: '🔑', title: 'Key Hunter',        desc: 'Lee /etc/passwd',                          xp: 30,  category: 'Especial' },
    { id: 'night_owl',      icon: '🦉', title: 'Night Owl',         desc: 'Practica entre 12AM y 5AM',                xp: 50,  category: 'Especial' },
  ];

  let unlocked = {};       // { badgeId: timestamp }
  let stats = {            // Tracking stats
    totalCommands: 0,
    uniqueCommands: new Set(),
    visitedDirs: new Set(),
    grepCount: 0,
    challengesSolved: 0,
    challengesSolvedNoHints: 0,
    fastestSolve: Infinity,
    hiddenFilesRead: 0,
    passwdRead: false,
  };

  // ── INIT ──────────────────────────────────────────────────────────────
  function init() {
    const saved = localStorage.getItem('linuxlab_achievements');
    if (saved) unlocked = JSON.parse(saved);
    const savedStats = localStorage.getItem('linuxlab_achv_stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      stats = {
        ...stats,
        ...parsed,
        uniqueCommands: new Set(parsed.uniqueCommands || []),
        visitedDirs: new Set(parsed.visitedDirs || []),
      };
    }
  }

  function save() {
    localStorage.setItem('linuxlab_achievements', JSON.stringify(unlocked));
    const toSave = {
      ...stats,
      uniqueCommands: [...stats.uniqueCommands],
      visitedDirs: [...stats.visitedDirs],
    };
    localStorage.setItem('linuxlab_achv_stats', JSON.stringify(toSave));
  }

  // ── TRACKING ──────────────────────────────────────────────────────────
  function trackCommand(cmd, cwd) {
    stats.totalCommands++;
    stats.uniqueCommands.add(cmd.split(' ')[0]);
    stats.visitedDirs.add(cwd);

    if (cmd.startsWith('grep')) stats.grepCount++;
    if (cmd.includes('.secret') || cmd.includes('.bash_history') || cmd.includes('.ssh'))
      stats.hiddenFilesRead++;
    if (cmd.includes('/etc/passwd')) stats.passwdRead = true;

    // Depth check
    const depth = cwd.split('/').filter(Boolean).length;

    save();
    checkAll(depth);
  }

  function trackChallengeSolved(usedHints, timeSeconds) {
    stats.challengesSolved++;
    if (!usedHints) stats.challengesSolvedNoHints++;
    if (timeSeconds < stats.fastestSolve) stats.fastestSolve = timeSeconds;
    save();
    checkAll();
  }

  function trackLessonComplete(totalDone, totalLessons) {
    save();
    checkAll(0, totalDone, totalLessons);
  }

  function trackStreak(days) {
    checkAll(0, 0, 0, days);
  }

  // ── CHECK CONDITIONS ──────────────────────────────────────────────────
  function checkAll(depth = 0, lessonsDone = 0, totalLessons = 0, streakDays = 0) {
    // Terminal
    check('first_command',  () => stats.totalCommands >= 1);
    check('ten_commands',   () => stats.uniqueCommands.size >= 10);
    check('fifty_commands', () => stats.totalCommands >= 50);
    check('explorer',       () => stats.visitedDirs.size >= 5);
    check('deep_diver',     () => depth >= 4);
    check('grep_master',    () => stats.grepCount >= 5);

    // CTF
    check('first_flag',     () => stats.challengesSolved >= 1);
    check('three_flags',    () => stats.challengesSolved >= 3);
    check('ctf_master',     () => {
      const s = Challenges.getStats();
      return s.completed >= s.total;
    });
    check('no_hints',       () => stats.challengesSolvedNoHints >= 1);
    check('speed_runner',   () => stats.fastestSolve <= 60);

    // Streak
    check('streak_3',  () => streakDays >= 3);
    check('streak_7',  () => streakDays >= 7);
    check('streak_30', () => streakDays >= 30);

    // Learning
    check('first_lesson', () => lessonsDone >= 1);
    check('five_lessons', () => lessonsDone >= 5);
    check('all_lessons',  () => totalLessons > 0 && lessonsDone >= totalLessons);

    // Special
    check('cat_secret',  () => stats.hiddenFilesRead >= 1);
    check('find_passwd', () => stats.passwdRead);
    check('night_owl',   () => {
      const h = new Date().getHours();
      return h >= 0 && h < 5;
    });
  }

  function check(id, condFn) {
    if (unlocked[id]) return;
    try {
      if (condFn()) unlock(id);
    } catch(e) {}
  }

  // ── UNLOCK ────────────────────────────────────────────────────────────
  function unlock(id) {
    if (unlocked[id]) return;
    const badge = BADGE_DATA.find(b => b.id === id);
    if (!badge) return;

    unlocked[id] = Date.now();
    save();

    // Award XP
    Gamification.addXP(badge.xp, 'achievement');

    // Show notification
    showUnlockNotification(badge);

    // Confetti!
    spawnConfetti();
  }

  // ── UI ────────────────────────────────────────────────────────────────
  function showUnlockNotification(badge) {
    const notif = document.createElement('div');
    notif.className = 'achievement-notif';
    notif.innerHTML = `
      <div class="achv-notif-icon">${badge.icon}</div>
      <div class="achv-notif-body">
        <div class="achv-notif-label">LOGRO DESBLOQUEADO</div>
        <div class="achv-notif-title">${badge.title}</div>
        <div class="achv-notif-desc">${badge.desc}</div>
        <div class="achv-notif-xp">+${badge.xp} XP</div>
      </div>
    `;
    document.body.appendChild(notif);

    // Sound
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [880, 1108.73, 1318.51, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.value = 0.06;
        osc.start(ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } catch(e) {}

    requestAnimationFrame(() => notif.classList.add('show'));
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 500);
    }, 4000);
  }

  function spawnConfetti() {
    const colors = ['#3fb950', '#58a6ff', '#e3b341', '#f0883e', '#d2a8ff', '#ff7b72'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      p.style.cssText = `
        left: ${50 + (Math.random() - 0.5) * 40}%;
        top: ${50 + (Math.random() - 0.5) * 30}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        --dx: ${(Math.random() - 0.5) * 200}px;
        --dy: ${-150 - Math.random() * 150}px;
        --rot: ${Math.random() * 720}deg;
        animation-delay: ${Math.random() * 0.3}s;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  }

  // ── RENDER BADGE GRID ─────────────────────────────────────────────────
  function renderBadges(container, filterCategory = null) {
    container.innerHTML = '';
    const badges = filterCategory
      ? BADGE_DATA.filter(b => b.category === filterCategory)
      : BADGE_DATA;

    badges.forEach(b => {
      const isUnlocked = !!unlocked[b.id];
      const el = document.createElement('div');
      el.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      el.innerHTML = `
        <div class="badge-icon">${isUnlocked ? b.icon : '🔒'}</div>
        <div class="badge-title">${b.title}</div>
        <div class="badge-desc">${isUnlocked ? b.desc : '???'}</div>
        ${isUnlocked ? `<div class="badge-xp">+${b.xp} XP</div>` : ''}
      `;
      container.appendChild(el);
    });
  }

  function getUnlockedCount() {
    return Object.keys(unlocked).length;
  }

  function getTotalCount() {
    return BADGE_DATA.length;
  }

  function getStats() {
    return { ...stats, uniqueCommands: stats.uniqueCommands.size, visitedDirs: stats.visitedDirs.size };
  }

  return {
    init, trackCommand, trackChallengeSolved, trackLessonComplete, trackStreak,
    renderBadges, getUnlockedCount, getTotalCount, getStats, BADGE_DATA,
    get unlocked() { return unlocked; },
  };
})();
