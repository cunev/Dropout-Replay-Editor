// @ts-nocheck
let timeline

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
function createTimeline(){
    timeline = new Timeline()
}

class Timeline{
    constructor(){
        this.pg = createGraphics(windowWidth, 70)
        this.safeAnalyze = false;
        this.redraw()

        this.inpress= false;
        this.ranges = {
            'blue':20,
            'green':20,
            'yellow':50
        }

        this.scorev2 = true;
        
        
    }
    determineRange(delta){
        this.ranges['blue'] = (159 - 12*preview.beatmap.OverallDifficulty)/2
        this.ranges['green'] = (279 - 16*preview.beatmap.OverallDifficulty)/2
        this.ranges['yellow'] = (399 - 20*preview.beatmap.OverallDifficulty)/2

        if(delta<=this.ranges['blue']) return '300'
        if(delta<=this.ranges['green']) return '100'
        if(delta<=this.ranges['yellow']) return '50'

        return false
    }
    parsePress(){
        if(mouseY>height-270&&mouseY<height-270+62){
            this.inpress = true
        }
    }
    parseRelease(){
        this.inpress = false;
    }
    draw(){
        push()
        drawingContext.shadowBlur = 11
        drawingContext.shadowColor = 'rgba(0,0,0,0.20)'
        image(this.pg,0,height-270)
        

        pop()

        if(this.inpress){

                let rate = (mouseX-60)/(windowWidth-120)
                editor.cursor_shift(rate*duration-editor.cursor.range/2)
                this.redraw()
                lower_timeline.redraw()

        }
    }

    timeToX(time){
        let rate = time/duration
        return (windowWidth-120)*rate+60
    }
    redraw(){
        if(this.safeAnalyze) this.analyze()
        this.pg.fill(colors.upper.back)
        this.pg.clear()
        this.pg.noStroke()
        this.pg.rect(35,0,width-70,70,12)

        // this.pg.fill('#969594')
        // this.pg.rect(0,32,this.pg.width,8)


        this.pg.push()
        this.pg.strokeWeight(3)
        this.pg.stroke(colors.upper.line)
        this.pg.line(60,18,width-60,18)
        this.pg.pop()

        this.pg.fill(colors.upper.text)
        this.pg.stroke(colors.upper.text)
        this.pg.strokeWeight(1)
        this.pg.textAlign(CENTER)
        this.pg.textSize(17)
        
        this.pg.textFont(roboto)

        let seconds = pad(Math.round(editor.wcursor/1000)%59,2)
        let minutes = pad((Math.round(editor.wcursor/60000)%59),2)

        let seconds2 = pad(Math.round(path[path.length-2].gametime/1000)%59,2)
        let minutes2 = pad((Math.round(path[path.length-2].gametime/60000)%59),2)
        let acc = 0
        if(this.hit_data){
            acc = (this.hit_data.blue+this.hit_data.green+this.hit_data.yellow+this.hit_data.red)/this.hit_data.total
        }
        this.pg.text(`${minutes}:${seconds} / ${minutes2}:${seconds2}    ACC: ${Math.round(acc*10000)/100}%    x${this.current_combo}` ,(width)/2,55)

        

        if(this.pressPoints){
            this.pg.stroke('black')
            this.pg.strokeWeight(3)
            this.hit_data = {total:0,blue:0,green:0,yellow:0,red:0}
            this.hits.forEach(e=>{
                
                if(e.bad===true){
                    this.pg.stroke(colors.reds)
                    let x = this.timeToX(e.time)
                
                    this.pg.line(x,10,x,30)
                    this.hit_data.red+=0
                }
                if(e.typeof=='HitCircle'||e.typeof=='Slider'){
                    this.hit_data.total+=300
                    if(e.bad==='100'){
                        
                        if(e.typeof=='Slider'){
                            if(this.scorev2){
                                this.pg.stroke(colors.greens)
                                let x = this.timeToX(e.time)
                                this.pg.line(x,10,x,30)
                                this.hit_data.green+=100
                            } else {
                                this.hit_data.green+=300
                            }
                            
                        }
                        if(e.typeof=='HitCircle'){
                            this.pg.stroke(colors.greens)
                            let x = this.timeToX(e.time)
                            this.pg.line(x,10,x,30)
                            this.hit_data.green+=100
                        }
                    
                        
                    }
                    if(e.bad==='50'){
                        
                        if(e.typeof=='Slider'){
                            if(this.scorev2){
                                this.pg.stroke(colors.yellows)
                                let x = this.timeToX(e.time)
                                this.pg.line(x,10,x,30)
                                this.hit_data.yellow+=50
                            } else {
                                this.hit_data.yellow+=300
                            }
                            
                        }
                        if(e.typeof=='HitCircle'){
                            this.hit_data.yellow+=50
                            this.pg.stroke(colors.yellows)
                            let x = this.timeToX(e.time)
                        
                            this.pg.line(x,10,x,30)
                        }
                        
                    }
                    if(e.bad===false){
                        this.hit_data.blue+=300
                    }
                    if(e.selected){
                        this.pg.stroke('blue')
                        let x = this.timeToX(e.time)
                    
                        this.pg.line(x,10,x,30)
                    }
                }
                
                
            })
        }
        this.pg.fill(colors.upper.text)
        this.pg.noStroke()
        this.pg.circle(this.timeToX(editor.wcursor),18,9)
   
    }
    analyze(){
        
        this.hits = preview.beatmap.HitObjects
        let radius = preview.beatmap.circleRadius

        this.pressPoints = [] //{time:0,type:'k1'}

        for (let i = 1; i < path.length; i++) {
            const ne = path[i];
            const e = path[i-1]

            if(!e.buttons.k1&&ne.buttons.k1){this.pressPoints.push({time:ne.gametime,type:'k1',used:false,pos:{x:ne.x,y:ne.y}})}
            if(!e.buttons.k2&&ne.buttons.k2){this.pressPoints.push({time:ne.gametime,type:'k2',used:false,pos:{x:ne.x,y:ne.y}})}
        }

        this.current_combo = 0
        let presses = [0,0]
        this.hits.forEach(e=>{
            e.typeof = e.constructor.name
            if(e.typeof=='HitCircle'||e.typeof=='Slider'){
                let foundAny = false;
                let deltaFound = 0
                for (let i = 0; i < this.pressPoints.length; i++) {
                    const press = this.pressPoints[i];
                    
                    if(this.determineRange(Math.abs(e.time-press.time))){
                        if(!press.used){
                            if(dist(e.position.x,e.position.y,press.pos.x,press.pos.y)<=radius){
                                press.used = true;
                                foundAny = true;
                                deltaFound = this.determineRange(Math.abs(e.time-press.time))
                                
                                e.pressRange = e.time-press.time
                                
                                
                                break;
                            }
    
                        }
                    }
                    
                }
                if(!foundAny){
                    e['bad'] = true
                    e.color = colors.reds
                    e.strokeStyle = colors.reds
                    if(e.time<editor.wcursor){
                         this.current_combo = 0
                    }
                    
                }else{
                    if(e.time<editor.wcursor){
                        if(e.typeof=='Slider'){
                            this.current_combo+=1+e.repeat
                        } else {
                            this.current_combo+=1 
                        }
                    }
                    
                    

                    
                    e['bad'] = false
                    if(!e.selected){
                        e.color = colors.editor.hitobjects_normal
                        e.strokeStyle = 'rgb(160,160,160 )'
                    }
                    
                    if(deltaFound==='100'){
                        presses[0]++
                        e['bad'] = '100'
                        if(!e.selected){
                            e.color = colors.greens
                            e.strokeStyle = colors.greens
                        }
                        
                    }
                    if(deltaFound==='50'){
                        presses[1]++
                        e['bad'] = '50'
                        if(!e.selected){
                            e.color = '#F2C94C'
                            e.strokeStyle = '#F2C94C'
                        }
                        
                    }
                }
            }

            
        })

        if(!this.safeAnalyze){this.safeAnalyze = true;this.redraw()}
        

    }
    gotoMiss(type){
        if(type=='next'){
            for (let i = 0; i < this.hits.length; i++) {
                const e = this.hits[i];
                if(e.time>editor.wcursor&&e.bad===true){
                    editor.cursor_shift(e.time-editor.cursor.range/2)
                    break
                }
                
            }

                // let rate = mouseX/windowWidth
                // editor.cursor_shift(rate*duration)
                // this.redraw()
                // lower_timeline.redraw()

        } else {
            for (let i = 0; i < this.hits.length; i++) {
                const e = this.hits[i];
                if(e.time<editor.wcursor&&e.bad===true){
                    editor.cursor_shift(e.time-editor.cursor.range/2)
                }
                
            }
        }
    }

}