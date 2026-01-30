const GAME_AREA_WIDTH = 1920;
const GAME_AREA_HEIGHT = 1080;
const SQUARE_SIZE = 100;
const SQUARE_COLOR = "#00FFFF"; // Cyan/Blue for Clean Energy (Hero)
const SQUARE_SPEED_X = 15; // Increased speed slightly for better dodging
const SQUARE_SPEED_Y = 10;
const ASTEROID_MIN_SPEED = 3;
const ASTEROID_MAX_SPEED = 10;
const BACKGROUND_SPEED = 0.1;
const OBSTACLE_SPEED = 2;
const OBSTACLE_COLOR = "#FF0000"; // Red for Pollution (Obstacles)
const ASTEROID_COLOR = "#CC0000"; // Darker Red for Asteroids
const BACKGROUND_COLOR = "#1a1a1a"; // Dark Gray Background
const TEXT_COLOR = "#FFFFFF";
const OBSTACLE_MIN_HEIGHT = 40;
const OBSTACLE_MAX_HEIGHT = GAME_AREA_HEIGHT - 100;
const OBSTACLE_WIDTH = 20;
const ASTEROID_MAX_SIZE = 200;
const ASTEROID_MIN_SIZE = 10;
const OBSTACLE_MIN_GAP = 100;
const OBSTACLE_MAX_GAP = GAME_AREA_HEIGHT - 50;
const PROBABILITY_OBSTACLE = 0.7;
let PROBABILITY_ASTEROID = 0.6;
let FRAME_ASTEROID = 20;
const CHRONO_MSG = "Time goes by   ";
const LIFES_MSG = "STATUS: The ship ";
const NOT_DAMAGED_MSG = "is not damaged.";
const DAMAGED_MSG = "is DAMAGED.";
const HARDLY_DAMAGED_MSG = "is SERIOUSLY DAMAGED.";
const HAS_BEEN_DISTROYED_MSG = "has been destroyed.";
const CHRONO_DEATH_MSG = "You died at   ";
const RIGHTARROW_KEYCODE = 39;
const LEFTARROW_KEYCODE = 37;
const UPARROW_KEYCODE = 38;
const DOWNARROW_KEYCODE = 40;
const TAG_HERO = 0;
const TAG_OBSTACLE = 1;
const TAG_ASTEROID = 2;
const TAG_BACKGROUND = 3;
const FPS = 60;
const GAME_SPEED = 1000;
let ASTEROID_TYPE = 0;

class SquaredForm {
    constructor(x, y, width, height, color, tag, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.tag = tag;
        this.type = type; // Keep type just in case logic depends on it, though simplified graphics might not need it

        if (this.tag == TAG_HERO) {
            this.vidas = 3;
            this.color = SQUARE_COLOR;
        }
        else if (this.tag == TAG_ASTEROID) {
            this.color = ASTEROID_COLOR;
        }
        else if (this.tag == TAG_BACKGROUND) {
            // Not used in this simplified version, but keeping for compatibility if logic calls it
            this.color = BACKGROUND_COLOR;
        }
        else this.color = color;
    }

    setSpeedX(speedX) {
        this.speedX = speedX;
    }

    setSpeedY(speedY) {
        this.speedY = speedY;
    }

    render(context) {
        context.fillStyle = this.color;

        if (this.tag == TAG_ASTEROID) {
            // Draw circle for asteroid
            context.beginPath();
            let radius = this.width / 2;
            context.arc(this.x + radius, this.y + radius, radius, 0, 2 * Math.PI);
            context.fill();
        } else if (this.tag == TAG_HERO) {
            // Draw square for hero
            context.globalAlpha = 0.9;
            context.fillRect(this.x, this.y, this.width, this.height);
            context.globalAlpha = 1.0;
            // Add a simple outcome/inner border for detail
            context.strokeStyle = "#FFFFFF";
            context.lineWidth = 2;
            context.strokeRect(this.x, this.y, this.width, this.height);

        } else {
            // Default rectangle for obstacles and others
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    setIntoArea(endX, endY) {
        this.x = Math.min(Math.max(0, this.x), (endX - this.width));
        // Hero is vertically constrained, but we still ensure clamps if it tries to move
        this.y = Math.min(Math.max(0, this.y), (endY - this.height));
    }

    crashWith(obj) {
        // detect collision with the bounding box algorithm
        let myleft = this.x;
        let myright = this.x + this.width;
        let mytop = this.y;
        let mybottom = this.y + this.height;
        let otherleft = obj.x;
        let otherright = obj.x + obj.width;
        let othertop = obj.y;
        let otherbottom = obj.y + obj.height;
        let crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

class GameArea {
    constructor(canvas, hero, obstacles, backgrounds) {
        this.canvas = canvas;
        this.hero = hero;
        this.obstacles = obstacles;
        this.backgrounds = backgrounds; // We might not use this for scrolling anymore
        this.context = null;
        this.interval = null;
        this.frameBackgrounds = undefined;
        this.frameAsteroids = 0;
    }

    initialise() {
        this.canvas.width = GAME_AREA_WIDTH;
        this.canvas.height = GAME_AREA_HEIGHT;
        this.context = this.canvas.getContext("2d");
        let theDiv = document.getElementById("gameplay");
        theDiv.appendChild(this.canvas);
        this.interval = setInterval(updateGame, GAME_SPEED / FPS);
        this.frameBackgrounds = 0;

        // No scrolling background initialization needed for solid color
    }

    render() {
        // Clear with background color
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // We can skip rendering backgrounds if we want a static color, 
        // or keep it if we decide to add simple stars later. 
        // For now, let's assume backgrounds array is empty or unused for main bg.
        for (const background of this.backgrounds) {
            background.render(this.context);
        }
        this.hero.render(this.context);
        for (const obstacle of this.obstacles) {
            obstacle.render(this.context);
        }
        if (!continueTime) {
            // Draw Game Over Text
            this.context.fillStyle = "rgba(0, 0, 0, 0.7)";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.fillStyle = "#FFFFFF";
            this.context.font = "bold 80px Arial";
            this.context.textAlign = "center";
            this.context.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2);

            this.context.font = "30px Arial";
            this.context.fillText("Presiona F5 para reiniciar", this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
    }

    addBackground(background) {
        this.backgrounds.push(background);
    }

    removeObstacle(i) {
        this.obstacles.splice(i, 1);
    }

    removeBackground(i) {
        this.backgrounds.splice(i, 1);
    }
}

// Hero starts at Bottom Center. 
// X = (Width/2) - (Size/2)
// Y = Height - Size - 20 (Margin from bottom)
let theSquare = new SquaredForm(
    (GAME_AREA_WIDTH / 2) - (SQUARE_SIZE / 2),
    GAME_AREA_HEIGHT - SQUARE_SIZE - 20,
    SQUARE_SIZE, SQUARE_SIZE,
    SQUARE_COLOR, TAG_HERO
);

let rightArrowPressed = false,
    leftArrowPressed = false,
    upArrowPressed = false,
    downArrowPressed = false;
let seconds, timeout, theChrono, theLife;
let continueGame = true;
let continueTime = true;
let gameArea = new GameArea(document.createElement("canvas"), theSquare, [], []);

window.onload = startGame;

function handlerOne(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            if (!rightArrowPressed) {
                rightArrowPressed = true;
                theSquare.setSpeedX(SQUARE_SPEED_X);
            }
            break;
        case LEFTARROW_KEYCODE:
            if (!leftArrowPressed) {
                leftArrowPressed = true;
                theSquare.setSpeedX(-SQUARE_SPEED_X);
            }
            break;
        // DISABLED UPARROW AND DOWNARROW for Vertical Shooter
        // case UPARROW_KEYCODE:
        //     if (!upArrowPressed) {
        //         upArrowPressed = true;
        //         theSquare.setSpeedY(-SQUARE_SPEED_Y);
        //     }
        //     break;
        // case DOWNARROW_KEYCODE:
        //     if (!downArrowPressed) {
        //         downArrowPressed = true;
        //         theSquare.setSpeedY(SQUARE_SPEED_Y);
        //     }
        //     break;
        default:
            break;
    }
}

function handlerTwo(event) {
    switch (event.keyCode) {
        case RIGHTARROW_KEYCODE:
            rightArrowPressed = false;
            theSquare.setSpeedX(0);
            break;
        case LEFTARROW_KEYCODE:
            leftArrowPressed = false;
            theSquare.setSpeedX(0);
            break;
        // DISABLED UPARROW AND DOWNARROW for Vertical Shooter
        // case UPARROW_KEYCODE:
        //     upArrowPressed = false;
        //     theSquare.setSpeedY(0);
        //     break;
        // case DOWNARROW_KEYCODE:
        //     downArrowPressed = false;
        //     theSquare.setSpeedY(0);
        //     break;
        default:
            break;
    }
}

function startGame() {
    gameArea.initialise();
    gameArea.render();

    window.document.addEventListener("keydown", handlerOne);
    window.document.addEventListener("keyup", handlerTwo);

    seconds = 0;
    timeout = window.setTimeout(updateChrono, 1000);
    theChrono = document.getElementById("chrono");
    theLife = document.getElementById("life");
}

function updateGame() {
    // Check collision for ending game
    let collision = false;
    let asteroid_size;
    for (let i = 0; i < gameArea.obstacles.length; i++) {
        if (theSquare.crashWith(gameArea.obstacles[i])) {
            if (gameArea.obstacles[i].width > 30) {
                collision = true;
                asteroid_size = gameArea.obstacles[i].width;
                if (asteroid_size < SQUARE_SIZE - 20) gameArea.removeObstacle(i);
                break;
            }
        }
    }
    if (collision) subLife(asteroid_size);
    // Increase count of frames
    gameArea.frameAsteroids += 1;
    gameArea.frameBackgrounds += 1;

    if (gameArea.frameAsteroids >= FRAME_ASTEROID) gameArea.frameAsteroids = 1;
    if (gameArea.frameAsteroids == 1) {
        let chance = Math.random();
        if (chance < PROBABILITY_ASTEROID) {
            if (ASTEROID_TYPE == 0) ASTEROID_TYPE = 1;
            else if (ASTEROID_TYPE == 1) ASTEROID_TYPE = 2;
            else ASTEROID_TYPE = 0;

            let size = Math.floor(Math.random() * (ASTEROID_MAX_SIZE - ASTEROID_MIN_SIZE + 1) + ASTEROID_MIN_SIZE);

            // VERTICAL SPAWN: Spawn at Top (Y ~= -size), Random X
            let ASTEROID_X = Math.floor(Math.random() * (GAME_AREA_WIDTH + 1));
            let ASTEROID_Y = -size - 10; // Start slightly above screen

            let ASTEROID = new SquaredForm(ASTEROID_X, ASTEROID_Y, size, size, ASTEROID_COLOR, TAG_ASTEROID, ASTEROID_TYPE);

            // SPEED: Positive Y (Downwards), X=0
            let ASTEROID_SPEED = Math.floor(Math.random() * (ASTEROID_MAX_SPEED - ASTEROID_MIN_SPEED + 1) + ASTEROID_MIN_SPEED);
            ASTEROID.setSpeedY(ASTEROID_SPEED);
            ASTEROID.setSpeedX(0); // Optional: could render drift if wanted

            gameArea.addObstacle(ASTEROID);
        }
    }

    // Move backgrounds (unused/simplified)
    for (let i = gameArea.backgrounds.length - 1; i >= 0; i--) {
        gameArea.backgrounds[i].move();
        // Optional: Background scrolling logic if re-enabled
    }

    // Move obstacles and delete the ones that goes outside the canvas (BOTTOM)
    for (let i = gameArea.obstacles.length - 1; i >= 0; i--) {
        gameArea.obstacles[i].move();
        // Check if passed BOTTOM of screen (Y > HEIGHT)
        if (gameArea.obstacles[i].y > GAME_AREA_HEIGHT) {
            gameArea.removeObstacle(i);
        }
    }

    // Move our hero
    theSquare.move();
    // Our hero can't go outside the canvas
    theSquare.setIntoArea(gameArea.canvas.width, gameArea.canvas.height);
    gameArea.clear();
    gameArea.render();
}

function updateChrono() {
    if (continueTime) {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_MSG + " " + String(minutes).padStart(2, "0") + ":" + String(secondsToShow).padStart(2, "0");
        timeout = window.setTimeout(updateChrono, 1000);
    }
    else {
        let minutes = Math.floor(seconds / 60);
        let secondsToShow = seconds % 60;
        theChrono.innerHTML = CHRONO_DEATH_MSG + " " + String(minutes).padStart(2, "0") + ":" + String(secondsToShow).padStart(2, "0");
    }
}

function subTime() {
    if ((seconds - 15) < 0) seconds = 0;
    else seconds = seconds - 15;
    let minutes = Math.floor(seconds / 60);
    let secondsToShow = seconds % 60;
    theChrono.innerHTML = CHRONO_MSG + " " + String(minutes).padStart(2, "0") + ":" + String(secondsToShow).padStart(2, "0");
}

function subLife(asteroid_size) {
    if (gameArea.hero.vidas - 1 <= 0) {
        gameArea.hero.vidas = 0;
        endGame();
    }
    else {
        gameArea.hero.vidas--;
        if (leftArrowPressed) {
            gameArea.hero.vidas = 0;
            endGame();
        }
        // Push hero away on hit - Adjusted for vertical might need X push? 
        // For now, let's keep it simple or just invincible frames. 
        // The original code pushed X. Let's push X if hit? 
        // Actually, let's just leave the position alone to avoid glitching out of bounds easily.
    }
    if (gameArea.hero.vidas == 3) theLife.innerHTML = LIFES_MSG + NOT_DAMAGED_MSG;
    else if (gameArea.hero.vidas == 2) theLife.innerHTML = LIFES_MSG + DAMAGED_MSG;
    else if (gameArea.hero.vidas == 1) theLife.innerHTML = LIFES_MSG + HARDLY_DAMAGED_MSG;
    else theLife.innerHTML = LIFES_MSG + HAS_BEEN_DISTROYED_MSG;
}

function endGame() {
    continueTime = false;
    PROBABILITY_ASTEROID = 1;
    FRAME_ASTEROID = 1;

    window.document.removeEventListener("keydown", handlerOne);
    window.document.removeEventListener("keyup", handlerTwo);
    gameArea.hero.speedX = 0;
    gameArea.hero.speedY = 0;
}
