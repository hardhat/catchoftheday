import StylizedTextBox from "./stylizedtextbox.js";

export default class AboutGroup extends Phaser.GameObjects.Group {
    constructor(scene) {
        super('AboutScene');
        this.scene = scene;
        this.scene.add.existing(this);
    }

    preload() {
        // Load any assets needed for the About scene
    }

    create() {
        const text = "Catch of the Day\n\n" +
            "A game by Team Sushi\n\n" +
            "Version 1.0\n\n" +
            "Just what did you do last night anyway?  Here you are on the dock of an abandoned\n" +
            "fishing village fishing village with just the clothes on your back. \n" +
            "Even your pockets are empty.\n\n" +
            "Surely you came from somewhere.  Surely you belong somewhere.  And it definitely\n" + 
            "isn't here.  Maybe it wasn't abandoned all that long ago.  There are certainly plenty\n" +
            "of things around.  But you get the strange feeling that the more items you gather\n" +
            "the worse it is.  But you do need those things for your escape right?\n\n" +
            "Controls:\n" +
            "- Arrow keys to move\n" +
            "- Space to interact\n\n" +
            "Thank you for playing!";

        const width = 700;
        const height = 500;

        // Create a stylized text box
        const aboutBox = new StylizedTextBox(this.scene, 50, 50, text, width, height).setDepth(1000);

        
        // Add a back button
        const backButton = this.scene.add.text(this.scene.cameras.main.centerX, this.scene.cameras.main.centerY + height / 2 + 20, 'Back', { fontSize: '24px', fill: '#fff' })
            .setDepth(1000)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                aboutBox.destroy(); // Destroy the AboutBox
                backButton.destroy(); // Destroy the Back button
                this.scene.aboutGroup.destroy(); // Destroy the AboutGroup
            });
    }
    
    update() {
        // Update the About scene if needed
    }
}