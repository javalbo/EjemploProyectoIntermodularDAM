class DodgeGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.instruction = "¡ESQUIVA!";
        this.winOnTimeout = true; // Surviving means winning

        // Ship
        this.ship = { x: 0, y: 0, size: 40 };

        // Projectiles
        this.projectiles = [];
        this.spawnTimer = 0;

        // Input
        this.mouseX = 0;
        this.mouseY = 0;

        this.handleMouseMove = this.handleMouseMove.bind(this);
        window.addEventListener('mousemove', this.handleMouseMove);
    }

    init(speedMultiplier) {
        this.speedMultiplier = speedMultiplier;
        this.projectiles = [];
        this.spawnTimer = 0;

        // Center Ship
        this.ship.x = this.canvas.width / 2;
        this.ship.y = this.canvas.height / 2;
        this.mouseX = this.ship.x;
        this.mouseY = this.ship.y;
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    }

    update(dt) {
        // Update Ship Position (Follow Mouse with slight lag or direct?)
        // Direct for responsiveness in microgames
        this.ship.x = this.mouseX;
        this.ship.y = this.mouseY;

        // Clamp to screen
        this.ship.x = Math.max(this.ship.size / 2, Math.min(this.canvas.width - this.ship.size / 2, this.ship.x));
        this.ship.y = Math.max(this.ship.size / 2, Math.min(this.canvas.height - this.ship.size / 2, this.ship.y));

        // Spawn Projectiles
        this.spawnTimer -= dt;
        if (this.spawnTimer <= 0) {
            this.spawnProjectile();
            this.spawnTimer = 200 / this.speedMultiplier; // Spawn rate increases with speed
        }

        // Update Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            let p = this.projectiles[i];
            p.y += p.speed * (dt / 16.67);

            // Bounds check (remove if off screen)
            if (p.y > this.canvas.height + p.radius) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Collision Check (Circle vs Square/Rect)
            // Simplified: Rect vs Rect or Circle vs Circle. 
            // Ship is Square (Size), Projectile is Circle (Radius)
            // Lets use simple distance for "feel"
            const dist = Math.hypot(p.x - this.ship.x, p.y - this.ship.y);
            if (dist < (this.ship.size / 2 + p.radius)) {
                return 'LOSE';
            }
        }

        return 'CONTINUE';
    }

    spawnProjectile() {
        // Spawn at top, random X
        const p = {
            x: Math.random() * this.canvas.width,
            y: -50,
            radius: 20 + Math.random() * 20,
            speed: (10 + Math.random() * 10) * this.speedMultiplier,
            color: '#FF0000'
        };
        this.projectiles.push(p);
    }

    render(ctx) {
        // Draw Background
        ctx.fillStyle = '#0a0a2a'; // Dark Blue Space
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Ship (Cyan Square)
        ctx.fillStyle = '#00FFFF';
        ctx.save();
        ctx.translate(this.ship.x, this.ship.y);
        ctx.fillRect(-this.ship.size / 2, -this.ship.size / 2, this.ship.size, this.ship.size);

        // Glow
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.lineWidth = 10;
        ctx.strokeRect(-this.ship.size / 2, -this.ship.size / 2, this.ship.size, this.ship.size);
        ctx.restore();

        // Draw Projectiles
        for (const p of this.projectiles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    }
}
