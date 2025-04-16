import * as PIXI from 'pixi.js';

export class BulletManager {
    constructor(app) {
        this.app = app;
        this.bullets = [];
    }
    
    clearBullets() {
        // Remove all bullets from the stage
        this.bullets.forEach(bullet => {
            bullet.destroy();
        });
        this.bullets = [];
    }
} 