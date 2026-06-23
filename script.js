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
      // Update active button
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

  // ---- Newsletter Form ----
  const newsletterForm = document.querySelector('#newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      if (email) {
        alert('📧 Thank you for subscribing! You\'ll receive design tips and resources.');
        this.querySelector('input[type="email"]').value = '';
      } else {
        alert('Please enter your email address.');
      }
    });
  }

  // ---- Contact Form ----
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.querySelector('input[placeholder="Your Name"]').value;
      const email = this.querySelector('input[placeholder="Email Address"]').value;
      const message = this.querySelector('textarea').value;

      if (name && email && message) {
        alert('✅ Thank you for your inquiry, ' + name + '! We will get back to you soon.');
        this.reset();
      } else {
        alert('⚠️ Please fill in all fields.');
      }
    });
  }

  // ============================================================
  // ---- NUMBER COUNTING ANIMATION ----
  // ============================================================
  
  // Function to animate counting
  function animateNumber(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
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
        // Final value
        if (isFloat) {
          element.textContent = target.toFixed(1) + suffix;
        } else {
          element.textContent = target + suffix;
        }
      }
    }
    
    requestAnimationFrame(updateCount);
  }

  // Function to extract number from text (handles K+, M+, +, etc.)
  function parseNumber(text) {
    const clean = text.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  }

  // Function to get suffix from text
  function getSuffix(text) {
    const match = text.match(/[^0-9.]+$/);
    return match ? match[0] : '';
  }

  // Track which stats have been animated
  const animatedStats = new Set();

  // Observer for stats numbers
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

  // Observe all stat numbers
  document.querySelectorAll('.stat h3').forEach(function(el) {
    statsObserver.observe(el);
  });

  // Observe founder stats
  document.querySelectorAll('.founder-stats .stat-item h3').forEach(function(el) {
    statsObserver.observe(el);
  });

  // Observe any other number elements with class .count-animate
  document.querySelectorAll('.count-animate').forEach(function(el) {
    statsObserver.observe(el);
  });

  // ---- Also animate numbers on the founder page stats ----
  // This will handle stats that might be added dynamically
  const founderStatsObserver = new MutationObserver(function() {
    document.querySelectorAll('.founder-stats .stat-item h3:not([data-animated])').forEach(function(el) {
      el.setAttribute('data-animated', 'true');
      statsObserver.observe(el);
    });
  });
  
  // Check for founder stats
  setTimeout(function() {
    document.querySelectorAll('.founder-stats .stat-item h3:not([data-animated])').forEach(function(el) {
      el.setAttribute('data-animated', 'true');
      statsObserver.observe(el);
    });
  }, 500);

  // ---- Also animate numbers in the stats-grid (testimonials, tools, etc.) ----
  document.querySelectorAll('.stat-card p, .stat-card:not(:has(p))').forEach(function(el) {
    // Check if the element contains a number
    const text = el.textContent;
    if (/\d/.test(text)) {
      // Only observe if it has a number
      statsObserver.observe(el);
    }
  });

  console.log('✅ Creatnprocess - Website loaded successfully!');
  console.log('📋 Navigation: Home | Tutorials | Portfolio | Academy | About | Contact');
  console.log('💡 Design by Creatnprocess Studio');
  console.log('🔢 Number counting animation enabled!');
})();
