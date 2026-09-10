const state = { equipment: [], filter: 'Todos', search: '' };
const $ = (selector) => document.querySelector(selector);
const API_URL = 'http://localhost:3000';
const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function loadEquipment() {
  try {
    const response = await fetch(`${API_URL}/equipamentos`);
    if (!response.ok) throw new Error('Não foi possivel consultar a API.');
    state.equipment = await response.json();
    render();
    $('#last-updated').textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch (error) { showToast(error.message, true); render(); }
}
function visibleEquipment() {
  const term = state.search.toLowerCase();
  return state.equipment.filter((item) => (state.filter === 'Todos' || item.tipo === state.filter) && (!term || item.nome.toLowerCase().includes(term) || item.tipo.toLowerCase().includes(term)));
}
function render() {
  const items = visibleEquipment();
  $('#total-value').textContent = money(state.equipment.reduce((sum, item) => sum + Number(item.valor) * Number(item.quantidade), 0));
  $('#total-items').textContent = state.equipment.length;
  $('#total-quantity').textContent = state.equipment.reduce((sum, item) => sum + Number(item.quantidade), 0).toLocaleString('pt-BR');
  $('#low-stock').textContent = state.equipment.filter((item) => Number(item.quantidade) <= 5).length;
  $('#record-count').textContent = `${items.length} ${items.length === 1 ? 'registro' : 'registros'}`;
  $('#equipment-list').innerHTML = items.map((item) => `<tr><td>${escapeHtml(item.nome)}</td><td><span class="category ${item.tipo === 'Passivo de rede' ? 'passivo' : item.tipo === 'Telefonia' ? 'telefonia' : ''}">${escapeHtml(item.tipo)}</span></td><td>${money(item.valor)}</td><td class="${Number(item.quantidade) <= 5 ? 'quantity-low' : ''}">${Number(item.quantidade).toLocaleString('pt-BR')}</td><td class="total-cell">${money(Number(item.valor) * Number(item.quantidade))}</td><td><button class="action-button" data-edit="${item.id}">Editar</button><button class="action-button delete-button" data-delete="${item.id}">Excluir</button></td></tr>`).join('');
  $('#empty-state').style.display = items.length ? 'none' : 'block';
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }
function showToast(message, isError = false) { const toast = $('#toast'); toast.textContent = message; toast.style.background = isError ? '#a9463e' : '#183b34'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
function openForm(item = null) { $('#equipment-form').reset(); $('#equipment-id').value = item?.id || ''; $('#dialog-title').textContent = item ? 'Editar equipamento' : 'Novo equipamento'; if (item) { $('#name').value = item.nome; $('#type').value = item.tipo; $('#quantity').value = item.quantidade; $('#value').value = item.valor; } $('#form-error').textContent = ''; $('#equipment-dialog').showModal(); }
$('#search').addEventListener('input', (event) => { state.search = event.target.value; render(); });
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => { document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active'); state.filter = button.dataset.filter; render(); }));
$('#new-equipment').addEventListener('click', () => openForm());
$('#close-dialog').addEventListener('click', () => $('#equipment-dialog').close());
$('#equipment-list').addEventListener('click', async (event) => { const editId = event.target.dataset.edit; const deleteId = event.target.dataset.delete; if (editId) openForm(state.equipment.find((item) => String(item.id) === editId)); if (deleteId && confirm('Excluir este equipamento?')) { const response = await fetch(`${API_URL}/equipamentos/${deleteId}`, { method: 'DELETE' }); if (response.ok) { showToast('Equipamento removido.'); await loadEquipment(); } else showToast('Nao foi possivel excluir o equipamento.', true); } });
$('#equipment-form').addEventListener('submit', async (event) => { event.preventDefault(); const id = $('#equipment-id').value; const payload = { nome: $('#name').value.trim(), tipo: $('#type').value, quantidade: Number($('#quantity').value), valor: Number($('#value').value) }; const response = await fetch(id ? `${API_URL}/equipamentos/${id}` : `${API_URL}/equipamentos`, { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) { $('#form-error').textContent = 'Nao foi possivel salvar. Verifique a conexao com o banco.'; return; } $('#equipment-dialog').close(); showToast(id ? 'Equipamento atualizado.' : 'Equipamento cadastrado.'); await loadEquipment(); });
loadEquipment();
