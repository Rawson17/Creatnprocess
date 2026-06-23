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

      const filter = this.textContent.toLowerCase();

      projects.forEach(function(project) {
        // Get the category from the image text or data attribute
        const projectText = project.querySelector('.image')?.textContent?.toLowerCase() || '';
        const category = project.dataset.category || '';

        if (filter === 'all') {
          project.style.display = 'block';
        } else if (projectText.includes(filter) || category.includes(filter)) {
          project.style.display = 'block';
        } else {
          project.style.display = 'none';
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

  // ---- Console Log ----
  console.log('✅ Creatnprocess - Website loaded successfully!');
  console.log('📋 Navigation: Home | Tutorials | Portfolio | Academy | About | Contact');
  console.log('💡 Design by Creatnprocess Studio');
})();