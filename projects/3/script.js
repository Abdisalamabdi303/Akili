// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
const orderForm = document.querySelector('form');
if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const quantity = document.getElementById('quantity').value;
        
        // Calculate price based on quantity
        const basePrice = 299.99;
        let discount = 0;
        if (quantity == 2) discount = 0.05;
        if (quantity >= 3) discount = 0.10;
        
        const totalPrice = (basePrice * quantity * (1 - discount)).toFixed(2);
        
        // Show success message
        alert(`Thank you for your order, ${name}! \n\nOrder Summary:\nEmail: ${email}\nQuantity: ${quantity}\nTotal: $${totalPrice}\n\nYour smart watch will be shipped within 24 hours!`);
        orderForm.reset();
    });
}

// Scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.card, .hero-content > *').forEach(el => {
    observer.observe(el);
});

// Add hover effect to product showcase image
const productImage = document.querySelector('img[alt="Smart Watch"]');
if (productImage) {
    productImage.addEventListener('mouseenter', () => {
        productImage.style.transform = 'scale(1.05)';
        productImage.style.transition = 'transform 0.3s ease';
    });
    productImage.addEventListener('mouseleave', () => {
        productImage.style.transform = 'scale(1)';
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
    
    lastScroll = currentScroll;
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}