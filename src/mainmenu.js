// Main menu goes here.
import StylizedTextBox from "./stylizedtextbox.js";
// Options from main menu: play, about (shows credits) as buttons.

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');

        this.gamemode = false;
    }

    preload() {
        //this.load.image('mainmenu', 'assets/mainmenu.png');
        //this.load.image('play', 'assets/play.png');
        //this.load.image('about', 'assets/about.png');
        //this.load.image('exit', 'assets/exit.png');
        this.load.image('goatonapole', 'data/goatonapole.jpg');
        this.load.image('tojam2025', 'data/tojam2025.png');
    }

    create() {
        const box = new StylizedTextBox(this, 50, 50, '', 700, 500);
        this.createFancyText(200, 75, 'Catch of the Day', 48);
        const playButton = this.createFancyText(400, 200, ' Play ', 32)
            .setStyle({backgroundColor: '0x463829'})
            .setInteractive()
            .on('pointerdown', () => {
            this.gamemode = true;
            this.scene.start('GameScene', { gamemode: this.gamemode });
            })
            .on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
            playButton.setStyle({ backgroundColor: '0x463829' });
            });

        const aboutButton = this.createFancyText(400, 300, ' About ', 32)
            .setStyle({backgroundColor: '0x463829'})
            .setInteractive()
            .on('pointerdown', () => {
            this.scene.start('AboutScene');
            })
            .on('pointerover', () => {
            aboutButton.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
            aboutButton.setStyle({ backgroundColor: '0x463829' });
            });
        
        this.add.image(200, 250, 'goatonapole').setScale(0.5);
        this.add.image(400, 450, 'tojam2025').setScale(0.5);
        // this.add.image(0, 0, 'mainmenu').setOrigin(0, 0).setScale(1.5);
        // this.add.image(400, 300, 'play').setOrigin(0.5, 0.5).setScale(1.5).setInteractive().on('pointerdown', () => {
        //     this.gamemode = true;
        //     this.scene.start('GameScene', { gamemode: this.gamemode });
        // });
        // this.add.image(400, 400, 'about').setOrigin(0.5, 0.5).setScale(1.5).setInteractive().on('pointerdown', () => {
        //     this.scene.start('AboutScene');
        // });
        // this.add.image(400, 500, 'exit').setOrigin(0.5, 0.5).setScale(1.5).setInteractive().on('pointerdown', () => {
        //     this.game.destroy(true);
        // });
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
        // text.setShadow(2, 2, shadowColor, true, false, '10px Arial');
        // text.setShadow(0, 0, highlightColor, true, false, '10px Arial');
        // text.setShadow(0, 0, shadowHighlightColor, true, false, '10px Arial');
        // text.setStroke(strokeColor, 4);

        text.setFill(gradient);
        
        return text;
    }

    update() {
        // Update the main menu if needed
    }
}
