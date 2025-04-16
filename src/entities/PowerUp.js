import * as PIXI from 'pixi.js';

export class PowerUp {
    constructor(app, x, y, type = 'rapidFire') {
        this.app = app;
        this.type = type;
        this.active = true;
        this.speed = 2;
        this.duration = this.getDurationByType();
        
        // Create power-up sprite based on type
        this.sprite = this.createSpriteByType();
        
        // Position power-up
        this.sprite.x = x;
        this.sprite.y = y;
        
        // Add power-up to stage
        this.app.stage.addChild(this.sprite);
    }
    
    getDurationByType() {
        switch(this.type) {
            case 'rapidFire': return 300; // 5 seconds at 60 FPS
            case 'missile': return 180;   // 3 seconds
            case 'shield': return 420;    // 7 seconds
            default: return 300;
        }
    }
    
    createSpriteByType() {
        // Create a container for the power-up
        const container = new PIXI.Container();
        
        // Create the main power-up circle
        const powerUp = new PIXI.Graphics();
        powerUp.beginFill(this.getPowerUpColor());
        powerUp.drawCircle(0, 0, 30);
        powerUp.endFill();
        
        // Create a glow effect
        const glow = new PIXI.Graphics();
        glow.beginFill(this.getPowerUpColor(), 0.4);
        glow.drawCircle(0, 0, 40);
        glow.endFill();
        
        // Add both to the container
        container.addChild(glow);
        container.addChild(powerUp);
        
        return container;
    }
    
    getPowerUpColor() {
        switch(this.type) {
            case 'rapidFire':
                return 0xFF0000; // Red
            case 'missile':
                return 0xFFA500; // Orange
            case 'shield':
                return 0x00FF00; // Green
            default:
                return 0xFFFFFF; // White
        }
    }
    
    update() {
        // Move power-up downward
        this.sprite.y += this.speed;
        
        // Check if power-up is out of bounds
        if (this.sprite.y > this.app.screen.height + 20) {
            this.destroy();
        }
    }
    
    destroy() {
        this.active = false;
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
    }
} 