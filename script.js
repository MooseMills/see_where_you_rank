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
const contextLabel = document.getElementById('contextLabel');
    if (value >= 80) {
        contextLabel.textContent = 'Top 10%';
        contextLabel.className = 'context-label top';
    } else if (value >= 59) {
        contextLabel.textContent = 'Above Average';
        contextLabel.className = 'context-label above';
    } else if (value >= 26) {
        contextLabel.textContent = 'Below Average';
        contextLabel.className = 'context-label below';
    } else {
        contextLabel.textContent = 'Bottom 10%';
        contextLabel.className = 'context-label bottom';
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

    svg.innerHTML = '';

    const width = 1250;
    const height = 468;
    const padL = 60;
    const padR = 60;
    const baseline = height - 50;
    const chartH = baseline - 80; // more room at top for labels
    const chartTop = baseline - chartH; // y=80

    const mean = 59;
    const stdDev = 15;

    function normalDist(x) {
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
            Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)));
    }

    function svgX(pct) {
        return padL + (pct / 100) * (width - padL - padR);
    }

    function svgY(val) {
        return baseline - (val * chartH * 30);
    }

    // Generate full curve points
    const points = [];
    for (let x = 0; x <= 100; x += 0.5) {
        points.push({ x: svgX(x), y: svgY(normalDist(x)), pct: x });
    }

    // Defs for stroke gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const strokeGrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    strokeGrad.setAttribute('id', 'strokeGrad');
    strokeGrad.setAttribute('x1', '0%'); strokeGrad.setAttribute('x2', '100%');
    strokeGrad.setAttribute('y1', '0%'); strokeGrad.setAttribute('y2', '0%');
    [['0%', '#7C3AED'], ['50%', '#4F46E5'], ['100%', '#0EA5E9']].forEach(([offset, color]) => {
        const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop.setAttribute('offset', offset);
        stop.setAttribute('stop-color', color);
        strokeGrad.appendChild(stop);
    });
    defs.appendChild(strokeGrad);
    svg.appendChild(defs);

    const b10x = svgX(26);
    const t10x = svgX(80);

    // Left tail fill (#FFE2AE) — from 0% to bottom 10% (x=26)
    const leftTailPoints = points.filter(p => p.pct <= 26);
    if (leftTailPoints.length) {
        const lFill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lFill.setAttribute('d', `M ${padL},${baseline} L ${leftTailPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${b10x},${baseline} Z`);
        lFill.setAttribute('fill', '#FFE2AE');
        svg.appendChild(lFill);
    }

    // Middle fill (light blue) — from bottom 10% to top 10%
    const midPoints = points.filter(p => p.pct >= 26 && p.pct <= 80);
    if (midPoints.length) {
        const mFill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mFill.setAttribute('d', `M ${b10x},${baseline} L ${midPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${t10x},${baseline} Z`);
        mFill.setAttribute('fill', 'rgba(147, 197, 253, 0.3)');
        svg.appendChild(mFill);
    }

    // Right tail fill (#D9FFE8) — from top 10% (x=80) to 100%
    const rightTailPoints = points.filter(p => p.pct >= 80);
    if (rightTailPoints.length) {
        const rFill = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        rFill.setAttribute('d', `M ${t10x},${baseline} L ${rightTailPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${width - padR},${baseline} Z`);
        rFill.setAttribute('fill', '#D9FFE8');
        svg.appendChild(rFill);
    }

    // Dashed marker lines — bottom and top 10%
    const addDashedLine = (x) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x); line.setAttribute('y1', chartTop);
        line.setAttribute('x2', x); line.setAttribute('y2', baseline);
        line.setAttribute('stroke', '#CBD5E1');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '5,4');
        svg.appendChild(line);
    };
    addDashedLine(b10x);
    addDashedLine(t10x);

    // Zone labels above dashed lines
    const addZoneLabel = (x, text, anchor) => {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', anchor === 'end' ? x - 6 : x + 6);
        t.setAttribute('y', chartTop + 14);
        t.setAttribute('text-anchor', anchor);
        t.setAttribute('fill', '#94A3B8');
        t.setAttribute('font-size', '22');
        t.setAttribute('font-family', 'Red Hat Text, sans-serif');
        t.textContent = text;
        svg.appendChild(t);
    };
    addZoneLabel(b10x, 'Bottom 10%', 'end');
    addZoneLabel(t10x, 'Top 10%', 'start');

    // Curve stroke
    const curvePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    curvePath.setAttribute('d', `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`);
    curvePath.setAttribute('stroke', '#4D1EAD');
    curvePath.setAttribute('stroke-width', '3');
    curvePath.setAttribute('fill', 'none');
    curvePath.setAttribute('stroke-linecap', 'round');
    svg.appendChild(curvePath);

    // Baseline
    const baselineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baselineEl.setAttribute('x1', padL); baselineEl.setAttribute('y1', baseline);
    baselineEl.setAttribute('x2', width - padR); baselineEl.setAttribute('y2', baseline);
    baselineEl.setAttribute('stroke', '#CBD5E1');
    baselineEl.setAttribute('stroke-width', '2');
    svg.appendChild(baselineEl);

    // Axis labels
    const addAxisLabel = (x, text, anchor) => {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x);
        t.setAttribute('y', baseline + 28);
        t.setAttribute('text-anchor', anchor);
        t.setAttribute('fill', '#687887');
        t.setAttribute('font-size', '22');
        t.setAttribute('font-family', 'Red Hat Text, sans-serif');
        t.textContent = text;
        svg.appendChild(t);
    };
    addAxisLabel(padL, '0%', 'middle');
    addAxisLabel(width - padR, '100%', 'middle');

    // Average tick + label
    const avgX = svgX(59);
    const avgTick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    avgTick.setAttribute('x1', avgX); avgTick.setAttribute('y1', baseline - 5);
    avgTick.setAttribute('x2', avgX); avgTick.setAttribute('y2', baseline + 5);
    avgTick.setAttribute('stroke', '#94A3B8');
    avgTick.setAttribute('stroke-width', '2');
    svg.appendChild(avgTick);
    addAxisLabel(avgX, 'Average 59%', 'middle');

    // ---- USER MARKER ----
    const ux = svgX(userValue);
    const uCurveY = svgY(normalDist(userValue));

    // Full-height solid line
    const userLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    userLine.setAttribute('x1', ux); userLine.setAttribute('y1', chartTop);
    userLine.setAttribute('x2', ux); userLine.setAttribute('y2', baseline);
    userLine.setAttribute('stroke', '#002955');
    userLine.setAttribute('stroke-width', '2.5');
    svg.appendChild(userLine);

    // Percentage label — floats ABOVE the marker line
    const pctLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pctLabel.setAttribute('x', ux);
    pctLabel.setAttribute('y', chartTop - 16);
    pctLabel.setAttribute('text-anchor', 'middle');
    pctLabel.setAttribute('fill', '#002955');
    pctLabel.setAttribute('font-weight', '700');
    pctLabel.setAttribute('font-size', '26');
    pctLabel.setAttribute('font-family', 'Red Hat Text, sans-serif');
    pctLabel.textContent = `${userValue}%`;
    svg.appendChild(pctLabel);

    // Small downward arrow just below the percentage text
    const arrowTipY = chartTop + 4;
    const arrowH = 14;
    const arrowW = 12;
    const arrowPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrowPoly.setAttribute('points', `${ux},${arrowTipY} ${ux - arrowW},${arrowTipY - arrowH} ${ux + arrowW},${arrowTipY - arrowH}`);
    arrowPoly.setAttribute('fill', '#002955');
    svg.appendChild(arrowPoly);

    // YOU label — just below the arrow
    const youLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    youLabel.setAttribute('x', ux);
    youLabel.setAttribute('y', chartTop - 42);
    youLabel.setAttribute('text-anchor', 'middle');
    youLabel.setAttribute('fill', '#002955');
    youLabel.setAttribute('font-weight', '700');
    youLabel.setAttribute('font-size', '22');
    youLabel.setAttribute('font-family', 'Red Hat Text, sans-serif');
    youLabel.textContent = 'YOU';
    svg.appendChild(youLabel);
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
