/* =========================
   Hamburger Navigation — Vanilla JS
   Toggles .nav-open on <nav> at mobile widths
   ========================= */
(function () {
    var nav = document.querySelector('nav');
    var btn = nav ? nav.querySelector('.hamburger') : null;
    if (!nav || !btn) return;

    /* Toggle menu open/closed when the button is clicked */
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = nav.classList.toggle('nav-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        btn.textContent = isOpen ? '\u2715' : '\u2630'; /* ✕ or ☰ */
    });

    /* Close when any nav link is clicked (e.g. anchor links on same page) */
    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('nav-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = '\u2630';
        });
    });

    /* Close when clicking anywhere outside the nav */
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) {
            nav.classList.remove('nav-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.textContent = '\u2630';
        }
    });
})();
