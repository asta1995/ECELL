const CONFIG = {
  BACKEND_URL: 'https://ecell-backend.vercel.app', // GANTI SETELAH DEPLOY VERCEL
};
const products = [
  { id: 'mlbb12', game: 'MLBB', name: '12 Diamond', sku: 'mlbb12', modal: 5000 },
  { id: 'mlbb86', game: 'MLBB', name: '86 Diamond', sku: 'xl10000', modal: 21000 },
  { id: 'ff70', game: 'FF', name: '70 Diamond', sku: 'freefire70', modal: 10000 },
  { id: 'pubg60', game: 'PUBG', name: '60 UC', sku: 'pubg60', modal: 14000 },
];
const banks = [
  { name: 'Neo Bank', no: '5859459406987262', owner: 'WARJAYA' },
  { name: 'Mandiri', no: '1370022647966', owner: 'WARJAYA' },
  { name: 'Superbank', no: '030018699543', owner: 'WARJAYA' },
];
function hitungJual(m){ if(m<=15000) return m+1000; return m+2000; }
function renderGame(f='ALL'){
  const grid=document.getElementById('gameGrid'); grid.innerHTML='';
  const list=f==='ALL'?products:products.filter(p=>p.game===f);
  list.forEach(p=>{
    const jual=hitungJual(p.modal);
    grid.innerHTML+=`<div class='card'><div style='font-size:10px;color:#0D3B8C;font-weight:800'>${p.game}</div><b>${p.name}</b><div class='price'>Rp ${jual.toLocaleString('id-ID')}</div><input class='inp' id='id-${p.id}' placeholder='ID Game + Server (ex: 123456 7890)'><button class='btn' onclick="order('${p.id}')">BELI - Rp ${jual.toLocaleString('id-ID')}</button></div>`;
  });
}
async function order(pid){
  const p=products.find(x=>x.id===pid);
  const custNo=document.getElementById(`id-${pid}`).value;
  if(!custNo) return alert('Isi ID Game dulu!');
  const btn=event.target; btn.innerText='PROSES...'; btn.disabled=true;
  try{
    const r=await fetch(`${CONFIG.BACKEND_URL}/api/order`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:p.sku, customer_no:custNo, game:p.game, product_name:p.name})});
    const d=await r.json();
    alert(d.message); btn.innerText='BELI'; btn.disabled=false;
  }catch(e){ alert('Gagal hubungi server: '+e.message); btn.innerText='BELI'; btn.disabled=false; }
}
function filterGame(){ renderGame(document.getElementById('gameDropdown').value); }
function showTab(id){ document.getElementById('game').style.display=id=='game'?'block':'none'; document.getElementById('ppob').style.display=id=='ppob'?'block':'none'; document.getElementById('bayar').style.display=id=='bayar'?'block':'none'; document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); document.getElementById('t-'+id).classList.add('active'); }
function renderBank(){ const c=document.getElementById('bankList'); c.innerHTML=banks.map(b=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee"><div><b>${b.name} a/n ${b.owner}</b><div style="font-size:11px;opacity:.6">•••• ${b.no.slice(-5)}</div></div><button onclick="navigator.clipboard.writeText('${b.no}');alert('Disalin a/n WARJAYA')">Salin</button></div>`).join(''); }
document.addEventListener('DOMContentLoaded',()=>{ renderGame('ALL'); renderBank(); });
