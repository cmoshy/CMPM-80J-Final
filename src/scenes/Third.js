class Third extends Phaser.Scene {
  
    constructor(){
        super("thirdScene")
    }

    create(){ 

        cursors = this.input.keyboard.createCursorKeys()
    
        //world
        this.physics.world.setBounds(0,0, game.config.width, game.config.height)

        //txt
        this.scoreLeft = this.add.bitmapText(game.config.width/2, borderPadding + borderUISize, 'lemon-milk', 'Score - ', 24).setOrigin(0.5).setDepth(3)

        //object
        this.p1Tank = new Tank(this, game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'star', 0)

        this.movingEmitter = this.add.particles(0, 0, 'star', {
            frequency: 15,
            speed: 75,
            scale: { start: 0.25, end: 0.5},
            alpha: { start: 1, end: 0 },
            // higher steps value = more time to go btwn min/max
            lifespan: { min: 1000, max: 1500, steps: 500}
        })
        this.movingEmitter.startFollow(this.p1Tank, 0, 0, false) 

        this.shapes = {
            arr: [],
            count: 40,
        }

        for(let x = 0; x < this.shapes.count; x ++){
           this.shapes.arr.push(new Projectile(this, Phaser.Math.Between(10, game.config.width - 10),  Phaser.Math.Between(10, game.config.height - 100), 'triangle-'+Phaser.Math.Between(1,6).toString(), 0, 100, 200).setGravity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-10, 10)))
        }
        
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

        this.physics.add.collider(this.shapes.arr, this.p1Tank, (object, shape)=>{
            this.p1Tank.setTexture('star-' + object.name.charAt(object.name.length- 1).toString())
            this.movingEmitter.setTexture('star-' + object.name.charAt(object.name.length- 1).toString())
            this.cameras.main.shake(250, 0.005)
            this.p1Tank.points += 1
            object.destroy()
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
        this.scoreLeft.text = 'Score - ' + this.p1Tank.points    
    }
}