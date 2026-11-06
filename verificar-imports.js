const fs = require('fs');
const path = require('path');

function listar(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? listar(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
function existeComCaixaExata(caminho) {
  const raiz = path.parse(caminho).root;
  let atual = raiz;
  for (const parte of path.relative(raiz, caminho).split(path.sep)) {
    let nomes;
    try { nomes = fs.readdirSync(atual); } catch (e) { return false; }
    if (!nomes.includes(parte)) return false;
    atual = path.join(atual, parte);
  }
  return true;
}
const EXTS = ['', '.js', '.jsx', '.json', '.native.js', '.web.js', '.android.js'];
const problemas = [];
const arquivos = listar('src').filter(f => /\.jsx?$/.test(f) && !/\.test\.jsx?$/.test(f));
const regex = /(?:from\s*|import\s*\(\s*|require\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g;
for (const arq of arquivos) {
  const codigo = fs.readFileSync(arq, 'utf8');
  let m;
  while ((m = regex.exec(codigo)) !== null) {
    const alvo = path.resolve(path.dirname(arq), m[1]);
    const candidatos = EXTS.map(e => alvo + e).concat([path.join(alvo, 'index.js')]);
    const reais = candidatos.filter(c => fs.existsSync(c) && fs.statSync(c).isFile());
    if (reais.length === 0) {
      problemas.push(arq + ' -> ' + m[1] + '   [NAO EXISTE]');
    } else if (!reais.some(existeComCaixaExata)) {
      problemas.push(arq + ' -> ' + m[1] + '   [MAIUSCULA/MINUSCULA DIFERENTE: quebra no EAS/Linux]');
    }
  }
}
console.log(problemas.length ? problemas.join('\n') : 'Nenhum problema de import encontrado em ' + arquivos.length + ' arquivos.');
