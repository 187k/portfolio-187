class FuturisticPlayer {
    constructor(container) {
        this.container = container;
        this.video = container.querySelector('video');
        this.controls = container.querySelector('.player-controls');
        this.progressBar = container.querySelector('.progress-bar');
        this.progress = container.querySelector('.progress');
        this.playButton = container.querySelector('.play-pause');
        this.volumeButton = container.querySelector('.volume-toggle');
        this.volumeSlider = container.querySelector('.volume-slider');
        this.volumeLevel = container.querySelector('.volume-level');
        this.timeDisplay = container.querySelector('.time-display');
        this.fullscreenButton = container.querySelector('.fullscreen-toggle');
        this.qualityButton = container.querySelector('.quality-toggle');
        this.qualityLabel = this.qualityButton ? this.qualityButton.querySelector('.quality-label') : null;
        
        // Store available qualities
        this.qualities = {};
        this.video.querySelectorAll('source').forEach(source => {
            const quality = source.getAttribute('data-quality');
            if (quality) {
                this.qualities[quality] = source.src;
            }
        });
        
        this.currentQuality = '720'; // Default quality
        
        this.isPlaying = false;
        this.isMuted = false;
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        // Устанавливаем начальную громкость в 1%
        this.video.volume = 0.15;
        this.volumeLevel.style.width = '15%';
        
        // Определяем ориентацию видео после загрузки метаданных
        this.video.addEventListener('loadedmetadata', () => {
            if (this.video.videoHeight > this.video.videoWidth) {
                this.container.classList.add('vertical-video');
            }
        });
        
        // Специальная обработка для iOS
        if (this.isIOS) {
            this.container.classList.add('ios-device');
            
            // Переменные для отслеживания тача
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTime = 0;
            
            // Обработка начала касания
            this.video.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }, { passive: true });
            
            // Обработка окончания касания
            this.video.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();
                
                // Вычисляем расстояние и время касания
                const distanceX = Math.abs(touchEndX - touchStartX);
                const distanceY = Math.abs(touchEndY - touchStartY);
                const timeDiff = touchEndTime - touchStartTime;
                
                // Если движение минимально и время короткое - это тап
                if (distanceX < 10 && distanceY < 10 && timeDiff < 200) {
                    this.togglePlay();
                }
            }, { passive: true });
        }
        
        this.initializePlayer();
    }
    
    initializePlayer() {
        // Set initial quality to 720p
        this.setQuality('720');
        
        // Play/Pause
        this.playButton.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.togglePlay());
        
        // Остановка других видео при воспроизведении
        this.video.addEventListener('play', () => {
            document.querySelectorAll('.futuristic-player video').forEach(video => {
                if (video !== this.video && !video.paused) {
                    video.pause();
                }
            });
        });
        
        // Progress bar
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));
        
        // Volume
        this.volumeButton.addEventListener('click', () => this.toggleMute());
        
        // Quality toggle
        if (this.qualityButton) {
            this.qualityButton.addEventListener('click', () => this.toggleQuality());
        }
        
        // Улучшенное управление громкостью
        let isVolumeDragging = false;
        
        this.volumeSlider.addEventListener('mousedown', (e) => {
            isVolumeDragging = true;
            this.setVolume(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isVolumeDragging) {
                this.setVolume(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isVolumeDragging = false;
        });
        
        // Time display
        this.video.addEventListener('timeupdate', () => this.updateTimeDisplay());
        
        // Fullscreen
        this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        
        // Loading state
        this.video.addEventListener('waiting', () => this.container.classList.add('loading'));
        this.video.addEventListener('canplay', () => this.container.classList.remove('loading'));
        
        // Update button icons
        this.video.addEventListener('play', () => {
            this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
            this.isPlaying = true;
        });
        
        this.video.addEventListener('pause', () => {
            this.playButton.innerHTML = '<i class="fas fa-play"></i>';
            this.isPlaying = false;
        });
    }
    
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }
    
    updateProgress() {
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.progress.style.width = `${progress}%`;
    }
    
    setProgress(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }
    
    toggleMute() {
        this.video.muted = !this.video.muted;
        this.isMuted = this.video.muted;
        this.volumeButton.innerHTML = this.isMuted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
        this.volumeLevel.style.width = this.isMuted ? '0%' : `${this.video.volume * 100}%`;
    }
    
    setVolume(e) {
        const rect = this.volumeSlider.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.video.volume = pos;
        this.volumeLevel.style.width = `${pos * 100}%`;
        
        if (this.video.volume === 0) {
            this.volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            this.video.muted = true;
            this.isMuted = true;
        } else {
            this.volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            this.video.muted = false;
            this.isMuted = false;
        }
    }
    
    updateTimeDisplay() {
        const current = this.formatTime(this.video.currentTime);
        const duration = this.formatTime(this.video.duration);
        this.timeDisplay.textContent = `${current} / ${duration}`;
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    toggleQuality() {
        // Toggle between 720p and 1080p
        const newQuality = this.currentQuality === '720' ? '1080' : '720';
        this.setQuality(newQuality);
    }

    setQuality(quality) {
        if (this.qualities[quality] && this.currentQuality !== quality) {
            const wasPlaying = !this.video.paused;
            const currentTime = this.video.currentTime;
            
            // Update current quality
            this.currentQuality = quality;
            
            // Update source
            this.video.src = this.qualities[quality];
            
            // Update quality label
            if (this.qualityLabel) {
                this.qualityLabel.textContent = quality + 'p';
            }
            
            // Restore playback state
            this.video.addEventListener('loadedmetadata', () => {
                this.video.currentTime = currentTime;
                if (wasPlaying) {
                    this.video.play();
                }
            }, { once: true });
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.container.requestFullscreen().then(() => {
                // После входа в полноэкранный режим
                this.fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
            }).catch(err => {
                console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                // После выхода из полноэкранного режима
                this.fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
            }).catch(err => {
                console.error(`Ошибка при выходе из полноэкранного режима: ${err.message}`);
            });
        }
    }
}

// Initialize all video players on the page
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем класс для iOS устройств
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        document.body.classList.add('ios-device');
    }
    
    const players = document.querySelectorAll('.futuristic-player');
    players.forEach(player => new FuturisticPlayer(player));
}); 