(function() {
    // ---- Cursor Glow ----
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
        document.addEventListener('mousemove', function(e) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ---- Scroll Reveal ----
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
    });

    // ---- Button Click Effect ----
    document.querySelectorAll('button, .btn, a.btn').forEach(function(el) {
        el.addEventListener('click', function(e) {
            this.classList.add('btn-click');
            setTimeout(function() {
                this.classList.remove('btn-click');
            }.bind(this), 180);
        });
    });

    // ---- Smooth Nav Scroll ----
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    const navHeight = document.querySelector('nav').offsetHeight || 80;
                    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

})();