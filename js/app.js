// ═══════════════════════════════════════════════════════════════════════════
// APP.JS — Controlador principal de la aplicación
// Contiene: datos del curso (MODULES), renderizado, navegación, init
// ═══════════════════════════════════════════════════════════════════════════

// ─── COURSE DATA ───────────────────────────────────────────────────────────────
const MODULES = [
{
  id:1, icon:"🐧", title:"Fundamentos de Linux",
  lessons:[
    {
      id:"1.1", title:"¿Qué es Linux y por qué usarlo?", time:"10 min", level:"Básico",
      tag:"tag-green",
      content:`
<div class="section">
<div class="section-title">Introducción</div>
<div class="prose">
<p><strong>Linux</strong> es un sistema operativo de código abierto basado en el núcleo (<em>kernel</em>) creado por <strong>Linus Torvalds</strong> en 1991. No es solo un sistema operativo: es la base de la internet, los servidores, los dispositivos Android, los supercomputadores y el mundo del hacking ético.</p>
<p>A diferencia de Windows o macOS, Linux te da <strong>control total</strong> sobre tu sistema. Puedes ver y modificar cada archivo, proceso y configuración.</p>
</div>
</div>
<div class="section">
<div class="section-title">¿Por qué Linux para programación y ciberseguridad?</div>
<div class="prose">
<ul>
<li><strong>Programación:</strong> La mayoría de servidores web corren Linux. Docker, Kubernetes, Node.js, Python — todo funciona mejor en Linux. Los mejores IDEs y herramientas son nativos de Linux.</li>
<li><strong>Ciberseguridad:</strong> Kali Linux, Parrot OS, y las principales herramientas de pentesting (Nmap, Metasploit, Wireshark, Burp Suite) son nativas de Linux.</li>
<li><strong>Gratuito:</strong> Sin licencias. Cualquier distribución es libre.</li>
<li><strong>Estable y seguro:</strong> Los servidores más críticos del mundo corren Linux por años sin reiniciarse.</li>
</ul>
</div>
</div>
<div class="section">
<div class="section-title">El kernel y la arquitectura</div>
<div class="prose">
<p>Linux tiene una arquitectura en capas:</p>
<ul>
<li><strong>Hardware:</strong> CPU, RAM, disco, red</li>
<li><strong>Kernel:</strong> Gestiona el hardware, memoria, procesos y sistema de archivos</li>
<li><strong>Shell:</strong> Intérprete de comandos (Bash, Zsh, Fish)</li>
<li><strong>Aplicaciones:</strong> Todo lo que usas: navegador, editor, terminal</li>
</ul>
</div>
</div>
<div class="callout info">
<div class="callout-title">💡 Dato clave</div>
<div class="prose">El 96.3% de los servidores web del mundo corren Linux. Si quieres trabajar en tecnología, Linux es esencial.</div>
</div>
<div class="exercise">
<div class="ex-title">🎯 Ejercicio de reflexión</div>
<ul class="ex-list">
<li>Investiga qué sistema operativo usa Google, Amazon y Netflix en sus servidores</li>
<li>Busca 3 diferencias entre el kernel y el sistema operativo</li>
<li>Anota qué te motiva aprender Linux: ¿programación, ciberseguridad, servidores?</li>
</ul>
</div>`
    },
    {
      id:"1.2", title:"Distribuciones Linux: ¿Cuál elegir?", time:"8 min", level:"Básico", tag:"tag-green",
      content:`
<div class="section"><div class="section-title">¿Qué es una distribución?</div>
<div class="prose"><p>Una <strong>distribución</strong> (o "distro") es Linux + herramientas + gestores de paquetes + entorno gráfico empaquetados juntos. El kernel es el mismo; lo que cambia es todo lo demás.</p></div>
</div>
<div class="section"><div class="section-title">Distros recomendadas según tu objetivo</div>
<table class="cmd-table">
<tr><th>Distro</th><th>Ideal para</th><th>Dificultad</th></tr>
<tr><td>Ubuntu 24.04 LTS</td><td>Principiantes, programación general</td><td style="color:var(--green)">● Fácil</td></tr>
<tr><td>Debian 12</td><td>Servidores, estabilidad extrema</td><td style="color:var(--yellow)">●● Medio</td></tr>
<tr><td>Fedora 40</td><td>Desarrolladores, tecnología punta</td><td style="color:var(--yellow)">●● Medio</td></tr>
<tr><td>Kali Linux 2024</td><td>Ciberseguridad, pentesting</td><td style="color:var(--orange)">●●● Avanzado</td></tr>
<tr><td>Parrot OS</td><td>Ciberseguridad, privacidad</td><td style="color:var(--orange)">●●● Avanzado</td></tr>
<tr><td>Arch Linux</td><td>Aprender en profundidad, personalización</td><td style="color:var(--red)">●●●● Experto</td></tr>
</table>
<div class="callout tip"><div class="callout-title">✅ Recomendación para este curso</div>
<div class="prose">Empieza con <strong>Ubuntu 24.04 LTS</strong>. Es la más documentada, tiene la comunidad más grande y funciona perfectamente para programación y ciberseguridad. Luego migra a Kali cuando llegues al módulo de seguridad.</div>
</div>
</div>
<div class="section"><div class="section-title">Gestores de paquetes</div>
<div class="prose"><p>Cada familia de distros usa un gestor de paquetes diferente:</p></div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="comment">Debian/Ubuntu — apt</div>
<div class="cmd">sudo apt install firefox</div>
<span class="t-gap"></span>
<div class="comment">Fedora/RHEL — dnf</div>
<div class="cmd">sudo dnf install firefox</div>
<span class="t-gap"></span>
<div class="comment">Arch Linux — pacman</div>
<div class="cmd">sudo pacman -S firefox</div>
</div></div>
</div>`
    },
    {
      id:"1.3", title:"Instalación: VirtualBox, WSL y dual boot", time:"15 min", level:"Básico", tag:"tag-green",
      content:`
<div class="section"><div class="section-title">3 formas de usar Linux</div>
<div class="prose"><p>Tienes tres opciones principales para empezar con Linux sin perder tu sistema actual:</p></div></div>
<div class="section"><div class="section-title">Opción 1: WSL2 (Windows Subsystem for Linux)</div>
<div class="prose"><p>La forma más rápida si usas Windows. Instala un terminal Linux dentro de Windows sin máquina virtual.</p></div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">PowerShell (como Administrador)</div></div>
<div class="terminal-body">
<div class="comment">Activar WSL2 y instalar Ubuntu</div>
<div class="cmd">wsl --install</div>
<span class="t-gap"></span>
<div class="comment">Ver distros disponibles</div>
<div class="cmd">wsl --list --online</div>
<span class="t-gap"></span>
<div class="comment">Instalar una distro específica</div>
<div class="cmd">wsl --install -d Ubuntu-24.04</div>
</div></div>
<div class="callout tip"><div class="callout-title">✅ WSL2 es perfecto para</div>
<div class="prose">Programación, scripting y aprendizaje. <strong>Limitación:</strong> algunas herramientas de red de ciberseguridad no funcionan bien en WSL2.</div></div>
</div>
<div class="section"><div class="section-title">Opción 2: VirtualBox (Máquina Virtual)</div>
<div class="prose"><ol><li>Descarga VirtualBox desde <code>virtualbox.org</code></li><li>Descarga la ISO de Ubuntu desde <code>ubuntu.com</code></li><li>Crea una nueva VM: <strong>4GB RAM mínimo, 25GB disco, 2 CPUs</strong></li><li>Instala Ubuntu desde la ISO</li></ol>
<p><strong>Ventaja:</strong> Aislamiento total. Puedes romperla y restaurarla con snapshots.</p></div></div>
<div class="section"><div class="section-title">Opción 3: Dual Boot</div>
<div class="callout warn"><div class="callout-title">⚠️ Precaución</div>
<div class="prose">El dual boot modifica particiones de disco. Haz backup antes.</div></div>
<div class="prose"><p>Instala Linux junto a Windows en particiones separadas. Ofrece <strong>rendimiento nativo</strong>.</p></div>
</div>`
    }
  ]
},
{
  id:2, icon:"💻", title:"La Terminal – Tu Arma Principal",
  lessons:[
    { id:"2.1", title:"Anatomía del prompt y primeros comandos", time:"15 min", level:"Básico", tag:"tag-green",
      content:`<div class="section"><div class="section-title">El prompt de la terminal</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Bash</div></div>
<div class="terminal-body">
<div class="comment">Anatomía del prompt</div>
<span style="color:var(--green)">usuario</span><span style="color:var(--text2)">@</span><span style="color:var(--cyan)">hostname</span><span style="color:var(--text2)">:</span><span style="color:var(--purple)">~/directorio</span><span style="color:var(--yellow)">$</span><span style="color:var(--text)"> comando</span>
<span class="t-gap"></span>
<div class="comment">$ = usuario normal   # = usuario root (¡cuidado!)</div>
</div></div></div>
<div class="section"><div class="section-title">Comandos esenciales</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">pwd</div><div class="output">/home/usuario</div>
<span class="t-gap"></span>
<div class="cmd">ls</div><div class="output">Descargas  Documentos  Escritorio</div>
<span class="t-gap"></span>
<div class="cmd">ls -la</div><div class="output">total 48<br>drwxr-xr-x  8 user user 4096 ene 15 10:30 .</div>
<span class="t-gap"></span>
<div class="cmd">cd Documentos</div>
<div class="cmd">cd ~</div><div class="output">  # Ir al home</div>
<div class="cmd">cd ..</div><div class="output">  # Subir un nivel</div>
</div></div></div>
<div class="section"><div class="section-title">Atajos de teclado esenciales</div>
<table class="cmd-table">
<tr><th>Atajo</th><th>Función</th></tr>
<tr><td>Ctrl + C</td><td>Interrumpir proceso</td></tr>
<tr><td>Ctrl + L</td><td>Limpiar pantalla</td></tr>
<tr><td>Tab</td><td>Autocompletar</td></tr>
<tr><td>↑ / ↓</td><td>Navegar historial</td></tr>
</table></div>
<div class="exercise"><div class="ex-title">🎯 Práctica</div>
<ul class="ex-list">
<li>Abre el <strong>Laboratorio</strong> y ejecuta <code>pwd</code>, luego <code>ls -la</code></li>
<li>Navega a <code>/etc</code> con <code>cd /etc</code> y lista los archivos</li>
</ul></div>` },
    { id:"2.2", title:"Gestión de archivos y directorios", time:"20 min", level:"Básico", tag:"tag-green",
      content:`<div class="section"><div class="section-title">Crear, copiar, mover y eliminar</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">mkdir proyecto</div>
<div class="cmd">touch archivo.txt</div>
<span class="t-gap"></span>
<div class="cmd">cp archivo.txt copia.txt</div>
<div class="cmd">mv nombre_viejo.txt nombre_nuevo.txt</div>
<span class="t-gap"></span>
<div class="comment">Eliminar (¡SIN papelera!)</div>
<div class="cmd">rm archivo.txt</div>
<div class="cmd">rm -r directorio/</div>
</div></div>
<div class="callout danger"><div class="callout-title">☠️ Peligro — rm -rf</div>
<div class="prose"><code>rm -rf /</code> elimina TODO sin recuperación. <strong>Nunca ejecutes rm sin entenderlo.</strong></div></div>
</div>
<div class="section"><div class="section-title">Redirección y pipes</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">ls -la | grep ".txt"</div>
<div class="cmd">cat /etc/passwd | wc -l</div>
<span class="t-gap"></span>
<div class="cmd">ls > lista.txt</div>
<div class="cmd">echo "Hola" >> notas.txt</div>
</div></div></div>` },
    { id:"2.3", title:"Búsqueda avanzada: find y grep", time:"15 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">find — buscar archivos</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">find /home -name "*.txt"</div>
<div class="cmd">find / -perm -4000 2>/dev/null</div><div class="output">  # SUID</div>
</div></div></div>
<div class="section"><div class="section-title">grep — buscar dentro de archivos</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">grep "root" /etc/passwd</div>
<div class="output">root:x:0:0:root:/root:/bin/bash</div>
<span class="t-gap"></span>
<div class="cmd">grep -r "password" /etc/</div>
</div></div></div>
<div class="callout tip"><div class="callout-title">🔍 Ciberseguridad — grep para recon</div>
<div class="prose"><code>grep -r "password\\|secret\\|token" /var/www/</code><br>Busca credenciales hardcodeadas en código fuente.</div></div>` }
  ]
},
{
  id:3, icon:"📁", title:"Sistema de Archivos Linux",
  lessons:[
    { id:"3.1", title:"Jerarquía FHS: La estructura de Linux", time:"12 min", level:"Básico", tag:"tag-green",
      content:`<div class="section"><div class="section-title">Filesystem Hierarchy Standard (FHS)</div>
<div class="prose"><p>En Linux, <strong>todo es un archivo</strong> — dispositivos, procesos, red.</p></div>
<table class="cmd-table">
<tr><th>Directorio</th><th>Contenido</th></tr>
<tr><td>/</td><td>Raíz del sistema</td></tr>
<tr><td>/home</td><td>Directorio de usuarios</td></tr>
<tr><td>/etc</td><td>Configuración del sistema</td></tr>
<tr><td>/var</td><td>Datos variables (logs)</td></tr>
<tr><td>/tmp</td><td>Archivos temporales</td></tr>
<tr><td>/bin</td><td>Ejecutables del sistema</td></tr>
<tr><td>/proc</td><td>Info de procesos virtual</td></tr>
<tr><td>/dev</td><td>Dispositivos</td></tr>
</table></div>
<div class="callout info"><div class="callout-title">🔐 Pentesting — archivos clave</div>
<div class="prose">Primeros archivos a revisar: <code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/etc/crontab</code>, <code>/etc/sudoers</code>.</div></div>` },
    { id:"3.2", title:"Editores de texto: nano y vim", time:"20 min", level:"Básico", tag:"tag-green",
      content:`<div class="section"><div class="section-title">nano — editor para principiantes</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">nano mi_script.sh</div>
<span class="t-gap"></span>
<div class="output">^O = Guardar   ^X = Salir   ^K = Cortar línea</div>
</div></div></div>
<div class="section"><div class="section-title">vim — el editor del hacker</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">vim</div></div>
<div class="terminal-body">
<div class="output">i = insertar   ESC = modo normal</div>
<div class="output">:wq = guardar y salir  :q! = salir sin guardar</div>
</div></div></div>
<div class="callout tip"><div class="callout-title">💡 Cómo salir de vim</div>
<div class="prose">Presiona <code>ESC</code>, luego <code>:wq</code> Enter para guardar y salir.</div></div>` }
  ]
},
{
  id:4, icon:"🔐", title:"Usuarios, Grupos y Permisos",
  lessons:[
    { id:"4.1", title:"Gestión de usuarios y grupos", time:"18 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">El sistema de usuarios de Linux</div>
<div class="prose"><p>Cada usuario tiene un <strong>UID</strong>. Root = UID 0. Usuarios normales desde 1000.</p></div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Gestión de Usuarios</div></div>
<div class="terminal-body">
<div class="cmd">whoami</div><div class="output">usuario</div>
<div class="cmd">id</div><div class="output">uid=1000(usuario) gid=1000(usuario) groups=1000(usuario),27(sudo)</div>
<span class="t-gap"></span>
<div class="root-cmd">useradd -m -s /bin/bash juan</div>
<div class="root-cmd">passwd juan</div>
<div class="root-cmd">usermod -aG sudo juan</div>
</div></div></div>
<div class="section"><div class="section-title">sudo — ejecutar como root</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Terminal</div></div>
<div class="terminal-body">
<div class="cmd">sudo apt update</div>
<div class="cmd">sudo -l</div><div class="output">  # Ver permisos sudo</div>
<div class="cmd">sudo -i</div><div class="output">  # Shell como root</div>
</div></div></div>` },
    { id:"4.2", title:"Permisos: chmod, chown y el sistema rwx", time:"20 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">El sistema de permisos rwx</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Permisos</div></div>
<div class="terminal-body">
<div class="cmd">ls -la archivo.sh</div>
<div class="output"><span style="color:var(--green)">-rwxr-xr--</span> 1 juan developers 1024 ene 15 archivo.sh</div>
<span class="t-gap"></span>
<div class="comment">r=4, w=2, x=1  →  rwx=7, rw-=6, r-x=5, r--=4</div>
</div></div></div>
<div class="section"><div class="section-title">chmod y chown</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">chmod</div></div>
<div class="terminal-body">
<div class="cmd">chmod 755 script.sh</div><div class="output">   # rwxr-xr-x</div>
<div class="cmd">chmod 600 clave.pem</div><div class="output">   # rw-------</div>
<span class="t-gap"></span>
<div class="root-cmd">chown juan:developers proyecto/</div>
</div></div></div>
<div class="callout warn"><div class="callout-title">⚠️ Escalada de privilegios</div>
<div class="prose">Los binarios con SUID incorrecto son una de las formas más comunes de escalada de privilegios. Siempre busca SUIDs: <code>find / -perm -4000</code></div></div>` }
  ]
},
{
  id:5, icon:"⚙️", title:"Procesos y Servicios",
  lessons:[
    { id:"5.1", title:"Gestión de procesos", time:"18 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">Ver y gestionar procesos</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Procesos</div></div>
<div class="terminal-body">
<div class="cmd">ps aux</div>
<div class="cmd">top</div><div class="output">  # Monitor en tiempo real</div>
<div class="cmd">htop</div><div class="output">  # Versión mejorada</div>
<span class="t-gap"></span>
<div class="cmd">kill 1234</div><div class="output">  # SIGTERM</div>
<div class="cmd">kill -9 1234</div><div class="output">  # SIGKILL</div>
</div></div></div>
<div class="section"><div class="section-title">systemd — gestión de servicios</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">systemctl</div></div>
<div class="terminal-body">
<div class="cmd">systemctl status ssh</div>
<div class="root-cmd">systemctl start apache2</div>
<div class="root-cmd">systemctl enable ssh</div>
</div></div></div>
<div class="section"><div class="section-title">cron — programar tareas</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">crontab</div></div>
<div class="terminal-body">
<div class="cmd">crontab -e</div>
<div class="output"># minuto hora día mes día_semana comando</div>
<div class="output">30 2 * * * /home/juan/backup.sh</div>
<div class="output">*/5 * * * * curl -s https://api.ejemplo.com/ping</div>
</div></div></div>` }
  ]
},
{
  id:6, icon:"🌐", title:"Redes en Linux",
  lessons:[
    { id:"6.1", title:"Comandos de red esenciales", time:"20 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">Comandos de red</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Comandos de Red</div></div>
<div class="terminal-body">
<div class="cmd">ip addr show</div>
<div class="cmd">ss -tuln</div><div class="output">  # Puertos escuchando</div>
<div class="cmd">ping -c 4 8.8.8.8</div>
<span class="t-gap"></span>
<div class="cmd">dig google.com</div>
<div class="cmd">nslookup google.com</div>
</div></div></div>
<div class="section"><div class="section-title">curl y wget</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">curl & wget</div></div>
<div class="terminal-body">
<div class="cmd">curl https://httpbin.org/get</div>
<div class="cmd">curl -I https://google.com</div>
<div class="cmd">wget https://ejemplo.com/archivo.zip</div>
</div></div></div>
<div class="section"><div class="section-title">UFW — Firewall</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">UFW</div></div>
<div class="terminal-body">
<div class="root-cmd">ufw enable</div>
<div class="root-cmd">ufw allow ssh</div>
<div class="root-cmd">ufw allow 80/tcp</div>
</div></div></div>` },
    { id:"6.2", title:"SSH — Conexiones seguras remotas", time:"20 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">SSH básico</div>
<div class="prose"><p><strong>SSH</strong> es el protocolo estándar para administrar servidores remotos de forma segura.</p></div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">SSH</div></div>
<div class="terminal-body">
<div class="cmd">ssh usuario@192.168.1.10</div>
<div class="cmd">scp archivo.txt usuario@servidor:/home/</div>
<span class="t-gap"></span>
<div class="cmd">ssh-keygen -t ed25519</div>
<div class="cmd">ssh-copy-id usuario@servidor</div>
</div></div></div>
<div class="callout tip"><div class="callout-title">🔒 SSH Tunneling</div>
<div class="prose"><code>ssh -L 8080:192.168.1.10:80 usuario@servidor</code><br>Crea un túnel para acceder a servicios internos.</div></div>` }
  ]
},
{
  id:7, icon:"📜", title:"Bash Scripting",
  lessons:[
    { id:"7.1", title:"Fundamentos de Bash Scripting", time:"25 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">Tu primer script</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">mi_script.sh</div></div>
<div class="terminal-body">
<div class="output">#!/bin/bash</div>
<div class="output">echo "¡Hola, Linux!"</div>
<div class="output">echo "Usuario: $USER"</div>
<span class="t-gap"></span>
<div class="cmd">chmod +x mi_script.sh</div>
<div class="cmd">./mi_script.sh</div>
</div></div></div>
<div class="section"><div class="section-title">Variables y condicionales</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">variables.sh</div></div>
<div class="terminal-body">
<div class="output">nombre="Juan"</div>
<div class="output">edad=25</div>
<div class="output">echo "Hola $nombre, tienes $edad años"</div>
<span class="t-gap"></span>
<div class="output">if [ $edad -ge 18 ]; then</div>
<div class="output">    echo "Mayor de edad"</div>
<div class="output">fi</div>
</div></div></div>
<div class="section"><div class="section-title">Bucles</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">bucles.sh</div></div>
<div class="terminal-body">
<div class="output">for i in {1..10}; do</div>
<div class="output">    echo "Puerto $i"</div>
<div class="output">done</div>
</div></div></div>` },
    { id:"7.2", title:"Script práctico: herramienta de recon", time:"30 min", level:"Avanzado", tag:"tag-orange",
      content:`<div class="section"><div class="section-title">Script de reconocimiento</div>
<div class="prose"><p>Un <strong>escáner de información básico</strong> para un dominio.</p></div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">recon.sh</div></div>
<div class="terminal-body">
<div class="output">#!/bin/bash</div>
<div class="output">DOMINIO=$1</div>
<div class="output">echo "[*] Reconocimiento de: $DOMINIO"</div>
<div class="output">dig $DOMINIO ANY +short</div>
<div class="output">whois $DOMINIO | grep "Registrar:"</div>
<div class="output">curl -sI "https://$DOMINIO" | head -10</div>
</div></div></div>
<div class="exercise"><div class="ex-title">🎯 Ejercicio</div>
<ul class="ex-list">
<li>Copia el script, dale permisos con <code>chmod +x recon.sh</code></li>
<li>Ejecútalo: <code>./recon.sh google.com</code></li>
</ul></div>` }
  ]
},
{
  id:8, icon:"🐍", title:"Programación en Linux",
  lessons:[
    { id:"8.1", title:"Python en Linux: entorno y herramientas", time:"20 min", level:"Intermedio", tag:"tag-blue",
      content:`<div class="section"><div class="section-title">Python en Linux</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Python Setup</div></div>
<div class="terminal-body">
<div class="cmd">python3 --version</div>
<div class="cmd">python3 -m venv mi_proyecto</div>
<div class="cmd">source mi_proyecto/bin/activate</div>
<div class="cmd">pip install requests flask</div>
<div class="cmd">pip freeze > requirements.txt</div>
</div></div></div>
<div class="section"><div class="section-title">Port scanner en Python</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">port_scanner.py</div></div>
<div class="terminal-body">
<div class="output">#!/usr/bin/env python3</div>
<div class="output">import socket, sys</div>
<div class="output">target = sys.argv[1]</div>
<div class="output">for puerto in [21,22,80,443,8080]:</div>
<div class="output">    sock = socket.socket()</div>
<div class="output">    sock.settimeout(1)</div>
<div class="output">    if sock.connect_ex((target, puerto)) == 0:</div>
<div class="output">        print(f"  [+] Puerto {puerto}: ABIERTO")</div>
</div></div></div>` },
    { id:"8.2", title:"C/C++ y herramientas de desarrollo", time:"20 min", level:"Avanzado", tag:"tag-orange",
      content:`<div class="section"><div class="section-title">Compilar C en Linux</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">C Development</div></div>
<div class="terminal-body">
<div class="cmd">gcc -o hola hola.c</div>
<div class="cmd">./hola</div>
<span class="t-gap"></span>
<div class="cmd">gcc -g -o programa main.c</div>
<div class="cmd">gdb ./programa</div>
</div></div></div>
<div class="section"><div class="section-title">Git — control de versiones</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Git</div></div>
<div class="terminal-body">
<div class="cmd">git init</div>
<div class="cmd">git add .</div>
<div class="cmd">git commit -m "Primer commit"</div>
<div class="cmd">git branch feature-nueva</div>
<div class="cmd">git checkout feature-nueva</div>
</div></div></div>` }
  ]
},
{
  id:9, icon:"🔒", title:"Ciberseguridad – Fundamentos",
  lessons:[
    { id:"9.1", title:"Conceptos clave y metodología", time:"20 min", level:"Avanzado", tag:"tag-orange",
      content:`<div class="section"><div class="section-title">La Tríada CIA</div>
<table class="cmd-table">
<tr><th>Principio</th><th>Definición</th></tr>
<tr><td>🔐 Confidencialidad</td><td>Solo personas autorizadas acceden a la información</td></tr>
<tr><td>✅ Integridad</td><td>La información no es alterada sin autorización</td></tr>
<tr><td>🌐 Disponibilidad</td><td>Los sistemas están accesibles cuando se necesitan</td></tr>
</table></div>
<div class="section"><div class="section-title">Las 5 fases del Pentesting</div>
<div class="prose"><ol>
<li><strong>Reconocimiento:</strong> Recopilar información</li>
<li><strong>Escaneo:</strong> Descubrir puertos y servicios</li>
<li><strong>Explotación:</strong> Aprovechar vulnerabilidades</li>
<li><strong>Post-explotación:</strong> Mantener acceso</li>
<li><strong>Reporte:</strong> Documentar hallazgos</li>
</ol></div></div>
<div class="callout danger"><div class="callout-title">⚖️ LEGAL</div>
<div class="prose">El hacking sin autorización escrita es un <strong>delito grave</strong>. Practica SIEMPRE en laboratorios controlados.</div></div>` },
    { id:"9.2", title:"Nmap — escaneo de redes", time:"25 min", level:"Avanzado", tag:"tag-orange",
      content:`<div class="section"><div class="section-title">Nmap — el escáner de red más poderoso</div>
<div class="terminal"><div class="terminal-header"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div><div class="term-title">Nmap</div></div>
<div class="terminal-body">
<div class="cmd">nmap 192.168.1.1</div>
<div class="cmd">nmap -sV objetivo.com</div>
<div class="output">PORT   STATE SERVICE VERSION<br>22/tcp open  ssh     OpenSSH 8.9p1<br>80/tcp open  http    Apache 2.4.54</div>
<span class="t-gap"></span>
<div class="cmd">sudo nmap -A -T4 objetivo.com</div>
<div class="cmd">nmap -oN resultado.txt -sV objetivo.com</div>
</div></div></div>
<div class="callout info"><div class="callout-title">💡 Practica</div>
<div class="prose">Usa <code>nmap scanme.nmap.org</code> — servidor oficial para pruebas.</div></div>` }
  ]
},
{
  id:10, icon:"🛡️", title:"Kali Linux & Hacking Ético",
  lessons:[
    { id:"10.1", title:"Kali Linux: instalación y herramientas", time:"20 min", level:"Avanzado", tag:"tag-red",
      content:`<div class="section"><div class="section-title">¿Qué es Kali Linux?</div>
<div class="prose"><p><strong>Kali Linux</strong> es una distribución diseñada para pentesting con 600+ herramientas preinstaladas.</p></div>
</div>
<div class="section"><div class="section-title">Herramientas esenciales</div>
<table class="cmd-table">
<tr><th>Herramienta</th><th>Categoría</th><th>Uso</th></tr>
<tr><td>nmap</td><td>Recon</td><td>Escaneo de puertos</td></tr>
<tr><td>Metasploit</td><td>Exploit</td><td>Framework de exploits</td></tr>
<tr><td>Burp Suite</td><td>Web</td><td>Proxy para apps web</td></tr>
<tr><td>Wireshark</td><td>Red</td><td>Análisis de tráfico</td></tr>
<tr><td>John the Ripper</td><td>Passwords</td><td>Cracking de hashes</td></tr>
<tr><td>Hydra</td><td>Brute force</td><td>Fuerza bruta servicios</td></tr>
<tr><td>SQLmap</td><td>Web</td><td>SQL injection</td></tr>
</table></div>
<div class="callout danger"><div class="callout-title">☠️ SOLO EN LABORATORIO</div>
<div class="prose">Todas estas herramientas se deben usar ÚNICAMENTE con autorización escrita o en plataformas de práctica como TryHackMe/HackTheBox.</div></div>` },
    { id:"10.2", title:"Recursos, CTFs y camino profesional", time:"15 min", level:"Avanzado", tag:"tag-red",
      content:`<div class="section"><div class="section-title">Plataformas de práctica</div>
<div class="resource-grid">
<div class="resource-card"><h4>TryHackMe</h4><p>Laboratorios guiados, perfecto para principiantes</p></div>
<div class="resource-card"><h4>HackTheBox</h4><p>Máquinas reales para hackear. Muy valorado por empleadores</p></div>
<div class="resource-card"><h4>VulnHub</h4><p>VMs para descargar y practicar offline</p></div>
<div class="resource-card"><h4>OverTheWire</h4><p>Wargames de Linux: Bandit, Narnia, Leviathan</p></div>
<div class="resource-card"><h4>PicoCTF</h4><p>CTF de la Carnegie Mellon, excelente para cero</p></div>
</div></div>
<div class="section"><div class="section-title">Certificaciones recomendadas</div>
<table class="cmd-table">
<tr><th>Certificación</th><th>Nivel</th><th>Ideal para</th></tr>
<tr><td>eJPT</td><td>Básico</td><td>Primera cert de pentesting</td></tr>
<tr><td>CompTIA Security+</td><td>Intermedio</td><td>Seguridad general</td></tr>
<tr><td>OSCP</td><td>Avanzado</td><td>Pentester profesional — la más valorada</td></tr>
</table></div>
<div class="section"><div class="section-title">Ruta de aprendizaje</div>
<div class="prose"><ol>
<li><strong>Meses 1-2:</strong> Linux sólido + redes</li>
<li><strong>Mes 3:</strong> Bash + Python</li>
<li><strong>Meses 4-5:</strong> TryHackMe paths</li>
<li><strong>Mes 6:</strong> Primera certificación</li>
<li><strong>Meses 7-12:</strong> HackTheBox + OSCP prep</li>
</ol></div></div>
<div class="callout tip"><div class="callout-title">🎯 Consejo final</div>
<div class="prose">La ciberseguridad se aprende <strong>haciendo</strong>. Por cada hora que lees, dedica 3 a practicar.</div></div>` }
  ]
}
];


// ─── STATE ───────────────────────────────────────────────────────────────────
let currentLesson = null;
let currentView = 'welcome'; // 'welcome', 'lesson', 'lab', 'dashboard'
let flatLessons = [];
MODULES.forEach(m => m.lessons.forEach(l => flatLessons.push({mod:m, lesson:l})));

// ─── RENDER SIDEBAR ──────────────────────────────────────────────────────────
function renderSidebar() {
  const list = document.getElementById('mod-list');
  list.innerHTML = '';
  const done = Gamification.getDoneLessons();

  MODULES.forEach(m => {
    const item = document.createElement('div');
    item.className = 'mod-item';
    item.id = 'mod-' + m.id;
    const doneLessons = m.lessons.filter(l => done.has(l.id)).length;
    item.innerHTML = `
      <div class="mod-header" onclick="toggleMod(${m.id})">
        <span class="mod-icon">${m.icon}</span>
        <span class="mod-title">${m.title}</span>
        ${doneLessons > 0 ? `<span class="mod-badge">${doneLessons}/${m.lessons.length}</span>` : ''}
        <span class="mod-arrow">▶</span>
      </div>
      <div class="lesson-list">${m.lessons.map(l => `
        <button class="lesson-btn ${done.has(l.id)?'done':''} ${currentLesson&&currentLesson.id===l.id?'active':''}" onclick="loadLesson('${l.id}')">
          <span class="lesson-dot"></span>${l.title}
        </button>`).join('')}
      </div>`;
    list.appendChild(item);
    if (currentLesson && m.lessons.find(l => l.id === currentLesson.id)) {
      item.classList.add('open');
      item.querySelector('.mod-header').classList.add('active');
    }
  });
  updateProgress();
}

function toggleMod(id) {
  const item = document.getElementById('mod-' + id);
  item.classList.toggle('open');
}

function updateProgress() {
  const total = flatLessons.length;
  const n = Gamification.getDoneLessons().size;
  const pct = total ? Math.round(n / total * 100) : 0;
  document.getElementById('prog-bar').style.width = pct + '%';
  document.getElementById('prog-label').textContent = `${n} / ${total} lecciones completadas`;
}

// ─── LOAD LESSON ─────────────────────────────────────────────────────────────
function loadLesson(id) {
  const found = flatLessons.find(x => x.lesson.id === id);
  if (!found) return;
  currentLesson = found.lesson;
  currentView = 'lesson';
  const mod = found.mod;
  const done = Gamification.getDoneLessons();

  document.getElementById('top-bar').style.display = 'flex';
  document.getElementById('breadcrumb').innerHTML =
    `<span>${mod.icon} ${mod.title}</span> <span style="color:var(--border2)">/</span> <span>${currentLesson.title}</span>`;

  const doneBtn = document.getElementById('btn-done');
  const isDone = done.has(id);
  doneBtn.textContent = isDone ? '✓ Completado' : 'Marcar como visto ✓';
  doneBtn.style.background = isDone ? 'var(--green3)' : '';
  doneBtn.style.borderColor = isDone ? 'var(--green2)' : '';
  doneBtn.style.color = isDone ? 'var(--green)' : '';

  const tagMap = { 'tag-green': ['Básico','tag-green'], 'tag-blue': ['Intermedio','tag-blue'], 'tag-orange': ['Avanzado','tag-orange'], 'tag-red': ['Experto','tag-red'] };
  const [levelLabel] = tagMap[currentLesson.tag] || ['Básico','tag-green'];

  document.getElementById('content-area').innerHTML = `
    <div class="content">
      <h1 class="lesson-title">${currentLesson.title}</h1>
      <div class="lesson-meta">
        <span class="tag ${currentLesson.tag}">${levelLabel}</span>
        <span class="tag tag-blue">⏱ ${currentLesson.time}</span>
        <span class="tag tag-purple">📖 ${mod.title}</span>
      </div>
      ${currentLesson.content}
    </div>`;

  document.querySelector('.main').scrollTo(0, 0);
  renderSidebar();
}

function markDone() {
  if (!currentLesson) return;
  const id = currentLesson.id;
  const isDone = Gamification.markLessonDone(id);
  const doneBtn = document.getElementById('btn-done');
  doneBtn.textContent = isDone ? '✓ Completado' : 'Marcar como visto ✓';
  doneBtn.style.background = isDone ? 'var(--green3)' : '';
  doneBtn.style.borderColor = isDone ? 'var(--green2)' : '';
  doneBtn.style.color = isDone ? 'var(--green)' : '';
  renderSidebar();
}

function navLesson(dir) {
  if (!currentLesson) return;
  const idx = flatLessons.findIndex(x => x.lesson.id === currentLesson.id);
  const next = flatLessons[idx + dir];
  if (next) loadLesson(next.lesson.id);
}

// ─── LAB VIEW ────────────────────────────────────────────────────────────────
function showLab() {
  currentView = 'lab';
  currentLesson = null;
  document.getElementById('top-bar').style.display = 'flex';
  document.getElementById('breadcrumb').innerHTML =
    `<span>🧪 Laboratorio Interactivo</span>`;

  // Hide lesson nav buttons  
  document.getElementById('btn-prev').style.display = 'none';
  document.getElementById('btn-done').style.display = 'none';
  document.getElementById('btn-next').style.display = 'none';

  const stats = Challenges.getStats();
  const level = Gamification.getLevel();

  document.getElementById('content-area').innerHTML = `
    <div class="lab-layout">
      <div class="lab-header">
        <h2><span class="glitch">🧪</span> Laboratorio CTF</h2>
        <div class="lab-stats">
          <div class="lab-stat">
            <div class="stat-value" id="lab-stat-xp">${Gamification.getXP()}</div>
            <div class="stat-label">XP Total</div>
          </div>
          <div class="lab-stat">
            <div class="stat-value">${stats.completed}/${stats.total}</div>
            <div class="stat-label">Retos</div>
          </div>
          <div class="lab-stat">
            <div class="stat-value" id="lab-stat-level">${level.icon} ${level.name}</div>
            <div class="stat-label">Nivel</div>
          </div>
        </div>
      </div>
      <div class="lab-body">
        <div class="lab-terminal-col">
          <div class="interactive-terminal">
            <div class="iterm-header">
              <div class="dot dot-r"></div>
              <div class="dot dot-y"></div>
              <div class="dot dot-g"></div>
              <span class="iterm-title">user@linux-lab</span>
            </div>
            <div class="iterm-output" id="iterm-output"></div>
            <div class="iterm-input-wrap">
              <span class="iterm-prompt" id="iterm-prompt">user@linux-lab:~$ </span>
              <input type="text" class="iterm-input" id="iterm-input" 
                     placeholder="Escribe un comando..." autocomplete="off" spellcheck="false">
            </div>
          </div>
        </div>
        <div class="lab-challenge-col" id="lab-challenges"></div>
      </div>
    </div>`;

  // Initialize terminal
  const output = document.getElementById('iterm-output');
  const input = document.getElementById('iterm-input');
  const prompt = document.getElementById('iterm-prompt');

  Terminal.init(output, input, prompt, (flag) => {
    // Callback when a flag is found in output
    // We could auto-highlight it
  });

  // Render challenges
  const challengeCol = document.getElementById('lab-challenges');
  Challenges.renderChallenges(challengeCol);

  // Focus terminal
  setTimeout(() => Terminal.focus(), 100);

  // Click on terminal area focuses input
  document.querySelector('.interactive-terminal').addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT') Terminal.focus();
  });

  renderSidebar();
}

function updateLabStats() {
  const stats = Challenges.getStats();
  const xpEl = document.getElementById('lab-stat-xp');
  if (xpEl) xpEl.textContent = Gamification.getXP();
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
function showWelcome() {
  currentView = 'welcome';
  currentLesson = null;
  document.getElementById('top-bar').style.display = 'none';
  
  // Restore nav buttons visibility
  document.getElementById('btn-prev').style.display = '';
  document.getElementById('btn-done').style.display = '';
  document.getElementById('btn-next').style.display = '';

  const level = Gamification.getLevel();
  const stats = Challenges.getStats();

  document.getElementById('content-area').innerHTML = `
    <div class="welcome">
      <h1>Bienvenido al<br><span>Linux Lab</span></h1>
      <p>Plataforma interactiva de Linux y Ciberseguridad. Aprende desde cero hasta hacking ético con una terminal real, retos CTF y sistema de gamificación.</p>
      <p style="color:var(--text3);font-size:13px;">📍 ${flatLessons.length} lecciones · 10 módulos · ${stats.total} retos CTF · Del escritorio al pentesting</p>
      
      <div style="margin: 24px 0; padding: 20px; background: linear-gradient(135deg, rgba(63,185,80,.08), rgba(57,211,83,.04)); border: 1px solid var(--green3); border-radius: 12px; cursor: pointer;" onclick="showLab()">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <span style="font-size:28px">🧪</span>
          <div>
            <div style="font-size:16px;font-weight:800;color:var(--green);">Laboratorio Interactivo</div>
            <div style="font-size:12px;color:var(--text2);">Terminal Linux + Retos CTF</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:8px;">
            <span class="tag tag-green">${level.icon} ${level.name}</span>
            <span class="tag tag-blue">${Gamification.getXP()} XP</span>
            <span class="tag tag-orange">${stats.completed}/${stats.total} retos</span>
          </div>
        </div>
        <div style="font-size:12px;color:var(--text3);">Haz clic para abrir la terminal interactiva y resolver retos tipo Capture The Flag</div>
      </div>

      <div class="mod-grid">
        ${MODULES.map(m => `
          <div class="mod-card" onclick="loadLesson('${m.lessons[0].id}')">
            <div class="icon">${m.icon}</div>
            <h3>${m.title}</h3>
            <p>${m.lessons.length} lección${m.lessons.length!==1?'es':''}</p>
          </div>`).join('')}
      </div>
    </div>`;
  
  renderSidebar();
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function showDashboard() {
  currentView = 'dashboard';
  currentLesson = null;
  document.getElementById('top-bar').style.display = 'flex';
  document.getElementById('breadcrumb').innerHTML = '<span>📊 Mi Perfil</span>';
  document.getElementById('btn-prev').style.display = 'none';
  document.getElementById('btn-done').style.display = 'none';
  document.getElementById('btn-next').style.display = 'none';

  const level = Gamification.getLevel();
  const streak = Gamification.streak;
  const challengeStats = Challenges.getStats();
  const lessonsDone = Gamification.getDoneLessons().size;
  const achvStats = typeof Achievements !== 'undefined' ? Achievements.getStats() : {};
  const achvUnlocked = typeof Achievements !== 'undefined' ? Achievements.getUnlockedCount() : 0;
  const achvTotal = typeof Achievements !== 'undefined' ? Achievements.getTotalCount() : 0;

  document.getElementById('content-area').innerHTML = `
    <div class="dashboard">
      <h1>${level.icon} Mi Perfil</h1>
      <p class="dashboard-sub">Rango: <strong style="color:${level.color}">${level.name}</strong> — ${Gamification.getXP()} XP totales</p>

      <div class="dash-stats-grid">
        <div class="dash-stat-card">
          <div class="dash-stat-icon">⚡</div>
          <div class="dash-stat-value">${Gamification.getXP()}</div>
          <div class="dash-stat-label">XP Total</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">🔥</div>
          <div class="dash-stat-value">${streak.currentDays}</div>
          <div class="dash-stat-label">Racha Actual</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">🏅</div>
          <div class="dash-stat-value">${streak.longestStreak}</div>
          <div class="dash-stat-label">Racha Máxima</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">🎯</div>
          <div class="dash-stat-value">${challengeStats.completed}/${challengeStats.total}</div>
          <div class="dash-stat-label">Retos CTF</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">📚</div>
          <div class="dash-stat-value">${lessonsDone}/${flatLessons.length}</div>
          <div class="dash-stat-label">Lecciones</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">🏆</div>
          <div class="dash-stat-value">${achvUnlocked}/${achvTotal}</div>
          <div class="dash-stat-label">Logros</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">⌨️</div>
          <div class="dash-stat-value">${achvStats.totalCommands || 0}</div>
          <div class="dash-stat-label">Comandos</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-icon">📅</div>
          <div class="dash-stat-value">${streak.totalDays || 0}</div>
          <div class="dash-stat-label">Días Activo</div>
        </div>
      </div>

      <div class="dash-section-title">🏆 Logros (${achvUnlocked}/${achvTotal})</div>
      <div class="badge-grid" id="badge-grid"></div>
    </div>`;

  // Render badges
  if (typeof Achievements !== 'undefined') {
    const grid = document.getElementById('badge-grid');
    Achievements.renderBadges(grid);
  }

  renderSidebar();
}

// ─── MATRIX RAIN (background effect) ─────────────────────────────────────────
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = 'アカサタナハマヤラワ0123456789ABCDEF{}()<>/\\|_-+=';
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3fb950';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all systems
  Gamification.init();
  Challenges.init();
  if (typeof Achievements !== 'undefined') Achievements.init();

  // Update XP display
  Gamification.updateXPDisplay();

  // Render
  renderSidebar();
  showWelcome();

  // Matrix rain
  initMatrixRain();

  // Lab button
  document.getElementById('lab-btn').addEventListener('click', showLab);

  // Dashboard button
  const dashBtn = document.getElementById('dash-btn');
  if (dashBtn) dashBtn.addEventListener('click', showDashboard);

  // Sidebar header click -> welcome
  document.querySelector('.sidebar-header').addEventListener('click', showWelcome);
  document.querySelector('.sidebar-header').style.cursor = 'pointer';
});
