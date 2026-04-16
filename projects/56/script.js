// ZenFlow - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
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
    const mobileMenuButton = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Countdown timer for free trial
    function setupCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            const days = 7;
            const hours = 23;
            const minutes = 59;
            const seconds = 59;
            
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
        }
    }

    // Interactive meditation timer
    function setupMeditationTimer() {
        const timerButtons = document.querySelectorAll('.meditation-timer-btn');
        const timerDisplay = document.getElementById('timer-display');
        
        if (timerButtons.length > 0 && timerDisplay) {
            let timer = null;
            let timeLeft = 300; // 5 minutes default
            
            timerButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const duration = parseInt(this.dataset.duration);
                    
                    if (timer) {
                        clearInterval(timer);
                        timer = null;
                        this.textContent = 'Start Meditation';
                    } else {
                        timeLeft = duration * 60;
                        this.textContent = 'Pause';
                        
                        timer = setInterval(() => {
                            timeLeft--;
                            
                            const minutes = Math.floor(timeLeft / 60);
                            const seconds = timeLeft % 60;
                            
                            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                            
                            if (timeLeft <= 0) {
                                clearInterval(timer);
                                timer = null;
                                this.textContent = 'Start Meditation';
                                timerDisplay.textContent = '0:00';
                                // Play completion sound or notification
                                alert('Meditation session complete!');
                            }
                        }, 1000);
                    }
                });
            });
        }
    }

    // Mood tracking functionality
    function setupMoodTracking() {
        const moodButtons = document.querySelectorAll('.mood-btn');
        const moodResult = document.getElementById('mood-result');
        
        moodButtons.forEach(button => {
            button.addEventListener('click', function() {
                moodButtons.forEach(btn => btn.classList.remove('btn-primary', 'btn-secondary', 'btn-accent'));
                this.classList.add('btn-primary');
                
                if (moodResult) {
                    moodResult.textContent = `You selected: ${this.dataset.mood}. Let's find some meditations for ${this.dataset.mood} moments.`;
                }
            });
        });
    }

    // Breathing exercise guide
    function setupBreathingExercise() {
        const breatheCircle = document.getElementById('breathe-circle');
        const breatheButton = document.getElementById('breathe-button');
        
        if (breatheCircle && breatheButton) {
            let breathingInterval = null;
            
            breatheButton.addEventListener('click', function() {
                if (breathingInterval) {
                    clearInterval(breathingInterval);
                    breathingInterval = null;
                    this.textContent = 'Start Breathing Exercise';
                    breatheCircle.style.animationPlayState = 'paused';
                } else {
                    this.textContent = 'Stop Breathing Exercise';
                    breatheCircle.style.animationPlayState = 'running';
                    
                    breathingInterval = setInterval(() => {
                        // Breathing rhythm: 4 seconds inhale, 4 seconds exhale
                        breatheCircle.style.animationName = 'inhale';
                        setTimeout(() => {
                            breatheCircle.style.animationName = 'exhale';
                        }, 4000);
                    }, 8000);
                }
            });
        }
    }

    // Initialize all interactive features
    setupCountdown();
    setupMeditationTimer();
    setupMoodTracking();
    setupBreathingExercise();

    // Add custom animations for breathing exercise
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes inhale {
            0% { transform: scale(1); }
            100% { transform: scale(1.5); }
        }
        @keyframes exhale {
            0% { transform: scale(1.5); }
            100% { transform: scale(1); }
        }
        .breathe-circle {
            animation: inhale 4s ease-in-out infinite;
        }
    `;
    document.head.appendChild(styleSheet);
});