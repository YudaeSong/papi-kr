// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close menu when link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data using FormData API
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const button = this.querySelector('button');
        const originalText = button.textContent;

        try {
            button.textContent = '전송 중...';
            button.disabled = true;

            console.log('📨 전송 데이터:', { name, email, subject, message });

            // EmailJS로 이메일 전송
            const result = await emailjs.send(
                'service_parapia',
                'template_778yx3k',
                {
                    name: name,
                    email: email,
                    title: subject,
                    message: message
                }
            );

            console.log('✅ 이메일 전송 성공:', result);

            // 성공 메시지
            button.textContent = '✓ 전송되었습니다!\n곧 회신 드리겠습니다.';

            // Reset form
            this.reset();

            // Restore button after 4 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 4000);

        } catch (error) {
            console.error('❌ 이메일 전송 실패:', error);
            button.textContent = '전송 실패. 다시 시도해주세요.';
            button.disabled = false;

            setTimeout(() => {
                button.textContent = originalText;
            }, 3000);
        }
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    observer.observe(section);
});

// Navbar background on scroll
const nav = document.querySelector('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-md');
        } else {
            nav.classList.remove('shadow-md');
        }
    });
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Stats section animation (if needed)
const statsElements = document.querySelectorAll('[data-count]');
let hasAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statsElements.forEach(element => {
                const target = parseInt(element.getAttribute('data-count'));
                animateCounter(element, target);
            });
        }
    });
}, { threshold: 0.5 });

if (statsElements.length > 0) {
    const statsSection = statsElements[0].closest('section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Lazy load images
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
});

// Initialize AOS-like animations on scroll
window.addEventListener('load', () => {
    // EmailJS 초기화
    if (typeof emailjs !== 'undefined') {
        emailjs.init('TCOIadBmeTVK7N2Wf');
        console.log('✅ EmailJS 초기화됨');
    } else {
        console.error('❌ EmailJS 라이브러리가 로드되지 않았습니다.');
    }

    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transition = 'all 0.6s ease-out';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(element);
    });
});
