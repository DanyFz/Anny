/* =========================================================
   ANNY - MOTOR INTERACTIVO PINK PUNK & CARTAS DEL TAROT
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

    playJump() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    playCoin() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    }

    playCrash() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
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
      this.type = type;
      this.vx = vx !== null ? vx : (Math.random() - 0.5) * 3.5;
      this.vy = vy !== null ? vy : (Math.random() - 0.5) * 3.5;
      this.size = type === 'heart' ? Math.random() * 16 + 10 : Math.random() * 5 + 2;
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

  // --- ORQUESTACIÓN DE LA INTRODUCCIÓN ---
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
    initFlipCards();
  });

  // --- MÚSICA DE FONDO (Sally Face) ---
  const bgMusic = document.getElementById('bg-music');
  let bgMusicStarted = false;

  function startBgMusic() {
    if (bgMusic && !bgMusicStarted) {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(() => {});
      bgMusicStarted = true;
    }
  }

  if (enterUniverseBtn) {
    enterUniverseBtn.addEventListener('click', () => {
      audio.playPowerChord();
      introOverlay.classList.add('hidden-intro');
      spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 60);

      // Arrancar música de fondo al entrar
      startBgMusic();

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

  // --- CARGA DE FOTO EN TIEMPO REAL ---
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

  // --- CARTAS DEL TAROT DE ANNY ---
  function initFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    const revealedCountEl = document.getElementById('revealed-count');
    const deckUnlockedMessage = document.getElementById('deck-unlocked-message');
    const discoveredSet = new Set();

    flipCards.forEach((card) => {
      card.addEventListener('click', () => {
        const isFlipped = card.classList.toggle('is-flipped');
        const cardId = card.getAttribute('data-card-id');
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        if (isFlipped) {
          audio.playSparkle();
          spawnBurst(cx, cy, 25);
          discoveredSet.add(cardId);
        } else {
          audio.playPop();
        }

        if (revealedCountEl) {
          revealedCountEl.textContent = discoveredSet.size;
        }

        if (discoveredSet.size === 6 && deckUnlockedMessage) {
          setTimeout(() => {
            deckUnlockedMessage.classList.remove('hidden');
            audio.playPowerChord();
            spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 80);
          }, 400);
        }
      });
    });
  }

  // --- INTERACCIÓN GLOBAL CON CLICK ---
  window.addEventListener('pointerdown', (e) => {
    if (['BUTTON', 'INPUT', 'LABEL', 'A', '.flip-card'].some(sel => e.target.closest(sel))) return;
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
      audio.playSparkle();
      const rect = btn.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 18);
    });
  });

  // --- CASSETTE ---
  const cassetteBtn = document.getElementById('cassette-play-btn');
  const cassetteStatus = document.getElementById('cassette-status');
  const customAudio = document.getElementById('anny-custom-audio');
  const wheels = document.querySelectorAll('.wheel');
  let isPlayingCassette = false;

  if (cassetteBtn) {
    cassetteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isPlayingCassette = !isPlayingCassette;
      
      if (isPlayingCassette) {
        cassetteBtn.textContent = 'PAUSAR';
        cassetteStatus.textContent = 'REPRODUCIENDO';
        cassetteStatus.style.color = '#fdcae1';
        wheels.forEach((w) => w.classList.add('spinning'));

        // Pausar música de fondo
        if (bgMusic) bgMusic.pause();

        // Reproducir canción del cassette
        if (customAudio) {
          customAudio.currentTime = 0;
          customAudio.volume = 0.7;
          customAudio.play().catch(() => {});
        }
      } else {
        cassetteBtn.textContent = 'REPRODUCIR';
        cassetteStatus.textContent = 'EN PAUSA';
        cassetteStatus.style.color = '#c594aa';
        wheels.forEach((w) => w.classList.remove('spinning'));

        // Pausar cassette
        if (customAudio) customAudio.pause();

        // Reanudar música de fondo
        if (bgMusic && bgMusicStarted && audio.enabled) {
          bgMusic.play().catch(() => {});
        }
      }
    });

    // Cuando la canción del cassette termina, reanudar música de fondo
    if (customAudio) {
      customAudio.addEventListener('ended', () => {
        isPlayingCassette = false;
        cassetteBtn.textContent = 'REPRODUCIR';
        cassetteStatus.textContent = 'EN PAUSA';
        cassetteStatus.style.color = '#c594aa';
        wheels.forEach((w) => w.classList.remove('spinning'));

        // Reanudar música de fondo
        if (bgMusic && bgMusicStarted && audio.enabled) {
          bgMusic.play().catch(() => {});
        }
      });
    }
  }

  // --- CREADOR DE NOTAS ---
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
      <div class="tape-strip mini-tape pink-tape">MENSAJE ESPECIAL</div>
      <div class="sticker-badge">PARA ANNY</div>
      <h4 class="card-title">RECUERDO</h4>
      <p style="font-size: 1.1rem; color: #ffe5f0;">"${text}"</p>
      <div class="card-footer">
        <span class="punk-hashtag">#Anny</span>
        <button class="punk-mini-btn" onclick="this.closest('.sticker-card').remove()">QUITAR</button>
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
  const soundLabel = document.getElementById('sound-label');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      if (audio.enabled) {
        soundLabel.textContent = 'FX: ON';
        audio.playPop();
        if (bgMusic && bgMusicStarted) bgMusic.play().catch(() => {});
      } else {
        soundLabel.textContent = 'FX: OFF';
        if (bgMusic) bgMusic.pause();
      }
    });
  }

  // --- NAVEGACIÓN DIRECTA AL ARCADE ---
  const navArcadeBtn = document.getElementById('nav-arcade-btn');
  const arcadeSection = document.getElementById('arcade-section');

  if (navArcadeBtn && arcadeSection) {
    navArcadeBtn.addEventListener('click', () => {
      arcadeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      audio.playSparkle();
      const cabinet = document.querySelector('.arcade-cabinet-frame');
      if (cabinet) {
        cabinet.style.transform = 'scale(1.03)';
        cabinet.style.boxShadow = '0 0 45px #fdcae1, 0 0 80px #7f00b2';
        setTimeout(() => {
          cabinet.style.transform = 'scale(1)';
          cabinet.style.boxShadow = '';
        }, 600);
      }
    });
  }

  // =========================================================
  // --- PROCESAMIENTO DEL SPRITE DE ANNY (RECORTE Y TRANSPARENCIA) ---
  // =========================================================
  let croppedCharacterCanvas = null;
  const rawSprite = new Image();
  rawSprite.src = 'caracter.jpeg';
  rawSprite.onload = () => {
    try {
      croppedCharacterCanvas = processCharacterSprite(rawSprite);
    } catch (err) {
      console.warn('Error procesando transparencia del sprite:', err);
    }
  };

  function processCharacterSprite(img) {
    const offCanvas = document.createElement('canvas');
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(img, 0, 0);

    const imgData = offCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const visited = new Uint8Array(w * h);
    const queue = [];

    // Detectar píxeles blancos del fondo exterior (R>230, G>230, B>230)
    function isBgWhite(idx) {
      return data[idx] > 230 && data[idx + 1] > 230 && data[idx + 2] > 230;
    }

    // Sembrar bordes exteriores en la cola BFS
    for (let x = 0; x < w; x++) {
      const topIdx = (0 * w + x) * 4;
      const botIdx = ((h - 1) * w + x) * 4;
      if (isBgWhite(topIdx)) { queue.push(x, 0); visited[0 * w + x] = 1; }
      if (isBgWhite(botIdx)) { queue.push(x, h - 1); visited[(h - 1) * w + x] = 1; }
    }
    for (let y = 0; y < h; y++) {
      const leftIdx = (y * w + 0) * 4;
      const rightIdx = (y * w + (w - 1)) * 4;
      if (isBgWhite(leftIdx)) { queue.push(0, y); visited[y * w + 0] = 1; }
      if (isBgWhite(rightIdx)) { queue.push(w - 1, y); visited[y * w + (w - 1)] = 1; }
    }

    // Algoritmo BFS para volver transparentes solo los píxeles conectados al exterior
    let head = 0;
    while (head < queue.length) {
      const cx = queue[head++];
      const cy = queue[head++];
      const idx = (cy * w + cx) * 4;
      data[idx + 3] = 0; // Transparente

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (let i = 0; i < 4; i++) {
        const nx = neighbors[i][0];
        const ny = neighbors[i][1];
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nPos = ny * w + nx;
          if (!visited[nPos]) {
            visited[nPos] = 1;
            const nIdx = nPos * 4;
            if (isBgWhite(nIdx)) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    offCtx.putImageData(imgData, 0, 0);

    // Calcular cuadro delimitador del personaje
    let minX = w, minY = h, maxX = 0, maxY = 0;
    let hasPixels = false;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const a = data[(y * w + x) * 4 + 3];
        if (a > 20) {
          hasPixels = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!hasPixels) return offCanvas;

    const cropW = Math.max(1, maxX - minX + 1);
    const cropH = Math.max(1, maxY - minY + 1);
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(offCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

    // Actualizar previsualización en el modal
    const previewImg = document.getElementById('snake-preview-img');
    if (previewImg) {
      previewImg.src = cropCanvas.toDataURL();
      previewImg.style.background = 'transparent';
    }

    return cropCanvas;
  }

  // =========================================================
  // --- MOTOR MULTI-ARCADE DE ANNY (SNAKE & HEART CATCHER) ---
  // =========================================================
  const arcadeCanvas = document.getElementById('arcade-canvas');
  const arcadeCtx = arcadeCanvas ? arcadeCanvas.getContext('2d') : null;
  const arcadeOverlay = document.getElementById('arcade-overlay');
  const arcadeDialogTitle = document.getElementById('arcade-dialog-title');
  const arcadeDialogText = document.getElementById('arcade-dialog-text');
  const arcadeScoreDisplay = document.getElementById('arcade-score-display');
  const arcadeBestDisplay = document.getElementById('arcade-best-display');
  const arcadePlayBtn = document.getElementById('arcade-play-btn');
  const marqueeGameTitle = document.getElementById('marquee-game-title');
  const marqueeGameSub = document.getElementById('marquee-game-sub');
  const arcadeHintKeys = document.getElementById('arcade-hint-keys');

  const tabSnakeBtn = document.getElementById('tab-snake-btn');
  const tabCatcherBtn = document.getElementById('tab-catcher-btn');
  const snakeControlsDeck = document.getElementById('snake-controls-deck');
  const catcherControlsDeck = document.getElementById('catcher-controls-deck');

  let activeGame = 'snake'; // 'snake' o 'catcher'

  // --- 1. CONFIGURACIÓN DEL JUEGO SNAKE ---
  const GRID_SIZE = 20;
  const TILE_COUNT = 20;
  let snakeState = 'IDLE'; // 'IDLE', 'PLAYING', 'GAMEOVER'
  let snakeScore = 0;
  let snakeHighScore = parseInt(localStorage.getItem('anny_snake_highscore') || '0', 10);

  let snake = [];
  let dir = { x: 1, y: 0 };
  let nextDir = { x: 1, y: 0 };
  let food = { x: 15, y: 10, type: 'apple', pulse: 0 };
  let bonusStar = null;
  let snakeSparkles = [];
  let lastSnakeTick = 0;
  let snakeTickInterval = 135;

  function resetSnakeGame() {
    snake = [
      { x: 7, y: 10 },
      { x: 6, y: 10 },
      { x: 5, y: 10 }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    snakeScore = 0;
    snakeTickInterval = 135;
    snakeSparkles = [];
    bonusStar = null;
    spawnFood();
    if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = '0';
    if (arcadeBestDisplay) arcadeBestDisplay.textContent = snakeHighScore;
  }

  function spawnFood() {
    const emptySpots = [];
    for (let x = 1; x < TILE_COUNT - 1; x++) {
      for (let y = 1; y < TILE_COUNT - 1; y++) {
        if (!snake.some(seg => seg.x === x && seg.y === y)) {
          emptySpots.push({ x, y });
        }
      }
    }

    if (emptySpots.length > 0) {
      const choice = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      food = { x: choice.x, y: choice.y, type: 'apple', pulse: 0 };
    } else {
      food = { x: 5, y: 5, type: 'apple', pulse: 0 };
    }

    if (Math.random() < 0.25 && !bonusStar && emptySpots.length > 5) {
      const starSpots = emptySpots.filter(s => s.x !== food.x || s.y !== food.y);
      if (starSpots.length > 0) {
        const starChoice = starSpots[Math.floor(Math.random() * starSpots.length)];
        bonusStar = { x: starChoice.x, y: starChoice.y, timer: 75 };
      }
    }
  }

  function startSnakeGame() {
    resetSnakeGame();
    snakeState = 'PLAYING';
    if (arcadeOverlay) arcadeOverlay.classList.add('hidden');
    audio.playSparkle();
    lastSnakeTick = performance.now();
  }

  function endSnakeGame() {
    snakeState = 'GAMEOVER';
    audio.playCrash();

    if (snakeScore > snakeHighScore) {
      snakeHighScore = snakeScore;
      localStorage.setItem('anny_snake_highscore', snakeHighScore.toString());
      if (arcadeBestDisplay) arcadeBestDisplay.textContent = snakeHighScore;
    }

    if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = snakeScore;

    const praises = [
      '¡Reflejos increíbles, Anny!',
      '¡Tu estela de neón brilló con todo!',
      '¡Ese estilo único rompe récords!',
      '¡Puntaje legendario!',
      '¡Siempre con la mejor energía!'
    ];
    const randomPraise = praises[Math.floor(Math.random() * praises.length)];

    if (arcadeDialogTitle) arcadeDialogTitle.textContent = '¡FIN DE LA PARTIDA!';
    if (arcadeDialogText) {
      arcadeDialogText.innerHTML = `<strong>${randomPraise}</strong><br>Puntos totales: <span style="color:#fdcae1; font-weight:bold;">${snakeScore}</span>.<br>Longitud de la estela: <span style="color:#ffe5f0;">${snake.length}</span>`;
    }
    if (arcadePlayBtn) arcadePlayBtn.innerHTML = '<span>🔄 JUGAR DE NUEVO</span>';
    if (arcadeOverlay) arcadeOverlay.classList.remove('hidden');
  }

  function setSnakeDirection(newDx, newDy) {
    if (snakeState !== 'PLAYING') return;
    if (newDx !== 0 && dir.x === -newDx) return;
    if (newDy !== 0 && dir.y === -newDy) return;
    nextDir = { x: newDx, y: newDy };
    audio.playPop();
  }

  function updateSnake() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      endSnakeGame();
      return;
    }

    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      endSnakeGame();
      return;
    }

    snake.unshift(head);

    if (food && head.x === food.x && head.y === food.y) {
      snakeScore += 10;
      if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = snakeScore;
      audio.playCoin();
      snakeTickInterval = Math.max(70, 135 - Math.floor(snakeScore * 0.45));

      for (let i = 0; i < 10; i++) {
        snakeSparkles.push({
          x: head.x * GRID_SIZE + GRID_SIZE / 2,
          y: head.y * GRID_SIZE + GRID_SIZE / 2,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.4 ? '#ff2a6d' : '#05ffa1',
          life: 1,
          decay: 0.05
        });
      }
      spawnFood();
    } else if (bonusStar && head.x === bonusStar.x && head.y === bonusStar.y) {
      snakeScore += 50;
      if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = snakeScore;
      audio.playSparkle();
      bonusStar = null;

      for (let i = 0; i < 14; i++) {
        snakeSparkles.push({
          x: head.x * GRID_SIZE + GRID_SIZE / 2,
          y: head.y * GRID_SIZE + GRID_SIZE / 2,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 5 + 3,
          color: '#ffe5f0',
          life: 1,
          decay: 0.04
        });
      }
    } else {
      snake.pop();
    }

    if (bonusStar) {
      bonusStar.timer--;
      if (bonusStar.timer <= 0) bonusStar = null;
    }
  }

  // --- 2. CONFIGURACIÓN DEL JUEGO 2: HEART CATCHER ---
  let catcherState = 'IDLE'; // 'IDLE', 'PLAYING', 'GAMEOVER'
  let catcherScore = 0;
  let catcherHighScore = parseInt(localStorage.getItem('anny_catcher_highscore') || '0', 10);
  let catcherLives = 3;
  let catcherCombo = 1;
  let catcherPlayer = {
    x: 200,
    y: 350,
    width: 44,
    height: 44,
    vx: 0,
    targetX: 200
  };
  let catcherItems = [];
  let catcherSparkles = [];
  let catcherSpawnTimer = 0;

  function resetCatcherGame() {
    catcherPlayer.x = 200;
    catcherPlayer.targetX = 200;
    catcherPlayer.vx = 0;
    catcherScore = 0;
    catcherLives = 3;
    catcherCombo = 1;
    catcherItems = [];
    catcherSparkles = [];
    catcherSpawnTimer = 0;
    if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = '0';
    if (arcadeBestDisplay) arcadeBestDisplay.textContent = catcherHighScore;
  }

  function startCatcherGame() {
    resetCatcherGame();
    catcherState = 'PLAYING';
    if (arcadeOverlay) arcadeOverlay.classList.add('hidden');
    audio.playSparkle();
  }

  function endCatcherGame() {
    catcherState = 'GAMEOVER';
    audio.playCrash();

    if (catcherScore > catcherHighScore) {
      catcherHighScore = catcherScore;
      localStorage.setItem('anny_catcher_highscore', catcherHighScore.toString());
      if (arcadeBestDisplay) arcadeBestDisplay.textContent = catcherHighScore;
    }

    if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = catcherScore;

    const praises = [
      '¡Atrapaste todos los corazones con estilo, Anny!',
      '¡Qué reflejos y qué ritmo tan increíble!',
      '¡Combo legendario!',
      '¡Tus ojos hipnóticos no fallan una!',
      '¡Eres la reina del arcade!'
    ];
    const randomPraise = praises[Math.floor(Math.random() * praises.length)];

    if (arcadeDialogTitle) arcadeDialogTitle.textContent = '¡FIN DEL RUSH!';
    if (arcadeDialogText) {
      arcadeDialogText.innerHTML = `<strong>${randomPraise}</strong><br>Puntos totales: <span style="color:#fdcae1; font-weight:bold;">${catcherScore}</span>.<br>Combo máximo alcanzado.`;
    }
    if (arcadePlayBtn) arcadePlayBtn.innerHTML = '<span>🔄 JUGAR DE NUEVO</span>';
    if (arcadeOverlay) arcadeOverlay.classList.remove('hidden');
  }

  function spawnCatcherItem() {
    const types = ['heart', 'heart', 'heart', 'note', 'note', 'star', 'spike'];
    const type = types[Math.floor(Math.random() * types.length)];
    const speed = 2.4 + Math.random() * 1.6 + Math.min(catcherScore * 0.015, 3.5);

    catcherItems.push({
      x: Math.random() * (arcadeCanvas.width - 60) + 30,
      y: -20,
      speed: speed,
      type: type,
      radius: type === 'star' ? 14 : (type === 'spike' ? 12 : 13),
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.06
    });
  }

  function updateCatcher() {
    if (catcherState !== 'PLAYING') return;

    // Movimiento suave del jugador hacia targetX
    const dx = catcherPlayer.targetX - catcherPlayer.x;
    catcherPlayer.x += dx * 0.28 + catcherPlayer.vx;
    catcherPlayer.x = Math.max(26, Math.min(arcadeCanvas.width - 26, catcherPlayer.x));

    catcherSpawnTimer++;
    if (catcherSpawnTimer % Math.max(28, Math.floor(48 - catcherScore * 0.1)) === 0) {
      spawnCatcherItem();
    }

    // Actualizar items que caen
    for (let i = catcherItems.length - 1; i >= 0; i--) {
      const item = catcherItems[i];
      item.y += item.speed;
      item.rot += item.rotSpeed;

      // Colisión con la jugadora (Anny)
      const dist = Math.hypot(catcherPlayer.x - item.x, catcherPlayer.y - item.y);
      if (dist < 32 + item.radius) {
        if (item.type === 'spike') {
          // Daño por rayo / obstáculo
          catcherLives--;
          catcherCombo = 1;
          audio.playCrash();

          for (let k = 0; k < 12; k++) {
            catcherSparkles.push({
              x: item.x,
              y: item.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: 4,
              color: '#ff2a6d',
              life: 1,
              decay: 0.06
            });
          }

          if (catcherLives <= 0) {
            endCatcherGame();
            return;
          }
        } else {
          // Atrapó item bueno
          let pts = 10;
          let color = '#fdcae1';
          if (item.type === 'note') { pts = 25; color = '#d488ff'; }
          if (item.type === 'star') { pts = 50; color = '#ffe5f0'; }

          catcherScore += pts * catcherCombo;
          catcherCombo = Math.min(5, catcherCombo + 1);
          if (arcadeScoreDisplay) arcadeScoreDisplay.textContent = catcherScore;

          if (item.type === 'star') audio.playSparkle();
          else audio.playCoin();

          for (let k = 0; k < 10; k++) {
            catcherSparkles.push({
              x: item.x,
              y: item.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              size: Math.random() * 4 + 2,
              color: color,
              life: 1,
              decay: 0.05
            });
          }
        }

        catcherItems.splice(i, 1);
        continue;
      }

      // Si cayó al fondo
      if (item.y > arcadeCanvas.height + 25) {
        if (item.type !== 'spike') {
          // Si se le escapa un corazón, se reinicia el combo
          catcherCombo = 1;
        }
        catcherItems.splice(i, 1);
      }
    }
  }

  // --- 3. BUCLE PRINCIPAL UNIFICADO DE RENDERIZADO ---
  function mainArcadeLoop(currentTime) {
    if (!arcadeCtx || !arcadeCanvas) return;

    if (activeGame === 'snake') {
      // --- RENDERIZAR SNAKE ---
      if (snakeState === 'PLAYING') {
        if (currentTime - lastSnakeTick >= snakeTickInterval) {
          updateSnake();
          lastSnakeTick = currentTime;
        }
      }

      // Fondo
      const bgGrad = arcadeCtx.createLinearGradient(0, 0, 0, arcadeCanvas.height);
      bgGrad.addColorStop(0, '#0c0017');
      bgGrad.addColorStop(1, '#05000a');
      arcadeCtx.fillStyle = bgGrad;
      arcadeCtx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);

      // Cuadrícula
      arcadeCtx.strokeStyle = 'rgba(253, 202, 225, 0.06)';
      arcadeCtx.lineWidth = 1;
      for (let i = 0; i <= TILE_COUNT; i++) {
        arcadeCtx.beginPath();
        arcadeCtx.moveTo(i * GRID_SIZE, 0);
        arcadeCtx.lineTo(i * GRID_SIZE, arcadeCanvas.height);
        arcadeCtx.stroke();

        arcadeCtx.beginPath();
        arcadeCtx.moveTo(0, i * GRID_SIZE);
        arcadeCtx.lineTo(arcadeCanvas.width, i * GRID_SIZE);
        arcadeCtx.stroke();
      }

      arcadeCtx.strokeStyle = '#7f00b2';
      arcadeCtx.lineWidth = 3;
      arcadeCtx.strokeRect(1.5, 1.5, arcadeCanvas.width - 3, arcadeCanvas.height - 3);

      // Manzana roja
      if (food) {
        food.pulse = (food.pulse || 0) + 0.12;
        const pulseScale = 1 + Math.sin(food.pulse) * 0.12;
        const fx = food.x * GRID_SIZE + GRID_SIZE / 2;
        const fy = food.y * GRID_SIZE + GRID_SIZE / 2;

        arcadeCtx.save();
        arcadeCtx.translate(fx, fy);
        arcadeCtx.scale(pulseScale, pulseScale);
        arcadeCtx.shadowColor = '#ff2a6d';
        arcadeCtx.shadowBlur = 15;
        arcadeCtx.fillStyle = '#ff1168';
        arcadeCtx.beginPath();
        arcadeCtx.arc(-2.5, 1, GRID_SIZE * 0.35, 0, Math.PI * 2);
        arcadeCtx.arc(2.5, 1, GRID_SIZE * 0.35, 0, Math.PI * 2);
        arcadeCtx.fill();

        arcadeCtx.shadowBlur = 0;
        arcadeCtx.strokeStyle = '#ffe5f0';
        arcadeCtx.lineWidth = 1.8;
        arcadeCtx.beginPath();
        arcadeCtx.moveTo(0, -2);
        arcadeCtx.quadraticCurveTo(1.5, -6, 3, -8);
        arcadeCtx.stroke();

        arcadeCtx.fillStyle = '#05ffa1';
        arcadeCtx.shadowColor = '#05ffa1';
        arcadeCtx.shadowBlur = 6;
        arcadeCtx.beginPath();
        arcadeCtx.ellipse(3, -5, 3.5, 1.8, Math.PI / 4, 0, Math.PI * 2);
        arcadeCtx.fill();

        arcadeCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        arcadeCtx.shadowBlur = 0;
        arcadeCtx.beginPath();
        arcadeCtx.arc(-2, -1, 1.8, 0, Math.PI * 2);
        arcadeCtx.fill();
        arcadeCtx.restore();
      }

      // Estrella bonus
      if (bonusStar) {
        const sx = bonusStar.x * GRID_SIZE + GRID_SIZE / 2;
        const sy = bonusStar.y * GRID_SIZE + GRID_SIZE / 2;
        arcadeCtx.save();
        arcadeCtx.translate(sx, sy);
        arcadeCtx.fillStyle = '#ffe5f0';
        arcadeCtx.shadowColor = '#ffe5f0';
        arcadeCtx.shadowBlur = 15;
        arcadeCtx.beginPath();
        for (let s = 0; s < 5; s++) {
          arcadeCtx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * 9, -Math.sin((18 + s * 72) * Math.PI / 180) * 9);
          arcadeCtx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * 4, -Math.sin((54 + s * 72) * Math.PI / 180) * 4);
        }
        arcadeCtx.closePath();
        arcadeCtx.fill();
        arcadeCtx.restore();
      }

      // Partículas
      for (let i = snakeSparkles.length - 1; i >= 0; i--) {
        const p = snakeSparkles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          snakeSparkles.splice(i, 1);
          continue;
        }
        arcadeCtx.fillStyle = p.color;
        arcadeCtx.globalAlpha = p.life;
        arcadeCtx.beginPath();
        arcadeCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        arcadeCtx.fill();
        arcadeCtx.globalAlpha = 1.0;
      }

      // Cuerpo de la serpiente
      for (let i = snake.length - 1; i > 0; i--) {
        const seg = snake[i];
        const cx = seg.x * GRID_SIZE + GRID_SIZE / 2;
        const cy = seg.y * GRID_SIZE + GRID_SIZE / 2;
        const ratio = 1 - (i / snake.length);

        arcadeCtx.save();
        arcadeCtx.fillStyle = i % 2 === 0 ? '#fdcae1' : '#7f00b2';
        arcadeCtx.shadowColor = '#fdcae1';
        arcadeCtx.shadowBlur = 8;
        arcadeCtx.beginPath();
        arcadeCtx.arc(cx, cy, (GRID_SIZE / 2 - 2) * (0.6 + ratio * 0.4), 0, Math.PI * 2);
        arcadeCtx.fill();
        arcadeCtx.restore();
      }

      // Cabeza de Anny
      if (snake.length > 0) {
        const head = snake[0];
        const hx = head.x * GRID_SIZE + GRID_SIZE / 2;
        const hy = head.y * GRID_SIZE + GRID_SIZE / 2;

        arcadeCtx.save();
        arcadeCtx.translate(hx, hy);
        arcadeCtx.shadowColor = '#fdcae1';
        arcadeCtx.shadowBlur = 14;
        arcadeCtx.fillStyle = '#4c007d';
        arcadeCtx.beginPath();
        arcadeCtx.arc(0, 0, GRID_SIZE / 2 + 3, 0, Math.PI * 2);
        arcadeCtx.fill();

        arcadeCtx.strokeStyle = '#fdcae1';
        arcadeCtx.lineWidth = 2;
        arcadeCtx.stroke();
        arcadeCtx.shadowBlur = 0;

        arcadeCtx.beginPath();
        arcadeCtx.arc(0, 0, GRID_SIZE / 2 + 1, 0, Math.PI * 2);
        arcadeCtx.clip();

        const spriteSource = croppedCharacterCanvas || rawSprite;
        if (spriteSource) {
          const size = GRID_SIZE * 2;
          arcadeCtx.drawImage(spriteSource, -size * 0.5, -size * 0.45, size, size * 1.4);
        }
        arcadeCtx.restore();
      }

      // HUD Snake
      arcadeCtx.fillStyle = '#ffe5f0';
      arcadeCtx.font = '900 16px "Space Grotesk", sans-serif';
      arcadeCtx.shadowColor = '#fdcae1';
      arcadeCtx.shadowBlur = 6;
      arcadeCtx.fillText(`PUNTOS: ${snakeScore}`, 12, 24);

      arcadeCtx.fillStyle = '#c594aa';
      arcadeCtx.font = '600 12px "Space Grotesk", sans-serif';
      arcadeCtx.shadowBlur = 0;
      arcadeCtx.fillText(`RÉCORD: ${Math.max(snakeScore, snakeHighScore)}`, 12, 40);

    } else {
      // --- RENDERIZAR HEART CATCHER ---
      updateCatcher();

      // Fondo cibernético
      const bgGrad = arcadeCtx.createLinearGradient(0, 0, 0, arcadeCanvas.height);
      bgGrad.addColorStop(0, '#120022');
      bgGrad.addColorStop(0.7, '#24003d');
      bgGrad.addColorStop(1, '#0b0014');
      arcadeCtx.fillStyle = bgGrad;
      arcadeCtx.fillRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);

      // Líneas de velocidad de fondo
      arcadeCtx.strokeStyle = 'rgba(253, 202, 225, 0.07)';
      arcadeCtx.lineWidth = 1;
      for (let x = 30; x < arcadeCanvas.width; x += 50) {
        arcadeCtx.beginPath();
        arcadeCtx.moveTo(x, 0);
        arcadeCtx.lineTo(x, arcadeCanvas.height);
        arcadeCtx.stroke();
      }

      // Partículas
      for (let i = catcherSparkles.length - 1; i >= 0; i--) {
        const p = catcherSparkles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          catcherSparkles.splice(i, 1);
          continue;
        }
        arcadeCtx.fillStyle = p.color;
        arcadeCtx.globalAlpha = p.life;
        arcadeCtx.beginPath();
        arcadeCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        arcadeCtx.fill();
        arcadeCtx.globalAlpha = 1.0;
      }

      // Dibujar Items que caen
      catcherItems.forEach(item => {
        arcadeCtx.save();
        arcadeCtx.translate(item.x, item.y);
        arcadeCtx.rotate(item.rot);

        if (item.type === 'heart') {
          arcadeCtx.fillStyle = '#fdcae1';
          arcadeCtx.shadowColor = '#fdcae1';
          arcadeCtx.shadowBlur = 12;
          arcadeCtx.beginPath();
          arcadeCtx.moveTo(0, 3);
          arcadeCtx.bezierCurveTo(-6, -6, -12, 2, 0, 12);
          arcadeCtx.bezierCurveTo(12, 2, 6, -6, 0, 3);
          arcadeCtx.fill();
        } else if (item.type === 'note') {
          arcadeCtx.fillStyle = '#d488ff';
          arcadeCtx.shadowColor = '#d488ff';
          arcadeCtx.shadowBlur = 12;
          arcadeCtx.font = '900 20px sans-serif';
          arcadeCtx.textAlign = 'center';
          arcadeCtx.textBaseline = 'middle';
          arcadeCtx.fillText('🎵', 0, 0);
        } else if (item.type === 'star') {
          arcadeCtx.fillStyle = '#ffe5f0';
          arcadeCtx.shadowColor = '#ffe5f0';
          arcadeCtx.shadowBlur = 15;
          arcadeCtx.beginPath();
          for (let s = 0; s < 5; s++) {
            arcadeCtx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * 12, -Math.sin((18 + s * 72) * Math.PI / 180) * 12);
            arcadeCtx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * 5, -Math.sin((54 + s * 72) * Math.PI / 180) * 5);
          }
          arcadeCtx.closePath();
          arcadeCtx.fill();
        } else if (item.type === 'spike') {
          // Rayo / Púa peligrosa
          arcadeCtx.fillStyle = '#ff2a6d';
          arcadeCtx.shadowColor = '#ff2a6d';
          arcadeCtx.shadowBlur = 14;
          arcadeCtx.font = '900 18px sans-serif';
          arcadeCtx.textAlign = 'center';
          arcadeCtx.textBaseline = 'middle';
          arcadeCtx.fillText('⚡', 0, 0);
        }
        arcadeCtx.restore();
      });

      // Dibujar Jugadora (Anny Avatar en la parte inferior)
      arcadeCtx.save();
      arcadeCtx.translate(catcherPlayer.x, catcherPlayer.y);

      // Estela / Base
      arcadeCtx.fillStyle = 'rgba(253, 202, 225, 0.2)';
      arcadeCtx.beginPath();
      arcadeCtx.ellipse(0, 24, 26, 6, 0, 0, Math.PI * 2);
      arcadeCtx.fill();

      // Aro Neón
      arcadeCtx.shadowColor = '#fdcae1';
      arcadeCtx.shadowBlur = 16;
      arcadeCtx.fillStyle = '#4c007d';
      arcadeCtx.beginPath();
      arcadeCtx.arc(0, 0, 24, 0, Math.PI * 2);
      arcadeCtx.fill();

      arcadeCtx.strokeStyle = '#fdcae1';
      arcadeCtx.lineWidth = 3;
      arcadeCtx.stroke();
      arcadeCtx.shadowBlur = 0;

      // Sprite de Anny
      arcadeCtx.beginPath();
      arcadeCtx.arc(0, 0, 22, 0, Math.PI * 2);
      arcadeCtx.clip();

      const spriteSource = croppedCharacterCanvas || rawSprite;
      if (spriteSource) {
        arcadeCtx.drawImage(spriteSource, -25, -22, 50, 68);
      }
      arcadeCtx.restore();

      // HUD Heart Catcher
      arcadeCtx.fillStyle = '#ffe5f0';
      arcadeCtx.font = '900 16px "Space Grotesk", sans-serif';
      arcadeCtx.shadowColor = '#fdcae1';
      arcadeCtx.shadowBlur = 6;
      arcadeCtx.fillText(`PUNTOS: ${catcherScore}`, 12, 24);

      // Vidas (💖)
      let livesText = '';
      for (let l = 0; l < catcherLives; l++) livesText += '💖 ';
      arcadeCtx.font = '14px sans-serif';
      arcadeCtx.fillText(livesText, 12, 45);

      // Multiplicador Combo
      if (catcherCombo > 1) {
        arcadeCtx.fillStyle = '#05ffa1';
        arcadeCtx.font = '900 14px "Space Grotesk", sans-serif';
        arcadeCtx.fillText(`COMBO x${catcherCombo}!`, arcadeCanvas.width - 100, 24);
      }
    }

    requestAnimationFrame(mainArcadeLoop);
  }

  // --- 4. GESTIÓN DE TABS (CAMBIO DE JUEGO) ---
  function switchArcadeGame(gameName) {
    activeGame = gameName;
    audio.playSparkle();

    if (gameName === 'snake') {
      tabSnakeBtn.classList.add('active');
      tabCatcherBtn.classList.remove('active');
      snakeControlsDeck.classList.remove('hidden');
      catcherControlsDeck.classList.add('hidden');
      if (marqueeGameTitle) marqueeGameTitle.textContent = '★ ANNY CYBER SNAKE ★';
      if (marqueeGameSub) marqueeGameSub.textContent = 'COME MANZANAS & HAZ CRECER TU ESTELA';
      if (arcadeHintKeys) arcadeHintKeys.textContent = 'FLECHAS / WASD';

      if (arcadeDialogTitle) arcadeDialogTitle.textContent = '¡CYBER SNAKE!';
      if (arcadeDialogText) arcadeDialogText.innerHTML = 'Usa las <strong>Flechas / WASD</strong> o el <strong>D-Pad táctil</strong> para mover a Anny y atrapar todas las manzanas de neón (+10) y estrellas (+50).';
      if (arcadeBestDisplay) arcadeBestDisplay.textContent = snakeHighScore;
      resetSnakeGame();
      snakeState = 'IDLE';
    } else {
      tabCatcherBtn.classList.add('active');
      tabSnakeBtn.classList.remove('active');
      catcherControlsDeck.classList.remove('hidden');
      snakeControlsDeck.classList.add('hidden');
      if (marqueeGameTitle) marqueeGameTitle.textContent = '★ ANNY HEART CATCHER ★';
      if (marqueeGameSub) marqueeGameSub.textContent = 'ATRAPA CORAZONES & ESQUIVA LOS RAYOS';
      if (arcadeHintKeys) arcadeHintKeys.textContent = 'FLECHAS O ARRASTRA';

      if (arcadeDialogTitle) arcadeDialogTitle.textContent = '¡HEART CATCHER!';
      if (arcadeDialogText) arcadeDialogText.innerHTML = 'Mueve a Anny a la izquierda y derecha tocando los botones o <strong>deslizando tu dedo por la pantalla</strong> para atrapar corazones (+10), notas (+25) y estrellas (+50). ¡Cuidado con los rayos!';
      if (arcadeBestDisplay) arcadeBestDisplay.textContent = catcherHighScore;
      resetCatcherGame();
      catcherState = 'IDLE';
    }

    if (arcadeOverlay) arcadeOverlay.classList.remove('hidden');
  }

  if (tabSnakeBtn) tabSnakeBtn.addEventListener('click', () => switchArcadeGame('snake'));
  if (tabCatcherBtn) tabCatcherBtn.addEventListener('click', () => switchArcadeGame('catcher'));

  // Botón Jugar / Reiniciar Modal
  if (arcadePlayBtn) {
    arcadePlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeGame === 'snake') startSnakeGame();
      else startCatcherGame();
    });
  }

  // --- 5. CONTROLES UNIFICADOS MÓVIL Y TECLADO ---
  // Teclado
  window.addEventListener('keydown', (e) => {
    if (document.activeElement === customNoteInput) return;

    if (activeGame === 'snake') {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSnakeDirection(0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSnakeDirection(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setSnakeDirection(-1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setSnakeDirection(1, 0);
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (snakeState === 'IDLE' || snakeState === 'GAMEOVER') {
          e.preventDefault();
          startSnakeGame();
        }
      }
    } else {
      // Controles Teclado Heart Catcher
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        catcherPlayer.targetX = Math.max(30, catcherPlayer.targetX - 45);
        audio.playPop();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        catcherPlayer.targetX = Math.min(arcadeCanvas.width - 30, catcherPlayer.targetX + 45);
        audio.playPop();
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (catcherState === 'IDLE' || catcherState === 'GAMEOVER') {
          e.preventDefault();
          startCatcherGame();
        }
      }
    }
  });

  // D-Pad Táctil (Snake)
  const dpadUp = document.getElementById('dpad-up');
  const dpadDown = document.getElementById('dpad-down');
  const dpadLeft = document.getElementById('dpad-left');
  const dpadRight = document.getElementById('dpad-right');

  function bindDpad(btn, dx, dy) {
    if (!btn) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (snakeState === 'IDLE' || snakeState === 'GAMEOVER') startSnakeGame();
      else setSnakeDirection(dx, dy);
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('touchstart', handler, { passive: false });
  }

  bindDpad(dpadUp, 0, -1);
  bindDpad(dpadDown, 0, 1);
  bindDpad(dpadLeft, -1, 0);
  bindDpad(dpadRight, 1, 0);

  // Botones Táctiles Heart Catcher
  const catcherBtnLeft = document.getElementById('catcher-btn-left');
  const catcherBtnRight = document.getElementById('catcher-btn-right');

  function bindCatcherBtn(btn, direction) {
    if (!btn) return;
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (catcherState === 'IDLE' || catcherState === 'GAMEOVER') {
        startCatcherGame();
      } else {
        const delta = direction === 'left' ? -55 : 55;
        catcherPlayer.targetX = Math.max(30, Math.min(arcadeCanvas.width - 30, catcherPlayer.targetX + delta));
        audio.playPop();
      }
    };
    btn.addEventListener('click', handler);
    btn.addEventListener('touchstart', handler, { passive: false });
  }

  bindCatcherBtn(catcherBtnLeft, 'left');
  bindCatcherBtn(catcherBtnRight, 'right');

  // Control Táctil Directo en Pantalla (Touch & Drag para móvil)
  if (arcadeCanvas) {
    function handleCanvasTouch(e) {
      if (activeGame === 'catcher' && catcherState === 'PLAYING') {
        const touch = e.touches ? e.touches[0] : e;
        const rect = arcadeCanvas.getBoundingClientRect();
        const scaleX = arcadeCanvas.width / rect.width;
        const canvasX = (touch.clientX - rect.left) * scaleX;
        catcherPlayer.targetX = Math.max(25, Math.min(arcadeCanvas.width - 25, canvasX));
      }
    }

    arcadeCanvas.addEventListener('touchstart', (e) => {
      if (activeGame === 'catcher') {
        if (catcherState === 'IDLE' || catcherState === 'GAMEOVER') {
          startCatcherGame();
        } else {
          handleCanvasTouch(e);
        }
      } else {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }
    }, { passive: true });

    arcadeCanvas.addEventListener('touchmove', (e) => {
      if (activeGame === 'catcher') {
        e.preventDefault();
        handleCanvasTouch(e);
      }
    }, { passive: false });

    // Swipe para Snake
    let touchStartX = 0;
    let touchStartY = 0;
    arcadeCanvas.addEventListener('touchend', (e) => {
      if (activeGame === 'snake') {
        if (e.changedTouches.length > 0) {
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);

          if (Math.max(absX, absY) > 18) {
            if (absX > absY) setSnakeDirection(dx > 0 ? 1 : -1, 0);
            else setSnakeDirection(0, dy > 0 ? 1 : -1);
          } else if (snakeState === 'IDLE' || snakeState === 'GAMEOVER') {
            startSnakeGame();
          }
        }
      }
    }, { passive: true });

    // Mouse drag en PC para Catcher
    arcadeCanvas.addEventListener('pointermove', (e) => {
      if (activeGame === 'catcher' && catcherState === 'PLAYING' && e.buttons === 1) {
        const rect = arcadeCanvas.getBoundingClientRect();
        const scaleX = arcadeCanvas.width / rect.width;
        catcherPlayer.targetX = (e.clientX - rect.left) * scaleX;
      }
    });
  }

  // Iniciar bucle principal
  requestAnimationFrame(mainArcadeLoop);

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


