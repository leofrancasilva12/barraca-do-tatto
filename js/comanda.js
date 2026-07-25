    // ── THEME SYSTEM ──
    function toggleTheme() {
      const isDark = document.documentElement.dataset.theme === 'dark';
      if (isDark) { delete document.documentElement.dataset.theme; localStorage.setItem('btTheme', 'light') }
      else { document.documentElement.dataset.theme = 'dark'; localStorage.setItem('btTheme', 'dark') }
      updateThemeBtn();
    }
    function updateThemeBtn() {
      const isDark = document.documentElement.dataset.theme === 'dark';
      document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
      document.getElementById('theme-label').textContent = isDark ? 'Claro' : 'Escuro';
    }
    (function () { if (localStorage.getItem('btTheme') === 'dark') { document.documentElement.dataset.theme = 'dark'; updateThemeBtn() } })();

    const PIX_KEY = 'leofrancasilva13@gmail.com'
    const PIX_NAME = 'Leonardo Franca Silva'
    const PIX_CITY = 'Salvador'

    /* ── Gerador de Payload PIX EMV/BR Code ── */
    function pixPayload(valor) {
      const f = (id, val) => id + String(val.length).padStart(2, '0') + val
      const merchant = f('00', 'br.gov.bcb.pix') + f('01', PIX_KEY)
      const txid = 'BT' + Date.now().toString(36).toUpperCase()
      const addData = f('05', txid.slice(0, 25))
      let payload = f('00', '01')
        + f('01', '12')
        + f('26', merchant)
        + f('52', '0000')
        + f('53', '986')
        + (valor > 0 ? f('54', valor.toFixed(2)) : '')
        + f('58', 'BR')
        + f('59', PIX_NAME.slice(0, 25))
        + f('60', PIX_CITY.slice(0, 15))
        + f('62', addData)
      payload += '6304'
      // CRC16-CCITT
      let crc = 0xFFFF
      for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8
        for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
        crc &= 0xFFFF
      }
      return payload + crc.toString(16).toUpperCase().padStart(4, '0')
    }
    /* ── MENU DATA ── */
    const menu = [
      { id: 1, name: 'Carne do Sol c/ Farofa e Salada', price: 48, cat: 'entradas', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=60' },
      { id: 2, name: 'Carne do Sol c/ Fritas ou Aipim', price: 58, cat: 'entradas', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=60' },
      { id: 3, name: 'Filé c/ Fritas', price: 69, cat: 'entradas', img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=200&q=60' },
      { id: 4, name: 'Calabresa Acebolada', price: 45, cat: 'entradas', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200&q=60' },
      { id: 5, name: 'Calabresa c/ Fritas ou Aipim', price: 49, cat: 'entradas', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200&q=60' },
      { id: 6, name: 'Porção de Batata ou Aipim', price: 27, cat: 'entradas', img: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&q=60' },
      { id: 7, name: 'Camarão Alho e Óleo', price: 62, cat: 'entradas', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=200&q=60' },
      { id: 8, name: 'Camarão à Milanesa', price: 59, cat: 'entradas', img: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=200&q=60' },
      { id: 9, name: 'Camarão s/ Casca c/ Farofa e Salada', price: 72, cat: 'entradas', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=60' },
      { id: 10, name: 'Casquinha de Siri', price: 32, cat: 'entradas', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60' },
      { id: 11, name: 'Isca de Peixe c/ Fritas ou Aipim', price: 58, cat: 'entradas', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 12, name: 'Isca de Peixe c/ Farofa e Salada', price: 49, cat: 'entradas', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 13, name: 'Isca de Frango c/ Fritas ou Aipim', price: 52, cat: 'entradas', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=60' },
      { id: 14, name: 'Isca de Frango c/ Farofa e Salada', price: 49, cat: 'entradas', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=60' },
      { id: 15, name: 'Agulhinha c/ Farofa e Salada', price: 45, cat: 'entradas', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 16, name: 'Pitinga c/ Farofa e Salada', price: 45, cat: 'entradas', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60' },
      { id: 17, name: 'Lambreta Grande (12 und)', price: 32, cat: 'entradas', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=60' },
      { id: 18, name: 'Lambreta Dobrada', price: 46, cat: 'entradas', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=60' },
      { id: 19, name: 'Caranguejo (unidade)', price: 10, cat: 'entradas', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&q=60' },
      { id: 20, name: 'Bolinho', price: 33, cat: 'entradas', img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=200&q=60' },
      { id: 21, name: 'Caldo (Camarão, Sururu, Polvo...)', price: 28, cat: 'entradas', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&q=60' },
      { id: 22, name: 'Frango a Passarinho 1kg', price: 55, cat: 'entradas', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=60' },
      { id: 23, name: 'Frango c/ Batata ou Aipim', price: 55, cat: 'entradas', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=60' },
      { id: 24, name: 'Peixe em Posta', price: 107, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 25, name: 'Peixe Frito Pequeno', price: 81, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 26, name: 'Peixe Frito Médio', price: 96, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 27, name: 'Peixe Frito Grande', price: 121, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 28, name: 'Peixe Frito Família', price: 146, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 29, name: 'Peixe Super Família (1500g)', price: 187, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 30, name: 'Moqueca de Peixe', price: 129.90, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&q=60' },
      { id: 31, name: 'Moqueca de Camarão', price: 139.90, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&q=60' },
      { id: 32, name: 'Moqueca Mista', price: 148, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&q=60' },
      { id: 33, name: 'Arrumadinho', price: 59, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=60' },
      { id: 34, name: 'Mariscada', price: 162, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=60' },
      { id: 35, name: 'Lagosta 1kg', price: 179, cat: 'refeicoes', img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=200&q=60' },
      { id: 36, name: 'Arroz', price: 12, cat: 'extras', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200&q=60' },
      { id: 37, name: 'Feijão', price: 12, cat: 'extras', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&q=60' },
      { id: 38, name: 'Farofa', price: 12, cat: 'extras', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60' },
      { id: 39, name: 'Salada', price: 12, cat: 'extras', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60' },
      { id: 40, name: 'Água sem Gás 500ml', price: 4, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=60' },
      { id: 41, name: 'Água com Gás 500ml', price: 6, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=60' },
      { id: 42, name: 'Água de Coco', price: 7, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=60' },
      { id: 43, name: 'Água Tônica Lata', price: 8, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&q=60' },
      { id: 44, name: 'H2OH Lata', price: 7, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&q=60' },
      { id: 45, name: 'Refrigerante Lata', price: 7, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&q=60' },
      { id: 46, name: 'Energético', price: 15, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=200&q=60' },
      { id: 47, name: 'Smirnoff Ice', price: 12, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200&q=60' },
      { id: 48, name: 'Suco de Frutas 400ml', price: 10, cat: 'bebidas', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&q=60' },
      { id: 49, name: 'Heineken 600ml', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200&q=60' },
      { id: 50, name: 'Brahma Duplo Malte 600ml', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=60' },
      { id: 51, name: 'Amstel 600ml', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=60' },
      { id: 52, name: 'Devassa 600ml', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=60' },
      { id: 53, name: 'Original 600ml', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=60' },
      { id: 54, name: 'Heineken Long Neck', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200&q=60' },
      { id: 55, name: 'Heineken 0% Álcool', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=200&q=60' },
      { id: 56, name: 'Malzebier Long Neck', price: null, cat: 'cervejas', img: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&q=60' },
      { id: 57, name: 'Caipiroska de Slova 400ml', price: 13, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 58, name: 'Caipiroska 400ml', price: 13, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 59, name: 'Caipiroska Dobrada 400ml', price: 20, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 60, name: 'Caipiroska Smirnoff/Orloff', price: 17, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 61, name: 'Roska Kiwi ou Morango', price: 15, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 62, name: 'Caipiroska de Absolut', price: 25, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 63, name: 'Cocoroska 400ml', price: 25, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 64, name: 'Espanhola 400ml', price: 18, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 65, name: 'Gin com Pitaia', price: 29.90, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 66, name: 'Pinacolada', price: 24.99, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 67, name: 'Sex on the Pier', price: 21.99, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 68, name: 'Gamboa Summer', price: 21.99, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 69, name: 'Lost Beach', price: 21.99, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 70, name: 'Um Gin pra Chamar de Meu', price: 24, cat: 'drinks', img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&q=60' },
      { id: 71, name: 'Lagoa Azul', price: 24, cat: 'drinks', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=60' },
      { id: 72, name: 'Old Parr', price: 20, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
      { id: 73, name: 'Red Label', price: 15, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
      { id: 74, name: 'Vodka Absolut', price: 14, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
      { id: 75, name: 'Gin YVY', price: 15, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
      { id: 76, name: 'Vodka Smirnoff', price: 10, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
      { id: 77, name: 'Campari', price: 10, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
      { id: 78, name: 'Pitú', price: 7, cat: 'doses', img: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&q=60' },
    ]

    const catNames = { entradas: '🦐 Entradas', refeicoes: '🍽️ Refeições', extras: '🍚 Extras', bebidas: '🥤 Bebidas', cervejas: '🍺 Cervejas', drinks: '🍹 Drinks', doses: '🥃 Doses' }
    const catOrder = ['entradas', 'refeicoes', 'extras', 'bebidas', 'cervejas', 'drinks', 'doses']
    const fmtP = p => p != null ? 'R$ ' + p.toFixed(2).replace('.', ',') : 'A consultar'
    const now = () => new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
    function esc(s) { if (!s) return ''; return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;') }

    function loadComandas() { try { return JSON.parse(localStorage.getItem('btComandas') || '[]') } catch (e) { return [] } }
    function saveComandas(c) { localStorage.setItem('btComandas', JSON.stringify(c)); window.dispatchEvent(new Event('storage')) }

    let currentFilter = 'all', addingTo = null, pixComandaId = null

    function filterStatus(s) {
      currentFilter = s
      document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.f === s))
      renderComandas()
    }

    function renderComandas() {
      const all = loadComandas()
      const mf = document.getElementById('mesa-filter').value
      const garcomSearch = (document.getElementById('search-garcom')?.value || '').toLowerCase()
      let list = all
      if (mf !== 'all') list = list.filter(c => c.mesa === mf)
      if (garcomSearch) list = list.filter(c => (c.atendente || '').toLowerCase().includes(garcomSearch))
      if (currentFilter !== 'all') list = list.filter(c => c.status === currentFilter)
      const order = { aberta: 0, fechada: 1, paga: 2 }
      list.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9))

      const mesas = [...new Set(all.map(c => c.mesa))].sort()
      const sel = document.getElementById('mesa-filter')
      const val = sel.value
      sel.innerHTML = '<option value="all">Todos</option>' + mesas.map(m => `<option value="${m}"${m === val ? ' selected' : ''}>Sombreiro ${m}</option>`).join('')

      // Update chip counts
      const cntAbertas = all.filter(c => c.status === 'aberta').length
      const cntFechadas = all.filter(c => c.status === 'fechada').length
      const cntPagas = all.filter(c => c.status === 'paga').length
      document.querySelector('.chip.all').innerHTML = '📋 Todas (' + all.length + ')'
      document.querySelector('.chip.aberta').innerHTML = '🟢 Abertas (' + cntAbertas + ')'
      document.querySelector('.chip.fechada').innerHTML = '🟠 Fechadas (' + cntFechadas + ')'
      document.querySelector('.chip.paga').innerHTML = '✅ Pagas (' + cntPagas + ')'

      const grid = document.getElementById('comandas-grid')
      if (!list.length) {
        grid.innerHTML = `<div class="empty"><div class="icon">🧾</div><h3>Nenhuma comanda${currentFilter !== 'all' ? ' com esse status' : ''}</h3><p>Clique em "Nova Comanda"</p></div>`
        return
      }

      grid.innerHTML = list.map(c => {
        const total = c.items.filter(i => i.price != null).reduce((s, i) => s + i.price * i.qty, 0)
        const hc = c.items.some(i => i.price == null)
        const ts = fmtP(total) + (hc ? ' + consultar' : '')
        const qi = c.items.reduce((s, i) => s + i.qty, 0)
        const open = c.status === 'aberta'

        let acts = ''
        if (open) {
          acts = `<button class="abtn abtn-add" onclick="openAddItem('${c.id}')"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Item</button>
        <button class="abtn abtn-close" onclick="fecharComanda('${c.id}')"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Fechar</button>
        <button class="abtn abtn-del" onclick="excluirComanda('${c.id}')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>`
        } else if (c.status === 'fechada') {
          acts = `<button class="abtn abtn-pay" onclick="pagarComanda('${c.id}')"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Pagar</button>
        <button class="abtn abtn-reopen" onclick="reabrirComanda('${c.id}')"><svg viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> Reabrir</button>
        <button class="abtn abtn-print" onclick="imprimirComanda('${c.id}')"><svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print</button>`
        } else {
          acts = `<button class="abtn abtn-print" onclick="imprimirComanda('${c.id}')"><svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Print</button>
        <button class="abtn abtn-del" onclick="excluirComanda('${c.id}')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>`
        }

        const itemsH = c.items.map(i => {
          const eb = open ? `<div class="item-btns">
        <button class="ibtn ibtn-minus" onclick="chgQty('${c.id}',${i.id},-1)"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <button class="ibtn ibtn-plus" onclick="chgQty('${c.id}',${i.id},1)"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <button class="ibtn ibtn-del" onclick="rmItem('${c.id}',${i.id})"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg></button>
      </div>`: ''
          return `<div class="c-item"><span class="c-item-name">${esc(i.name)}</span><span class="c-item-qty">x${i.qty}</span><span class="c-item-price">${i.price != null ? fmtP(i.price * i.qty) : 'Consultar'}</span>${eb}</div>`
        }).join('')

        return `<div class="card ${c.status}">
      <div class="card-head">
        <div class="card-mesa"><div class="mesa-num">${esc(c.mesa)}</div><div class="mesa-info"><h3>Sombreiro ${esc(c.mesa)}</h3><span>${esc(c.abertura)} · ${qi} ${qi === 1 ? 'item' : 'itens'}</span></div></div>
        <span class="status-tag st-${c.status}">${c.status === 'aberta' ? '🟢 Aberta' : c.status === 'fechada' ? '🟠 Fechada' : '✅ Paga' + (c.formaPagamento ? ' (' + ({ pix: 'PIX', debito: 'Débito', credito: 'Crédito' }[c.formaPagamento] || c.formaPagamento) + ')' : '')}</span>
      </div>
      <div class="card-body">
        ${c.atendente || c.cliente ? `<div class="card-client">${c.atendente ? '🏷️ <strong>' + esc(c.atendente) + '</strong>' : ''}${c.cliente ? ' · 👤 ' + esc(c.cliente) : ''}</div>` : ''}
        <div class="card-items">${itemsH}${!c.items.length ? '<div style="text-align:center;padding:10px;color:var(--sub);font-size:11px">Sem itens</div>' : ''}</div>
        ${c.obs ? `<div class="card-obs"><strong>📝</strong> ${esc(c.obs)}</div>` : ''}
      </div>
      <div class="card-foot"><div class="card-total">${ts}</div><div class="card-actions">${acts}</div></div>
    </div>`
      }).join('')
    }

    /* ── ACTIONS ── */
    function criarComanda() {
      const atendente = document.getElementById('inp-atendente').value.trim()
      const mesa = document.getElementById('inp-mesa').value.trim()
      document.getElementById('inp-atendente').style.borderColor = ''
      document.getElementById('inp-mesa').style.borderColor = ''
      if (!atendente) { document.getElementById('inp-atendente').style.borderColor = 'var(--red)'; return }
      if (!mesa) { document.getElementById('inp-mesa').style.borderColor = 'var(--red)'; return }
      const c = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), mesa, cliente: document.getElementById('inp-client').value.trim(), atendente, pessoas: null, items: [], obs: '', status: 'aberta', abertura: now(), fechamento: null, pagamento: null }
      const all = loadComandas(); all.push(c); saveComandas(all)
      closeNovaMesa();['inp-mesa', 'inp-client', 'inp-atendente'].forEach(id => document.getElementById(id).value = '')
      renderComandas()
    }

    function addItemToComanda(mid) {
      const item = menu.find(i => i.id === mid); if (!item || !addingTo) return
      const all = loadComandas(), c = all.find(x => x.id === addingTo); if (!c) return
      const ex = c.items.find(i => i.id === mid); if (ex) ex.qty++; else c.items.push({ id: item.id, name: item.name, price: item.price, qty: 1 })
      saveComandas(all); renderComandas()
    }
    function chgQty(cid, iid, d) { const all = loadComandas(), c = all.find(x => x.id === cid); if (!c) return; const it = c.items.find(i => i.id === iid); if (!it) return; it.qty += d; if (it.qty <= 0) c.items = c.items.filter(i => i.id !== iid); saveComandas(all); renderComandas() }
    function rmItem(cid, iid) { const all = loadComandas(), c = all.find(x => x.id === cid); if (!c) return; c.items = c.items.filter(i => i.id !== iid); saveComandas(all); renderComandas() }

    function fecharComanda(id) {
      const all = loadComandas(), c = all.find(x => x.id === id); if (!c) return
      const total = c.items.filter(i => i.price != null).reduce((s, i) => s + i.price * i.qty, 0)
      pixComandaId = id
      document.getElementById('pay-mesa-title').textContent = `Sombreiro ${c.mesa}${c.cliente ? ' · ' + c.cliente : ''}`
      document.getElementById('pay-total-val').textContent = fmtP(total)
      document.getElementById('pay-methods').style.display = 'flex'
      document.getElementById('pix-detail').style.display = 'none'
      document.getElementById('card-detail').style.display = 'none'
      // PIX setup com payload EMV real
      const pixCode = pixPayload(total)
      document.getElementById('pix-qr-wrap').innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(pixCode)}" alt="QR PIX" width="180" height="180"/>`
      document.getElementById('pix-qr-wrap').dataset.pixCode = pixCode
      document.getElementById('btn-pay-confirm').onclick = () => { confirmPayment(id, 'pix') }
      document.getElementById('modal-pay').classList.add('open')
    }
    function selectPayMethod(method) {
      document.getElementById('pay-methods').style.display = 'none'
      if (method === 'pix') {
        document.getElementById('pix-detail').style.display = 'block'
      } else {
        document.getElementById('card-detail').style.display = 'block'
        document.getElementById('card-method-label').textContent = method === 'debito' ? 'Pagamento no Débito' : 'Pagamento no Crédito'
        document.getElementById('btn-card-confirm').onclick = () => { confirmPayment(pixComandaId, method) }
      }
    }
    function backToMethods() {
      document.getElementById('pix-detail').style.display = 'none'
      document.getElementById('card-detail').style.display = 'none'
      document.getElementById('pay-methods').style.display = 'flex'
    }
    function confirmPayment(id, method) {
      const all = loadComandas(), c = all.find(x => x.id === id); if (!c) return
      c.status = 'paga'; c.pagamento = now(); c.formaPagamento = method
      saveComandas(all); closePayModal(); renderComandas()
    }
    function copyPixKey() {
      const code = document.getElementById('pix-qr-wrap').dataset.pixCode || PIX_KEY
      navigator.clipboard.writeText(code).then(() => { const b = document.querySelector('.btn-copy'); b.textContent = '✅ Copiado!'; setTimeout(() => b.textContent = '📋 Copiar Copia e Cola', 2000) }).catch(() => { prompt('Copie o código PIX:', code) })
    }
    function closePayModal() { document.getElementById('modal-pay').classList.remove('open'); pixComandaId = null }
    function pagarComanda(id) { fecharComanda(id) }
    function reabrirComanda(id) { const all = loadComandas(), c = all.find(x => x.id === id); if (c) { c.status = 'aberta'; c.fechamento = null; saveComandas(all); renderComandas() } }
    function excluirComanda(id) { if (!confirm('Excluir permanentemente?')) return; let all = loadComandas(); all = all.filter(c => c.id !== id); saveComandas(all); renderComandas() }
    function imprimirComanda(id) {
      const all = loadComandas(), c = all.find(x => x.id === id); if (!c) return
      const total = c.items.filter(i => i.price != null).reduce((s, i) => s + i.price * i.qty, 0)
      const w = window.open('', '_blank', 'width=320,height=500')
      if (!w) { alert('Popup bloqueado. Permita popups para imprimir.'); return }
      w.document.write(`<html><head><title>Mesa ${esc(c.mesa)}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:monospace;font-size:12px;padding:10px;width:280px}h2{text-align:center;margin-bottom:8px}hr{border:none;border-top:1px dashed #999;margin:6px 0}.row{display:flex;justify-content:space-between;padding:2px 0}.total{font-weight:bold;font-size:14px}</style></head><body><h2>🌴 Buteco do Tatto</h2><p style="text-align:center;font-size:10px">Stella Mares — Salvador</p><hr><div class="row"><b>Mesa: ${esc(c.mesa)}</b><span>${esc(c.abertura)}</span></div>${c.cliente ? '<div>Cliente: ' + esc(c.cliente) + '</div>' : ''}${c.atendente ? '<div>Atendente: ' + esc(c.atendente) + '</div>' : ''}<hr>${c.items.map(i => `<div class="row"><span>${esc(i.name)} x${i.qty}</span><span>${i.price != null ? fmtP(i.price * i.qty) : 'Consultar'}</span></div>`).join('')}<hr><div class="row total"><span>TOTAL</span><span>${fmtP(total)}</span></div><hr><p style="text-align:center;font-size:9px;margin-top:6px">Obrigado! 🌴</p><script>setTimeout(()=>window.print(),300)<\/script></body></html>`)
    }

    /* ── MODALS ── */
    function openNovaMesa() { document.getElementById('modal-nova').classList.add('open'); document.getElementById('inp-atendente').focus() }
    function closeNovaMesa() { document.getElementById('modal-nova').classList.remove('open') }
    function openAddItem(cid) { addingTo = cid; const c = loadComandas().find(x => x.id === cid); document.getElementById('add-title').textContent = `➕ Mesa ${c?.mesa || ''}`; document.getElementById('add-search').value = ''; document.getElementById('modal-add').classList.add('open'); renderMenuList(); document.getElementById('add-search').focus() }
    function closeAddItem() { document.getElementById('modal-add').classList.remove('open'); addingTo = null }

    function renderMenuList() {
      const q = document.getElementById('add-search').value.toLowerCase().trim()
      const f = q ? menu.filter(i => i.name.toLowerCase().includes(q)) : menu
      const el = document.getElementById('menu-list')
      el.innerHTML = catOrder.map(cat => { const items = f.filter(i => i.cat === cat); if (!items.length) return ''; return `<div class="cat-sec"><div class="cat-lbl">${catNames[cat]}</div>${items.map(i => `<div class="mi"><img class="mi-img" src="${esc(i.img)}" alt="${esc(i.name)}" loading="lazy"/><div class="mi-info"><div class="mi-name">${esc(i.name)}</div><div class="mi-price">${fmtP(i.price)}</div></div><button class="mi-add" onclick="addItemToComanda(${i.id})"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div>`).join('')}</div>` }).join('')
      if (!f.length) el.innerHTML = '<div style="text-align:center;padding:30px;color:var(--sub)">🔍 Nada encontrado</div>'
    }

    /* ── CALCULATOR ── */
    let calcStr = '0'
    function toggleCalc() { document.getElementById('modal-calc').classList.toggle('open') }
    function calcInput(v) { if (calcStr === '0' && !isNaN(v)) calcStr = v; else calcStr += v; document.getElementById('calc-display').textContent = calcStr }
    function calcClear() { calcStr = '0'; document.getElementById('calc-display').textContent = '0' }
    function calcEqual() { try { if (/[^0-9+\-*/.() ]/.test(calcStr)) throw 'invalid'; calcStr = String(Function('"use strict";return (' + calcStr + ')')()); document.getElementById('calc-display').textContent = calcStr } catch (e) { document.getElementById('calc-display').textContent = 'Erro'; calcStr = '0' } }

    /* ── KEYBOARD ── */
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeNovaMesa(); closeAddItem(); closePayModal(); document.getElementById('modal-calc').classList.remove('open') } })
    window.addEventListener('storage', () => renderComandas())
    renderComandas()
  
