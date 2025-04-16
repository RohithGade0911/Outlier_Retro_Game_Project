import * as PIXI from 'pixi.js';
import { Game } from './core/Game';

// Wait for the DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // Create PIXI Application
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
    });

    // Add the canvas to the HTML document
    document.body.appendChild(app.view);

    // Initialize the game with the PIXI application
    const game = new Game(app);
}); 