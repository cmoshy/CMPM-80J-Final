//settings class
class Credits extends Phaser.Scene{
    constructor(){
        super('creditsScene')
    }

    create(){
        keyBegin = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)

        this.add.bitmapText(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'lemon-milk', 'Credits', 24).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 25 , 'lemon-milk', 'Created by CJ Moshy for CMPM 80j @UCSC', 16).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 50, 'lemon-milk', 'All assets made in house', 16).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 75, 'lemon-milk', 'Game built on Phaser3 framework', 16).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'lemon-milk', 'Press (Z) to return to menu', 16).setOrigin(0.5)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyBegin)){
            this.scene.start('menuScene')
        }
    }
}