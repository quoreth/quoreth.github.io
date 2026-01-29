<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neon Cyber Player</title>
    <!-- Font Awesome для иконок -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root {
            --bg-main: #0a001f;
            --bg-gradient: linear-gradient(135deg, #0a001f 0%, #1f003a 50%, #000000 100%);
            --glass: rgba(40, 25, 80, 0.3);
            --glass-strong: rgba(70, 40, 120, 0.45);
            --glass-border: rgba(180, 100, 255, 0.25);
            --text-primary: #ffffff;
            --text-muted: rgba(220, 200, 255, 0.8);
            --neon-pink: #ff00ff;
            --neon-cyan: #00ffff;
            --neon-purple: #ba6bff;
            --accent-gradient: linear-gradient(45deg, #ff00ff, #ba6bff, #00ffff);
            --glow-main: 0 0 50px rgba(186, 107, 255, 0.6);
            --glow-pink: 0 0 40px rgba(255, 0, 255, 0.7);
            --glow-cyan: 0 0 40px rgba(0, 255, 255, 0.7);
            --shadow-lg: 0 30px 80px rgba(0, 0, 0, 0.9);
            --radius-lg: 32px;
            --radius-md: 24px;
            --transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

            /* ПЕРЕМЕННЫЕ ДЛЯ БИТА (обновляются через JS) */
            --beat-scale: 1;
            --beat-blur: 20px;
            --beat-brightness: 1;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: var(--bg-gradient);
            background-attachment: fixed;
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px 120px;
            overflow-x: hidden;
            position: relative;
            
            /* Эффект вспышки фона */
            filter: brightness(var(--beat-brightness));
            transition: filter 0.05s linear;
        }

        /* Космический ореол */
        body::before {
            content: '';
            position: absolute;
            inset: 0;
            background: 
                radial-gradient(circle at 15% 85%, rgba(255, 0, 255, 0.2), transparent 40%),
                radial-gradient(circle at 85% 15%, rgba(0, 255, 255, 0.2), transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(186, 107, 255, 0.1), transparent 60%);
            pointer-events: none;
            z-index: -1;
        }

        #starfield {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: -2;
            pointer-events: none;
        }

        .playlist {
            width: 100%;
            max-width: 760px;
            flex: 1;
            overflow-y: auto;
            padding: 0 10px;
        }

        .track {
            background: var(--glass);
            /* Динамический блюр менюшек */
            backdrop-filter: blur(var(--beat-blur));
            -webkit-backdrop-filter: blur(var(--beat-blur));
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            padding: 26px 34px;
            margin-bottom: 22px;
            display: flex;
            align-items: center;
            gap: 30px;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
            position: relative;
            overflow: hidden;
        }

        .track::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: var(--radius-md);
            padding: 3px;
            background: var(--accent-gradient);
            background-size: 300%;
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            -webkit-mask-composite: xor;
            opacity: 0;
            transition: opacity 0.7s ease;
            animation: borderGlow 6s linear infinite;
        }

        .track:hover::before, .track.playing::before {
            opacity: 1;
        }

        .track:hover {
            transform: translateY(-15px) scale(1.03);
            background: var(--glass-strong);
            box-shadow: var(--glow-main), var(--shadow-lg);
        }

        .track.playing {
            background: rgba(186, 107, 255, 0.25);
            box-shadow: var(--glow-main), var(--glow-pink), var(--shadow-lg);
            animation: pulseGlow 4s infinite alternate;
            /* Пульсация активного трека */
            transform: scale(var(--beat-scale));
        }

        @keyframes pulseGlow {
            from { box-shadow: var(--glow-main), var(--glow-pink), var(--shadow-lg); }
            to { box-shadow: 0 0 70px rgba(186, 107, 255, 0.8), 0 0 70px rgba(255, 0, 255, 0.7), var(--shadow-lg); }
        }

        @keyframes borderGlow {
            0% { background-position: 0% 50%; }
            100% { background-position: 300% 50%; }
        }

        .track-number {
            font-size: 24px;
            font-weight: 800;
            min-width: 70px;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .track.playing .track-number {
            text-shadow: var(--glow-pink);
        }

        .track-title {
            flex: 1;
            font-size: 22px;
            font-weight: 600;
            letter-spacing: 1px;
            background: linear-gradient(90deg, #ffffff, #00ffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .no-tracks {
            text-align: center;
            padding: 140px 40px;
            font-size: 28px;
            font-weight: 600;
            color: var(--text-muted);
            background: var(--glass);
            backdrop-filter: blur(20px);
            border-radius: var(--radius-lg);
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-lg);
        }

        .player {
            position: fixed;
            bottom: 20px;
            left: 50%;
            /* Пульсация плеера */
            transform: translateX(-50%) scale(var(--beat-scale));
            width: 360px;
            background: var(--glass);
            backdrop-filter: blur(var(--beat-blur));
            -webkit-backdrop-filter: blur(var(--beat-blur));
            border-radius: var(--radius-lg);
            border: 1px solid var(--glass-border);
            padding: 40px 35px;
            box-shadow: var(--glow-main), var(--shadow-lg);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            text-align: center;
            z-index: 10;
            transition: transform 0.05s linear;
        }

        .player::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: var(--radius-lg);
            padding: 4px;
            background: var(--accent-gradient);
            background-size: 300%;
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            animation: borderGlow 8s linear infinite;
            opacity: 0.9;
        }

        #current-title {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 1.8px;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: var(--glow-main);
            min-height: 40px;
        }

        .play-btn {
            width: 100px;
            height: 100px;
            background: var(--accent-gradient);
            background-size: 300%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: white;
            cursor: pointer;
            box-shadow: var(--glow-main), 0 25px 60px rgba(0,0,0,0.7);
            transition: var(--transition);
            animation: borderGlow 6s linear infinite;
        }

        .play-btn:hover {
            transform: scale(1.2);
            box-shadow: 0 0 90px rgba(186, 107, 255, 0.9), 0 0 90px rgba(255, 0, 255, 0.9);
        }

        .progress-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 14px;
            font-size: 18px;
            color: var(--text-muted);
        }

        .time-display {
            display: flex;
            justify-content: space-between;
            font-weight: 500;
        }

        .progress-bar {
            width: 100%;
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: inset 0 4px 12px rgba(0,0,0,0.5);
        }

        #progress {
            width: 0%;
            height: 100%;
            background: var(--accent-gradient);
            background-size: 300%;
            border-radius: 10px;
            box-shadow: var(--glow-pink);
            animation: borderGlow 5s linear infinite;
            transition: width 0.3s ease;
        }

        .volume-control {
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 26px;
            color: var(--neon-cyan);
        }

        #volume {
            width: 150px;
            height: 10px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            accent-color: var(--neon-pink);
            box-shadow: var(--glow-pink);
        }
    </style>
</head>
<body>

    <canvas id="starfield"></canvas>

    <div class="playlist">
        <!-- Примеры треков -->
        <div class="track" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">
            <div class="track-number">01</div>
            <div class="track-title">Midnight Drive</div>
        </div>
        <div class="track" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">
            <div class="track-number">02</div>
            <div class="track-title">Neon Dreams</div>
        </div>
        <div class="track" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3">
            <div class="track-number">03</div>
            <div class="track-title">Cyber Rain</div>
        </div>
    </div>

    <div class="player">
        <div id="current-title">Выберите трек</div>
        
        <div class="play-btn" id="play-btn">
            <i class="fas fa-play"></i>
        </div>

        <div class="progress-container">
            <div class="time-display">
                <span id="current-time">0:00</span>
                <span id="duration">0:00</span>
            </div>
            <div class="progress-bar">
                <div id="progress"></div>
            </div>
        </div>

        <div class="volume-control">
            <i class="fas fa-volume-up"></i>
            <input type="range" id="volume" min="0" max="1" step="0.01" value="0.7">
        </div>
    </div>

    <audio id="audio" crossorigin="anonymous"></audio>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const audio = document.getElementById('audio');
            const playBtn = document.getElementById('play-btn');
            const currentTitle = document.getElementById('current-title');
            const progress = document.getElementById('progress');
            const currentTimeEl = document.getElementById('current-time');
            const durationEl = document.getElementById('duration');
            const volumeEl = document.getElementById('volume');
            const progressBar = document.querySelector('.progress-bar');
            let currentTrackEl = null;

            // --- НАСТРОЙКА ВИЗУАЛИЗАЦИИ БИТА ---
            let audioCtx, analyser, source, dataArray;
            let isContextInit = false;

            function initAudioContext() {
                if (isContextInit) return;
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioCtx.createAnalyser();
                source = audioCtx.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioCtx.destination);
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                isContextInit = true;
                animateBeat();
            }

            function animateBeat() {
                requestAnimationFrame(animateBeat);
                if (!isContextInit || audio.paused) {
                    resetBeat();
                    return;
                }
                analyser.getByteFrequencyData(dataArray);

                // Анализируем бас (первые 4 диапазона частот)
                let bass = 0;
                for (let i = 0; i < 4; i++) {
                    bass += dataArray[i];
                }
                bass = bass / 4;

                // Нормализация значения (0.0 - 1.0)
                const intensity = bass / 255;

                // Применение эффектов через CSS переменные
                // 1. Пульсация (масштаб от 1.0 до 1.08)
                document.documentElement.style.setProperty('--beat-scale', 1 + (intensity * 0.08));
                // 2. Блюр (размытие от 20px до 45px)
                document.documentElement.style.setProperty('--beat-blur', (20 + (intensity * 25)) + 'px');
                // 3. Яркость фона (от 1.0 до 1.6)
                document.documentElement.style.setProperty('--beat-brightness', 1 + (intensity * 0.6));
            }

            function resetBeat() {
                document.documentElement.style.setProperty('--beat-scale', '1');
                document.documentElement.style.setProperty('--beat-blur', '20px');
                document.documentElement.style.setProperty('--beat-brightness', '1');
            }

            // --- Звездный фон ---
            const canvas = document.getElementById('starfield');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const stars = [];
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1,
                    speed: Math.random() * 0.5 + 0.2
                });
            }
            function animateStars() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                stars.forEach(star => {
                    star.y += star.speed;
                    if (star.y > canvas.height) star.y = 0;
                    ctx.fillRect(star.x, star.y, star.size, star.size);
                });
                requestAnimationFrame(animateStars);
            }
            animateStars();

            // --- Логика плеера ---
            document.querySelectorAll('.track').forEach(track => {
                track.addEventListener('click', () => {
                    initAudioContext(); // Активируем аудио-движок
                    const src = track.dataset.src;
                    playTrack(src, track);
                });
            });

            function playTrack(src, el) {
                if (currentTrackEl) currentTrackEl.classList.remove('playing');
                el.classList.add('playing');
                currentTrackEl = el;
                audio.src = src;
                audio.play().catch(e => console.log("Ошибка воспроизведения:", e));
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                currentTitle.textContent = el.querySelector('.track-title').textContent;
            }

            playBtn.addEventListener('click', () => {
                initAudioContext();
                if (audio.src) {
                    if (audio.paused) {
                        audio.play();
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        audio.pause();
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            });

            audio.addEventListener('timeupdate', () => {
                if (audio.duration) {
                    const percent = (audio.currentTime / audio.duration) * 100;
                    progress.style.width = percent + '%';
                    currentTimeEl.textContent = formatTime(audio.currentTime);
                }
            });

            audio.addEventListener('loadedmetadata', () => {
                durationEl.textContent = formatTime(audio.duration);
            });

            audio.addEventListener('ended', () => {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                if (currentTrackEl) currentTrackEl.classList.remove('playing');
                resetBeat();
            });

            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                audio.currentTime = (clickX / rect.width) * audio.duration;
            });

            volumeEl.addEventListener('input', (e) => {
                audio.volume = e.target.value;
            });

            function formatTime(seconds) {
                const m = Math.floor(seconds / 60);
                const s = Math.floor(seconds % 60);
                return `${m}:${s.toString().padStart(2, '0')}`;
            }

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        });
    </script>
</body>
</html>