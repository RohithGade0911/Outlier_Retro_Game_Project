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
            case 'laser': return 240;     // 4 seconds
            case 'missile': return 180;   // 3 seconds
            case 'shield': return 420;    // 7 seconds
            default: return 300;
        }
    }
    
    createSpriteByType() {
        const sprite = new PIXI.Graphics();
        
        switch(this.type) {
            case 'rapidFire':
                // Rapid fire power-up (red)
                sprite.beginFill(0xFF0000);
                sprite.drawCircle(0, 0, 10);
                sprite.endFill();
                
                // Rapid fire icon
                sprite.beginFill(0xFFFFFF);
                sprite.drawRect(-5, -2, 10, 4);
                sprite.drawRect(-5, -6, 10, 4);
                sprite.endFill();
                break;
                
            case 'laser':
                // Laser power-up (blue)
                sprite.beginFill(0x0000FF);
                sprite.drawCircle(0, 0, 10);
                sprite.endFill();
                
                // Laser icon
                sprite.beginFill(0xFFFFFF);
                sprite.drawRect(-2, -8, 4, 16);
                sprite.endFill();
                break;
                
            case 'missile':
                // Missile power-up (orange)
                sprite.beginFill(0xFFA500);
                sprite.drawCircle(0, 0, 10);
                sprite.endFill();
                
                // Missile icon
                sprite.beginFill(0xFFFFFF);
                sprite.drawPolygon([0, -8, -5, 0, 0, 5, 5, 0]);
                sprite.endFill();
                break;
                
            case 'shield':
                // Shield power-up (green)
                sprite.beginFill(0x00FF00);
                sprite.drawCircle(0, 0, 10);
                sprite.endFill();
                
                // Shield icon
                sprite.beginFill(0xFFFFFF);
                sprite.drawCircle(0, 0, 6);
                sprite.endFill();
                break;
                
            default:
                // Default power-up
                sprite.beginFill(0xFFFFFF);
                sprite.drawCircle(0, 0, 10);
                sprite.endFill();
        }
        
        return sprite;
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
        this.app.stage.removeChild(this.sprite);
    }
} 