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

  // --- STARS ---
  const stars = [];
  function initStars() {
    stars.length = 0;
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random(), y: Math.random() * 0.85,
        r: Math.random() * 1.3 + 0.5,
        phase: Math.random() * 6.28,
        speed: Math.random() * 2.5 + 0.8,
        bright: Math.random() * 0.5 + 0.5
      });
    }
  }

  function drawStars(t, alpha) {
    if (alpha <= 0) return;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const a = alpha * s.bright * (0.4 + 0.6 * Math.sin(t * s.speed + s.phase));
      if (a < 0.03) continue;
      const px = s.x * W, py = s.y * H;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, 6.28);
      ctx.fill();
      if (s.bright > 0.85 && a > 0.45) {
        ctx.globalAlpha = a * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, s.r * 3, 0, 6.28);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // --- CLOUDS ---
  const cloudCanvas = document.createElement('canvas');
  function initCloudTexture() {
    cloudCanvas.width = 256;
    cloudCanvas.height = 128;
    const c = cloudCanvas.getContext('2d');
    const puffs = [
      {x:80,y:70,r:40},{x:128,y:55,r:55},{x:180,y:75,r:35},
      {x:100,y:90,r:30},{x:150,y:85,r:35},{x:60,y:90,r:25},{x:200,y:85,r:25}
    ];
    for (const p of puffs) {
      const g = c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      g.addColorStop(0,'rgba(200,205,220,1)');
      g.addColorStop(0.5,'rgba(200,205,220,0.6)');
      g.addColorStop(1,'rgba(200,205,220,0)');
      c.fillStyle = g;
      c.beginPath();
      c.arc(p.x,p.y,p.r,0,6.28);
      c.fill();
    }
  }
  initCloudTexture();

  const clouds = [];
  function initClouds() {
    clouds.length = 0;
    for (let i = 0; i < 10; i++) {
      const layer = i < 4 ? 0 : i < 7 ? 1 : 2;
      clouds.push({
        x: Math.random(),
        y: 0.15 + Math.random() * 0.55,
        w: 250 + Math.random() * 300 + layer * 100,
        h: 80 + Math.random() * 60 + layer * 20,
        speed: (layer + 1) * 0.003 + Math.random() * 0.002,
        opacity: 0.05 + layer * 0.03
      });
    }
  }

  function drawClouds(t, alpha) {
    if (alpha <= 0) return;
    for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i];
      const cx = ((c.x + c.speed * t) % 1.5 - 0.25) * W;
      ctx.globalAlpha = alpha * c.opacity;
      ctx.drawImage(cloudCanvas, cx - c.w/2, c.y*H - c.h/2, c.w, c.h);
    }
    ctx.globalAlpha = 1;
  }

  // --- PARTICLES ---
  const particles = [];
  function spawnParticle(x, y, r, g, b) {
    if (particles.length > 80) return;
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.4,
      life: 1, decay: 0.012 + Math.random() * 0.01,
      sz: Math.random() * 2.2 + 0.6,
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

    const cx = W * 0.5;
    const cy = H * 0.56; // Moved down from 0.52
    const baseR = Math.min(W, H) * 0.38;
    const totalBandWidth = Math.min(W, H) * 0.18;
    const startA = Math.PI;
    const sweepA = Math.PI * Math.min(progress, 1);
    const perspMin = 0.3; // Left small, right big — preserved
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

    // --- 3D Shadow layer (dark offset beneath each band) ---
    const shadowOff = totalBandWidth * 0.06;
    rbCtx.globalAlpha = 0.3;
    for (let b = 0; b < bands; b++) {
      const bFrac0 = b / bands;
      const bFrac1 = Math.min((b + 1.02) / bands, 1);
      rbCtx.fillStyle = '#000';
      rbCtx.beginPath();
      for (let s = 0; s <= arcSegs; s++) {
        const af = s / arcSegs;
        const angle = startA + sweepA * af;
        const perspW = perspMin + (1 - perspMin) * af;
        const r = baseR + totalBandWidth * bFrac1 * perspW;
        const x = cx + Math.cos(angle) * r + shadowOff;
        const y = cy + Math.sin(angle) * r + shadowOff;
        if (s === 0) rbCtx.moveTo(x, y); else rbCtx.lineTo(x, y);
      }
      for (let s = arcSegs; s >= 0; s--) {
        const af = s / arcSegs;
        const angle = startA + sweepA * af;
        const perspW = perspMin + (1 - perspMin) * af;
        const r = baseR + totalBandWidth * bFrac0 * perspW;
        const x = cx + Math.cos(angle) * r + shadowOff;
        const y = cy + Math.sin(angle) * r + shadowOff;
        rbCtx.lineTo(x, y);
      }
      rbCtx.closePath();
      rbCtx.fill();
    }
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



    // --- Trail particles while animating ---
    if (progress > 0.05 && progress < 0.95) {
      const edgeA = startA + sweepA;
      for (let p = 0; p < 2; p++) {
        const bIdx = Math.floor(Math.random() * bands);
        const bMid = (bIdx + 0.5) / bands;
        const perspW = perspMin + (1 - perspMin);
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

    const textY = H * 0.63; // Moved up from 0.68 to close the gap
    const fontSize = Math.max(Math.min(W * 0.055, 64), 22);
    const text = 'Rainbow Entertainment';

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = `400 ${fontSize}px 'Inter', 'Helvetica Neue', sans-serif`;

    const charWidths = [];
    let actualTotalWidth = 0;
    const tracking = fontSize * 0.12;

    for (let i = 0; i < text.length; i++) {
      const isSpace = text[i] === ' ';
      const cw = ctx.measureText(text[i]).width + (isSpace ? tracking * 1.5 : tracking);
      charWidths.push(cw);
      actualTotalWidth += cw;
    }
    actualTotalWidth -= tracking;

    ctx.textAlign = 'left';

    const totalBandWidth = Math.min(W, H) * 0.18;
    const perspMin = 0.3;
    const rainbowCenterOffset = (totalBandWidth * (1.0 - perspMin)) * 0.5;
    const textCenterX = W * 0.5 + rainbowCenterOffset;

    let xPos = textCenterX - actualTotalWidth * 0.5;
    for (let i = 0; i < text.length; i++) {
      const isRainbow = i < 7;
      const cp = clamp01((alpha * 1.8) - (i * 0.04));
      if (cp > 0.01) {
        const easeCp = 1 - Math.pow(1 - cp, 4);

        if (cp > 0.1 && cp < 0.9 && Math.random() < 0.12) {
          spawnParticle(
            xPos + Math.random() * (charWidths[i] - tracking),
            textY + (Math.random() - 0.5) * fontSize,
            255, 255, 255
          );
        }

        ctx.globalAlpha = easeCp;
        ctx.save();
        ctx.translate(xPos + (charWidths[i] - tracking) * 0.5, textY);
        const scale = 0.94 + 0.06 * easeCp;
        ctx.scale(scale, scale);

        const grad = ctx.createLinearGradient(0, -fontSize * 0.5, 0, fontSize * 0.5);
        if (isRainbow) {
          const col = SPECTRUM[6 - i];
          grad.addColorStop(0, `rgb(${Math.min(255,col[0]+100)},${Math.min(255,col[1]+100)},${Math.min(255,col[2]+100)})`);
          grad.addColorStop(0.5, `rgb(${col[0]},${col[1]},${col[2]})`);
          grad.addColorStop(1, `rgb(${Math.max(0,col[0]-60)},${Math.max(0,col[1]-60)},${Math.max(0,col[2]-60)})`);
          ctx.fillStyle = grad;
          ctx.shadowColor = `rgba(${col[0]},${col[1]},${col[2]},${1-easeCp})`;
          ctx.shadowBlur = 15 * (1 - easeCp);
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.7, '#cccccc');
          grad.addColorStop(1, '#888888');
          ctx.fillStyle = grad;
          ctx.shadowColor = `rgba(255,255,255,${1-easeCp})`;
          ctx.shadowBlur = 12 * (1 - easeCp);
        }

        ctx.fillText(text[i], -(charWidths[i] - tracking) * 0.5, 0);
        ctx.restore();
      }
      xPos += charWidths[i];
    }

    // Shimmer
    if (alpha > 0.5) {
      const sweepPhase = (t * 0.35) % 1;
      const sweepX = W * (-0.1 + sweepPhase * 1.2);
      const shimW = W * 0.1;
      ctx.globalAlpha = 0.3 * alpha;
      const sh = ctx.createLinearGradient(sweepX - shimW, textY, sweepX + shimW, textY);
      sh.addColorStop(0, 'rgba(255,255,255,0)');
      sh.addColorStop(0.5, 'rgba(255,255,255,1)');
      sh.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = sh;

      let shimXPos = textCenterX - actualTotalWidth * 0.5;
      for (let i = 0; i < text.length; i++) {
        const cp = clamp01((alpha * 1.8) - (i * 0.04));
        const easeCp = 1 - Math.pow(1 - cp, 4);
        ctx.save();
        ctx.translate(shimXPos + (charWidths[i] - tracking) * 0.5, textY);
        const scale = 0.94 + 0.06 * easeCp;
        ctx.scale(scale, scale);
        ctx.fillText(text[i], -(charWidths[i] - tracking) * 0.5, 0);
        ctx.restore();
        shimXPos += charWidths[i];
      }
      ctx.globalCompositeOperation = 'source-over';
    }

    // Cinematic light flare underline
    if (alpha > 0.55) {
      const la = clamp01((alpha - 0.55) * 2.5);
      const lw = actualTotalWidth * 1.1 * la;
      const ug = ctx.createRadialGradient(textCenterX, textY + fontSize * 0.7, 0, textCenterX, textY + fontSize * 0.7, lw * 0.5);
      ug.addColorStop(0, `rgba(255,255,255,${0.5*la})`);
      ug.addColorStop(0.2, `rgba(180,200,255,${0.25*la})`);
      ug.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = ug;
      ctx.fillRect(textCenterX - lw * 0.5, textY + fontSize * 0.7 - 2, lw, 4);
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // --- SKY ---
  let skyGrad = null;
  function drawSky() {
    if (!skyGrad) {
      skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#0e0e20');
      skyGrad.addColorStop(0.4, '#141430');
      skyGrad.addColorStop(0.85, '#1a1a2e');
      skyGrad.addColorStop(1, '#1a1a2e');
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
    initStars();
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

    drawStars(t, starsA);
    drawClouds(t, cloudsA);
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
