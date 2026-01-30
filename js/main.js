
const STATE = {
    MENU: 'MENU',
    INTERMISSION: 'INTERMISSION',
    PLAYING: 'PLAYING',
    RESULT: 'RESULT',
    GAMEOVER: 'GAMEOVER'
};

class GameManager {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentState = STATE.MENU;
        this.lives = 4;
        this.score = 0;
        this.speedMultiplier = 1.0;

        // Timer
        this.timerMax = 0;
        this.timerCurrent = 0;

        // Microgames
        this.microgames = [
            new MatchGame(this.canvas),
            new DodgeGame(this.canvas)
        ];
        this.currentMicrogame = null;

        // UI Elements
        this.ui = {
            mainMenu: document.getElementById('main-menu'),
            intermission: document.getElementById('intermission-screen'),
            gameUI: document.getElementById('game-ui'),
            resultOverlay: document.getElementById('result-overlay'),
            gameOver: document.getElementById('game-over-screen'),
            livesContainer: document.getElementById('lives-container'),
            levelText: document.getElementById('level-text'),
            instructionText: document.getElementById('instruction-text'),
            timerBar: document.getElementById('timer-bar'),
            resultText: document.getElementById('result-text'),
            finalScore: document.getElementById('final-score'),
            btnStart: document.getElementById('btn-start'),
            btnRestart: document.getElementById('btn-restart')
        };

        this.bindEvents();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    bindEvents() {
        this.ui.btnStart.addEventListener('click', () => this.startGame());
        this.ui.btnRestart.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.lives = 4;
        this.score = 0;
        this.speedMultiplier = 1.0;
        this.switchState(STATE.INTERMISSION);
    }

    switchState(newState) {
        // Exit current state logic
        this.hideAllUI();

        this.currentState = newState;

        // Enter new state logic
        switch (newState) {
            case STATE.MENU:
                this.ui.mainMenu.classList.remove('hidden');
                break;
            case STATE.INTERMISSION:
                this.updateLivesUI();
                this.ui.levelText.innerText = `Puntuación: ${this.score}`;
                this.ui.intermission.classList.remove('hidden');

                // Intermission Time based on difficulty (Score)
                // < 10: Slow/Relaxed (3000ms)
                // 10-20: Normal (2000ms)
                // > 20: Fast (1000ms)
                let waitTime = 2000;
                if (this.score < 10) waitTime = 3000;
                else if (this.score >= 20) waitTime = 1000;

                setTimeout(() => {
                    if (this.currentState === STATE.INTERMISSION) {
                        this.startRandomMicrogame();
                    }
                }, waitTime);
                break;
            case STATE.PLAYING:
                this.ui.gameUI.style.display = 'block';
                break;
            case STATE.RESULT:
                this.ui.resultOverlay.classList.remove('hidden');
                break;
            case STATE.GAMEOVER:
                this.ui.finalScore.innerText = `Puntuación Final: ${this.score}`;
                this.ui.gameOver.classList.remove('hidden');
                break;
        }
    }

    hideAllUI() {
        this.ui.mainMenu.classList.add('hidden');
        this.ui.intermission.classList.add('hidden');
        this.ui.gameUI.style.display = 'none';
        this.ui.resultOverlay.classList.add('hidden');
        this.ui.gameOver.classList.add('hidden');
    }

    updateLivesUI() {
        this.ui.livesContainer.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const heart = document.createElement('span');
            heart.className = 'heart';
            heart.innerHTML = '❤️';
            this.ui.livesContainer.appendChild(heart);
        }
    }

    startRandomMicrogame() {
        // Pick random game
        this.currentMicrogame = this.microgames[Math.floor(Math.random() * this.microgames.length)];

        // Determine Difficulty config
        let difficulty = {
            tier: 'NORMAL',
            multiplier: 1.0
        };

        if (this.score < 10) {
            difficulty.tier = 'EASY';
            difficulty.multiplier = 0.8;
        } else if (this.score >= 20) {
            difficulty.tier = 'HARD';
            difficulty.multiplier = 1.5;
        }

        // Setup Game
        this.currentMicrogame.init(this.speedMultiplier, difficulty);

        // Setup Timer based on Game requirement (defaulting if not returned)
        // Some games might determine their own duration based on difficulty
        const requestedDuration = this.currentMicrogame.duration || 5000;
        this.timerMax = requestedDuration / this.speedMultiplier;
        this.timerCurrent = this.timerMax;

        // Show Instruction
        this.ui.instructionText.innerText = this.currentMicrogame.instruction;

        this.switchState(STATE.PLAYING);
    }

    loop(timestamp) {
        const dt = 16.67; // Fixed Time Step assumption for simplicity (60FPS)

        if (this.currentState === STATE.PLAYING) {
            this.updatePlaying(dt);
            this.drawPlaying();
        }

        requestAnimationFrame(this.loop);
    }

    updatePlaying(dt) {
        // Update Timer
        this.timerCurrent -= dt;

        // Visual Timer Bar
        const pct = Math.max(0, (this.timerCurrent / this.timerMax) * 100);
        this.ui.timerBar.style.width = `${pct}%`;

        // Check Timeout
        if (this.timerCurrent <= 0) {
            // Check if timeout is a win or loss condition for this specific game
            const isWin = this.currentMicrogame.winOnTimeout === true;
            this.handleMicrogameEnd(isWin);
            return;
        }

        // Update Microgame Logic
        if (this.currentMicrogame) {
            const result = this.currentMicrogame.update(dt);
            if (result === 'WIN') {
                this.handleMicrogameEnd(true);
            } else if (result === 'LOSE') {
                this.handleMicrogameEnd(false);
            }
        }
    }

    drawPlaying() {
        // Clear global canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render Microgame
        if (this.currentMicrogame) {
            this.currentMicrogame.render(this.ctx);
        }
    }

    handleMicrogameEnd(win) {
        this.switchState(STATE.RESULT);

        if (win) {
            this.ui.resultText.innerText = "¡BIEN!";
            this.ui.resultText.style.color = "#00FF00";
            this.score++;
            this.speedMultiplier += 0.05; // Increase speed
        } else {
            this.ui.resultText.innerText = "FAIL...";
            this.ui.resultText.style.color = "#FF0000";
            this.lives--;
        }

        setTimeout(() => {
            if (this.lives > 0) {
                this.switchState(STATE.INTERMISSION);
            } else {
                this.switchState(STATE.GAMEOVER);
            }
        }, 1500);
    }
}

// Start Game Manager when DOM is ready
window.addEventListener('load', () => {
    window.game = new GameManager();
});
