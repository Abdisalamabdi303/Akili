// Paws & Whiskers - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cartCount = 0;
    const cartCountElement = document.getElementById('cart-count');
    
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.card-actions button');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            // Animation effect
            this.classList.add('animate-pulse');
            setTimeout(() => {
                this.classList.remove('animate-pulse');
            }, 500);
            
            // Show success feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.classList.remove('btn-primary', 'btn-secondary', 'btn-accent');
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.textContent = originalText;
                // Restore original button style based on product category
                const card = this.closest('.card');
                if (card) {
                    const badge = card.querySelector('.badge');
                    if (badge) {
                        if (badge.classList.contains('badge-primary')) {
                            this.classList.add('btn-primary');
                        } else if (badge.classList.contains('badge-secondary')) {
                            this.classList.add('btn-secondary');
                        } else if (badge.classList.contains('badge-accent')) {
                            this.classList.add('btn-accent');
                        }
                    }
                }
            }, 1000);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuCheckbox = document.getElementById('mobile-menu');
    const mobileMenu = document.querySelector('.md\\:hidden');
    
    if (mobileMenuCheckbox && mobileMenu) {
        mobileMenuCheckbox.addEventListener('change', function() {
            if (this.checked) {
                mobileMenu.style.display = 'block';
            } else {
                mobileMenu.style.display = 'none';
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenuCheckbox) {
                    mobileMenuCheckbox.checked = false;
                    mobileMenu.style.display = 'none';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter subscription
    const subscribeButton = document.querySelector('.bg-gradient-to-r button');
    const emailInput = document.querySelector('.bg-gradient-to-r input');
    
    if (subscribeButton && emailInput) {
        subscribeButton.addEventListener('click', function() {
            const email = emailInput.value.trim();
            
            if (email && email.includes('@')) {
                // Success feedback
                subscribeButton.textContent = 'Subscribed!';
                subscribeButton.classList.add('btn-success');
                subscribeButton.classList.remove('btn-white');
                
                setTimeout(() => {
                    subscribeButton.textContent = 'Subscribe Now';
                    subscribeButton.classList.remove('btn-success');
                    subscribeButton.classList.add('btn-white');
                    emailInput.value = '';
                }, 2000);
            } else {
                // Error feedback
                emailInput.classList.add('input-error');
                setTimeout(() => {
                    emailInput.classList.remove('input-error');
                }, 2000);
            }
        });
    }
    
    // Scroll animations for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Apply animations to cards
    document.querySelectorAll('.card, .glass-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Hero section stats counter animation
    const stats = document.querySelectorAll('.hero-content .grid div');
    if (stats.length > 0) {
        let animationStarted = false;
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationStarted) {
                    animationStarted = true;
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(stats[0]);
    }
    
    function animateStats() {
        const numbers = document.querySelectorAll('.hero-content .grid .text-3xl');
        const targets = [500, 25, 100];
        const durations = [2000, 1500, 1500];
        
        numbers.forEach((element, index) => {
            const target = targets[index];
            const duration = durations[index];
            const increment = Math.ceil(target / (duration / 16));
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    element.textContent = target + (index === 2 ? '%' : '+');
                    clearInterval(timer);
                } else {
                    element.textContent = current + (index === 2 ? '%' : '+');
                }
            }, 16);
        });
    }
    
    // Product image hover effects
    const productImages = document.querySelectorAll('.card figure img');
    productImages.forEach(img => {
        img.addEventListener('load', function() {
            this.parentElement.style.height = this.parentElement.offsetHeight + 'px';
        });
    });
    
    // Initialize cart from localStorage if available
    const savedCartCount = localStorage.getItem('pawsWhiskersCartCount');
    if (savedCartCount) {
        cartCount = parseInt(savedCartCount);
        cartCountElement.textContent = cartCount;
    }
    
    // Save cart to localStorage on updates
    const originalAddToCart = addToCartButtons[0].onclick;
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            localStorage.setItem('pawsWhiskersCartCount', cartCount);
        });
    });
});