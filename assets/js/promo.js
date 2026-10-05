/**
 * Site-wide special offer bar.
 *
 * Loaded synchronously as the first thing in <body> so the bar is in place
 * before the page paints, with no jump. Closing it hides it for the rest of
 * the browser session only (sessionStorage), so a visitor who comes back in a
 * new session sees the offer again. Storage is wrapped in try/catch so a
 * blocked or private browser still shows the bar and lets it be closed.
 */
(function () {
  'use strict';

  var KEY = 'jali-promo-100';
  try { if (sessionStorage.getItem(KEY) === 'closed') return; } catch (e) {}

  var bar = document.createElement('div');
  bar.className = 'promo';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Special offer');
  bar.innerHTML =
    '<div class="promo-in">' +
      '<span class="promo-tag">Special offer</span>' +
      '<p class="promo-txt">Core is <b>free forever</b> for the first 100 clients.</p>' +
      '<a class="promo-btn" href="https://app.jalihr.org">Claim offer' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
      '</a>' +
    '</div>' +
    '<button class="promo-x" type="button" aria-label="Close this offer">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
    '</button>';

  bar.querySelector('.promo-x').addEventListener('click', function () {
    bar.remove();
    try { sessionStorage.setItem(KEY, 'closed'); } catch (e) {}
  });

  document.body.insertBefore(bar, document.body.firstChild);
})();
