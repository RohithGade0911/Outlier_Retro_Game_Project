import * as PIXI from 'pixi.js';

export class Enemy {
    constructor(app, x, y, type = 'standard') {
        this.app = app;
        this.type = type;
        this.active = true;
        this.health = this.getHealthByType();
        this.speed = this.getSpeedByType();
        this.score = this.getScoreByType();
        
        // Create enemy sprite based on type
        this.sprite = this.createSpriteByType();
        
        // Position enemy
        this.sprite.x = x;
        this.sprite.y = y;
        
        // Add enemy to stage
        this.app.stage.addChild(this.sprite);
    }
    
    getHealthByType() {
        switch(this.type) {
            case 'standard': return 1;
            case 'bomber': return 2;
            case 'feather': return 1;
            case 'ufo': return 3;
            case 'boss': return 20;
            default: return 1;
        }
    }
    
    getSpeedByType() {
        switch(this.type) {
            case 'standard': return 1;
            case 'bomber': return 0.7;
            case 'feather': return 1.5;
            case 'ufo': return 0.5;
            case 'boss': return 0.3;
            default: return 1;
        }
    }
    
    getScoreByType() {
        switch(this.type) {
            case 'standard': return 100;
            case 'bomber': return 200;
            case 'feather': return 150;
            case 'ufo': return 300;
            case 'boss': return 1000;
            default: return 100;
        }
    }
    
    createSpriteByType() {
        const sprite = new PIXI.Graphics();
        
        switch(this.type) {
            case 'standard':
                // Standard chicken
                sprite.beginFill(0xFFD700);
                sprite.drawCircle(0, 0, 15);
                sprite.endFill();
                
                // Chicken face
                sprite.beginFill(0xFFA500);
                sprite.drawCircle(-5, -5, 5);
                sprite.drawCircle(5, -5, 5);
                sprite.endFill();
                
                // Beak
                sprite.beginFill(0xFF4500);
                sprite.drawPolygon([0, 5, -5, 10, 5, 10]);
                sprite.endFill();
                break;
                
            case 'bomber':
                // Bomber chicken
                sprite.beginFill(0xFF4500);
                sprite.drawCircle(0, 0, 20);
                sprite.endFill();
                
                // Bomber details
                sprite.beginFill(0x8B0000);
                sprite.drawRect(-10, -5, 20, 10);
                sprite.endFill();
                break;
                
            case 'feather':
                // Feather chicken
                sprite.beginFill(0xFFFFFF);
                sprite.drawCircle(0, 0, 12);
                sprite.endFill();
                
                // Feather details
                sprite.beginFill(0xDDDDDD);
                sprite.drawPolygon([-10, 0, -5, -10, 0, 0]);
                sprite.drawPolygon([10, 0, 5, -10, 0, 0]);
                sprite.endFill();
                break;
                
            case 'ufo':
                // UFO chicken
                sprite.beginFill(0x4169E1);
                sprite.drawEllipse(0, 0, 25, 10);
                sprite.endFill();
                
                // UFO dome
                sprite.beginFill(0x87CEEB);
                sprite.drawEllipse(0, -5, 15, 8);
                sprite.endFill();
                break;
                
            case 'boss':
                // Create a larger, more complex boss chicken
                // Main body
                sprite.beginFill(0xFF4500);
                sprite.drawCircle(0, 0, 40);
                sprite.endFill();
                
                // Boss chicken face
                sprite.beginFill(0xFFD700);
                sprite.drawCircle(-15, -15, 15);
                sprite.drawCircle(15, -15, 15);
                sprite.endFill();
                
                // Boss eyes
                sprite.beginFill(0x000000);
                sprite.drawCircle(-15, -15, 5);
                sprite.drawCircle(15, -15, 5);
                sprite.endFill();
                
                // Boss beak
                sprite.beginFill(0xFF8C00);
                sprite.drawPolygon([0, 0, -20, 20, 20, 20]);
                sprite.endFill();
                
                // Boss wings
                sprite.beginFill(0x8B0000);
                sprite.drawPolygon([-40, 0, -60, -20, -20, 0]);
                sprite.drawPolygon([40, 0, 60, -20, 20, 0]);
                sprite.endFill();
                break;
                
            default:
                // Default chicken
                sprite.beginFill(0xFFD700);
                sprite.drawCircle(0, 0, 15);
                sprite.endFill();
        }
        
        return sprite;
    }
    
    update() {
        // Move straight down
        this.sprite.y += this.speed;
        
        // Check if enemy is out of bounds
        if (this.sprite.y > this.app.screen.height + 30 || 
            this.sprite.x < -30 || 
            this.sprite.x > this.app.screen.width + 30) {
            this.destroy();
        }
    }
    
    takeDamage(damage = 1) {
        this.health -= damage;
        
        // Create hit effect
        this.createHitEffect();
        
        if (this.health <= 0) {
            this.destroy();
            return this.score;
        }
        
        return 0;
    }
    
    createHitEffect() {
        // Create a small hit effect
        const hitEffect = new PIXI.Graphics();
        hitEffect.beginFill(0xFFFFFF);
        hitEffect.drawCircle(0, 0, 5);
        hitEffect.endFill();
        
        hitEffect.x = this.sprite.x;
        hitEffect.y = this.sprite.y;
        
        this.app.stage.addChild(hitEffect);
        
        // Remove hit effect after a short time
        setTimeout(() => {
            if (hitEffect.parent) {
                this.app.stage.removeChild(hitEffect);
            }
        }, 100);
    }
    
    destroy() {
        this.active = false;
        if (this.sprite.parent) {
            this.app.stage.removeChild(this.sprite);
        }
    }
} 