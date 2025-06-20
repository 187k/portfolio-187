document.addEventListener('DOMContentLoaded', function() {
    // Создаем IntersectionObserver
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Получаем video элемент
            const video = entry.target;
            
            // Если элемент входит в область видимости
            if (entry.isIntersecting) {
                // Получаем все source элементы
                const sources = video.getElementsByTagName('source');
                
                // Для каждого source элемента
                for (let source of sources) {
                    // Получаем оригинальный URL из data-атрибута
                    const url = source.dataset.src;
                    if (url) {
                        // Устанавливаем src только когда элемент виден
                        source.src = url;
                    }
                }
                
                // Загружаем видео
                video.load();
                
                // Прекращаем наблюдение после загрузки
                videoObserver.unobserve(video);
            }
        });
    }, {
        // Настройки
        rootMargin: '50px 0px', // Загружать видео когда оно находится в пределах 50px от области видимости
        threshold: 0.1 // Загружать когда хотя бы 10% видео видно
    });

    // Находим все video элементы
    const lazyVideos = document.querySelectorAll('.futuristic-player video');

    // Для каждого видео
    lazyVideos.forEach(video => {
        // Получаем все source элементы
        const sources = video.getElementsByTagName('source');
        
        // Для каждого source элемента
        for (let source of sources) {
            // Сохраняем оригинальный URL в data-атрибуте
            source.dataset.src = source.src;
            // Очищаем src
            source.src = '';
        }

        // Начинаем наблюдение за видео
        videoObserver.observe(video);
    });
}); 