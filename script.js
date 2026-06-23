/**
 * Creatnprocess - Main JavaScript
 * Handles cursor glow, scroll animations, counters, filters, and interactions
 */

(function() {
  'use strict';

  // ============================================
  // CURSOR GLOW
  // ============================================
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    document.addEventListener('mousemove', function(e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });

    // Hide glow on touch devices
    if ('ontouchstart' in window) {
      glow.style.display = 'none';
    }
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================
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

  // ============================================
  // NUMBER COUNTER
  // ============================================
  document.querySelectorAll('[data-count]').forEach(function(el) {
    const target = parseFloat(el.dataset.count);
    let current = 0;
    const duration = 1500; // ms
    const steps = 60;
    const increment = target / steps;

    const timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      // Format: if target has decimal, show one decimal place
      if (target % 1 !== 0) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current);
      }
    }, duration / steps);
  });

  // ============================================
  // FILTER BUTTONS (Portfolio)
  // ============================================
  const filterButtons = document.querySelectorAll('.filters button');
  const portfolioItems = document.querySelectorAll('.project');

  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      const filter = this.dataset.filter;

      portfolioItems.forEach(function(item) {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // BUTTON CLICK EFFECT
  // ============================================
  document.querySelectorAll('button, .btn, a.btn').forEach(function(el) {
    el.addEventListener('click', function(e) {
      this.classList.add('btn-click');
      setTimeout(function() {
        this.classList.remove('btn-click');
      }.bind(this), 200);
    });
  });

  // ============================================
  // SMOOTH NAVIGATION SCROLL
  // ============================================
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

  // ============================================
  // CONTACT FORM HANDLER
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your inquiry! We will get back to you soon.');
      this.reset();
    });
  }

  // ============================================
  // ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function(link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'white';
      }
    });
  }

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial call
  updateActiveLink();

})();