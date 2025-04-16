import * as PIXI from 'pixi.js';
import { Enemy } from '../entities/Enemy';

export class EnemyManager {
    constructor(app) {
        this.app = app;
        this.enemies = [];
        this.wave = 1;
        this.enemiesPerWave = 10;
        this.spawnDelay = 60;
        this.spawnTimer = 0;
        this.enemiesSpawned = 0;
        this.isBossWave = false;
        this.maxEnemiesPerWave = 30;
        this.waveTransitionInProgress = false;
    }

    startNextWave() {
        if (this.waveTransitionInProgress) return;
        
        this.waveTransitionInProgress = true;
        this.wave++;
        this.enemiesSpawned = 0;
        this.isBossWave = this.wave % 5 === 0;
        
        // Calculate number of enemies for this wave
        if (this.isBossWave) {
            this.enemiesPerWave = 1; // Only boss enemy
        } else {
            // Base number of enemies (10) + 5 every 5 waves, capped at 30
            this.enemiesPerWave = Math.min(10 + Math.floor((this.wave - 1) / 5) * 5, this.maxEnemiesPerWave);
        }
        
        // Set spawn delay based on wave
        this.spawnDelay = Math.max(60 - (this.wave * 2), 20);
        
        console.log(`Starting wave ${this.wave} with ${this.enemiesPerWave} enemies`);
        
        // Reset the transition flag after a short delay
        setTimeout(() => {
            this.waveTransitionInProgress = false;
        }, 5000); // 5 seconds delay to prevent rapid transitions
    }

    spawnEnemy() {
        if (this.enemiesSpawned >= this.enemiesPerWave) return;
        
        // Calculate spawn position
        const x = Math.random() * (this.app.screen.width - 100) + 50;
        const y = -30;
        
        // Determine enemy type
        let type;
        if (this.isBossWave) {
            type = 'boss';
        } else {
            const rand = Math.random();
            if (rand < 0.4) type = 'standard';
            else if (rand < 0.6) type = 'bomber';
            else if (rand < 0.8) type = 'feather';
            else type = 'ufo';
        }
        
        // Create enemy with speed multiplier based on wave
        const enemy = new Enemy(this.app, x, y, type);
        
        // Apply wave-based speed multiplier
        let speedMultiplier = 1.0;
        if (this.wave === 2) speedMultiplier = 1.25;
        else if (this.wave === 3) speedMultiplier = 1.75;
        else if (this.wave === 4) speedMultiplier = 2.0;
        else if (this.isBossWave) speedMultiplier = 1.0; // Boss waves at normal speed
        
        enemy.speed *= speedMultiplier;
        
        this.enemies.push(enemy);
        this.enemiesSpawned++;
    }

    update() {
        // Spawn enemies
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnDelay) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update();
            
            if (!enemy.active) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    checkCollisions(bullets) {
        let score = 0;
        
        // Check each bullet against each enemy
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                // Improved collision detection based on enemy type
                let collisionRadius = 20; // Default collision radius
                
                // Adjust collision radius based on enemy type
                switch(enemy.type) {
                    case 'bomber': collisionRadius = 25; break;
                    case 'feather': collisionRadius = 15; break;
                    case 'ufo': collisionRadius = 30; break;
                }
                
                // Calculate distance between bullet and enemy
                const dx = bullet.sprite.x - enemy.sprite.x;
                const dy = bullet.sprite.y - enemy.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < collisionRadius) {
                    // Bullet hits enemy
                    const hitScore = enemy.takeDamage(bullet.damage);
                    score += hitScore;
                    
                    // Create hit effect
                    this.createHitEffect(bullet.sprite.x, bullet.sprite.y);
                    
                    // Destroy bullet
                    bullet.destroy();
                    break;
                }
            }
        }
        
        return score;
    }
    
    checkPlayerCollision(player) {
        // Check player against each enemy
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Improved collision detection based on enemy type
            let collisionRadius = 30; // Default collision radius
            
            // Adjust collision radius based on enemy type
            switch(enemy.type) {
                case 'bomber': collisionRadius = 35; break;
                case 'feather': collisionRadius = 25; break;
                case 'ufo': collisionRadius = 40; break;
            }
            
            // Calculate distance between player and enemy
            const dx = player.sprite.x - enemy.sprite.x;
            const dy = player.sprite.y - enemy.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < collisionRadius) {
                // Create explosion effect
                this.createExplosionEffect(enemy.sprite.x, enemy.sprite.y);
                
                // Player hits enemy
                enemy.destroy();
                return true; // Player hit
            }
        }
        
        return false; // No collision
    }
    
    createHitEffect(x, y) {
        // Create a small hit effect
        const hitEffect = new PIXI.Graphics();
        hitEffect.beginFill(0xFFFFFF);
        hitEffect.drawCircle(0, 0, 5);
        hitEffect.endFill();
        
        hitEffect.x = x;
        hitEffect.y = y;
        
        this.app.stage.addChild(hitEffect);
        
        // Remove hit effect after a short time
        setTimeout(() => {
            if (hitEffect.parent) {
                this.app.stage.removeChild(hitEffect);
            }
        }, 100);
    }
    
    createExplosionEffect(x, y) {
        // Create an explosion effect
        const explosion = new PIXI.Graphics();
        explosion.beginFill(0xFF4500);
        explosion.drawCircle(0, 0, 15);
        explosion.endFill();
        
        explosion.x = x;
        explosion.y = y;
        
        this.app.stage.addChild(explosion);
        
        // Remove explosion after a short time
        setTimeout(() => {
            if (explosion.parent) {
                this.app.stage.removeChild(explosion);
            }
        }, 300);
    }
} 