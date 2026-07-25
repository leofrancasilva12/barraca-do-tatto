// ── STORE STATUS ──
(function(){
  const el=document.getElementById('store-status')
  const tag=document.getElementById('resto-status')
  function paint(){
    const s=localStorage.getItem('btStoreStatus')||'aberto'
    const fechado=s==='fechado'
    if(el){el.textContent=fechado?'🔒 Fechado':'🔓 Aberto';el.className='store-status '+(fechado?'fechado':'aberto')}
    if(tag){tag.className='hc-pill open'+(fechado?' closed':'');tag.innerHTML='<span class="hcp-ic">'+(fechado?'🔴':'🕐')+'</span><span><b>'+(fechado?'Fechado':'Aberto agora')+'</b><small>09h às 22h</small></span>'}
  }
  paint()
  window.addEventListener('storage',function(e){if(!e.key||e.key==='btStoreStatus')paint()})
})();
const WHATSAPP='5571991728256', BAR_NAME='Buteco do Tatto'

/* ── TEMA CLARO/ESCURO (sincronizado com btTheme) ── */
function applyTheme(th){
  const dark=th==='dark'
  document.documentElement.setAttribute('data-theme',dark?'dark':'light')
  const b=document.getElementById('theme-toggle'); if(b)b.textContent=dark?'☀️':'🌙'
  const mt=document.querySelector('meta[name="theme-color"]'); if(mt)mt.setAttribute('content',dark?'#0a1020':'#1c3aa1')
  const nl=document.getElementById('nav-logo-img'); if(nl)nl.src=dark?'assets/logo-white.png':'assets/logo.png'
}
function toggleTheme(){
  const nx=(localStorage.getItem('btTheme')==='dark')?'light':'dark'
  localStorage.setItem('btTheme',nx); applyTheme(nx)
}
applyTheme(localStorage.getItem('btTheme')||'light')
window.addEventListener('storage',function(e){if(e.key==='btTheme')applyTheme(localStorage.getItem('btTheme')||'light')})

/* ── i18n ── */
const i18n={
  pt:{
    addOrder:'Adicionar ao Pedido',seeDetails:'Ver Detalhes',myOrder:'Meu Pedido',
    nameLabel:'👤 Nome *',tableLabel:'🪑 Mesa *',obsLabel:'📝 Observações',
    namePH:'Seu nome',tablePH:'Nº',obsPH:'Outras observações...',
    total:'Total',sendOrder:'Fazer Pedido',clearOrder:'Limpar pedido',
    hoursTitle:'Horário de Funcionamento',
    ageWarning:'Bebidas alcoólicas proibidas para menores de 18 anos',
    errName:'Informe seu nome',errTable:'Informe o nº da mesa',
    navSub:'Cardápio Digital',searchPH:'Buscar...',consultar:'A consultar',
    items:'itens',item:'item',
    noResults:'Nenhum item encontrado',
    obsTags:['Sem cebola','Sem pimenta','Bem passado','Mal passado','Sem sal','Sem coentro','Para viagem','Alergia frutos do mar'],
    cats:{entradas:'Entradas & Petiscos',refeicoes:'Refeições',extras:'Porções Extras',bebidas:'Bebidas',cervejas:'Cervejas',drinks:'Drinks Especiais',doses:'Doses'}
  },
  en:{
    addOrder:'Add to Order',seeDetails:'See Details',myOrder:'My Order',
    nameLabel:'👤 Name *',tableLabel:'🪑 Table *',obsLabel:'📝 Notes',
    namePH:'Your name',tablePH:'No.',obsPH:'Other notes...',
    total:'Total',sendOrder:'Place Order',clearOrder:'Clear order',
    hoursTitle:'Opening Hours',ageWarning:'Alcohol prohibited for under 18s',
    errName:'Enter your name',errTable:'Enter table number',
    navSub:'Digital Menu',searchPH:'Search...',consultar:'Ask staff',
    items:'items',item:'item',
    noResults:'No items found',
    obsTags:['No onion','No pepper','Well done','Rare','No salt','No coriander','Takeaway','Seafood allergy'],
    cats:{entradas:'Starters & Snacks',refeicoes:'Meals',extras:'Side Orders',bebidas:'Drinks',cervejas:'Beer',drinks:'Cocktails',doses:'Shots'}
  },
  es:{
    addOrder:'Agregar al Pedido',seeDetails:'Ver Detalles',myOrder:'Mi Pedido',
    nameLabel:'👤 Nombre *',tableLabel:'🪑 Mesa *',obsLabel:'📝 Observaciones',
    namePH:'Tu nombre',tablePH:'Nº',obsPH:'Otras observaciones...',
    total:'Total',sendOrder:'Hacer Pedido',clearOrder:'Limpiar pedido',
    hoursTitle:'Horario de Atención',ageWarning:'Bebidas alcohólicas prohibidas menores de 18 años',
    errName:'Ingresa tu nombre',errTable:'Ingresa el nº de mesa',
    navSub:'Menú Digital',searchPH:'Buscar...',consultar:'Consultar',
    items:'ítems',item:'ítem',
    noResults:'Ningún ítem encontrado',
    obsTags:['Sin cebolla','Sin pimienta','Bien cocido','Poco hecho','Sin sal','Sin cilantro','Para llevar','Alergia mariscos'],
    cats:{entradas:'Entradas & Snacks',refeicoes:'Comidas',extras:'Porciones Extra',bebidas:'Bebidas',cervejas:'Cervezas',drinks:'Cócteles',doses:'Dosis'}
  }
}
let lang='pt'
const t=k=>i18n[lang][k]??i18n.pt[k]

/* ── HTML Escape (XSS protection) ── */
function esc(s){if(!s)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}

function setLang(l){
  lang=l
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.textContent===l.toUpperCase()))
  applyTr(); renderCategories(currentItems()); if(cartOpen) renderCart()
}
function applyTr(){
  document.querySelectorAll('[data-i]').forEach(el=>{const k=el.dataset.i;if(i18n[lang][k])el.textContent=i18n[lang][k]})
  document.getElementById('nav-sub').textContent=t('navSub')
  document.getElementById('search-input').placeholder=t('searchPH')
  const fn=document.getElementById('field-name'),ft=document.getElementById('field-table'),fo=document.getElementById('field-obs')
  if(fn)fn.placeholder=t('namePH'); if(ft)ft.placeholder=t('tablePH'); if(fo)fo.placeholder=t('obsPH')
}
/* obs tags removidas */

/* ── DADOS ── */
let menu=[
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
  {id:47,name:'Smirnoff Ice',desc:'Smirnoff Ice gelada',price:12,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'bebidas',alcoholic:true},
  {id:48,name:'Suco de Frutas 400ml',desc:'Suco de frutas gelado 400ml',price:10,img:'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80',cat:'bebidas'},
  {id:49,name:'Heineken 600ml',desc:'Heineken gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'cervejas',alcoholic:true},
  {id:50,name:'Brahma Duplo Malte 600ml',desc:'Brahma Duplo Malte gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas',alcoholic:true},
  {id:51,name:'Amstel 600ml',desc:'Amstel gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas',alcoholic:true},
  {id:52,name:'Devassa 600ml',desc:'Devassa gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas',alcoholic:true},
  {id:53,name:'Original 600ml',desc:'Original gelada 600ml',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas',alcoholic:true},
  {id:54,name:'Heineken Long Neck',desc:'Heineken long neck gelada',price:null,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'cervejas',alcoholic:true,badge:'Destaque'},
  {id:55,name:'Heineken 0% Álcool',desc:'Heineken sem álcool long neck gelada',price:null,img:'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=80',cat:'cervejas'},
  {id:56,name:'Malzebier Long Neck',desc:'Malzebier gelada long neck',price:null,img:'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=80',cat:'cervejas',alcoholic:true},
  {id:57,name:'Caipiroska de Slova 400ml',desc:'Frutas da estação',price:13,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:58,name:'Caipiroska 400ml',desc:'Velho Barreiro ou Pitú com frutas da estação',price:13,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:59,name:'Caipiroska Dobrada 400ml',desc:'Caipirinha ou caipiroska dupla',price:20,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:60,name:'Caipiroska Smirnoff/Orloff 400ml',desc:'Frutas da estação',price:17,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:61,name:'Roska de Kiwi ou Morango 400ml',desc:'Caipiroska especial de kiwi ou morango',price:15,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:62,name:'Caipiroska de Absolut 400ml',desc:'Vodka Absolut com frutas frescas',price:25,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true,badge:'Especial'},
  {id:63,name:'Cocoroska 400ml',desc:'Drink refrescante de coco',price:25,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:64,name:'Espanhola 400ml',desc:'Drink espanhol gelado',price:18,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:65,name:'Gin com Pitaia',desc:'Gin premium com pitaia fresca',price:29.90,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true,badge:'Novo'},
  {id:66,name:'Pinacolada',desc:'Gelo, leite condensado, creme de leite e leite de coco',price:24.99,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:67,name:'Sex on the Pier',desc:'Triple sec, suco de laranja e xarope de hibisco',price:21.99,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:68,name:'Gamboa Summer',desc:'Campari, mix cítrico e água tônica',price:21.99,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:69,name:'Lost Beach',desc:'Xarope de hibisco, sumo de limão, vodka e refrigerante de limão',price:21.99,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:70,name:'Um Gin pra Chamar de Meu',desc:'Triple sec, xarope de hibisco, água tônica, limão siciliano e gelo',price:24,img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&q=80',cat:'drinks',alcoholic:true},
  {id:71,name:'Lagoa Azul',desc:'Drink especial da casa',price:24,img:'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&q=80',cat:'drinks',alcoholic:true,badge:'Destaque'},
  {id:72,name:'Old Parr',desc:'Dose de whisky Old Parr',price:20,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
  {id:73,name:'Red Label',desc:'Dose de whisky Red Label',price:15,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
  {id:74,name:'Vodka Absolut',desc:'Dose de vodka Absolut',price:14,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
  {id:75,name:'Gin YVY',desc:'Dose de gin YVY',price:15,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
  {id:76,name:'Vodka Smirnoff',desc:'Dose de vodka Smirnoff',price:10,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
  {id:77,name:'Campari',desc:'Dose de Campari',price:10,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
  {id:78,name:'Pitú',desc:'Dose de cachaça Pitú',price:7,img:'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=500&q=80',cat:'doses',alcoholic:true},
]

const catOrder=['entradas','refeicoes','extras','bebidas','cervejas','drinks','doses']
const catEmoji={entradas:'🦐',refeicoes:'🍽️',extras:'🍚',bebidas:'🥤',cervejas:'🍺',drinks:'🍹',doses:'🥃'}
const fmtP=p=>p!=null?'R$ '+p.toFixed(2).replace('.',','):null

/* ── RENDER DISH ROW (estilo iFood) ── */
function dishRowHTML(item){
  const pr=fmtP(item.price)
  return `<div class="dish-row" onclick="openModal(${parseInt(item.id)})">
    <div class="dish-info">
      <div class="dish-name">${esc(item.name)}</div>
      <div class="dish-desc">${esc(item.desc)}</div>
      ${(item.serves||item.alcoholic)?`<div class="dish-meta">
        ${item.serves?`<span class="dish-chip">👥 ${esc(item.serves)}</span>`:''}
        ${item.alcoholic?`<span class="dish-chip age">🔞 +18</span>`:''}
      </div>`:''}
      ${pr?`<div class="dish-price">${pr}</div>`:`<span class="dish-consultar">${t('consultar')}</span>`}
    </div>
    <div class="dish-media">
      <div class="dish-thumb">
        <img class="dish-img" src="${esc(item.img)}" alt="${esc(item.name)}" loading="lazy"/>
        <span class="dish-shine"></span>
        ${item.badge?`<span class="card-badge badge-${esc(item.badge)}">${esc(item.badge)}</span>`:''}
      </div>
      <button class="dish-add" onclick="event.stopPropagation();addToCartById(${parseInt(item.id)})" aria-label="Adicionar">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  </div>`
}

let lastSearch=''
const currentItems=()=>lastSearch?menu.filter(i=>i.name.toLowerCase().includes(lastSearch)||i.desc.toLowerCase().includes(lastSearch)):menu

function renderCategories(items){
  const cats=t('cats')
  // Render category nav buttons
  const navEl=document.getElementById('cat-nav')
  if(navEl&&!lastSearch){
    navEl.style.display='flex'
    navEl.innerHTML=catOrder.map(cid=>{
      const ci=items.filter(i=>i.cat===cid); if(!ci.length) return ''
      return `<button class="cat-nav-btn" onclick="scrollToCat('${cid}',event)">${catEmoji[cid]} ${cats[cid]}</button>`
    }).join('')
  } else if(navEl) navEl.style.display='none'

  document.getElementById('main-content').innerHTML='<div class="categories">'+
    catOrder.map(cid=>{
      const ci=items.filter(i=>i.cat===cid); if(!ci.length) return ''
      return `<div class="cat-section" id="cat-${cid}">
        <div class="cat-header">
          <span style="font-size:18px">${catEmoji[cid]}</span>
          <span class="cat-title">${cats[cid]}</span>
          <span class="cat-count">(${ci.length} ${ci.length===1?t('item'):t('items')})</span>
        </div>
        <div class="dish-list">${ci.map(dishRowHTML).join('')}</div>
      </div>`
    }).join('')+'</div>'
  setupDishVideo()
}

/* ── Efeito "vídeo" (Ken Burns) só nas fotos visíveis ── */
let _dishObserver=null
function setupDishVideo(){
  const thumbs=document.querySelectorAll('.dish-thumb')
  if(!('IntersectionObserver' in window)){thumbs.forEach(t=>t.classList.add('playing'));return}
  if(_dishObserver)_dishObserver.disconnect()
  _dishObserver=new IntersectionObserver(es=>{
    es.forEach(en=>en.target.classList.toggle('playing',en.isIntersecting))
  },{rootMargin:'80px 0px'})
  thumbs.forEach(t=>_dishObserver.observe(t))
}

function scrollToCat(cid,evt){
  const el=document.getElementById('cat-'+cid)
  if(el){
    const offset=document.getElementById('navbar').offsetHeight+document.getElementById('cat-nav').offsetHeight+8
    window.scrollTo({top:el.offsetTop-offset,behavior:'smooth'})
  }
  document.querySelectorAll('.cat-nav-btn').forEach(b=>b.classList.remove('active'))
  if(evt&&evt.target) evt.target.closest('.cat-nav-btn')?.classList.add('active')
}

/* ── BUSCA ── */
let searchOpen=false
document.getElementById('search-btn').onclick=()=>{
  searchOpen=!searchOpen
  const inp=document.getElementById('search-input'),icon=document.getElementById('search-icon')
  inp.classList.toggle('open',searchOpen)
  if(searchOpen){inp.focus();icon.innerHTML='<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'}
  else{inp.value='';icon.innerHTML='<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'; applySearch('')}
}
document.getElementById('search-input').oninput=e=>applySearch(e.target.value)

function applySearch(q){
  lastSearch=q.trim().toLowerCase()
  document.getElementById('hero-section').style.display=lastSearch?'none':''
  const mf=document.getElementById('menu-full'); if(mf) mf.style.display=lastSearch?'none':''
  const sh=document.getElementById('search-header-wrap'),fi=currentItems()
  sh.innerHTML=lastSearch?`<div class="search-header">${fi.length} resultado(s) para <span>"${esc(q)}"</span></div>`:''
  renderCategories(fi)
  if(lastSearch&&!fi.length)
    document.getElementById('main-content').innerHTML=`<div class="no-result"><div class="icon">🔍</div><p>${t('noResults')||'Nenhum item encontrado'}</p></div>`
}

/* ── MODAL ── */
function openModal(id){
  const item=menu.find(i=>i.id===id); if(!item) return
  document.getElementById('modal-img').src=item.img
  document.getElementById('modal-name').textContent=item.name
  const pr=fmtP(item.price)
  document.getElementById('modal-price-wrap').innerHTML=pr
    ?`<div class="modal-price">${pr}</div>`
    :`<div class="modal-consultar">${t('consultar')}</div>`
  document.getElementById('modal-desc').textContent=item.desc
  const tags=document.getElementById('modal-tags'); tags.innerHTML=''
  if(item.serves) tags.innerHTML+=`<div class="modal-tag">👥 ${esc(item.serves)}</div>`
  if(item.alcoholic) tags.innerHTML+=`<div class="modal-tag">🔞 +18</div>`
  tags.innerHTML+=`<div class="modal-tag">📂 ${esc(t('cats')[item.cat]||item.cat)}</div>`
  document.getElementById('modal-badge-wrap').innerHTML=item.badge
    ?`<span class="card-badge badge-${esc(item.badge)}" style="position:absolute;top:10px;left:10px">${esc(item.badge)}</span>`:''
  document.getElementById('modal-add-btn').onclick=()=>{addToCartById(id);closeModal()}
  document.getElementById('modal-bg').classList.add('open')
  document.body.style.overflow='hidden'
}
function closeModal(e){
  if(e&&e.target!==document.getElementById('modal-bg')) return
  document.getElementById('modal-bg').classList.remove('open')
  document.body.style.overflow=''
}

/* ── CART ── */
let cart=[],cartOpen=false
document.getElementById('cart-btn').onclick=toggleCart
function toggleCart(){
  cartOpen=!cartOpen
  const s=document.getElementById('cart-sidebar'),bg=document.getElementById('cart-bg')
  if(cartOpen){
    s.style.display='flex'; bg.classList.add('open')
    document.body.style.overflow='hidden'
    renderCart(); applyTr()
  } else {
    s.style.display='none'; bg.classList.remove('open')
    document.body.style.overflow=''
  }
  updateBadge()
}
function addToCartById(id){
  const item=menu.find(i=>i.id===id); if(!item) return
  const ex=cart.find(i=>i.id===id); if(ex) ex.qty++; else cart.push({...item,qty:1})
  updateBadge(); if(cartOpen) renderCart()
}
function updateQty(id,d){
  const i=cart.find(i=>i.id===id); if(!i) return
  i.qty+=d; if(i.qty<=0) cart=cart.filter(c=>c.id!==id)
  updateBadge(); renderCart()
}
function removeFromCart(id){cart=cart.filter(i=>i.id!==id);updateBadge();renderCart()}
function clearCart(){cart=[];updateBadge();renderCart()}
function updateBadge(){
  const tot=cart.reduce((s,i)=>s+i.qty,0)
  const b=document.getElementById('cart-badge')
  b.textContent=tot; b.style.display=tot>0?'flex':'none'
  updateCartBar(tot)
}
function updateCartBar(tot){
  const bar=document.getElementById('cart-bar'); if(!bar) return
  if(tot>0&&!cartOpen){
    const total=cart.filter(i=>i.price!=null).reduce((s,i)=>s+i.price*i.qty,0)
    const hasC=cart.some(i=>i.price==null)
    document.getElementById('cart-bar-count').textContent=tot
    document.getElementById('cart-bar-total').textContent=fmtP(total)+(hasC?' +':'')
    bar.classList.add('show'); document.body.classList.add('bar-open')
  } else {
    bar.classList.remove('show'); document.body.classList.remove('bar-open')
  }
}
function renderCart(){
  const tq=cart.reduce((s,i)=>s+i.qty,0)
  document.getElementById('cart-count-label').textContent=`${tq} ${tq===1?t('item'):t('items')}`
  const el=document.getElementById('cart-items'),footer=document.getElementById('cart-footer')
  if(!cart.length){
    el.innerHTML=`<div class="cart-empty"><div class="icon">🛒</div><p style="font-weight:700">${t('myOrder')} vazio</p><p style="font-size:11px;margin-top:4px;color:#88a8c0">Adicione itens do cardápio</p></div>`
    footer.style.display='none'; return
  }
  footer.style.display='block'
  el.innerHTML=cart.map(i=>`
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${esc(i.name)}</div>
        <div class="cart-item-price">${i.price!=null?fmtP(i.price*i.qty):t('consultar')}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQty(${parseInt(i.id)},-1)">−</button>
        <span class="qty-val">${i.qty}</span>
        <button class="qty-btn" onclick="updateQty(${parseInt(i.id)},1)">+</button>
        <button class="cart-del" onclick="removeFromCart(${parseInt(i.id)})">
          <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>`).join('')
  const total=cart.filter(i=>i.price!=null).reduce((s,i)=>s+i.price*i.qty,0)
  const hasC=cart.some(i=>i.price==null)
  document.getElementById('cart-total').textContent=fmtP(total)+(hasC?' + '+t('consultar'):'')
}

let _enviando=false
function enviarPedido(){
  if(_enviando) return
  const name=document.getElementById('field-name').value.trim()
  const table=document.getElementById('field-table').value.trim()
  const obsText=document.getElementById('field-obs').value.trim()
  let ok=true
  ;['name','table'].forEach(f=>{
    document.getElementById('err-'+f).textContent=''
    document.getElementById('field-'+f).classList.remove('error')
  })
  if(!name){document.getElementById('err-name').textContent=t('errName');document.getElementById('field-name').classList.add('error');ok=false}
  if(!table){document.getElementById('err-table').textContent=t('errTable');document.getElementById('field-table').classList.add('error');ok=false}
  if(!ok) return
  _enviando=true; setTimeout(()=>_enviando=false,2000)
  const allObs=obsText

  // Salvar na comanda digital e dashboard
  const comanda={
    id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    mesa:table,
    cliente:name,
    pessoas:null,
    items:cart.map(i=>({id:i.id,name:i.name,price:i.price,qty:i.qty})),
    obs:allObs||'',
    status:'aberta',
    abertura:new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}),
    fechamento:null,
    pagamento:null
  }
  let comandas; try{comandas=JSON.parse(localStorage.getItem('btComandas')||'[]')}catch(e){comandas=[]}
  const existente=comandas.find(c=>c.mesa===table&&c.status==='aberta')
  if(existente){
    cart.forEach(ci=>{
      const ei=existente.items.find(i=>i.id===ci.id)
      if(ei) ei.qty+=ci.qty
      else existente.items.push({id:ci.id,name:ci.name,price:ci.price,qty:ci.qty})
    })
    if(allObs) existente.obs=existente.obs?(existente.obs+', '+allObs):allObs
  } else {
    comandas.push(comanda)
  }
  localStorage.setItem('btComandas',JSON.stringify(comandas))
  // Comanda/Dashboard abertos em outras abas recebem o evento 'storage' nativo automaticamente.

  // Limpar carrinho e fechar sidebar
  cart=[];updateBadge();renderCart()
  document.getElementById('field-name').value=''
  document.getElementById('field-table').value=''
  document.getElementById('field-obs').value=''
  if(cartOpen) toggleCart()

  // Toast de sucesso
  showToast(`Pedido enviado para Mesa ${table}!`)
}

function showToast(msg){
  let toast=document.getElementById('toast-ok')
  if(!toast){toast=document.createElement('div');toast.id='toast-ok';toast.className='toast-ok';document.body.appendChild(toast)}
  toast.textContent=msg
  setTimeout(()=>toast.classList.add('show'),10)
  setTimeout(()=>toast.classList.remove('show'),3000)
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();if(cartOpen)toggleCart()}
})
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',scrollY>10)
})

/* ── WEATHER & TIDE (Stella Mares, Salvador) ── */
function updateWeatherTide(){
  const h=new Date().getHours()
  // Simulação clima baseado no horário
  let icon='☀️',temp=28
  if(h>=6&&h<10){icon='🌤️';temp=25}
  else if(h>=10&&h<15){icon='☀️';temp=31}
  else if(h>=15&&h<18){icon='⛅';temp=29}
  else if(h>=18&&h<20){icon='🌅';temp=26}
  else{icon='🌙';temp=24}
  temp+=Math.round((Math.random()*4)-2)
  document.getElementById('weather-icon').textContent=icon
  document.getElementById('weather-temp').textContent=temp+'°C'

  // Simulação maré baseada em ciclo ~6h
  const cycle=((h*60+new Date().getMinutes())%360)/360
  const isHigh=cycle<0.25||cycle>0.75
  document.getElementById('tide-status').textContent=isHigh?'Maré Alta 🔺':'Maré Baixa 🔻'
}
updateWeatherTide()
setInterval(updateWeatherTide,600000)

/* ── SCROLL SPY for cat-nav ── */
window.addEventListener('scroll',()=>{
  const offset=(document.getElementById('navbar')?.offsetHeight||0)+(document.getElementById('cat-nav')?.offsetHeight||0)+12
  let activeCat=null
  catOrder.forEach(cid=>{
    const el=document.getElementById('cat-'+cid)
    if(el&&el.offsetTop-offset<=window.scrollY) activeCat=cid
  })
  const emoji=activeCat?catEmoji[activeCat]:null
  document.querySelectorAll('.cat-nav-btn').forEach(btn=>{
    btn.classList.toggle('active',!!emoji&&btn.textContent.includes(emoji))
  })
},{ passive:true })

/* ── LANDING: atalhos + categorias em destaque ── */
const featured=[
  {cat:'entradas', label:'Entradas & Petiscos', desc:'Os melhores petiscos para começar', icon:'🍤', img:'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&q=80'},
  {cat:'refeicoes', label:'Frutos do Mar', desc:'Peixes frescos e frutos do mar selecionados', icon:'🌊', img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'},
  {cat:'drinks', label:'Drinks & Bebidas', desc:'Drinks exclusivos e bebidas geladas', icon:'🍹', img:'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80'}
]
function renderLanding(){
  const qc=document.getElementById('quick-cats'), fc=document.getElementById('feat-cats')
  if(qc) qc.innerHTML=featured.map(f=>`<div class="qcat" onclick="scrollToCat('${f.cat}')">
    <div class="qcat-ic">${f.icon}</div>
    <div><div class="qcat-tt">${esc(f.label)}</div><div class="qcat-ds">${esc(f.desc)}</div></div>
  </div>`).join('')
  if(fc) fc.innerHTML=featured.map(f=>{
    const n=menu.filter(i=>i.cat===f.cat).length
    return `<div class="feat-card" onclick="scrollToCat('${f.cat}')">
      <div class="feat-img"><img src="${esc(f.img)}" alt="${esc(f.label)}" loading="lazy"/></div>
      <div class="feat-bd"><div class="feat-tt">${esc(f.label)}</div><div class="feat-ct">${n} ${n===1?t('item'):t('items')}</div></div>
    </div>`
  }).join('')
}
function goToMenu(){
  const el=document.getElementById('menu-full'); if(!el) return
  const off=(document.getElementById('navbar')?.offsetHeight||0)+10
  window.scrollTo({top:el.offsetTop-off,behavior:'smooth'})
}

/* ── INIT ── */
try{const stored=JSON.parse(localStorage.getItem('btMenuCustom')||'null');if(stored&&stored.length)menu=stored}catch(e){}
renderCategories(menu)
renderLanding()
applyTr()

/* ── Atualiza cardápio quando admin altera produtos em outra aba ── */
window.addEventListener('storage', function(e) {
  if (e.key === 'btMenuCustom') {
    try{const nv=JSON.parse(e.newValue||'null');if(nv&&nv.length)menu=nv}catch(err){}
    renderCategories(menu)
    renderLanding()
    applyTr()
  }
})
