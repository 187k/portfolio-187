document.addEventListener('DOMContentLoaded', function() {
    // Создаем IntersectionObserver для lazy loading видео
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Получаем URL из data-src атрибута видео или source элементов
                const videoDataSrc = video.dataset.src;
                const sources = video.getElementsByTagName('source');
                
                // Если есть data-src на самом video элементе
                if (videoDataSrc && !video.src) {
                    video.src = videoDataSrc;
                }
                
                // Обрабатываем source элементы
                for (let source of sources) {
                    const url = source.dataset.src || source.getAttribute('data-src');
                    if (url && !source.src) {
                        source.src = url;
                    }
                }
                
                // Загружаем видео
                video.load();
                
                // Для autoplay видео начинаем воспроизведение после загрузки
                if (video.hasAttribute('autoplay')) {
                    video.play().catch(err => {
                        console.log('Autoplay prevented:', err);
                    });
                }
                
                // Прекращаем наблюдение после загрузки
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px', // Загружать видео когда оно находится в пределах 100px от области видимости
        threshold: 0.01 // Загружать когда хотя бы 1% видео видно
    });

    // Находим все video элементы с lazy loading (класс lazy-video или внутри .futuristic-player)
    const lazyVideos = document.querySelectorAll('.lazy-video, .futuristic-player video');

    // Для каждого видео
    lazyVideos.forEach(video => {
        // Сохраняем оригинальный src в data-src если его еще нет
        if (video.src && !video.dataset.src) {
            video.dataset.src = video.src;
            video.src = '';
        }
        
        // Получаем все source элементы
        const sources = video.getElementsByTagName('source');
        
        // Для каждого source элемента
        for (let source of sources) {
            // Сохраняем оригинальный URL в data-атрибуте если его еще нет
            if (source.src && !source.dataset.src) {
                source.dataset.src = source.src;
                // Очищаем src для lazy loading
                source.src = '';
            }
        }

        // Начинаем наблюдение за видео
        videoObserver.observe(video);
    });
}); 