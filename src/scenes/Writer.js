class Writer extends Phaser.Scene{
    constructor(){
        super('writerScene')
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
        this.NEXT_X = game.config.width/2 + (game.config.width/4) + 50	    // next text prompt x-position
        this.NEXT_Y = game.config.height/2 + 190				    // next text prompt y-position
 
        this.LETTER_TIMER = 15   // # ms each letter takes to "type" onscreen
 
        // dialog variables
        this.dialogConvo = 0			// current "conversation"
        this.dialogLine = 0			    // current line of conversation
        this.dialogTyping = false		// flag to lock player input while text is "typing"
        this.dialogText = null			// the actual dialog text
        this.nextText = null			// player prompt text to continue typin

        this.enumScenes = Object.freeze({
            0: 'firstScene',
            1: 'secondScene',
            2: 'thirdScene',
            3: 'playScene'
        })
    }

    create(){

        keyNext = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)

        this.gameOver = false

        // parse dialog from JSON file
        this.writing = this.cache.json.get('writing')
        console.log(this.writing)

        // add dialog box sprite
        this.writingbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'writing-box').setOrigin(0.5,0)
        
        //txt
        this.menuText = this.add.bitmapText(game.config.width/2, game.config.height/2 + 50, 'lemon-milk', 'Press (X) to continue',16).setOrigin(0.5).setAlpha(0).setDepth(3)

        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setOrigin(0.5, 0)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE).setOrigin(0.5, 0)
        
        // start first dialog conversation
        console.log(this.enumScenes[this.dialogConvo])
        this.typeText()        
    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(keyNext) && !this.dialogTyping && this.dialogConvo < this.writing.length) {
            console.log(this.enumScenes[this.dialogConvo - 1])
            this.typeText() === true ?
            this.time.delayedCall(50, ()=>{
                this.add.tween({
                    targets: this.writingbox,
                    alpha: {from: 1, to: 0},
                    delay: 0,
                    duration: 750,
                    onComplete: ()=>{
                        this.writingbox.visible = false
                    }
                })
                this.add.tween({
                    targets: this.menuText,
                    alpha: {from: 0, to: 0.75},
                    delay: 3000,
                    duration: 1500,
                    onComplete: ()=>{
                        this.gameOver = true
                    }
                })
            }) : undefined
        }else if (this.dialogConvo >= this.writing.length){
            console.log('we done')
            if(Phaser.Input.Keyboard.JustDown(keyStart)){
                this.writingbox.visible = true
                clearInterval(INTERVAL_ID)
                this.scene.stop(this.enumScenes[this.dialogConvo - 1]) // stop current scene
                this.scene.stop('writerScene') // stop this scene
                this.scene.start('menuScene')
            }
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyStart) && this.dialogConvo < this.writing.length){ //go to next scene
            this.menuText.setAlpha(0)
            this.gameOver = false
            this.scene.stop(this.enumScenes[this.dialogConvo-1])
            this.scene.launch(this.enumScenes[this.dialogConvo])

            this.writingbox.visible = true
            this.add.tween({
                targets: this.writingbox,
                alpha: {from: 0, to: 1},
                delay: 0,
                duration: 2000,
                onComplete: ()=>{
                    this.dialogTyping = false
                    this.typeText()
                }
            })
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
       console.log(this.writing.length)
       if(this.dialogLine > this.writing[this.dialogConvo].length - 1) {
           console.log('new conversation')
           this.dialogLine = 0
           // I increment the conversation count here...
           // ..but you could create logic to exit if each conversation was self-contained
           this.dialogConvo++
           console.log(this.enumScenes[this.dialogConvo])
           return true
        }
           
        // make sure we haven't run out of conversations...
        if(this.dialogConvo >= this.writing.length) {
            // here I'm exiting the final conversation to return to the title...
            // ...but you could add alternate logic if needed
            console.log('End of Conversations')
        
            // make text box invisible
            this.writingbox.visible = false
            
            return
    
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
        return false
    }  
}