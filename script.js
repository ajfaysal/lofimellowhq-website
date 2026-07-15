import {
  SITE_CONFIG,
  PLATFORM_LINKS,
  PLATFORM_META,
  RELEASES,
  VALUES,
  HOME_HIGHLIGHTS,
  PAGE_META
} from './config.js';

const state = {
  audio: null,
  playlist: [],
  index: 0,
  progressFrame: null
};

const selectors = {
  header: '[data-component="header"]',
  footer: '[data-component="footer"]',
  year: '[data-js="year"]',
  player: '[data-component="player"]'
};

const iconArrow = '→';

const safeLink = (url) => typeof url === 'string' && url.trim().length > 0;

const getCurrentPage = () => document.body.dataset.page || 'index';

const pageUrl = (canonicalPath) => `${SITE_CONFIG.domain}${canonicalPath}`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const sortReleasesNewest = [...RELEASES].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

const getFeaturedRelease = () => RELEASES.find((item) => item.featured) || sortReleasesNewest[0];

const getLatestReleases = (limit = 4) => sortReleasesNewest.slice(0, limit);

const createElement = (tag, className, html) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html) el.innerHTML = html;
  return el;
};

const buildHeader = () => {
  const currentPage = getCurrentPage();
  const navItems = SITE_CONFIG.nav
    .map((item) => {
      const pageId = item.href.replace('.html', '');
      const active = pageId === currentPage || (currentPage === 'index' && item.href === 'index.html');
      const ariaCurrent = active ? ' aria-current="page"' : '';
      return `<li><a class="nav-link ${active ? 'is-active' : ''}" href="${item.href}"${ariaCurrent}>${item.label}</a></li>`;
    })
    .join('');

  return `
    <header class="site-header" id="top" role="banner">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="${SITE_CONFIG.brandName} home">
          <img src="${SITE_CONFIG.logoIcon}" width="40" height="40" alt="" aria-hidden="true">
          <img src="${SITE_CONFIG.logoWordmark}" class="brand-wordmark" width="150" height="30" alt="${SITE_CONFIG.brandName}">
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle navigation" data-js="menu-toggle">
          <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
        </button>
        <nav class="main-nav" aria-label="Primary navigation">
          <ul role="list">${navItems}</ul>
        </nav>
      </div>
      <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden>
        <ul role="list">${navItems}</ul>
      </nav>
    </header>
  `;
};

const buildFooterLinks = (keys) => {
  const items = keys
    .map((key) => ({ key, ...PLATFORM_META[key], url: PLATFORM_LINKS[key] }))
    .filter((item) => safeLink(item.url))
    .map(
      (item) =>
        `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.name} (opens in new tab)">${item.name}</a></li>`
    )
    .join('');
  return items || '<li><span class="muted">Profiles will appear here after links are configured.</span></li>';
};

const buildFooter = () => {
  const navLinks = SITE_CONFIG.nav.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('');
  const policyLinks = SITE_CONFIG.footerLinks
    .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join('');

  return `
    <footer class="site-footer" role="contentinfo">
      <div class="container footer-grid">
        <div>
          <a class="brand brand-footer" href="index.html" aria-label="${SITE_CONFIG.brandName} home">
            <img src="${SITE_CONFIG.logoIcon}" width="36" height="36" alt="" aria-hidden="true">
            <span>${SITE_CONFIG.brandName}</span>
          </a>
          <p class="footer-copy">Original music crafted for focus, calm listening, and creative flow.</p>
        </div>
        <nav aria-label="Footer navigation">
          <h2 class="footer-title">Quick Navigation</h2>
          <ul class="footer-list" role="list">${navLinks}</ul>
        </nav>
        <div>
          <h2 class="footer-title">Streaming Platforms</h2>
          <ul class="footer-list" role="list">${buildFooterLinks(['spotify', 'appleMusic', 'youtubeMusic', 'youtube', 'soundcloud', 'bandcamp'])}</ul>
        </div>
        <div>
          <h2 class="footer-title">Social Media</h2>
          <ul class="footer-list" role="list">${buildFooterLinks(['instagram', 'tiktok', 'x', 'facebook'])}</ul>
          <ul class="footer-list compact" role="list">${policyLinks}</ul>
        </div>
      </div>
      <div class="container footer-meta">
        <p>© <span data-js="year"></span> ${SITE_CONFIG.copyright}</p>
      </div>
    </footer>
  `;
};

const renderShell = () => {
  const headerSlot = document.querySelector(selectors.header);
  const footerSlot = document.querySelector(selectors.footer);

  if (headerSlot) headerSlot.innerHTML = buildHeader();
  if (footerSlot) footerSlot.innerHTML = buildFooter();

  document.querySelectorAll(selectors.year).forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
};

const initNavigation = () => {
  const toggle = document.querySelector('[data-js="menu-toggle"]');
  const mobileNav = document.getElementById('mobile-nav');
  const header = document.querySelector('.site-header');

  if (!toggle || !mobileNav || !header) return;

  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
    document.body.classList.toggle('menu-open', !expanded);
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu();
  });

  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 32);
  }, { passive: true });
};

const createPlatformCard = (platformKey) => {
  const metadata = PLATFORM_META[platformKey];
  const url = PLATFORM_LINKS[platformKey];
  if (!metadata || !safeLink(url)) return null;

  const card = createElement('article', 'glass-card platform-card');
  card.innerHTML = `
    <img src="${metadata.icon}" width="32" height="32" alt="" aria-hidden="true">
    <h3>${metadata.name}</h3>
    <p>${metadata.cta}</p>
    <a class="btn btn-outline" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${metadata.name} (opens in new tab)">Open ${iconArrow}</a>
  `;
  return card;
};

const renderPlatformGrid = (selector, platformKeys) => {
  const container = document.querySelector(selector);
  if (!container) return;

  const cards = platformKeys.map(createPlatformCard).filter(Boolean);

  if (!cards.length) {
    const fallback = createElement(
      'div',
      'empty-state glass-card',
      '<h3>Profiles will appear soon</h3><p>Official streaming and social destinations are added here as soon as each profile is published.</p>'
    );
    container.append(fallback);
    return;
  }

  const fragment = document.createDocumentFragment();
  cards.forEach((card) => fragment.append(card));
  container.append(fragment);
};

const createStreamingButtons = (links = {}) => {
  const streamingKeys = ['spotify', 'appleMusic', 'amazonMusic', 'youtubeMusic', 'youtube', 'soundcloud', 'bandcamp', 'deezer', 'tidal'];
  const linksHtml = streamingKeys
    .map((key) => {
      if (!safeLink(links[key])) return '';
      return `<a class="btn btn-icon" href="${links[key]}" target="_blank" rel="noopener noreferrer" aria-label="${PLATFORM_META[key].name} (opens in new tab)"><img src="${PLATFORM_META[key].icon}" width="18" height="18" alt="" aria-hidden="true"><span>${PLATFORM_META[key].name}</span></a>`;
    })
    .join('');

  return linksHtml || '<p class="muted">Streaming links will appear here once official profiles are configured.</p>';
};

const createReleaseCard = (release, compact = false) => {
  const card = createElement('article', `glass-card release-card ${compact ? 'compact' : ''}`);
  card.dataset.releaseId = release.id;
  card.innerHTML = `
    <div class="cover-wrap">
      <img src="${release.cover}" width="900" height="900" alt="${release.title} cover artwork" loading="lazy" decoding="async">
    </div>
    <div class="release-content">
      <p class="release-meta">${release.type} · ${release.year}</p>
      <h3>${release.title}</h3>
      <p>${release.description}</p>
      <div class="release-actions">
        <button class="btn btn-primary" type="button" data-action="play-release">Listen Now</button>
        <button class="btn btn-secondary" type="button" data-action="toggle-details" aria-expanded="false">More Details</button>
      </div>
      <div class="release-details" hidden>
        <p><strong>Release Date:</strong> ${formatDate(release.releaseDate)}</p>
        <p><strong>Duration:</strong> ${release.duration}</p>
        <p><strong>Composer:</strong> ${release.credits.composer}</p>
        <p><strong>Producer:</strong> ${release.credits.producer}</p>
        <p><strong>Copyright:</strong> ${release.credits.copyright}</p>
        <div class="platform-inline">${createStreamingButtons(release.links)}</div>
        ${
          release.tracks.length
            ? `<h4>Track List</h4><ol>${release.tracks
                .map((track) => `<li>${track.title} <span>${track.duration}</span></li>`)
                .join('')}</ol>`
            : '<p class="muted">Track details will be published with the full release notes.</p>'
        }
      </div>
    </div>
  `;
  return card;
};

const renderReleaseList = (selector, releases, compact = false) => {
  const container = document.querySelector(selector);
  if (!container) return;

  if (!releases.length) {
    container.innerHTML = `
      <article class="glass-card empty-state">
        <h3>New releases are in progress</h3>
        <p>The discography is being prepared and will appear here very soon.</p>
      </article>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();
  releases.forEach((release) => fragment.append(createReleaseCard(release, compact)));
  container.innerHTML = '';
  container.append(fragment);
};

const initReleaseActions = () => {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches('[data-action="toggle-details"]')) {
      const card = target.closest('.release-card');
      const panel = card?.querySelector('.release-details');
      if (!panel) return;
      const expanded = target.getAttribute('aria-expanded') === 'true';
      target.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      target.textContent = expanded ? 'More Details' : 'Hide Details';
    }

    if (target.matches('[data-action="play-release"]')) {
      const card = target.closest('.release-card');
      const releaseId = card?.dataset.releaseId;
      if (!releaseId) return;
      const release = RELEASES.find((item) => item.id === releaseId);
      if (!release || !release.tracks.length) {
        const live = document.querySelector('[data-js="live-region"]');
        if (live) live.textContent = `${release?.title || 'This release'} preview will be available soon.`;
        return;
      }
      openPlaylist(release);
      playCurrentTrack();
      document.querySelector('.audio-player')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
};

const buildPlayer = () => {
  const slot = document.querySelector(selectors.player);
  if (!slot) return;

  slot.innerHTML = `
    <section class="audio-player glass-card" aria-label="Music player">
      <div class="player-artwork">
        <img src="${getFeaturedRelease().cover}" width="120" height="120" alt="Current track cover" data-js="player-cover">
      </div>
      <div class="player-main">
        <p class="player-track" data-js="player-track">Select a release to start listening</p>
        <p class="player-artist" data-js="player-artist">${SITE_CONFIG.brandName}</p>
        <div class="progress-wrap">
          <span data-js="current-time">0:00</span>
          <input type="range" data-js="progress" min="0" max="100" value="0" aria-label="Track progress">
          <span data-js="duration">0:00</span>
        </div>
        <div class="player-controls">
          <button class="btn btn-icon" type="button" data-js="prev-track" aria-label="Previous track">⟨⟨</button>
          <button class="btn btn-primary" type="button" data-js="play-pause" aria-label="Play track">Play</button>
          <button class="btn btn-icon" type="button" data-js="next-track" aria-label="Next track">⟩⟩</button>
          <button class="btn btn-icon" type="button" data-js="mute-toggle" aria-label="Mute or unmute">Mute</button>
          <label class="volume-control">Volume
            <input type="range" data-js="volume" min="0" max="1" step="0.01" value="0.85" aria-label="Volume control">
          </label>
        </div>
      </div>
      <p class="sr-only" aria-live="polite" data-js="live-region"></p>
      <audio data-js="audio" preload="metadata"></audio>
    </section>
  `;

  state.audio = slot.querySelector('[data-js="audio"]');
  state.playlist = [];
  state.index = 0;

  bindPlayerEvents(slot);
};

const bindPlayerEvents = (slot) => {
  const audio = state.audio;
  if (!audio) return;

  const playPause = slot.querySelector('[data-js="play-pause"]');
  const progress = slot.querySelector('[data-js="progress"]');
  const volume = slot.querySelector('[data-js="volume"]');
  const muteToggle = slot.querySelector('[data-js="mute-toggle"]');

  playPause?.addEventListener('click', () => {
    if (!state.playlist.length) {
      const featured = getFeaturedRelease();
      if (featured.tracks.length) openPlaylist(featured);
    }

    if (!audio.src) return;
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => { /* Autoplay prevented */ });
      }
      playPause.textContent = 'Pause';
      playPause.setAttribute('aria-label', 'Pause track');
    } else {
      audio.pause();
      playPause.textContent = 'Play';
      playPause.setAttribute('aria-label', 'Play track');
    }
  });

  slot.querySelector('[data-js="prev-track"]')?.addEventListener('click', () => {
    if (!state.playlist.length) return;
    state.index = (state.index - 1 + state.playlist.length) % state.playlist.length;
    playCurrentTrack();
  });

  slot.querySelector('[data-js="next-track"]')?.addEventListener('click', () => {
    if (!state.playlist.length) return;
    state.index = (state.index + 1) % state.playlist.length;
    playCurrentTrack();
  });

  progress?.addEventListener('input', () => {
    if (!audio.duration || Number.isNaN(audio.duration)) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  volume?.addEventListener('input', () => {
    audio.volume = Number(volume.value);
  });

  muteToggle?.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteToggle.textContent = audio.muted ? 'Unmute' : 'Mute';
    muteToggle.setAttribute('aria-label', audio.muted ? 'Unmute audio' : 'Mute audio');
  });

  audio.addEventListener('ended', () => {
    if (!state.playlist.length) return;
    state.index = (state.index + 1) % state.playlist.length;
    playCurrentTrack();
  });

  audio.addEventListener('loadedmetadata', () => {
    const durationEl = slot.querySelector('[data-js="duration"]');
    if (durationEl) durationEl.textContent = toTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    if (progress) progress.value = String((audio.currentTime / audio.duration) * 100);
    const currentTimeEl = slot.querySelector('[data-js="current-time"]');
    if (currentTimeEl) currentTimeEl.textContent = toTime(audio.currentTime);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      playPause?.click();
    }
  });
};

const toTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${mins}:${secs}`;
};

const openPlaylist = (release) => {
  state.playlist = release.tracks.map((track) => ({ ...track, releaseTitle: release.title, cover: release.cover }));
  state.index = 0;
};

const playCurrentTrack = () => {
  const track = state.playlist[state.index];
  const audio = state.audio;
  if (!track || !audio) return;

  audio.src = track.src;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      /* Autoplay was prevented — user must interact first */
    });
  }

  const player = document.querySelector('.audio-player');
  if (!player) return;

  const cover = player.querySelector('[data-js="player-cover"]');
  const title = player.querySelector('[data-js="player-track"]');
  const artist = player.querySelector('[data-js="player-artist"]');
  const button = player.querySelector('[data-js="play-pause"]');
  const live = player.querySelector('[data-js="live-region"]');

  if (cover) {
    cover.src = track.cover;
    cover.alt = `${track.releaseTitle} cover artwork`;
  }
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = `${SITE_CONFIG.brandName} · ${track.releaseTitle}`;
  if (button) button.textContent = 'Pause';
  if (live) live.textContent = `Now playing ${track.title}`;
};

const renderHome = () => {
  const featured = getFeaturedRelease();
  const latest = getLatestReleases(5);

  const heroTitle = document.querySelector('[data-js="hero-title"]');
  const heroTagline = document.querySelector('[data-js="hero-tagline"]');
  const heroDescription = document.querySelector('[data-js="hero-description"]');
  const heroBackdrop = document.querySelector('[data-js="hero-backdrop"]');

  if (heroTitle) heroTitle.textContent = SITE_CONFIG.brandName;
  if (heroTagline) heroTagline.textContent = SITE_CONFIG.tagline;
  if (heroDescription) heroDescription.textContent = SITE_CONFIG.description;
  if (heroBackdrop) heroBackdrop.style.backgroundImage = `url(${SITE_CONFIG.heroImage})`;

  const featuredSlot = document.querySelector('[data-js="featured-release"]');
  if (featuredSlot) {
    featuredSlot.innerHTML = '';
    featuredSlot.append(createReleaseCard(featured));
  }

  renderReleaseList('[data-js="latest-releases"]', latest, true);

  const highlights = document.querySelector('[data-js="music-highlights"]');
  if (highlights) {
    highlights.innerHTML = HOME_HIGHLIGHTS.map(
      (item) => `
        <article class="glass-card highlight-card">
          <img src="${item.icon}" width="28" height="28" alt="${item.title} icon" loading="lazy" decoding="async">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </article>
      `
    ).join('');
  }

  renderPlatformGrid('[data-js="streaming-grid"]', [
    'spotify',
    'appleMusic',
    'amazonMusic',
    'youtubeMusic',
    'youtube',
    'soundcloud',
    'bandcamp',
    'deezer',
    'tidal'
  ]);

  renderPlatformGrid('[data-js="social-grid"]', ['youtube', 'facebook', 'instagram', 'tiktok', 'x', 'spotify', 'appleMusic']);
};

const renderMusicPage = () => {
  const featured = getFeaturedRelease();
  const slot = document.querySelector('[data-js="music-featured"]');
  if (slot) {
    slot.innerHTML = '';
    slot.append(createReleaseCard(featured));
  }
  renderReleaseList('[data-js="music-library"]', sortReleasesNewest);
};

const renderDiscography = () => {
  const listSlot = document.querySelector('[data-js="discography-list"]');
  const searchInput = document.querySelector('[data-js="release-search"]');
  const filterSelect = document.querySelector('[data-js="release-filter"]');

  if (!listSlot || !searchInput || !filterSelect) return;

  const renderFiltered = () => {
    const term = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    let items = [...sortReleasesNewest];
    if (filter === 'oldest') items = [...sortReleasesNewest].reverse();
    if (filter === 'album') items = items.filter((item) => item.type.toLowerCase() === 'album');
    if (filter === 'ep') items = items.filter((item) => item.type.toLowerCase() === 'ep');
    if (filter === 'single') items = items.filter((item) => item.type.toLowerCase() === 'single');

    if (term) {
      items = items.filter((item) => {
        const text = `${item.title} ${item.type} ${item.year}`.toLowerCase();
        return text.includes(term);
      });
    }

    renderReleaseList('[data-js="discography-list"]', items, true);
  };

  renderFiltered();
  searchInput.addEventListener('input', renderFiltered);
  filterSelect.addEventListener('change', renderFiltered);
};

const renderAbout = () => {
  const valuesSlot = document.querySelector('[data-js="values-grid"]');
  if (!valuesSlot) return;

  valuesSlot.innerHTML = VALUES.map(
    (item) => `
      <article class="glass-card value-card">
        <img src="${item.icon}" width="28" height="28" alt="${item.title} icon" loading="lazy" decoding="async">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </article>
    `
  ).join('');

  renderPlatformGrid('[data-js="about-social-grid"]', [
    'youtube',
    'spotify',
    'appleMusic',
    'amazonMusic',
    'youtubeMusic',
    'facebook',
    'instagram',
    'tiktok',
    'x',
    'soundcloud',
    'bandcamp',
    'deezer',
    'tidal'
  ]);
};

const renderContact = () => {
  const infoSlot = document.querySelector('[data-js="contact-info-grid"]');
  if (!infoSlot) return;

  const entries = [
    { title: 'Business Email', value: SITE_CONFIG.contactInfo.businessEmail },
    { title: 'Location', value: SITE_CONFIG.contactInfo.location },
    { title: 'Business Hours', value: SITE_CONFIG.contactInfo.businessHours },
    { title: 'Management Contact', value: SITE_CONFIG.contactInfo.management },
    { title: 'Booking Contact', value: SITE_CONFIG.contactInfo.booking }
  ].filter((entry) => safeLink(entry.value));

  infoSlot.innerHTML = entries
    .map(
      (entry) => `
        <article class="glass-card contact-card">
          <h3>${entry.title}</h3>
          <p>${entry.value}</p>
        </article>
      `
    )
    .join('');

  if (!entries.length) {
    infoSlot.innerHTML = '<article class="glass-card empty-state"><h3>Contact details are being updated</h3><p>Please use the contact form and we will reply as soon as possible.</p></article>';
  }

  const form = document.querySelector('[data-js="contact-form"]');
  const status = document.querySelector('[data-js="form-status"]');

  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const errors = [];
    if (!name) errors.push('Name is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
    if (!subject) errors.push('Subject is required.');
    if (message.length < 20) errors.push('Message should be at least 20 characters.');

    if (errors.length) {
      status.textContent = errors.join(' ');
      status.className = 'form-status error';
      return;
    }

    form.reset();
    status.textContent = 'Message sent successfully. Thank you for contacting LofiMellowHQ.';
    status.className = 'form-status success';
  });
};

const renderPrivacy = () => {
  const emailEl = document.querySelector('[data-js="privacy-email"]');
  if (emailEl) {
    emailEl.href = `mailto:${SITE_CONFIG.email}`;
    emailEl.textContent = SITE_CONFIG.email;
  }
};

const setMeta = () => {
  const page = getCurrentPage();
  const meta = PAGE_META[page] || PAGE_META.index;
  const canonicalHref = pageUrl(meta.canonical);

  document.title = meta.title;

  const ensureMeta = (selector, content, attribute = 'content') => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attribute, content);
  };

  ensureMeta('meta[name="description"]', meta.description);
  ensureMeta('meta[property="og:title"]', meta.title);
  ensureMeta('meta[property="og:description"]', meta.description);
  ensureMeta('meta[property="og:url"]', canonicalHref);
  ensureMeta('meta[name="twitter:title"]', meta.title);
  ensureMeta('meta[name="twitter:description"]', meta.description);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = canonicalHref;
};

const durationToISO = (dur) => {
  if (!dur || typeof dur !== 'string') return dur;
  const parts = dur.split(':');
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseInt(parts[1], 10);
    if (!Number.isNaN(m) && !Number.isNaN(s)) return `PT${m}M${s}S`;
  }
  return dur;
};

const setStructuredData = () => {
  const page = getCurrentPage();
  const meta = PAGE_META[page] || PAGE_META.index;
  const canonicalHref = pageUrl(meta.canonical);
  const jsonLdNode = document.getElementById('structured-data');
  if (!jsonLdNode) return;

  const featured = getFeaturedRelease();
  const topAlbums = sortReleasesNewest.slice(0, 3).map((release) => ({
    '@type': 'MusicAlbum',
    name: release.title,
    byArtist: {
      '@type': 'MusicGroup',
      name: SITE_CONFIG.brandName
    },
    datePublished: release.releaseDate,
    image: pageUrl(`/${release.cover}`),
    numTracks: release.tracks.length
  }));

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_CONFIG.domain}/` }
  ];
  if (page !== 'index') {
    const navMatch = SITE_CONFIG.nav.find((item) => item.href.replace('.html', '') === page);
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 2,
      name: navMatch?.label || meta.title.split('|')[0].trim(),
      item: canonicalHref
    });
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.domain}/#organization`,
        name: SITE_CONFIG.brandName,
        url: SITE_CONFIG.domain,
        logo: {
          '@type': 'ImageObject',
          url: pageUrl(`/${SITE_CONFIG.logoIcon}`)
        }
      },
      {
        '@type': 'MusicGroup',
        '@id': `${SITE_CONFIG.domain}/#musicgroup`,
        name: SITE_CONFIG.brandName,
        url: SITE_CONFIG.domain,
        sameAs: Object.values(PLATFORM_LINKS).filter(safeLink)
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.domain}/#website`,
        name: `${SITE_CONFIG.brandName} Official Website`,
        url: SITE_CONFIG.domain,
        inLanguage: SITE_CONFIG.language,
        publisher: { '@id': `${SITE_CONFIG.domain}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_CONFIG.domain}/discography.html?query={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalHref}#webpage`,
        url: canonicalHref,
        name: meta.title,
        description: meta.description,
        isPartOf: { '@id': `${SITE_CONFIG.domain}/#website` },
        about: { '@id': `${SITE_CONFIG.domain}/#musicgroup` },
        inLanguage: SITE_CONFIG.language
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems
      },
      {
        '@type': 'MusicAlbum',
        name: featured.title,
        byArtist: {
          '@type': 'MusicGroup',
          name: SITE_CONFIG.brandName
        },
        datePublished: featured.releaseDate,
        image: pageUrl(`/${featured.cover}`),
        numTracks: featured.tracks.length,
        track: featured.tracks.map((track, idx) => ({
          '@type': 'MusicRecording',
          position: idx + 1,
          name: track.title,
          duration: durationToISO(track.duration)
        }))
      },
      ...topAlbums
    ]
  };

  jsonLdNode.textContent = JSON.stringify(graph);
};

const initScrollActions = () => {
  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-scroll-target');
      const target = document.getElementById(targetId || '');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
};

const initPage = () => {
  renderShell();
  initNavigation();
  setMeta();
  setStructuredData();
  buildPlayer();
  initReleaseActions();
  initScrollActions();

  const page = getCurrentPage();
  if (page === 'index') renderHome();
  if (page === 'music') renderMusicPage();
  if (page === 'discography') renderDiscography();
  if (page === 'about') renderAbout();
  if (page === 'contact') renderContact();
  if (page === 'privacy') renderPrivacy();
};

document.addEventListener('DOMContentLoaded', initPage);
