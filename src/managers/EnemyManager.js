import * as PIXI from 'pixi.js';
import { Enemy } from '../entities/Enemy';

export class EnemyManager {
    constructor(app) {
        this.app = app;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnDelay = 60; // Frames between spawns
        this.wave = 1;
        this.enemiesPerWave = 10;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
    }
    
    update() {
        // Spawn enemies
        this.spawnTimer++;
        if (this.spawnTimer >= this.spawnDelay && this.enemiesSpawned < this.enemiesPerWave) {
            this.spawnEnemy();
            this.spawnTimer = 0;
            this.enemiesSpawned++;
        }
        
        // Check if wave is complete
        if (this.enemiesSpawned >= this.enemiesPerWave && this.enemies.length === 0 && !this.waveComplete) {
            this.waveComplete = true;
            console.log(`Wave ${this.wave} complete!`);
            // In a full game, we would trigger the next wave here
        }
        
        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update();
            if (!this.enemies[i].active) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    spawnEnemy() {
        // Determine enemy type based on wave
        let type = 'standard';
        const random = Math.random();
        
        if (this.wave >= 3) {
            if (random < 0.1) type = 'ufo';
            else if (random < 0.3) type = 'bomber';
            else if (random < 0.5) type = 'feather';
        } else if (this.wave >= 2) {
            if (random < 0.2) type = 'bomber';
            else if (random < 0.4) type = 'feather';
        }
        
        // Random x position
        const x = Math.random() * (this.app.screen.width - 60) + 30;
        
        // Create enemy
        const enemy = new Enemy(this.app, x, -30, type);
        this.enemies.push(enemy);
    }
    
    startNextWave() {
        this.wave++;
        this.enemiesSpawned = 0;
        this.waveComplete = false;
        this.enemiesPerWave = 10 + (this.wave - 1) * 2; // Increase enemies per wave
        this.spawnDelay = Math.max(30, 60 - (this.wave - 1) * 5); // Decrease spawn delay
    }
    
    checkCollisions(bullets) {
        let score = 0;
        
        // Check each bullet against each enemy
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                // Simple distance-based collision detection
                const dx = bullet.sprite.x - enemy.sprite.x;
                const dy = bullet.sprite.y - enemy.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 20) { // Collision radius
                    // Bullet hits enemy
                    score += enemy.takeDamage();
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
            
            // Simple distance-based collision detection
            const dx = player.sprite.x - enemy.sprite.x;
            const dy = player.sprite.y - enemy.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) { // Collision radius
                // Player hits enemy
                enemy.destroy();
                return true; // Player hit
            }
        }
        
        return false; // No collision
    }
} 