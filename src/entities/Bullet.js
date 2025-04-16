import * as PIXI from 'pixi.js';

export class Bullet {
    constructor(app, x, y, speed = 10) {
        this.app = app;
        this.speed = speed;
        this.active = true;
        
        // Create bullet sprite (temporary pixel-art style)
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFFFF);
        this.sprite.drawRect(-2, -8, 4, 16);
        this.sprite.endFill();
        
        // Position bullet
        this.sprite.x = x;
        this.sprite.y = y;
        
        // Add bullet to stage
        this.app.stage.addChild(this.sprite);
    }
    
    update() {
        // Move bullet upward
        this.sprite.y -= this.speed;
        
        // Check if bullet is out of bounds
        if (this.sprite.y < -20) {
            this.destroy();
        }
    }
    
    destroy() {
        this.active = false;
        this.app.stage.removeChild(this.sprite);
    }
} 