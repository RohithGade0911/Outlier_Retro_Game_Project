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
        this.fireRate = 250; // Default fire rate in milliseconds
        this.bulletSpeed = 10; // Default bullet speed
        this.bulletDamage = 1; // Default bullet damage
        this.bulletType = 'normal'; // Default bullet type
        this.isInvincible = false; // Shield state
        
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
        
        // Last shot time for rapid fire
        this.lastShotTime = 0;
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
        this.shieldSprite.visible = this.isInvincible;
        
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

        // Shooting with rapid fire support
        const currentTime = Date.now();
        if (keys[' '] && currentTime - this.lastShotTime >= this.fireRate) {
            this.shoot();
            this.lastShotTime = currentTime;
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
        let score = 0;
        
        switch (this.bulletType) {
            case 'laser':
                score = this.shootLaser();
                break;
            case 'missile':
                this.shootMissile();
                break;
            default:
                this.shootNormalBullet();
                break;
        }
        
        // Return score for UI update
        return score;
    }
    
    shootNormalBullet() {
        const bullet = new Bullet(this.app, this.sprite.x, this.sprite.y - 20, this.bulletSpeed, this.bulletDamage);
        this.bullets.push(bullet);
    }
    
    shootLaser() {
        console.log("Shooting laser!");
        
        // Create a container for the laser
        const laserContainer = new PIXI.Container();
        laserContainer.zIndex = 100; // Ensure laser is on top
        
        // Create the main laser beam
        const laserBeam = new PIXI.Graphics();
        laserBeam.beginFill(0x00FFFF);
        laserBeam.drawRect(-20, -600, 40, 600);
        laserBeam.endFill();
        
        // Create a glow effect
        const laserGlow = new PIXI.Graphics();
        laserGlow.beginFill(0x00FFFF, 0.5); // Increased opacity
        laserGlow.drawRect(-30, -600, 60, 600);
        laserGlow.endFill();
        
        // Add both to the container
        laserContainer.addChild(laserGlow);
        laserContainer.addChild(laserBeam);
        
        // Position the laser container at the player's position
        laserContainer.x = this.sprite.x;
        laserContainer.y = this.sprite.y;
        
        // Add the laser container to the stage
        this.app.stage.addChild(laserContainer);
        
        // Create a hitbox for collision detection
        const laserHitbox = {
            x: this.sprite.x - 20,
            y: 0,
            width: 40,
            height: 600
        };
        
        // Damage all enemies in the laser path
        const enemies = this.app.stage.children.filter(child => child.isEnemy);
        let score = 0;
        
        for (const enemy of enemies) {
            // Check if enemy is within the laser hitbox
            if (enemy.x >= laserHitbox.x && 
                enemy.x <= laserHitbox.x + laserHitbox.width && 
                enemy.y >= laserHitbox.y && 
                enemy.y <= laserHitbox.y + laserHitbox.height) {
                
                // Apply damage to enemy
                if (enemy.takeDamage) {
                    score += enemy.takeDamage(this.bulletDamage * 2);
                }
            }
        }
        
        // Remove laser after 0.5 seconds
        setTimeout(() => {
            if (laserContainer.parent) {
                this.app.stage.removeChild(laserContainer);
            }
        }, 500);
        
        return score;
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
        
        // Create a bullet object for the missile
        const missileBullet = new Bullet(this.app, this.sprite.x, this.sprite.y - 20, 0, this.bulletDamage * 2);
        missileBullet.sprite = missile; // Replace the bullet sprite with our missile sprite
        missileBullet.isMissile = true;
        missileBullet.active = true;
        
        // Add to bullets array so it's checked for collisions
        this.bullets.push(missileBullet);
        
        // Find closest enemy and move towards it
        const moveMissile = () => {
            if (!missileBullet.active) return;
            
            // Get all enemies from the game
            const enemies = this.app.stage.children.filter(child => child.isEnemy);
            
            if (enemies.length > 0) {
                // Find closest enemy
                let closestEnemy = null;
                let closestDistance = Infinity;
                
                for (const enemy of enemies) {
                    const dx = enemy.x - missile.x;
                    const dy = enemy.y - missile.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestEnemy = enemy;
                    }
                }
                
                // Move towards closest enemy
                if (closestEnemy) {
                    const dx = closestEnemy.x - missile.x;
                    const dy = closestEnemy.y - missile.y;
                    const angle = Math.atan2(dy, dx);
                    
                    // Update both missile and bullet positions
                    missile.x += Math.cos(angle) * 5;
                    missile.y += Math.sin(angle) * 5;
                    missileBullet.sprite.x = missile.x;
                    missileBullet.sprite.y = missile.y;
                    
                    // Check for collision with the target enemy
                    const collisionDistance = Math.sqrt(
                        Math.pow(missile.x - closestEnemy.x, 2) + 
                        Math.pow(missile.y - closestEnemy.y, 2)
                    );
                    
                    if (collisionDistance < 20) { // Collision radius
                        // Apply damage to enemy
                        if (closestEnemy.takeDamage) {
                            closestEnemy.takeDamage(missileBullet.damage);
                        }
                        
                        // Create explosion effect
                        const explosion = new PIXI.Graphics();
                        explosion.beginFill(0xFFA500);
                        explosion.drawCircle(0, 0, 10);
                        explosion.endFill();
                        explosion.x = missile.x;
                        explosion.y = missile.y;
                        this.app.stage.addChild(explosion);
                        
                        // Remove explosion after 0.3 seconds
                        setTimeout(() => {
                            if (explosion.parent) {
                                this.app.stage.removeChild(explosion);
                            }
                        }, 300);
                        
                        // Destroy missile
                        missileBullet.destroy();
                        return;
                    }
                }
            } else {
                // No enemies, move upward
                missile.y -= 5;
                missileBullet.sprite.y = missile.y;
            }
            
            // Remove missile if it goes off screen
            if (missile.y < -20 || missile.y > this.app.screen.height + 20 ||
                missile.x < -20 || missile.x > this.app.screen.width + 20) {
                missileBullet.destroy();
                return;
            }
            
            // Continue moving
            requestAnimationFrame(moveMissile);
        };
        
        moveMissile();
    }
    
    hit() {
        // If shield is active, don't take damage
        if (this.isInvincible) {
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
        this.invincible = false;
        this.invincibleTimer = 0;
        this.bullets = [];
        this.fireRate = 250;
        this.bulletSpeed = 10;
        this.bulletDamage = 1;
        this.bulletType = 'normal';
        this.isInvincible = false;
        this.shieldSprite.visible = false;
    }
} 