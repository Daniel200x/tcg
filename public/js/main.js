// Configuración de la API
const API_URL = 'https://api.pokemontcg.io/v2/cards';
const API_KEY = 'd5a450b9-62a9-472d-aeb1-b40a6c53df5a'; // 🔒 Reemplaza con tu API Key

// Elementos del DOM
const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search-input');

// Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch de cartas por nombre
async function fetchPokemonCards() {
  const query = searchInput?.value.trim() || '';

  try {
    const response = await fetch(`${API_URL}?q=name:${query}*&pageSize=30`, {
      headers: { 'X-Api-Key': API_KEY }
    });
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching cards:', error);
    return [];
  }
}

// Renderizar cartas
async function renderCards() {
  const cards = await fetchPokemonCards();
  productsContainer.innerHTML = '';

  if (cards.length === 0) {
    productsContainer.innerHTML = '<p class="no-results">No se encontraron cartas. ¡Prueba otro nombre!</p>';
    return;
  }

  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'product-card';
    cardElement.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}" loading="lazy">
      <h3>${card.name}</h3>
      <p><strong>Expansión:</strong> ${card.set.name}</p>
      <p><strong>Precio:</strong> $${(card.cardmarket?.prices?.averageSellPrice || 'N/A')}</p>
      <button onclick="addToCart('${card.id}', '${card.name}')">Añadir al carrito</button>
    `;
    productsContainer.appendChild(cardElement);
  });
}

// Añadir al carrito
function addToCart(cardId, cardName) {
  const existingItem = cart.find(item => item.id === cardId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: cardId, name: cardName, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Notificación
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = `¡${cardName} añadida al carrito!`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Actualizar contador del carrito
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Evento de búsqueda
if (searchInput) {
  searchInput.addEventListener('input', renderCards);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  updateCartCount();
});