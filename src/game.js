//import 'phaser';

import StylizedTextBox from "./stylizedtextbox.js";
import MainMenu from "./mainmenu.js";
import GameScene from "./gamescene.js";
import AboutScene from "./aboutscene.js";

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
    // scene: {
    //     preload: preload,
    //     create: create,
    //     update: update
    // }
    scene: [MainMenu, GameScene, AboutScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
};

const game = new Phaser.Game(config);
