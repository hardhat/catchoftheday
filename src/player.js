import Actor from './actor.js';

export default class Player extends Actor {
    constructor({ scene, sprite, x, y, health }) {
        super({ scene, sprite, x, y, health });

        this.inventory = {};
        this.itemCount = 0;
        this.objectsLayer = null;

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

    setObjectsLayer(layer) {
        this.objectsLayer = layer;
        // Set the collision layer for the player
        this.scene.physics.add.collider(this.sprite, layer, (player, tile) => {
            // Handle collision with the tile
            //console.log('Collision with tile:', tile);
            if (tile.properties && tile.properties.collectable) {
            this.interactWithTile(tile);
            }
        });
    }

    // getFacingTile() {
    //     if (!this.objectsLayer) return null;

    //     const facing = this.getFacingDirection();
    //     const playerPos = this.convertWorldToTile(this.sprite.x, this.sprite.y);
    //     const tileX = playerPos.tileX + (facing.x / 32);
    //     const tileY = playerPos.tileY + (facing.y / 32);

    //     return this.objectsLayer.getTileAt(tileX, tileY);
    // }

    interactWithTile(tile) {
        if (!tile || !tile.properties || !tile.properties.collectable) {
            console.log("This tile is not collectable.");
            return;
        }

        // Show the collect button near the player
        this.currentTile = tile;
        this.collectButton.setPosition(this.sprite.x + 20, this.sprite.y - 20);
        this.collectButton.setVisible(true);
        //console.log("Press the collect button to collect the item.");
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

        // Remove the tile from the map using Phaser's proper callback method
        this.objectsLayer.removeTileAt(tile.x, tile.y).destroy();
        
        // Emit a custom event that can be listened to by the game scene
        this.scene.events.emit('itemCollected', {
            item: itemName,
            count: this.inventory[itemName],
            totalItems: this.itemCount
        });

        // Clear the current tile reference
        this.currentTile = null;
    }

    convertWorldToTile(x, y) {
        // Convert world coordinates to tile coordinates using the layer's tile size
        const tileX = Math.floor(x / (32 * this.scene.cameras.main.zoom));
        const tileY = Math.floor(y / (32 * this.scene.cameras.main.zoom));
        return { tileX, tileY };
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

        // // Add an overlap check to the update method
        // if (this.currentTile) {
        //     const tileWorldX = this.currentTile.x * 32 * this.scene.cameras.main.zoom;
        //     const tileWorldY = this.currentTile.y * 32 * this.scene.cameras.main.zoom;
        //     const isOverlapping = this.scene.physics.world.overlap(
        //         this.sprite,
        //         { x: tileWorldX, y: tileWorldY, width: 32, height: 32 }
        //     );
        //     if (!isOverlapping) {
        //         this.currentTile = null;
        //     }
        // }

        // Hide the collect button if not interacting with a tile
        if (!this.currentTile) {
            this.collectButton.setVisible(false);
        }
    }
}