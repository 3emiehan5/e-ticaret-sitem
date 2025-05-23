// Sepet işlemleri
let cartItems = [];
let cartTotal = 0;

// Sepet panelini aç/kapa
function toggleCart() {
    const cartPanel = document.querySelector('.cart-panel');
    cartPanel.classList.toggle('active');
}

// Sepete ürün ekleme
function addToCart(product) {
    cartItems.push(product);
    updateCart();
    showNotification('Ürün sepete eklendi!');
    toggleCart(); // Sepeti göster
}

// Sepetten ürün çıkarma
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCart();
    showNotification('Ürün sepetten çıkarıldı!');
}

// Sepeti güncelleme
function updateCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.querySelector('.total-price');
    
    // Sepet sayısını güncelle
    cartCount.textContent = cartItems.length;
    
    // Sepet içeriğini temizle
    cartItemsContainer.innerHTML = '';
    
    // Toplam fiyatı sıfırla
    cartTotal = 0;
    
    // Her ürün için sepete ekle
    cartItems.forEach((item, index) => {
        cartTotal += parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Toplam fiyatı güncelle
    totalPrice.textContent = cartTotal.toFixed(2) + ' TL';
}

// Bildirim gösterme
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // CSS için stil ekleme
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#e31837';
    notification.style.color = 'white';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '5px';
    notification.style.animation = 'slideIn 0.5s ease-out';

    // 3 saniye sonra bildirimi kaldır
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Animasyonlar için CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// Sepete Ekle butonlarına tıklama olayı ekleme
document.addEventListener('DOMContentLoaded', () => {
    // Sepete Ekle butonlarına tıklama olayı ekleme
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const product = {
                name: productCard.querySelector('.product-title').textContent,
                price: productCard.querySelector('.product-price').textContent,
                image: productCard.querySelector('img').src
            };
            addToCart(product);
        });
    });

    // Ödeme butonuna tıklama
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (cartItems.length > 0) {
            alert('Ödeme sayfasına yönlendiriliyorsunuz...');
            // Burada ödeme sayfasına yönlendirme yapılabilir
        } else {
            showNotification('Sepetiniz boş!');
        }
    });

    // Dışarı tıklandığında sepeti kapatma
    document.addEventListener('click', (e) => {
        const cartPanel = document.querySelector('.cart-panel');
        const cartButton = document.querySelector('.shopping-cart');
        
        if (!cartPanel.contains(e.target) && !cartButton.contains(e.target)) {
            cartPanel.classList.remove('active');
        }
    });

    // Smooth scroll için tüm iç linkleri seç
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // İletişim formu gönderimi
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            // Burada form verilerini işleyebilir veya bir API'ye gönderebilirsiniz
            showNotification('Mesajınız gönderildi!');
            contactForm.reset();
        });
    }

    // Filtreleme olaylarını ekle
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', filterProducts);
    });

    // URL parametrelerini kontrol et
    getUrlParams();
});

// Navbar scroll efekti
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
        // Aşağı scroll
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Yukarı scroll
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Ürün filtreleme
function filterProducts() {
    const brandSelect = document.querySelector('.filter-select:nth-child(1)');
    const priceSelect = document.querySelector('.filter-select:nth-child(2)');
    const products = document.querySelectorAll('.product-card');

    products.forEach(product => {
        const price = parseFloat(product.querySelector('.product-price').textContent.replace(/[^0-9.-]+/g, ''));
        const brand = product.querySelector('.product-title').textContent.split(' ')[0].toLowerCase();
        
        let showByBrand = brandSelect.value === '' || brand === brandSelect.value;
        let showByPrice = true;

        if (priceSelect.value !== '') {
            const [min, max] = priceSelect.value.split('-').map(val => val === '+' ? Infinity : Number(val));
            showByPrice = price >= min && (max === Infinity ? true : price <= max);
        }

        product.style.display = showByBrand && showByPrice ? 'block' : 'none';
    });
}

// URL parametrelerini alma
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const marka = params.get('marka');
    const tur = params.get('tur');
    
    if (marka) {
        const markaSelect = document.querySelector('.filter-select:nth-child(1)');
        if (markaSelect) {
            markaSelect.value = marka;
            filterProducts();
        }
    }
    
    if (tur) {
        const turSelect = document.querySelector('.filter-select:nth-child(1)');
        if (turSelect) {
            turSelect.value = tur;
            filterProducts();
        }
    }
} 