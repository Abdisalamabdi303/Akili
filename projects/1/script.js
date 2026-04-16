// PawHaven - Interactive Features
document.addEventListener("DOMContentLoaded", function() {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden .btn-ghost');
    const mobileMenu = document.querySelector('.md\\:flex');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex-col');
            mobileMenu.classList.toggle('absolute');
            mobileMenu.classList.toggle('top-16');
            mobileMenu.classList.toggle('left-0');
            mobileMenu.classList.toggle('w-full');
            mobileMenu.classList.toggle('bg-base-100');
            mobileMenu.classList.toggle('border-b');
            mobileMenu.classList.toggle('border-white/10');
            mobileMenu.classList.toggle('p-4');
            mobileMenu.classList.toggle('gap-4');
        });
    }

    // Smooth Scroll for Anchor Links
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

    // Add to Cart Button Interactions
    const addToCartButtons = document.querySelectorAll('.btn-cyan');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default form submission behavior
            e.preventDefault();
            
            // Visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10" /></svg> Adding...';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                alert('Added to cart! (Demo functionality)');
            }, 1500);
        });
    });

    // Hero Section Animation
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        // Add subtle parallax effect on scroll
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroOverlay = document.querySelector('.hero-overlay');
            if (heroOverlay && heroOverlay.style.backgroundImage) {
                heroOverlay.style.backgroundPosition = 'center ' + scrolled * 0.5 + 'px';
            }
        });
    }

    // Product Card Hover Effects
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 229, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Feature Icon Animations
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Testimonial Card Hover Effects
    const testimonialCards = document.querySelectorAll('#testimonials .card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 229, 255, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Service Card Hover Effects
    const serviceCards = document.querySelectorAll('#services .card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 229, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Feature Card Hover Effects
    const featureCards = document.querySelectorAll('#features .card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 229, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Navigation Active State
    const navLinks = document.querySelectorAll('.md\\:flex a');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-cyan-600', 'font-bold');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-cyan-600', 'font-bold');
            }
        });
    });

    // Cart Counter Animation (Demo)
    const shopButton = document.querySelector('.md\\:flex .btn-cyan');
    if (shopButton) {
        shopButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Create a floating cart icon animation
            const cartIcon = document.createElement('div');
            cartIcon.innerHTML = '🛒';
            cartIcon.style.position = 'fixed';
            cartIcon.style.fontSize = '24px';
            cartIcon.style.zIndex = '1000';
            cartIcon.style.transition = 'all 1s ease';
            
            // Start position (button)
            const rect = this.getBoundingClientRect();
            cartIcon.style.left = (rect.left + rect.width / 2) + 'px';
            cartIcon.style.top = rect.top + 'px';
            
            document.body.appendChild(cartIcon);
            
            // End position (top right)
            setTimeout(() => {
                cartIcon.style.left = '90%';
                cartIcon.style.top = '20px';
                cartIcon.style.transform = 'scale(1.5)';
            }, 50);
            
            // Remove after animation
            setTimeout(() => {
                document.body.removeChild(cartIcon);
                alert('Cart opened! (Demo functionality)');
            }, 1000);
        });
    }
});