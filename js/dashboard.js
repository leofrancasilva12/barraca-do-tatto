// ── THEME SYSTEM ──
function toggleTheme(){
  const isDark=document.documentElement.dataset.theme==='dark';
  if(isDark){delete document.documentElement.dataset.theme;localStorage.setItem('btTheme','light')}
  else{document.documentElement.dataset.theme='dark';localStorage.setItem('btTheme','dark')}
  updateThemeBtn();
}
function updateThemeBtn(){
  const isDark=document.documentElement.dataset.theme==='dark';
  document.getElementById('theme-icon').textContent=isDark?'☀️':'🌙';
  document.getElementById('theme-label').textContent=isDark?'Claro':'Escuro';
}
(function(){if(localStorage.getItem('btTheme')==='dark'){document.documentElement.dataset.theme='dark';updateThemeBtn()}})();

// ── LOGIN SYSTEM ──
const CREDENTIALS={user:'admin',pass:'admin'}
function doLogin(){
  const u=document.getElementById('login-user').value.trim()
  const p=document.getElementById('login-pass').value
  const remember=document.getElementById('login-remember').checked
  if(u===CREDENTIALS.user&&p===CREDENTIALS.pass){
    if(remember){localStorage.setItem('btLoggedIn','true')}
    else{sessionStorage.setItem('btLoggedIn','true')}
    document.getElementById('login-screen').style.display='none'
    document.getElementById('app-content').style.display='block'
    init()
  } else {
    document.getElementById('login-error').style.display='block'
    document.getElementById('login-pass').value=''
    document.getElementById('login-pass').focus()
  }
}
(function(){
  if(sessionStorage.getItem('btLoggedIn')==='true'||localStorage.getItem('btLoggedIn')==='true'){
    document.getElementById('login-screen').style.display='none'
    document.getElementById('app-content').style.display='block'
  } else {
    document.getElementById('login-screen').style.display='flex'
    document.getElementById('app-content').style.display='none'
  }
})();

const fmtP=p=>p!=null?'R$ '+p.toFixed(2).replace('.',','):'R$ 0,00'
function esc(s){if(!s)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function loadComandas(){try{return JSON.parse(localStorage.getItem('btComandas')||'[]')}catch(e){return []}}
function saveComandas(c){localStorage.setItem('btComandas',JSON.stringify(c));window.dispatchEvent(new Event('storage'))}
const nowStr=()=>new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'})

// Menu management
function loadMenu(){return JSON.parse(localStorage.getItem('btMenuCustom')||'null')}
function saveMenu(m){localStorage.setItem('btMenuCustom',JSON.stringify(m))}
const defaultMenu=[
  {id:1,name:'Carne do Sol c/ Farofa e Salada',desc:'Carne do sol com farofa e salada',price:48,img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',cat:'entradas'},
  {id:2,name:'Carne do Sol c/ Fritas ou Aipim',desc:'Carne do sol com fritas ou aipim',price:58,img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',cat:'entradas'},
  {id:3,name:'Filé c/ Fritas',desc:'Filé com fritas crocantes',price:69,img:'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500&q=80',cat:'entradas'},
  {id:4,name:'Calabresa Acebolada',desc:'Calabresa acebolada estilo petisco',price:45,img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80',cat:'entradas'},
  {id:5,name:'Calabresa c/ Fritas ou Aipim',desc:'Calabresa acebolada com fritas ou aipim',price:49,img:'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&q=80',cat:'entradas'},
  {id:6,name:'Porção de Batata ou Aipim',desc:'Fritas ou aipim crocante',price:27,img:'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80',cat:'entradas'},
  {id:7,name:'Camarão Alho e Óleo',desc:'Camarão suculento no alho e óleo',price:62,img:'https://images.unsplash.com/photo-1559742811-822873691df8?w=500&q=80',cat:'entradas',badge:'Destaque'},
  {id:8,name:'Camarão à Milanesa',desc:'Camarão empanado crocante',price:59,img:'https://images.unsplash.com/photo-1559742811-822873691df8?w=500&q=80',cat:'entradas'},
  {id:9,name:'Camarão sem Casca c/ Farofa e Salada',desc:'Camarão sem casca com farofa e salada',price:72,img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',cat:'entradas',badge:'Especial'},
  {id:10,name:'Casquinha de Siri',desc:'Casquinha de siri artesanal',price:32,img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',cat:'entradas'},
  {id:11,name:'Isca de Peixe c/ Fritas ou Aipim',desc:'Iscas de peixe fritas com fritas ou aipim',price:58,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'entradas'},
  {id:12,name:'Isca de Peixe c/ Farofa e Salada',desc:'Iscas de peixe com farofa e salada',price:49,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'entradas'},
  {id:13,name:'Isca de Frango c/ Fritas ou Aipim',desc:'Iscas de frango com fritas ou aipim',price:52,img:'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',cat:'entradas'},
  {id:14,name:'Isca de Frango c/ Farofa e Salada',desc:'Iscas de frango com farofa e salada',price:49,img:'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',cat:'entradas'},
  {id:15,name:'Agulhinha c/ Farofa e Salada',desc:'Agulhinha frita com farofa e salada',price:45,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'entradas'},
  {id:16,name:'Pitinga c/ Farofa e Salada',desc:'Pitinga frita com farofa e salada',price:45,img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',cat:'entradas'},
  {id:17,name:'Lambreta Grande (12 und)',desc:'12 unidades de lambreta / mexilhão',price:32,img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',cat:'entradas',serves:'2-3 pessoas'},
  {id:18,name:'Lambreta Dobrada',desc:'Porção dobrada de lambreta / mexilhão',price:46,img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',cat:'entradas'},
  {id:19,name:'Caranguejo (unidade)',desc:'Caranguejo fresco — unidade',price:10,img:'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500&q=80',cat:'entradas'},
  {id:20,name:'Bolinho',desc:'Bolinho crocante — scone',price:33,img:'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80',cat:'entradas'},
  {id:21,name:'Caldo (Camarão, Sururu, Polvo...)',desc:'Caldo quente do mar com ingredientes frescos',price:28,img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',cat:'entradas'},
  {id:22,name:'Frango a Passarinho 1kg',desc:'1kg de frango a passarinho crocante',price:55,img:'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',cat:'entradas',serves:'3-4 pessoas'},
  {id:23,name:'Frango c/ Batata ou Aipim',desc:'Frango a passarinho com batata frita ou aipim',price:55,img:'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',cat:'entradas'},
  {id:24,name:'Peixe em Posta',desc:'Arroz, farofa, feijão fradinho, salada e fritas',price:107,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'refeicoes',badge:'Destaque',serves:'2 pessoas'},
  {id:25,name:'Peixe Frito Pequeno',desc:'Arroz, farofa, feijão fradinho, salada e fritas',price:81,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'refeicoes'},
  {id:26,name:'Peixe Frito Médio',desc:'Arroz, farofa, feijão fradinho, salada e fritas',price:96,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'refeicoes'},
  {id:27,name:'Peixe Frito Grande',desc:'Arroz, farofa, feijão fradinho, salada e fritas',price:121,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'refeicoes',serves:'3-4 pessoas'},
  {id:28,name:'Peixe Frito Família',desc:'Arroz, farofa, feijão fradinho, salada e fritas',price:146,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'refeicoes',badge:'Especial',serves:'4-5 pessoas'},
  {id:29,name:'Peixe Super Família (1500g)',desc:'Arroz, farofa, feijão fradinho, salada e fritas',price:187,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'refeicoes',serves:'5-6 pessoas'},
  {id:30,name:'Moqueca de Peixe',desc:'Arroz, farofa, feijão fradinho, salada e pirão',price:129.90,img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',cat:'refeicoes',serves:'2 pessoas'},
  {id:31,name:'Moqueca de Camarão',desc:'Arroz, farofa, feijão fradinho, salada e pirão',price:139.90,img:'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500&q=80',cat:'refeicoes',badge:'Destaque',serves:'2 pessoas'},
  {id:32,name:'Moqueca Mista',desc:'Peixe e camarão — arroz, farofa, feijão, salada e pirão',price:148,img:'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500&q=80',cat:'refeicoes',serves:'2-3 pessoas'},
  {id:33,name:'Arrumadinho',desc:'Arroz, farofa, feijão fradinho, salada, carne, bacon e calabresa',price:59,img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',cat:'refeicoes'},
  {id:34,name:'Mariscada',desc:'Arroz, farofa, feijão fradinho, salada e pirão',price:162,img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',cat:'refeicoes',badge:'Especial',serves:'3-4 pessoas'},
  {id:35,name:'Lagosta 1kg',desc:'Arroz, farofa e salada',price:179,img:'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=500&q=80',cat:'refeicoes',serves:'2 pessoas'},
  {id:36,name:'Arroz',desc:'Porção extra de arroz',price:12,img:'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&q=80',cat:'extras'},
  {id:37,name:'Feijão',desc:'Porção extra de feijão',price:12,img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',cat:'extras'},
  {id:38,name:'Farofa',desc:'Porção extra de farofa',price:12,img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',cat:'extras'},
  {id:39,name:'Salada',desc:'Porção extra de salada',price:12,img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',cat:'extras'},
  {id:40,name:'Água sem Gás 500ml',desc:'Água mineral natural gelada',price:4,img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&q=80',cat:'bebidas'},
  {id:41,name:'Água com Gás 500ml',desc:'Água mineral com gás gelada',price:6,img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&q=80',cat:'bebidas'},
  {id:42,name:'Água de Coco',desc:'Água de coco gelada natural',price:7,img:'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80',cat:'bebidas'},
  {id:43,name:'Água Tônica Lata',desc:'Água tônica gelada em lata',price:8,img:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&q=80',cat:'bebidas'},
  {id:44,name:'H2OH Soda Can',desc:'H2OH gelada em lata',price:7,img:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&q=80',cat:'bebidas'},
  {id:45,name:'Refrigerante Lata',desc:'Soda can gelada',price:7,img:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&q=80',cat:'bebidas'},
  {id:46,name:'Energético',desc:'Energético gelado',price:15,img:'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=500&q=80',cat:'bebidas'},
  {id:47,name:'Smirnoff Ice',desc:'Smirnoff Ice gelada',price:12,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'bebidas'},
  {id:48,name:'Suco de Frutas 400ml',desc:'Suco de frutas gelado 400ml',price:10,img:'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80',cat:'bebidas'},
  {id:49,name:'Heineken 600ml',desc:'Heineken gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'cervejas'},
  {id:50,name:'Brahma Duplo Malte 600ml',desc:'Brahma Duplo Malte gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas'},
  {id:51,name:'Amstel 600ml',desc:'Amstel gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas'},
  {id:52,name:'Devassa 600ml',desc:'Devassa gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas'},
  {id:53,name:'Original 600ml',desc:'Original gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas'},
  {id:54,name:'Heineken Long Neck',desc:'Heineken long neck gelada',price:null,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'cervejas',badge:'Destaque'},
  {id:55,name:'Heineken 0% Álcool',desc:'Heineken sem álcool long neck gelada',price:null,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'cervejas'},
  {id:56,name:'Malzebier Long Neck',desc:'Malzebier gelada long neck',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas'},
  {id:57,name:'Caipiroska de Slova 400ml',desc:'Frutas da estação',price:13,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:58,name:'Caipiroska 400ml',desc:'Velho Barreiro ou Pitú com frutas da estação',price:13,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:59,name:'Caipiroska Dobrada 400ml',desc:'Caipirinha ou caipiroska dupla',price:20,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:60,name:'Caipiroska Smirnoff/Orloff 400ml',desc:'Frutas da estação',price:17,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks'},
  {id:61,name:'Roska de Kiwi ou Morango 400ml',desc:'Caipiroska especial de kiwi ou morango',price:15,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks'},
  {id:62,name:'Caipiroska de Absolut 400ml',desc:'Vodka Absolut com frutas frescas',price:25,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',badge:'Especial'},
  {id:63,name:'Cocoroska 400ml',desc:'Drink refrescante de coco',price:25,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks'},
  {id:64,name:'Espanhola 400ml',desc:'Drink espanhol gelado',price:18,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:65,name:'Gin com Pitaia',desc:'Gin premium com pitaia fresca',price:29.90,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',badge:'Novo'},
  {id:66,name:'Pinacolada',desc:'Gelo, leite condensado, creme de leite e leite de coco',price:24.99,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:67,name:'Sex on the Pier',desc:'Triple sec, suco de laranja e xarope de hibisco',price:21.99,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks'},
  {id:68,name:'Gamboa Summer',desc:'Campari, mix cítrico e água tônica',price:21.99,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:69,name:'Lost Beach',desc:'Xarope de hibisco, sumo de limão, vodka e refrigerante de limão',price:21.99,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks'},
  {id:70,name:'Um Gin pra Chamar de Meu',desc:'Triple sec, xarope de hibisco, água tônica, limão siciliano e gelo',price:24,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks'},
  {id:71,name:'Lagoa Azul',desc:'Drink especial da casa',price:24,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',badge:'Destaque'},
  {id:72,name:'Old Parr',desc:'Dose de whisky Old Parr',price:20,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
  {id:73,name:'Red Label',desc:'Dose de whisky Red Label',price:15,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
  {id:74,name:'Vodka Absolut',desc:'Dose de vodka Absolut',price:14,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
  {id:75,name:'Gin YVY',desc:'Dose de gin YVY',price:15,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
  {id:76,name:'Vodka Smirnoff',desc:'Dose de vodka Smirnoff',price:10,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
  {id:77,name:'Campari',desc:'Dose de Campari',price:10,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
  {id:78,name:'Pitú',desc:'Dose de cachaça Pitú',price:7,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses'},
]

const catNames={entradas:'Entradas & Petiscos',refeicoes:'Refeições',extras:'Porções Extras',bebidas:'Bebidas',cervejas:'Cervejas',drinks:'Drinks Especiais',doses:'Doses'}
const catEmojis={entradas:'🦐',refeicoes:'🍽️',extras:'🍚',bebidas:'🥤',cervejas:'🍺',drinks:'🍹',doses:'🥃'}
const catOrder=['entradas','refeicoes','extras','bebidas','cervejas','drinks','doses']

let currentRange='today'
let editingMenuId=null
let adminView=localStorage.getItem('btAdminView')||'grande'
function setAdminView(v){if(v==='lista')v='grande';adminView=v;localStorage.setItem('btAdminView',v);init()}

function switchTab(t){
  document.querySelectorAll('.tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===t))
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'))
  document.getElementById('tc-'+t).classList.add('active')
  init()
}

function setRange(r){
  currentRange=r
  init()
}

function parseComandaDate(str){
  const p=str.match(/(\d+)\/(\d+)\/(\d+),\s*(\d+):(\d+)/)
  if(!p)return null
  return new Date(2000+parseInt(p[3]),parseInt(p[2])-1,parseInt(p[1]),parseInt(p[4]),parseInt(p[5]))
}
function filterByRange(list){
  if(currentRange==='custom'){
    const from=document.getElementById('date-from').value
    const to=document.getElementById('date-to').value
    if(!from||!to)return list
    const sd=new Date(from+'T00:00:00'),ed=new Date(to+'T23:59:59')
    return list.filter(c=>{const d=parseComandaDate(c.abertura);return d?d>=sd&&d<=ed:true})
  }
  const n=new Date(),s=new Date()
  if(currentRange==='today')s.setHours(0,0,0,0)
  else if(currentRange==='week')s.setDate(n.getDate()-7)
  else if(currentRange==='30')s.setDate(n.getDate()-30)
  else return list
  return list.filter(c=>{const d=parseComandaDate(c.abertura);return d?d>=s:true})
}

function getTotal(c){return c.items.filter(i=>i.price!=null).reduce((s,i)=>s+i.price*i.qty,0)}
function getQty(c){return c.items.reduce((s,i)=>s+i.qty,0)}
function pc(i){return i===0?'g':i===1?'s':i===2?'b':'n'}

const PIX_KEY='leofrancasilva13@gmail.com'
const PIX_NAME='Leonardo Franca Silva'
const PIX_CITY='Salvador'
let pixComandaId=null

/* Gerador de Payload PIX EMV/BR Code */
function pixPayload(valor){
  const f=(id,val)=>id+String(val.length).padStart(2,'0')+val
  const merchant=f('00','br.gov.bcb.pix')+f('01',PIX_KEY)
  const txid='BT'+Date.now().toString(36).toUpperCase()
  const addData=f('05',txid.slice(0,25))
  let payload=f('00','01')+f('01','12')+f('26',merchant)+f('52','0000')+f('53','986')+(valor>0?f('54',valor.toFixed(2)):'')+f('58','BR')+f('59',PIX_NAME.slice(0,25))+f('60',PIX_CITY.slice(0,15))+f('62',addData)
  payload+='6304'
  let crc=0xFFFF
  for(let i=0;i<payload.length;i++){crc^=payload.charCodeAt(i)<<8;for(let j=0;j<8;j++)crc=crc&0x8000?(crc<<1)^0x1021:crc<<1;crc&=0xFFFF}
  return payload+crc.toString(16).toUpperCase().padStart(4,'0')
}

function fecharMesa(id){
  const all=loadComandas(),c=all.find(x=>x.id===id);if(!c)return
  const total=getTotal(c)
  pixComandaId=id
  document.getElementById('pay-mesa-title').textContent='Sombreiro '+c.mesa+(c.cliente?' · '+c.cliente:'')
  document.getElementById('pay-total-val').textContent=fmtP(total)
  document.getElementById('pay-methods').style.display='flex'
  document.getElementById('pix-detail').style.display='none'
  document.getElementById('card-detail').style.display='none'
  var pixCode=pixPayload(total)
  document.getElementById('pix-qr-wrap').innerHTML='<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(pixCode)+'" alt="QR PIX" width="180" height="180"/>'
  document.getElementById('pix-qr-wrap').dataset.pixCode=pixCode
  document.getElementById('btn-pay-confirm').onclick=function(){confirmDashPayment(id,'pix')}
  document.getElementById('modal-pay').classList.add('open')
}
function selectPayMethod(method){
  document.getElementById('pay-methods').style.display='none'
  if(method==='pix'){document.getElementById('pix-detail').style.display='block'}
  else{document.getElementById('card-detail').style.display='block';document.getElementById('card-method-label').textContent=method==='debito'?'Pagamento no Débito':'Pagamento no Crédito';document.getElementById('btn-card-confirm').onclick=function(){confirmDashPayment(pixComandaId,method)}}
}
function backToMethods(){document.getElementById('pix-detail').style.display='none';document.getElementById('card-detail').style.display='none';document.getElementById('pay-methods').style.display='flex'}
function confirmDashPayment(id,method){
  const all=loadComandas(),c=all.find(x=>x.id===id);if(!c)return
  c.status='paga';c.pagamento=nowStr();c.formaPagamento=method
  saveComandas(all);closePayModal();init()
}
function copyPixKey(){var code=document.getElementById('pix-qr-wrap').dataset.pixCode||PIX_KEY;navigator.clipboard.writeText(code).then(function(){var b=document.querySelector('.btn-copy');b.textContent='✅ Copiado!';setTimeout(function(){b.textContent='📋 Copiar Copia e Cola'},2000)}).catch(function(){prompt('Copie o código PIX:',code)})}
function closePayModal(){document.getElementById('modal-pay').classList.remove('open');pixComandaId=null}

function viewComanda(id){
  const c=loadComandas().find(x=>x.id===id);if(!c)return
  const total=getTotal(c)
  document.getElementById('detail-title').textContent=`Sombreiro ${c.mesa}${c.cliente?' · '+c.cliente:''}`
  document.getElementById('detail-body').innerHTML=`
    <div style="font-size:12px;color:var(--sub);margin-bottom:8px">
      ${esc(c.abertura)} · ${esc(c.status).toUpperCase()}${c.formaPagamento?' · '+({pix:'PIX',debito:'Débito',credito:'Crédito'}[c.formaPagamento]||esc(c.formaPagamento)):''}${c.atendente?' · Atendente: '+esc(c.atendente):''}${c.pessoas?' · '+c.pessoas+' pessoas':''}
    </div>
    <div class="detail-items">${(c.items||[]).map(i=>`<div class="di"><span class="di-name">${esc(i.name)}</span><span class="di-qty">x${i.qty}</span><span class="di-price">${i.price!=null?fmtP(i.price*i.qty):'Consultar'}</span></div>`).join('')}
    ${!c.items||!c.items.length?'<div style="text-align:center;padding:12px;color:var(--sub);font-size:11px">Sem itens</div>':''}
    </div>
    ${c.obs?`<div style="background:#fffbe6;border:1px solid #ffeaa7;border-radius:8px;padding:8px;font-size:11px;color:#7d6608;margin-bottom:8px"><strong>📝</strong> ${esc(c.obs)}</div>`:''}
    <div style="font-size:18px;font-weight:900;color:var(--blue);text-align:right;padding-top:8px;border-top:1px solid #e8edf3">Total: ${fmtP(total)}</div>`
  document.getElementById('modal-detail').classList.add('open')
}

function init(){
  const allData=loadComandas()
  const data=filterByRange(allData)


  // ── OVERVIEW TAB ──
  const abertas=data.filter(c=>c.status==='aberta')
  const fechadas=data.filter(c=>c.status==='fechada')
  const pagas=data.filter(c=>c.status==='paga')
  const fin=[...fechadas,...pagas]
  const fat=fin.reduce((s,c)=>s+getTotal(c),0)
  const aberto=abertas.reduce((s,c)=>s+getTotal(c),0)
  const itens=data.reduce((s,c)=>s+getQty(c),0)
  const pessoas=data.reduce((s,c)=>s+(parseInt(c.pessoas)||0),0)

  const ic={},ir={}
  data.forEach(c=>c.items.forEach(i=>{ic[i.name]=(ic[i.name]||0)+i.qty;if(i.price!=null)ir[i.name]=(ir[i.name]||0)+i.price*i.qty}))
  const topQ=Object.entries(ic).sort((a,b)=>b[1]-a[1]).slice(0,8)
  const topR=Object.entries(ir).sort((a,b)=>b[1]-a[1]).slice(0,8)
  const mxQ=topQ[0]?topQ[0][1]:1,mxR=topR[0]?topR[0][1]:1
  const allProds=Object.entries(ic).sort((a,b)=>b[1]-a[1])

  const dashGarcomSearch=(document.getElementById('dash-search-garcom')?.value||'').toLowerCase()
  const abertasFilt=dashGarcomSearch?abertas.filter(c=>(c.atendente||'').toLowerCase().includes(dashGarcomSearch)):abertas
  const otHTML=abertasFilt.length?abertasFilt.map(c=>`<div class="ot" onclick="viewComanda('${c.id}')">
    <div class="ot-badge">${esc(c.mesa)}</div>
    <div class="ot-info"><div class="ot-name">${c.atendente?'🏷️ '+esc(c.atendente):'⛱️ '+esc(c.mesa)}</div><div class="ot-meta">${c.cliente?'👤 '+esc(c.cliente)+' · ':''}${getQty(c)} itens · ${esc(c.abertura)}</div></div>
    <div class="ot-total">${fmtP(getTotal(c))}</div>
    <button class="ot-close" onclick="event.stopPropagation();fecharMesa('${c.id}')">Fechar</button>
  </div>`).join(''):'<div class="empty"><div class="icon">✅</div><p>Nenhum sombreiro aberto</p></div>'

  document.getElementById('tc-overview').innerHTML=`
    <div class="kpi-grid">
      <div class="kpi blue"><div class="kpi-icon">💰</div><div class="kpi-val">${fmtP(fat)}</div><div class="kpi-label">Faturamento</div></div>
      <div class="kpi orange"><div class="kpi-icon">⏳</div><div class="kpi-val">${fmtP(aberto)}</div><div class="kpi-label">Em aberto</div></div>
      <div class="kpi green"><div class="kpi-icon">🧾</div><div class="kpi-val">${data.length}</div><div class="kpi-label">Comandas</div></div>
      <div class="kpi purple"><div class="kpi-icon">📦</div><div class="kpi-val">${itens}</div><div class="kpi-label">Itens vendidos</div></div>
      <div class="kpi red"><div class="kpi-icon">👥</div><div class="kpi-val">${pessoas||'—'}</div><div class="kpi-label">Pessoas</div></div>
    </div>
    <div class="status-row">
      <div class="scard"><div class="scard-val" style="color:var(--green)">${abertas.length}</div><div class="scard-lbl" style="color:var(--green)">Abertas</div></div>
      <div class="scard"><div class="scard-val" style="color:var(--orange)">${fechadas.length}</div><div class="scard-lbl" style="color:var(--orange)">Fechadas</div></div>
      <div class="scard"><div class="scard-val" style="color:#888">${pagas.length}</div><div class="scard-lbl" style="color:#888">Pagas</div></div>
    </div>
    <div class="g2">
      <div class="panel"><div class="panel-h" style="flex-wrap:wrap"><span class="em">🟢</span> Sombreiros Abertos (${abertas.length})<div style="margin-left:auto"><input id="dash-search-garcom" type="text" placeholder="🔍 Buscar garçom..." oninput="init()" value="${dashGarcomSearch}" style="background:#f0f3f8;border:1.5px solid #e0e5ee;padding:6px 12px;border-radius:8px;font-size:11px;color:var(--text);font-family:inherit;max-width:160px"/></div></div><div class="panel-b">${otHTML}</div></div>
      <div class="panel"><div class="panel-h"><span class="em">🔥</span> Mais Pedidos</div><div class="panel-b">${topQ.map(([n,q],i)=>`<div class="rk"><span class="rk-pos ${pc(i)}">${i+1}</span><span class="rk-name">${n}</span><div class="rk-bar"><div class="rk-bar-fill" style="width:${(q/mxQ*100)|0}%"></div></div><span class="rk-val q">${q}x</span></div>`).join('')||'<div class="empty"><p>Sem dados</p></div>'}</div></div>
    </div>
    <div class="g2">
      <div class="panel"><div class="panel-h"><span class="em">💰</span> Maior Faturamento</div><div class="panel-b">${topR.map(([n,r],i)=>`<div class="rk"><span class="rk-pos ${pc(i)}">${i+1}</span><span class="rk-name">${n}</span><div class="rk-bar"><div class="rk-bar-fill" style="width:${(r/mxR*100)|0}%"></div></div><span class="rk-val m">${fmtP(r)}</span></div>`).join('')||'<div class="empty"><p>Sem dados</p></div>'}</div></div>
      <div class="panel"><div class="panel-h"><span class="em">📦</span> Produtos Vendidos (${allProds.length})</div><div class="panel-b">${allProds.map(([n,q])=>`<div class="pr"><span class="pr-name">${n}</span><span class="pr-qty">${q}x</span><span class="pr-rev">${fmtP(ir[n]||0)}</span></div>`).join('')||'<div class="empty"><p>Sem dados</p></div>'}</div></div>
    </div>`

  // ── COMANDAS TAB ──
  const cmdGarcomSearch=(document.getElementById('cmd-search-garcom')?.value||'').toLowerCase()
  let sorted=[...data].sort((a,b)=>{const o={aberta:0,fechada:1,paga:2};return (o[a.status]??9)-(o[b.status]??9)})
  if(cmdGarcomSearch) sorted=sorted.filter(c=>(c.atendente||'').toLowerCase().includes(cmdGarcomSearch))
  document.getElementById('tc-comandas').innerHTML=`<div style="margin-bottom:12px"><input id="cmd-search-garcom" type="text" placeholder="🔍 Buscar garçom..." oninput="init()" value="${cmdGarcomSearch}" style="background:#f0f3f8;border:1.5px solid #e0e5ee;padding:9px 14px;border-radius:8px;font-size:12px;color:var(--text);font-family:inherit;max-width:260px;width:100%"/></div>`+(sorted.length?`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px">${sorted.map(c=>{
    const total=getTotal(c),qi=getQty(c)
    const payLabel=c.formaPagamento?(' ('+({pix:'PIX',debito:'Débito',credito:'Crédito'}[c.formaPagamento]||c.formaPagamento)+')'):'';
    const stTag=c.status==='aberta'?'🟢 Aberta':c.status==='fechada'?'🟠 Fechada':'✅ Paga'+payLabel
    let actBtn=''
    if(c.status==='aberta')actBtn='<button class="ot-close" onclick="event.stopPropagation();fecharMesa(\''+c.id+'\')" style="margin-left:auto;flex-shrink:0">💳 Fechar</button>'
    else if(c.status==='fechada')actBtn='<button class="ot-close" onclick="event.stopPropagation();fecharMesa(\''+c.id+'\')" style="margin-left:auto;flex-shrink:0;background:#e8faf0;color:var(--green)">💳 Pagar</button>'
    return `<div style="background:var(--card);border-radius:12px;border:1px solid #e8edf3;overflow:hidden;cursor:pointer;transition:transform .2s" onclick="viewComanda('${c.id}')">
      <div style="display:flex;align-items:center;gap:8px;padding:12px 14px;background:${c.status==='aberta'?'#f4faff':c.status==='fechada'?'#fff8ed':'#f8f8f8'};border-bottom:1px solid #e8edf3;flex-wrap:wrap">
        <div style="width:32px;height:32px;border-radius:8px;background:${c.status==='aberta'?'linear-gradient(135deg,var(--blue),var(--blue2))':c.status==='fechada'?'linear-gradient(135deg,var(--orange),#f39c12)':'#ccc'};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;color:#fff;flex-shrink:0">${esc(c.mesa)}</div>
        <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:800;color:var(--dark)">Sombreiro ${esc(c.mesa)}${c.atendente?' — Garçom: '+esc(c.atendente):''}</div><div style="font-size:10px;color:var(--sub)">${c.cliente?'👤 '+esc(c.cliente)+' · ':''}${qi} itens · ${esc(c.abertura)}</div></div>
        <span class="status-tag st-${c.status}" style="flex-shrink:0">${stTag}</span>
        ${actBtn}
      </div>
      <div style="padding:10px 14px;display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:11px;color:var(--sub)">${c.pessoas?'👥 '+c.pessoas+' pessoas':''}</div>
        <div style="font-size:15px;font-weight:900;color:var(--blue)">${fmtP(total)}</div>
      </div>
    </div>`
  }).join('')}</div>`:'<div class="empty"><div class="icon">🧾</div><h3>Sem comandas</h3></div>')

  // ── ADMIN TAB ──
  const menuList=loadMenu()||defaultMenu
  const adminSearch=document.getElementById('admin-search-val')?.value||''
  const adminCatFilter=window._adminCatFilter||'all'
  let filtered=adminSearch?menuList.filter(i=>i.name.toLowerCase().includes(adminSearch.toLowerCase())):menuList
  if(adminCatFilter!=='all') filtered=filtered.filter(i=>i.cat===adminCatFilter)
  // Build category-grouped product HTML
  let adminCatHTML=''
  catOrder.forEach(function(cat){
    const catItems=filtered.filter(function(i){return i.cat===cat})
    if(!catItems.length)return
    adminCatHTML+='<div style="margin-bottom:20px">'
    adminCatHTML+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:8px 12px;background:var(--bluelight);border-radius:10px">'
    adminCatHTML+='<span style="font-size:20px">'+(catEmojis[cat]||'📦')+'</span>'
    adminCatHTML+='<span style="font-size:14px;font-weight:800;color:var(--dark)">'+(catNames[cat]||cat)+'</span>'
    adminCatHTML+='<span style="font-size:11px;color:var(--sub);font-weight:600">('+catItems.length+')</span>'
    adminCatHTML+='</div>'
    adminCatHTML+='<div class="admin-grid'+(adminView==='grande'?' view-grande':adminView==='detalhe'?' view-detalhe':'')+'">'
    catItems.forEach(function(i){
      var imgTag=i.img?'<img class="a-img-grande" src="'+i.img+'" alt="'+i.name+'" loading="lazy"/>':'<div class="a-img-placeholder-grande">📷</div>'
      var imgDetail=i.img?'<img class="a-img-detail" src="'+i.img+'" alt="'+i.name+'" loading="lazy"/>':'<div class="a-img-placeholder-detail">📷</div>'
      var priceStr=i.price!=null?fmtP(i.price):'Consultar'
      var descStr=i.desc?'<div style="font-size:10px;color:var(--sub);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+i.desc+'</div>':''
      if(adminView==='grande'){
        adminCatHTML+='<div class="admin-item-grande" style="cursor:pointer" onclick="openEditProduct('+i.id+')">'+imgTag+'<div class="a-card-info"><span class="a-name">'+i.name+'</span><span class="a-price">'+priceStr+'</span>'+descStr+'</div><div class="a-card-actions"><button class="a-btn a-btn-del" onclick="event.stopPropagation();deleteProduct('+i.id+')" title="Excluir">🗑️</button></div></div>'
      } else if(adminView==='detalhe'){
        adminCatHTML+='<div class="admin-item-detalhe" style="cursor:pointer" onclick="openEditProduct('+i.id+')">'+imgDetail+'<div class="a-detail-info"><span class="a-name">'+i.name+'</span><span class="a-price">'+priceStr+'</span>'+descStr+'</div><div class="a-detail-actions"><button class="a-btn-lg a-btn-del" onclick="event.stopPropagation();deleteProduct('+i.id+')">🗑️ Excluir</button></div></div>'
      }
    })
    adminCatHTML+='</div></div>'
  })
  // Category filter buttons
  var catFilterHTML='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">'
  catFilterHTML+='<button class="dchip'+(adminCatFilter==='all'?' active':'')+'" onclick="window._adminCatFilter=\'all\';init()">Todos</button>'
  catOrder.forEach(function(c){
    catFilterHTML+='<button class="dchip'+(adminCatFilter===c?' active':'')+'" onclick="window._adminCatFilter=\''+c+'\';init()">'+(catEmojis[c]||'')+' '+(catNames[c]||c)+'</button>'
  })
  catFilterHTML+='</div>'
  document.getElementById('tc-admin').innerHTML=`
    <div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <button class="btn-admin" onclick="openAddProduct()" style="display:flex;align-items:center;gap:5px">➕ Adicionar Produto</button>
      <div style="flex:1"></div>
      <div class="view-btns">
        <button class="view-btn${adminView==='grande'?' active':''}" onclick="setAdminView('grande')" title="Grande"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></button>
        <button class="view-btn${adminView==='detalhe'?' active':''}" onclick="setAdminView('detalhe')" title="Detalhe"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="6" height="6" rx="1"/><line x1="13" y1="6" x2="20" y2="6"/><line x1="13" y1="9" x2="17" y2="9"/><rect x="3" y="14" width="6" height="6" rx="1"/><line x1="13" y1="16" x2="20" y2="16"/><line x1="13" y1="19" x2="17" y2="19"/></svg></button>
      </div>
      <input id="admin-search-val" type="text" placeholder="🔍 Buscar produto..." value="${adminSearch}" oninput="init()" style="min-width:160px;max-width:240px;background:#f0f3f8;border:1.5px solid #e0e5ee;padding:9px 14px;border-radius:8px;font-size:12px;color:var(--text);font-family:inherit"/>
    </div>
    ${catFilterHTML}
    ${adminCatHTML}`

  // ── REPORTS TAB ──
  const rangeLabel=currentRange==='custom'?'Período Personalizado':{today:'Hoje',week:'Últimos 7 dias','30':'Últimos 30 dias'}[currentRange]||'Todos'
  const rl=[]
  rl.push(`📊 RELATÓRIO — BUTECO DO TATTOO`)
  rl.push(`📅 Período: ${rangeLabel}`)
  rl.push(`📆 Gerado em: ${new Date().toLocaleString('pt-BR')}`)
  rl.push(``)
  rl.push(`💰 Faturamento (fechadas/pagas): ${fmtP(fat)}`)
  rl.push(`⏳ Em aberto: ${fmtP(aberto)}`)
  rl.push(`🧾 Total de comandas: ${data.length}`)
  rl.push(`   - Abertas: ${abertas.length}`)
  rl.push(`   - Fechadas: ${fechadas.length}`)
  rl.push(`   - Pagas: ${pagas.length}`)
  rl.push(`📦 Itens vendidos: ${itens}`)
  rl.push(`👥 Pessoas atendidas: ${pessoas||'N/A'}`)
  rl.push(``)
  // Payment methods breakdown
  const byMethod={pix:0,debito:0,credito:0,outro:0}
  pagas.forEach(c=>{const m=c.formaPagamento||'outro';byMethod[m]=(byMethod[m]||0)+getTotal(c)})
  rl.push(`💳 POR FORMA DE PAGAMENTO:`)
  if(byMethod.pix)rl.push(`   PIX: ${fmtP(byMethod.pix)}`)
  if(byMethod.debito)rl.push(`   Débito: ${fmtP(byMethod.debito)}`)
  if(byMethod.credito)rl.push(`   Crédito: ${fmtP(byMethod.credito)}`)
  if(byMethod.outro)rl.push(`   Outros: ${fmtP(byMethod.outro)}`)
  rl.push(``)
  rl.push(`🏆 TOP PRODUTOS:`)
  topQ.forEach(([n,q],i)=>rl.push(`   ${i+1}. ${n} — ${q}x (${fmtP(ir[n]||0)})`))
  rl.push(``)
  document.getElementById('tc-reports').innerHTML=`
    <div class="report-box">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <h3 style="margin-bottom:0">📄 Relatório ${rangeLabel}</h3>
          <button class="dchip${currentRange==='today'?' active':''}" onclick="setRange('today');setTimeout(init,100)">Hoje</button>
          <button class="dchip${currentRange==='week'?' active':''}" onclick="setRange('week');setTimeout(init,100)">7 dias</button>
          <button class="dchip${currentRange==='30'?' active':''}" onclick="setRange('30');setTimeout(init,100)">30 dias</button>
          <button class="dchip${currentRange==='custom'?' active':''}" onclick="setRange('custom');setTimeout(init,100)">📅 Período</button>
          <input type="date" id="date-from" class="date-input" style="display:${currentRange==='custom'?'inline-block':'none'}" value="${document.getElementById('date-from')?.value||''}" onchange="setRange('custom');init()"/>
          <span style="display:${currentRange==='custom'?'inline':'none'};font-size:11px;color:var(--sub)">até</span>
          <input type="date" id="date-to" class="date-input" style="display:${currentRange==='custom'?'inline-block':'none'}" value="${document.getElementById('date-to')?.value||''}" onchange="setRange('custom');init()"/>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn-pdf" onclick="exportPDF()">📥 Baixar PDF</button>
          <button class="btn-del-report" onclick="openDeleteModal()">🗑️ Apagar</button>
        </div>
      </div>
      <div class="report-preview" id="report-text">${rl.join('\n')}</div>
    </div>`

  // ── ESTOQUE TAB ──
  const stockData=JSON.parse(localStorage.getItem('btEstoque')||'{}')
  const stockMenu=loadMenu()||defaultMenu
  let estoqueHTML=''
  catOrder.forEach(function(cat){
    const catItems=stockMenu.filter(function(i){
      const matchCat = i.cat===cat;
      const matchSearch = !estoqueSearch || i.name.toLowerCase().includes(estoqueSearch.toLowerCase());
      return matchCat && matchSearch;
    })
    if(!catItems.length)return
    estoqueHTML+='<div style="margin-bottom:20px">'
    estoqueHTML+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:8px 12px;background:var(--bluelight);border-radius:10px">'
    estoqueHTML+='<span style="font-size:20px">'+(catEmojis[cat]||'📦')+'</span>'
    estoqueHTML+='<span style="font-size:14px;font-weight:800;color:var(--dark)">'+(catNames[cat]||cat)+'</span>'
    estoqueHTML+='<span style="font-size:11px;color:var(--sub);font-weight:600">('+catItems.length+' produtos)</span>'
    estoqueHTML+='</div>'
    estoqueHTML+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:8px">'
    catItems.forEach(function(i){
      var qty=stockData[i.id]!=null?stockData[i.id]:''
      var qtyNum=parseInt(qty)
      var statusColor=isNaN(qtyNum)?'var(--sub)':qtyNum<=0?'var(--red)':qtyNum<=5?'var(--orange)':'var(--green)'
      var statusLabel=isNaN(qtyNum)?'Sem controle':qtyNum<=0?'Esgotado':qtyNum<=5?'Baixo estoque':qtyNum+' un.'
      var imgTag=i.img?'<img src="'+i.img+'" style="width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0" loading="lazy"/>':'<div style="width:36px;height:36px;border-radius:8px;background:#f0f3f8;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">📷</div>'
      estoqueHTML+='<div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--card);border-radius:10px;border:1px solid #e8edf3">'
      estoqueHTML+=imgTag
      estoqueHTML+='<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:700;color:var(--dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+i.name+'</div><div style="font-size:10px;color:'+statusColor+';font-weight:700;margin-top:2px">'+statusLabel+'</div></div>'
      estoqueHTML+='<div style="display:flex;align-items:center;gap:4px;flex-shrink:0">'
      estoqueHTML+='<button onclick="adjustStock('+i.id+',-1)" style="width:28px;height:28px;border-radius:6px;border:1px solid #e0e5ee;background:#ffeaea;color:var(--red);cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center">−</button>'
      estoqueHTML+='<input id="stk-'+i.id+'" type="number" min="0" value="'+(qty)+'" onchange="setStock('+i.id+',this.value)" style="width:50px;text-align:center;background:#f0f3f8;border:1.5px solid #e0e5ee;padding:4px;border-radius:6px;font-size:12px;font-weight:700;color:var(--text);font-family:inherit"/>'
      estoqueHTML+='<button onclick="adjustStock('+i.id+',1)" style="width:28px;height:28px;border-radius:6px;border:1px solid #e0e5ee;background:#e8faf0;color:var(--green);cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center">+</button>'
      estoqueHTML+='</div></div>'
    })
    estoqueHTML+='</div></div>'
  })
  // Stock summary
  var totalProds=stockMenu.length
  var controlled=Object.keys(stockData).length
  var esgotados=Object.values(stockData).filter(function(v){return parseInt(v)<=0}).length
  var baixo=Object.values(stockData).filter(function(v){var n=parseInt(v);return n>0&&n<=5}).length
  
  const estoqueSearch = document.getElementById('estoque-search-val')?.value || ''
  
  document.getElementById('tc-estoque').innerHTML=
    '<div style="margin-bottom:12px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
    '  <div style="flex:1"></div>' +
    '  <div class="view-btns">' +
    '    <button class="view-btn active" title="Visualizar"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" fill="none" stroke-width="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/><line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" stroke-width="2"/></svg></button>' +
    '  </div>' +
    '  <input id="estoque-search-val" type="text" placeholder="🔍 Buscar no estoque..." value="'+estoqueSearch+'" oninput="init()" style="min-width:160px;max-width:240px;background:#f0f3f8;border:1.5px solid #e0e5ee;padding:9px 14px;border-radius:8px;font-size:12px;color:var(--text);font-family:inherit"/>' +
    '</div>' +
    '<div style="margin-bottom:16px;display:flex;gap:12px;flex-wrap:wrap">'+
    '<div class="scard"><div class="scard-val" style="color:var(--blue)">'+totalProds+'</div><div class="scard-lbl">Total Produtos</div></div>'+
    '<div class="scard"><div class="scard-val" style="color:var(--green)">'+controlled+'</div><div class="scard-lbl">Com Estoque</div></div>'+
    '<div class="scard"><div class="scard-val" style="color:var(--red)">'+esgotados+'</div><div class="scard-lbl">Esgotados</div></div>'+
    '<div class="scard"><div class="scard-val" style="color:var(--orange)">'+baixo+'</div><div class="scard-lbl">Baixo Estoque</div></div>'+
    '</div>'+estoqueHTML
}

// ── STOCK FUNCTIONS ──
function loadStock(){return JSON.parse(localStorage.getItem('btEstoque')||'{}')}
function saveStock(s){localStorage.setItem('btEstoque',JSON.stringify(s))}
function setStock(id,val){
  var s=loadStock()
  var v=parseInt(val)
  if(isNaN(v)||val===''){delete s[id]}else{s[id]=Math.max(0,v)}
  saveStock(s);init()
}
function adjustStock(id,delta){
  var s=loadStock()
  var cur=parseInt(s[id])||0
  var nv=Math.max(0,cur+delta)
  s[id]=nv
  saveStock(s);init()
}

// ── ADMIN FUNCTIONS ──
function openAddProduct(){
  editingMenuId=null
  document.getElementById('prod-modal-title').textContent='➕ Novo Produto'
  document.getElementById('btn-save-prod').textContent='Adicionar'
  document.getElementById('adm-name').value=''
  document.getElementById('adm-price').value=''
  document.getElementById('adm-img').value=''
  document.getElementById('adm-desc').value=''
  
  const sel=document.getElementById('adm-cat')
  sel.innerHTML=catOrder.map(c=>`<option value="${c}">${catNames[c]}</option>`).join('')
  
  previewProdImg()
  document.getElementById('modal-product').classList.add('open')
}

function openEditProduct(id){
  const menuList=loadMenu()||defaultMenu
  const item=menuList.find(i=>i.id===id); if(!item)return
  
  editingMenuId=id
  document.getElementById('prod-modal-title').textContent='✏️ Editar Produto'
  document.getElementById('btn-save-prod').textContent='Salvar Alterações'
  document.getElementById('adm-name').value=item.name
  document.getElementById('adm-price').value=item.price||''
  document.getElementById('adm-img').value=item.img||''
  document.getElementById('adm-desc').value=item.desc||''
  
  const sel=document.getElementById('adm-cat')
  sel.innerHTML=catOrder.map(c=>`<option value="${c}" ${item.cat===c?'selected':''}>${catNames[c]}</option>`).join('')
  
  previewProdImg()
  document.getElementById('modal-product').classList.add('open')
}

function closeProductModal(){
  document.getElementById('modal-product').classList.remove('open')
  editingMenuId=null
}

function previewProdImg(){
  const url=document.getElementById('adm-img').value.trim()
  const box=document.getElementById('prod-img-preview')
  if(url) box.innerHTML=`<img src="${url}" style="width:100%;height:150px;object-fit:cover;border-radius:12px;border:1px solid #e8edf3"/>`
  else box.innerHTML=`<div style="width:100%;height:150px;background:#f0f3f8;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:40px;color:var(--sub)">📷</div>`
}

function saveProduct(){
  const name=document.getElementById('adm-name').value.trim()
  const priceVal=document.getElementById('adm-price').value
  const cat=document.getElementById('adm-cat').value
  const img=document.getElementById('adm-img').value.trim()
  const desc=document.getElementById('adm-desc').value.trim()
  
  if(!name){alert('Informe o nome do produto');return}
  const price=priceVal?parseFloat(priceVal):null
  let menuList=loadMenu()||[...defaultMenu]
  
  if(editingMenuId){
    const item=menuList.find(i=>i.id===editingMenuId)
    if(item){
      item.name=name; item.price=price; item.cat=cat; 
      item.img=img||null; item.desc=desc||null
    }
  } else {
    const maxId=menuList.reduce((m,i)=>Math.max(m,i.id),0)
    menuList.push({id:maxId+1,name,price,cat,img:img||null,desc:desc||null})
  }
  
  saveMenu(menuList)
  closeProductModal()
  init()
}

function deleteProduct(id){
  if(!confirm('Excluir este produto?'))return
  let menuList=loadMenu()||[...defaultMenu]
  menuList=menuList.filter(i=>i.id!==id)
  saveMenu(menuList)
  init()
}

// ── CALCULATOR ──
let calcStr='0'
function toggleCalc(){document.getElementById('modal-calc').classList.toggle('open')}
function calcInput(v){if(calcStr==='0'&&!isNaN(v))calcStr=v;else calcStr+=v;document.getElementById('calc-display').textContent=calcStr}
function calcClear(){calcStr='0';document.getElementById('calc-display').textContent='0'}
function calcEqual(){try{if(/[^0-9+\-*/.() ]/.test(calcStr))throw'invalid';calcStr=String(Function('"use strict";return ('+calcStr+')')());document.getElementById('calc-display').textContent=calcStr}catch(e){document.getElementById('calc-display').textContent='Erro';calcStr='0'}}

function exportPDF(){
  const text=document.getElementById('report-text').textContent
  const w=window.open('','_blank','width=800,height=600')
  if(!w){alert('Popup bloqueado. Permita popups para imprimir.');return}
  w.document.write('<html><head><title>Relatório Buteco do Tatto</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:monospace;font-size:12px;padding:30px;line-height:1.8;white-space:pre-wrap;color:#1a2a3a}h1{font-family:sans-serif;font-size:18px;margin-bottom:16px;text-align:center}@media print{body{padding:15px}}</style></head><body><h1>Relatório — Buteco do Tatto</h1>'+text.replace(/</g,'&lt;')+'<script>setTimeout(function(){window.print()},400)<\/script></body></html>')
}

document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.getElementById('modal-detail').classList.remove('open');document.getElementById('modal-calc').classList.remove('open');closePayModal();closeDeleteModal()}})
function openDeleteModal(){
  document.getElementById('del-step-login').style.display='block'
  document.getElementById('del-step-confirm').style.display='none'
  document.getElementById('del-user').value=''
  document.getElementById('del-pass').value=''
  document.getElementById('del-error').style.display='none'
  document.getElementById('modal-delete-report').classList.add('open')
}
function closeDeleteModal(){document.getElementById('modal-delete-report').classList.remove('open')}
function verifyDeleteLogin(){
  const u=document.getElementById('del-user').value.trim()
  const p=document.getElementById('del-pass').value
  if(u===CREDENTIALS.user&&p===CREDENTIALS.pass){
    document.getElementById('del-step-login').style.display='none'
    document.getElementById('del-step-confirm').style.display='block'
  } else {
    document.getElementById('del-error').style.display='block'
  }
}
function confirmDeleteReports(){
  localStorage.removeItem('btComandas')
  closeDeleteModal()
  init()
}
let storeStatus=localStorage.getItem('btStoreStatus')||'aberto'
function toggleStatus(){storeStatus=storeStatus==='aberto'?'fechado':'aberto';localStorage.setItem('btStoreStatus',storeStatus);const btn=document.getElementById('status-btn');const icon=document.getElementById('status-icon');const text=document.getElementById('status-text');if(storeStatus==='aberto'){btn.classList.remove('fechado');icon.textContent='🔓';text.textContent='Aberto'}else{btn.classList.add('fechado');icon.textContent='🔒';text.textContent='Fechado'}}
const isLoggedIn=()=>sessionStorage.getItem('btLoggedIn')==='true'||localStorage.getItem('btLoggedIn')==='true'
window.addEventListener('storage',()=>{if(isLoggedIn())init()})
setInterval(()=>{if(isLoggedIn())init()},30000)
if(isLoggedIn())init()
// Initialize status button
const btn=document.getElementById('status-btn')
if(btn){const icon=document.getElementById('status-icon');const text=document.getElementById('status-text');if(storeStatus==='fechado'){btn.classList.add('fechado');icon.textContent='🔒';text.textContent='Fechado'}else{btn.classList.remove('fechado');icon.textContent='🔓';text.textContent='Aberto'}}
