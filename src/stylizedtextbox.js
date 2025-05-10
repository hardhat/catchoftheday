// StylizedTextBox.js
export default class StylizedTextBox extends Phaser.GameObjects.Container {
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
            fontSize: '16px',
            color: '#ffffff',
            align: 'center'
        });
        textObject.setOrigin(0.5);

        this.add([background, highlight, textObject]);
        scene.add.existing(this);
    }

    // For dynamic width based on text
    /**
     * Public static method to create a dynamic box.
     * Can be called without an instance of StylizedTextBox.
     */
    static createDynamicBox(scene, x, y, text) {
        const tempText = scene.add.text(0, 0, text, {
            fontFamily: 'MedievalSharp',
            fontSize: '24px'
        });
        const width = tempText.width + 40; // padding
        const height = tempText.height + 20; // padding
        tempText.destroy();
        
        return new StylizedTextBox(scene, x, y, text, width, height);
    }
}
