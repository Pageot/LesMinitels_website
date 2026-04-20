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

  const demo = document.querySelector('[data-demo]');
  if (demo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const textEl = demo.querySelector('.demo-text');
    const opt1 = demo.querySelector('[data-key="opt1"]');
    const opt2 = demo.querySelector('[data-key="opt2"]');

    const sequences = {
      fr: [
        { bad: "Je voudrais vous confirmez ma présence", fix: "Je voudrais vous confirmer ma présence" },
        { bad: "Nous somme disponible demain", fix: "Nous sommes disponibles demain" },
        { bad: "Il faut que je vous envois le fichier", fix: "Il faut que je vous envoie le fichier" },
      ],
      en: [
        { bad: "I would like to confirmed my presence", fix: "I would like to confirm my presence" },
        { bad: "We are availible tomorow", fix: "We are available tomorrow" },
        { bad: "Could you sent me the file please", fix: "Could you send me the file please" },
      ]
    };
    const seqs = sequences[currentLang];
    let idx = 0;

    const wait = (ms) => new Promise(r => setTimeout(r, ms));
    const renderLine = (cls, text) => {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text;
      textEl.replaceChildren(span);
    };
    const press = (el) => {
      if (!el) return;
      el.classList.add('pressed');
      setTimeout(() => el.classList.remove('pressed'), 140);
    };

    // Pause when tab hidden or demo off-screen to avoid burning CPU in the background
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    io.observe(demo);
    const awake = () =>
      document.visibilityState === 'visible' && visible
        ? Promise.resolve()
        : new Promise(r => {
            const check = () => {
              if (document.visibilityState === 'visible' && visible) r();
              else setTimeout(check, 400);
            };
            check();
          });

    (async function loop() {
      while (true) {
        await awake();
        const seq = seqs[idx % seqs.length];
        renderLine('bad', seq.bad);
        await wait(2000);
        press(opt1); await wait(150);
        press(opt2); await wait(350);
        renderLine('fix', seq.fix);
        await wait(3200);
        idx++;
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
