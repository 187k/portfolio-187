document.addEventListener('DOMContentLoaded', function() {    
    const menuContainer = document.querySelector('.menu-container');
    const menuIcon = document.querySelector('.menu-icon');
   /*  const videos = document.querySelectorAll(".video-volume"); */
    const background = document.getElementById("background");

    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox-overlay');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const imageItems = document.querySelectorAll('.image-item');

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

    background.playbackRate = 0.7;

    menuContainer.addEventListener('mouseenter', function() {
        menuIcon.style.opacity = '0';
        menuIcon.style.pointerEvents = 'none';
    });
    
    menuContainer.addEventListener('mouseleave', function() {
        menuIcon.style.opacity = '1';
        menuIcon.style.pointerEvents = 'auto';
    });
});