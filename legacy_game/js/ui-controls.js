/**
 * UI Controls for Renewable Invaders Integration
 * Handles Start Screen and Pause Menu logic independent of the core game engine.
 */

window.onload = function () {
    console.log("Juego pausado. Esperando al usuario.");
    const startScreen = document.getElementById('game-start-screen');
    const startBtn = document.getElementById('btn-start-game');
    const pauseBtn = document.getElementById('pause-btn');

    let isPaused = false;

    // Start Button Logic
    startBtn.addEventListener('click', function () {
        // Ocultar pantalla de inicio
        startScreen.style.display = 'none';

        // Mostrar botón de pausa
        pauseBtn.classList.remove('hidden');

        // Iniciar el juego manualmente llamando a la función global original
        if (typeof startGame === 'function') {
            startGame();
        } else {
            console.error("No se encontró la función startGame del juego original.");
        }
    });

    // Pause Button Logic
    pauseBtn.addEventListener('click', function () {
        if (!isPaused) {
            // PAUSE
            // 1. Stop Game Loop (gameArea is global in iftysquare.js)
            clearInterval(gameArea.interval);
            // 2. Stop Timer (timeout is global in iftysquare.js)
            clearTimeout(timeout);

            isPaused = true;
            pauseBtn.innerText = "▶";
            pauseBtn.classList.add('paused');
        } else {
            // RESUME
            // 1. Restart Game Loop (GAME_SPEED and FPS are global)
            gameArea.interval = setInterval(updateGame, GAME_SPEED / FPS);
            // 2. Restart Timer
            updateChrono();

            isPaused = false;
            pauseBtn.innerText = "⏸";
            pauseBtn.classList.remove('paused');
        }
    });
};
