// ZenFlow - Interactive Features
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

    // Mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'md:hidden btn btn-ghost';
    mobileMenuButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>';
    
    const navbar = document.querySelector('nav');
    const navLinks = document.querySelector('.md\\:flex');
    
    if (navbar && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('flex-col');
            navLinks.classList.toggle('absolute');
            navLinks.classList.toggle('top-full');
            navLinks.classList.toggle('left-0');
            navLinks.classList.toggle('w-full');
            navLinks.classList.toggle('bg-base-950');
            navLinks.classList.toggle('p-4');
            navLinks.classList.toggle('border-b');
            navLinks.classList.toggle('border-white/10');
        });
        
        // Insert mobile menu button after brand
        const brand = navbar.querySelector('.flex.items-center.gap-3');
        if (brand) {
            brand.after(mobileMenuButton);
        }
    }

    // Feature card hover effects
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = '0 20px 40px -10px rgba(99, 102, 241, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });

    // Countdown timer for free trial
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        let timeLeft = 3600; // 1 hour in seconds
        const updateCountdown = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft > 0) {
                timeLeft--;
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Program accordion functionality
    document.querySelectorAll('.program-step').forEach(step => {
        step.addEventListener('click', () => {
            const content = step.querySelector('.program-content');
            const icon = step.querySelector('.program-icon');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>';
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>';
            }
        });
    });

    // Breathing exercise animation
    const breathingCircle = document.getElementById('breathing-circle');
    if (breathingCircle) {
        let scale = 1;
        let direction = 1;
        
        const animateBreathing = () => {
            scale += 0.02 * direction;
            if (scale > 1.5 || scale < 1) {
                direction *= -1;
            }
            breathingCircle.style.transform = `scale(${scale})`;
            requestAnimationFrame(animateBreathing);
        };
        
        animateBreathing();
    }

    // Testimonial carousel
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length > 0) {
        let currentTestimonial = 0;
        
        const showTestimonial = (index) => {
            testimonials.forEach((t, i) => {
                t.classList.add('hidden');
                if (i === index) {
                    t.classList.remove('hidden');
                }
            });
        };
        
        showTestimonial(0);
        
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 8000);
    }

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Success!';
                submitBtn.className = 'btn btn-success';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.className = submitBtn.className.replace('btn-success', 'btn-primary');
                    submitBtn.disabled = false;
                    form.reset();
                }, 3000);
            }, 1500);
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.remove('opacity-0');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .program-step, .hero-content > div').forEach(el => {
        el.classList.add('opacity-0');
        observer.observe(el);
    });
});