import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire(new URL('../artifacts/api-server/package.json', import.meta.url));
const { build } = require('esbuild');
const bcryptPath = require.resolve('bcryptjs');
const bundled = await build({
  stdin: { contents: `import { hash } from ${JSON.stringify(bcryptPath)};
    const form = document.querySelector('form');
    const password = document.querySelector('#password');
    const output = document.querySelector('#hash');
    const button = form.querySelector('button');
    password.addEventListener('input', () => password.setCustomValidity(''));
    form.addEventListener('submit', async event => {
      event.preventDefault();
      password.setCustomValidity(new TextEncoder().encode(password.value).length > 72 ? 'Use a password of at most 72 UTF-8 bytes.' : '');
      if (!form.reportValidity()) return;
      button.disabled = true;
      try { output.value = await hash(password.value, 12); password.value = ''; output.focus(); output.select(); }
      finally { button.disabled = false; }
    });`, resolveDir: process.cwd() },
  bundle: true, platform: 'browser', format: 'iife', write: false, minify: true,
});
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">
<title>Memorial administrator password setup</title>
<style>body{max-width:680px;margin:64px auto;padding:24px;font:18px system-ui;line-height:1.6}input,textarea,button{display:block;width:100%;box-sizing:border-box;margin:12px 0;padding:12px;font:inherit}textarea{font:15px monospace}button{cursor:pointer}</style></head>
<body><h1>Administrator password setup</h1>
<p>Choose your memorial administrator password. This page creates its bcrypt hash entirely in your browser. The password is never sent to the website or another service.</p>
<form><label for="password">New administrator password (at least 16 characters; maximum 72 UTF-8 bytes)</label><input id="password" type="password" required minlength="16" maxlength="72" autocomplete="new-password"><button>Create password hash</button></form>
<label for="hash">Copy this hash into Render's ADMIN_PASSWORD_HASH secret</label><textarea id="hash" readonly rows="4" autocomplete="off"></textarea>
<p>In Render, open the web service's Environment settings, add ADMIN_PASSWORD_HASH, paste the hash, and save/redeploy. Keep the original password in your password manager. Never share either value in chat.</p>
<script>${bundled.outputFiles[0].text.replaceAll('</script', '<\\/script')}</script></body></html>`;
await writeFile(new URL('../artifacts/roy-memorial/dist/public/admin-password.html', import.meta.url), html);
console.log('Built self-contained browser-only password setup page');
