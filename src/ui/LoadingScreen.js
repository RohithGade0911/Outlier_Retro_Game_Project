import * as PIXI from 'pixi.js';

export class LoadingScreen {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        
        // Create loading text
        this.loadingText = new PIXI.Text('Loading...', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.loadingText.x = this.app.screen.width / 2 - 100;
        this.loadingText.y = this.app.screen.height / 2 - 50;
        this.container.addChild(this.loadingText);
        
        // Create progress bar background
        this.progressBarBg = new PIXI.Graphics();
        this.progressBarBg.beginFill(0x333333);
        this.progressBarBg.drawRect(0, 0, 300, 20);
        this.progressBarBg.endFill();
        this.progressBarBg.x = this.app.screen.width / 2 - 150;
        this.progressBarBg.y = this.app.screen.height / 2 + 20;
        this.container.addChild(this.progressBarBg);
        
        // Create progress bar
        this.progressBar = new PIXI.Graphics();
        this.progressBar.beginFill(0x00FF00);
        this.progressBar.drawRect(0, 0, 300, 20);
        this.progressBar.endFill();
        this.progressBar.x = this.app.screen.width / 2 - 150;
        this.progressBar.y = this.app.screen.height / 2 + 20;
        this.progressBar.scale.x = 0;
        this.container.addChild(this.progressBar);
        
        // Create progress text
        this.progressText = new PIXI.Text('0%', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.progressText.x = this.app.screen.width / 2 - 20;
        this.progressText.y = this.app.screen.height / 2 + 50;
        this.container.addChild(this.progressText);
    }
    
    updateProgress(progress) {
        this.progressBar.scale.x = progress;
        this.progressText.text = `${Math.floor(progress * 100)}%`;
    }
    
    hide() {
        this.app.stage.removeChild(this.container);
    }
} 