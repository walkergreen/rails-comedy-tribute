/* Rails Comedy tribute — nav, slideshow, lightbox, scroll reveal */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- mobile nav ---------------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- slideshow data ---------------- */
  var SLIDES = [
    { src: 'img/merely-players.avif',     cap: 'The Merely Players — improvised Shakespeare, March 2025' },
    { src: 'img/off-cue.avif',            cap: 'Off Cue — short form, May 2025' },
    { src: 'img/cage-match.avif',         cap: 'Improv Cage Match — December 2024' },
    { src: 'img/etch-a-sketch.avif',      cap: 'Etch A Sketch — sketch showcase, December 2024' },
    { src: 'img/meet-cute.avif',          cap: 'Meet Cute — live blind date show, December 2024' },
    { src: 'img/fanfiction-theater.avif', cap: 'Fanfiction Theater — December 2024' },
    { src: 'img/mothers-pouch.avif',      cap: "Mother's Pouch at DC Sketchfest — March 2025" },
    { src: 'img/sketchfest-preview.avif', cap: 'DC Sketchfest — March 2025' },
    { src: 'img/etch-a-sketch-2.avif',     cap: 'Etch A Sketch — October 2024' },
    { src: 'img/danielle-steger.avif',    cap: 'Danielle Steger Finds a Job! — October 2025' },
    { src: 'img/danielle-steger-2.avif',  cap: 'Danielle Steger Finds a Job! — October 2025' },
    { src: 'img/two-hander.avif',         cap: 'On the Rails stage — October 2025' },
    { src: 'img/two-hander-2.avif',       cap: 'On the Rails stage — October 2025' },
    { src: 'img/after-hours.avif',        cap: 'After Hours — improvised late night talk show, October 2025' },
    { src: 'img/after-hours-2.avif',      cap: 'After Hours — October 2025' },
    { src: 'img/after-hours-3.avif',      cap: 'After Hours — October 2025' },
    { src: 'img/happy-family-dinner.avif',cap: 'Happy Family Dinner — October 2025' },
    { src: 'img/happy-family-dinner-2.avif', cap: 'Happy Family Dinner — October 2025' },
    { src: 'img/kevin-mcdonald.avif', cap: 'Kevin McDonald at Rails Comedy — June 2025' },
    { src: 'img/kevin-mcdonald-2.avif', cap: 'Kevin McDonald at Rails Comedy — June 2025' },
    { src: 'img/kevin-mcdonald-3.avif', cap: 'Kevin McDonald at Rails Comedy — June 2025' },
    { src: 'img/meet-cute-2.avif', cap: 'Meet Cute: Live Blind Date Show — September 2025' },
    { src: 'img/meet-cute-3.avif', cap: 'Meet Cute: Live Blind Date Show — September 2025' },
    { src: 'img/fanfiction-2.avif', cap: 'Fanfiction Theater — October 2025' },
    { src: 'img/fanfiction-3.avif', cap: 'Fanfiction Theater — October 2025' },
    { src: 'img/fanfiction-4.avif', cap: 'Fanfiction Theater — October 2025' },
    { src: 'img/bobbys.avif', cap: 'The Bobbys — DC sketch comedy awards, March 2026' },
    { src: 'img/bobbys-2.avif', cap: 'The Bobbys — March 2026' },
    { src: 'img/bobbys-3.avif', cap: 'The Bobbys — March 2026' },
    { src: 'img/bobbys-4.avif', cap: 'The Bobbys — March 2026' }
  ];

  var track = document.getElementById('track');
  var dotsWrap = document.getElementById('dots');
  var caption = document.getElementById('caption');
  var count = document.getElementById('count');
  var playBtn = document.getElementById('playbtn');

  if (!track) return;

  SLIDES.forEach(function (s, i) {
    var fig = document.createElement('div');
    fig.className = 'slide';
    fig.setAttribute('role', 'group');
    fig.setAttribute('aria-roledescription', 'slide');
    fig.setAttribute('aria-label', (i + 1) + ' of ' + SLIDES.length);

    var img = document.createElement('img');
    img.src = s.src;
    img.alt = s.cap;
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.addEventListener('click', function () { openLightbox(i); });
    fig.appendChild(img);
    track.appendChild(fig);

    var d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', function () { go(i); stop(); });
    dotsWrap.appendChild(d);
  });

  var dots = Array.prototype.slice.call(dotsWrap.children);
  var index = 0;
  var timer = null;
  var DELAY = 4800;

  function render() {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    caption.textContent = SLIDES[index].cap;
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(SLIDES.length).padStart(2, '0');
    dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === index)); });
  }
  function go(i) { index = (i + SLIDES.length) % SLIDES.length; render(); }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(next, DELAY);
    playBtn.textContent = '❚❚ Pause';
    playBtn.setAttribute('aria-label', 'Pause slideshow');
  }
  function stop() {
    clearInterval(timer);
    timer = null;
    playBtn.textContent = '▶ Play';
    playBtn.setAttribute('aria-label', 'Play slideshow');
  }

  document.querySelector('.sbtn--next').addEventListener('click', function () { next(); stop(); });
  document.querySelector('.sbtn--prev').addEventListener('click', function () { prev(); stop(); });
  playBtn.addEventListener('click', function () { timer ? stop() : start(); });

  /* pause when the slideshow is off screen or the tab is hidden */
  var wasPlaying = false;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { wasPlaying = !!timer; stop(); }
    else if (wasPlaying) { start(); }
  });

  var slideshow = document.querySelector('.slideshow');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.25 }).observe(slideshow);
  } else {
    start();
  }

  /* keyboard */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') { next(); showLightbox(); }
      if (e.key === 'ArrowLeft') { prev(); showLightbox(); }
      return;
    }
    var r = slideshow.getBoundingClientRect();
    var visible = r.top < window.innerHeight && r.bottom > 0;
    if (!visible) return;
    if (e.key === 'ArrowRight') { next(); stop(); }
    if (e.key === 'ArrowLeft') { prev(); stop(); }
  });

  /* touch swipe */
  var x0 = null;
  track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); stop(); }
    x0 = null;
  }, { passive: true });

  /* ---------------- lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCap = document.getElementById('lightbox-cap');
  var lastFocus = null;

  function showLightbox() {
    lbImg.src = SLIDES[index].src;
    lbImg.alt = SLIDES[index].cap;
    lbCap.textContent = SLIDES[index].cap + ' — photo by Mikail Faalasli';
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    index = i;
    render();
    showLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    stop();
    lightbox.querySelector('.lightbox__close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

  render();

  /* ---------------- scroll reveal ---------------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll(
      '.about__head, .about__body, .pillar, .show, .slides__head, .stage__inner, ' +
      '.pillars > .label, .pillars > .display, .farewell__inner, .onward__inner'
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (t, i) {
      t.classList.add('reveal');
      t.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(t);
    });
  }
})();
