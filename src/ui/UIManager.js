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
        this.restartButton = null;
        this.initUI();
    }

    initUI() {
        // Create score text
        this.scoreText = new PIXI.Text('Score: 0', {
            fontFamily: '"Press Start 2P"',
            fontSize: 16,
            fill: 0xffffff,
            align: 'left',
            letterSpacing: 2
        });
        this.scoreText.position.set(10, 10);
        this.app.stage.addChild(this.scoreText);

        // Create lives text
        this.livesText = new PIXI.Text('Lives: 3', {
            fontFamily: '"Press Start 2P"',
            fontSize: 16,
            fill: 0xffffff,
            align: 'left',
            letterSpacing: 2
        });
        this.livesText.position.set(10, 40);
        this.app.stage.addChild(this.livesText);

        // Create wave text
        this.waveText = new PIXI.Text('Wave: 1', {
            fontFamily: '"Press Start 2P"',
            fontSize: 16,
            fill: 0xffffff,
            align: 'left',
            letterSpacing: 2
        });
        this.waveText.position.set(10, 70);
        this.app.stage.addChild(this.waveText);

        // Create power-up indicators
        this.createPowerUpIndicators();

        // Create restart button
        this.createRestartButton();

        // Create start screen
        this.createStartScreen();
    }

    createPowerUpIndicators() {
        const powerUpTypes = {
            rapidFire: { color: 0xff0000, name: 'Rapid Fire' },
            shield: { color: 0x00ff00, name: 'Shield' }
        };

        let yOffset = 140;
        for (const [type, info] of Object.entries(powerUpTypes)) {
            const container = new PIXI.Container();
            
            // Create indicator background (reduced by 30%)
            const background = new PIXI.Graphics();
            background.beginFill(0x000000, 0.5);
            background.drawRoundedRect(0, 0, 147, 29, 5); // Reduced from 210x42 to 147x29
            background.endFill();
            
            // Create power-up icon (reduced by 30%)
            const icon = new PIXI.Graphics();
            icon.beginFill(info.color);
            icon.drawCircle(15, 15, 10); // Reduced from 21,21,14 to 15,15,10
            icon.endFill();
            
            // Create power-up name (reduced font size by 30%)
            const name = new PIXI.Text(info.name, {
                fontFamily: '"Press Start 2P"',
                fontSize: 12, // Reduced from 17
                fill: 0xffffff,
                letterSpacing: 1
            });
            name.position.set(29, 5); // Adjusted position for smaller size
            
            // Create timer text (reduced font size by 30%)
            const timer = new PIXI.Text('', {
                fontFamily: '"Press Start 2P"',
                fontSize: 12, // Reduced from 17
                fill: 0xffffff,
                letterSpacing: 1
            });
            timer.position.set(118, 5); // Adjusted position for smaller size
            
            container.addChild(background, icon, name, timer);
            container.position.set(this.app.screen.width - 200, yOffset); // Moved 43 pixels to the left from -157
            
            this.powerUpIndicators[type] = {
                container,
                timer,
                active: false
            };
            
            this.app.stage.addChild(container);
            yOffset += 39; // Reduced spacing from 56 to 39
        }
    }

    createRestartButton() {
        // Create a container for the restart button
        this.restartButton = new PIXI.Container();
        
        // Create button background
        const buttonBg = new PIXI.Graphics();
        buttonBg.beginFill(0xff0000);
        buttonBg.drawCircle(0, 0, 20);
        buttonBg.endFill();
        
        // Create restart icon (circular arrow)
        const icon = new PIXI.Graphics();
        icon.lineStyle(3, 0xffffff);
        icon.arc(0, 0, 12, 0, Math.PI * 1.5, false);
        icon.moveTo(8, -8);
        icon.lineTo(12, -12);
        icon.lineTo(8, -16);
        
        // Add elements to container
        this.restartButton.addChild(buttonBg, icon);
        
        // Position the button in the top right corner
        this.restartButton.position.set(
            this.app.screen.width - 40,
            40
        );
        
        // Make button interactive
        this.restartButton.eventMode = 'static';
        this.restartButton.cursor = 'pointer';
        this.restartButton.on('pointerdown', () => {
            // Refresh the page to restart the game
            window.location.reload();
        });
        
        // Add to stage
        this.app.stage.addChild(this.restartButton);
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
            fontFamily: '"Press Start 2P"',
            fontSize: 45,
            fill: 0xffffff,
            align: 'center',
            letterSpacing: 6
        });
        title.position.set(
            this.app.screen.width / 2 - title.width / 2,
            this.app.screen.height / 2 - 140
        );
        
        // Create start button
        const startButton = new PIXI.Container();
        
        const buttonBg = new PIXI.Graphics();
        buttonBg.beginFill(0x00ff00);
        buttonBg.drawRoundedRect(0, 0, 280, 70, 14);
        buttonBg.endFill();
        
        const buttonText = new PIXI.Text('Start Game', {
            fontFamily: '"Press Start 2P"',
            fontSize: 22,
            fill: 0xffffff,
            letterSpacing: 3,
            align: 'center'
        });
        // Center the text in the button
        buttonText.position.set(
            (280 - buttonText.width) / 2,
            (70 - buttonText.height) / 2
        );
        
        startButton.addChild(buttonBg, buttonText);
        startButton.position.set(
            this.app.screen.width / 2 - 140,
            this.app.screen.height / 2 + 70
        );
        
        // Make button interactive
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
            fontFamily: '"Press Start 2P"',
            fontSize: 32,
            fill: 0xffffff,
            align: 'center',
            letterSpacing: 4
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
        buttonBg.drawRoundedRect(0, 0, 280, 70, 14);
        buttonBg.endFill();
        
        const buttonText = new PIXI.Text(text, {
            fontFamily: '"Press Start 2P"',
            fontSize: 22,
            fill: 0xffffff,
            letterSpacing: 3,
            align: 'center'
        });
        // Center the text in the button
        buttonText.position.set(
            (280 - buttonText.width) / 2,
            (70 - buttonText.height) / 2
        );
        
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
            fontFamily: '"Press Start 2P"',
            fontSize: 32,
            fill: 0xffffff,
            align: 'center',
            letterSpacing: 4
        });
        title.position.set(
            this.app.screen.width / 2 - title.width / 2,
            this.app.screen.height / 2 - 150
        );
        
        // Create score text
        const scoreText = new PIXI.Text(`Score: ${score}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center',
            letterSpacing: 2
        });
        scoreText.position.set(
            this.app.screen.width / 2 - scoreText.width / 2,
            this.app.screen.height / 2 - 50
        );
        
        // Create high score text
        const highScoreText = new PIXI.Text(`High Score: ${highScore}`, {
            fontFamily: '"Press Start 2P"',
            fontSize: 24,
            fill: 0xffffff,
            align: 'center',
            letterSpacing: 2
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
            // Refresh the page to restart the game
            window.location.reload();
        });
        
        this.gameOverScreen.addChild(background, title, scoreText, highScoreText, restartButton);
        this.app.stage.addChild(this.gameOverScreen);
    }

    showWaveComplete(wave) {
        if (this.waveCompleteText) {
            this.app.stage.removeChild(this.waveCompleteText);
        }
        
        this.waveCompleteText = new PIXI.Text(`Wave ${wave} Complete!`, {
            fontFamily: '"Press Start 2P"',
            fontSize: 24,
            fill: 0x00ff00,
            align: 'center',
            letterSpacing: 2
        });
        this.waveCompleteText.position.set(
            this.app.screen.width / 2 - this.waveCompleteText.width / 2,
            this.app.screen.height / 2
        );
        
        this.app.stage.addChild(this.waveCompleteText);
        
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
            fontFamily: '"Press Start 2P"',
            fontSize: 32,
            fill: 0xffffff,
            align: 'center',
            letterSpacing: 2
        });
        waveText.position.set(150 - waveText.width / 2, 20);
        
        // Create "Starting..." text with flickering effect
        const startingText = new PIXI.Text('Starting...', {
            fontFamily: '"Press Start 2P"',
            fontSize: 16,
            fill: 0xffff00,
            align: 'center',
            letterSpacing: 2
        });
        startingText.position.set(150 - startingText.width / 2, 70);
        
        // Add flickering effect to "Starting..." text
        let alpha = 1;
        const flickerInterval = setInterval(() => {
            alpha = alpha === 1 ? 0.3 : 1;
            startingText.alpha = alpha;
        }, 200);
        
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
                clearInterval(flickerInterval);
                this.app.stage.removeChild(this.waveAnnouncementText);
                this.waveAnnouncementText = null;
            }
        }, 3000);
    }

    updateScore(score) {
        this.scoreText.text = `Score: ${score}`;
        this.scoreText.style.fontSize = 22;
    }

    updateLives(lives) {
        this.livesText.text = `Lives: ${lives}`;
        this.livesText.style.fontSize = 22;
    }

    updateWave(wave) {
        this.waveText.text = `Wave: ${wave}`;
        this.waveText.style.fontSize = 22;
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

    hideGameOverScreen() {
        if (this.gameOverScreen && this.gameOverScreen.parent) {
            this.app.stage.removeChild(this.gameOverScreen);
            this.gameOverScreen = null;
        }
    }
} 