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

 // ===== CONTACT FORM - Simple Version =====
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

// ============================================
// SUBSCRIBE FORM - AJAX HANDLER
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    const subscribeForm = document.getElementById('subscribeForm');
    const subscribeEmail = document.getElementById('subscribeEmail');
    const subscribeMessage = document.getElementById('subscribeMessage');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = subscribeEmail.value.trim();
            const messageDiv = subscribeMessage;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Hide previous message
            messageDiv.style.display = 'none';
            messageDiv.className = '';
            
            // Send AJAX request
            fetch('subscribe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'email=' + encodeURIComponent(email)
            })
            .then(response => response.json())
            .then(data => {
                // Show message
                messageDiv.style.display = 'block';
                messageDiv.textContent = data.message;
                
                if (data.success) {
                    messageDiv.style.color = '#8b5cf6';
                    subscribeEmail.value = '';
                    subscribeEmail.style.borderColor = '#8b5cf6';
                } else {
                    messageDiv.style.color = '#ef4444';
                    subscribeEmail.style.borderColor = '#ef4444';
                }
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Auto-hide success message after 5 seconds
                if (data.success) {
                    setTimeout(() => {
                        messageDiv.style.display = 'none';
                        subscribeEmail.style.borderColor = 'rgba(255,255,255,0.08)';
                    }, 5000);
                }
            })
            .catch(error => {
                messageDiv.style.display = 'block';
                messageDiv.style.color = '#ef4444';
                messageDiv.textContent = 'Network error. Please try again.';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                console.error('Error:', error);
            });
        });
        
        // Reset border on focus
        subscribeEmail.addEventListener('focus', function() {
            this.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        });
        
        subscribeEmail.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'rgba(255,255,255,0.08)';
            }
        });
    }
});
