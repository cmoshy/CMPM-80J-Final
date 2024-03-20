//Alien prefab
class Alien extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, config){
        super(scene, x, y, texture=config.texture, frame)
        //add to scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        scene.events.on('update', this.update, this)

        //properties
        this.moveSpeed = config.moveSpeed !== undefined ? config.moveSpeed : 50
        this.alpha = config.alpha !== undefined ? config.alpha : 1
        this.pointValue = config.pv !== undefined ? config.pv: 5
        this.projectileSpeed = config.projectileSpeed !== undefined ? config.projectileSpeed: 50

        this.p = new Projectile(scene, x, y, 'bullet', undefined, true, this.projectileSpeed, -1)
        this.isFiring = true //firing by default

        this.setVelocityX(-this.moveSpeed)
    }

    update(){
        //wrap from left to right
        if(this.x <= 0 - this.width){
            this.reset()
            this.y += 50
        }
    }

    //reset position
    reset(){
        this.x = game.config.width
    }

    hide(){
        this.alpha = 0
        this.p.alpha = 0
        this.isFiring = false
        this.soft_reset()
    }

    //reset bullet
    soft_reset(){
        this.p.reset(this.x, this.y)
    }


}