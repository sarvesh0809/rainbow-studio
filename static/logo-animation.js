/* ============================================
   RAINBOW ENTERTAINMENT — CINEMATIC LOGO REVEAL
   HTML5 Canvas — Premium V5
   ============================================ */

(function () {
  const canvas = document.getElementById('logo-animation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dpr, animFrame;
  const startTime = performance.now();

  const T = { starsIn: 0, cloudsIn: 0.8, rainbowStart: 1.8, rainbowEnd: 4.8, textIn: 5.0 };

  // VIBGYOR palette (Violet outer -> Red inner)
  const SPECTRUM = [
    [140, 60, 155],  // violet
    [70, 60, 180],   // indigo
    [35, 140, 200],  // blue
    [60, 185, 75],   // green
    [240, 220, 60],  // yellow
    [245, 150, 25],  // orange
    [220, 30, 38],   // red
  ];

  // --- CLOUDS AND STARS ---
  const movingClouds = [];
  function initClouds() {
    movingClouds.length = 0;
    // Add two moving clouds like earlier
    movingClouds.push({ x: 0.15, y: 0.25, scale: 1.2, speed: 0.005 });
    movingClouds.push({ x: 0.85, y: 0.2, scale: 0.9, speed: 0.003 });
  }

  function drawStarShape(c, x, y, spikes, outerR, innerR) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;
    c.beginPath();
    c.moveTo(x, y - outerR);
    for (let i = 0; i < spikes; i++) {
      let x1 = x + Math.cos(rot) * outerR;
      let y1 = y + Math.sin(rot) * outerR;
      c.lineTo(x1, y1);
      rot += step;
      x1 = x + Math.cos(rot) * innerR;
      y1 = y + Math.sin(rot) * innerR;
      c.lineTo(x1, y1);
      rot += step;
    }
    c.lineTo(x, y - outerR);
    c.closePath();
  }

  function drawCloudShape(c) {
    c.beginPath();
    c.moveTo(-90, 30);
    c.lineTo(120, 30);
    c.arc(120, 10, 20, Math.PI/2, -Math.PI/2, true);
    c.arc(80, -15, 30, 0, -Math.PI, true);
    c.arc(20, -35, 35, 0, -Math.PI, true);
    c.arc(-40, -20, 30, 0, -Math.PI, true);
    c.arc(-90, 10, 20, -Math.PI/2, Math.PI/2, true);
    c.closePath();
  }

  function drawStaticCloudAndStars(t, alpha) {
    if (alpha <= 0) return;
    const isMobile = W < 768;
    const scale = isMobile ? 0.6 : 1.2;
    
    ctx.save();
    ctx.globalAlpha = alpha;

    // Moving clouds
    for (let i = 0; i < movingClouds.length; i++) {
      const c = movingClouds[i];
      const cx = ((c.x + c.speed * t) % 1.5 - 0.25) * W;
      const mScale = isMobile ? c.scale * 0.4 : c.scale * 0.8;
      const mY = isMobile ? c.y * H + (i * 20) : c.y * H;
      
      ctx.save();
      ctx.translate(cx, mY);
      ctx.scale(mScale, mScale);
      drawCloudShape(ctx);
      ctx.fillStyle = '#6fa8dc';
      ctx.globalAlpha = alpha * 0.7; // slightly transparent background clouds
      ctx.fill();
      ctx.strokeStyle = '#2986cc';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = alpha;
    
    // Central Static Cloud (shifted a bit to the left side)
    const cx = W * 0.47;
    const cy = H * 0.40; // Shifted slightly up for better spacing

    // Slow and calm movement (gentle float + slight scale)
    const pulse = 1 + 0.02 * Math.sin(t * 1.5); 
    const floatY = Math.sin(t * 2) * 5; 

    ctx.save();
    ctx.translate(cx, cy + floatY);
    ctx.scale(pulse * scale, pulse * scale);

    drawCloudShape(ctx);
    ctx.fillStyle = '#6fa8dc';
    ctx.fill();
    ctx.strokeStyle = '#2986cc';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Stars
    const starData = [
      { dx: 10, dy: 90, r: 16, col: '#ff0000' },
      { dx: 60, dy: 50, r: 16, col: '#ffff00' },
      { dx: 100, dy: 95, r: 16, col: '#00ff00' },
      { dx: 150, dy: 60, r: 16, col: '#0000ff' }
    ];

    for (let i = 0; i < starData.length; i++) {
        const s = starData[i];
        const sx = cx + s.dx * scale;
        const sy = cy + floatY + s.dy * scale; // move stars with the cloud float
        
        ctx.save();
        ctx.translate(sx, sy);
        const starPulse = 1 + 0.05 * Math.sin(t * 2 + i);
        ctx.scale(starPulse, starPulse);
        ctx.fillStyle = s.col;
        drawStarShape(ctx, 0, 0, 5, s.r * scale, s.r * 0.4 * scale);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();
        ctx.restore();
    }
    
    ctx.restore();
  }

  // --- PARTICLES ---
  const particles = [];
  function spawnParticle(x, y, r, g, b) {
    if (particles.length > 80) return;
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5 - 0.15,
      life: 1, decay: 0.008 + Math.random() * 0.005,
      sz: Math.random() * 1.5 + 0.5,
      r, g, b
    });
  }

  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life * 0.7;
      ctx.fillStyle = `rgb(${p.r|0},${p.g|0},${p.b|0})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, 6.28);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // --- RAINBOW ARC (large, 3D, glowing, perspective-preserved) ---
  let rainbowBuffer = null;
  let rbCtx = null;

  function drawRainbow(progress, t) {
    if (progress <= 0) return;

    const isMobile = W < 768;
    
    // Ensure the rainbow diameter doesn't exceed screen width or top height
    const maxRadius = Math.min(W * 0.48, H * 0.62); // Increased max bounds
    let baseR = maxRadius * 0.68;
    let totalBandWidth = maxRadius * 0.32;

    const perspMin = 0.3; // Left small, right big — preserved
    // Shift the arc's geometrical center slightly LEFT to perfectly center its physical bounding box on the screen
    const rainbowCenterOffset = (totalBandWidth * (1.0 - perspMin)) * 0.5;
    const cx = W * 0.5 - rainbowCenterOffset;
    const cy = H * 0.66; // Moved center down to allow a bigger arc

    const startA = Math.PI;
    const sweepA = Math.PI * Math.min(progress, 1);
    const arcSegs = 100;
    const bands = SPECTRUM.length;

    // --- Offscreen buffer for clean compositing ---
    if (!rainbowBuffer || rainbowBuffer.width !== canvas.width || rainbowBuffer.height !== canvas.height) {
      rainbowBuffer = document.createElement('canvas');
      rainbowBuffer.width = canvas.width;
      rainbowBuffer.height = canvas.height;
      rbCtx = rainbowBuffer.getContext('2d');
    }
    rbCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rbCtx.clearRect(0, 0, W, H);

    // --- 3D Shadow layer removed ---
    rbCtx.globalAlpha = 1;

    // --- Main color bands (natural, darker) ---
    for (let b = 0; b < bands; b++) {
      const bFrac0 = b / bands;
      const bFrac1 = Math.min((b + 1.02) / bands, 1);
      const col = SPECTRUM[b];

      // Subtle vertical darkening for slight volume without looking plastic
      const bandMidR = baseR + totalBandWidth * ((bFrac0 + bFrac1) / 2);
      const topY = cy - bandMidR;
      const botY = cy;
      const grad = rbCtx.createLinearGradient(0, topY, 0, botY);
      
      const r = Math.max(0, col[0] - 20);
      const g = Math.max(0, col[1] - 20);
      const b_col = Math.max(0, col[2] - 20);
      
      const dr = Math.max(0, col[0] - 80);
      const dg = Math.max(0, col[1] - 80);
      const db_col = Math.max(0, col[2] - 80);

      grad.addColorStop(0, `rgb(${r},${g},${b_col})`);
      grad.addColorStop(1, `rgb(${dr},${dg},${db_col})`);

      rbCtx.fillStyle = grad;
      rbCtx.beginPath();
      for (let s = 0; s <= arcSegs; s++) {
        const af = s / arcSegs;
        const angle = startA + sweepA * af;
        const perspW = perspMin + (1 - perspMin) * af;
        const r = baseR + totalBandWidth * bFrac1 * perspW;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (s === 0) rbCtx.moveTo(x, y); else rbCtx.lineTo(x, y);
      }
      for (let s = arcSegs; s >= 0; s--) {
        const af = s / arcSegs;
        const angle = startA + sweepA * af;
        const perspW = perspMin + (1 - perspMin) * af;
        const r = baseR + totalBandWidth * bFrac0 * perspW;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        rbCtx.lineTo(x, y);
      }
      rbCtx.closePath();
      rbCtx.fill();
    }



    // --- Fade endpoints into sky ---
    rbCtx.globalCompositeOperation = 'destination-out';
    const fadeR = totalBandWidth * 2.8;

    const leftX = cx + Math.cos(startA) * (baseR + totalBandWidth * 0.5);
    const leftY = cy + Math.sin(startA) * (baseR + totalBandWidth * 0.5);
    const lg = rbCtx.createRadialGradient(leftX, leftY, 0, leftX, leftY, fadeR);
    lg.addColorStop(0, 'rgba(0,0,0,1)');
    lg.addColorStop(0.35, 'rgba(0,0,0,0.5)');
    lg.addColorStop(1, 'rgba(0,0,0,0)');
    rbCtx.fillStyle = lg;
    rbCtx.fillRect(leftX - fadeR, leftY - fadeR, fadeR * 2, fadeR * 2);

    const rightAngle = startA + sweepA;
    const rightX = cx + Math.cos(rightAngle) * (baseR + totalBandWidth * 0.5);
    const rightY = cy + Math.sin(rightAngle) * (baseR + totalBandWidth * 0.5);
    const rg = rbCtx.createRadialGradient(rightX, rightY, 0, rightX, rightY, fadeR);
    rg.addColorStop(0, 'rgba(0,0,0,1)');
    rg.addColorStop(0.35, 'rgba(0,0,0,0.5)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    rbCtx.fillStyle = rg;
    rbCtx.fillRect(rightX - fadeR, rightY - fadeR, fadeR * 2, fadeR * 2);
    rbCtx.globalCompositeOperation = 'source-over';

    // --- Composite onto main canvas ---
    ctx.drawImage(rainbowBuffer, 0, 0, canvas.width, canvas.height, 0, 0, W, H);
    
    // --- Fast Glow Effect ---
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.35;
    ctx.drawImage(rainbowBuffer, 0, 0, canvas.width, canvas.height, 0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1.0;



    // --- Continuous glitter on rainbow ---
    if (progress > 0.3 && Math.random() < 0.05) {
      const randomAngle = startA + Math.random() * sweepA;
      const bIdx = Math.floor(Math.random() * bands);
      const bMid = (bIdx + 0.5) / bands;
      const perspW = perspMin + (1 - perspMin) * ((randomAngle - startA) / Math.PI);
      const r = baseR + totalBandWidth * bMid * perspW;
      const px = cx + Math.cos(randomAngle) * r;
      const py = cy + Math.sin(randomAngle) * r;
      spawnParticle(px, py, 255, 255, 255);
    }

    // --- Trail particles while animating ---
    if (progress > 0.05 && progress < 0.95 && Math.random() < 0.5) {
      const edgeA = startA + sweepA;
      for (let p = 0; p < 1; p++) {
        const bIdx = Math.floor(Math.random() * bands);
        const bMid = (bIdx + 0.5) / bands;
        const perspW = perspMin + (1 - perspMin) * ((edgeA - startA) / Math.PI);
        const r = baseR + totalBandWidth * bMid * perspW;
        const px = cx + Math.cos(edgeA) * r;
        const py = cy + Math.sin(edgeA) * r;
        const ci = SPECTRUM[bIdx];
        spawnParticle(px, py, ci[0], ci[1], ci[2]);
      }
    }
  }

  // --- MODERN TEXT REVEAL ---
  function drawText(alpha, t) {
    if (alpha <= 0.01) return;

    const isMobile = W < 768;
    const rSize = isMobile ? Math.max(W * 0.085, 28) : Math.max(Math.min(W * 0.065, 85), 40); // Reduced size of "Rainbow"
    const textY_R = H * 0.62; // Shifted slightly up

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    const word1 = 'Rainbow';
    const word2 = 'Entertainment';

    // Measure Rainbow
    ctx.font = `bold ${rSize}px 'Georgia', 'Times New Roman', serif`;
    let rWidths = [];
    let totalRWidth = 0;
    const rTracking = rSize * 0.05;
    for (let i = 0; i < word1.length; i++) {
      const cw = ctx.measureText(word1[i]).width + rTracking;
      rWidths.push(cw);
      totalRWidth += cw;
    }
    totalRWidth -= rTracking;

    // Calculate rainbow right bound
    const maxRadius = Math.min(W * 0.48, H * 0.62);
    let baseR = maxRadius * 0.68;
    let totalBandWidth = maxRadius * 0.32;
    const perspMin = 0.3;
    const rainbowCenterOffset = (totalBandWidth * (1.0 - perspMin)) * 0.5;
    const rainbowCx = W * 0.5 - rainbowCenterOffset;

    // Inner left edge
    const rainbowInnerLeftEdge = rainbowCx - baseR;
    // Inner right edge
    const rainbowInnerRightEdge = rainbowCx + baseR;

    // 'Rainbow' starts at the inner left edge (inside the rainbow)
    const startX_R = rainbowInnerLeftEdge + (W * 0.02);
    
    // 'Entertainment' ends at the inner right edge
    let alignX_E = rainbowInnerRightEdge - (W * 0.02);

    // X-position of the start of 'i' in 'Rainbow' (third letter, index 2)
    const x_i = startX_R + rWidths[0] + rWidths[1];

    // Measure Entertainment at a base size of 100px to compute the required font size dynamically
    ctx.font = `bold 100px 'Georgia', 'Times New Roman', serif`;
    let totalEWidthAt100 = 0;
    const eTrackingAt100 = 100 * 0.05;
    for (let i = 0; i < word2.length; i++) {
      totalEWidthAt100 += ctx.measureText(word2[i]).width + eTrackingAt100;
    }
    totalEWidthAt100 -= eTrackingAt100;

    // Calculate required eSize to fit exactly between x_i and alignX_E
    const targetEWidth = alignX_E - x_i;
    const eSize = (targetEWidth / totalEWidthAt100) * 100;

    // Measure Entertainment again with the calculated dynamic eSize
    ctx.font = `bold ${eSize}px 'Georgia', 'Times New Roman', serif`;
    let eWidths = [];
    let totalEWidth = 0;
    const eTracking = eSize * 0.05;
    for (let i = 0; i < word2.length; i++) {
      const cw = ctx.measureText(word2[i]).width + eTracking;
      eWidths.push(cw);
      totalEWidth += cw;
    }
    totalEWidth -= eTracking;

    const textY_E = textY_R + rSize * 0.5 + eSize * 0.5 + 8;

    // Draw Rainbow
    let xPos = startX_R;
    ctx.font = `bold ${rSize}px 'Georgia', 'Times New Roman', serif`;
    for (let i = 0; i < word1.length; i++) {
      const cp = clamp01((alpha * 1.8) - (i * 0.04));
      if (cp > 0.01) {
        const easeCp = 1 - Math.pow(1 - cp, 4);
        ctx.globalAlpha = easeCp;
        ctx.save();
        ctx.translate(xPos + (rWidths[i] - rTracking) * 0.5, textY_R);
        const scale = 0.94 + 0.06 * easeCp;
        ctx.scale(scale, scale);

        const col = SPECTRUM[6 - i];
        ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
        ctx.fillText(word1[i], -(rWidths[i] - rTracking) * 0.5, 0);
        ctx.restore();
      }
      xPos += rWidths[i];
    }

    // Draw Entertainment
    let xPosE = alignX_E - totalEWidth;
    ctx.font = `bold ${eSize}px 'Georgia', 'Times New Roman', serif`;
    for (let i = 0; i < word2.length; i++) {
      const cp = clamp01((alpha * 1.8) - ((word1.length + i) * 0.02));
      if (cp > 0.01) {
        const easeCp = 1 - Math.pow(1 - cp, 4);
        ctx.globalAlpha = easeCp;
        ctx.save();
        ctx.translate(xPosE + (eWidths[i] - eTracking) * 0.5, textY_E);
        const scale = 0.94 + 0.06 * easeCp;
        ctx.scale(scale, scale);

        ctx.fillStyle = '#4a86e8'; // Match blue in image
        ctx.fillText(word2[i], -(eWidths[i] - eTracking) * 0.5, 0);
        ctx.restore();
      }
      xPosE += eWidths[i];
    }

    ctx.restore();
  }

  // --- SKY ---
  let skyGrad = null;
  function drawSky() {
    if (!skyGrad) {
      skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#C8CDD5');
      skyGrad.addColorStop(0.4, '#D5D9E0');
      skyGrad.addColorStop(0.85, '#DDE1E6');
      skyGrad.addColorStop(1, '#DDE1E6');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);
  }

  // --- EASING ---
  function easeInOutQuad(x) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2,2)/2; }
  function easeOutCubic(x) { return 1 - Math.pow(1-x, 3); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // --- RESIZE ---
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    skyGrad = null;
    rainbowBuffer = null;
    initClouds();
  }

  // --- MAIN LOOP ---
  function render(now) {
    const t = (now - startTime) / 1000;
    ctx.clearRect(0, 0, W, H);
    drawSky();

    const starsA = clamp01((t - T.starsIn) / 2);
    const cloudsA = clamp01((t - T.cloudsIn) / 2);
    const rainbowP = easeInOutQuad(clamp01((t - T.rainbowStart) / (T.rainbowEnd - T.rainbowStart)));
    const textA = easeOutCubic(clamp01((t - T.textIn) / 1.8));

    drawStaticCloudAndStars(t, cloudsA);
    drawRainbow(rainbowP, t);
    drawParticles();
    drawText(textA, t);

    animFrame = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  animFrame = requestAnimationFrame(render);
  window.addEventListener('beforeunload', () => cancelAnimationFrame(animFrame));
})();
