//menu scene for game
let menuConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    color: '#00FF00',
    alight: 'right',
    padding : {top: 5, bottom: 5},
    fixedWidth: 0
}

class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene")
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('star', 'star.png')
        this.load.image('triangle-1', 'triangle-1.png')
        this.load.image('triangle-2', 'triangle-2.png')
        this.load.image('triangle-3', 'triangle-3.png')
        this.load.image('triangle-4', 'triangle-4.png')
        this.load.image('triangle-5', 'triangle-5.png')
        this.load.image('triangle-6', 'triangle-6.png')
        this.load.image('star-1', 'star-1.png')
        this.load.image('star-2', 'star-2.png')
        this.load.image('star-3', 'star-3.png')
        this.load.image('star-4', 'star-4.png')
        this.load.image('star-5', 'star-5.png')
        this.load.image('star-6', 'star-6.png')
        this.load.image('writing-box', 'writing-box.png')

        this.load.path = './assets/font/'
        this.load.bitmapFont('lemon-milk', 'LemonMilk.png', 'LemonMilk.xml')
        this.load.bitmapFont('lemon-milkB', 'LemonMilkB.png', 'LemonMilkB.xml')

        this.load.path = './assets/json/'
        this.load.json('writing', 'writing.json')

    }
    
    create(){
        menuConfig.color = '#00FF00'

        this.add.bitmapText(game.config.width/2, game.config.height/2, 'lemon-milk', 'Building Games that Attract Players', 24).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2+ 50, 'lemon-milk', 'examining the use of agency and immersion to create games and products that excite', 12).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 150, 'lemon-milk', 'Press (Z) to begin', 16).setOrigin(0.5)
        this.add.bitmapText(game.config.width/2, game.config.height/2 + 175, 'lemon-milk', 'Press (C) for credits', 16).setOrigin(0.5)
      
  
        keyBegin = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)
        keyCredits = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(keyCredits)){
            this.scene.start('creditsScene')
        }
        if(Phaser.Input.Keyboard.JustDown(keyBegin)){
            console.log('here')
            this.scene.start('firstScene')
            this.scene.launch('writerScene')
            this.scene.bringToTop('writerScene')
        }
    }
}