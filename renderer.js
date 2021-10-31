// @ts-nocheck

const Swal = require('sweetalert2')
const { remote } = require('electron')


let gabu,editorgabu,botgabu,closer,icons
let roboto,japanese
let playing = false;
let replayLoaded = false;
let scorev2 = true;
let bot = {
    status:false,
    last:false,
    settings:{
        width:'1600',
        height:'900',
        k1:'w',
        k2:'h',
        offset:'4',
        hardrock:false,
    }
    
}



function preload(){
    icons = loadImage('./images/icons.png')
    gabu = loadImage('./images/gab.png')
    editorgabu = loadImage('./images/flw.png')
    closer = loadImage('./images/close.png')
    roboto = loadFont(`./images/Roboto-Light.ttf`)
    japanese = loadImage(`./images/japanesetext.png`)
}
function setup(){
    createCanvas(windowWidth, windowHeight)  
    
    initPreloader()  
    initSettings()

    

    
}
function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
    if(replayLoaded){
        editor.resizeDisplay()
    }
    
}

function createEditorX(path){
    clear()
    try {
        remote.BrowserWindow.getFocusedWindow().maximize();
        remote.BrowserWindow.getFocusedWindow().resizable = true;
        remote.BrowserWindow.getFocusedWindow().movable = true;
    } catch (error) {
        
    }

    
    setTimeout(()=>{
        replayLoaded = true;
        initTopper()
        loadReplay(path)
        createEditor()
        createTimeline()
        createLowerTimeline()
        editor.cursor_shift(12817)
    },50)
    
}

function draw(){

    if(replayLoaded){
        clear()

        editor.draw()
        timeline.draw() 
        lower_timeline.draw()
        lower_timeline.drawSlicerPointer()
        drawIcons()

        push()

            // drawingContext.globalAlpha = 0.3
            // textAlign(RIGHT, BOTTOM)
            // push()
            // textSize(20)

            // text(`Dropout`,windowWidth-gabu.width/6-20,windowHeight-140 + !lower_timeline.active*100)
            // pop()
            // text(`April 22`,windowWidth-gabu.width/6-20,windowHeight-110 + !lower_timeline.active*100)
            // textSize(14)

            // textAlign(LEFT,BOTTOM)


            
            // translate(windowWidth,windowHeight-gabu.height/6-100 + !lower_timeline.active*100)
            // scale(-1,1)
            // image(gabu,0,0,gabu.width/6,gabu.height/6)


            if(preview){
                try {
                    // preview.beatmap.ApproachRate = slide.AR.value()  
                    // preview.beatmap.circleRadius = constrain(slide.CS.value(),8,100)   
                    // preview.beatmap.OverallDifficulty = slide.OD.value()
                } catch (error) {
                    
                }
                
            }
        pop()
        

        drawTopper()



        if(bot.status!=bot.last){
            bot.last = bot.status
            if(bot.status){
                console.log('bot on')
            } else {
                console.log('bot off')
            }
        }
    } else {
        draw_preloader()
    }
    
}

function mouseWheel(event){
    if(replayLoaded){
        if(keyIsDown(17)){
            editor.zoomTowards(event.delta)
        } else {
            editor.cursor_shift_by(event.delta/10)
        }
    
        timeline.redraw()
        lower_timeline.redraw()
    }
    
    
}

let mouseButton = 0
function mousePressed(event){
    
    mouseButton = event.button
    if(!playing){
        if(replayLoaded){
            if(event.button == 0){
                editor.parseBrush()
                timeline.parsePress()
                checkIconPress()
            }
        
            lower_timeline.parsePress(event.button)
            oldpath.push(JSON.stringify(path))
        } else {
            if(mouseX>589-19 && mouseY<19){
                window.close()
            }
        }
    }
    
    
    
}
function mouseReleased(){
    if(replayLoaded){
        timeline.redraw()
        lower_timeline.redraw()
        editor.parseRelease()
        timeline.parseRelease()
        lower_timeline.parseRelease()
    }

    
}

function keyPressed(){
    if(replayLoaded){
        editor.parseKeyPress()
        if(key=='c'){
            editor.create_key_point()
        }
        if(key =='z'){
            editor.kill_keypoints()
        }

        if(key =='o'){
            toggleSliders()
        }

        if(key ==' '){
            playing = !playing;
            if(playing){
                audio.play()
                
            } else {
                
                audio.pause()
            }
            
        }
    
        if(key =='w'){
            editor.selectPress()
            timeline.redraw()
            lower_timeline.redraw()
    
           
        }
    
        if(key =='s'){
            if(lower_timeline.active) lower_timeline.slice()
        }
    
    
        if(key == 'k'){
            lower_timeline.active = !lower_timeline.active
        }


        if(key == 'f'){
            editor.fixBrush()
        }
    }
   
}


document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
      // Prevent the Save dialog to open
      e.preventDefault();
      // Place your code here
      if(replayLoaded){
        saveReplay()
      }
      
    }
  });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      // Prevent the Save dialog to open
      e.preventDefault();
      // Place your code here
      if(replayLoaded){
        editor.ctrlz()
      }
      
    }
  });


let topperGraphics 


function initTopper(){
    topperGraphics = createGraphics(windowWidth, 24)
    topperGraphics.push()
   
        topperGraphics.fill(colors.topper.back)
        topperGraphics.noStroke()
        topperGraphics.rect(0,0,windowWidth,24)
        topperGraphics.fill(colors.topper.text)
        topperGraphics.textAlign(LEFT,CENTER)
        topperGraphics.textFont(roboto)
        topperGraphics.strokeWeight(0.8)
        topperGraphics.stroke(colors.topper.text)
        topperGraphics.text('Dropout 5 | Created by dropout.cc team | Open-source',12,10)
    topperGraphics.pop()
}
function drawTopper(){
    image(topperGraphics,0,0)
}

function initSettings(){
    document.body.style.backgroundColor = colors.back
}


//Coloring
let colors = {
    back:"white",
    text:80,
    topper:{
        back:225,
        text:64,
    },
    upper:{
        back:255,
        line:'#D6D6D6',
        text:'#383838'
    },
    lower:{
        zones:'#E5E5E5',
        back:'white',
        normalclicks:210,
        tri:38
    }

}

colors = {
    back:"#0F0F0F",
    text:"white",
    greens:"rgb(106, 176, 76)",
    reds:"rgb(231, 76, 60)",
    yellows:"rgb(241, 196, 15)",
    topper:{
        back:9,
        text:'white',
    },
    upper:{
        back:"#171717",
        line:'#303030',
        text:'white'
    },
    lower:{
        zones:'#282828',
        back:'#171717',
        normalclicks:"rgba(255,255,255,0.2)",
        tri:'white'
    },
    editor:{
        back:"black",
        hitobjects_normal:'rgb(120,120,120)'
    }

}
if(require('fs').existsSync('theme.json')){
    try {
        colors = JSON.parse(require('fs').readFileSync('theme.json'))
    } catch (error) {
        
    }
} 
