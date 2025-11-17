document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.simulation-container');
    const bar = document.querySelector('.bar');
    const circleData = [];


    function createCircle(x, y) {
        const circle = document.createElement('div');
        const radius = 10;
        
        circle.style.position = 'absolute';
        circle.style.left = `${x - radius}px`;     
        circle.style.top = `${y - radius}px`;   
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'red';     
        circle.style.pointerEvents = 'none';
        
        return {
            element: circle,
            x: x - radius,
            y: y - radius,
            mass: 1
        };
    }

    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if (!bar) return;
        let barLeft = null;
        let barRight = null;
        const barRect = bar.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        barLeft = barRect.left - containerRect.left;
        barRight = barRect.right - containerRect.left;

        if (mouseX < barLeft || mouseX > barRight) {
            return;
        }

        const circleObj = createCircle(mouseX, mouseY);
        circleData.push(circleObj);
        container.appendChild(circleObj.element);
        console.log(circleData);
    });

    function fall() {
        if (circleData.length > 0) {
            
            for (const circle of circleData) {
                if (circle.y < container.clientHeight - 50) {
                    circle.y = Math.min(circle.y + 10, container.clientHeight - 50);
                    circle.element.style.top = `${circle.y}px`;
                    console.log(circle.y);
                }
            }
        }
        requestAnimationFrame(fall);
    }
    fall();
});