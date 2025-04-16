import * as PIXI from 'pixi.js';

export class Background {
    constructor(app) {
        if (!app || !app.screen) {
            throw new Error('PIXI Application must be initialized before creating Background');
        }
        
        this.app = app;
        this.speed = 2;
        
        // Create two background layers for seamless scrolling
        this.layer1 = this.createBackgroundLayer();
        this.layer2 = this.createBackgroundLayer();
        
        // Position the second layer above the first
        this.layer2.y = -this.app.screen.height;
        
        // Add both layers to the stage
        this.app.stage.addChild(this.layer1);
        this.app.stage.addChild(this.layer2);
    }
    
    createBackgroundLayer() {
        const layer = new PIXI.Graphics();
        
        // Draw stars
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            const size = Math.random() * 2 + 1;
            
            layer.beginFill(0xFFFFFF);
            layer.drawCircle(x, y, size);
            layer.endFill();
        }
        
        return layer;
    }
    
    update() {
        // Move both layers down
        this.layer1.y += this.speed;
        this.layer2.y += this.speed;
        
        // If a layer is completely off screen, move it to the top
        if (this.layer1.y >= this.app.screen.height) {
            this.layer1.y = -this.app.screen.height;
        }
        if (this.layer2.y >= this.app.screen.height) {
            this.layer2.y = -this.app.screen.height;
        }
    }
} 