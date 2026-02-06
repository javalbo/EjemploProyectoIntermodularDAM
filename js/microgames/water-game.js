class WaterGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.instruction = "¡RECOGE AGUA!";
        this.winOnTimeout = false; // Must fill bucket to win

        // Bucket (Player)
        this.bucket = { x: 0, y: 0, width: 60, height: 40 };

        // Drops
        this.drops = [];
        this.spawnTimer = 0;
        this.scoreLocal = 0;
        this.targetScore = 5;

        // Input
        this.mouseX = 0;
        this.mouseY = 0;

        this.handleMouseMove = this.handleMouseMove.bind(this);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    init(speedMultiplier, difficulty) {
        this.speedMultiplier = speedMultiplier;
        this.drops = [];
        this.spawnTimer = 0;
        this.scoreLocal = 0;

        this.difficulty = difficulty || { tier: 'NORMAL' };

        // Requested: Difficulty 1->1 drop, 2->2 drops, 3->3 drops
        if (this.difficulty.tier === 'EASY') {
            this.targetScore = 1;
            this.duration = 8000;
        } else if (this.difficulty.tier === 'HARD') {
            this.targetScore = 3;
            this.duration = 8000;
        } else { // Normal
            this.targetScore = 2;
            this.duration = 8000;
        }

        // Center Bucket
        this.bucket.x = this.canvas.width / 2;
        this.bucket.y = this.canvas.height - 100;
        this.mouseX = this.bucket.x;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    }

    update(dt) {
        // Update Bucket X only
        this.bucket.x = this.mouseX;
        this.bucket.x = Math.max(this.bucket.width / 2, Math.min(this.canvas.width - this.bucket.width / 2, this.bucket.x));

        // Spawn Drops
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnDrop();
            this.spawnTimer = (500 / this.speedMultiplier); // Spawn rate
        }

        // Update Drops
        for (let i = this.drops.length - 1; i >= 0; i--) {
            let p = this.drops[i];
            p.y += p.speed * (dt / 16.67);

            // Collision Check (Rect vs Circle-ish)
            if (p.y >= this.bucket.y && p.y <= this.bucket.y + this.bucket.height &&
                p.x >= this.bucket.x - this.bucket.width / 2 && p.x <= this.bucket.x + this.bucket.width / 2) {

                // Caught!
                this.scoreLocal++;
                this.drops.splice(i, 1);
                continue;
            }

            // Missed (off screen)
            if (p.y > this.canvas.height) {
                this.drops.splice(i, 1);
                continue;
            }
        }

        // Win Condition
        if (this.scoreLocal >= this.targetScore) {
            return 'WIN';
        }

        return 'CONTINUE';
    }

    // Override default win check
    checkWinCondition() {
        return this.scoreLocal >= this.targetScore;
    }

    spawnDrop() {
        const p = {
            x: Math.random() * (this.canvas.width - 40) + 20,
            y: -20,
            radius: 10,
            speed: (5 + Math.random() * 5) * this.speedMultiplier,
            color: '#00BFFF' // Deep Sky Blue
        };
        this.drops.push(p);
    }

    render(ctx) {
        // Background
        ctx.fillStyle = '#1a1a2e'; // Dark Night
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Bucket
        ctx.fillStyle = '#AAA';
        ctx.fillRect(this.bucket.x - this.bucket.width / 2, this.bucket.y, this.bucket.width, this.bucket.height);

        // Water Filling (Visual Feedback)
        // Height based on percentage of target
        const fillPct = Math.min(1.0, this.scoreLocal / this.targetScore);
        if (fillPct > 0) {
            ctx.fillStyle = '#00BFFF';
            const fillHeight = this.bucket.height * fillPct;
            const fillY = (this.bucket.y + this.bucket.height) - fillHeight;
            ctx.fillRect(this.bucket.x - this.bucket.width / 2, fillY, this.bucket.width, fillHeight);
        }

        // Drops
        for (const p of this.drops) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Tail
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - p.radius);
            ctx.lineTo(p.x, p.y - p.radius * 2);
            ctx.strokeStyle = p.color;
            ctx.stroke();
        }

        // UI Text for Target
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Gotas: ${this.scoreLocal} / ${this.targetScore}`, 20, 40);
    }
}
