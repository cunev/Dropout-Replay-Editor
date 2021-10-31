// @ts-nocheck
let slide = {
    AR:undefined,
    CS:undefined,
    OD:undefined,
}
let slidersVisible = false;
let settings_menu
function initSliders(){
    settings_menu = new SettingsPage()
    // const dat = require('dat.gui')
    // const gui = new dat.GUI();
    // gui.domElement.id = 'gui';
    
    // slide.AR = createSlider(0,11,preview.beatmap.ApproachRate,0.1).position(10,-110)
    // slide.OD = createSlider(0,11,preview.beatmap.OverallDifficulty,0.1).position(10,-130)
    // slide.CS = createSlider(0,70,preview.beatmap.circleRadius,0.1).position(10,-150)


    // gui.add(preview.beatmap, 'ApproachRate', 0, 11);
    // gui.add(preview.beatmap, 'OverallDifficulty', 0, 11);
    // gui.add(preview.beatmap, 'circleRadius', 10, 51);
    // gui.add(audio, 'volume', 0, 1);
    // gui.add({'next_miss':()=>{
    //     timeline.gotoMiss('next')
    // }},'next_miss').name('Next miss');
    // gui.add({'prev_miss':()=>{
    //     timeline.gotoMiss('prev')
    // }},'prev_miss').name('Previous miss');
    // gui.add({'invert_path':()=>{
        
    // }},'invert_path').name('Invert Path');


    // gui.add(timeline,'scorev2').name('ScoreV2');

}

function toggleSliders(){
    slidersVisible = !slidersVisible

}

 
function drawIcons(){
    push()
    if(settings_menu)settings_menu.draw()
    pop()
    
    image(icons,width-370,51)

    
    // rect(width-370,51,340,30)
    if(mouseIsPressed&&settings_menu){
        settings_menu.check_press()
    }
}

const icons_list = [
    {
        name:"hardrock",
        func:()=>{
            path.forEach(e => {
                e.y = (1-(e.y/384))*384
            });
        }
    },
    {
        name:"settings",
        func:()=>{
            settings_menu.enabled = !settings_menu.enabled
        }
    },
    {
        name:"v2",
        func:()=>{
            timeline.scorev2 = !timeline.scorev2
        }
    },
    {
        name:"save",
        func:()=>{
            saveReplay()
        }
    },
    {
        name:"undo",
        func:()=>{
            editor.ctrlz()
        }
    },
    {
        name:"redo",
        func:()=>{}
    },
] 

function checkIconPress(){
    for (let i = 0; i < icons_list.length; i++) {
        const icon = icons_list[i];
        rect(width-370+i*58,51,35,30)
        if(
            mouseX>width-370+i*58 &&
            mouseX<width-370+i*58 + 35 &&
            mouseY>51 &&
            mouseY<51 + 30 
        ){
            icon.func()
        }
    }
    
}


class SettingsPage{
    constructor(){
        this.enabled = false;
        audio.volume = 0.2
        this.sliders = [
            {
                id:'ar',
                name:'Approach Rate',
                value:preview.beatmap.ApproachRate,
                max:11,
                change:(value)=>{
                    preview.beatmap.ApproachRate = value
                }
            },
            {
                id:'ar',
                name:'Overall Difficulty',
                value:preview.beatmap.OverallDifficulty,
                max:11,
                change:(value)=>{
                    preview.beatmap.OverallDifficulty = value
                }
            },
            {
                id:'ar',
                name:'Circle Radius',
                value:preview.beatmap.circleRadius,
                max:51,
                change:(value)=>{
                    preview.beatmap.circleRadius = value
                }
            },
            {
                id:'ar',
                name:'Song volume',
                value:audio.volume,
                max:1,
                change:(value)=>{
                    audio.volume = value
                }
            },
        ]
        this.textpg = createGraphics(250,300)
        this.createtext()
    }
    createtext(){
        this.textpg.clear()
        this.textpg.textFont(roboto)
        this.textpg.stroke('#BEBEBE')
        this.textpg.fill('#BEBEBE')
        this.textpg.textSize(19)
        this.textpg.text('Map Settings',25,35)
        this.textpg.textSize(13)
        this.sliders.forEach((e,i)=>{
            this.textpg.text(e.name +' - '+ Math.round(e.value*100)/100,25,80+i*50)
            
        })
    }
    check_press(){
        if(mouseX>width-300 && mouseX<width-300+250 && mouseY>120 && mouseY<120+285 &&this.enabled){
 
            const relative_position = {x:width-300,y:120,xw:width-300+250,yh:120+285}

            this.sliders.forEach((e,i)=>{
                if(mouseX>relative_position.x+25 && mouseX<relative_position.xw-25 && mouseY>relative_position.y+100+i*50-10 && mouseY<relative_position.y+100+i*50+10){
                    const setRate = (mouseX-(relative_position.x+25))/((relative_position.xw-25)-(relative_position.x+25))
    
                    e.value = setRate*e.max
                    e.change(e.value)
                    this.createtext()
                }
                // this.textpg.text(e.name +' - '+ Math.round(e.value*100)/100,25,80+i*50)
                
            })
        }
    }
    check_release(){

    }
    draw(){
        if(this.enabled){
            fill('#171717')
            noStroke()
            rect(width-300,120,250,285,8)
            image(this.textpg,width-300,120)

            
            strokeWeight(5)
            this.sliders.forEach((e,i)=>{
                stroke('#303030')
                line(width-275,220+i*50,width-80,220+i*50)
                stroke('#808080')
                line(width-275,220+i*50,width-275+195*e.value/e.max,220+i*50)
            })
        }
        


    }
}