import * as PIXI from 'pixi.js';

export class PowerUpManager {
    constructor(app, player) {
        this.app = app;
        this.player = player;
        this.powerUps = [];
        this.spawnTimer = 0;
        this.spawnInterval = 10000; // Spawn power-up every 10 seconds
        this.powerUpTypes = ['rapidFire', 'laser', 'missile', 'shield'];
        this.powerUpTimers = {
            rapidFire: 0,
            laser: 0,
            missile: 0,
            shield: 0
        };
        this.powerUpDurations = {
            rapidFire: 10000, // 10 seconds
            laser: 8000,     // 8 seconds
            missile: 12000,  // 12 seconds
            shield: 15000    // 15 seconds
        };
    }
    
    spawnPowerUp() {
        const type = this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];
        const x = Math.random() * (this.app.screen.width - 40) + 20;
        const y = -20;
        
        const powerUp = new PIXI.Graphics();
        powerUp.beginFill(this.getPowerUpColor(type));
        powerUp.drawCircle(0, 0, 15);
        powerUp.endFill();
        
        powerUp.x = x;
        powerUp.y = y;
        powerUp.type = type;
        powerUp.speed = 2;
        
        this.app.stage.addChild(powerUp);
        this.powerUps.push(powerUp);
    }
    
    getPowerUpColor(type) {
        const colors = {
            rapidFire: 0xFF0000, // Red
            laser: 0x0000FF,     // Blue
            missile: 0xFFA500,   // Orange
            shield: 0x00FF00     // Green
        };
        return colors[type];
    }
    
    activatePowerUp(type) {
        this.powerUpTimers[type] = this.powerUpDurations[type];
        
        switch (type) {
            case 'rapidFire':
                this.player.fireRate = 100; // Faster firing
                break;
            case 'laser':
                this.player.bulletSpeed = 15; // Faster bullets
                this.player.bulletDamage = 2; // More damage
                break;
            case 'missile':
                this.player.bulletType = 'missile';
                break;
            case 'shield':
                this.player.isInvincible = true;
                break;
        }
    }
    
    deactivatePowerUp(type) {
        switch (type) {
            case 'rapidFire':
                this.player.fireRate = 250; // Normal firing rate
                break;
            case 'laser':
                this.player.bulletSpeed = 10; // Normal bullet speed
                this.player.bulletDamage = 1; // Normal damage
                break;
            case 'missile':
                this.player.bulletType = 'normal';
                break;
            case 'shield':
                this.player.isInvincible = false;
                break;
        }
    }
    
    isPowerUpActive(type) {
        return this.powerUpTimers[type] > 0;
    }
    
    update() {
        // Spawn new power-ups
        this.spawnTimer += this.app.ticker.deltaMS;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnPowerUp();
            this.spawnTimer = 0;
        }
        
        // Update power-up timers
        for (const type in this.powerUpTimers) {
            if (this.powerUpTimers[type] > 0) {
                this.powerUpTimers[type] -= this.app.ticker.deltaMS;
                if (this.powerUpTimers[type] <= 0) {
                    this.deactivatePowerUp(type);
                }
            }
        }
        
        // Update power-up positions and check collisions
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.y += powerUp.speed;
            
            // Check collision with player
            if (this.checkCollision(powerUp, this.player.sprite)) {
                this.activatePowerUp(powerUp.type);
                this.app.stage.removeChild(powerUp);
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // Remove if off screen
            if (powerUp.y > this.app.screen.height + 20) {
                this.app.stage.removeChild(powerUp);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    checkCollision(powerUp, playerSprite) {
        const dx = powerUp.x - playerSprite.x;
        const dy = powerUp.y - playerSprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < 30; // Collision radius
    }
} 