// Variables globales
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const products = [
    {
        id: 'cajas-elite',
        title: 'Caja Elite de Entrenador',
        price: 49.99,
        image: 'images/cajas-elite.webp',
        description: 'La Caja Elite de Entrenador incluye 6 sobres de cartas, 1 carta promocional exclusiva, 65 protectores de cartas y accesorios para jugadores competitivos. Perfecta para quienes buscan mejorar su juego.',
        category: 'categorias/cajas-elite.html'
    },
    {
        id: 'cajas-sobres',
        title: 'Caja de 36 Sobres',
        price: 129.99,
        image: 'images/cajas-sobres.webp',
        description: 'Caja sellada oficial que contiene 36 sobres de cartas Pokémon de la última expansión. Ideal para coleccionistas y jugadores que quieren asegurarse cartas de todas las rarezas.',
        category: 'categorias/cajas-sobres.html'
    },
    {
        id: 'sobres-mejora',
        title: 'Sobre de Mejora Especial',
        price: 9.99,
        image: 'images/sobres-mejora.webp',
        description: 'Sobre especial que garantiza al menos 3 cartas holográficas o de mayor rareza. Incluye 10 cartas en total, con posibilidad de encontrar cartas ultra raras.',
        category: 'categorias/sobres-mejora.html'
    },
    {
        id: 'cajas-coleccion',
        title: 'Caja Colección Especial',
        price: 79.99,
        image: 'images/cajas-coleccion.webp',
        description: 'Caja temática de colección que incluye 4 sobres exclusivos, 1 carta promocional gigante, 1 figura y un libro de arte. Edición limitada con contenido único.',
        category: 'categorias/cajas-coleccion.html'
    },
    {
        id: 'cartas-gradeadas',
        title: 'Carta Charizard Gradeada 10',
        price: 499.99,
        image: 'images/cartas-gradeadas.webp',
        description: 'Carta Charizard holográfica en perfecto estado, certificada con grado 10 por PSA. Incluye estuche de protección premium y certificado de autenticidad.',
        category: 'categorias/cartas-gradeadas.html'
    },
    {
        id: 'album-fundas',
        title: 'Álbum Coleccionista Premium',
        price: 39.99,
        image: 'images/album-fundas.webp',
        description: 'Álbum de alta calidad con capacidad para 500 cartas, páginas con protectores anti-UV y fundas incluidas. Diseño exclusivo Pokémon con relieve.',
        category: 'categorias/album-fundas.html'
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de categoría
    if (document.querySelector('.category-title')) {
        initCategoryPage();
    }
    
    // Verificar si estamos en la página de producto
    if (document.querySelector('.product-page')) {
        initProductPage();
    }
    
    // Funciones comunes a todas las páginas
    setupCart();
    setupSearch();
    initAnimations();
    
    // Actualizar contador del carrito al cargar
    updateCartCount();
});

// Configurar página de categoría
function initCategoryPage() {
    // Animación para las tarjetas de producto
    animateProductCards();
    
    // Configurar botones "Añadir al carrito"
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product');
                addToCart(productId);
                
                // Efecto visual
                e.target.textContent = '✓ Añadido';
                setTimeout(() => {
                    e.target.textContent = 'Añadir al carrito';
                }, 2000);
            }
        });
    });
}

// Configurar página de producto
function initProductPage() {
    // Selector de cantidad
    const quantityInput = document.getElementById('productQuantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const addToCartBtn = document.querySelector('.add-to-cart-modal');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
    
    // Cambiar imagen principal al hacer clic en miniaturas
    document.querySelectorAll('.thumbnail-gallery .img-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            const mainImg = document.querySelector('.main-image img');
            mainImg.src = this.src;
            mainImg.alt = this.alt;
        });
    });
    
    // Añadir al carrito desde página de producto
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            const quantity = parseInt(quantityInput.value);
            
            if (productId) {
                addToCart(productId, quantity);
                
                // Efecto visual
                this.textContent = '✓ Añadido';
                setTimeout(() => {
                    this.textContent = 'Añadir al carrito';
                }, 2000);
            }
        });
    }
}

// Configurar el carrito
function setupCart() {
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('open');
            updateCartDisplay();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('open');
        });
    }
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (cartSidebar && !cartSidebar.contains(e.target) && e.target !== cartIcon && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });
}

// Configurar el buscador
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            const results = products.filter(product => 
                product.title.toLowerCase().includes(query) || 
                product.description.toLowerCase().includes(query)
            );
            
            displaySearchResults(results);
        });
        
        // Ocultar resultados al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (e.target !== searchInput && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Mostrar resultados de búsqueda
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No se encontraron productos</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    searchResults.innerHTML = results.map(product => `
        <a href="${product.category}" class="search-result">
            <img src="${product.image}" alt="${product.title}" width="40">
            <div>
                <div class="search-result-title">${product.title}</div>
                <div class="search-result-price">$${product.price.toFixed(2)}</div>
            </div>
        </a>
    `).join('');
    
    searchResults.style.display = 'block';
}

// Animaciones iniciales
function initAnimations() {
    // Animación para las tarjetas de categoría en la página principal
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        categoryCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 150 * index);
        });
    }
    
    // Efecto hover para las tarjetas de categoría
    document.querySelectorAll('.col-image-wrap').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            this.style.zIndex = '10';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
}

// Animación para las tarjetas de producto en páginas de categoría
function animateProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Añadir producto al carrito
function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity,
            price: product.price,
            title: product.title,
            image: product.image
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar interfaz
    updateCartDisplay();
    updateCartCount();
    
    // Mostrar notificación
    showNotification(`${product.title} añadido al carrito`);
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar interfaz
    updateCartDisplay();
    updateCartCount();
    
    // Mostrar notificación
    showNotification('Producto eliminado del carrito');
}

// Actualizar cantidad de un producto en el carrito
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            // Guardar en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Actualizar interfaz
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Actualizar visualización del carrito
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id) || item;
        if (product) {
            total += product.price * item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${product.title}</div>
                    <div class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="quantity-selector">
                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                </div>
                <span class="remove-item" data-id="${product.id}">&times;</span>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        }
    });
    
    // Actualizar total
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    
    // Configurar eventos para los botones de cantidad y eliminar
    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

// Actualizar contador del carrito
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Manejar envío del formulario de pago
function setupCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('El carrito está vacío');
                return;
            }
            
            // Aquí iría la lógica para procesar el pago
            // Por ahora solo mostramos una notificación
            showNotification('Redirigiendo al proceso de pago...');
            
            // Limpiar carrito después del pago
            setTimeout(() => {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
                document.querySelector('.cart-sidebar').classList.remove('open');
            }, 2000);
        });
    }
}

// Inicializar el proceso de pago cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupCheckout);