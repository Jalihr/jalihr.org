/**
 * Site-wide navigation behaviour, shared by every page that loads it.
 *
 * Reconstructed from the markup and stylesheet contract because the original
 * main.js was not supplied with the restored HTML. Two behaviours only:
 * the hamburger opens the mobile menu (.nav__mobile.open), and the header
 * gains a shadow once the page is scrolled (.nav.scrolled).
 */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var hamburger = document.querySelector('.nav__hamburger');
  var mobile = document.querySelector('.nav__mobile');

  if (hamburger && mobile) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobile.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Follow a link and the menu should not stay open behind the new page.
    mobile.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        mobile.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  if (nav) {
    var applyScrolledState = function () {
      nav.classList.toggle('scrolled', window.scrollY > 0);
    };
    applyScrolledState();
    window.addEventListener('scroll', applyScrolledState, { passive: true });
  }
})();
