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
        const boat = this.add.circle(274, 128, 5, 0x0000ff);

        // Create timeline for boat movement
        const timeline = this.tweens.timeline({
            targets: boat,
            loop: false,
            tweens: [
                {
                    x: 276,
                    y: 80,
                    duration: 5000,
                    ease: 'Linear'
                },
                {
                    x: 135,
                    y: 80,
                    duration: 5000,
                    ease: 'Linear'
                },
                {
                    x: 103,
                    y: 130,
                    duration: 5000,
                    ease: 'Linear'
                }
            ]
        });
    }
}