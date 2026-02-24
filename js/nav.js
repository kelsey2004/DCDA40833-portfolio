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

/* =========================
   Image Carousel — Vanilla JS
   Cycles through .carousel-slide elements within each .carousel
   ========================= */
(function () {
    document.querySelectorAll('.carousel').forEach(function (carousel) { /* I did not understand what  '.querySelector' or '.querySelectorAll' meant. After asking AI, I learned .querySelector() returns the first element that matches a given CSS selector, like '.Carousel-prev.' .querySelectAll returns all matching elements, not just the first one.*/
        var slides = carousel.querySelectorAll('.carousel-slide'); /* Looping through each all the .carousel on the page (Tool 1 and Tool 2) and is setting up variables */
        var prevBtn = carousel.querySelector('.carousel-prev'); 
        var nextBtn = carousel.querySelector('.carousel-next');
        var dotsContainer = carousel.querySelector('.carousel-dots');
        var currentIndex = 0;

        if (slides.length === 0) return;

        /* Build dot indicators */ /* I know what this does but not how. I know these are the dots are visible under the carousel. I understand that the active dot corresponds to the currently displayed slide. */
        slides.forEach(function (_, i) {
            var dot = document.createElement('span'); 
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active'); 
            dot.addEventListener('click', function () { goToSlide(i); });
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) { /* This moves the carousel to a specific slide. It adds, removes, or switches what is being viewed on the slides and dots. */
            slides[currentIndex].classList.remove('active');
            dotsContainer.children[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dotsContainer.children[currentIndex].classList.add('active');
        }

        prevBtn.addEventListener('click', function () { /* I don't understand what this does, specifically the 'Btn.addEventlistner.'  */
            goToSlide(currentIndex - 1); /* After asking AI, I learned that this listens for clicks on the arrow button and moves the carousel backwards*/
        });

        nextBtn.addEventListener('click', function () {
            goToSlide(currentIndex + 1); /* This listens for clicks on the arrow button and advance the carousel forward*/
        });

        /* Fullscreen expand / collapse */
        var expandBtn = carousel.querySelector('.carousel-expand');
        expandBtn.addEventListener('click', function () { /* Listen for clicks on the expand button */
            var isFullscreen = carousel.classList.toggle('carousel-fullscreen'); /* switches to full screen view */
            expandBtn.innerHTML = isFullscreen ? '\u2715' : '\u26F6';
            expandBtn.setAttribute('aria-label', isFullscreen ? 'Exit full screen' : 'Full screen');
            document.body.style.overflow = isFullscreen ? 'hidden' : '';
        });
    });

    /* Press Escape to exit fullscreen */
    document.addEventListener('keydown', function (e) {  
        if (e.key === 'Escape') { /* Checks to see if the Escape key is the one being pressed */
            document.querySelectorAll('.carousel-fullscreen').forEach(function (c) { /* If it is, it looks for any carousel currently in fullscreen */
                c.classList.remove('carousel-fullscreen'); /* Exits fullscreen */
                var btn = c.querySelector('.carousel-expand'); /* Goes back to the normal apperance with the expand button being visible */
                btn.innerHTML = '\u26F6';
                btn.setAttribute('aria-label', 'Full screen');
                document.body.style.overflow = '';
            });
        }
    });
})();
