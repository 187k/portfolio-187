document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.querySelector('.menu-container');
    const menuIcon = document.querySelector('.menu-icon');
    const lightbox = document.querySelector('.lightbox-overlay');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const imageItems = document.querySelectorAll('.image-item[data-lightbox="true"]');
    const previewVideos = document.querySelectorAll('.js-preview-video');
    const desktopOnlyVideos = document.querySelectorAll('video[data-desktop-only]');

    const isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    function safePlay(video) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    }

    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    if (menuContainer && menuIcon) {
        let menuOpen = false;

        const toggleMenu = (event) => {
            event.preventDefault();
            menuOpen = !menuOpen;
            menuContainer.classList.toggle('visible', menuOpen);
            menuIcon.classList.toggle('active', menuOpen);
        };

        if (window.PointerEvent) {
            menuIcon.addEventListener('pointerup', toggleMenu);
        } else {
            menuIcon.addEventListener('click', toggleMenu);
        }

        const menuItems = menuContainer.querySelectorAll('.menu-item');
        menuItems.forEach((item) => {
            item.addEventListener('click', () => {
                menuOpen = false;
                menuContainer.classList.remove('visible');
                menuIcon.classList.remove('active');
            });
        });
    }

    desktopOnlyVideos.forEach((video) => {
        const source = video.querySelector('source[data-src]');
        if (!source) {
            return;
        }

        if (window.matchMedia('(min-width: 769px)').matches) {
            source.src = source.dataset.src;
            video.load();
            safePlay(video);
        } else {
            video.pause();
            video.removeAttribute('autoplay');
        }
    });

    if (previewVideos.length > 0) {
        const previewObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;

                if (!entry.isIntersecting) {
                    video.pause();
                    return;
                }

                safePlay(video);
            });
        }, {
            threshold: 0.25,
            rootMargin: '150px 0px'
        });

        previewVideos.forEach((video) => {
            previewObserver.observe(video);

            if (!isCoarsePointer) {
                video.addEventListener('mouseenter', () => safePlay(video));
                video.addEventListener('focusin', () => safePlay(video));
            }
        });
    }

    if (lightbox && lightboxImg && lightboxClose && imageItems.length > 0) {
        imageItems.forEach((item) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (!img) {
                    return;
                }

                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || '';
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
});
