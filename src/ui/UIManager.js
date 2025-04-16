import * as PIXI from 'pixi.js';

export class UIManager {
    constructor(app) {
        this.app = app;
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        
        // Create UI container
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        
        // Create UI elements
        this.createUI();
        
        // Power-up indicators
        this.powerUpIndicators = {};
        this.createPowerUpIndicators();
        
        // Create power-up legend
        this.createPowerUpLegend();
    }
    
    createUI() {
        // Score text
        this.scoreText = new PIXI.Text('Score: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'left'
        });
        this.scoreText.x = 10;
        this.scoreText.y = 10;
        this.container.addChild(this.scoreText);
        
        // Lives text
        this.livesText = new PIXI.Text('Lives: 3', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'right'
        });
        this.livesText.x = this.app.screen.width - 120;
        this.livesText.y = 10;
        this.container.addChild(this.livesText);
        
        // Wave text
        this.waveText = new PIXI.Text('Wave: 1', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        this.waveText.x = this.app.screen.width / 2 - 50;
        this.waveText.y = 10;
        this.container.addChild(this.waveText);
    }
    
    createPowerUpIndicators() {
        // Create power-up indicators
        const powerUpTypes = ['rapidFire', 'laser', 'missile', 'shield'];
        const powerUpColors = {
            rapidFire: 0xFF0000,
            laser: 0x0000FF,
            missile: 0xFFA500,
            shield: 0x00FF00
        };
        
        for (let i = 0; i < powerUpTypes.length; i++) {
            const type = powerUpTypes[i];
            const color = powerUpColors[type];
            
            // Create indicator container
            const indicator = new PIXI.Container();
            indicator.x = 10 + i * 60;
            indicator.y = 50;
            
            // Create indicator background
            const background = new PIXI.Graphics();
            background.beginFill(0x333333);
            background.drawRect(0, 0, 50, 20);
            background.endFill();
            indicator.addChild(background);
            
            // Create indicator icon
            const icon = new PIXI.Graphics();
            icon.beginFill(color);
            icon.drawCircle(10, 10, 8);
            icon.endFill();
            indicator.addChild(icon);
            
            // Create indicator text
            const text = new PIXI.Text('0', {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xFFFFFF,
                align: 'right'
            });
            text.x = 25;
            text.y = 2;
            indicator.addChild(text);
            
            // Add to container
            this.container.addChild(indicator);
            
            // Store reference
            this.powerUpIndicators[type] = {
                container: indicator,
                text: text,
                active: false
            };
        }
    }
    
    createPowerUpLegend() {
        // Create legend container
        const legendContainer = new PIXI.Container();
        legendContainer.x = 10;
        legendContainer.y = 80;
        
        // Create legend title
        const legendTitle = new PIXI.Text('Power-Ups:', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            align: 'left'
        });
        legendContainer.addChild(legendTitle);
        
        // Create legend items
        const powerUpTypes = [
            { type: 'rapidFire', color: 0xFF0000, description: 'Rapid Fire' },
            { type: 'laser', color: 0x0000FF, description: 'Laser' },
            { type: 'missile', color: 0xFFA500, description: 'Missile' },
            { type: 'shield', color: 0x00FF00, description: 'Shield' }
        ];
        
        for (let i = 0; i < powerUpTypes.length; i++) {
            const item = powerUpTypes[i];
            
            // Create item container
            const itemContainer = new PIXI.Container();
            itemContainer.y = 20 + i * 20;
            
            // Create color indicator
            const colorIndicator = new PIXI.Graphics();
            colorIndicator.beginFill(item.color);
            colorIndicator.drawCircle(8, 8, 6);
            colorIndicator.endFill();
            itemContainer.addChild(colorIndicator);
            
            // Create description text
            const descriptionText = new PIXI.Text(item.description, {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                align: 'left'
            });
            descriptionText.x = 20;
            descriptionText.y = 2;
            itemContainer.addChild(descriptionText);
            
            // Add to legend container
            legendContainer.addChild(itemContainer);
        }
        
        // Add legend to UI container
        this.container.addChild(legendContainer);
    }
    
    updateScore(points) {
        this.score += points;
        this.scoreText.text = `Score: ${this.score}`;
    }
    
    updateLives(lives) {
        this.lives = lives;
        this.livesText.text = `Lives: ${this.lives}`;
    }
    
    updateWave(wave) {
        this.wave = wave;
        this.waveText.text = `Wave: ${this.wave}`;
    }
    
    updatePowerUp(type, active, timeLeft) {
        if (this.powerUpIndicators[type]) {
            const indicator = this.powerUpIndicators[type];
            
            if (active) {
                // Show active power-up
                indicator.container.alpha = 1;
                indicator.text.text = Math.ceil(timeLeft / 60); // Convert frames to seconds
                indicator.active = true;
            } else {
                // Hide inactive power-up
                indicator.container.alpha = 0.5;
                indicator.text.text = '0';
                indicator.active = false;
            }
        }
    }
    
    showGameOver() {
        // Create game over text
        const gameOverText = new PIXI.Text('GAME OVER', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xFF0000,
            align: 'center'
        });
        gameOverText.x = this.app.screen.width / 2 - 120;
        gameOverText.y = this.app.screen.height / 2 - 50;
        this.container.addChild(gameOverText);
        
        // Create final score text
        const finalScoreText = new PIXI.Text(`Final Score: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xFFFFFF,
            align: 'center'
        });
        finalScoreText.x = this.app.screen.width / 2 - 120;
        finalScoreText.y = this.app.screen.height / 2 + 20;
        this.container.addChild(finalScoreText);
        
        // Create restart text
        const restartText = new PIXI.Text('Press R to Restart', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        restartText.x = this.app.screen.width / 2 - 100;
        restartText.y = this.app.screen.height / 2 + 80;
        this.container.addChild(restartText);
    }
    
    showWaveComplete() {
        // Create wave complete text
        const waveCompleteText = new PIXI.Text(`Wave ${this.wave} Complete!`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0x00FF00,
            align: 'center'
        });
        waveCompleteText.x = this.app.screen.width / 2 - 120;
        waveCompleteText.y = this.app.screen.height / 2 - 50;
        this.container.addChild(waveCompleteText);
        
        // Remove text after 2 seconds
        setTimeout(() => {
            this.container.removeChild(waveCompleteText);
        }, 2000);
    }
} 