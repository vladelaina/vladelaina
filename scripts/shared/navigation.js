class SiteNavigation {
    constructor() {
        const filename = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
        this.currentPage = filename.replace('.html', '');
        this.lastScrollY = 0;
        this.ticking = false;
        this.headerMorphAnimations = [];
        this.init();
    }

    translate(english, chinese) {
        return document.documentElement.lang.startsWith('en') ? english : chinese;
    }

    generateNavigation() {
        const links = [
            ['index', 'index.html', 'Home', '首页', 'homeLink'],
            ['blog', 'blog.html', 'Blog', '博客', 'blogLink'],
            ['friends', 'friends.html', 'Friends', '友链', 'friendLink'],
        ];
        const activePage = this.currentPage === 'blog-post' ? 'blog' : this.currentPage;
        const open = this.translate('Open navigation', '打开导航菜单');
        const close = this.translate('Close navigation', '关闭导航菜单');
        return `
        <header class="main-header" id="main-header">
            <span class="main-header-surface" aria-hidden="true"></span>
            <nav class="container" aria-label="${this.translate('Main navigation', '主导航')}">
                <a href="index.html" class="logo"><img src="assets/vladelaina.jpg" class="site-avatar" alt="" width="40" height="40">vladelaina</a>
                <div class="nav-menu" id="nav-menu">
                    <ul class="nav-links">
                        ${links.map(([id, href, en, zh, key]) => `<li><a href="${href}" data-i18n="${key}"${id === activePage ? ' class="active" aria-current="page"' : ''}>${this.translate(en, zh)}</a></li>`).join('')}
                    </ul>
                    <div class="nav-actions">
                        <a href="support.html" class="nav-button support-btn"${this.currentPage === 'support' ? ' aria-current="page"' : ''}>
                            <i class="fas fa-mug-hot" aria-hidden="true"></i>
                            <span data-i18n="sponsorLink">${this.translate('Sponsor Developer', '赞助开发者')}</span>
                        </a>
                    </div>
                </div>
                <button class="mobile-menu-backdrop" type="button" tabindex="-1" aria-label="${close}"></button>
                <button class="mobile-menu-toggle" type="button" aria-label="${open}" aria-controls="nav-menu" aria-expanded="false" data-open-label="${open}" data-close-label="${close}">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>`;
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.render());
        } else {
            this.render();
        }
    }

    render() {
        let navContainer = document.querySelector('.main-header');
        
        if (!navContainer) {
            navContainer = document.createElement('div');
            document.body.insertBefore(navContainer, document.body.firstChild);
        }
        
        navContainer.outerHTML = this.generateNavigation();
        
        this.initializeInteractions();
    }

    initializeInteractions() {
        this.initializeMobileMenu();
        this.initializeToolsMenu();
        this.initializeScrollBehavior();
    }

    initializeMobileMenu() {
        const header = document.getElementById('main-header');
        const toggle = header?.querySelector('.mobile-menu-toggle');
        const backdrop = header?.querySelector('.mobile-menu-backdrop');
        if (!header || !toggle || !backdrop) return;

        const closeMenu = () => {
            header.classList.remove('mobile-menu-open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', toggle.dataset.openLabel);
            document.body.classList.remove('mobile-menu-locked');
            this.closeToolsMenu();
        };

        const openMenu = () => {
            header.classList.remove('nav-hidden');
            header.classList.add('mobile-menu-open');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', toggle.dataset.closeLabel);
            document.body.classList.add('mobile-menu-locked');
        };

        toggle.addEventListener('click', () => {
            if (header.classList.contains('mobile-menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        backdrop.addEventListener('click', closeMenu);
        header.querySelectorAll('.nav-links a:not(.dropdown-toggle), .nav-actions a, .logo').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && header.classList.contains('mobile-menu-open')) {
                closeMenu();
                toggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    initializeToolsMenu() {
        const dropdown = document.querySelector('.main-header .dropdown');
        const toggle = dropdown?.querySelector('.dropdown-toggle');
        if (!dropdown || !toggle) return;

        toggle.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = dropdown.classList.toggle('dropdown-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', event => {
            if (!dropdown.contains(event.target)) this.closeToolsMenu();
        });
    }

    closeToolsMenu() {
        const dropdown = document.querySelector('.main-header .dropdown');
        if (!dropdown) return;
        dropdown.classList.remove('dropdown-open');
        dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    }
    
    initializeScrollBehavior() {
        const isMobile = () => window.innerWidth <= 768;

        const handleScroll = () => {
            if (this.ticking) return;

            this.ticking = true;
            requestAnimationFrame(() => {
                this.updateHeaderState(isMobile());
                this.ticking = false;
            });
        };

        const handleResize = () => {
            this.updateHeaderState(isMobile());
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        this.updateHeaderState(isMobile());
    }

    updateHeaderState(isMobile) {
        const header = document.getElementById('main-header');
        if (!header) return;

        const currentScrollY = window.scrollY;

        this.updateScrolledState(header, currentScrollY > 50, isMobile);

        if (header.classList.contains('mobile-menu-open')) {
            header.classList.remove('nav-hidden');
            this.lastScrollY = currentScrollY;
            return;
        }

        if (!isMobile || currentScrollY <= 100) {
            header.classList.remove('nav-hidden');
        } else if (currentScrollY > this.lastScrollY) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }

        this.lastScrollY = currentScrollY;
    }

    updateScrolledState(header, shouldBeScrolled, isMobile) {
        if (header.classList.contains('scrolled') === shouldBeScrolled) return;

        if (isMobile || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.headerMorphAnimations.forEach(animation => animation.cancel());
            this.headerMorphAnimations = [];
            header.classList.toggle('scrolled', shouldBeScrolled);
            return;
        }

        const items = Array.from(header.querySelector('.container').children);
        const startHeaderRect = header.getBoundingClientRect();
        const startItemRects = items.map(item => item.getBoundingClientRect());

        this.headerMorphAnimations.forEach(animation => animation.cancel());
        this.headerMorphAnimations = [];
        header.classList.toggle('scrolled', shouldBeScrolled);

        const targetHeaderRect = header.getBoundingClientRect();
        const targetItemRects = items.map(item => item.getBoundingClientRect());
        const duration = 650;
        const easing = 'cubic-bezier(0.16, 1, 0.3, 1)';
        const startCenterX = startHeaderRect.left + startHeaderRect.width / 2;
        const startCenterY = startHeaderRect.top + startHeaderRect.height / 2;
        const targetCenterX = targetHeaderRect.left + targetHeaderRect.width / 2;
        const targetCenterY = targetHeaderRect.top + targetHeaderRect.height / 2;

        const surface = header.querySelector('.main-header-surface');
        this.headerMorphAnimations.push(surface.animate(
            [
                {
                    transform: `translate(${startCenterX - targetCenterX}px, ${startCenterY - targetCenterY}px) scale(${startHeaderRect.width / targetHeaderRect.width}, ${startHeaderRect.height / targetHeaderRect.height})`,
                },
                { transform: 'translate(0, 0) scale(1, 1)' },
            ],
            { duration, easing },
        ));

        items.forEach((item, index) => {
            const startRect = startItemRects[index];
            const targetRect = targetItemRects[index];
            const deltaX = startRect.left - targetRect.left;
            const deltaY = startRect.top - targetRect.top;

            this.headerMorphAnimations.push(item.animate(
                [
                    { transform: `translate(${deltaX}px, ${deltaY}px)` },
                    { transform: 'translate(0, 0)' },
                ],
                { duration, easing },
            ));
        });

        const animationBatch = [...this.headerMorphAnimations];
        Promise.allSettled(animationBatch.map(animation => animation.finished))
            .then(() => {
                const isCurrentBatch = this.headerMorphAnimations.length === animationBatch.length
                    && this.headerMorphAnimations.every((animation, index) => animation === animationBatch[index]);
                if (isCurrentBatch) {
                    this.headerMorphAnimations = [];
                }
            });
    }
}

new SiteNavigation();
