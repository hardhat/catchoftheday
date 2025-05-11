import StylizedTextBox from "./stylizedtextbox.js";

export default class EscapeScene extends Phaser.Scene {
    constructor() {
        super('EscapeScene');
    }

    create() {
        // Add map background, scaled 2x
        const map = this.add.image(400, 300, 'map')
            .setScale(2);

        // Add reset button
        const resetButton = this.add.text(700, 50, 'Reset Game', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerup', () => {
            this.scene.start('MainMenu');
        });

        // Create boat (blue circle)
        const boat = this.add.circle(274*2, 128*2, 5, 0x0000ff);

        // Create timeline for boat movement
        const timeline = this.tweens.timeline({
            targets: boat,
            loop: false,
            tweens: [
                {
                    x: 276*2,
                    y: 80*2,
                    duration: 5000,
                    ease: 'Linear'
                },
                {
                    x: 135*2,
                    y: 80*2,
                    duration: 5000,
                    ease: 'Linear'
                },
                {
                    x: 103*2,
                    y: 130*2,
                    duration: 5000,
                    ease: 'Linear'
                }
            ]
        });
        timeline.play();
        // Add a text box with "you escaped!" message
        const textBox = new StylizedTextBox(this, 50, 50, 'You escaped!', 700, 500);
        textBox.setVisible(false); // Hide it initially

        // Show the text box when the boat reaches the last point
        timeline.on('complete', () => {
            textBox.setVisible(true);
            this.time.delayedCall(2000, () => {
                textBox.setVisible(false);
            }, [], this);
        });
    }
}