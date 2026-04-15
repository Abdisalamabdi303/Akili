// JavaScript logic goes here
document.addEventListener('DOMContentLoaded', () => {
    // Example: Add a simple animation to the header
    const header = document.querySelector('header');
    header.style.transition = 'background-color 0.3s ease';
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#222';
        } else {
            header.style.backgroundColor = 'transparent';
        }
    });
});