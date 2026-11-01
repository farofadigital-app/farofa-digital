const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const raizProjeto = path.resolve(__dirname, '..');
const pastaExportada = path.join(raizProjeto, 'dist');
const pastaDesktop = path.join(__dirname, 'web');
const expoCli = path.join(raizProjeto, 'node_modules', 'expo', 'bin', 'cli');

const resultado = spawnSync(
  process.execPath,
  [expoCli, 'export', '--platform', 'web', '--output-dir', 'dist'],
  {
    cwd: raizProjeto,
    stdio: 'inherit',
    windowsHide: true
  }
);

if (resultado.error) throw resultado.error;
if (resultado.status !== 0) {
  process.exitCode = resultado.status || 1;
} else {
  const arquivoHtml = path.join(pastaExportada, 'index.html');
  if (!fs.existsSync(arquivoHtml)) {
    throw new Error(`O export web não gerou o arquivo esperado: ${arquivoHtml}`);
  }

  fs.rmSync(pastaDesktop, { recursive: true, force: true });
  fs.mkdirSync(pastaDesktop, { recursive: true });
  fs.cpSync(pastaExportada, pastaDesktop, { recursive: true, force: true });

  const html = fs.readFileSync(path.join(pastaDesktop, 'index.html'), 'utf8');
  const htmlRelativo = html.replace(/((?:src|href)=["'])\/(?!\/)/g, '$1./');
  fs.writeFileSync(path.join(pastaDesktop, 'index.html'), htmlRelativo);
}
