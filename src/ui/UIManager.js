import * as PIXI from 'pixi.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.app = game.app;
        this.scoreText = null;
        this.livesText = null;
        this.waveText = null;
        this.powerUpIndicators = {};
        this.startScreen = null;
        this.pauseMenu = null;
        this.gameOverScreen = null;
        this.waveCompleteText = null;
        this.waveAnnouncementText = null;
        this.initUI();
    }

    initUI() {
        // Create score text
        this.scoreText = new PIXI.Text('Score: 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left'
        });
        this.scoreText.position.set(10, 10);
        this.app.stage.addChild(this.scoreText);

        // Create lives text
        this.livesText = new PIXI.Text('Lives: 3', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left'
        });
        this.livesText.position.set(10, 40);
        this.app.stage.addChild(this.livesText);

        // Create wave text
        this.waveText = new PIXI.Text('Wave: 1', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
            align: 'left'
        });
        this.waveText.position.set(10, 70);
        this.app.stage.addChild(this.waveText);

        // Create power-up indicators
        this.createPowerUpIndicators();

        // Create start screen
        this.createStartScreen();
    }

    createPowerUpIndicators() {
        const powerUpTypes = {
            rapidFire: { color: 0xff0000, name: 'Rapid Fire' },
            missile: { color: 0xffa500, name: 'Missile' },
            shield: { color: 0x00ff00, name: 'Shield' }
        };

        let yOffset = 100;
        for (const [type, info] of Object.entries(powerUpTypes)) {
            const container = new PIXI.Container();
            
            // Create indicator background
            const background = new PIXI.Graphics();
            background.beginFill(0x000000, 0.5);
            background.drawRoundedRect(0, 0, 150, 30, 5);
            background.endFill();
            
            // Create power-up icon
            const icon = new PIXI.Graphics();
            icon.beginFill(info.color);
            icon.drawCircle(15, 15, 10);
            icon.endFill();
            
            // Create power-up name
            const name = new PIXI.Text(info.name, {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xffffff
            });
            name.position.set(30, 5);
            
            // Create timer text
            const timer = new PIXI.Text('', {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xffffff
            });
            timer.position.set(120, 5);
            
            container.addChild(background, icon, name, timer);
            container.position.set(this.app.screen.width - 160, yOffset);
            
            this.powerUpIndicators[type] = {
                container,
                timer,
                active: false
            };
            
            this.app.stage.addChild(container);
            yOffset += 40;
        }
    }

    createStartScreen() {
        this.startScreen = new PIXI.Container();
        
        // Create background
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.8);
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // Create title
        const title = new PIXI.Text('Space Shooter', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            align: 'center'
        });
        title.position.set(
            this.app.screen.width / 2 - title.width / 2,
            this.app.screen.height / 2 - 100
        );
        
        // Create start button
        const startButton = new PIXI.Container();
        
        const buttonBg = new PIXI.Graphics();
        buttonBg.beginFill(0x00ff00);
        buttonBg.drawRoundedRect(0, 0, 200, 50, 10);
        buttonBg.endFill();
        
        const buttonText = new PIXI.Text('Start Game', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff
        });
        buttonText.position.set(50, 10);
        
        startButton.addChild(buttonBg, buttonText);
        startButton.position.set(
            this.app.screen.width / 2 - 100,
            this.app.screen.height / 2 + 50
        );
        
        // Make button interactive using eventMode
        startButton.eventMode = 'static';
        startButton.cursor = 'pointer';
        startButton.on('pointerdown', () => {
            this.game.emit('gameStart');
        });
        
        this.startScreen.addChild(background, title, startButton);
        this.app.stage.addChild(this.startScreen);
    }

    createPauseMenu() {
        this.pauseMenu = new PIXI.Container();
        
        // Create background
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.8);
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // Create title
        const title = new PIXI.Text('Game Paused', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            align: 'center'
        });
        title.position.set(
            this.app.screen.width / 2 - title.width / 2,
            this.app.screen.height / 2 - 100
        );
        
        // Create resume button
        const resumeButton = this.createButton('Resume', 0x00ff00);
        resumeButton.position.set(
            this.app.screen.width / 2 - 100,
            this.app.screen.height / 2 + 50
        );
        resumeButton.on('pointerdown', () => {
            this.game.emit('gameResume');
        });
        
        this.pauseMenu.addChild(background, title, resumeButton);
        this.app.stage.addChild(this.pauseMenu);
    }

    createButton(text, color) {
        const button = new PIXI.Container();
        
        const buttonBg = new PIXI.Graphics();
        buttonBg.beginFill(color);
        buttonBg.drawRoundedRect(0, 0, 200, 50, 10);
        buttonBg.endFill();
        
        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff
        });
        buttonText.position.set(50, 10);
        
        button.addChild(buttonBg, buttonText);
        button.eventMode = 'static';
        button.cursor = 'pointer';
        
        return button;
    }

    showGameOver(score, highScore) {
        this.gameOverScreen = new PIXI.Container();
        
        // Create background
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.8);
        background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // Create title
        const title = new PIXI.Text('Game Over', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            align: 'center'
        });
        title.position.set(
            this.app.screen.width / 2 - title.width / 2,
            this.app.screen.height / 2 - 150
        );
        
        // Create score text
        const scoreText = new PIXI.Text(`Score: ${score}`, {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xffffff,
            align: 'center'
        });
        scoreText.position.set(
            this.app.screen.width / 2 - scoreText.width / 2,
            this.app.screen.height / 2 - 50
        );
        
        // Create high score text
        const highScoreText = new PIXI.Text(`High Score: ${highScore}`, {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xffffff,
            align: 'center'
        });
        highScoreText.position.set(
            this.app.screen.width / 2 - highScoreText.width / 2,
            this.app.screen.height / 2
        );
        
        // Create restart button
        const restartButton = this.createButton('Restart', 0xff0000);
        restartButton.position.set(
            this.app.screen.width / 2 - 100,
            this.app.screen.height / 2 + 100
        );
        restartButton.on('pointerdown', () => {
            this.game.emit('gameRestart');
        });
        
        this.gameOverScreen.addChild(background, title, scoreText, highScoreText, restartButton);
        this.app.stage.addChild(this.gameOverScreen);
    }

    showWaveComplete(wave) {
        if (this.waveCompleteText) {
            this.app.stage.removeChild(this.waveCompleteText);
        }
        
        this.waveCompleteText = new PIXI.Text(`Wave ${wave} Complete!`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0x00ff00,
            align: 'center'
        });
        this.waveCompleteText.position.set(
            this.app.screen.width / 2 - this.waveCompleteText.width / 2,
            this.app.screen.height / 2
        );
        
        this.app.stage.addChild(this.waveCompleteText);
        
        // Remove text after 2 seconds
        setTimeout(() => {
            if (this.waveCompleteText && this.waveCompleteText.parent) {
                this.app.stage.removeChild(this.waveCompleteText);
                this.waveCompleteText = null;
            }
        }, 2000);
    }

    showWaveAnnouncement(wave) {
        if (this.waveAnnouncementText) {
            this.app.stage.removeChild(this.waveAnnouncementText);
        }
        
        // Create a container for the announcement
        this.waveAnnouncementText = new PIXI.Container();
        
        // Create background
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.7);
        background.drawRoundedRect(0, 0, 300, 100, 10);
        background.endFill();
        
        // Create wave text
        const waveText = new PIXI.Text(`Wave ${wave}`, {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xffffff,
            align: 'center'
        });
        waveText.position.set(150 - waveText.width / 2, 20);
        
        // Create "Starting..." text
        const startingText = new PIXI.Text('Starting...', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffff00,
            align: 'center'
        });
        startingText.position.set(150 - startingText.width / 2, 70);
        
        // Add elements to container
        this.waveAnnouncementText.addChild(background, waveText, startingText);
        
        // Position the container
        this.waveAnnouncementText.position.set(
            this.app.screen.width / 2 - 150,
            this.app.screen.height / 2 - 50
        );
        
        // Add to stage
        this.app.stage.addChild(this.waveAnnouncementText);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (this.waveAnnouncementText && this.waveAnnouncementText.parent) {
                this.app.stage.removeChild(this.waveAnnouncementText);
                this.waveAnnouncementText = null;
            }
        }, 3000);
    }

    updateScore(score) {
        this.scoreText.text = `Score: ${score}`;
    }

    updateLives(lives) {
        this.livesText.text = `Lives: ${lives}`;
    }

    updateWave(wave) {
        this.waveText.text = `Wave: ${wave}`;
    }

    updatePowerUp(type, isActive, timeLeft) {
        const indicator = this.powerUpIndicators[type];
        if (!indicator) return;
        
        indicator.active = isActive;
        indicator.timer.text = isActive ? Math.ceil(timeLeft) : '';
        
        // Update visual state
        indicator.container.alpha = isActive ? 1 : 0.5;
    }

    hideStartScreen() {
        if (this.startScreen && this.startScreen.parent) {
            this.app.stage.removeChild(this.startScreen);
            this.startScreen = null;
        }
    }

    hidePauseMenu() {
        if (this.pauseMenu && this.pauseMenu.parent) {
            this.app.stage.removeChild(this.pauseMenu);
            this.pauseMenu = null;
        }
    }
} 