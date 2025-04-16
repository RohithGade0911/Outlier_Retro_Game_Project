import * as PIXI from 'pixi.js';

export class Bullet {
    constructor(app, x, y, speed = 10, damage = 1) {
        this.app = app;
        this.active = true;
        this.damage = damage;
        
        // Create bullet sprite
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFFFF);
        this.sprite.drawCircle(0, 0, 3);
        this.sprite.endFill();
        
        // Position bullet
        this.sprite.x = x;
        this.sprite.y = y;
        
        // Add to stage
        this.app.stage.addChild(this.sprite);
        
        // Movement
        this.speed = speed;
    }
    
    update() {
        // Move bullet upward
        this.sprite.y -= this.speed;
        
        // Remove if off screen
        if (this.sprite.y < -10) {
            this.destroy();
        }
    }
    
    destroy() {
        this.active = false;
        this.app.stage.removeChild(this.sprite);
    }
} 