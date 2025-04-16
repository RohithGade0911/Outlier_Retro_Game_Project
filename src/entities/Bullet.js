import * as PIXI from 'pixi.js';

export class Bullet {
    constructor(app, x, y, speed = 10, damage = 1) {
        this.app = app;
        this.active = true;
        this.damage = damage;
        
        // Create bullet using Graphics instead of PNG
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFFFF); // White color
        this.sprite.drawCircle(0, 0, 10); // Draw a circle with radius 10
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
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        this.active = false;
    }
} 