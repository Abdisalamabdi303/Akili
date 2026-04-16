document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
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

    // Mobile menu toggle functionality
    const mobileMenuButtons = document.querySelectorAll('.dropdown > div[tabindex="0"]');
    mobileMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.dropdown').classList.toggle('open');
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });

    // Add animation to hero section on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add form submission handler for contact form
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }

    // Add click handlers for product buttons
    const productButtons = document.querySelectorAll('.card button.btn-sm');
    productButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.previousElementSibling.textContent;
            alert(`Added ${productName} to your cart!`);
        });
    });

    // Newsletter subscription handler
    const newsletterForm = document.querySelector('footer .flex input');
    if (newsletterForm) {
        const subscribeButton = document.querySelector('footer .flex button');
        if (subscribeButton) {
            subscribeButton.addEventListener('click', () => {
                if (newsletterForm.value) {
                    alert('Thanks for subscribing to our newsletter!');
                    newsletterForm.value = '';
                } else {
                    alert('Please enter your email address.');
                }
            });
        }
    }
});