/* ==============================================
   Salmon4neko Studio — 互動腳本
   ============================================== */

'use strict';

// ---- 導航列捲動效果 ----
(function () {
    const header = document.getElementById('page-header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ---- 手機選單開關 ----
(function () {
    const toggle = document.getElementById('menu-toggle');
    const menu   = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
        toggle.classList.remove('is-open');
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
    };

    toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.toggle('is-open');
        menu.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        menu.setAttribute('aria-hidden', String(!isOpen));
    });

    menu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            closeMenu();
        }
    });
})();

// ---- Intersection Observer：進場動畫 ----
(function () {
    const targets = document.querySelectorAll(
        '.s4n-section-label, .s4n-section-title, .s4n-section-lead, ' +
        '.s4n-service-card, .s4n-partner-card, .s4n-stat-box, ' +
        '.s4n-about-box, .s4n-contact-item, .s4n-contact-cta-box, ' +
        '.s4n-hero-content, .s4n-hero-visual, ' +
        '.s4n-service-detail-content, .s4n-service-detail-visual, ' +
        '.s4n-page-hero-inner, .s4n-news-hero-inner, .s4n-news-card'
    );

    targets.forEach(el => el.classList.add('s4n-fade-in'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
})();

// ---- 平滑捲動：錨點連結 ----
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();

            const offset = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();

// ---- 導航項目啟用狀態（捲動追蹤，僅首頁）----
(function () {
    const sections  = ['about', 'services', 'partners', 'contact'];
    const navLinks  = {};
    let hasLinks    = false;

    sections.forEach(id => {
        const el = document.getElementById('nav-' + id);
        if (el) { navLinks[id] = el; hasLinks = true; }
    });
    if (!hasLinks) return;

    const onScroll = () => {
        const scrollY = window.scrollY + 100;
        let active = '';

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollY) active = id;
        });

        Object.entries(navLinks).forEach(([id, link]) => {
            if (link.classList.contains('is-active') && id !== active) {
                link.classList.remove('is-active');
            } else if (id === active && !link.classList.contains('is-active')) {
                link.classList.add('is-active');
            }
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// ---- 服務卡片：滑鼠光暈（亮色系版本）----
(function () {
    const cards = document.querySelectorAll('.s4n-service-card, .s4n-partner-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
            const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
            card.style.background =
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,99,16,0.05), transparent 55%), #ffffff`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });
})();
