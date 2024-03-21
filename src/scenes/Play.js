//Play.js
//main gamestate scene

class Play extends Phaser.Scene {
  
    constructor(){
        super("playScene")
    }

    create(){ 

        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        cursors = this.input.keyboard.createCursorKeys()
        
        this.collectTypes = Object.freeze({
            1: 'blue',
            2: 'pink',
            3: 'green',
            4: 'red',
            5: 'orange',
            6: 'yellow'
        })

        let init = Phaser.Math.Between(1,6)
        this.winShape = (this.collectTypes[init]).toString()

        //HUD config
        this.scoreLeft = this.add.bitmapText(game.config.width/2, borderPadding + borderUISize, 'lemon-milk', 'Score: ', 24).setOrigin(0.5).setDepth(3)
        this.objectiveTxt = this.add.bitmapText(game.config.width/2, borderPadding*4 + borderUISize, 'lemon-milk', 'Collect: ' + this.winShape, 18).setOrigin(0.5).setDepth(3)
        this.menuText = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Press (X) for Menu').setOrigin(0.5).setAlpha(0).setDepth(3)

        //world
        this.physics.world.setBounds(0,0, game.config.width, game.config.height)

        //object
        this.p1Tank = new Tank(this, game.config.width / 2, game.config.height/2 - borderUISize - borderPadding, 'star-'+init.toString(), 0)

        this.movingEmitter = this.add.particles(0, 0, 'star-'+init.toString() , {
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
            count: 40,
        }

        for(let x = 0; x < this.shapes.count; x ++){
           this.shapes.arr.push(new Projectile(this, Phaser.Math.Between(10, game.config.width - 10),  Phaser.Math.Between(10, game.config.height - 100), 'triangle-'+Phaser.Math.Between(1,6).toString(), 0, 25, 75).setGravity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-10, 10)))
        }

        INTERVAL_ID = setInterval(()=>{
            let choice = Phaser.Math.Between(1,6)
            this.winShape = (this.collectTypes[choice]).toString()
            this.objectiveTxt.setText('Collect: ' + this.winShape)
            this.p1Tank.setTexture('star-' + choice.toString())
            this.movingEmitter.setTexture('star-' + choice.toString())
        }, 7500)
        
        this.physics.add.collider(this.shapes.arr, this.p1Tank, (object, shape)=>{
            console.log(object)
            if(this.collectTypes[object.name.charAt(object.name.length - 1).toString()] === this.winShape){
                this.p1Tank.points += 1
            }else {
                this.cameras.main.shake(250, 0.005)
                //maybe audio
            }
            object.destroy()
        })

        cursors.left.on('down', ()=>{
            this.p1Tank.setVelocity(-this.p1Tank.moveSpeed, 0)
        })
        cursors.right.on('down', ()=>{
            this.p1Tank.setVelocity(this.p1Tank.moveSpeed, 0)
        })
        cursors.up.on('down', ()=>{
            this.p1Tank.setVelocity(0, -this.p1Tank.moveSpeed) 
        })
        cursors.down.on('down', ()=>{
            this.p1Tank.setVelocity(0, this.p1Tank.moveSpeed) 
        })
        cursors.space.on('down', ()=>{
            if(this.p1Tank.body.velocity.x > 0){
                this.p1Tank.body.velocity.x += 100
            } else if(this.p1Tank.body.velocity.x < 0){
                this.p1Tank.body.velocity.x -= 100
            }
    
            if(this.p1Tank.body.velocity.y > 0){
                this.p1Tank.body.velocity.y += 100
            } else if(this.p1Tank.body.velocity.y < 0){
                this.p1Tank.body.velocity.y -= 100
            }   
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
        this.scoreLeft.text = 'Score: ' + this.p1Tank.points
    }
}