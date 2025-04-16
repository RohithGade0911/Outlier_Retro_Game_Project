import * as PIXI from 'pixi.js';

export class Background {
    constructor(app) {
        this.app = app;
        this.stars = [];
        this.createStars();
    }
    
    createStars() {
        // Create three layers of stars with different speeds
        this.createStarLayer(100, 1, 0xFFFFFF); // Slow stars
        this.createStarLayer(50, 2, 0xAAAAAA); // Medium stars
        this.createStarLayer(25, 3, 0x888888); // Fast stars
    }
    
    createStarLayer(count, speed, color) {
        for (let i = 0; i < count; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(color);
            star.drawRect(0, 0, 1, 1);
            star.endFill();
            
            // Random position
            star.x = Math.random() * this.app.screen.width;
            star.y = Math.random() * this.app.screen.height;
            
            // Add speed property
            star.speed = speed;
            
            this.stars.push(star);
            this.app.stage.addChild(star);
        }
    }
    
    update() {
        // Update star positions
        for (const star of this.stars) {
            star.y += star.speed;
            
            // Reset star position if it goes off screen
            if (star.y > this.app.screen.height) {
                star.y = 0;
                star.x = Math.random() * this.app.screen.width;
            }
        }
    }
} 