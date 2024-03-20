class Projectile extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame, _vlower=50, _vupper=100){
        super(scene, x, y, texture, frame)

        //when an obj is created, put into scene
        scene.add.existing(this)
        scene.physics.add.existing(this)
        scene.events.on('update', this.update, this)
        
        //collides
        this.setBounce(1)
        this.setCollideWorldBounds(true)
        
        this.name = texture
        this.lowerBound = _vlower
        this.upperBound = _vupper

        scene.physics.add.collider(this, scene.shapes.arr, (object, collided)=>{
            let tmp = collided.name
            collided.name = this.name
            collided.setTexture(this.name)
            this.name = tmp
            this.setTexture(tmp)  
        })

        let ran1 = Math.round(Math.random())
        ran1 === 0 ? ran1 = -1 : undefined
        let ran2 = Math.round(Math.random())
        ran2 === 0 ? ran2 = -1 : undefined
        let vec = new Phaser.Math.Vector2(ran1,ran2)
        vec.normalize()
        this.setVelocity(vec.x * Phaser.Math.Between(this.lowerBound, this.upperBound), vec.y * Phaser.Math.Between(this.lowerBound, this.upperBound))
        this.setAngularVelocity(Phaser.Math.Between(this.lowerBound-50,this.upperBound-75))
    }

    update(){}
  
}