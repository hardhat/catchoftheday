import StylizedTextBox from "./stylizedtextbox.js";

export default class EscapeScene extends Phaser.Scene {
    constructor() {
        super('EscapeScene');
    }

    preload() {
        // Load the map image for the escape sequence
        this.load.image('map', 'data/map.png');
    }

    create() {
        // Add map background, scaled 2x
        const map = this.add.image(400, 300, 'map')
            .setScale(2);

        // Add reset button
        const resetButton = this.createFancyText(650, 50, ' Reset Game ', 24)
            .setStyle({backgroundColor: 0x463829})
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainMenu');
            })
            .on('pointerover', () => {
                resetButton.setStyle({ backgroundColor: '#ffff80' });
            })
            .on('pointerout', () => {
                resetButton.setStyle({ backgroundColor: 0x463829 });
            });

        // Create boat (blue circle)
        const boat = this.add.circle(274*2, 128*2, 5, 0x0000ff);

        // Add a text box with "you escaped!" message
        const textBox = new StylizedTextBox(this, 200, 200, 'You escaped!', 400, 200);
        textBox.setVisible(false);

        // Chain three tweens for boat movement
        this.tweens.add({
            targets: boat,
            x: 276*2,
            y: 80*2,
            duration: 5000,
            ease: 'Linear',
            onComplete: () => {
                this.tweens.add({
                    targets: boat,
                    x: 135*2,
                    y: 80*2,
                    duration: 5000,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: boat,
                            x: 103*2,
                            y: 130*2,
                            duration: 5000,
                            ease: 'Linear',
                            onComplete: () => {
                                // Show completion message
                                textBox.setVisible(true);
                                this.time.delayedCall(4000, () => {
                                    textBox.setVisible(false);
                                    this.scene.start('MainMenu');
                                }, [], this);
                            }
                        });
                    }
                });
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
}