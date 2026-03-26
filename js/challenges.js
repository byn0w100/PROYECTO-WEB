// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGES.JS — Motor de retos CTF con validación, categorías y pistas
// 8 retos · 3 categorías · Sistema de bloqueo · Temporizador
// ═══════════════════════════════════════════════════════════════════════════

const Challenges = (() => {
  // ── CATEGORÍAS ─────────────────────────────────────────────────────────
  const CATEGORIES = [
    { id: 'all',       label: 'Todos',           icon: '🎯' },
    { id: 'recon',     label: 'Reconocimiento',  icon: '🔍' },
    { id: 'exploit',   label: 'Explotación',     icon: '💥' },
    { id: 'forensic',  label: 'Forense',         icon: '🕵️' },
  ];

  // ── DATOS DE RETOS ────────────────────────────────────────────────────
  const challengeData = [
    // ─── RECONOCIMIENTO ───────────────────────
    {
      id: 'ch_hidden_file',
      icon: '🔍',
      title: 'Encuentra la flag oculta',
      description: 'Hay un archivo secreto escondido en el directorio home del usuario. Los archivos ocultos en Linux empiezan con un punto.',
      category: 'recon',
      difficulty: 'easy',
      diffLabel: 'Fácil',
      xpReward: 100,
      flag: 'flag{linux_master}',
      requires: null,
      hints: [
        { text: 'Los archivos ocultos empiezan con punto (.) — usa "ls -la"', cost: 10 },
        { text: 'Busca en /home/user', cost: 10 },
        { text: 'Ejecuta: cat ~/.secret', cost: 10 },
      ],
    },
    {
      id: 'ch_ssh_config',
      icon: '🔑',
      title: 'Configuración SSH expuesta',
      description: 'El administrador del sistema dejó una configuración SSH con información sensible. Analiza los archivos de configuración del servicio SSH.',
      category: 'recon',
      difficulty: 'easy',
      diffLabel: 'Fácil',
      xpReward: 100,
      flag: 'flag{ssh_config_found}',
      requires: null,
      hints: [
        { text: 'SSH se configura en el directorio /etc/ssh/', cost: 10 },
        { text: 'Usa "cat /etc/ssh/sshd_config" y busca usuarios permitidos', cost: 10 },
        { text: 'La flag está en el propio contenido: flag{ssh_config_found}', cost: 10 },
      ],
    },
    {
      id: 'ch_credentials',
      icon: '📋',
      title: 'Credenciales expuestas',
      description: 'Un backup de contraseñas fue dejado en texto plano en algún lugar del directorio del usuario. Nunca guardes passwords en archivos de texto.',
      category: 'recon',
      difficulty: 'medium',
      diffLabel: 'Medio',
      xpReward: 150,
      flag: 'flag{credentials_exposed}',
      requires: 'ch_hidden_file',
      hints: [
        { text: 'Busca archivos con "password" en el nombre: find ~ -name "*pass*"', cost: 15 },
        { text: 'Hay un archivo de backup en ~/documentos/', cost: 15 },
        { text: 'cat ~/documentos/passwords_backup.txt — la flag está al final', cost: 15 },
      ],
    },

    // ─── FORENSE ───────────────────────────────
    {
      id: 'ch_intruso',
      icon: '🕵️',
      title: 'Identifica al intruso',
      description: 'Los logs del sistema registraron actividad sospechosa. Un atacante intentó acceder por SSH. Analiza los registros de autenticación.',
      category: 'forensic',
      difficulty: 'medium',
      diffLabel: 'Medio',
      xpReward: 150,
      flag: 'flag{intruso_detectado}',
      requires: null,
      hints: [
        { text: 'Los logs de autenticación están en /var/log/', cost: 15 },
        { text: 'Usa "cat /var/log/auth.log" y busca líneas sospechosas', cost: 15 },
        { text: 'grep flag /var/log/auth.log', cost: 15 },
      ],
    },
    {
      id: 'ch_web_server',
      icon: '🌐',
      title: 'Servidor web comprometido',
      description: 'El servidor web tiene información sensible expuesta. Los desarrolladores a veces dejan comentarios HTML con datos que no deberían estar ahí.',
      category: 'forensic',
      difficulty: 'medium',
      diffLabel: 'Medio',
      xpReward: 150,
      flag: 'flag{html_comment_leak}',
      requires: 'ch_intruso',
      hints: [
        { text: 'Los archivos web están en /var/www/html/', cost: 15 },
        { text: 'Lee el código fuente HTML con cat', cost: 15 },
        { text: 'cat /var/www/html/index.html — busca el comentario HTML', cost: 15 },
      ],
    },
    {
      id: 'ch_cron_backdoor',
      icon: '⏰',
      title: 'Cron malicioso',
      description: 'Alguien programó una tarea cron sospechosa que se ejecuta cada 5 minutos. Investiga las tareas programadas del sistema.',
      category: 'forensic',
      difficulty: 'hard',
      diffLabel: 'Difícil',
      xpReward: 200,
      flag: 'flag{cron_backdoor}',
      requires: 'ch_web_server',
      hints: [
        { text: 'Las tareas cron del sistema están en /etc/crontab', cost: 20 },
        { text: 'Revisa qué scripts ejecuta el crontab', cost: 20 },
        { text: 'cat /opt/scripts/backup.sh — tiene un payload oculto con la flag', cost: 20 },
      ],
    },

    // ─── EXPLOTACIÓN ──────────────────────────
    {
      id: 'ch_base64',
      icon: '🔐',
      title: 'Descifra el mensaje',
      description: 'Se encontró una nota cifrada en Base64 en los documentos del usuario. Decodifica el mensaje para obtener la flag.',
      category: 'exploit',
      difficulty: 'hard',
      diffLabel: 'Difícil',
      xpReward: 200,
      flag: 'flag{base64_decoded}',
      requires: 'ch_credentials',
      hints: [
        { text: 'Busca en ~/documentos/ archivos con pistas', cost: 20 },
        { text: 'nota_cifrada.txt contiene texto en Base64', cost: 20 },
        { text: 'Usa: base64 -d ZmxhZ3tiYXNlNjRfZGVjb2RlZH0=', cost: 20 },
      ],
    },
    {
      id: 'ch_suid',
      icon: '⚔️',
      title: 'Escalada de privilegios SUID',
      description: 'Algunos binarios tienen el bit SUID activado, permitiendo ejecutarlos como root. Encuentra el binario con permisos especiales que podría usarse para escalada.',
      category: 'exploit',
      difficulty: 'hard',
      diffLabel: 'Difícil',
      xpReward: 250,
      flag: 'flag{suid_privilege_escalation}',
      requires: 'ch_base64',
      hints: [
        { text: 'Los archivos SUID tienen una "s" en los permisos', cost: 25 },
        { text: 'Busca en /usr/bin binarios con permisos inusuales: ls -la /usr/bin', cost: 25 },
        { text: 'cat /usr/bin/passwd muestra datos con la flag — ls -la /usr/bin/passwd para ver el bit SUID', cost: 25 },
      ],
    },
  ];

  let challenges = [];
  let activeCategory = 'all';
  let startTimes = {};     // When the user first viewed a challenge

  // ── INICIALIZACIÓN ────────────────────────────────────────────────────
  function init() {
    const saved = localStorage.getItem('linuxlab_challenges');
    if (saved) {
      const savedState = JSON.parse(saved);
      challenges = challengeData.map(ch => {
        const s = savedState.find(x => x.id === ch.id);
        return {
          ...ch,
          completed: s ? s.completed : false,
          hintsRevealed: s ? (s.hintsRevealed || 0) : 0,
          solvedAt: s ? s.solvedAt : null,
        };
      });
    } else {
      challenges = challengeData.map(ch => ({ ...ch, completed: false, hintsRevealed: 0, solvedAt: null }));
    }
  }

  function save() {
    const state = challenges.map(ch => ({
      id: ch.id, completed: ch.completed,
      hintsRevealed: ch.hintsRevealed, solvedAt: ch.solvedAt,
    }));
    localStorage.setItem('linuxlab_challenges', JSON.stringify(state));
  }

  // ── LOCKED/UNLOCKED ───────────────────────────────────────────────────
  function isUnlocked(ch) {
    if (!ch.requires) return true;
    const req = challenges.find(c => c.id === ch.requires);
    return req && req.completed;
  }

  // ── VALIDACIÓN ────────────────────────────────────────────────────────
  function validateFlag(challengeId, submittedFlag) {
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch) return { valid: false, message: 'Reto no encontrado' };
    if (ch.completed) return { valid: false, message: 'Ya completaste este reto' };
    if (!isUnlocked(ch)) return { valid: false, message: 'Este reto aún está bloqueado' };

    const trimmed = submittedFlag.trim().toLowerCase();
    const expected = ch.flag.toLowerCase();

    if (trimmed === expected) {
      ch.completed = true;
      ch.solvedAt = Date.now();
      save();

      // Time tracking for achievements
      const startTime = startTimes[challengeId] || Date.now();
      const solveTime = Math.round((Date.now() - startTime) / 1000);
      const usedHints = ch.hintsRevealed > 0;

      // Track for achievements
      if (typeof Achievements !== 'undefined') {
        Achievements.trackChallengeSolved(usedHints, solveTime);
      }

      return {
        valid: true,
        message: `¡Correcto! 🎉 Has ganado +${ch.xpReward} XP`,
        xpReward: ch.xpReward,
        challengeId: ch.id,
        solveTime,
      };
    }
    return { valid: false, message: 'Flag incorrecta. Sigue intentando. 🔍' };
  }

  // ── PISTAS ────────────────────────────────────────────────────────────
  function revealHint(challengeId) {
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch) return null;
    if (ch.hintsRevealed >= ch.hints.length) return null;
    const hint = ch.hints[ch.hintsRevealed];
    ch.hintsRevealed++;
    save();
    return { text: hint.text, cost: hint.cost, index: ch.hintsRevealed, total: ch.hints.length };
  }

  function getRevealedHints(challengeId) {
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch) return [];
    return ch.hints.slice(0, ch.hintsRevealed);
  }

  // ── RENDER ────────────────────────────────────────────────────────────
  function renderChallenges(container) {
    container.innerHTML = '';

    // Category tabs
    const tabs = document.createElement('div');
    tabs.className = 'challenge-tabs';
    CATEGORIES.forEach(cat => {
      const count = cat.id === 'all' ? challenges.length
        : challenges.filter(c => c.category === cat.id).length;
      const solved = cat.id === 'all'
        ? challenges.filter(c => c.completed).length
        : challenges.filter(c => c.category === cat.id && c.completed).length;
      const tab = document.createElement('button');
      tab.className = `challenge-tab ${activeCategory === cat.id ? 'active' : ''}`;
      tab.innerHTML = `${cat.icon} ${cat.label} <span class="tab-count">${solved}/${count}</span>`;
      tab.onclick = () => { activeCategory = cat.id; renderChallenges(container); };
      tabs.appendChild(tab);
    });
    container.appendChild(tabs);

    // Filtered challenges
    const filtered = activeCategory === 'all'
      ? challenges
      : challenges.filter(c => c.category === activeCategory);

    const list = document.createElement('div');
    list.className = 'challenge-list';

    filtered.forEach(ch => {
      const locked = !isUnlocked(ch);
      const card = document.createElement('div');
      card.className = `challenge-card ${ch.completed ? 'completed' : ''} ${locked ? 'locked' : ''}`;
      card.id = `challenge-${ch.id}`;

      // Start timer on first view
      if (!locked && !ch.completed && !startTimes[ch.id]) {
        startTimes[ch.id] = Date.now();
      }

      const diffClass = ch.difficulty === 'easy' ? 'diff-easy'
        : ch.difficulty === 'medium' ? 'diff-medium' : 'diff-hard';

      const catLabel = CATEGORIES.find(c => c.id === ch.category);
      const revealedHints = getRevealedHints(ch.id);
      const hintsHTML = revealedHints.map((h, i) =>
        `<div class="hint-content">💡 Pista ${i+1}: ${h.text}</div>`
      ).join('');

      const canRevealMore = ch.hintsRevealed < ch.hints.length && !ch.completed && !locked;
      const hintBtnHTML = canRevealMore
        ? `<button class="hint-btn" onclick="Challenges.onRevealHint('${ch.id}')">
             💡 Pista ${ch.hintsRevealed + 1}/${ch.hints.length}
             <span class="hint-cost">(-${ch.hints[ch.hintsRevealed].cost} XP)</span>
           </button>` : '';

      if (locked) {
        const req = challenges.find(c => c.id === ch.requires);
        card.innerHTML = `
          <div class="challenge-card-header">
            <span class="challenge-icon">🔒</span>
            <span class="challenge-title">${ch.title}</span>
            <span class="challenge-diff ${diffClass}">${ch.diffLabel}</span>
          </div>
          <div class="challenge-locked-msg">
            Completa "${req ? req.title : ''}" para desbloquear
          </div>`;
      } else if (ch.completed) {
        card.innerHTML = `
          <div class="challenge-card-header">
            <span class="challenge-icon">${ch.icon}</span>
            <span class="challenge-title">${ch.title}</span>
            <span class="challenge-diff ${diffClass}">${ch.diffLabel}</span>
          </div>
          <div class="challenge-category">${catLabel ? catLabel.icon + ' ' + catLabel.label : ''}</div>
          <div class="flag-result correct">✅ Reto completado — +${ch.xpReward} XP ganados</div>`;
      } else {
        card.innerHTML = `
          <div class="challenge-card-header">
            <span class="challenge-icon">${ch.icon}</span>
            <span class="challenge-title">${ch.title}</span>
            <span class="challenge-diff ${diffClass}">${ch.diffLabel}</span>
          </div>
          <div class="challenge-category">${catLabel ? catLabel.icon + ' ' + catLabel.label : ''}</div>
          <div class="challenge-desc">${ch.description}</div>
          <div class="challenge-xp">⭐ +${ch.xpReward} XP</div>
          ${hintsHTML}
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${hintBtnHTML}</div>
          <div class="flag-input-wrap">
            <input type="text" class="flag-input" id="flag-input-${ch.id}"
                   placeholder="flag{...}" autocomplete="off"
                   onkeydown="if(event.key==='Enter')Challenges.onSubmit('${ch.id}')">
            <button class="flag-submit" onclick="Challenges.onSubmit('${ch.id}')">Enviar</button>
          </div>
          <div class="flag-result" id="flag-result-${ch.id}"></div>`;
      }

      list.appendChild(card);
    });

    container.appendChild(list);
  }

  // ── EVENT HANDLERS ────────────────────────────────────────────────────
  function onSubmit(challengeId) {
    const input = document.getElementById(`flag-input-${challengeId}`);
    const resultEl = document.getElementById(`flag-result-${challengeId}`);
    if (!input || !resultEl) return;

    const result = validateFlag(challengeId, input.value);
    resultEl.textContent = (result.valid ? '✅ ' : '❌ ') + result.message;
    resultEl.className = `flag-result ${result.valid ? 'correct' : 'incorrect'}`;

    if (result.valid) {
      Gamification.addXP(result.xpReward, 'challenge');
      playSound(true);
      setTimeout(() => {
        const container = document.getElementById('lab-challenges');
        if (container) renderChallenges(container);
        if (typeof updateLabStats === 'function') updateLabStats();
      }, 1000);
    } else {
      playSound(false);
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      input.value = '';
      input.focus();
    }
  }

  function onRevealHint(challengeId) {
    const hint = revealHint(challengeId);
    if (!hint) return;
    Gamification.addXP(-hint.cost, 'hint');
    const container = document.getElementById('lab-challenges');
    if (container) renderChallenges(container);
  }

  // ── SONIDO ────────────────────────────────────────────────────────────
  function playSound(success) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.value = 0.1;
      if (success) {
        osc.frequency.value = 523.25;
        osc.start();
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.frequency.value = 200;
        osc.type = 'sawtooth';
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  }

  function getStats() {
    return {
      total: challenges.length,
      completed: challenges.filter(c => c.completed).length,
    };
  }

  return {
    init, validateFlag, revealHint, renderChallenges, getStats,
    onSubmit, onRevealHint, CATEGORIES,
    get challenges() { return challenges; },
  };
})();
