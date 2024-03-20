class First extends Phaser.Scene {
  
    constructor(){
        super("firstScene")
    }

    init(){
        // dialog constants
        this.DBOX_X = game.config.width/2	// dialog box x-position
        this.DBOX_Y = game.config.height/2 + 110			        // dialog box y-position
        this.DBOX_FONT = 'lemon-milkB'	    // dialog box font key
   
        this.TEXT_X = game.config.width/2			         // text w/in dialog box x-position
        this.TEXT_Y = game.config.height/2 + 110				    // text w/in dialog box y-position
        this.TEXT_SIZE = 16		        // text font size (in pixels)
        this.TEXT_MAX_WIDTH = 420	    // max width of text within box
   
        this.NEXT_TEXT = '[F]'	    // text to display for next prompt
        this.NEXT_X = game.config.width/2 + (game.config.width/4) + 25	    // next text prompt x-position
        this.NEXT_Y = game.config.height/2 + 180				    // next text prompt y-position
   
        this.LETTER_TIMER = 25		    // # ms each letter takes to "type" onscreen
   
        // dialog variables
        this.dialogConvo = 0			// current "conversation"
        this.dialogLine = 0			    // current line of conversation
        this.dialogTyping = false		// flag to lock player input while text is "typing"
        this.dialogText = null			// the actual dialog text
        this.nextText = null			// player prompt text to continue typin
    }
    create(){  
        
        keyNext = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)
        cursors = this.input.keyboard.createCursorKeys()

        // parse dialog from JSON file
        this.writing= this.cache.json.get('writing')
        console.log(this.writing)

        //world
        this.physics.world.setBounds(0,0, game.config.width, game.config.height)

        //txt
        this.menuText = this.add.text(game.config.width/2, game.config.height/2 + 50, 'Press (X) continue').setOrigin(0.5).setAlpha(0).setDepth(3)

        //win
        this.gameOver = false

        //object
        this.p1Tank = new Tank(this, game.config.width / 2, game.config.height/2  - borderUISize - borderPadding, 'star', 0)

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

        //random movement
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

        //collison 
        this.physics.add.collider(this.shapes.arr, this.p1Tank, (object, shape)=>{
            this.p1Tank.setTexture('star-' + object.name.charAt(object.name.length- 1).toString())
            this.movingEmitter.setTexture('star-' + object.name.charAt(object.name.length- 1).toString())
            object.destroy()
            this.shapes.real -= 1
            console.log(this.shapes.real)
        })

    
        // add dialog box sprite
        this.writingbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'writing-box').setOrigin(0.5,0)
      
        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setOrigin(0.5, 0)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setOrigin(0.5, 0)
      
        // start first dialog conversation
        this.typeText()        

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
            this.scene.start('secondScene')
        }

        if(Phaser.Input.Keyboard.JustDown(keyNext) && !this.dialogTyping) {
            this.typeText() // trigger dialog
        }
    }

    //credit nathan alitce @UCSC's CMPM dept.
    typeText(){

        // lock input while typing
        this.dialogTyping = true
    
        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''
    
        /* JSON dialog structure: 
            - each array within the main JSON array is a "conversation"
            - each object within a "conversation" is a "line"
            - each "line" has one property
                1. the dialog text (required)
        */
    
        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.dialogLine > this.writing[this.dialogConvo].length - 1) {
            this.dialogLine = 0
            // I increment the conversation count here...
            // ..but you could create logic to exit if each conversation was self-contained
            this.dialogConvo++
        }
            
        // make sure we haven't run out of conversations...
        if(this.dialogConvo >= this.writing.length) {
            // here I'm exiting the final conversation to return to the title...
            // ...but you could add alternate logic if needed
            console.log('End of Conversations')
        
            // make text box invisible
            this.writingbox.visible = false
    
        } else {
            this.combinedDialog = this.writing[this.dialogConvo][this.dialogLine]['dialog']
    
            // create a timer to iterate through each letter in the dialog text
            let currentChar = 0
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.combinedDialog.length - 1,
                callback: () => { 
                    // concatenate next letter from dialogLines
                    this.dialogText.text += this.combinedDialog[currentChar]
                    // advance character position
                    currentChar++
                    // check if timer has exhausted its repeats 
                    // (necessary since Phaser 3 no longer seems to have an onComplete event)
                    if(this.textTimer.getRepeatCount() == 0) {
                        // show prompt for more text
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(0.5,0)
                        this.dialogTyping = false   // un-lock input
                        this.textTimer.destroy()    // destroy timer
                    }
                },
                callbackScope: this // keep Scene context
            })  
            // final cleanup before next iteration
            this.dialogText.maxWidth = this.TEXT_MAX_WIDTH  // set bounds on dialog
            this.dialogLine++                               // increment dialog line
        }
    }  
}