/* JaliHR blog: topic filters, the free-template modal and share buttons.
   Every "get it" button carries data-template="<name>". The modal shows the
   one HubSpot form for all templates, with the template name in the URL so
   HubSpot can record which one was asked for. */
(function () {
  'use strict';
  var FORM = 'https://2gx5l2.share-eu1.hsforms.com/2MMKTdDCSSZmskN1PwwvRUw';

  /* ---------- filters (blog home) ---------- */
  var chips = document.querySelector('.jb-chips');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.jb-grid .jb-post'));
  var count = document.querySelector('.jb-all .count');
  if (chips && cards.length) {
    var cats = ['All'];
    cards.forEach(function (c) { var k = c.getAttribute('data-cat'); if (cats.indexOf(k) < 0) cats.push(k); });
    cats.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = k; b.setAttribute('aria-pressed', k === 'All' ? 'true' : 'false');
      b.addEventListener('click', function () { apply(k); });
      chips.appendChild(b);
    });
    var apply = function (k) {
      var n = 0;
      cards.forEach(function (c) { var on = k === 'All' || c.getAttribute('data-cat') === k; c.hidden = !on; if (on) n++; });
      Array.prototype.forEach.call(chips.children, function (b) { b.setAttribute('aria-pressed', b.textContent === k ? 'true' : 'false'); });
      if (count) count.textContent = n === 1 ? '1 article' : n + ' articles';
    };
    apply('All');
  }

  /* ---------- template modal ---------- */
  var modal = document.createElement('div');
  modal.className = 'jb jb-modal';
  modal.innerHTML =
    '<div class="jb-dialog" role="dialog" aria-modal="true" aria-labelledby="jb-dlg-t">' +
      '<button type="button" class="x" aria-label="Close"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="#2B2F33" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<div class="eyebrow">Free template</div>' +
      '<h2 id="jb-dlg-t"></h2>' +
      '<p class="lead">Tell us where to send it and it will land in your inbox.</p>' +
      '<iframe title="Get the template" loading="lazy"></iframe>' +
    '</div>';
  var title = modal.querySelector('h2');
  var frame = modal.querySelector('iframe');
  var lastFocus = null;

  function open(name, lead) {
    lastFocus = document.activeElement;
    title.textContent = name;
    modal.querySelector('.lead').textContent = lead || 'Tell us where to send it and it will land in your inbox.';
    modal.querySelector('.eyebrow').textContent = name === 'Weekly email' ? 'Newsletter' : 'Free template';
    var src = FORM + '?template=' + encodeURIComponent(name) + '&page=' + encodeURIComponent(location.pathname);
    if (frame.getAttribute('src') !== src) frame.setAttribute('src', src);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.x').focus();
  }
  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.x')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  document.body.appendChild(modal);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-template]');
    if (!t) return;
    e.preventDefault();
    open(t.getAttribute('data-template'), t.getAttribute('data-lead'));
  });

  /* ---------- share ---------- */
  var li = document.querySelector('[data-share="linkedin"]');
  if (li) li.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(location.href.split('#')[0]);
  var cp = document.querySelector('[data-share="copy"]');
  if (cp) cp.addEventListener('click', function () {
    var url = location.href.split('#')[0];
    var done = function () { cp.textContent = 'Link copied'; setTimeout(function () { cp.textContent = 'Copy link'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
  });
})();
