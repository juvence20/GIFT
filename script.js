/* =========================================================
   POUR TOI — logique de l'application
   Tu n'as normalement rien à modifier ici.
   Toute la personnalisation se fait dans js/config.js
   ========================================================= */

(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const views = {
    cover: $('view-cover'),
    message: $('view-message'),
    passkey: $('view-passkey'),
    gallery: $('view-gallery'),
  };
  const roseTransition = $('roseTransition');
  const loadingOverlay = $('loadingOverlay');
  const unlockedOverlay = $('unlockedOverlay');
  const wreath = $('wreath');
  const giftbox = $('giftbox');
  const coverTitle = $('coverTitle');
  const introText = $('introText');
  const quoteCard = $('quoteCard');
  const openLockBtn = $('openLockBtn');
  const closePasskeyBtn = $('closePasskeyBtn');
  const backBtn = $('backBtn');
  const passkeyHintEl = $('passkeyHint');
  const passkeyDots = $('passkeyDots');
  const passkeyError = $('passkeyError');
  const keypad = $('keypad');
  const roseBorderLeft = $('roseBorderLeft');
  const roseBorderRight = $('roseBorderRight');
  const cornerBouquet = $('cornerBouquet');
  const polaroidGrid = $('polaroidGrid');
  const letterCard = $('letterCard');
  const letterTextEl = $('letterText');
  const letterCursor = $('letterCursor');
  const letterHeart = document.querySelector('.letter-heart');
  const theEnd = document.querySelector('.the-end');
  const soundToggle = $('soundToggle');
  const bgMusic = $('bgMusic');

  let pinBuffer = [];
  let galleryBuilt = false;
  let letterTyped = false;
  let musicStarted = false;
  let muted = false;

  // =========================================================
  // Personnalisation (depuis config.js)
  // =========================================================
  function applyConfig() {
    const name = (CONFIG.girlfriendName && CONFIG.girlfriendName.trim())
      ? CONFIG.girlfriendName.trim() : 'mon amour';
    coverTitle.textContent = `Pour toi, ${name}.`;
    introText.textContent = CONFIG.introText || '';
    passkeyHintEl.textContent = CONFIG.passkeyHint || '';
    buildQuoteCard();
  }

  // Parse "**mot**" -> <span class="hl hl-xxx">mot</span>, couleurs en boucle
  function buildQuoteCard() {
    const palette = ['hl-pink', 'hl-green', 'hl-rose', 'hl-yellow'];
    let hlIndex = 0;
    const lines = (CONFIG.quoteText || '').split('\n').filter(Boolean);
    quoteCard.innerHTML = lines.map((line) => {
      const parsed = line.replace(/\*\*(.+?)\*\*/g, (m, word) => {
        const cls = palette[hlIndex % palette.length];
        hlIndex++;
        return `<span class="hl ${cls}">${word}</span>`;
      });
      return `<span class="qline">${parsed}</span>`;
    }).join('');
  }

  // =========================================================
  // Fleur SVG réutilisable (roses bleues et blanches)
  // =========================================================
  function roseMarkup(full) {
    let petals = '';
    const outer = full ? 8 : 6;
    for (let i = 0; i < outer; i++) {
      const angle = i * (360 / outer);
      const alt = (i % 2 === 0) ? '' : 'alt';
      petals += `<ellipse class="petal ${alt}" cx="32" cy="16" rx="8" ry="15" transform="rotate(${angle} 32 32)"></ellipse>`;
    }
    if (full) {
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 + 20;
        const alt = (i % 2 === 0) ? 'alt' : '';
        petals += `<ellipse class="petal-inner ${alt}" cx="32" cy="21" rx="6" ry="10" transform="rotate(${angle} 32 32)"></ellipse>`;
      }
    }
    return `<svg class="rose-svg" viewBox="0 0 64 64" aria-hidden="true">${petals}<circle class="center" cx="32" cy="32" r="5"></circle></svg>`;
  }

  function leafMarkup(w, h, rot) {
    return `<svg viewBox="0 0 40 20" width="${w}" height="${h}" style="position:absolute;transform:rotate(${rot}deg)" aria-hidden="true">
      <ellipse cx="20" cy="10" rx="19" ry="8" fill="#6f9a86"/>
    </svg>`;
  }

  function buildCornerBouquet() {
    cornerBouquet.innerHTML = `
      ${leafMarkup(60, 30, 25)}
      <div style="position:absolute;left:38px;top:6px;width:78px;height:78px;transform:rotate(-8deg)">${roseMarkup(true)}</div>
      <div style="position:absolute;left:2px;top:38px;width:58px;height:58px;transform:rotate(14deg)">${roseMarkup(true)}</div>
      <div style="position:absolute;left:64px;top:52px;width:44px;height:44px;transform:rotate(-4deg)">${roseMarkup(false)}</div>
    `;
  }

  // =========================================================
  // Gestion des vues
  // =========================================================
  function showView(key) {
    Object.values(views).forEach((v) => v.classList.remove('view--active'));
    views[key].classList.add('view--active');
    const scrollEl = views[key].querySelector('.scroll-content');
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  // =========================================================
  // Étape 1 : ouverture du cadeau -> pluie de roses -> message
  // =========================================================
  function openGift() {
    if (giftbox.classList.contains('opening')) return;
    giftbox.classList.add('opening');
    startMusic();
    setTimeout(runRoseFall, reducedMotion ? 0 : 420);
  }

  function runRoseFall() {
    if (reducedMotion) {
      showView('message');
      buildRoseBorders();
      buildCornerBouquet();
      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cols = Math.max(5, Math.round(vw / 62));
    const tileSize = Math.ceil(vw / cols) + 14;
    const rowStep = tileSize * 0.72;
    const rows = Math.ceil(vh / rowStep) + 2;

    roseTransition.innerHTML = '';
    roseTransition.classList.add('active');

    const tiles = [];
    let maxDelay = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const offsetX = (r % 2 === 0) ? 0 : tileSize * 0.5;
        const x = c * tileSize - offsetX - tileSize * 0.15;
        const y = r * rowStep - tileSize * 0.1;
        if (x > vw + tileSize || y > vh + tileSize) continue;

        const tile = document.createElement('div');
        tile.className = 'rose-tile';
        const size = tileSize * (0.92 + Math.random() * 0.22);
        tile.style.width = `${size}px`;
        tile.style.height = `${size}px`;
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
        const rot = Math.random() * 40 - 20;
        const delay = r * 34 + Math.random() * 60;
        maxDelay = Math.max(maxDelay, delay);
        tile.style.transitionDelay = `${delay}ms`;
        tile.style.transform = `translateY(${-(vh + y + 200)}px) rotate(${rot}deg)`;
        tile.dataset.side = (c < cols / 2) ? 'left' : 'right';
        tile.dataset.rot = rot;
        tile.innerHTML = roseMarkup(Math.random() > 0.6);
        roseTransition.appendChild(tile);
        tiles.push(tile);
      }
    }

    // déclenche la chute au prochain frame
    requestAnimationFrame(() => {
      tiles.forEach((tile) => {
        tile.style.transform = `translateY(0) rotate(${tile.dataset.rot}deg)`;
      });
    });

    const fallDuration = maxDelay + 650;

    setTimeout(() => {
      // écran plein de roses -> on bascule la scène en dessous
      showView('message');
      buildRoseBorders();
      buildCornerBouquet();

      // petite pause puis écartement des roses
      setTimeout(() => {
        tiles.forEach((tile) => {
          const side = tile.dataset.side;
          const dx = side === 'left' ? '-130vw' : '130vw';
          tile.style.transitionDuration = '0.75s';
          tile.style.transitionDelay = `${Math.random() * 120}ms`;
          tile.style.transform = `translate(${dx}, 10px) rotate(${Number(tile.dataset.rot) + (side === 'left' ? -25 : 25)}deg)`;
          tile.style.opacity = '0';
        });

        setTimeout(() => {
          roseTransition.classList.remove('active');
          roseTransition.innerHTML = '';
        }, 950);
      }, 420);
    }, fallDuration);
  }

  function buildRoseBorders() {
    if (roseBorderLeft.dataset.built) return;
    [roseBorderLeft, roseBorderRight].forEach((col, colIndex) => {
      const n = 7;
      for (let i = 0; i < n; i++) {
        const el = document.createElement('div');
        el.innerHTML = roseMarkup(false);
        const svg = el.firstElementChild;
        svg.style.position = 'absolute';
        svg.style.top = `${(i / n) * 100 + (colIndex === 0 ? 2 : 6)}%`;
        if (colIndex === 0) svg.style.left = `${-6 + (i % 2) * 18}px`;
        else svg.style.right = `${-6 + (i % 2) * 18}px`;
        svg.style.transform = `rotate(${(i * 37) % 360}deg) scale(${0.8 + (i % 3) * 0.15})`;
        col.appendChild(svg);
      }
      col.dataset.built = 'true';
    });
  }

  // =========================================================
  // Étape 2 : cadenas à code secret
  // =========================================================
  function openPasskey() {
    pinBuffer = [];
    renderDots();
    passkeyError.classList.remove('show');
    showView('passkey');
  }

  function renderDots() {
    const dots = passkeyDots.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('filled', i < pinBuffer.length));
  }

  function handleKey(key) {
    if (key === 'clear') { pinBuffer = []; renderDots(); passkeyError.classList.remove('show'); return; }
    if (key === 'back') { pinBuffer.pop(); renderDots(); return; }
    if (pinBuffer.length >= 4) return;
    pinBuffer.push(key);
    renderDots();

    if (pinBuffer.length === 4) {
      const entered = pinBuffer.join('');
      setTimeout(() => {
        if (entered === String(CONFIG.passkey)) {
          proceedToGallery();
        } else {
          passkeyDots.classList.add('shake');
          passkeyError.classList.add('show');
          setTimeout(() => {
            passkeyDots.classList.remove('shake');
            pinBuffer = [];
            renderDots();
          }, 500);
        }
      }, 220);
    }
  }

  // =========================================================
  // Étape 3 : chargement -> "Débloqué" -> galerie + lettre
  // =========================================================
  function buildWreath() {
    if (wreath.dataset.built) return;
    const n = 6;
    for (let i = 0; i < n; i++) {
      const wrap = document.createElement('div');
      wrap.innerHTML = roseMarkup(true);
      const svg = wrap.firstElementChild;
      const angle = (360 / n) * i;
      svg.style.transform = `rotate(${angle}deg) translate(42px) rotate(${-angle}deg)`;
      wreath.appendChild(svg);
    }
    wreath.dataset.built = 'true';
  }

  function proceedToGallery() {
    buildWreath();
    loadingOverlay.classList.add('active');
    const loadDelay = reducedMotion ? 80 : 1500;

    setTimeout(() => {
      loadingOverlay.classList.remove('active');
      unlockedOverlay.classList.add('active');
      requestAnimationFrame(() => unlockedOverlay.classList.add('show'));

      const unlockedDelay = reducedMotion ? 80 : 1100;
      setTimeout(() => {
        unlockedOverlay.classList.remove('show');
        setTimeout(() => {
          unlockedOverlay.classList.remove('active');
          showView('gallery');
          buildGallery();
          observeLetter();
        }, reducedMotion ? 0 : 320);
      }, unlockedDelay);
    }, loadDelay);
  }

  function placeholderIconSVG() {
    return `<svg class="placeholder-icon" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="8" cy="10" r="1.8" fill="currentColor"/>
      <path d="M3 17 L9 12 L13 15 L17 11 L21 16" stroke="currentColor" stroke-width="1.6" fill="none"/>
    </svg>`;
  }

  function buildGallery() {
    if (galleryBuilt) return;
    galleryBuilt = true;
    const photos = (CONFIG.photos && CONFIG.photos.length) ? CONFIG.photos : [];

    photos.forEach((photo) => {
      const card = document.createElement('div');
      card.className = 'polaroid';
      const frame = document.createElement('div');
      frame.className = 'frame';
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption || 'Photo de nous';
      img.loading = 'lazy';
      img.onerror = function () { frame.innerHTML = placeholderIconSVG(); };
      frame.appendChild(img);
      card.appendChild(frame);
      const cap = document.createElement('span');
      cap.className = 'caption';
      cap.textContent = photo.caption || '';
      card.appendChild(cap);
      polaroidGrid.appendChild(card);
    });
  }

  // =========================================================
  // Lettre à effet machine à écrire
  // =========================================================
  function observeLetter() {
    if (letterTyped) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !letterTyped) {
          letterTyped = true;
          typeLetter();
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(letterCard);
  }

  function typeLetter() {
    const signature = CONFIG.yourName ? `\n\n${CONFIG.yourName}` : '';
    const fullText = (CONFIG.letterText || '') + signature;

    if (reducedMotion) {
      letterTextEl.textContent = fullText;
      letterCursor.classList.add('hidden');
      finishLetter();
      return;
    }

    let i = 0;
    const speed = CONFIG.typingSpeed || 22;
    const interval = setInterval(() => {
      letterTextEl.textContent = fullText.slice(0, i + 1);
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        letterCursor.classList.add('hidden');
        finishLetter();
      }
    }, speed);
  }

  function finishLetter() {
    setTimeout(() => {
      letterHeart.classList.add('show');
      theEnd.classList.add('show');
    }, 300);
  }

  // =========================================================
  // Musique de fond
  // =========================================================
  function startMusic() {
    if (musicStarted || !bgMusic) return;
    musicStarted = true;
    bgMusic.volume = 0.55;
    const p = bgMusic.play();
    if (p && p.catch) p.catch(() => { /* pas de fichier audio fourni, ou lecture bloquée */ });
    updateSoundIcon();
  }

  function toggleMute() {
    muted = !muted;
    bgMusic.muted = muted;
    if (!musicStarted) startMusic();
    updateSoundIcon();
  }

  function updateSoundIcon() {
    soundToggle.textContent = muted ? '🔇' : '🔈';
  }

  // =========================================================
  // Écouteurs
  // =========================================================
  giftbox.addEventListener('click', openGift);
  openLockBtn.addEventListener('click', openPasskey);
  closePasskeyBtn.addEventListener('click', () => showView('message'));
  backBtn.addEventListener('click', () => showView('message'));
  soundToggle.addEventListener('click', toggleMute);

  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    handleKey(btn.dataset.key);
  });

  document.addEventListener('keydown', (e) => {
    if (!views.passkey.classList.contains('view--active')) return;
    if (/^[0-9]$/.test(e.key)) handleKey(e.key);
    if (e.key === 'Backspace') handleKey('back');
    if (e.key === 'Escape') showView('message');
  });

  applyConfig();
})();
