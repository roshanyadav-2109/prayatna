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
