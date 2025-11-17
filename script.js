document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.simulation-container');
    const bar = document.querySelector('.bar');

    const circleData = [];
    let barAngle = -30;

    const ground = document.querySelector('.ground');
    const support = document.querySelector('.support');

    const groundHeight = ground ? ground.offsetHeight : 0;
    const supportHeight = support ? support.offsetHeight : 0;
    const barHeight = bar ? bar.offsetHeight : 0;

    const baseHeight = groundHeight + supportHeight + barHeight;

    const circleRadius = 10;

    const barRect = bar.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const seesawCenterX = (barRect.left + barRect.right) / 2 - containerRect.left;
    const seesawCenterY = (barRect.top + barRect.bottom) / 2 - containerRect.top;

    const barLeft = barRect.left - containerRect.left;
    const barRight = barRect.right - containerRect.left;

    console.log(`Seesaw pivot: (${seesawCenterX}, ${seesawCenterY})`);

    bar.style.transform = `rotate(${barAngle}deg)`;

    function createCircle(x, y) {
        const circle = document.createElement('div');
        
        circle.style.position = 'absolute';
        circle.style.left = `${x - circleRadius}px`;     
        circle.style.top = `${y - circleRadius}px`;
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.background = 'red';
        circle.style.pointerEvents = 'none';
        
        return { element: circle, x: x - circleRadius, y: y - circleRadius, mass: 1 };
    }

    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseX < barLeft || mouseX > barRight) return;

        const circleObj = createCircle(mouseX, mouseY);
        circleData.push(circleObj);
        container.appendChild(circleObj.element);

        console.log(circleData);
    });


    // this is for calculating the corresponding vertical 
    // height of the seasaw bar to the support if it is tilted
    // i.e if the bar is completely horizontal ,the relative height is 0 
    function getBarSurfaceY(alphaDegrees, horizontalDistance) {
        const rad = alphaDegrees * Math.PI / 180;
        const centerY = -horizontalDistance * Math.tan(rad);
        return centerY - (barHeight / 2) * Math.cos(rad);
    }

    function fall() {
        if (circleData.length > 0) {
            for (const circle of circleData) {

                const horizontalDistFromPivot = (circle.x + circleRadius) - seesawCenterX;

                const barSurfaceY = getBarSurfaceY(barAngle, horizontalDistFromPivot, barHeight);

                const targetY = container.clientHeight - baseHeight - barSurfaceY - circleRadius;

                if (circle.y < targetY) {
                    circle.y = Math.min(circle.y + 10, targetY);
                    circle.element.style.top = `${circle.y}px`;
                }
            }
        }

        requestAnimationFrame(fall);
    }

    fall();
});
