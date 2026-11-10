#!/usr/bin/env node

/**
 * Koulu-apuri: Automaattinen versionhallintatyökalu
 * Nostaa versionumeroa 0.01:llä jokaisella commitilla (muodossa 1.0x).
 * Synkronoi automaattisesti:
 * - version.json (konfiguraatiotiedosto)
 * - js/version.js (frontendin lokaali/offline-tieto)
 * - sw.js (PWA Service Worker -välimuistin nimi)
 * - index.html (käyttöliittymässä näkyvä versionumero)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const versionJsonPath = path.join(rootDir, 'version.json');
const versionJsPath = path.join(rootDir, 'js', 'version.js');
const swJsPath = path.join(rootDir, 'sw.js');
const indexHtmlPath = path.join(rootDir, 'index.html');

// 1. Lue nykyinen versio
if (!fs.existsSync(versionJsonPath)) {
  fs.writeFileSync(versionJsonPath, JSON.stringify({ version: '1.04' }, null, 2) + '\n');
}

let config = {};
try {
  config = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
} catch (e) {
  config = { version: '1.04' };
}

let currentVer = config.version || '1.04';

// Tarkistetaanko onko pyydetty versionostoa vai synkronointia
const isSyncOnly = process.argv.includes('--sync');

if (!isSyncOnly) {
  // Nostetaan versiota 0.01:llä
  const curNum = parseFloat(currentVer) || 1.04;
  const nextVer = (curNum + 0.01).toFixed(2);
  config.version = nextVer;
  fs.writeFileSync(versionJsonPath, JSON.stringify(config, null, 2) + '\n');
  console.log(`[version] 🚀 Nostettu versio: ${currentVer} ➔ ${nextVer}`);
} else {
  console.log(`[version] 🔄 Synkronoidaan versio: ${config.version}`);
}

const activeVer = config.version;

// 2. Päivitä js/version.js
const versionJsContent = `// Automaattisesti generoitu versiotiedosto - älä muokkaa käsin\nwindow.APP_VERSION = '${activeVer}';\n`;
fs.writeFileSync(versionJsPath, versionJsContent);

// 3. Päivitä sw.js (CACHE_NAME)
if (fs.existsSync(swJsPath)) {
  let swContent = fs.readFileSync(swJsPath, 'utf8');
  swContent = swContent.replace(/const CACHE_NAME = 'koulu-apuri-v[^']+';/, `const CACHE_NAME = 'koulu-apuri-v${activeVer}';`);
  fs.writeFileSync(swJsPath, swContent);
}

// 4. Päivitä index.html (tunnisteet)
if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  html = html.replace(/(id="app-version-badge">)v?[^<]*(<\/span>)/g, `$1v${activeVer}$2`);
  html = html.replace(/(id="app-version-footer">)v?[^<]*(<\/span>)/g, `$1v${activeVer}$2`);
  html = html.replace(/(id="app-version-parent"[^>]*>)[^<]*(<\/span>)/g, `$1Versio ${activeVer}$2`);
  fs.writeFileSync(indexHtmlPath, html);
}

// 5. Jos suoritetaan git-repossa, stagataan päivitetyt tiedostot automaattisesti commitiin
try {
  execSync('git add version.json js/version.js sw.js index.html', { cwd: rootDir, stdio: 'ignore' });
} catch (e) {
  // Ei estetä suoritusta jos git ei ole käytettävissä
}
