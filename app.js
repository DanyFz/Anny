/* =========================================================
   ANNY - PINK PUNK INTERACTIVE ENGINE (app.js)
   Paleta: #c594aa, #fdcae1, #ffe5f0, #4c007d, #7f00b2
   ========================================================= */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
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
      // Golpe 1 (Bajo sordo)
      this._subKick(now, 75, 0.18);
      // Golpe 2 (Pulso resonante)
      this._subKick(now + 0.18, 90, 0.25);
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
      // Frecuencias para acorde de quinta Punk (E / E5 punk)
      const freqs = [164.81, 246.94, 329.63, 659.25];

      freqs.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const distortion = this.ctx.createWaveShaper();

        // Distorsión Punk saturada
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
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
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
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

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

  // --- CANVAS DE PARTÍCULAS PUNK & CORAZONES ---
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
      this.type = type; // 'dot', 'heart', 'spark', 'star'
      this.vx = vx !== null ? vx : (Math.random() - 0.5) * 3;
      this.vy = vy !== null ? vy : (Math.random() - 0.5) * 3;
      this.size = type === 'heart' ? Math.random() * 16 + 10 : Math.random() * 6 + 2;
      this.color = punkColors[Math.floor(Math.random() * punkColors.length)];
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.03; // Gravedad sutil
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
        // Dibujar corazón punk
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 8;
        c.beginPath();
        const s = this.size / 15;
        c.moveTo(0, 0);
        c.bezierCurveTo(-5 * s, -10 * s, -15 * s, -5 * s, -15 * s, 5 * s);
        c.bezierCurveTo(-15 * s, 15 * s, 0, 20 * s, 0, 25 * s);
        c.bezierCurveTo(0, 20 * s, 15 * s, 15 * s, 15 * s, 5 * s);
        c.bezierCurveTo(15 * s, -5 * s, 5 * s, -10 * s, 0, 0);
        c.fill();
      } else if (this.type === 'star') {
        // Estrella punk de 4 puntas
        c.fillStyle = this.color;
        c.shadowColor = this.color;
        c.shadowBlur = 10;
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
        // Chispa / punto de neón
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

  // Floating background ambient particles
  function addAmbientParticles() {
    if (particles.length < 50 && Math.random() < 0.3) {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 10;
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = -(Math.random() * 2 + 1);
      const p = new Particle(x, y, Math.random() < 0.4 ? 'heart' : 'spark', vx, vy);
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

  // --- SECUENCIA DE INTRODUCCIÓN (CORAZÓN -> REVELACIÓN ANNY) ---
  const introOverlay = document.getElementById('intro-overlay');
  const heartWrapper = document.getElementById('heart-wrapper');
  const heartPath = document.getElementById('heart-path');
  const introStatusText = document.getElementById('intro-status-text');
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

    // Reiniciar trazado del corazón
    if (heartPath) {
      heartPath.style.animation = 'none';
      void heartPath.offsetHeight; // Trigger reflow
      heartPath.style.animation = 'draw-heart-stroke 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    }

    if (introStatusText) {
      introStatusText.innerHTML = '<span class="glitch-text" data-text="GENERATING CORE...">GENERATING CORE...</span>';
    }

    // Paso 1: Pulsos de sonido y shockwaves mientras se dibuja
    setTimeout(() => {
      audio.playHeartbeat();
      if (shockwave1) shockwave1.classList.add('active');
    }, 800);

    setTimeout(() => {
      audio.playHeartbeat();
      if (shockwave2) shockwave2.classList.add('active');
    }, 1600);

    // Paso 2: Finalización del corazón y preparación de explosión
    setTimeout(() => {
      if (introStatusText) {
        introStatusText.innerHTML = '<span class="glitch-text" data-text="★ ANNY DETECTED ⚡ ★">★ ANNY DETECTED ⚡ ★</span>';
      }
      audio.playSparkle();
    }, 2200);

    // Paso 3: Explosión del corazón en partículas y revelación de ANNY
    setTimeout(() => {
      heartWrapper.classList.add('heart-exploding');

      // Explosión central en el canvas
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
    }, 3000);
  }

  // Iniciar al cargar
  window.addEventListener('DOMContentLoaded', () => {
    runIntroSequence();
  });

  // Botón de entrar al universo
  if (enterUniverseBtn) {
    enterUniverseBtn.addEventListener('click', () => {
      audio.playPowerChord();
      introOverlay.classList.add('hidden-intro');
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
    });
  }

  // Botón de replay
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      audio.playPop();
      runIntroSequence();
    });
  }

  // --- INTERACCIÓN GLOBAL CON CLICK (PARTÍCULAS & GRAFFITI) ---
  window.addEventListener('pointerdown', (e) => {
    // Si no es un botón o input
    if (['BUTTON', 'INPUT', 'A'].includes(e.target.tagName)) return;
    spawnBurst(e.clientX, e.clientY, 20);
    audio.playPop();
  });

  // --- BOTONES DE HERO & ACCIONES ---
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
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
    });
  }

  // Copiar código hex al hacer clic en las muestras de color
  const colorChips = document.querySelectorAll('.color-chip');
  colorChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const hex = chip.getAttribute('data-hex');
      if (hex && navigator.clipboard) {
        navigator.clipboard.writeText(hex);
        const originalName = chip.querySelector('.chip-name').textContent;
        chip.querySelector('.chip-name').textContent = '¡COPIADO!';
        audio.playSparkle();
        setTimeout(() => {
          chip.querySelector('.chip-name').textContent = originalName;
        }, 1200);
      }
    });
  });

  // Like button interactivo
  const likeBtn = document.querySelector('.like-heart-btn');
  if (likeBtn) {
    likeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const countEl = likeBtn.querySelector('.like-count');
      let current = parseInt(countEl.textContent, 10) || 0;
      countEl.textContent = current + 1;
      audio.playSparkle();
      const rect = likeBtn.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 15);
    });
  }

  // --- REPRODUCTOR DE CASSETTE VISUAL ---
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
        cassetteBtn.textContent = '⏸ PAUSE BEAT';
        cassetteStatus.textContent = 'PLAYING ⚡';
        cassetteStatus.style.color = '#fdcae1';
        wheels.forEach((w) => w.classList.add('spinning'));

        // Reproducir riff rítmico
        audio.playPowerChord();
        cassetteInterval = setInterval(() => {
          audio.playHeartbeat();
        }, 800);
      } else {
        cassetteBtn.textContent = '▶ PLAY BEAT';
        cassetteStatus.textContent = 'STOPPED';
        cassetteStatus.style.color = '#c594aa';
        wheels.forEach((w) => w.classList.remove('spinning'));
        clearInterval(cassetteInterval);
      }
    });
  }

  // --- CREADOR DE STICKERS / NOTAS PERSONALIZADAS ---
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
      <div class="tape-strip mini-tape pink-tape">ANNY FAN ⚡</div>
      <div class="sticker-badge">NEW!</div>
      <h4 class="card-title">★ PUNK NOTE</h4>
      <p style="font-size: 1.1rem; color: #ffe5f0;">"${text}"</p>
      <div class="card-footer">
        <span class="punk-hashtag">#AnnyRebel</span>
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

  // --- CURSOR PUNK PERSONALIZADO ---
  const cursor = document.getElementById('punk-cursor');
  const cursorDot = document.getElementById('punk-cursor-dot');

  window.addEventListener('pointermove', (e) => {
    if (cursor && cursorDot) {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    }

    // Efecto estela de partículas ocasionales
    if (Math.random() < 0.15) {
      particles.push(new Particle(e.clientX, e.clientY, 'dot', (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
    }
  });
})();
