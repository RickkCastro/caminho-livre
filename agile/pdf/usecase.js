// Gera agile/assets/diagrama-casos-de-uso.svg (node usecase.js)
const fs = require('fs');
const path = require('path');

const L = 330, R = 660, RX = 125, RY = 24;
const C = {
  must:   ['#fff3cc', '#c99a06'],
  should: ['#fde2e4', '#c24b5a'],
  could:  ['#ece6fb', '#6f56c2'],
  wont:   ['#f1f3f5', '#9aa3ad'],
  inc:    ['#e3f2f5', '#0b6f86'],
};
const uc = {
  UC01: [L, 80,  'Entrar com Google', 'must'],
  UC04: [L, 144, 'Sair da conta', 'must'],
  UC05: [L, 208, 'Enviar alerta', 'must'],
  UC06: [L, 272, 'Consultar alertas no mapa', 'must'],
  UC12: [L, 336, 'Ver meus alertas', 'should'],
  UC11: [L, 400, 'Configurar preferências de rota', 'should'],
  UC13: [L, 464, 'Editar perfil', 'should'],
  UC09: [L, 528, 'Calcular rota acessível', 'must'],
  UC14: [L, 592, 'Excluir conta', 'should'],
  UC16: [L, 656, 'Ver ranking de bairros', 'should'],
  UC18: [L, 720, 'Ver ranking de contribuidores', 'could'],
  UC19: [L, 784, 'Compartilhar trajeto', 'could'],
  UC22: [L, 848, 'Conectar-se a outros usuários', 'wont'],
  UC02: [R, 60,  'Validar token no Google', 'inc'],
  UC03: [R, 128, 'Responder onboarding de perfil', 'should'],
  UC07: [R, 236, 'Ver detalhe do alerta', 'should'],
  UC08: [R, 306, 'Avaliar alerta (👍/👎)', 'should'],
  UC17: [R, 376, 'Pontuar contribuição', 'could'],
  UC10: [R, 460, 'Favoritar rota', 'could'],
  UC15: [R, 616, 'Anonimizar alertas do usuário', 'inc'],
  UC20: [R, 700, 'Expirar alertas não confirmados', 'should'],
  UC21: [R, 820, 'Painel de indicadores', 'wont'],
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
let out = [];
const add = s => out.push(s);

// Fronteira do sistema
add(`<rect x="180" y="16" width="635" height="870" rx="14" fill="#fbfcfd" stroke="#0b3f52" stroke-width="1.6"/>`);
add(`<text x="497" y="38" text-anchor="middle" font-size="14" font-weight="700" fill="#0b3f52">Caminho Livre</text>`);

// Atores
function stick(x, y, label) {
  add(`<g stroke="#1f2733" stroke-width="2" fill="none"><circle cx="${x}" cy="${y - 34}" r="11"/><line x1="${x}" y1="${y - 23}" x2="${x}" y2="${y + 8}"/><line x1="${x - 18}" y1="${y - 12}" x2="${x + 18}" y2="${y - 12}"/><line x1="${x}" y1="${y + 8}" x2="${x - 14}" y2="${y + 30}"/><line x1="${x}" y1="${y + 8}" x2="${x + 14}" y2="${y + 30}"/></g>`);
  add(`<text x="${x}" y="${y + 50}" text-anchor="middle" font-size="13" font-weight="700" fill="#1f2733">${label}</text>`);
}
const USER = [80, 460], SIS = [935, 560], ADM = [935, 800];
const GOOGLE = [935, 60];

// Associações (desenhadas antes dos elipses)
const line = (x1, y1, x2, y2, extra = '') =>
  add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#4a5666" stroke-width="1.2" ${extra}/>`);
['UC01','UC04','UC05','UC06','UC12','UC11','UC13','UC09','UC14','UC16','UC18','UC19','UC22']
  .forEach(k => line(USER[0] + 20, USER[1] - 12, uc[k][0] - RX, uc[k][1], uc[k][3] === 'wont' ? 'stroke-dasharray="4 3"' : ''));
line(R + RX, uc.UC02[1], GOOGLE[0] - 62, GOOGLE[1]);
line(L + RX, uc.UC09[1], SIS[0] - 20, SIS[1] - 12);
line(R + RX, uc.UC20[1], SIS[0] - 20, SIS[1] - 12);
line(R + RX, uc.UC17[1], SIS[0] - 20, SIS[1] - 12);
line(R + RX, uc.UC21[1], ADM[0] - 20, ADM[1] - 12, 'stroke-dasharray="4 3"');

// include / extend: seta tracejada da origem para o destino
function dep(from, to, kind, lx, ly) {
  const [x1, y1] = from, [x2, y2] = to;
  add(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${kind === 'include' ? '#0b6f86' : '#8a5a00'}" stroke-width="1.2" stroke-dasharray="6 4" marker-end="url(#arr-${kind})"/>`);
  add(`<text x="${lx}" y="${ly}" font-size="10.5" font-style="italic" fill="${kind === 'include' ? '#0b6f86' : '#8a5a00'}" text-anchor="middle">«${kind}»</text>`);
}
dep([L + RX, 76], [R - RX, 62], 'include', 495, 60);
dep([R - RX, 128], [L + RX - 2, 88], 'extend', 495, 118);
dep([R - RX, 240], [L + RX - 2, 268], 'extend', 495, 244);
dep([R, 306 - RY], [R, 236 + RY + 2], 'extend', R + 48, 274);
dep([R - RX + 30, 376 - RY + 4], [L + RX - 6, 208 + 10], 'extend', 482, 296);
dep([R, 376 - RY], [R, 306 + RY + 2], 'extend', R + 48, 344);
dep([R - RX, 462], [L + RX - 2, 522], 'extend', 495, 482);
dep([L + RX, 596], [R - RX, 612], 'include', 495, 592);

// Casos de uso
for (const [id, [x, y, label, kind]] of Object.entries(uc)) {
  const [fill, stroke] = C[kind];
  const dash = kind === 'wont' ? ' stroke-dasharray="5 3"' : '';
  add(`<ellipse cx="${x}" cy="${y}" rx="${RX}" ry="${RY}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"${dash}/>`);
  add(`<text x="${x}" y="${y - 3}" text-anchor="middle" font-size="10" font-weight="700" fill="${stroke}">${id}</text>`);
  add(`<text x="${x}" y="${y + 11}" text-anchor="middle" font-size="12" fill="#1f2733">${esc(label)}</text>`);
}

// Atores por cima
stick(USER[0], USER[1], 'Usuário');
stick(SIS[0], SIS[1], 'Sistema');
stick(ADM[0], ADM[1], 'Administrador');
add(`<text x="${ADM[0]}" y="${ADM[1] + 66}" text-anchor="middle" font-size="11" fill="#6b798f">(Won't)</text>`);
add(`<rect x="${GOOGLE[0] - 62}" y="${GOOGLE[1] - 26}" width="124" height="52" rx="4" fill="#ffffff" stroke="#1f2733" stroke-width="1.4"/>`);
add(`<text x="${GOOGLE[0]}" y="${GOOGLE[1] - 6}" text-anchor="middle" font-size="11" fill="#4a5666">«system»</text>`);
add(`<text x="${GOOGLE[0]}" y="${GOOGLE[1] + 12}" text-anchor="middle" font-size="13" font-weight="700" fill="#1f2733">Google</text>`);

// Legenda
const leg = [['must', 'Must'], ['should', 'Should'], ['could', 'Could'], ['wont', "Won't"], ['inc', 'Incluído (sem ator)']];
leg.forEach(([k, t], i) => {
  const x = 190 + i * 150, y = 912;
  add(`<ellipse cx="${x + 14}" cy="${y}" rx="14" ry="8" fill="${C[k][0]}" stroke="${C[k][1]}" stroke-width="1.3"${k === 'wont' ? ' stroke-dasharray="4 2"' : ''}/>`);
  add(`<text x="${x + 34}" y="${y + 4}" font-size="12" fill="#1f2733">${t}</text>`);
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1010 935" width="1010" height="935" font-family="Segoe UI, Helvetica, Arial, sans-serif">
<defs>
<marker id="arr-include" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#0b6f86" stroke-width="1.5"/></marker>
<marker id="arr-extend" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10" fill="none" stroke="#8a5a00" stroke-width="1.5"/></marker>
</defs>
<rect width="1010" height="935" fill="#ffffff"/>
${out.join('\n')}
</svg>`;

const dir = path.resolve(__dirname, '..', 'assets');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'diagrama-casos-de-uso.svg'), svg);
console.log('SVG gerado em', path.join(dir, 'diagrama-casos-de-uso.svg'));
