//Base prefab
class Base extends Phaser.GameObjects.Sprite{ 
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)

        //when an obj is created, put into scene
        scene.add.existing(this)
        this.HP = 5
    }

    update(isHit){
        if(isHit){
            this.HP -= 1
        }
        if(this.HP == 0){
            this.alpha = 0
        }
    }
}
