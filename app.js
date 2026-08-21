/* =========================================================
   ANNY - MOTOR INTERACTIVO PINK PUNK & TRIBUTO A LA LÍDER Y ARTISTA
   Paleta: #c594aa, #fdcae1, #ffe5f0, #4c007d, #7f00b2
   ========================================================= */

(function () {
  'use strict';

  // --- SINTETIZADOR DE AUDIO PUNK (Web Audio API) ---
  class PunkAudioFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playHeartbeat() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      this._subKick(now, 80, 0.18);
      this._subKick(now + 0.18, 95, 0.25);
    }

    _subKick(startTime, freq, duration) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(30, startTime + duration);

      gain.gain.setValueAtTime(0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    playPowerChord() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [164.81, 246.94, 329.63, 659.25];

      freqs.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const distortion = this.ctx.createWaveShaper();

        distortion.curve = this._makeDistortionCurve(180);
        distortion.oversample = '4x';

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(distortion);
        distortion.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
      });
    }

    playSparkle() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((note, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now + idx * 0.06);

        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    }

    playPop() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    _makeDistortionCurve(amount) {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }
  }

  const audio = new PunkAudioFX();

  // --- MOTOR DE PARTÍCULAS CANVAS DE FONDO ---
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  const punkColors = ['#c594aa', '#fdcae1', '#ffe5f0', '#7f00b2', '#4c007d'];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, type = 'dot', vx = null, vy = null) {
      this.x = x;
      this.y = y;
      this.type = type; // 'heart', 'star', 'spark', 'dot'
      this.vx = vx !== null ? vx : (Math.random() - 0.5) * 3.5;
      this.vy = vy !== null ? vy : (Math.random() - 0.5) * 3.5;
      this.size = type === 'heart' ? Math.random() * 18 + 12 : Math.random() * 6 + 2;
      this.color = punkColors[Math.floor(Math.random() * punkColors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.03;
      this.alpha -= this.decay;
      this.rotation += this.rotSpeed;
    }

    draw(c) {
      if (this.alpha <= 0) return;
      c.save();
      c.globalAlpha = Math.max(0, this.alpha);
      c.translate(this.x, this.y);
      c.rotate(this.rotation);

      if (this.type === 'heart') {
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 10;
        c.beginPath();
        const s = this.size / 15;
        c.moveTo(0, 0);
        c.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, -15 * s, 5 * s);
        c.bezierCurveTo(-15 * s, 15 * s, 0, 20 * s, 0, 25 * s);
        c.bezierCurveTo(0, 20 * s, 15 * s, 15 * s, 15 * s, 5 * s);
        c.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
        c.fill();
      } else if (this.type === 'star') {
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 12;
        const s = this.size;
        c.beginPath();
        c.moveTo(0, -s);
        c.lineTo(s * 0.3, -s * 0.3);
        c.lineTo(s, 0);
        c.lineTo(s * 0.3, s * 0.3);
        c.lineTo(0, s);
        c.lineTo(-s * 0.3, s * 0.3);
        c.lineTo(-s, 0);
        c.lineTo(-s * 0.3, -s * 0.3);
        c.closePath();
        c.fill();
      } else {
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 6;
        c.beginPath();
        c.arc(0, 0, this.size, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    }
  }

  function spawnBurst(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const types = ['heart', 'spark', 'star', 'dot'];
      const type = types[Math.floor(Math.random() * types.length)];
      particles.push(new Particle(x, y, type, vx, vy));
    }
  }

  function addAmbientParticles() {
    if (particles.length < 50 && Math.random() < 0.35) {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 10;
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = -(Math.random() * 2 + 1);
      const p = new Particle(x, y, Math.random() < 0.5 ? 'heart' : 'spark', vx, vy);
      p.decay = 0.004;
      particles.push(p);
    }
  }

  function animateCanvas() {
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      addAmbientParticles();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  requestAnimationFrame(animateCanvas);

  // --- ORQUESTACIÓN DE LA INTRODUCCIÓN (CORAZÓN -> REVELACIÓN ANNY) ---
  const introOverlay = document.getElementById('intro-overlay');
  const heartWrapper = document.getElementById('heart-wrapper');
  const heartPath = document.getElementById('heart-path');
  const shockwave1 = document.querySelector('.shockwave-1');
  const shockwave2 = document.querySelector('.shockwave-2');
  const titleRevealBox = document.getElementById('title-reveal-box');
  const enterUniverseBtn = document.getElementById('enter-universe-btn');
  const replayBtn = document.getElementById('replay-btn');

  let introTimeout = null;

  function runIntroSequence() {
    clearTimeout(introTimeout);
    introOverlay.classList.remove('hidden-intro');
    heartWrapper.style.display = 'flex';
    heartWrapper.classList.remove('heart-exploding');
    titleRevealBox.classList.add('hidden');
    titleRevealBox.classList.remove('show');

    if (heartPath) {
      heartPath.style.animation = 'none';
      void heartPath.offsetHeight;
      heartPath.style.animation = 'draw-heart-stroke 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }

    setTimeout(() => {
      audio.playHeartbeat();
      if (shockwave1) shockwave1.classList.add('active');
    }, 800);

    setTimeout(() => {
      audio.playHeartbeat();
      if (shockwave2) shockwave2.classList.add('active');
    }, 1600);

    setTimeout(() => {
      audio.playSparkle();
    }, 2200);

    setTimeout(() => {
      heartWrapper.classList.add('heart-exploding');

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      spawnBurst(cx, cy, 70);
      audio.playPowerChord();

      setTimeout(() => {
        heartWrapper.style.display = 'none';
        titleRevealBox.classList.remove('hidden');
        void titleRevealBox.offsetHeight;
        titleRevealBox.classList.add('show');
        spawnBurst(cx, cy, 40);
      }, 400);
    }, 2800);
  }

  window.addEventListener('DOMContentLoaded', () => {
    runIntroSequence();
    initSketchStudio();
  });

  if (enterUniverseBtn) {
    enterUniverseBtn.addEventListener('click', () => {
      audio.playPowerChord();
      introOverlay.classList.add('hidden-intro');
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 60);

      setTimeout(() => {
        const photoSection = document.getElementById('photo-spotlight-section');
        if (photoSection) {
          photoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      audio.playPop();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      runIntroSequence();
    });
  }

  // --- CARGA DE FOTO DE ANNY EN TIEMPO REAL ---
  const photoFileInput = document.getElementById('photo-file-input');
  const annyMainPhoto = document.getElementById('anny-main-photo');

  if (photoFileInput && annyMainPhoto) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          annyMainPhoto.src = event.target.result;
          audio.playSparkle();
          const rect = annyMainPhoto.getBoundingClientRect();
          spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- ESTUDIO DE DIBUJO NEÓN INTERACTIVO ---
  function initSketchStudio() {
    const sketchCanvas = document.getElementById('sketch-canvas');
    if (!sketchCanvas) return;
    const sCtx = sketchCanvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#fdcae1';
    let lastX = 0;
    let lastY = 0;

    function resizeSketchCanvas() {
      const rect = sketchCanvas.parentElement.getBoundingClientRect();
      sketchCanvas.width = rect.width;
      sketchCanvas.height = 340;
    }
    resizeSketchCanvas();
    window.addEventListener('resize', resizeSketchCanvas);

    function getCoords(e) {
      const rect = sketchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const pos = getCoords(e);
      lastX = pos.x;
      lastY = pos.y;
      audio.playPop();
    }

    function draw(e) {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getCoords(e);

      sCtx.strokeStyle = currentColor;
      sCtx.shadowColor = currentColor;
      sCtx.shadowBlur = 12;
      sCtx.lineWidth = 4;
      sCtx.lineCap = 'round';
      sCtx.lineJoin = 'round';

      sCtx.beginPath();
      sCtx.moveTo(lastX, lastY);
      sCtx.lineTo(pos.x, pos.y);
      sCtx.stroke();

      lastX = pos.x;
      lastY = pos.y;

      if (Math.random() < 0.2) {
        particles.push(new Particle(e.clientX || (e.touches && e.touches[0].clientX), e.clientY || (e.touches && e.touches[0].clientY), 'spark'));
      }
    }

    function stopDraw() {
      isDrawing = false;
    }

    sketchCanvas.addEventListener('mousedown', startDraw);
    sketchCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    sketchCanvas.addEventListener('touchstart', startDraw, { passive: false });
    sketchCanvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);

    const brushBtns = document.querySelectorAll('.brush-btn');
    brushBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        brushBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.getAttribute('data-color');
        audio.playPop();
      });
    });

    const clearBtn = document.getElementById('clear-sketch-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
        audio.playSparkle();
      });
    }

    const saveBtn = document.getElementById('save-sketch-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'arte-para-anny.png';
        link.href = sketchCanvas.toDataURL();
        link.click();
        audio.playPowerChord();
        spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
      });
    }
  }

  // --- INTERACCIÓN GLOBAL CON CLICK (PARTÍCULAS & GRAFFITI) ---
  window.addEventListener('pointerdown', (e) => {
    if (['BUTTON', 'INPUT', 'LABEL', 'A', 'CANVAS'].includes(e.target.tagName)) return;
    spawnBurst(e.clientX, e.clientY, 20);
    audio.playPop();
  });

  // --- BOTONES DE ACCIÓN PRINCIPALES ---
  const blastHeartsBtn = document.getElementById('blast-hearts-btn');
  if (blastHeartsBtn) {
    blastHeartsBtn.addEventListener('click', (e) => {
      const rect = blastHeartsBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      spawnBurst(cx, cy, 60);
      audio.playPowerChord();
    });
  }

  const guitarRiffBtn = document.getElementById('guitar-riff-btn');
  if (guitarRiffBtn) {
    guitarRiffBtn.addEventListener('click', () => {
      audio.playPowerChord();
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 45);
    });
  }

  // Like buttons
  const likeBtns = document.querySelectorAll('.like-heart-btn');
  likeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countEl = btn.querySelector('.like-count');
      let current = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = current + 1;
      audio.playSparkle();
      const rect = btn.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 18);
    });
  });

  // --- CASSETTE MUSICAL ---
  const cassetteBtn = document.getElementById('cassette-play-btn');
  const cassetteStatus = document.getElementById('cassette-status');
  const wheels = document.querySelectorAll('.wheel');
  let isPlayingCassette = false;
  let cassetteInterval = null;

  if (cassetteBtn) {
    cassetteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPlayingCassette = !isPlayingCassette;
      if (isPlayingCassette) {
        cassetteBtn.textContent = '⏸ PAUSAR RITMO';
        cassetteStatus.textContent = 'SONANDO ⚡';
        cassetteStatus.style.color = '#fdcae1';
        wheels.forEach((w) => w.classList.add('spinning'));

        audio.playPowerChord();
        cassetteInterval = setInterval(() => {
          audio.playHeartbeat();
        }, 800);
      } else {
        cassetteBtn.textContent = '▶ ACTIVAR RITMO';
        cassetteStatus.textContent = 'EN PAUSA';
        cassetteStatus.style.color = '#c594aa';
        wheels.forEach((w) => w.classList.remove('spinning'));
        clearInterval(cassetteInterval);
      }
    });
  }

  // --- CREADOR DE NOTAS PERSONALIZADAS ---
  const customNoteInput = document.getElementById('custom-note-input');
  const addNoteBtn = document.getElementById('add-note-btn');
  const dynamicStickersContainer = document.getElementById('dynamic-stickers-container');

  function createCustomSticker() {
    const text = customNoteInput.value.trim();
    if (!text) return;

    const tilts = ['tilt-left', 'tilt-right'];
    const randomTilt = tilts[Math.floor(Math.random() * tilts.length)];

    const card = document.createElement('div');
    card.className = `punk-card sticker-card ${randomTilt}`;
    card.innerHTML = `
      <div class="tape-strip mini-tape pink-tape">MENSAJE ESPECIAL ⚡</div>
      <div class="sticker-badge">PARA ANNY</div>
      <h4 class="card-title">★ RECUERDO</h4>
      <p style="font-size: 1.1rem; color: #ffe5f0;">"${text}"</p>
      <div class="card-footer">
        <span class="punk-hashtag">#AnnyBrillante</span>
        <button class="punk-mini-btn" onclick="this.closest('.sticker-card').remove()">🗑️ QUITAR</button>
      </div>
    `;

    dynamicStickersContainer.prepend(card);
    customNoteInput.value = '';
    audio.playSparkle();

    const rect = card.getBoundingClientRect();
    spawnBurst(rect.left + 100, rect.top + 50, 25);
  }

  if (addNoteBtn && customNoteInput) {
    addNoteBtn.addEventListener('click', createCustomSticker);
    customNoteInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        createCustomSticker();
      }
    });
  }

  // --- CONTROL DE AUDIO ON/OFF ---
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      if (audio.enabled) {
        soundIcon.textContent = '🔊';
        soundLabel.textContent = 'FX: ON';
        audio.playPop();
      } else {
        soundIcon.textContent = '🔇';
        soundLabel.textContent = 'FX: OFF';
      }
    });
  }

  // --- CURSOR PERSONALIZADO ---
  const cursor = document.getElementById('punk-cursor');
  const cursorDot = document.getElementById('punk-cursor-dot');

  window.addEventListener('pointermove', (e) => {
    if (cursor && cursorDot) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    }

    if (Math.random() < 0.15) {
      particles.push(new Particle(e.clientX, e.clientY, 'dot', (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
    }
  });
})();
