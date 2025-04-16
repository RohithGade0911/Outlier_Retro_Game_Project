import * as PIXI from 'pixi.js';
import { Bullet } from './Bullet';

export class Player {
    constructor(app) {
        this.app = app;
        this.speed = 5;
        this.shootCooldown = 0;
        this.shootDelay = 15; // Frames between shots
        this.bullets = [];
        this.lives = 3;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 120; // 2 seconds at 60 FPS
        
        // Power-up states
        this.laserActive = false;
        this.missileActive = false;
        this.shieldActive = false;
        
        // Create player sprite (improved pixel-art style)
        this.sprite = new PIXI.Graphics();
        
        // Draw ship body
        this.sprite.beginFill(0x00FF00);
        this.sprite.drawPolygon([
            -15, 10,  // Bottom left
            0, -15,   // Top
            15, 10    // Bottom right
        ]);
        this.sprite.endFill();
        
        // Draw ship details
        this.sprite.beginFill(0x00CC00);
        this.sprite.drawRect(-5, -5, 10, 15);
        this.sprite.endFill();
        
        // Create shield sprite (initially invisible)
        this.shieldSprite = new PIXI.Graphics();
        this.shieldSprite.beginFill(0x00FFFF, 0.5);
        this.shieldSprite.drawCircle(0, 0, 25);
        this.shieldSprite.endFill();
        this.shieldSprite.visible = false;
        this.sprite.addChild(this.shieldSprite);
        
        // Position player at bottom center
        this.sprite.x = app.screen.width / 2;
        this.sprite.y = app.screen.height - 50;
    }

    update(keys) {
        // Handle invincibility
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
                this.sprite.alpha = 1;
            } else {
                // Blink effect
                this.sprite.alpha = Math.sin(this.invincibleTimer * 0.2) * 0.5 + 0.5;
            }
        }
        
        // Update shield visibility
        this.shieldSprite.visible = this.shieldActive;
        
        // Movement
        if (keys['ArrowLeft'] || keys['a']) {
            this.sprite.x = Math.max(15, this.sprite.x - this.speed);
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.sprite.x = Math.min(this.app.screen.width - 15, this.sprite.x + this.speed);
        }
        if (keys['ArrowUp'] || keys['w']) {
            this.sprite.y = Math.max(15, this.sprite.y - this.speed);
        }
        if (keys['ArrowDown'] || keys['s']) {
            this.sprite.y = Math.min(this.app.screen.height - 15, this.sprite.y + this.speed);
        }

        // Shooting
        if (keys[' '] && this.shootCooldown <= 0) {
            this.shoot();
            this.shootCooldown = this.shootDelay;
        }

        // Update shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown--;
        }
        
        // Update bullets
        this.updateBullets();
    }
    
    updateBullets() {
        // Update all bullets and remove inactive ones
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (!this.bullets[i].active) {
                this.bullets.splice(i, 1);
            }
        }
    }

    shoot() {
        if (this.laserActive) {
            // Shoot laser (wide beam)
            this.shootLaser();
        } else if (this.missileActive) {
            // Shoot missile (homing)
            this.shootMissile();
        } else {
            // Shoot normal bullet
            this.shootNormalBullet();
        }
    }
    
    shootNormalBullet() {
        // Create new bullet
        const bullet = new Bullet(this.app, this.sprite.x, this.sprite.y - 20);
        this.bullets.push(bullet);
    }
    
    shootLaser() {
        // Create wide laser beam
        const laserWidth = 40;
        const laserHeight = 600;
        
        // Create laser sprite
        const laser = new PIXI.Graphics();
        laser.beginFill(0x00FFFF);
        laser.drawRect(-laserWidth / 2, -laserHeight, laserWidth, laserHeight);
        laser.endFill();
        
        // Position laser at player's position
        laser.x = this.sprite.x;
        laser.y = this.sprite.y - laserHeight / 2;
        
        // Add laser to stage
        this.app.stage.addChild(laser);
        
        // Remove laser after 0.5 seconds
        setTimeout(() => {
            this.app.stage.removeChild(laser);
        }, 500);
    }
    
    shootMissile() {
        // Create homing missile
        const missile = new PIXI.Graphics();
        missile.beginFill(0xFFA500);
        missile.drawPolygon([0, -10, -5, 0, 0, 5, 5, 0]);
        missile.endFill();
        
        // Position missile at player's position
        missile.x = this.sprite.x;
        missile.y = this.sprite.y - 20;
        
        // Add missile to stage
        this.app.stage.addChild(missile);
        
        // Find closest enemy
        let closestEnemy = null;
        let closestDistance = Infinity;
        
        // This would be replaced with actual enemy finding logic in the game
        // For now, we'll just move the missile upward
        const moveMissile = () => {
            missile.y -= 5;
            
            // Remove missile if it goes off screen
            if (missile.y < -20) {
                this.app.stage.removeChild(missile);
                return;
            }
            
            // Continue moving
            requestAnimationFrame(moveMissile);
        };
        
        moveMissile();
    }
    
    hit() {
        // If shield is active, don't take damage
        if (this.shieldActive) {
            return false;
        }
        
        if (!this.invincible) {
            this.lives--;
            this.invincible = true;
            this.invincibleTimer = this.invincibleDuration;
            return true;
        }
        return false;
    }
    
    reset() {
        this.lives = 3;
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height - 50;
        this.invincible = false;
        this.sprite.alpha = 1;
        
        // Reset power-up states
        this.laserActive = false;
        this.missileActive = false;
        this.shieldActive = false;
        this.shieldSprite.visible = false;
    }
} 