document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const navLinks = document.querySelector('.md\\:flex');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('flex-col');
            navLinks.classList.toggle('absolute');
            navLinks.classList.toggle('top-full');
            navLinks.classList.toggle('left-0');
            navLinks.classList.toggle('w-full');
            navLinks.classList.toggle('bg-base-100');
            navLinks.classList.toggle('p-4');
            navLinks.classList.toggle('shadow-xl');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks && !navLinks.classList.contains('hidden')) {
                    navLinks.classList.add('hidden');
                    navLinks.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-base-100', 'p-4', 'shadow-xl');
                }
            }
        });
    });

    // Add scroll effect to navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-lg');
            } else {
                navbar.classList.remove('shadow-lg');
            }
        });
    }

    // Add animation on scroll for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add hover effects to cards
    document.querySelectorAll('.card, .glass-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.zIndex = 'auto';
        });
    });

    // Add click handlers for project modals (placeholder functionality)
    document.querySelectorAll('.card-actions a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.card');
            if (card) {
                const title = card.querySelector('.card-title').textContent;
                console.log(`Opening details for: ${title}`);
                // In a real application, this would open a modal or navigate to a details page
            }
        });
    });

    // Add form handling for contact section
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, this would submit the form data
            alert('Thank you for your message! This would normally submit your contact information.');
            contactForm.reset();
        });
    }

    // Add counter animation for stats
    const stats = document.querySelectorAll('.text-3xl.font-bold');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        if (target) {
            stat.textContent = '0';
            let current = 0;
            const duration = 1500;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (stat.textContent.includes('%') ? '%' : (stat.textContent.includes('+') ? '+' : ''));
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : (stat.textContent.includes('+') ? '+' : ''));
                }
            }, 16);
        }
    });
});