class SolarGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.instruction = "¡LIMPIA!";
        this.winOnTimeout = false; // Must clean to win

        // Dirt logic
        this.dirtParticles = [];
        this.cleanedCount = 0;
        this.totalDirt = 0;

        // Input
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastX = 0;
        this.lastY = 0;

        this.handleMouseMove = this.handleMouseMove.bind(this);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    init(speedMultiplier, difficulty) {
        this.speedMultiplier = speedMultiplier;
        this.difficulty = difficulty || { tier: 'NORMAL' };

        this.dirtParticles = [];
        this.cleanedCount = 0;

        // Requested: Start with 2, follow with 4, end with 5
        let numDirt = 4;

        if (this.difficulty.tier === 'EASY') { numDirt = 2; }
        if (this.difficulty.tier === 'HARD') { numDirt = 5; }

        this.duration = 8000; // Increased to 8s
        if (this.difficulty.tier === 'HARD') this.duration = 6000;

        for (let i = 0; i < numDirt; i++) {
            this.dirtParticles.push({
                x: Math.random() * (this.canvas.width - 200) + 100,
                y: Math.random() * (this.canvas.height - 200) + 100,
                r: 60 + Math.random() * 20, // Slightly bigger blobs
                opacity: 1.0
            });
        }
        this.totalDirt = this.dirtParticles.length;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    }

    update(dt) {
        // Check mouse collision with dirt
        // Velocity check? Cleaner works better if you move? 
        // For simplicity, just touching cleans it slowly

        let cleanedThisFrame = false;

        for (let p of this.dirtParticles) {
            if (p.opacity <= 0) continue;

            const dist = Math.hypot(this.mouseX - p.x, this.mouseY - p.y);
            if (dist < 50) { // Cleaning Radius
                p.opacity -= 0.1 * (dt / 16); // Clean speed
                if (p.opacity <= 0) {
                    p.opacity = 0;
                    this.cleanedCount++;
                    cleanedThisFrame = true;
                }
            }
        }

        // Win Condition
        if (this.cleanedCount >= this.totalDirt * 0.9) { // Clean 90%
            return 'WIN';
        }

        return 'CONTINUE';
    }

    render(ctx) {
        // Draw Solar Panel Background
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid lines
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let x = 0; x < this.canvas.width; x += 100) {
            ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y < this.canvas.height; y += 100) {
            ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y);
        }
        ctx.stroke();

        // Draw Dirt
        for (let p of this.dirtParticles) {
            if (p.opacity <= 0) continue;

            ctx.fillStyle = `rgba(139, 69, 19, ${p.opacity})`; // Brown dirt
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r + Math.random() * 5, 0, Math.PI * 2); // Wobble for dust effect
            ctx.fill();
        }

        // Draw Wiper/Cursor
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.mouseX, this.mouseY, 50, 0, Math.PI * 2);
        ctx.fill();
    }
}
