//entry point for game
//

//set Phaser config...
let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    }, 
    scene: [Menu, Settings, First, Second, Third, Play]
}

//phaser init
let game = new Phaser.Game(config)

//UI ? (to ensure it fits on computers?)
let borderUISize = game.config.height / 15 //32
let borderPadding = borderUISize / 3 //10.667

//keybindings
let keyNext, keyStart, keySettings, cursors

