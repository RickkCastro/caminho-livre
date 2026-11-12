// Gera o PDF do documento de Agile a partir do Markdown.
//   npm run build   → gera uma vez
//   npm run watch   → regera sempre que o .md (ou o style.css) for salvo
const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

const SRC = path.resolve(__dirname, '..', 'Agile_GS_CaminhoLivre.md');
const OUT = SRC.replace(/\.md$/, '.pdf');
const CSS = path.join(__dirname, 'style.css');

// Evita títulos e rótulos sozinhos no fim da página:
// - títulos (h2/h3) e rótulos (parágrafo só em negrito, ou terminado em ":")
//   ganham a classe "keep" (o CSS reserva espaço abaixo deles);
// - quando o bloco seguinte é curto, o par título + bloco vira um bloco inquebrável.
const keepWithNext = `
<script>
// Diagramas (imagem sozinha num parágrafo, alt começando com "Diagrama")
// vão para uma página em paisagem, junto com o título que os antecede.
document.querySelectorAll('p > img[alt^="Diagrama"]').forEach(img => {
  const p = img.parentElement;
  const w = document.createElement('div');
  w.className = 'landscape';
  const prev = p.previousElementSibling;
  p.before(w);
  if (prev && prev.matches('h2, h3')) w.append(prev);
  w.append(p);
  if (w.previousElementSibling && w.previousElementSibling.matches('.pb')) w.previousElementSibling.remove();
});
</script>
<script>
const isLabel = el => el.matches('h2, h3, h4') ||
  (el.matches('p') && (
    (el.children.length === 1 && el.firstElementChild.matches('strong') &&
     el.textContent.trim() === el.firstElementChild.textContent.trim()) ||
    el.textContent.trim().endsWith(':')));
[...document.body.querySelectorAll('h2, h3, h4, p')].filter(isLabel).forEach(el => {
  el.classList.add('keep');
  const next = el.nextElementSibling;
  if (!next || isLabel(next)) return;
  if (next.getBoundingClientRect().height < 350) {
    const w = document.createElement('div');
    w.className = 'keep-group';
    el.before(w);
    w.append(el, next);
  }
});
</script>`;

let running = false, pending = false;
async function build() {
  if (running) { pending = true; return; }
  running = true;
  const t = Date.now();
  try {
    // Quebra manual vira "quebra antes do próximo bloco": evita página em branco
    // quando o conteúdo anterior termina exatamente no fim da página.
    const md = fs.readFileSync(SRC, 'utf8')
      .replace(/<div style="page-break-after:\s*always;?"><\/div>/g, '<div class="pb"></div>')
      + '\n' + keepWithNext + '\n';
    const pdf = await mdToPdf({ content: md }, {
      basedir: path.dirname(SRC),
      stylesheet: [CSS],
      pdf_options: {
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>',
        footerTemplate: '<div style="width:100%;font-size:8px;color:#8794a8;text-align:center;font-family:Segoe UI,Arial">Caminho Livre · Agile · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
        margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
      },
      launch_options: { args: ['--no-sandbox'] },
    });
    fs.writeFileSync(OUT, pdf.content);
    console.log(`[${new Date().toLocaleTimeString()}] PDF gerado em ${Date.now() - t} ms → ${OUT}`);
  } catch (e) {
    console.error('Falha ao gerar o PDF:', e.message);
  } finally {
    running = false;
    if (pending) { pending = false; build(); }
  }
}

build();

if (process.argv.includes('--watch')) {
  let timer;
  const trigger = () => { clearTimeout(timer); timer = setTimeout(build, 300); };
  fs.watch(SRC, trigger);
  fs.watch(CSS, trigger);
  console.log('Observando alterações no .md e no style.css (Ctrl+C para sair)...');
}
