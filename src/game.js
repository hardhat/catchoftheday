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

function preload() {
    // Load tileset image first
    this.load.image('PathAndObjects', 'data/PathAndObjects.png');
    
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
    
    if (!tileset) {
        console.error('Failed to load tileset');
        return;
    }
    
    // Create layers
    try {
        const groundLayer = map.createLayer('ground', tileset, 0, 0);
        const objectsLayer = map.createLayer('objects', tileset, 0, 0);
        
        // Set collisions for objects layer
        objectsLayer.setCollisionByProperty({ collides: true });
        
        // Create player sprite
        player = this.physics.add.sprite(100, 100, 'character');
        player.setCollideWorldBounds(true);
        
        // Set world bounds
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        
        // Add collision between player and objects layer
        this.physics.add.collider(player, objectsLayer);
        
        // Camera setup
        this.cameras.main.startFollow(player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
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
        
    } catch (error) {
        console.error('Error creating map:', error);
    }
}

function update() {
    const speed = 160;
    
    // Reset player velocity
    player.setVelocity(0);
    
    // Handle movement
    if (cursors.left.isDown) {
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
    else {
        player.anims.stop();
    }
}