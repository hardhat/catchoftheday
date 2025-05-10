//import 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;

class StylizedTextBox extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, width, height) {
        super(scene, x, y);
        
        // Colors matching the UI theme
        const colors = {
            brass: 0xc6912b,
            brassHighlight: 0xe7b355,
            brassShadow: 0x8b5e15,
            background: 0x463829,
            backgroundLight: 0x5a493a
        };

        // Create background
        const background = scene.add.graphics();
        background.fillStyle(colors.background);
        background.lineStyle(3, colors.brass);
        
        // Draw main background with rounded corners
        background.fillRoundedRect(0, 0, width, height, 8);
        
        // Add brass border with beveled effect
        background.lineStyle(2, colors.brassShadow);
        background.strokeRoundedRect(1, 1, width-2, height-2, 8);
        background.lineStyle(2, colors.brassHighlight);
        background.strokeRoundedRect(0, 0, width, height, 8);
        
        // Add highlight at top
        const highlight = scene.add.graphics();
        highlight.lineStyle(1, colors.backgroundLight);
        highlight.beginPath();
        highlight.moveTo(8, 3);
        highlight.lineTo(width-8, 3);
        highlight.strokePath();

        // Add text
        const textObject = scene.add.text(width/2, height/2, text, {
            fontFamily: 'MedievalSharp',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        });
        textObject.setOrigin(0.5);

        this.add([background, highlight, textObject]);
        scene.add.existing(this);
    }
}

// For dynamic width based on text
function createDynamicBox(scene, x, y, text) {
    const tempText = scene.add.text(0, 0, text, {
        fontFamily: 'MedievalSharp',
        fontSize: '24px'
    });
    const width = tempText.width + 40; // padding
    const height = tempText.height + 20; // padding
    tempText.destroy();
    
    return new StylizedTextBox(scene, x, y, text, width, height);
}

function preload() {
    // Load tileset image first
    this.load.image('PathAndObjects', 'data/PathAndObjects.png');
    this.load.image('town', 'data/town.png');
    this.load.image('Castle2', 'data/Castle2.png');
    
    // Load the tilemap
    this.load.tilemapTiledJSON('map', 'data/world.tmj');
    
    // Load the character spritesheet
    this.load.spritesheet('character', 
        'data/chpepper1squirePNG.png',
        { frameWidth: 32, frameHeight: 32 }
    );
}

function create() {
    // Create the tilemap
    const map = this.make.tilemap({ key: 'map' });
    
    // Add tileset - IMPORTANT: first parameter must match the tileset name in Tiled file
    // Second parameter must match the key used in this.load.image()
    const tileset = map.addTilesetImage('pathandobjects', 'PathAndObjects');
    const tileset2 = map.addTilesetImage('town', 'town');
    const tileset3 = map.addTilesetImage('castle2', 'Castle2');
    if (!tileset) {
        console.error('Failed to load tileset');
        return;
    }
    const tilesets = [tileset, tileset2, tileset3];
    
    // Create layers
    try {
        const scaleFactor = 2
        const groundLayer = map.createLayer('ground', tilesets, 0, 0);
        const buildingLayer = map.createLayer('building', tilesets, 0, 0);
        const objectsLayer = map.createLayer('objects', tilesets, 0, 0);
        
        // Scale the layer to double the size
        groundLayer.setScale(scaleFactor);
        buildingLayer.setScale(scaleFactor);
        objectsLayer.setScale(scaleFactor);        
        
        // Set collisions for objects layer
        objectsLayer.setCollisionByProperty({ collides: true });
        // objectsLayer.setCollisionBetween(1, 256, true, 'objects');
        
        // Debug visualization of collision tiles
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // objectsLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });
        
        // Create player sprite
        player = this.physics.add.sprite(100, 100, 'character');
        player.setScale(scaleFactor, scaleFactor);
        player.setCollideWorldBounds(true);
        player.setDepth(10); // Set depth to be above the map layers
        
        // Set world bounds
        this.physics.world.bounds.width = map.widthInPixels * scaleFactor;
        this.physics.world.bounds.height = map.heightInPixels * scaleFactor;
        
        // Add collision between player and objects layer
        this.physics.add.collider(player, objectsLayer);
        
        // Camera setup
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels * scaleFactor, map.heightInPixels * scaleFactor);
        
        // Create animations
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
        
        // Set up keyboard input
        cursors = this.input.keyboard.createCursorKeys();

        // Add stylized text box
        const inventoryBox = new StylizedTextBox(this, 400, 10, 'Collected item "lasagna"', 300, 50);

        // For longer text or multiple lines
        const longText = new StylizedTextBox(this, 400, 70, 'Inventory\nItems', 200, 80);
        
    } catch (error) {
        console.error('Error creating map:', error);
    }
}

function update() {
    const speed = 160;
    
    // Reset player velocity
    player.setVelocity(0);
    
    // Handle movement
    if (cursors.left.isDown && cursors.up.isDown) {
        player.setVelocity(-speed, -speed);
        player.anims.play('walk-left', true);
    }
    else if (cursors.left.isDown && cursors.down.isDown) {
        player.setVelocity(-speed, speed);
        player.anims.play('walk-left', true);
    }
    else if (cursors.right.isDown && cursors.up.isDown) {
        player.setVelocity(speed, -speed);
        player.anims.play('walk-right', true);
    }
    else if (cursors.right.isDown && cursors.down.isDown) {
        player.setVelocity(speed, speed);
        player.anims.play('walk-right', true);
    }
    else if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.anims.play('walk-left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('walk-right', true);
    }
    else if (cursors.up.isDown) {
        player.setVelocityY(-speed);
        player.anims.play('walk-up', true);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(speed);
        player.anims.play('walk-down', true);
    }
    else if (!cursors.left.isDown && !cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown) {
        player.anims.stop();
    }
    // If the player is stopped, wait 0.5s, then make a yellow particle effect behind the player until the player moves again
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        if (!player.isStopped) {
            player.isStopped = false;
            setTimeout(() => {
                player.isStopped = true;
            }, 15000);
        }
    } else {
        player.isStopped = false;
        player.emitter?.destroy(); // Destroy the emitter if it exists
        player.emitter = null; // Reset the emitter reference
    }
    // If the player is stopped, create a yellow particle effect behind the player
    if (player.isStopped && player.emitter === null) {
        // Create a yellow circle texture for particles
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffff00, 1);
        graphics.fillCircle(5, 5, 5);
        graphics.generateTexture('yellowParticle', 10, 10);
        graphics.destroy();

        player.emitter = this.add.particles(0, 0, 'yellowParticle', {
            angle: { min: 0, max: 360 },
            speed: { min: 50, max: 100 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 2,
            follow: player,
            depth: 8
        });
    }
}