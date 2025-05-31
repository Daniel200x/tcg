// Configuración de la API
const API_URL = 'https://api.pokemontcg.io/v2/cards';
const API_KEY = 'tu-api-key-aquí'; // ¡Reemplaza esto con tu API Key real!

// Elementos del DOM
const productsContainer = document.getElementById('products');
const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');
const setFilter = document.getElementById('set-filter');

// Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch de cartas con filtros
async function fetchPokemonCards() {
  const type = typeFilter?.value || '';
  const set = setFilter?.value || '';
  const query = searchInput?.value || '';

  let apiQuery = [];
  if (type) apiQuery.push(`types:${type}`);
  if (set) apiQuery.push(`set.name:${set}*`);
  if (query) apiQuery.push(`name:${query}*`);

  try {
    const response = await fetch(`${API_URL}?q=${apiQuery.join(' ')}&pageSize=20`, {
      headers: {
        'X-Api-Key': API_KEY
      }
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

  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'product-card';
    cardElement.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}" loading="lazy">
      <h3>${card.name}</h3>
      <p>${card.set.name}</p>
      <p>$${(card.cardmarket?.prices?.averageSellPrice || 5.99).toFixed(2)}</p>
      <button onclick="addToCart('${card.id}')">Añadir al carrito</button>
      <a href="card-detail.html?id=${card.id}" class="detail-link">Ver detalles</a>
    `;
    productsContainer.appendChild(cardElement);
  });
}

// Añadir al carrito
function addToCart(cardId) {
  const existingItem = cart.find(item => item.id === cardId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: cardId, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('¡Carta añadida al carrito!');
}

// Actualizar contador del carrito
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Event Listeners
if (searchInput) {
  searchInput.addEventListener('input', renderCards);
}

if (typeFilter) {
  typeFilter.addEventListener('change', renderCards);
}

if (setFilter) {
  setFilter.addEventListener('change', renderCards);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  updateCartCount();
  
  // Cargar filtros guardados (opcional)
  if (localStorage.getItem('filter-type')) {
    typeFilter.value = localStorage.getItem('filter-type');
  }
});

// Guardar filtros al cambiar (opcional)
if (typeFilter) {
  typeFilter.addEventListener('change', (e) => {
    localStorage.setItem('filter-type', e.target.value);
  });
}
function setupCardDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const cardId = urlParams.get('id');
  
  if (cardId) {
    fetch(`${API_URL}/${cardId}`, {
      headers: { 'X-Api-Key': API_KEY }
    })
      .then(res => res.json())
      .then(({ data }) => {
        document.getElementById('card-detail').innerHTML = `
          <img src="${data.images.large}" alt="${data.name}">
          <h2>${data.name}</h2>
          <p><strong>Expansión:</strong> ${data.set.name}</p>
          <p><strong>Precio:</strong> $${(data.cardmarket?.prices?.averageSellPrice || 'N/A')}</p>
          <button onclick="addToCart('${data.id}')">Comprar</button>
        `;
      });
  }
}