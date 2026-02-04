// Sistema de Carrinho de Compras

let carrinho = [];

// Carregar carrinho do localStorage na inicialização
function carregarCarrinho() {
  const saved = localStorage.getItem('carrinho');
  if (saved) {
    carrinho = JSON.parse(saved);
    atualizarCarrinho();
  }
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Adicionar produto ao carrinho
function adicionarCarrinho(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: nome,
      preco: preco,
      quantidade: 1
    });
  }
  
  salvarCarrinho();
  atualizarCarrinho();
  
  // Mostrar notificação
  mostrarNotificacao(`${nome} adicionado ao carrinho!`);
}

// Remover item do carrinho
function removerCarrinho(nome) {
  carrinho = carrinho.filter(item => item.nome !== nome);
  salvarCarrinho();
  atualizarCarrinho();
}

// Aumentar quantidade
function aumentarQuantidade(nome) {
  const item = carrinho.find(i => i.nome === nome);
  if (item) {
    item.quantidade += 1;
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Diminuir quantidade
function diminuirQuantidade(nome) {
  const item = carrinho.find(i => i.nome === nome);
  if (item) {
    if (item.quantidade > 1) {
      item.quantidade -= 1;
    } else {
      removerCarrinho(nome);
      return;
    }
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Limpar carrinho
function limparCarrinho() {
  if (confirm('Deseja realmente limpar o carrinho?')) {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Atualizar exibição do carrinho
function atualizarCarrinho() {
  const cartCount = document.getElementById('cartCount');
  const carrinhoItems = document.getElementById('carrinho-items');
  const totalPreco = document.getElementById('totalPreco');
  
  // Atualizar contador
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  cartCount.textContent = totalItens;
  
  // Atualizar items
  if (carrinho.length === 0) {
    carrinhoItems.innerHTML = '<div class="cart-item empty">Carrinho vazio 🛒</div>';
    totalPreco.textContent = '0.00';
  } else {
    carrinhoItems.innerHTML = carrinho.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.nome}</div>
          <div class="cart-item-price">${item.preco === 0 ? 'Grátis' : 'R$ ' + item.preco.toFixed(2)}</div>
        </div>
        <div class="cart-item-actions">
          <button class="quantity-btn" onclick="diminuirQuantidade('${item.nome}')">-</button>
          <span class="quantity-display">${item.quantidade}</span>
          <button class="quantity-btn" onclick="aumentarQuantidade('${item.nome}')">+</button>
          <button class="remove-btn" onclick="removerCarrinho('${item.nome}')">Remover</button>
        </div>
      </div>
    `).join('');
    
    // Calcular total
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    totalPreco.textContent = total.toFixed(2);
  }
}

// Alternar carrinho modal
function toggleCarrinho() {
  const modal = document.getElementById('carrinho-modal');
  modal.classList.toggle('hidden');
}

// Fechar carrinho ao clicar fora
document.addEventListener('click', function(event) {
  const modal = document.getElementById('carrinho-modal');
  if (modal && !modal.classList.contains('hidden')) {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  }
});

// Finalizar compra
function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const resumo = carrinho.map(item => `${item.nome} x${item.quantidade}`).join('\n');
  
  alert(`Obrigado pela compra! 🎉\n\nResumo:\n${resumo}\n\nTotal: R$ ${total.toFixed(2)}\n\nSua compra será processada em breve!`);
  
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  toggleCarrinho();
}

// Mostrar notificação
function mostrarNotificacao(mensagem) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--secondary-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    z-index: 2000;
    animation: slideInRight 0.3s ease;
    font-weight: bold;
  `;
  notif.textContent = mensagem;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Adicionar CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Inicializar carrinho ao carregar a página
carregarCarrinho();
