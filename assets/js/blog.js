/* JaliHR blog: topic filters, the free-template modal and share buttons.
   Every "get it" button carries data-template="<name>". */
(function () {
  'use strict';

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

  /* ---------- template modal ----------
     One HubSpot form for every template. It renders inside the modal, and when
     it is submitted the modal swaps to the download links for that template.
     The page URL carries ?template=... while the form is open, so HubSpot's
     conversion page shows which template each lead asked for. */
  var HS = { region: 'eu1', portalId: '149353094', formId: '30c29374-3092-4999-ac90-dd4fc30bd153' };
  var DRIVE = 'https://drive.google.com/drive/folders/';
  var DOC = function (id) { return 'https://docs.google.com/document/d/' + id + '/copy'; };
  var SHEET = function (id) { return 'https://docs.google.com/spreadsheets/d/' + id + '/copy'; };
  var PACKS = {
    'Performance review pack': {
      slug: 'performance-review-pack',
      zip: '/assets/downloads/jalihr-performance-review-pack.zip',
      folder: DRIVE + '1A270DqExApXcPDfDEhCA45ewg81ueKaP',
      copies: [
        ['Performance Review Scorecard (Google Sheet)', SHEET('1xTOQAZkhBxUHwsR4VuKlc-VjjVNuLWS8bzhYPpszF1s')],
        ['Performance Review Form (Google Doc)', DOC('1pNqeFVGgfPGsv5gPuhZ6qoVduIybNhRR78dSOR9Q_4g')],
        ['Competency library (Google Sheet)', SHEET('144BivBAotjgLyxrPOX9nSHZpu0UcfHHUuvfecCDh9rs')],
        ['Role-specific question library (Google Sheet)', SHEET('1sIT-lyqpqimPkJbx7f5Q4p36zj5Xm_PojTUoSR5xqvQ')]
      ]
    },
    'Leave form and automated tracker': {
      slug: 'leave-form-and-tracker',
      zip: '/assets/downloads/jalihr-leave-form-and-tracker.zip',
      folder: DRIVE + '1nPVthUUuAPdYxtm5tzwdQHdNW4WQIaop',
      copies: [
        ['Leave Tracker (Google Sheet)', SHEET('1TuTIO8je903IDg-NPshpiYGhJTw8IdCrUG13r_F4tnQ')],
        ['Leave Request Form questions (Google Doc)', DOC('1Lm3wL0iPbgzvlDjoMlHhwS8CHJGdTNp4Y7zKHhClg7U')],
        ['Start here guide (Google Doc)', DOC('1Y5Wo2xRrIyL8UEkkYhCWPsfYoZcHkozQ6fXCN4oWXp4')]
      ]
    }
  };
  var slugOf = function (name) { return (PACKS[name] && PACKS[name].slug) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };

  var modal = document.createElement('div');
  modal.className = 'jb jb-modal';
  modal.innerHTML =
    '<div class="jb-dialog" role="dialog" aria-modal="true" aria-labelledby="jb-dlg-t">' +
      '<button type="button" class="x" aria-label="Close"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="#2B2F33" stroke-width="2" stroke-linecap="round"/></svg></button>' +
      '<div class="eyebrow">Free template</div>' +
      '<h2 id="jb-dlg-t"></h2>' +
      '<p class="lead"></p>' +
      '<div class="jb-hs"></div>' +
      '<div class="jb-done" hidden></div>' +
    '</div>';
  var title = modal.querySelector('h2');
  var lead = modal.querySelector('.lead');
  var hsBox = modal.querySelector('.jb-hs');
  var done = modal.querySelector('.jb-done');
  var current = null, lastFocus = null, cleanUrl = location.pathname + location.hash;

  function loadHs(cb) {
    if (window.hbspt && window.hbspt.forms) return cb();
    var s = document.createElement('script');
    s.src = 'https://js-eu1.hsforms.net/forms/embed/v2.js';
    s.onload = cb;
    document.head.appendChild(s);
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function showDone() {
    if (!current || !done.hidden) return;
    var p = PACKS[current];
    var h;
    if (current === 'Weekly email') {
      h = '<p class="lead">You\'re on the list. The next one lands in your inbox this week.</p>';
    } else if (!p) {
      h = '<p class="lead">Thank you. We\'re putting the finishing touches on this one and will email it to you as soon as it\'s ready.</p>';
    } else {
      h = '<p class="lead">Here it is. These files are <b>view only</b>: make your own copy or download them to start using them.</p>' +
        '<div class="jb-dl">' +
          '<p class="t">Use it in Google</p>' +
          p.copies.map(function (c) { return '<a class="jb-copy" href="' + c[1] + '" target="_blank" rel="noopener">Make a copy: ' + esc(c[0]) + '</a>'; }).join('') +
          '<p class="t">Or</p>' +
          '<a class="btn" href="' + p.zip + '" download>Download for Excel and Word (.zip)</a>' +
          '<a class="jb-folder" href="' + p.folder + '" target="_blank" rel="noopener">See the whole folder</a>' +
        '</div>';
    }
    hsBox.hidden = true; lead.hidden = true;
    done.innerHTML = h; done.hidden = false;
    modal.querySelector('.eyebrow').textContent = current === 'Weekly email' ? 'Newsletter' : 'Your download';
  }
  // HubSpot fires one of these when the form is submitted, depending on the form version.
  window.addEventListener('hs-form-event:on-submission:success', showDone);
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.type === 'hsFormCallback' && d.eventName === 'onFormSubmitted') showDone();
  });

  function open(name, leadText) {
    lastFocus = document.activeElement;
    current = name;
    title.textContent = name;
    lead.hidden = false; hsBox.hidden = false; done.hidden = true; done.innerHTML = '';
    lead.textContent = leadText || 'Leave your details and your download appears straight away.';
    modal.querySelector('.eyebrow').textContent = name === 'Weekly email' ? 'Newsletter' : 'Free template';
    history.replaceState(null, '', location.pathname + '?template=' + slugOf(name) + location.hash);
    hsBox.innerHTML = '';
    loadHs(function () {
      window.hbspt.forms.create({ region: HS.region, portalId: HS.portalId, formId: HS.formId, target: '.jb-hs', onFormSubmitted: showDone });
    });
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.x').focus();
  }
  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    history.replaceState(null, '', cleanUrl);
    current = null;
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
