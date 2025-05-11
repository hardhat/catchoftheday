// Main menu goes here.
import StylizedTextBox from "./stylizedtextbox.js";
import AboutGroup from "./aboutgroup.js";
// Options from main menu: play, about (shows credits) as buttons.

export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });

        this.gamemode = false;
    }

    preload() {
        // Add a loading text using a web-safe font first
        this.loadingText = this.add.text(400, 300, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Load the font
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.load.image('goatonapole', 'data/goatonapole.jpg');
        this.load.image('tojam2025', 'data/tojam2025.png');
        this.load.image('title_screen', 'data/title_screen.png');
        // load the menu_music
        this.load.audio('menu_music', 'data/menu_theme.mp3');
    }

    create() {
        // Use WebFontLoader to ensure font is loaded
        WebFont.load({
            google: {
                families: ['MedievalSharp']
            },
            active: () => {
                // Font is loaded, now create your text
                this.loadingText.destroy(); // Remove the loading text
                this.createMenuText();
                this.title_screen = this.add.image(400, 300, 'title_screen').setDepth(1000);
                // If the title_screen is clicked, start the music and remove the title_screen
                this.title_screen.setInteractive()
                    .on('pointerdown', () => {
                        this.title_screen.destroy();
                        this.music = this.sound.add('menu_music', { loop: true });
                        this.music.play();
                    })
                    .on('pointerover', () => {
                        this.title_screen.setScale(1.05);
                    })
                    .on('pointerout', () => {
                        this.title_screen.setScale(1);
                    });
        
            }
        });
        this.musicPlaying = false;
        this.music = null;

    }

    createMenuText() {
        const box = new StylizedTextBox(this, 50, 50, '', 700, 500);
        this.createFancyText(200, 75, 'Catch of the Day', 48);
        const playButton = this.createFancyText(400, 200, ' Play ', 32)
            .setStyle({backgroundColor: 0x463829})
            .setInteractive()
            .on('pointerdown', () => {
            this.gamemode = true;
            this.music.stop();
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
                // Show the about group
                this.aboutGroup  = new AboutGroup(this);
                this.aboutGroup.create();
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
        // Update logic for the main menu can go here if needed
        // For example, you could check for key presses to start the game or show credits
    }
}
