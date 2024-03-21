class Tank extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)

        scene.add.existing(this)
        scene.physics.add.existing(this)
        scene.events.on('update', this.update, this)

        //collides
        this.setBounce(1)
        this.setCollideWorldBounds(true)
        
        this.moveSpeed = 75 //velocity
        this.isMoving = false

        this.points = 0
        
        this.moveDirection = new Phaser.Math.Vector2(0, 0)
    }
}