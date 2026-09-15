(() => {
    document.body.insertAdjacentHTML('beforeend', `
<div class="scroll-progress-container" id="scrollProgressContainer" role="button" tabindex="0" aria-label="返回顶部">
        <div class="scroll-progress-glow"></div>
        <div class="scroll-progress-particles">
            <span class="particle p1"></span>
            <span class="particle p2"></span>
            <span class="particle p3"></span>
            <span class="particle p4"></span>
            <span class="particle p5"></span>
            <span class="particle p6"></span>
            <span class="particle p7"></span>
            <span class="particle p8"></span>
        </div>
        <svg class="scroll-progress-circle" viewBox="0 0 100 100">
            <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7aa2f7" />
                    <stop offset="50%" stop-color="#9aaee8" />
                    <stop offset="100%" stop-color="#f77daa" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <circle class="scroll-progress-circle-bg" cx="50" cy="50" r="45"></circle>
            <circle class="scroll-progress-circle-fill" cx="50" cy="50" r="45"></circle>
            <circle class="scroll-progress-circle-inner" cx="50" cy="50" r="35"></circle>
            <path class="scroll-progress-circle-deco" d="M50,15 A35,35 0 0,1 85,50 A35,35 0 0,1 50,85 A35,35 0 0,1 15,50 A35,35 0 0,1 50,15 Z" />
        </svg>
        <div class="scroll-progress-icon">
            <i class="fas fa-arrow-up"></i>
        </div>
        <div class="scroll-progress-emoji-container">
            <span class="emoji emoji-rocket">🚀</span>
            <span class="emoji emoji-star">⭐</span>
            <span class="emoji emoji-heart">💖</span>
            <span class="emoji emoji-sparkles">✨</span>
        </div>
        <div class="scroll-progress-stars">
            <span class="star star-1">✦</span>
            <span class="star star-2">✧</span>
            <span class="star star-3">✦</span>
            <span class="star star-4">✧</span>
            <span class="star star-5">✦</span>
            <span class="star star-6">✧</span>
        </div>
        <div class="scroll-progress-percentage">0%</div>
        <div class="scroll-progress-tooltip" data-i18n="backToTop">返回顶部</div>
    </div>
    `);
    const root = document.getElementById('scrollProgressContainer');
    const circle = root.querySelector('.scroll-progress-circle-fill');
    const percentage = root.querySelector('.scroll-progress-percentage');
    const tooltip = root.querySelector('.scroll-progress-tooltip');
    const length = 2 * Math.PI * 45;
    circle.style.strokeDasharray = length;
    let pending = false;

    function update() {
        pending = false;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
        circle.style.strokeDashoffset = length * (1 - progress);
        percentage.textContent = Math.round(progress * 100) + '%';
        const visible = window.scrollY > 300;
        root.classList.toggle('visible', visible);
        root.style.opacity = visible ? '1' : '0';
        root.style.pointerEvents = visible ? 'auto' : 'none';
        root.tabIndex = visible ? 0 : -1;
        root.setAttribute('aria-hidden', String(!visible));
        const label = document.documentElement.lang.startsWith('en') ? 'Back to Top' : '返回顶部';
        tooltip.textContent = label;
        root.setAttribute('aria-label', label);
    }
    function scheduleUpdate() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
    }
    function backToTop() {
        root.classList.add('clicked');
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        setTimeout(() => root.classList.remove('clicked'), 500);
    }
    root.addEventListener('click', backToTop);
    root.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            backToTop();
        }
    });
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    new ResizeObserver(scheduleUpdate).observe(document.body);
    new MutationObserver(scheduleUpdate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    update();
})();
