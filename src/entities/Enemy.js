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
        let sprite;
        
        switch(this.type) {
            case 'standard':
                sprite = PIXI.Sprite.from('assets/images/enemy-standard.png');
                // Set size for standard enemy
                sprite.width = 80;
                sprite.height = 80;
                break;
                
            case 'bomber':
                sprite = PIXI.Sprite.from('assets/images/enemy-bomber.png');
                // Set size for bomber enemy
                sprite.width = 90;
                sprite.height = 90;
                break;
                
            case 'feather':
                sprite = PIXI.Sprite.from('assets/images/enemy-feather.png');
                // Set size for feather enemy
                sprite.width = 70;
                sprite.height = 70;
                break;
                
            case 'ufo':
                sprite = PIXI.Sprite.from('assets/images/enemy-ufo.png');
                // Set size for UFO enemy
                sprite.width = 120;
                sprite.height = 60;
                break;
                
            case 'boss':
                // Use the standard enemy but make it larger
                sprite = PIXI.Sprite.from('assets/images/enemy-standard.png');
                // Set size for boss enemy (3x the standard size)
                sprite.width = 240;
                sprite.height = 240;
                break;
                
            default:
                sprite = PIXI.Sprite.from('assets/images/enemy-standard.png');
                // Set default size
                sprite.width = 80;
                sprite.height = 80;
        }
        
        // Set the anchor point to the center of the sprite
        sprite.anchor.set(0.5);
        
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
        // Create a small hit effect using PNG
        const hitEffect = PIXI.Sprite.from('assets/images/hit.png');
        
        // Set the anchor point to the center of the sprite
        hitEffect.anchor.set(0.5);
        
        // Set the size of the hit effect sprite
        hitEffect.width = 30;
        hitEffect.height = 30;
        
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