document.addEventListener('DOMContentLoaded', function() {    
    const menuContainer = document.querySelector('.menu-container');
    const menuIcon = document.querySelector('.menu-icon');
    const lightbox = document.querySelector('.lightbox-overlay');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const imageItems = document.querySelectorAll('.image-item');

    // Определяем, является ли устройство мобильным
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Функция для установки правильной высоты на мобильных устройствах
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Вызываем функцию сразу
    setVH();

    // Вызываем функцию при изменении размера окна или ориентации
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Обработчик для открытия/закрытия меню
    let menuOpen = false;
    
    const toggleMenu = (e) => {
        e.preventDefault();
        menuOpen = !menuOpen;
        if (menuOpen) {
            menuContainer.classList.add('visible');
            menuIcon.classList.add('active');
        } else {
            menuContainer.classList.remove('visible');
            menuIcon.classList.remove('active');
        }
    };

    // Добавляем обработчики для тач-устройств
    menuIcon.addEventListener('touchend', toggleMenu);
    menuIcon.addEventListener('click', toggleMenu);

    // Закрываем меню при клике на пункт меню
    const menuItems = menuContainer.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuOpen = false;
            menuContainer.classList.remove('visible');
            menuIcon.classList.remove('active');
        });
    });

    // ЭТО ВСЕГДА ВНАЧАЛЕ СТОИТ
    /* videos.forEach(video => {
        video.volume = 0.05;
        
        video.addEventListener('loadedmetadata', () => {
          video.volume = 0.05;
        });
        
    }); */

    imageItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = item.querySelector('img');
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
        });
    });

    lightboxClose.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

});