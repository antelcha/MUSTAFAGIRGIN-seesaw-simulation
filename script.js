document.addEventListener('DOMContentLoaded', () => {
    const rotateButton = document.getElementById('rotate-button');
    const bar = document.querySelector('.bar');
    
    rotateButton.addEventListener('click', () => {
        const randomAngle = Math.random() * 60 - 30;    
        bar.style.transform = `rotate(${randomAngle}deg)`;
    });
});