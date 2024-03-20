//settings class
class Settings extends Phaser.Scene{
    constructor(){
        super('settingsScene')
    }

    create(){
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Settings', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2, 'Press (Z) to toggle difficulty', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press (X) to return to menu', menuConfig).setOrigin(0.5)
       
        keySettings = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)

        this.difficulty = false // false easy, true hard, false default
        menuConfig.color = '#CCCC00'
        this.difficultyText = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*10, 'Hard Mode: ' + this.difficulty, menuConfig).setOrigin(0.5)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keySettings)){
            this.difficulty = !this.difficulty
            this.difficultyText.text = 'Hard Mode: '+ this.difficulty
        }
        if(Phaser.Input.Keyboard.JustDown(keyStart)){
            this.scene.start('menuScene', this.difficulty)
        }
    }
}