// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const inputScreen = document.getElementById('inputScreen');
    const resultsScreen = document.getElementById('resultsScreen');
    const input = document.getElementById('preAppointmentPercent');
    const calculateBtn = document.getElementById('calculateBtn');
    const snapshotBtn = document.getElementById('snapshotBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const errorMessage = document.getElementById('errorMessage');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const yourStat = document.getElementById('yourStat');

    // Calculate benchmark and show results
    function calculateBenchmark() {
        const value = parseFloat(input.value);

        // Validate input
        if (isNaN(value) || value < 0 || value > 100) {
            errorMessage.classList.add('show');
            input.style.borderColor = '#DD0000';
            return;
        }

        errorMessage.classList.remove('show');
        input.style.borderColor = '#CCEEFF';

        // Update result based on value
        yourStat.textContent = value + '%';

        if (value >= 80) {
            resultEmoji.textContent = '🏆';
            resultTitle.textContent = 'Outstanding Performance!';
            resultMessage.textContent = `At ${value}%, you're in the top 10% of practices! Your team is doing an excellent job with hygiene pre-appointments. Keep up the great work!`;
        } else if (value >= 59) {
            resultEmoji.textContent = '🎉';
            resultTitle.textContent = 'Above Average!';
            resultMessage.textContent = `At ${value}%, you're performing above the industry average of 59%. You're on the right track! Let's explore how we can help you reach top-tier performance.`;
        } else if (value >= 26) {
            resultEmoji.textContent = '💪';
            resultTitle.textContent = 'Room for Growth';
            resultMessage.textContent = `At ${value}%, there's significant opportunity to improve. The good news? We specialize in helping practices like yours optimize their hygiene pre-appointment processes. Let's work together to boost your numbers!`;
        } else {
            resultEmoji.textContent = '🚀';
            resultTitle.textContent = "Let's Get Started!";
            resultMessage.textContent = `At ${value}%, there's tremendous potential for improvement. Don't worry – we've helped countless practices transform their performance. Together, we can develop a strategy to dramatically improve your hygiene pre-appointments.`;
        }

        // Draw the bell curve with user's position
        drawBellCurve(value);

        // Switch screens
        inputScreen.classList.remove('active');
        resultsScreen.classList.add('active');
        
        // Scroll to results
        resultsScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Draw bell curve visualization
    function drawBellCurve(userValue) {
        const svg = document.getElementById('bellCurveSVG');
        if (!svg) return;
        
        // Clear previous content
        svg.innerHTML = '';
        
        // Add CSS custom properties
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
            :root {
                --curve: #0060C6;
                --axis: #9ca3af;
                --blue: #0060C6;
                --green: #00AB63;
                --text: #002955;
                --muted: #687887;
            }
        `;
        svg.appendChild(style);
        
        const width = 1000;
        const height = 320;
        const padding = 60;
        const chartHeight = height - 100;
        
        // Define the bell curve
        const mean = 59;
        const stdDev = 13;
        
        // Generate bell curve points
        const points = [];
        for (let x = 0; x <= 100; x += 0.5) {
            const y = normalDistribution(x, mean, stdDev);
            const scaledX = padding + ((x / 100) * (width - 2 * padding));
            const scaledY = height - 60 - (y * chartHeight * 30); // Increased to 30 for dramatic curve
            points.push({ x: scaledX, y: scaledY, percent: x });
        }
        
        // Split points at user's value for two-tone fill
        const userIndex = points.findIndex(p => p.percent >= userValue);
        const leftPoints = points.slice(0, userIndex + 1);
        const rightPoints = points.slice(userIndex);
        
        // Create gradient fills
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        // Blue gradient (below average)
        const blueGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        blueGrad.setAttribute('id', 'blueGradient');
        blueGrad.setAttribute('x1', '0%');
        blueGrad.setAttribute('y1', '0%');
        blueGrad.setAttribute('x2', '0%');
        blueGrad.setAttribute('y2', '100%');
        const blueStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        blueStop1.setAttribute('offset', '0%');
        blueStop1.setAttribute('style', 'stop-color:#0060C6;stop-opacity:0.3');
        const blueStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        blueStop2.setAttribute('offset', '100%');
        blueStop2.setAttribute('style', 'stop-color:#0060C6;stop-opacity:0.05');
        blueGrad.appendChild(blueStop1);
        blueGrad.appendChild(blueStop2);
        
        // Green gradient (above average or at user position)
        const greenGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        greenGrad.setAttribute('id', 'greenGradient');
        greenGrad.setAttribute('x1', '0%');
        greenGrad.setAttribute('y1', '0%');
        greenGrad.setAttribute('x2', '0%');
        greenGrad.setAttribute('y2', '100%');
        const greenStop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        greenStop1.setAttribute('offset', '0%');
        greenStop1.setAttribute('style', 'stop-color:#00AB63;stop-opacity:0.3');
        const greenStop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        greenStop2.setAttribute('offset', '100%');
        greenStop2.setAttribute('style', 'stop-color:#00AB63;stop-opacity:0.05');
        greenGrad.appendChild(greenStop1);
        greenGrad.appendChild(greenStop2);
        
        defs.appendChild(blueGrad);
        defs.appendChild(greenGrad);
        svg.appendChild(defs);
        
        const baseline = height - 60;
        
        // Fill left side (blue)
        if (leftPoints.length > 1) {
            const leftPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const leftD = `M ${padding},${baseline} L ${leftPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${leftPoints[leftPoints.length - 1].x},${baseline} Z`;
            leftPath.setAttribute('d', leftD);
            leftPath.setAttribute('fill', 'url(#blueGradient)');
            svg.appendChild(leftPath);
        }
        
        // Fill right side (green)
        if (rightPoints.length > 1) {
            const rightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const rightD = `M ${rightPoints[0].x},${baseline} L ${rightPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${width - padding},${baseline} Z`;
            rightPath.setAttribute('d', rightD);
            rightPath.setAttribute('fill', 'url(#greenGradient)');
            svg.appendChild(rightPath);
        }
        
        // Draw the bell curve line
        const curvePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const curveD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
        curvePath.setAttribute('d', curveD);
        curvePath.setAttribute('stroke', '#0060C6');
        curvePath.setAttribute('stroke-width', '4');
        curvePath.setAttribute('fill', 'none');
        curvePath.setAttribute('stroke-linecap', 'round');
        svg.appendChild(curvePath);
        
        // Add baseline axis
        const baselineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        baselineEl.setAttribute('x1', padding);
        baselineEl.setAttribute('y1', baseline);
        baselineEl.setAttribute('x2', width - padding);
        baselineEl.setAttribute('y2', baseline);
        baselineEl.setAttribute('stroke', '#9ca3af');
        baselineEl.setAttribute('stroke-width', '2');
        svg.appendChild(baselineEl);
        
        // Add labels
        const label0 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label0.setAttribute('x', padding);
        label0.setAttribute('y', baseline + 35);
        label0.setAttribute('text-anchor', 'start');
        label0.setAttribute('fill', '#687887');
        label0.setAttribute('font-weight', '700');
        label0.setAttribute('font-size', '18');
        label0.setAttribute('font-family', 'Red Hat Text, sans-serif');
        label0.textContent = '0%';
        svg.appendChild(label0);
        
        const label100 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label100.setAttribute('x', width - padding);
        label100.setAttribute('y', baseline + 35);
        label100.setAttribute('text-anchor', 'end');
        label100.setAttribute('fill', '#687887');
        label100.setAttribute('font-weight', '700');
        label100.setAttribute('font-size', '18');
        label100.setAttribute('font-family', 'Red Hat Text, sans-serif');
        label100.textContent = '100%';
        svg.appendChild(label100);
        
        // Add Average marker (59%) on the baseline
        const avgValue = 59;
        const avgX = padding + ((avgValue / 100) * (width - 2 * padding));
        
        // Tick mark on baseline
        const avgTick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        avgTick.setAttribute('x1', avgX);
        avgTick.setAttribute('y1', baseline - 10);
        avgTick.setAttribute('x2', avgX);
        avgTick.setAttribute('y2', baseline + 10);
        avgTick.setAttribute('stroke', '#687887');
        avgTick.setAttribute('stroke-width', '3');
        avgTick.setAttribute('opacity', '0.7');
        svg.appendChild(avgTick);
        
        // Label below baseline - larger and more readable
        const avgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        avgText.setAttribute('x', avgX);
        avgText.setAttribute('y', baseline + 58);
        avgText.setAttribute('text-anchor', 'middle');
        avgText.setAttribute('fill', '#687887');
        avgText.setAttribute('font-weight', '600');
        avgText.setAttribute('font-size', '15');
        avgText.setAttribute('font-family', 'Red Hat Text, sans-serif');
        avgText.textContent = 'Average (59%)';
        svg.appendChild(avgText);
        
        // Draw user's marker
        const userX = padding + ((userValue / 100) * (width - 2 * padding));
        const userY = height - 60 - (normalDistribution(userValue, mean, stdDev) * chartHeight * 30);
        
        // Vertical line
        const userLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        userLine.setAttribute('x1', userX);
        userLine.setAttribute('y1', userY);
        userLine.setAttribute('x2', userX);
        userLine.setAttribute('y2', baseline);
        userLine.setAttribute('stroke', '#0060C6');
        userLine.setAttribute('stroke-width', '3');
        userLine.setAttribute('stroke-dasharray', '8,5');
        svg.appendChild(userLine);
        
        // Marker circle
        const userCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        userCircle.setAttribute('cx', userX);
        userCircle.setAttribute('cy', userY);
        userCircle.setAttribute('r', '12');
        userCircle.setAttribute('fill', '#0060C6');
        userCircle.setAttribute('stroke', 'white');
        userCircle.setAttribute('stroke-width', '4');
        svg.appendChild(userCircle);
        
        // Pulse ring
        const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulseRing.setAttribute('cx', userX);
        pulseRing.setAttribute('cy', userY);
        pulseRing.setAttribute('r', '20');
        pulseRing.setAttribute('fill', 'none');
        pulseRing.setAttribute('stroke', '#0060C6');
        pulseRing.setAttribute('stroke-width', '2');
        pulseRing.setAttribute('opacity', '0.3');
        svg.appendChild(pulseRing);
        
        // User label
        const userText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        userText.setAttribute('x', userX);
        userText.setAttribute('y', userY - 30);
        userText.setAttribute('text-anchor', 'middle');
        userText.setAttribute('fill', '#002955');
        userText.setAttribute('font-weight', 'bold');
        userText.setAttribute('font-size', '20');
        userText.setAttribute('font-family', 'Red Hat Text, sans-serif');
        userText.textContent = `You: ${userValue}%`;
        svg.appendChild(userText);
        
        function normalDistribution(x, mean, stdDev) {
            const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
            return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
        }
    }

    // Request snapshot handler
    function requestSnapshot() {
        alert('Thank you for your interest! You would be redirected to a Practice Snapshot request form. This is where you\'d integrate with your CRM or scheduling system.');
        
        // Example redirect (uncomment and modify for production):
        // window.location.href = 'https://dentalintelligence.com/request-snapshot';
    }

    // Try again handler
    function tryAgain() {
        resultsScreen.classList.remove('active');
        inputScreen.classList.add('active');
        input.value = '';
        input.focus();
        
        // Scroll to input
        inputScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Event listeners
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateBenchmark);
    }
    
    if (snapshotBtn) {
        snapshotBtn.addEventListener('click', requestSnapshot);
    }
    
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', tryAgain);
    }

    // Allow Enter key to submit
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBenchmark();
            }
        });

        // Clear error on input
        input.addEventListener('input', function() {
            errorMessage.classList.remove('show');
            this.style.borderColor = '#CCEEFF';
        });
    }
});
