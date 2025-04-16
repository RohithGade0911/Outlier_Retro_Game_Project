import * as PIXI from 'pixi.js';
import { Player } from '../entities/Player';
import { Background } from '../entities/Background';
import { EnemyManager } from '../managers/EnemyManager';
import { PowerUpManager } from '../managers/PowerUpManager';
import { UIManager } from '../ui/UIManager';

export class Game {
    constructor(app) {
        this.app = app;
        this.player = null;
        this.background = null;
        this.enemyManager = null;
        this.powerUpManager = null;
        this.uiManager = null;
        this.gameLoop = this.gameLoop.bind(this);
        this.keys = {};
        this.gameState = 'playing'; // 'playing', 'gameOver', 'paused'
        this.setupKeyboardListeners();
        this.initGame();
        this.gameLoop();
    }

    initGame() {
        // Create background
        this.background = new Background(this.app);
        
        // Create player
        this.player = new Player(this.app);
        this.app.stage.addChild(this.player.sprite);
        
        // Create managers
        this.enemyManager = new EnemyManager(this.app);
        this.powerUpManager = new PowerUpManager(this.app, this.player);
        this.uiManager = new UIManager(this.app);
        
        // Reset game state
        this.gameState = 'playing';
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Restart game on 'R' key
            if (e.key === 'r' && this.gameState === 'gameOver') {
                this.restartGame();
            }
            
            // Pause game on 'P' key
            if (e.key === 'p') {
                this.togglePause();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    restartGame() {
        // Remove all game objects
        this.app.stage.removeChildren();
        
        // Reinitialize game
        this.initGame();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            // In a full game, we would show a pause menu here
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            // In a full game, we would hide the pause menu here
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.uiManager.showGameOver();
    }

    gameLoop() {
        // Skip updates if game is paused or over
        if (this.gameState !== 'playing') return;
        
        // Update background
        if (this.background) {
            this.background.update();
        }
        
        // Update player
        if (this.player) {
            this.player.update(this.keys);
            
            // Check for player-enemy collisions
            if (this.enemyManager.checkPlayerCollision(this.player)) {
                this.player.hit();
                this.uiManager.updateLives(this.player.lives);
                
                if (this.player.lives <= 0) {
                    this.gameOver();
                }
            }
        }
        
        // Update enemy manager
        if (this.enemyManager) {
            this.enemyManager.update();
            
            // Check for bullet-enemy collisions
            const score = this.enemyManager.checkCollisions(this.player.bullets);
            if (score > 0) {
                this.uiManager.updateScore(score);
            }
            
            // Check if wave is complete
            if (this.enemyManager.waveComplete) {
                this.uiManager.showWaveComplete();
                this.enemyManager.startNextWave();
                this.uiManager.updateWave(this.enemyManager.wave);
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
        
        requestAnimationFrame(() => this.gameLoop());
    }
} 