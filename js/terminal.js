// ═══════════════════════════════════════════════════════════════════════════
// TERMINAL.JS — Emulador de terminal Linux interactivo
// Soporta: ls, cd, pwd, cat, clear, whoami, echo, help, find, grep, id
// ═══════════════════════════════════════════════════════════════════════════

const Terminal = (() => {
  let cwd = '/home/user';
  let previousDir = '/home/user';
  let history = [];
  let historyIndex = -1;
  let outputEl = null;
  let inputEl = null;
  let promptEl = null;
  let onFlagFound = null; // Callback cuando se encuentra una flag

  // ── INICIALIZACIÓN ────────────────────────────────────────────────────
  function init(outputElement, inputElement, promptElement, flagCallback) {
    outputEl = outputElement;
    inputEl = inputElement;
    promptEl = promptElement;
    onFlagFound = flagCallback;

    inputEl.addEventListener('keydown', handleKeyDown);
    updatePrompt();
    showBanner();
  }

  function showBanner() {
    const banner = `
 ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗    ██╗      █████╗ ██████╗ 
 ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝    ██║     ██╔══██╗██╔══██╗
 ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝     ██║     ███████║██████╔╝
 ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗     ██║     ██╔══██║██╔══██╗
 ███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗    ███████╗██║  ██║██████╔╝
 ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚═════╝`;

    addOutput(banner, 'line-success');
    addOutput('', 'line-output');
    addOutput('  Plataforma Interactiva de Ciberseguridad v1.0', 'line-info');
    addOutput('  Escribe "help" para ver los comandos disponibles.', 'line-info');
    addOutput('  Escribe "challenges" para ver los retos activos.', 'line-info');
    addOutput('', 'line-output');
  }

  // ── PROMPT ────────────────────────────────────────────────────────────
  function updatePrompt() {
    const displayPath = cwd.replace('/home/user', '~') || '/';
    const prompt = `user@linux-lab:${displayPath}$ `;
    if (promptEl) promptEl.textContent = prompt;
  }

  function getPromptText() {
    const displayPath = cwd.replace('/home/user', '~') || '/';
    return `user@linux-lab:${displayPath}$ `;
  }

  // ── OUTPUT ────────────────────────────────────────────────────────────
  function addOutput(text, className = 'line-output', promptText = null) {
    const line = document.createElement('div');
    line.className = `line ${className}`;
    if (promptText) {
      line.setAttribute('data-prompt', promptText);
    }
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function addOutputHTML(html, className = 'line-output') {
    const line = document.createElement('div');
    line.className = `line ${className}`;
    line.innerHTML = html;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  // ── MANEJO DE INPUT ───────────────────────────────────────────────────
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      const cmd = inputEl.value.trim();
      inputEl.value = '';

      // Mostrar comando ingresado
      addOutput(cmd, 'line-cmd', getPromptText());

      if (cmd) {
        history.push(cmd);
        historyIndex = history.length;
        executeCommand(cmd);
      }
      updatePrompt();
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputEl.value = history[historyIndex];
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputEl.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        inputEl.value = '';
      }
    }
    else if (e.key === 'Tab') {
      e.preventDefault();
      autocomplete();
    }
    else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearScreen();
    }
  }

  // ── AUTOCOMPLETADO ────────────────────────────────────────────────────
  function autocomplete() {
    const input = inputEl.value;
    const parts = input.split(' ');
    const lastPart = parts[parts.length - 1];
    if (!lastPart) return;

    // Determinar ruta base y fragmento a completar
    let basePath, fragment;
    const lastSlash = lastPart.lastIndexOf('/');
    if (lastSlash !== -1) {
      basePath = VirtualFS.resolvePath(cwd, lastPart.substring(0, lastSlash + 1));
      fragment = lastPart.substring(lastSlash + 1);
    } else {
      basePath = cwd;
      fragment = lastPart;
    }

    const entries = VirtualFS.listDir(basePath, true);
    if (!entries) return;

    const matches = entries.filter(e => e.startsWith(fragment));
    if (matches.length === 1) {
      parts[parts.length - 1] = (lastSlash !== -1 ? lastPart.substring(0, lastSlash + 1) : '') + matches[0];
      const completedPath = VirtualFS.resolvePath(cwd, parts[parts.length - 1]);
      if (VirtualFS.isDirectory(completedPath)) {
        parts[parts.length - 1] += '/';
      }
      inputEl.value = parts.join(' ');
    } else if (matches.length > 1) {
      addOutput(matches.join('  '), 'line-output');
    }
  }

  // ── EJECUTOR DE COMANDOS ──────────────────────────────────────────────
  function executeCommand(input) {
    // Parsear pipes básicos (informativo)
    if (input.includes('|')) {
      addOutput(`bash: pipes no soportados en esta simulación`, 'line-warning');
      addOutput('Intenta usar los comandos individuales.', 'line-info');
      return;
    }

    // Parsear redirecciones (informativo)
    if (input.includes('>') || input.includes('>>')) {
      addOutput(`bash: redirección no soportada en esta simulación`, 'line-warning');
      return;
    }

    // Separar comando y argumentos
    const tokens = tokenize(input);
    const cmd = tokens[0];
    const args = tokens.slice(1);

    switch (cmd) {
      case 'ls':       cmdLs(args); break;
      case 'cd':       cmdCd(args); break;
      case 'pwd':      cmdPwd(); break;
      case 'cat':      cmdCat(args); break;
      case 'clear':    clearScreen(); break;
      case 'whoami':   addOutput('user', 'line-output'); break;
      case 'hostname': addOutput('linux-lab', 'line-output'); break;
      case 'echo':     cmdEcho(args); break;
      case 'help':     cmdHelp(); break;
      case 'id':       addOutput('uid=1000(user) gid=1000(user) groups=1000(user),4(adm),27(sudo)', 'line-output'); break;
      case 'uname':    cmdUname(args); break;
      case 'find':     cmdFind(args); break;
      case 'grep':     cmdGrep(args); break;
      case 'file':     cmdFile(args); break;
      case 'head':     cmdHead(args); break;
      case 'tail':     cmdTail(args); break;
      case 'wc':       cmdWc(args); break;
      case 'date':     addOutput(new Date().toString(), 'line-output'); break;
      case 'uptime':   addOutput(' 10:30:15 up 45 days, 3:22, 1 user, load average: 0.15, 0.10, 0.05', 'line-output'); break;
      case 'history':  cmdHistory(); break;
      case 'challenges': cmdChallenges(); break;
      case 'base64':   cmdBase64(args); break;

      // Comandos reconocidos pero no implementados completamente
      case 'sudo':
        addOutput(`[sudo] contraseña para user: `, 'line-output');
        addOutput(`Lo sentimos, esta simulación no soporta sudo.`, 'line-warning');
        break;
      case 'man':
        addOutput(`No hay manual disponible en esta simulación.`, 'line-warning');
        addOutput(`Usa "help" para ver los comandos disponibles.`, 'line-info');
        break;
      case 'ssh': case 'scp': case 'curl': case 'wget': case 'ping': case 'nmap':
        addOutput(`${cmd}: comando de red no disponible en esta simulación`, 'line-warning');
        break;
      case 'vim': case 'nano': case 'vi':
        addOutput(`${cmd}: editores no disponibles en esta simulación`, 'line-warning');
        break;
      case 'rm': case 'mkdir': case 'touch': case 'cp': case 'mv': case 'chmod': case 'chown':
        addOutput(`${cmd}: comandos de modificación deshabilitados (filesystem de solo lectura)`, 'line-warning');
        break;
      case 'exit': case 'logout':
        addOutput('logout', 'line-output');
        addOutput('No puedes cerrar esta terminal. ¡Sigue practicando! 😄', 'line-info');
        break;

      default:
        addOutput(`bash: ${cmd}: comando no encontrado`, 'line-error');
        addOutput(`Escribe "help" para ver los comandos disponibles.`, 'line-info');
    }

    // Detectar flags en la salida
    checkForFlags(input);

    // Track for achievements
    if (typeof Achievements !== 'undefined') {
      Achievements.trackCommand(input, cwd);
    }
  }

  // ── TOKENIZER ─────────────────────────────────────────────────────────
  function tokenize(input) {
    const tokens = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (const ch of input) {
      if (inQuote) {
        if (ch === quoteChar) { inQuote = false; }
        else { current += ch; }
      } else if (ch === '"' || ch === "'") {
        inQuote = true; quoteChar = ch;
      } else if (ch === ' ') {
        if (current) { tokens.push(current); current = ''; }
      } else {
        current += ch;
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }

  // ── COMANDOS ──────────────────────────────────────────────────────────

  function cmdLs(args) {
    let showAll = false;
    let longFormat = false;
    let targetPath = cwd;

    for (const arg of args) {
      if (arg.startsWith('-')) {
        if (arg.includes('a')) showAll = true;
        if (arg.includes('l')) longFormat = true;
      } else {
        targetPath = VirtualFS.resolvePath(cwd, arg);
      }
    }

    const entries = VirtualFS.listDir(targetPath, showAll);
    if (entries === null) {
      addOutput(`ls: no se puede acceder a '${args.find(a => !a.startsWith('-')) || targetPath}': No existe el archivo o directorio`, 'line-error');
      return;
    }

    if (entries.length === 0) {
      return; // Directorio vacío
    }

    if (longFormat) {
      addOutput(`total ${entries.length * 4}`, 'line-output');
      if (showAll) {
        // . y ..
        const info = VirtualFS.getNodeInfo(targetPath, '.');
        if (info) addOutput(formatLongEntry(info), 'line-output');
        const parentInfo = VirtualFS.getNodeInfo(VirtualFS.getParentPath(targetPath), '..');
        if (parentInfo) addOutput(formatLongEntry({...parentInfo, name: '..'}), 'line-output');
      }
      for (const name of entries) {
        const fullPath = targetPath === '/' ? '/' + name : targetPath + '/' + name;
        const info = VirtualFS.getNodeInfo(fullPath, name);
        if (info) {
          addOutputHTML(formatLongEntryColored(info), 'line-output');
        }
      }
    } else {
      // Formato corto: colorear directorios
      const colored = entries.map(name => {
        const fullPath = targetPath === '/' ? '/' + name : targetPath + '/' + name;
        const isDir = VirtualFS.isDirectory(fullPath);
        const isHidden = name.startsWith('.');
        if (isDir) return `<span style="color:var(--cyan);font-weight:600">${name}/</span>`;
        if (isHidden) return `<span style="color:var(--text3)">${name}</span>`;
        return `<span style="color:var(--text)">${name}</span>`;
      });
      addOutputHTML(colored.join('  '), 'line-output');
    }
  }

  function formatLongEntry(info) {
    const sizeStr = String(info.size).padStart(8);
    return `${info.permissions} ${String(info.links).padStart(2)} ${info.owner.padEnd(8)} ${info.group.padEnd(8)} ${sizeStr} ene 15 10:30 ${info.name}`;
  }

  function formatLongEntryColored(info) {
    const sizeStr = String(info.size).padStart(8);
    const isDir = info.type === VirtualFS.DIR;
    const nameColor = isDir ? 'var(--cyan)' : (info.name.startsWith('.') ? 'var(--text3)' : 'var(--text)');
    const permColor = info.permissions.includes('s') ? 'var(--red)' : 'var(--text2)';
    const nameDisplay = isDir ? info.name + '/' : info.name;
    return `<span style="color:${permColor}">${info.permissions}</span> ${String(info.links).padStart(2)} <span style="color:var(--yellow)">${info.owner.padEnd(8)}</span> <span style="color:var(--purple)">${info.group.padEnd(8)}</span> ${sizeStr} <span style="color:var(--text3)">ene 15 10:30</span> <span style="color:${nameColor};font-weight:${isDir?'600':'400'}">${nameDisplay}</span>`;
  }

  function cmdCd(args) {
    if (args.length === 0 || args[0] === '~') {
      previousDir = cwd;
      cwd = '/home/user';
      return;
    }

    const target = args[0];

    // cd - (volver al directorio anterior)
    if (target === '-') {
      const temp = cwd;
      cwd = previousDir;
      previousDir = temp;
      addOutput(cwd, 'line-output');
      return;
    }

    const resolved = VirtualFS.resolvePath(cwd, target);
    if (!VirtualFS.exists(resolved)) {
      addOutput(`bash: cd: ${target}: No existe el archivo o directorio`, 'line-error');
      return;
    }
    if (!VirtualFS.isDirectory(resolved)) {
      addOutput(`bash: cd: ${target}: No es un directorio`, 'line-error');
      return;
    }
    previousDir = cwd;
    cwd = resolved;
  }

  function cmdPwd() {
    addOutput(cwd, 'line-output');
  }

  function cmdCat(args) {
    if (args.length === 0) {
      addOutput('cat: falta operando', 'line-error');
      return;
    }
    for (const arg of args) {
      const path = VirtualFS.resolvePath(cwd, arg);
      const result = VirtualFS.readFile(path);
      if (result.error) {
        addOutput(result.error, 'line-error');
      } else {
        const lines = result.content.split('\n');
        lines.forEach(line => addOutput(line, 'line-output'));
      }
    }
  }

  function cmdEcho(args) {
    const text = args.join(' ');
    // Handle simple variable expansion
    const expanded = text
      .replace(/\$USER/g, 'user')
      .replace(/\$HOME/g, '/home/user')
      .replace(/\$PWD/g, cwd)
      .replace(/\$SHELL/g, '/bin/bash')
      .replace(/\$PATH/g, '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin')
      .replace(/\$HOSTNAME/g, 'linux-lab');
    addOutput(expanded, 'line-output');
  }

  function cmdUname(args) {
    if (args.includes('-a') || args.includes('--all')) {
      addOutput('Linux linux-lab 6.5.0-14-generic #14-Ubuntu SMP x86_64 GNU/Linux', 'line-output');
    } else if (args.includes('-r')) {
      addOutput('6.5.0-14-generic', 'line-output');
    } else {
      addOutput('Linux', 'line-output');
    }
  }

  function cmdFind(args) {
    let searchPath = cwd;
    let namePattern = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-name' && i + 1 < args.length) {
        namePattern = args[i + 1];
        i++;
      } else if (!args[i].startsWith('-')) {
        searchPath = VirtualFS.resolvePath(cwd, args[i]);
      }
    }

    if (!namePattern) {
      // Sin -name, listar todos los archivos
      namePattern = '*';
    }

    const results = VirtualFS.findFiles(searchPath, namePattern);
    if (results.length === 0) {
      return; // Sin resultados, silencioso como find real
    }
    results.forEach(r => addOutput(r, 'line-output'));
  }

  function cmdGrep(args) {
    if (args.length < 2) {
      addOutput('Uso: grep <patrón> <archivo>', 'line-error');
      return;
    }

    let pattern = args[0];
    let recursive = false;
    let filePaths = [];

    for (let i = 0; i < args.length; i++) {
      if (args[i] === '-r' || args[i] === '-R') {
        recursive = true;
      } else if (args[i] === '-i') {
        // case insensitive (ya lo es por defecto en nuestra implementación)
      } else if (i === 0 || args[i].startsWith('-')) {
        if (i === 0) pattern = args[0];
      } else {
        filePaths.push(args[i]);
      }
    }

    // Re-parse: grep pattern file
    pattern = args.find(a => !a.startsWith('-'));
    filePaths = args.filter(a => !a.startsWith('-')).slice(1);

    if (filePaths.length === 0) {
      addOutput('grep: falta el archivo a buscar', 'line-error');
      return;
    }

    for (const fp of filePaths) {
      const path = VirtualFS.resolvePath(cwd, fp);
      const result = VirtualFS.grepFile(path, pattern);
      if (result.error) {
        addOutput(result.error, 'line-error');
      } else if (result.matches.length > 0) {
        result.matches.forEach(m => {
          // Highlight the match
          const highlighted = m.replace(new RegExp(`(${pattern})`, 'gi'),
            `<span style="color:var(--red);font-weight:700">$1</span>`);
          addOutputHTML(highlighted, 'line-output');
        });
      }
    }
  }

  function cmdFile(args) {
    if (args.length === 0) {
      addOutput('file: falta operando', 'line-error');
      return;
    }
    const path = VirtualFS.resolvePath(cwd, args[0]);
    const node = VirtualFS.getNode(path);
    if (!node) {
      addOutput(`file: ${args[0]}: No existe el archivo o directorio`, 'line-error');
    } else if (node.type === VirtualFS.DIR) {
      addOutput(`${args[0]}: directory`, 'line-output');
    } else {
      addOutput(`${args[0]}: ASCII text`, 'line-output');
    }
  }

  function cmdHead(args) {
    let lines = 10;
    let filePath = null;
    for (const arg of args) {
      if (arg.startsWith('-') && !isNaN(arg.slice(1))) {
        lines = parseInt(arg.slice(1));
      } else if (!arg.startsWith('-')) {
        filePath = arg;
      }
    }
    if (!filePath) { addOutput('head: falta operando', 'line-error'); return; }
    const path = VirtualFS.resolvePath(cwd, filePath);
    const result = VirtualFS.readFile(path);
    if (result.error) { addOutput(result.error, 'line-error'); return; }
    result.content.split('\n').slice(0, lines).forEach(l => addOutput(l, 'line-output'));
  }

  function cmdTail(args) {
    let lines = 10;
    let filePath = null;
    for (const arg of args) {
      if (arg.startsWith('-') && !isNaN(arg.slice(1))) {
        lines = parseInt(arg.slice(1));
      } else if (!arg.startsWith('-')) {
        filePath = arg;
      }
    }
    if (!filePath) { addOutput('tail: falta operando', 'line-error'); return; }
    const path = VirtualFS.resolvePath(cwd, filePath);
    const result = VirtualFS.readFile(path);
    if (result.error) { addOutput(result.error, 'line-error'); return; }
    const allLines = result.content.split('\n');
    allLines.slice(-lines).forEach(l => addOutput(l, 'line-output'));
  }

  function cmdWc(args) {
    let filePath = null;
    for (const arg of args) {
      if (!arg.startsWith('-')) filePath = arg;
    }
    if (!filePath) { addOutput('wc: falta operando', 'line-error'); return; }
    const path = VirtualFS.resolvePath(cwd, filePath);
    const result = VirtualFS.readFile(path);
    if (result.error) { addOutput(result.error, 'line-error'); return; }
    const lines = result.content.split('\n').length;
    const words = result.content.split(/\s+/).filter(w => w).length;
    const chars = result.content.length;
    addOutput(`  ${lines}  ${words} ${chars} ${filePath}`, 'line-output');
  }

  function cmdHistory() {
    history.forEach((cmd, i) => {
      addOutput(`  ${String(i + 1).padStart(4)}  ${cmd}`, 'line-output');
    });
  }

  function cmdChallenges() {
    addOutput('', 'line-output');
    addOutput('╔══════════════════════════════════════════╗', 'line-info');
    addOutput('║        🎯 RETOS ACTIVOS (CTF)           ║', 'line-info');
    addOutput('╚══════════════════════════════════════════╝', 'line-info');
    addOutput('', 'line-output');
    addOutput('Consulta el panel de retos a la derecha →', 'line-info');
    addOutput('Usa la terminal para investigar el sistema.', 'line-output');
    addOutput('Cuando encuentres una flag, envíala en el panel.', 'line-output');
    addOutput('', 'line-output');
    addOutput('💡 Tips:', 'line-warning');
    addOutput('  • Usa "ls -la" para ver archivos ocultos', 'line-output');
    addOutput('  • Usa "cat" para leer archivos', 'line-output');
    addOutput('  • Usa "find" y "grep" para buscar', 'line-output');
    addOutput('  • Las flags tienen formato: flag{...}', 'line-output');
    addOutput('', 'line-output');
  }

  function cmdBase64(args) {
    if (args.includes('-d') || args.includes('--decode')) {
      const input = args.find(a => !a.startsWith('-'));
      if (!input) {
        addOutput('base64: falta texto para decodificar', 'line-error');
        return;
      }
      try {
        addOutput(atob(input), 'line-output');
      } catch(e) {
        addOutput('base64: entrada inválida', 'line-error');
      }
    } else {
      const input = args.join(' ');
      if (!input) {
        addOutput('base64: falta texto para codificar', 'line-error');
        return;
      }
      addOutput(btoa(input), 'line-output');
    }
  }

  function cmdHelp() {
    addOutput('', 'line-output');
    addOutput('╔══════════════════════════════════════════════════════╗', 'line-success');
    addOutput('║           COMANDOS DISPONIBLES                     ║', 'line-success');
    addOutput('╠══════════════════════════════════════════════════════╣', 'line-success');
    addOutput('║                                                    ║', 'line-success');
    const cmds = [
      ['ls [-la]',       'Listar archivos y directorios'],
      ['cd <ruta>',      'Cambiar de directorio'],
      ['pwd',            'Mostrar directorio actual'],
      ['cat <archivo>',  'Ver contenido de archivo'],
      ['clear',          'Limpiar la pantalla'],
      ['whoami',         'Mostrar usuario actual'],
      ['id',             'Mostrar UID/GID'],
      ['echo <texto>',   'Imprimir texto'],
      ['find <r> -name', 'Buscar archivos'],
      ['grep <pat> <f>', 'Buscar en archivos'],
      ['head/tail <f>',  'Ver inicio/final de archivo'],
      ['wc <archivo>',   'Contar líneas/palabras'],
      ['file <archivo>', 'Tipo de archivo'],
      ['uname [-a]',     'Info del sistema'],
      ['date',           'Fecha y hora actual'],
      ['history',        'Historial de comandos'],
      ['base64 [-d]',    'Codificar/decodificar base64'],
      ['challenges',     'Ver retos activos'],
      ['help',           'Mostrar esta ayuda'],
    ];
    cmds.forEach(([cmd, desc]) => {
      addOutputHTML(`║  <span style="color:var(--green);font-weight:600">${cmd.padEnd(18)}</span> <span style="color:var(--text2)">${desc}</span>`, 'line-output');
    });
    addOutput('║                                                    ║', 'line-success');
    addOutput('╚══════════════════════════════════════════════════════╝', 'line-success');
    addOutput('', 'line-output');
    addOutput('💡 Usa ↑↓ para navegar el historial, Tab para autocompletar', 'line-info');
    addOutput('', 'line-output');
  }

  function clearScreen() {
    outputEl.innerHTML = '';
  }

  // ── DETECCIÓN DE FLAGS ────────────────────────────────────────────────
  function checkForFlags(input) {
    // Verificar si el output más reciente contiene una flag
    const lastOutputs = outputEl.querySelectorAll('.line');
    const last5 = Array.from(lastOutputs).slice(-5);
    for (const el of last5) {
      const text = el.textContent;
      const flagMatch = text.match(/flag\{[^}]+\}/);
      if (flagMatch && onFlagFound) {
        onFlagFound(flagMatch[0]);
      }
    }
  }

  function focus() {
    if (inputEl) inputEl.focus();
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────
  return {
    init,
    focus,
    addOutput,
    clearScreen,
    get cwd() { return cwd; },
  };
})();
