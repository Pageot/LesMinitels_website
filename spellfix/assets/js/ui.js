(function () {
  'use strict';

  const LANG_KEY = 'spellfix_lang';
  const currentLang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const otherLang = currentLang === 'fr' ? 'en' : 'fr';

  // i18n redirect: honor stored preference, else sniff browser on first visit.
  (function redirectIfNeeded() {
    try {
      const alt = document.querySelector('link[rel="alternate"][hreflang="' + otherLang + '"]');
      if (!alt) return;
      const altHref = alt.getAttribute('href');
      if (!altHref) return;
      const stored = localStorage.getItem(LANG_KEY);
      if (stored) {
        if (stored !== currentLang) window.location.replace(altHref);
        return;
      }
      const nav = (navigator.language || '').toLowerCase();
      const browserFr = nav.startsWith('fr');
      if (currentLang === 'fr' && !browserFr) window.location.replace(altHref);
      else if (currentLang === 'en' && browserFr) window.location.replace(altHref);
    } catch (e) {}
  })();

  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.marker').forEach((el) => {
    if (el.classList.contains('u1') || el.classList.contains('u2')) return;
    el.classList.add(Math.random() < 0.5 ? 'u1' : 'u2');
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  document.querySelectorAll('[data-lang-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      try { localStorage.setItem(LANG_KEY, btn.dataset.langSwitch); } catch (e) {}
      const to = btn.dataset.href;
      if (to && to !== window.location.pathname) window.location.href = to;
    });
  });

  const mail = document.querySelector('[data-mail]');
  if (mail && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const keycap = document.querySelector('.dt-keycap');
    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const press = (el) => {
      if (!el) return;
      el.classList.add('pressed');
      setTimeout(() => el.classList.remove('pressed'), 140);
    };

    // Pause when tab hidden or element off-screen
    let onScreen = true;
    let pendingWake = null;
    const isAwake = () => document.visibilityState === 'visible' && onScreen;
    const maybeWake = () => {
      if (pendingWake && isAwake()) {
        const r = pendingWake;
        pendingWake = null;
        r();
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => { onScreen = entry.isIntersecting; maybeWake(); },
      { threshold: 0.1 }
    );
    io.observe(mail);
    document.addEventListener('visibilitychange', maybeWake);
    const awake = () =>
      isAwake() ? Promise.resolve() : new Promise(r => { pendingWake = r; });

    const cursor = mail.querySelector('[data-mail-cursor]');
    const textBox = mail.querySelector('[data-mail-text]');
    const selBox = mail.querySelector('[data-mail-selection]');
    const selStart = mail.querySelector('[data-sel-start]');
    const selEnd = mail.querySelector('[data-sel-end]');

    // Measure per-line rects of the selection between greeting and signature,
    // and the cursor start/end positions (all relative to .mail-mock).
    // Runs at the start of each selecting phase so it stays correct on resize.
    function measureSelection() {
      if (!textBox || !selBox || !selStart || !selEnd) return null;
      const mailRect = mail.getBoundingClientRect();
      const textRect = textBox.getBoundingClientRect();

      // Iterate each <p> between start and end and collect per-line text rects.
      // Using selectNodeContents on each paragraph gives tight rects around the
      // actual glyphs — not the block's full content-box width.
      const allPs = Array.from(textBox.querySelectorAll('p'));
      const startIdx = allPs.indexOf(selStart);
      const endIdx = allPs.indexOf(selEnd);
      if (startIdx < 0 || endIdx < 0) return null;
      const selectedPs = allPs
        .slice(startIdx, endIdx + 1)
        .filter(p => !p.classList.contains('mail-blank'));

      const rawRects = [];
      for (const p of selectedPs) {
        const r = document.createRange();
        r.selectNodeContents(p);
        for (const rect of r.getClientRects()) {
          if (rect.width > 1 && rect.height > 1) rawRects.push(rect);
        }
        r.detach?.();
      }

      // Merge fragments that sit on the same visual line (y within 3px).
      // Nested spans split a line into multiple rects — join them end-to-end.
      const lines = [];
      for (const r of rawRects) {
        const top = r.top - textRect.top;
        const left = r.left - textRect.left;
        const right = left + r.width;
        const existing = lines.find(l => Math.abs(l.top - top) < 3);
        if (existing) {
          existing.left = Math.min(existing.left, left);
          existing.right = Math.max(existing.right, right);
          existing.height = Math.max(existing.height, r.height);
        } else {
          lines.push({ top, left, right, height: r.height });
        }
      }
      lines.sort((a, b) => a.top - b.top);
      lines.forEach(l => { l.width = l.right - l.left; });

      // Rebuild selection line divs
      selBox.replaceChildren();
      const totalDrag = 1200;
      const step = lines.length > 1 ? totalDrag / lines.length : 0;
      lines.forEach((l, i) => {
        const div = document.createElement('div');
        div.className = 'mail-selection__line';
        div.style.left = (l.left - 1) + 'px';
        div.style.top = (l.top - 1) + 'px';
        div.style.width = (l.width + 2) + 'px';
        div.style.height = (l.height + 2) + 'px';
        div.style.setProperty('--sel-delay', Math.round(i * step) + 'ms');
        selBox.appendChild(div);
      });

      // Cursor coords expressed relative to .mail-mock. For the end position,
      // measure the last text rect of selEnd so the cursor lands at the end of
      // the actual word, not at the paragraph's content-box right edge.
      const startRect = selStart.getBoundingClientRect();
      const endContentsRange = document.createRange();
      endContentsRange.selectNodeContents(selEnd);
      const endTextRects = endContentsRange.getClientRects();
      const lastTextRect = endTextRects[endTextRects.length - 1] || selEnd.getBoundingClientRect();
      endContentsRange.detach?.();
      return {
        lines,
        start: {
          x: startRect.left - mailRect.left - 2,
          y: startRect.top - mailRect.top + startRect.height * 0.35,
        },
        end: {
          x: lastTextRect.right - mailRect.left + 4,
          y: lastTextRect.top - mailRect.top + lastTextRect.height * 0.65,
        },
      };
    }

    (async function loop() {
      while (true) {
        await awake();
        // idle: typos visible with red wavy, pill at rest
        await wait(2000);

        // selecting: cursor fades in at text start, drags to end while the
        // blue selection fills line by line behind it
        const path = measureSelection();
        if (path && cursor) {
          cursor.style.transition = 'none';
          cursor.style.setProperty('--cx', path.start.x + 'px');
          cursor.style.setProperty('--cy', path.start.y + 'px');
          void cursor.offsetHeight;
          cursor.style.transition = '';
          mail.classList.add('has-cursor');
          await wait(200); // cursor fade-in
          mail.classList.add('is-selecting');
          cursor.style.setProperty('--cx', path.end.x + 'px');
          cursor.style.setProperty('--cy', path.end.y + 'px');
          await wait(1200); // drag + selection fill
          mail.classList.add('has-selection');
        }

        // pressing: double-tap on ⌥ (cursor + selection stay visible)
        press(keycap); await wait(340);
        press(keycap); await wait(460);

        // fixed: swap bad → fix, fade selection out
        mail.classList.add('is-fading-selection');
        mail.classList.remove('is-selecting');
        mail.classList.add('is-fixed');
        await wait(3000);

        // reset: cursor fades out, then revert to typo state
        mail.classList.remove('has-cursor');
        await wait(200);
        mail.classList.remove('is-fixed');
        mail.classList.remove('has-selection');
        mail.classList.remove('is-fading-selection');
        await wait(400);
      }
    })();
  }

  const tonesWrap = document.querySelector('[data-tones]');
  if (tonesWrap) {
    const target = document.querySelector('[data-tone-output]');
    const pills = tonesWrap.querySelectorAll('.pill');
    const texts = {
      fr: {
        original: "Je vous contacte car j'aimerais bien savoir si vous avez eu le temps de regarder ma proposition envoyée la semaine dernière.",
        professional: "Je vous écris afin de savoir si vous avez pu prendre connaissance de ma proposition adressée la semaine passée.",
        concise: "Avez-vous eu le temps de relire ma proposition de la semaine dernière ?",
        friendly: "Petit message rapide pour savoir si vous avez eu l'occasion de jeter un œil à ma proposition ! 🙂",
        moliere: "Céans je m'adresse à vous, eussiez-vous eu loisir d'ouïr ma missive mandée la semaine dernière ?"
      },
      en: {
        original: "I'm reaching out because I'd really like to know if you had the time to take a look at the proposal I sent last week.",
        professional: "I am writing to enquire whether you have had the opportunity to review the proposal I sent last week.",
        concise: "Did you get a chance to review my proposal from last week?",
        friendly: "Just a quick note — did you get a chance to peek at the proposal I sent last week? 🙂",
        moliere: "Pray tell, hath thou found the leisure to peruse the missive I did dispatch but one week past?"
      }
    };
    pills.forEach(p => {
      p.addEventListener('click', () => {
        pills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        const k = p.dataset.tone;
        if (target) {
          target.style.opacity = '0';
          setTimeout(() => {
            target.textContent = texts[currentLang][k] || texts[currentLang].original;
            target.style.opacity = '1';
          }, 180);
        }
      });
    });
  }
})();
