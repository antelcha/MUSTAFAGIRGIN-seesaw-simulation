document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.simulation-container');
    const circleData = [];
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
        circleData.push({
            element: circle,
            x: mouseX - 10,
            y: mouseY - 10,
            mass: 1
        });
        container.appendChild(circle);
        console.log(circleData);

    });

    function fall() {
        if (circleData.length > 0) {
            for (const circle of circleData) {
                if (circle.y < container.clientHeight - 0) {
                    circle.y  = Math.min(circle.y + 10, container.clientHeight - 50);
                    circle.element.style.top = `${circle.y}px`;
                    console.log(circle.y);
                }
            }
            
        }
        requestAnimationFrame(fall);
    }
    fall();
});