import * as PIXI from 'pixi.js';
import { Player } from '../entities/Player';
import { Background } from '../entities/Background';
import { EnemyManager } from '../managers/EnemyManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { UIManager } from '../ui/UIManager';
import { AssetManager } from '../managers/AssetManager';
import { EventEmitter } from '../utils/EventEmitter';

export class Game extends EventEmitter {
    constructor(app) {
        super();
        this.app = app;
        this.player = null;
        this.background = null;
        this.enemyManager = null;
        this.powerUpManager = null;
        this.uiManager = null;
        this.assetManager = null;
        this.gameLoop = this.gameLoop.bind(this);
        this.keys = {};
        this.gameState = 'start'; // Changed from 'loading' to 'start'
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.setupKeyboardListeners();
        this.initGame();
        
        this.uiManager.on('gameStart', () => this.startGame());
        this.uiManager.on('gameRestart', () => this.restartGame());
    }

    async initGame() {
        // Create asset manager
        this.assetManager = new AssetManager(this.app);
        
        // Define assets to load
        const assetsToLoad = [
            { name: 'enemy1', url: 'assets/images/enemy1.png' },
            { name: 'enemy2', url: 'assets/images/enemy2.png' },
            { name: 'background', url: 'assets/images/background.png' }
        ];
        
        try {
            // Load assets
            await this.assetManager.loadAssets(assetsToLoad);
            
            // Create background
            this.background = new Background(this.app);
            
            // Create player
            this.player = new Player(this.app);
            this.app.stage.addChild(this.player.sprite);
            
            // Create managers
            this.enemyManager = new EnemyManager(this.app, this.player);
            this.powerUpManager = new PowerUpManager(this.app, this.player);
            this.uiManager = new UIManager(this);
            
            // Set up event listeners for UI interactions
            this.setupUIEventListeners();
            
            // Start game loop
            this.gameLoop();
        } catch (error) {
            console.error('Failed to load assets:', error);
            // Show error message to user
        }
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Start game on Enter key
            if (e.key === 'Enter' && this.gameState === 'start') {
                this.startGame();
            }
            
            // Restart game on 'R' key
            if (e.key === 'r' && this.gameState === 'gameOver') {
                this.restartGame();
            }
            
            // Pause game on 'P' key
            if (e.key === 'p' && this.gameState === 'playing') {
                this.pauseGame();
            }
            
            // Resume game on 'P' key
            if (e.key === 'p' && this.gameState === 'paused') {
                this.resumeGame();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    setupUIEventListeners() {
        // Listen for game start event from UI
        this.on('gameStart', () => {
            this.startGame();
        });
        
        // Listen for game resume event from UI
        this.on('gameResume', () => {
            this.resumeGame();
        });
        
        // Listen for game restart event from UI
        this.on('gameRestart', () => {
            this.restartGame();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.uiManager.hideStartScreen();
    }
    
    restartGame() {
        // Hide game over screen first
        if (this.uiManager) {
            this.uiManager.hideGameOverScreen();
        }
        
        // Reset game state
        this.score = 0;
        this.lives = 3;
        this.gameState = 'playing';
        
        // Clear all entities
        if (this.player) {
            // Clear player's bullets
            this.player.bullets.forEach(bullet => {
                if (bullet.sprite && bullet.sprite.parent) {
                    bullet.sprite.parent.removeChild(bullet.sprite);
                }
            });
            this.player.bullets = [];
            this.player.reset();
        }
        
        if (this.enemyManager) {
            this.enemyManager.clearEnemies();
            
            // Directly set wave to 1 without calling startNextWave
            this.enemyManager.wave = 1;
            this.enemyManager.isBossWave = false;
            this.enemyManager.difficultyMultiplier = 1;
            this.enemyManager.enemiesSpawned = 0;
            this.enemyManager.spawnDelay = 60;
            this.enemyManager.spawnTimer = 0;
            this.enemyManager.waveTransitionInProgress = false;
        }
        
        if (this.powerUpManager) {
            this.powerUpManager.clearPowerUps();
        }
        
        // Update UI
        if (this.uiManager) {
            this.uiManager.updateScore(this.score);
            this.uiManager.updateLives(this.lives);
            this.uiManager.updateWave(1);
        }
    }
    
    pauseGame() {
        this.gameState = 'paused';
        this.uiManager.createPauseMenu();
    }
    
    resumeGame() {
        this.gameState = 'playing';
        this.uiManager.hidePauseMenu();
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        
        // Show game over screen
        this.uiManager.showGameOver(this.score, this.highScore);
    }

    gameLoop() {
        // Skip updates if game is not in playing state
        if (this.gameState !== 'playing') {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }
        
        // Update background
        if (this.background) {
            this.background.update();
        }
        
        // Update player
        if (this.player) {
            this.player.update(this.keys);
            
            // Check for player-enemy collisions
            if (this.enemyManager.checkPlayerCollision(this.player)) {
                if (this.player.hit()) {
                    this.uiManager.updateLives(this.player.lives);
                    
                    if (this.player.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
            }
        }
        
        // Update enemy manager
        if (this.enemyManager) {
            this.enemyManager.update();
            
            // Check for bullet-enemy collisions
            const score = this.enemyManager.checkCollisions(this.player.bullets);
            if (score > 0) {
                this.score += score;
                this.uiManager.updateScore(this.score);
            }
            
            // Update wave number in UI
            this.uiManager.updateWave(this.enemyManager.wave);
            
            // Check if wave is complete and no transition is in progress
            if (!this.enemyManager.waveTransitionInProgress && 
                this.enemyManager.enemiesSpawned >= this.enemyManager.enemiesPerWave && 
                this.enemyManager.enemies.length === 0) {
                
                // Store the current wave number
                const currentWave = this.enemyManager.wave;
                
                // Show wave complete message
                this.uiManager.showWaveComplete(currentWave);
                
                // Show wave announcement and start next wave after delays
                setTimeout(() => {
                    // Show wave announcement for the next wave
                    this.uiManager.showWaveAnnouncement(currentWave + 1);
                    
                    // Start next wave after announcement
                    setTimeout(() => {
                        this.enemyManager.startNextWave();
                    }, 3000);
                }, 2000);
            }
        }
        
        // Update power-up manager
        if (this.powerUpManager) {
            this.powerUpManager.update();
            
            // Update power-up indicators
            for (const type in this.powerUpManager.powerUpTimers) {
                this.uiManager.updatePowerUp(
                    type,
                    this.powerUpManager.isPowerUpActive(type),
                    this.powerUpManager.powerUpTimers[type]
                );
            }
        }
        
        // Continue game loop
        requestAnimationFrame(() => this.gameLoop());
    }
} 