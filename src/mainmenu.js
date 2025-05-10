// Main menu goes here.
import StylizedTextBox from "./stylizedtextbox.js";
// Options from main menu: play, about (shows credits) as buttons.

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });

        this.gamemode = false;
    }

    preload() {
        // Add a loading text using a web-safe font first
        const loadingText = this.add.text(400, 300, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Load the font
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.image('goatonapole', 'data/goatonapole.jpg');
        this.load.image('tojam2025', 'data/tojam2025.png');
    }

    create() {
        // Use WebFontLoader to ensure font is loaded
        WebFont.load({
            google: {
                families: ['MedievalSharp']
            },
            active: () => {
                // Font is loaded, now create your text
                this.createMenuText();
            }
        });
    }

    createMenuText() {
        const box = new StylizedTextBox(this, 50, 50, '', 700, 500);
        this.createFancyText(200, 75, 'Catch of the Day', 48);
        const playButton = this.createFancyText(400, 200, ' Play ', 32)
            .setStyle({backgroundColor: 0x463829})
            .setInteractive()
            .on('pointerdown', () => {
            this.gamemode = true;
            this.scene.start('GameScene', { gamemode: this.gamemode });
            })
            .on('pointerover', () => {
            playButton.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
            playButton.setStyle({ backgroundColor: 0x463829 });
            });

        const aboutButton = this.createFancyText(400, 300, ' About ', 32)
            .setStyle({backgroundColor: 0x463829})
            .setInteractive()
            .on('pointerdown', () => {
            this.scene.start('AboutScene');
            })
            .on('pointerover', () => {
            aboutButton.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
            aboutButton.setStyle({ backgroundColor: 0x463829 });
            });
        
        this.add.image(200, 250, 'goatonapole').setScale(0.5);
        this.add.image(400, 450, 'tojam2025').setScale(0.5);
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

    update() {
        // Update the main menu if needed
    }
}
