// Mobile menu toggle. The site is fully usable without JavaScript.
(function () {
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// State figures: show the figure first, then dissolve it into the state map.
// Hover (or tap) swaps back to the figure. Without JavaScript the map is shown.
(function () {
  var stages = document.querySelectorAll('.state-stage');
  if (!stages.length) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  stages.forEach(function (stage) {
    if (still) { stage.classList.add('is-on'); return; }
    stage.addEventListener('mouseenter', function () { stage.classList.remove('is-on'); });
    stage.addEventListener('mouseleave', function () { stage.classList.add('is-on'); });
    stage.addEventListener('click', function () { stage.classList.toggle('is-on'); });
  });
  if (still || !('IntersectionObserver' in window)) { stages.forEach(function (s) { s.classList.add('is-on'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      setTimeout(function () { el.classList.add('is-on'); }, 900);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  stages.forEach(function (s) { io.observe(s); });
})();

// How we work: arches rise when the section scrolls into view.
(function () {
  var rise = document.querySelector('.rise');
  if (!rise) return;
  if (!('IntersectionObserver' in window)) { rise.classList.add('is-up'); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { rise.classList.add('is-up'); io.disconnect(); }
  }, { threshold: 0.35 });
  io.observe(rise);
})();

// Scroll reveal: elements fade up as they enter the viewport; items in a group stagger.
(function () {
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var groups = [
    'main .block h2', 'main .block > .wrap > .lede', '.verticals-text > div', '.vlist li', '.dash li',
    '.cols > div', '.values > div', '.initiatives > li', '.audiences > div', '.facts > div',
    '.partners li', '.states figure', '.feature > figure', '.feature > div', '.art-band img',
    '.project-art', '.pair', '.prose p', '.closing h2', '.closing .btn', '.contact-art img'
  ];
  var items = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest('.hero') || el.closest('.rise') || el.classList.contains('reveal')) return;
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(sel); });
      var i = sibs.indexOf(el);
      el.style.setProperty('--d', Math.min(i, 6) * 0.09 + 's');
      el.classList.add('reveal');
      items.push(el);
    });
  });
  if (still || !('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
  // Safety net: on scroll (and after load) reveal anything already on or above the screen,
  // so fast scrolling can never leave content hidden.
  var ticking = false;
  function sweep() {
    ticking = false;
    items.forEach(function (el) {
      if (!el.classList.contains('in') && el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('in');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(sweep); }
  }, { passive: true });
  window.addEventListener('load', function () { setTimeout(sweep, 600); });
})();
