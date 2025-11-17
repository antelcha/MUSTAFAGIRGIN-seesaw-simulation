document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.simulation-container');
    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.left = `${mouseX - 10}px`;     
        circle.style.top = `${mouseY - 10}px`;   
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'red';     
        circle.style.pointerEvents = 'none';     
        
        container.appendChild(circle);
    });
 });