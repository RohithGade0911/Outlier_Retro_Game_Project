import * as PIXI from 'pixi.js';

export class AssetManager {
    constructor(app) {
        this.app = app;
        this.loader = PIXI.Assets;
        this.loadedAssets = new Map();
    }

    async loadAssets(assets, onProgress) {
        try {
            // Create a map of asset names to their URLs
            const assetMap = {};
            assets.forEach(asset => {
                assetMap[asset.name] = asset.url;
            });

            // Load all assets
            await this.loader.init({
                basePath: '/'
            });

            // Load each asset individually to track progress
            const totalAssets = assets.length;
            let loadedAssets = 0;

            for (const asset of assets) {
                try {
                    const loadedAsset = await this.loader.load(asset.url);
                    this.loadedAssets.set(asset.name, loadedAsset);
                    loadedAssets++;
                    
                    // Call progress callback if provided
                    if (typeof onProgress === 'function') {
                        onProgress(loadedAssets / totalAssets);
                    }
                } catch (error) {
                    console.error(`Error loading asset ${asset.name}:`, error);
                }
            }

            return this.loadedAssets;
        } catch (error) {
            console.error('Error loading assets:', error);
            throw error;
        }
    }

    getAsset(name) {
        return this.loadedAssets.get(name);
    }
} 