// E-CELL - DROPDOWN PILIH GAME + GRID PRODUK TETAP + SENSOR REKENING

const products = [
  { game: 'MLBB', name: '12 Diamond', modal: 5000 },
  { game: 'MLBB', name: '28 Diamond', modal: 9000 },
  { game: 'MLBB', name: '50 Diamond', modal: 14000 },
  { game: 'MLBB', name: '86 Diamond', modal: 21000 },
  { game: 'MLBB', name: '172 Diamond', modal: 43000 },
  { game: 'MLBB', name: '257 Diamond', modal: 62000 },
  { game: 'FF', name: '70 Diamond', modal: 10000 },
  { game: 'FF', name: '140 Diamond', modal: 20000 },
  { game: 'FF', name: '355 Diamond', modal: 50000 },
  { game: 'PUBG', name: '60 UC', modal: 14000 },
  { game: 'PUBG', name: '325 UC', modal: 70000 },
  { game: 'Valorant', name: '125 VP', modal: 14000 },
  { game: 'Valorant', name: '420 VP', modal: 45000 },
  { game: 'Roblox', name: '80 Robux', modal: 14000 },
  { game: 'HOK', name: '80 Token', modal: 14000 },
];

const banks = [
  { name: 'Neo Bank', no: '5859459406987262' },
  { name: 'Mandiri', no: '1370022647966' },
  { name: 'Superbank', no: '030018699543' },
];

function sensorRek(no) { return '•••• ' + no.slice(-5); }
function hitungJual(m) { if (m >= 5000 && m <= 15000) return m + 1000; if (m >= 20000) return m + 2000; return m + 1500; }

function renderGame(filter = 'ALL') {
  const grid = document.getElementById('gameGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const list = filter === 'ALL' ? products : products.filter(p => p.game === filter);
  list.forEach(p => {
    const jual = hitungJual(p.modal);
    grid.innerHTML += `<div class='card'><div style='font-size:10px;color:#0D3B8C;opacity:.7;font-weight:800'>${p.game}</div><b>${p.name}</b><div class='price'>Rp ${jual.toLocaleString('id-ID')}</div></div>`;
  });
  if (list.length === 0) grid.innerHTML = `<div style="grid-column:span 2;text-align:center;opacity:.5;padding:20px">Produk ${filter} belum tersedia</div>`;
}

function filterGame() {
  const val = document.getElementById('gameDropdown').value;
  renderGame(val);
}

function showTab(id) {
  document.getElementById('game').style.display = id == 'game' ? 'block' : 'none';
  document.getElementById('ppob').style.display = id == 'ppob' ? 'block' : 'none';
  document.getElementById('bayar').style.display = id == 'bayar' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('t-' + id).classList.add('active');
}

function renderBank() {
  const c = document.getElementById('bankList');
  if (!c) return;
  c.innerHTML = banks.map(b => `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f2f5"><div><b>${b.name}</b><div style="font-size:11px;opacity:.6">${sensorRek(b.no)}</div></div><button onclick="copyNum('${b.no}')" style="padding:6px 12px;border-radius:8px;border:1px solid #0D3B8C;background:white;color:#0D3B8C;font-weight:700;font-size:11px">Salin</button></div>`).join('');
}

function copyNum(num) { navigator.clipboard.writeText(num); alert('✅ Nomor ' + num + ' disalin!'); }

document.addEventListener('DOMContentLoaded', () => { renderGame('ALL'); renderBank(); });
