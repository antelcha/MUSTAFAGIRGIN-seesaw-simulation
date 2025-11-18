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

    const circleRadius = 50;

    const barRect = bar.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const seesawCenterX = (barRect.left + barRect.right) / 2 - containerRect.left;
    const seesawCenterY = (barRect.top + barRect.bottom) / 2 - containerRect.top;

    const barLeft = barRect.left - containerRect.left;
    const barRight = barRect.right - containerRect.left;

    let totalTorque = 0;

    console.log(`Seesaw pivot: (${seesawCenterX}, ${seesawCenterY})`);

    bar.style.transform = `rotate(${barAngle}deg)`;
        
    const possibleCircles = [
        { color: '#FF0000', mass: 1, radius: 8 },    // parlak kırmızı
        { color: '#00FFD0', mass: 2, radius: 10 },   // canlı turkuaz
        { color: '#0099FF', mass: 3, radius: 12 },   // canlı mavi
        { color: '#FF9100', mass: 4, radius: 14 },   // parlak turuncu
        { color: '#00FF38', mass: 5, radius: 16 },   // canlı yeşil
        { color: '#FFFF00', mass: 6, radius: 18 },   // parlak sarı
        { color: '#B900FF', mass: 7, radius: 20 },   // parlak mor
        { color: '#FF42A1', mass: 8, radius: 22 },   // canlı pembe
        { color: '#00CFFF', mass: 9, radius: 24 },   // parlak açık mavi
        { color: '#13FF00', mass: 10, radius: 26 },  // parlak koyu yeşil
    ];


    let previewCircle = createCircle(0, 30, 2, circleRadius, 'red');
    container.appendChild(previewCircle.element);
    previewCircle.element.style.display = 'none';
    nextCircle();
    
    

    function createCircle(x, y, mass, radius, color) {
        const circle = document.createElement('div');
        circle.style.position = 'absolute';
        circle.style.left = `${x - radius}px`;     
        circle.style.top = `${y - radius}px`;
        circle.style.width = `${radius * 2}px`;
        circle.style.height = `${radius * 2}px`;
        circle.style.borderRadius = '50%';
        circle.style.background = color;
        circle.style.pointerEvents = 'none';
        circle.style.zIndex = '3';



        const massText = document.createElement('span');
        massText.innerText = mass;
        massText.style.position = 'absolute';
        massText.style.left = '50%';
        massText.style.top = '50%';
        massText.style.transform = 'translate(-50%, -50%)';
        massText.style.color = '#222';
        massText.style.fontWeight = 'bold';
        massText.style.fontSize = '12px';
        massText.style.userSelect = 'none';
        massText.style.pointerEvents = 'none';
        circle.appendChild(massText);
        
        return { element: circle, x: x - radius, y: y - radius, mass: mass, isOnBar: false, radius: radius, color: color };
    }

    function isPointOnBar(x, y) {
        const angleRad = barAngle * Math.PI / 180;
        const horizontalProjection = (barWidth / 2) * Math.cos(angleRad);
        const barLeftX = seesawCenterX - horizontalProjection;
        const barRightX = seesawCenterX + horizontalProjection;
        const withinX = x >= barLeftX && x <= barRightX;        
        return withinX;
    }

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        if (!isPointOnBar(mouseX, mouseY)) {
            previewCircle.element.style.display = 'none';
            return;
        }
        previewCircle.element.style.display = 'block';

        previewCircle.x = mouseX - previewCircle.radius;

        previewCircle.element.style.left = `${previewCircle.x}px`;

        
        console.log(mouseX, mouseY);
    });

    container.addEventListener('click', (event) => {
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (!isPointOnBar(mouseX, mouseY)) return;

        const newCircle = createCircle(previewCircle.x + previewCircle.radius, previewCircle.y + previewCircle.radius, previewCircle.mass, previewCircle.radius, previewCircle.color);
        circleData.push(newCircle);
        container.appendChild(newCircle.element);


        if (!animationRunning) {
            animationRunning = true;
            fall();
        }

        console.log(previewCircle);
        nextCircle()

    });

    function nextCircle() {
        const randomCircle = possibleCircles[Math.floor(Math.random() * possibleCircles.length)];
        
        const oldCenterX = previewCircle.x + previewCircle.radius;
        const oldCenterY = previewCircle.y + previewCircle.radius;
        
        previewCircle.mass = randomCircle.mass;
        previewCircle.radius = randomCircle.radius;
        previewCircle.color = randomCircle.color;
        
        previewCircle.x = oldCenterX - randomCircle.radius;
        previewCircle.y = oldCenterY - randomCircle.radius;
        
        previewCircle.element.style.background = randomCircle.color;
        previewCircle.element.querySelector('span').innerText = randomCircle.mass;
        previewCircle.element.style.width = `${randomCircle.radius * 2}px`;
        previewCircle.element.style.height = `${randomCircle.radius * 2}px`;
        previewCircle.element.style.left = `${previewCircle.x}px`;
        previewCircle.element.style.top = `${previewCircle.y}px`;
    }


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

                const horizontalDistFromPivot = (circle.x + circle.radius) - seesawCenterX;

                const barSurfaceY = getBarSurfaceY(barAngle, horizontalDistFromPivot, barHeight);

                const targetY = container.clientHeight - baseHeight - barSurfaceY - circle.radius;

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



    function updateCirclesIfNeeded(newAngle) {
        const angleDifference = newAngle - barAngle;    
        
        for (const circle of circleData) {
            if (circle.isOnBar) {
                const circleCenterX = circle.x + circle.radius;
                const circleCenterY = circle.y + circle.radius;
                
                const rotated = rotatePoint(
                    circleCenterX, 
                    circleCenterY, 
                    seesawCenterX, 
                    seesawCenterY, 
                    angleDifference
                );
                
                circle.x = rotated.x - circle.radius;
                circle.y = rotated.y - circle.radius;
                circle.element.style.left = `${circle.x}px`;
                circle.element.style.top = `${circle.y}px`;
            }
        }
        
        setAngle(newAngle);
    }

    function calculateTorque() {
        totalTorque = 0;
        for (const circle of circleData) {
            if (circle.isOnBar) {
                const distance = circle.x + circle.radius - seesawCenterX;
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
    

});
