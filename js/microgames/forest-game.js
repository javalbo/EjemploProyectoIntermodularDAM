class ForestGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.instruction = "¡REFORESTA!";
        this.winOnTimeout = false; // Must plant all to win

        this.spots = [];
        this.plantedCount = 0;

        // Input
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
    }

    init(speedMultiplier, difficulty) {
        this.speedMultiplier = speedMultiplier;
        this.difficulty = difficulty || { tier: 'NORMAL' };

        this.spots = [];
        this.plantedCount = 0;

        let numSpots = 4; // Normal
        this.duration = 8000;

        // Requested: Start with 2, follow with 4, end with 5
        if (this.difficulty.tier === 'EASY') numSpots = 2;
        if (this.difficulty.tier === 'HARD') { numSpots = 5; this.duration = 6000; }

        for (let i = 0; i < numSpots; i++) {
            this.spots.push({
                x: Math.random() * (this.canvas.width - 100) + 50,
                y: Math.random() * (this.canvas.height - 100) + 50,
                radius: 40,
                isPlanted: false,
                growth: 0
            });
        }
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

        for (let s of this.spots) {
            if (!s.isPlanted) {
                const dist = Math.hypot(x - s.x, y - s.y);
                if (dist < s.radius) {
                    s.isPlanted = true;
                    this.plantedCount++;
                }
            }
        }
    }

    update(dt) {
        // Animate growth
        for (let s of this.spots) {
            if (s.isPlanted && s.growth < 1) {
                s.growth += 0.05 * (dt / 16);
            }
        }

        if (this.plantedCount >= this.spots.length) {
            return 'WIN';
        }

        return 'CONTINUE';
    }

    render(ctx) {
        // Background: Barren Earth
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let s of this.spots) {
            // Draw Hole
            ctx.fillStyle = '#5D4037';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();

            if (s.isPlanted) {
                // Draw Tree
                const growthScale = Math.min(1, s.growth);

                // Trunk
                ctx.fillStyle = '#4E342E';
                ctx.fillRect(s.x - 5 * growthScale, s.y - 40 * growthScale, 10 * growthScale, 40 * growthScale);

                // Leaves (Triangle)
                ctx.fillStyle = '#2E7D32';
                ctx.beginPath();
                ctx.moveTo(s.x, s.y - 80 * growthScale);
                ctx.lineTo(s.x - 30 * growthScale, s.y - 20 * growthScale);
                ctx.lineTo(s.x + 30 * growthScale, s.y - 20 * growthScale);
                ctx.fill();
            } else {
                // Formatting indicator (Outline)
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }
}
