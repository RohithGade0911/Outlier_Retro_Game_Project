import * as PIXI from 'pixi.js';
import { Game } from './core/Game';

// Function to initialize the game
function initGame() {
    // Create PIXI Application
    const app = new PIXI.Application({
        width: 1200,
        height: 840,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
    });

    // Add the canvas to the HTML document
    document.body.appendChild(app.view);

    // Initialize the game with the PIXI application
    const game = new Game(app);
}

// Wait for the DOM and fonts to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // Check if fonts are already loaded
    if (document.fonts.status === 'loaded') {
        initGame();
    } else {
        // Wait for fonts to load
        document.fonts.ready.then(() => {
            initGame();
        });
    }
}); 