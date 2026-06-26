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

  // ---- Portfolio Filter Functionality ----
  const filterButtons = document.querySelectorAll('.filters button');
  const projects = document.querySelectorAll('.project');

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');

      const filter = this.dataset.filter;

      projects.forEach(function(project) {
        const category = project.dataset.category || '';

        if (filter === 'all') {
          project.style.display = 'block';
          project.classList.remove('hidden');
        } else if (category === filter) {
          project.style.display = 'block';
          project.classList.remove('hidden');
        } else {
          project.style.display = 'none';
          project.classList.add('hidden');
        }
      });
    });
  });

  // ---- Contact Form (Formspree) ----
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          form.innerHTML = `
            <div style="
              text-align: center;
              padding: 30px 20px;
            ">
              <div style="
                font-size: 48px;
                margin-bottom: 16px;
              ">✅</div>
              <h3 style="
                color: #34D399;
                margin-bottom: 8px;
              ">Thank You!</h3>
              <p style="color: var(--muted);">
                Your inquiry has been sent. We'll get back to you soon!
              </p>
            </div>
          `;
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        alert('Something went wrong. Please try again or email us directly at hello@creatnprocess.com');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  });

  // ---- Number Counting Animation ----
  function animateNumber(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = start + (target - start) * easeOutQuart;
      
      if (isFloat) {
        element.textContent = current.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(current) + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (isFloat) {
          element.textContent = target.toFixed(1) + suffix;
        } else {
          element.textContent = target + suffix;
        }
      }
    }
    
    requestAnimationFrame(updateCount);
  }

  function parseNumber(text) {
    const clean = text.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  }

  function getSuffix(text) {
    const match = text.match(/[^0-9.]+$/);
    return match ? match[0] : '';
  }

  const animatedStats = new Set();

  const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animatedStats.has(entry.target)) {
        animatedStats.add(entry.target);
        const statElement = entry.target;
        const originalText = statElement.textContent;
        const target = parseNumber(originalText);
        const suffix = getSuffix(originalText);
        if (target > 0) {
          animateNumber(statElement, target, suffix, 2000);
        }
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stat h3').forEach(function(el) {
    statsObserver.observe(el);
  });

  console.log('✅ Creatnprocess - Website loaded successfully!');
})();