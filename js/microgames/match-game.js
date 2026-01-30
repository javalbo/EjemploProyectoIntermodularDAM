class MatchGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.instruction = "¡ENCIENDE!";

        // Game State
        this.isDragging = false;
        this.ignited = false;
        this.flameSize = 0;

        // Objects
        this.match = { x: 0, y: 0, width: 200, height: 20, angle: 0 };
        this.matchHead = { radius: 15 };
        this.strip = { x: 0, y: 0, width: 300, height: 60 };

        // Physics
        this.lastX = 0;
        this.lastY = 0;
        this.velocity = 0;
        this.frictionDistance = 0;

        // Input Bindings
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    init(speedMultiplier, difficulty) {
        this.ignited = false;
        this.flameSize = 0;
        this.frictionDistance = 0;
        this.difficulty = difficulty || { tier: 'NORMAL' };

        // Config based on Difficulty
        let stripWidth = 300;
        let stripHeight = 60; // Default height
        this.frictionThreshold = 500;
        this.duration = 5000; // Time limit

        if (this.difficulty.tier === 'EASY') {
            stripWidth = 450;       // Wider target
            stripHeight = 120;      // Much taller (easier to hit)
            this.frictionThreshold = 300;
            this.duration = 5000;
        } else if (this.difficulty.tier === 'NORMAL') {
            stripHeight = 80;       // Slightly taller
        } else if (this.difficulty.tier === 'HARD') {
            stripWidth = 150;       // Tiny target
            this.frictionThreshold = 800; // Harder to light
            this.duration = 3000;   // Less time
        }

        // Randomize Match Position
        this.match.x = this.canvas.width / 2;
        this.match.y = this.canvas.height - 150;
        this.match.angle = Math.random() * 0.5 - 0.25; // Slight tilt

        // Place Strip
        this.strip.width = stripWidth;
        this.strip.height = stripHeight;
        this.strip.x = this.canvas.width / 2 - stripWidth / 2;
        this.strip.y = this.canvas.height / 2 - stripHeight / 2;

        this.speedMultiplier = speedMultiplier;
    }

    // Input Handling
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        // Simplification: Can grab anywhere near the match center
        const dist = Math.hypot(pos.x - this.match.x, pos.y - this.match.y);
        if (dist < 100) {
            this.isDragging = true;
            this.lastX = pos.x;
            this.lastY = pos.y;
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging || this.ignited) return;

        const pos = this.getMousePos(e);
        this.match.x = pos.x;
        this.match.y = pos.y;

        // Calculate velocity (pixels per frame approx)
        const dist = Math.hypot(pos.x - this.lastX, pos.y - this.lastY);
        this.velocity = dist;

        this.lastX = pos.x;
        this.lastY = pos.y;

        // Check Friction with Striker
        this.checkStrikerCollision();
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    checkStrikerCollision() {
        // Match Head Position (Approximate at one end)
        // Simplified: Head is at match.x because we drag by center? 
        // Let's refine: Match is drawn centered. Head is at Left tip for visual style or Right tip.
        // Let's say Head is at (x - width/2, y) rotated.
        // For simple gameplay, let's just check if Match Center is inside Box

        if (this.match.x > this.strip.x && this.match.x < this.strip.x + this.strip.width &&
            this.match.y > this.strip.y && this.match.y < this.strip.y + this.strip.height) {

            // Inside Striker
            if (this.velocity > 15) { // Fast movement needed
                this.frictionDistance += this.velocity;
                if (this.frictionDistance > this.frictionThreshold) { // Accumulated drag distance
                    this.ignite();
                }
            }
        }
    }

    ignite() {
        this.ignited = true;
    }

    update(dt) {
        if (this.ignited) {
            this.flameSize = Math.min(100, this.flameSize + 2);
            if (this.flameSize >= 60) return 'WIN';
        }
        return 'CONTINUE';
    }

    render(ctx) {
        // Draw Background
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Striker Strip
        ctx.fillStyle = '#333';
        ctx.fillRect(this.strip.x, this.strip.y, this.strip.width, this.strip.height);
        // Striker Texture
        ctx.fillStyle = '#442222';
        for (let i = 0; i < this.strip.width; i += 20) {
            ctx.fillRect(this.strip.x + i, this.strip.y, 10, this.strip.height);
        }

        // Draw Match
        ctx.save();
        ctx.translate(this.match.x, this.match.y);
        ctx.rotate(this.match.angle);

        // Stick
        ctx.fillStyle = '#D2B48C'; // Tan wood
        ctx.fillRect(-100, -10, 200, 20);

        // Head (Red Tip) -> Drawn at Left Tip (-100, 0)
        ctx.beginPath();
        ctx.arc(-100, 0, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#A00';
        ctx.fill();

        // Flame if ignited
        if (this.ignited) {
            ctx.beginPath();
            ctx.arc(-100, -20, this.flameSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 150, 0, ${Math.random() * 0.5 + 0.5})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(-100, -20, this.flameSize * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 0, ${Math.random() * 0.5 + 0.5})`;
            ctx.fill();
        }

        ctx.restore();
    }
}
