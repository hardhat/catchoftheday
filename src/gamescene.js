import StylizedTextBox from "./stylizedtextbox.js";
import Player from "./player.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.gamemode = data.gamemode;
    }

    preload() {
        this.load.image('PathAndObjects', 'data/PathAndObjects.png');
        this.load.image('town', 'data/town.png');
        this.load.image('Castle2', 'data/Castle2.png');
        this.load.image('icons', 'data/icons.png');
        this.load.tilemapTiledJSON('map', 'data/world.tmj');
        this.load.spritesheet('character', 'data/chpepper1squirePNG.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('pathandobjects', 'PathAndObjects');
        const tileset2 = map.addTilesetImage('town', 'town');
        const tileset3 = map.addTilesetImage('castle2', 'Castle2');
        const tileset4 = map.addTilesetImage('icons', 'icons');
        if (!tileset) {
            console.error('Failed to load tileset');
            return;
        }
        const tilesets = [tileset, tileset2, tileset3, tileset4];
        const scaleFactor = 2;
        const groundLayer = map.createLayer('ground', tilesets, 0, 0);
        const buildingLayer = map.createLayer('building', tilesets, 0, 0);
        const objectsLayer = map.createLayer('objects', tilesets, 0, 0);
        groundLayer.setScale(scaleFactor);
        buildingLayer.setScale(scaleFactor);
        objectsLayer.setScale(scaleFactor);
        objectsLayer.setCollisionByProperty({ collides: true });
        const areasLayer = map.getObjectLayer('areas');

        this.player = this.physics.add.sprite(890*2, 320*2, 'character');
        this.player.actor = new Player({scene:this, x:100, y:100, sprite:this.player, health:null});
        this.player.actor.setObjectsLayer(objectsLayer);
        this.player.setScale(scaleFactor, scaleFactor);
        this.player.body.setSize(20, 20);
        this.player.body.setOffset(6.5, 10);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels * scaleFactor;
        this.physics.world.bounds.height = map.heightInPixels * scaleFactor;
        this.physics.add.collider(this.player, objectsLayer);
        if (areasLayer) {
            // Add collision for rectangles in areas layer
            areasLayer.objects.forEach(object => {
                if (object.rectangle) {
                    const rect = this.add.rectangle(object.x * scaleFactor, object.y * scaleFactor, object.width * scaleFactor, object.height * scaleFactor);
                    this.physics.add.existing(rect, true);
                    this.physics.add.collider(this.player, rect);
                }
                // Store boat point location
                if (object.point && object.name === 'boat') {
                    this.boatLocation = { x: object.x * scaleFactor, y: object.y * scaleFactor };
                }
                // Store start point location
                if (object.point && object.name === 'start') {
                    this.startLocation = { x: object.x * scaleFactor, y: object.y * scaleFactor };
                }
            });
        }

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * scaleFactor, map.heightInPixels * scaleFactor);

        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('character', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('character', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('character', { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        //const inventoryBox = new StylizedTextBox(this, 400, 10, 'Collected item "lasagna"', 300, 50);
        //const longText = new StylizedTextBox(this, 400, 70, 'Inventory\nItems', 200, 80);

        this.events.on('itemCollected', (data) => {
            console.log(`${data.item} collected! Total: ${data.count}`);
            // Update UI or trigger other events
        });

        this.events.on('boatCollision', (tile) => {
            console.log('Boat collision detected!');

            var neededItems = ['outboard motor', 'keys', 'sparkplug', 'fuel'];
            // Check if the player has all needed items
            var missingItems = neededItems.filter(item => !this.player.actor.inventory[item]);
            if (missingItems.length > 0) {
                console.log('Missing items:', missingItems.join(', '));
                // Show a message to the player about missing items
                const overlayText = StylizedTextBox.createDynamicBox(this, 50, 50, 'You need to find the following items to escape:\n' +
                    missingItems.join('\n') + '\n' +
                    'Find them in the village.\n\n' +
                    'Dismiss this dialog with space.\n'
                ).setDepth(1000);
                this.input.keyboard.once('keydown-SPACE', () => {
                    if (overlayText) {
                        overlayText.destroy();
                        overlayText = null;
                    }
                });
            } else {
                console.log('All needed items collected!');
                // Proceed with the escape logic
                const overlayText = StylizedTextBox.createDynamicBox(this, 50, 50, 'You have all the items to escape!\n\n' +
                    'Press space to escape.\n'
                ).setDepth(1000);
                this.input.keyboard.once('keydown-SPACE', () => {
                    if (overlayText) {
                        overlayText.destroy();
                        overlayText = null;
                    }
                    // Start the next scene or logic for escaping
                    this.scene.start('EscapeScene', { gamemode: this.gamemode });
                });
            }
        });

        // Create a HUD container that stays fixed on screen
        const resetButton = this.createFancyText(650, 550, ' Reset Game ', 24)
            .setStyle({backgroundColor: 0x463829})
            .setInteractive()
            .setScrollFactor(0) // This makes it stay fixed on screen
            .setDepth(1000) // Set depth to ensure it appears above other elements
            .on('pointerdown', () => {
            this.scene.start('MainMenu', { gamemode: this.gamemode });
            })
            .on('pointerover', () => {
            resetButton.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
            resetButton.setStyle({ backgroundColor: 0x463829 });
            });

        this.objectiveText = this.createText(50, 550, 'Objective: Escape the abandoned fishing village!', 16)
            .setStyle({backgroundColor: 0x463829})
            .setInteractive()
            .setScrollFactor(0) // This makes it stay fixed on screen
            .on('pointerover', () => {
            this.objectiveText.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
            this.objectiveText.setStyle({ backgroundColor: 0x463829 });
            });
        this.objectiveText.setDepth(1000);

        this.overlayText = StylizedTextBox.createDynamicBox(this, 50, 50, 'Where am I? What happened?\n' +
            'I need to find a way out of this place.\n' +
            'I should look for a boat.\n\n' +
            'I can use the arrow keys to move around.\n' +
            'I can interact with objects by pressing the space bar.\n' +
            'I can collect items by clicking on them.\n\n' +
            'Dismiss this dialog with space.\n'
        ).setDepth(1000);

        // Add space key handler
        this.input.keyboard.once('keydown-SPACE', () => {
            if (this.overlayText) {
            this.overlayText.destroy();
            this.overlayText = null;
            }
        });
    }

    createFancyText(x, y, message, size) {
        const text = this.add.text(x, y, message, { fontFamily: 'MedievalSharp', fontSize: size });
        text.setDepth(100);
        text.setStroke('#000000', 4);
        //  Apply the gradient fill.
        const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(.5, '#ffff80');
        gradient.addColorStop(.5, '#aaaa44');
        gradient.addColorStop(1, '#111111');

        text.setFill(gradient);
        
        return text;
    }
    
    createText(x, y, message, size) {
        const text = this.add.text(x, y, message, { fontFamily: 'MedievalSharp', fontSize: size });
        text.setDepth(100);
        text.setStroke('#000000', 4);
        text.setFill('#ffff80');
        
        return text;
    }

    update() {
        this.player.actor.update();
        const speed = 160;
        this.player.setVelocity(0);

        if (this.cursors.left.isDown && this.cursors.up.isDown) {
            this.player.setVelocity(-speed, -speed);
            this.player.anims.play('walk-left', true);
        } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
            this.player.setVelocity(-speed, speed);
            this.player.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
            this.player.setVelocity(speed, -speed);
            this.player.anims.play('walk-right', true);
        } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
            this.player.setVelocity(speed, speed);
            this.player.anims.play('walk-right', true);
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play('walk-down', true);
        } else if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.player.anims.stop();
        }

        if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
            if (!this.player.isStopped) {
                this.player.isStopped = true;
                this.player.stoppedTime = Date.now();
            }
        } else {
            this.player.isStopped = false;
            this.player.emitter?.destroy();
            this.player.emitter = null;
        }

        if (this.player.isStopped && this.player.stoppedTime + 15000 < Date.now() && this.player.emitter === null) {
            const graphics = this.add.graphics();
            graphics.fillStyle(0xffff00, 1);
            graphics.fillCircle(5, 5, 5);
            graphics.generateTexture('yellowParticle', 10, 10);
            graphics.destroy();

            this.player.emitter = this.add.particles(0, 0, 'yellowParticle', {
                angle: { min: 0, max: 360 },
                speed: { min: 50, max: 100 },
                scale: { start: 0.5, end: 0 },
                blendMode: 'ADD',
                lifespan: 1000,
                quantity: 2,
                follow: this.player,
                depth: 8
            });
        }
    }
}