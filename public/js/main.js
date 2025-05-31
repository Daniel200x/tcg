// Datos de ejemplo (luego puedes reemplazar con la API de Pokémon TCG)
const products = [
    {
      id: 1,
      name: "Booster Pack Scarlet & Violet",
      price: 4.99,
      image: "https://images.pokemontcg.io/sv1/1_hires.png",
      expansion: "Scarlet & Violet"
    },
    {
      id: 2,
      name: "Booster Pack Obsidian Flames",
      price: 5.99,
      image: "https://images.pokemontcg.io/sv3/1_hires.png",
      expansion: "Obsidian Flames"
    },
    {
      id: 3,
      name: "Elite Trainer Box Paldea Evolved",
      price: 49.99,
      image: "https://images.pokemontcg.io/sv2/1_hires.png",
      expansion: "Paldea Evolved"
    }
  ];
  
  // Función para renderizar productos
  function renderProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
  
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.expansion}</p>
        <p>$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Añadir al carrito</button>
      `;
      productsContainer.appendChild(productCard);
    });
  }
  
  // Función para añadir al carrito (simplificada)
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Añadido al carrito: ${product.name}`);
    // Aquí luego guardarás en localStorage o un array.
  }
  
  // Inicializar la página
  document.addEventListener('DOMContentLoaded', renderProducts);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  cartCount.textContent = cart.length;
}

// Actualizar contador al cargar la página
updateCartCount();