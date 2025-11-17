document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.simulation-container');
    const bar = document.querySelector('.bar');

    const circleData = [];
    let barAngle = 0;
    let animationRunning = false;


    const ground = document.querySelector('.ground');
    const support = document.querySelector('.support');

    const groundHeight = ground ? ground.offsetHeight : 0;
    const supportHeight = support ? support.offsetHeight : 0;
    const barHeight = bar ? bar.offsetHeight : 0;
    const barWidth = bar ? bar.offsetWidth : 0;
    const baseHeight = groundHeight + supportHeight + barHeight;

    const circleRadius = 5;

    const barRect = bar.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const seesawCenterX = (barRect.left + barRect.right) / 2 - containerRect.left;
    const seesawCenterY = (barRect.top + barRect.bottom) / 2 - containerRect.top;

    const barLeft = barRect.left - containerRect.left;
    const barRight = barRect.right - containerRect.left;

    let totalTorque = 0;

    console.log(`Seesaw pivot: (${seesawCenterX}, ${seesawCenterY})`);

    bar.style.transform = `rotate(${barAngle}deg)`;

    function createCircle(x, y, mass, radius) {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.left = `${x - radius}px`;     
        circle.style.top = `${y - radius}px`;
        circle.style.width = `${radius * 2}px`;
        circle.style.height = `${radius * 2}px`;
        circle.style.borderRadius = '50%';
        circle.style.background = 'red';
        circle.style.pointerEvents = 'none';
        circle.style.zIndex = '3';
        
        return { element: circle, x: x - radius, y: y - radius, mass: mass, isOnBar: false };
    }

    function isPointOnBar(x, y) {
        const angleRad = barAngle * Math.PI / 180;
        const horizontalProjection = (barWidth / 2) * Math.cos(angleRad);
        const barLeftX = seesawCenterX - horizontalProjection;
        const barRightX = seesawCenterX + horizontalProjection;
        const withinX = x >= barLeftX && x <= barRightX;        
        return withinX;
    }

    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (!isPointOnBar(mouseX, mouseY)) return;

        const circleObj = createCircle(mouseX, mouseY, 1, circleRadius);
        circleData.push(circleObj);
        container.appendChild(circleObj.element);

        if (!animationRunning) {
            animationRunning = true;
            fall();
        }
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
        let falling = false;
        if (circleData.length > 0) {
            for (const circle of circleData) {

                const horizontalDistFromPivot = (circle.x + circleRadius) - seesawCenterX;

                const barSurfaceY = getBarSurfaceY(barAngle, horizontalDistFromPivot, barHeight);

                const targetY = container.clientHeight - baseHeight - barSurfaceY - circleRadius;

                if (circle.y < targetY) {
                    falling = true;
                    circle.y = Math.min(circle.y + 10, targetY);
                    circle.element.style.top = `${circle.y}px`;

                    if (circle.y >= targetY) {
                        circle.isOnBar = true;
                    }
                }
            }
            const newAngle = Math.max(-30, Math.min(30, (calculateTorque() / 10)));
            updateCirclesIfNeeded(newAngle);

            if (falling) {
                requestAnimationFrame(fall);
            } else {
                animationRunning = false;
            }
        }

    }



    function updateCirclesIfNeeded(circle) {
        const angle = Math.max(-30, Math.min(30, (calculateTorque() / 10)));
        console.log(calculateTorque());

        setAngle(angle);


    }

    function calculateTorque() {
        totalTorque = 0;
        for (const circle of circleData) {
            if (circle.isOnBar) {
                const distance = circle.x + circleRadius - seesawCenterX;
                const force = circle.mass;
                totalTorque += distance * force;
            }
        }
        return totalTorque;
    }

    function setAngle(angle) {
        barAngle = angle;
        bar.style.transform = `rotate(${barAngle}deg)`;
    }

    function rotatePoint(x, y, cx, cy, angle) {
        const rad = angle * Math.PI / 180;
    
        const dx = x - cx;
        const dy = y - cy;
    
        const newX = dx * Math.cos(rad) - dy * Math.sin(rad);
        const newY = dx * Math.sin(rad) + dy * Math.cos(rad);
    
        return {
            x: newX + cx,
            y: newY + cy
        };
    }
    


    fall();
});
