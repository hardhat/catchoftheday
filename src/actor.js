// Actor class generically draws the state of a player/npc.

// Options from main menu: play, about (shows credits) as buttons.

export default class Actor {
    constructor ({scene,sprite,x,y,health}) {
        //super(scene, sprite, x, y);

        this.scene = scene;
        this.sprite = sprite;
        this.health=health;
        this.maxHealth=health;

        //this.scene.physics.arcade.enable(this);
        this.lastPos={x,y};
        this.diff={x:0, y:0};
        // this.attacks = this.game.add.group();
        // this.attacks.enableBody = true;
        // this.attackSpeed = 500;
    }
	
    convertWorldToTile(x, y) {
        // Convert world coordinates to tile coordinates
        const tileX = Math.floor(x / this.scene.map.tileWidth);
        const tileY = Math.floor(y / this.scene.map.tileHeight);
        return { tileX, tileY };
    }

    update()
    {
        // Animation events both the player sprite and any attack particle event. 
    }
}