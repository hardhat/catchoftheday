import Actor from './actor.js';

export default class Player extends Actor {
    constructor({ scene, sprite, x, y, health }) {
        super({ scene, sprite, x, y, health });

        this.inventory = {};
        this.itemCount = 0;

        // Create a button for interaction (hidden by default)
        this.collectButton = this.scene.add.text(0, 0, 'Collect', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 },
        }).setInteractive().setVisible(false);

        this.collectButton.on('pointerdown', () => {
            if (this.currentTile) {
                this.collectItem(this.currentTile);
                this.collectButton.setVisible(false);
            }
        });
    }

    interactWithTile(tile) {
        if (!tile || !tile.properties.isCollectable) {
            console.log("This tile is not collectable.");
            return;
        }

        // Show the collect button near the player
        this.currentTile = tile;
        this.collectButton.setPosition(this.sprite.x + 20, this.sprite.y - 20);
        this.collectButton.setVisible(true);
    }

    collectItem(tile) {
        const itemName = tile.properties.name || 'Unknown Item';

        // Add the item to the inventory
        if (!this.inventory[itemName]) {
            this.inventory[itemName] = 0;
        }
        this.inventory[itemName]++;
        this.itemCount++;

        console.log(`${itemName} collected! Total: ${this.inventory[itemName]}`);

        // Remove the tile from the map
        tile.index = -1; // Set the tile index to -1 to remove it
        this.scene.map.removeTileAt(tile.x, tile.y, true, true, this.scene.objectsLayer);

        // Clear the current tile reference
        this.currentTile = null;
    }
    
    convertWorldToTile(x, y) {
        // Convert world coordinates to tile coordinates
        const tileX = Math.floor(x / 32);
        const tileY = Math.floor(y / 32);
        return { tileX, tileY };
    }
    
    getFacingTile() {
        const direction = this.getFacingDirection();
        const { tileX, tileY } = this.convertWorldToTile(
            this.sprite.x + direction.x,
            this.sprite.y + direction.y
        );
        return this.scene.map.getTileAt(tileX, tileY, true, this.scene.objectsLayer);
    }

    getFacingDirection() {
        // Determine the direction the player is facing based on velocity
        if (this.sprite.body.velocity.x < 0) return { x: -32, y: 0 }; // Left
        if (this.sprite.body.velocity.x > 0) return { x: 32, y: 0 };  // Right
        if (this.sprite.body.velocity.y < 0) return { x: 0, y: -32 }; // Up
        if (this.sprite.body.velocity.y > 0) return { x: 0, y: 32 };  // Down
        return { x: 0, y: 0 }; // No movement
    }

    update() {
        super.update();

        // Check for interaction key press
        if (this.scene.input.keyboard.checkDown(this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), 250)) {
        const facingTile = this.getFacingTile();
        this.interactWithTile(facingTile);
        }
    }
}