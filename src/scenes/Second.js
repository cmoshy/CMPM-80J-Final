class Second extends Phaser.Scene {
  
    constructor(){
        super("secondScene")
    }

    create(){ 
             
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        cursors = this.input.keyboard.createCursorKeys()


        //world
        this.physics.world.setBounds(0,0, game.config.width, game.config.height)

        //txt
        this.scoreLeft = this.add.bitmapText(game.config.width/2, borderPadding + borderUISize, 'lemon-milk', 'Score - ', 24).setOrigin(0.5).setDepth(3)
        this.menuText = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Press (X) to contine').setOrigin(0.5).setAlpha(0).setDepth(3)

        //win
        this.gameOver = false

        //object
        this.p1Tank = new Tank(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'star', 0)

        this.movingEmitter = this.add.particles(0, 0, 'star', {
            frequency: 15,
            speed: 75,
            scale: { start: 0.25, end: 0.5},
            alpha: { start: 1, end: 0 },
            // higher steps value = more time to go btwn min/max
            lifespan: { min: 1000, max: 1500, steps: 500}
        })
        // note: setting the emitter's initial position to 0, 0 seems critical to get .startFollow to work
        this.movingEmitter.startFollow(this.p1Tank, 0, 0, false) 

        this.shapes = {
            arr: [],
            count: 25,
            real: 25
        }

        for(let x = 0; x < this.shapes.count; x ++){
           this.shapes.arr.push(new Projectile(this, Phaser.Math.Between(10, game.config.width - 10),  Phaser.Math.Between(10, game.config.height - 100), 'triangle-'+Phaser.Math.Between(1,6).toString(), 0, 100, 200).setGravity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-10, 10)))
        }

        cursors.space.on('down', ()=>{
            if(!this.gameOver){
                let ran1 = Math.round(Math.random())
                ran1 === 0 ? ran1 = -1 : undefined
                let ran2 = Math.round(Math.random())
                ran2 === 0 ? ran2 = -1 : undefined
                let vec = new Phaser.Math.Vector2(ran1,ran2)
                vec.normalize()
                this.p1Tank.setVelocity(vec.x * Phaser.Math.Between(100, 300), vec.y * Phaser.Math.Between(100, 300))
            }
        })

        this.physics.add.collider(this.shapes.arr, this.p1Tank, (object, shape)=>{
            this.p1Tank.setTexture('star-' + object.name.charAt(object.name.length- 1).toString())
            this.movingEmitter.setTexture('star-' + object.name.charAt(object.name.length- 1).toString())
            this.cameras.main.shake(250, 0.005)
            this.p1Tank.points += 1
            object.destroy()
            this.shapes.real -= 1
            console.log(this.shapes.real)
        })

        this.time.delayedCall(5000, ()=>{
            this.add.tween({
                targets: this.menuText,
                alpha: {from: 0, to: 1},
                delay: 1500,
                duration: 2000,
            })
            this.gameOver = true   
        })
     
        
        //debug code
        /***************************************/
        let debugToggle = this.input.keyboard.addKey('H')
        this.physics.world.drawDebug = false
        debugToggle.on('down', ()=> {
            if(this.physics.world.drawDebug) {
                this.physics.world.drawDebug = false;
                this.physics.world.debugGraphic.clear();
            }else{
                this.physics.world.drawDebug = true;
  
            }
        })
        /********************************************/
    }

    update(){
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyStart)){ //go to next scene
            this.scene.start('thirdScene')
        }
        this.scoreLeft.text = 'Score - ' + this.p1Tank.points //fix
    }
}