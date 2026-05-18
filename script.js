document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
        });
    }

    // 5. Modal Logic
    const modal = document.getElementById('consultModal');
    const openBtns = [document.getElementById('openModalBtn'), document.getElementById('ctaModalBtn')];
    const closeBtn = document.querySelector('.close-btn');

    openBtns.forEach(btn => {
        if(btn) {
            btn.addEventListener('click', () => {
                modal.classList.add('show');
            });
        }
    });

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // 6. Form Submission Logic
    const consultForm = document.getElementById('consultForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    if (consultForm) {
        consultForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.textContent = 'Göndərilir...';
            submitBtn.disabled = true;
            formMessage.className = 'form-message';
            formMessage.textContent = '';

            const countryCode = document.getElementById('countryCode').value;
            const phoneVal = document.getElementById('phone').value;
            const fullPhone = `${countryCode} ${phoneVal}`;

            const formData = {
                name: document.getElementById('name').value,
                phone: fullPhone,
                businessType: document.getElementById('businessType').value || 'Qeyd olunmayıb'
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formMessage.textContent = 'Müraciətiniz uğurla göndərildi! Sizinlə qısa zamanda əlaqə saxlayacağıq.';
                    formMessage.classList.add('success');
                    consultForm.reset();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error('Server error:', errorData);
                    throw new Error(errorData.error || 'Server xətası baş verdi.');
                }
            } catch (error) {
                console.error('Submission error:', error);
                formMessage.textContent = `Təəssüf ki, xəta baş verdi: ${error.message}. Zəhmət olmasa WhatsApp ilə yazın.`;
                formMessage.classList.add('error');
            } finally {
                submitBtn.textContent = 'Göndər';
                submitBtn.disabled = false;
            }
        });
    }
});
