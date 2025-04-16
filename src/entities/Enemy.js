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
            default: return 1;
        }
    }
    
    getSpeedByType() {
        switch(this.type) {
            case 'standard': return 1;
            case 'bomber': return 0.7;
            case 'feather': return 1.5;
            case 'ufo': return 0.5;
            default: return 1;
        }
    }
    
    getScoreByType() {
        switch(this.type) {
            case 'standard': return 100;
            case 'bomber': return 200;
            case 'feather': return 150;
            case 'ufo': return 300;
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
                
            default:
                // Default chicken
                sprite.beginFill(0xFFD700);
                sprite.drawCircle(0, 0, 15);
                sprite.endFill();
        }
        
        return sprite;
    }
    
    update() {
        // Move enemy downward
        this.sprite.y += this.speed;
        
        // Check if enemy is out of bounds
        if (this.sprite.y > this.app.screen.height + 30) {
            this.destroy();
        }
    }
    
    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            this.destroy();
            return this.score;
        }
        return 0;
    }
    
    destroy() {
        this.active = false;
        this.app.stage.removeChild(this.sprite);
    }
} 