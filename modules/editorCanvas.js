// @ts-nocheck

// 04.06.2021:
// To those interested in how this works,
// The code is really scrambled and i didn't have time nor will to make something beautiful.
// If you want to refactor or add anything, feel free to do so

// From now on, this is a finished project.

// Follow your dreams and don't listen to anyone who discourages you.
// -Dmitri, aka takeshi.

let oldpath = []

class EditorCanvas {
    constructor(){
        this.w = 512
        this.h = 384

        this.okRadius = 30


        
        this.ww = 512
        this.wh = 384
        this.wx = windowWidth/2-this.ww/2
        this.wy = windowHeight/2-this.wh/2
        this.resizeDisplay()

        this.cursor = {start:0,end:0,range:1300}
        this.wcursor = 0
        this.brush = 40
        this.newbrush = 40

        this.mouse = {x:0,y:0}

        this.mode = 'brush'

        this.init()
    }

    init(){
        this.pg = createGraphics(this.w, this.h)
        
       
    }

    calculateVirtualMouse(){
        let mouse = {x:0,y:0}
        mouse.x = 512*((mouseX-this.display.x)/this.display.w)
        mouse.y = 384*((mouseY-this.display.y)/this.display.h)
        return mouse
    }

    resizeDisplay(){
        this.display = {x:this.wx,y:this.wy,w:this.ww,h:this.wh}
    }
    
    drawPath(){
        this.pg.push()
        this.pg.rectMode(CENTER)
        if(this.mode == 'advanced'&&this.closestPoint){
            this.pg.push()
            this.pg.fill('red')
            this.pg.noStroke()
            this.pg.rect(this.closestPoint.x,this.closestPoint.y,5)
            this.pg.pop()
        }
        let cursorPointFirst,cursorPointLast;
        let closestPointDist=Infinity,closestPoint
        
        for (let i = 1; i < path.length; i++) {
            const point = path[i-1];
            const nextpoint = path[i]
            

            //In-between path data
            if(point.gametime>=this.cursor.start){
                this.pg.stroke(180)
                this.pg.strokeWeight(2)

                if(point.buttons.k1){this.pg.stroke('#BB6BD9')}
                if(point.buttons.k2){this.pg.stroke('#F2994A')}
                if(point.buttons.k1&&point.buttons.k2){this.pg.stroke('red')}
                this.pg.line(point.x,point.y,nextpoint.x,nextpoint.y)
                let distP = dist(point.x,point.y,this.mouse.x,this.mouse.y)
                if(distP<closestPointDist){
                    closestPointDist = distP
                    closestPoint = point
                }
                if(point.keypoint){
                    this.pg.noStroke()
                    this.pg.fill('purple')
                    this.pg.circle(point.x,point.y,5)
                    
                }

                if(this.wcursor>=point.gametime&&this.wcursor<=nextpoint.gametime && !cursorPointFirst){
                    cursorPointFirst = point
                    cursorPointLast = nextpoint
                }

                
                
            }
            
            //Breaking Point
            if(point.gametime>this.cursor.end) break;
        }


       
        
        this.closestPoint = closestPoint
        


        if(cursorPointFirst)this.drawCursor(cursorPointFirst,cursorPointLast,'SQUARE')
        


        this.pg.pop()
    }
    drawPathMin(){
        this.pg.push()

        let cursorPointFirst,cursorPointLast;
        for (let i = 1; i < path.length; i++) {
            const point = path[i-1];
            const nextpoint = path[i]
            

            //In-between path data
            if(point.gametime>=this.cursor.start){
                if(this.wcursor>=point.gametime&&this.wcursor<=nextpoint.gametime && !cursorPointFirst){
                    cursorPointFirst = point
                    cursorPointLast = nextpoint
                }

                
                
            }

            //Breaking Point
            if(point.gametime>this.cursor.end) break;
        }



        if(cursorPointFirst)this.drawCursor(cursorPointFirst,cursorPointLast,'NORMAL')
        


        this.pg.pop()
    }
    drawCursor(p1,p2,mode){
        this.pg.push()
        this.pg.rectMode(CENTER)
        this.pg.fill('blue')
        this.pg.noStroke()


        let total = p2.gametime-p1.gametime
        let current = this.wcursor-p1.gametime
        let rate = current/total
        // console.log(rate)
        let vp = {
            x:p1.x + (p2.x-p1.x)*rate,
            y:p1.y + (p2.y-p1.y)*rate
        }
        if(mode=='SQUARE'){
            this.pg.push()
    
            this.pg.translate(vp.x,vp.y)
            this.pg.rotate(Math.atan2(p2.y-p1.y,p2.x-p1.x)-PI/2)
            this.pg.triangle(-3,0,0,10,3,0)

            this.pg.pop()
            // this.pg.rect(vp.x,vp.y,5)
        } else {
            this.pg.fill('orange')
            this.pg.circle(vp.x,vp.y,20)
            this.pg.fill('white')
            this.pg.circle(vp.x,vp.y,15)
        }
        
        // this.pg.rect(p2.x,p2.y,5)

        this.pg.pop()
    }


    renderBrush(){
        this.pg.push()
        this.pg.noFill()
        
        if(mouseIsPressed&&mouseButton==2&&(mouseY<windowHeight-172)){
            this.newmouse = this.calculateVirtualMouse()
            this.newbrush = this.brush + (this.newmouse.x-this.mouse.x)

            this.pg.stroke('red')
            this.pg.circle(this.mouse.x,this.mouse.y,this.newbrush)
            

        } else {
            this.brush = Math.abs(this.newbrush)
            this.mouse = this.calculateVirtualMouse()
            

            
            this.pg.stroke(64)
            this.pg.circle(this.mouse.x,this.mouse.y,this.brush)

            
            
        
        }
        this.pg.pop()
        
        
        
    }

    renderBrushFix(){
        this.pg.push()
        this.pg.noFill()
        
        if(mouseIsPressed&&mouseButton==2){
            // this.newmouse = this.calculateVirtualMouse()
            // this.newbrush = this.brush + (this.newmouse.x-this.mouse.x)

            this.pg.stroke('red')
            this.pg.circle(this.mouse.x,this.mouse.y,this.newbrush)


        } else {
            this.brush = this.newbrush
            
            this.pg.stroke('white')
            this.pg.circle(this.mouse.x,this.mouse.y,this.brush)

            
        
        }
        this.pg.pop()
        
        
        
    }

    render(){
        
        if(playing){
            this.pg.erase(90,90)
            this.pg.rect(0,0,this.pg.width,this.pg.height)
            this.pg.noErase()
            editor.cursor_shift(audio.currentTime*1000 - this.cursor.range/2)
            this.drawPathMin()
        } else {
            
            audio.currentTime = (this.cursor.start+this.cursor.range/2)/1000
            this.pg.clear()
            this.drawPath()

            if(this.mode=='brush'){
                if(mouseY>40&&mouseY<windowHeight-100)this.renderBrush()
                
            } else if (this.mode=='advanced') {
                this.mouse = this.calculateVirtualMouse()
            } else if(this.mode =='fixing'){
                this.renderBrushFix()
            }
            if(this.modarr){this.editPath()}
            

            this.parseKeys()

            
        }
        push()
        noFill()
        pop()
        

        
        
    }

    parseKeys(){
        if(keyIsDown(81)){
            if(this.cursor.range-7>400){
                this.cursor.range-=7
                this.cursor.start+=3.5
                this.cursor_shift(this.cursor.start)
            }

        }
        if(keyIsDown(69)){
            if(this.cursor.range+7<1300){
                this.cursor.range+=7
                this.cursor.start-=3.5
                this.cursor_shift(this.cursor.start)
            }

        }
        if(!keyIsDown(17)){
            if(keyIsDown(37)){ //Left Key
                this.cursor_shift_by(-4)
            }
            if(keyIsDown(39)){ //Right Key
                this.cursor_shift_by(4)
            }
        }
        
    }

    editPath(){
        this.modarr.forEach(e=>{
            
            path[e.n].x = e.start_POINT.x + (this.mouse.x - e.start_mouse.x) * e.rate
            path[e.n].y = e.start_POINT.y + (this.mouse.y - e.start_mouse.y) * e.rate
        })
    }
    draw(){
        
        this.render()
        this.drawUR()
        image(this.pg,this.display.x,this.display.y,this.display.w,this.display.h)
        

        //Image and song info
        if(preview&&preview.beatmap&&mapImage){

            push()  
            textFont(roboto)
            textAlign(LEFT, CENTER)
            fill(colors.text)
            textSize(22)
            stroke(colors.text)
            strokeWeight(1)
            text(preview.beatmap.Artist+' - '+preview.beatmap.Title,185,65)

            pop()
        }
        

    

        if(preview)preview.at(this.wcursor)

    }

    cursor_shift(at){
        this.cursor.start = at
        this.cursor.end = at+this.cursor.range
        this.wcursor = (this.cursor.start+this.cursor.end)/2
        timeline.redraw()
        lower_timeline.redraw()
    }
    cursor_shift_by(delta){
        this.cursor.start+=delta
        this.cursor.end = this.cursor.start+this.cursor.range

        this.wcursor = (this.cursor.start+this.cursor.end)/2
        timeline.redraw()
        lower_timeline.redraw()
        
    }
    zoomTowards(delta){


        let rateX = (mouseX-this.wx)/this.ww
        let rateY = (mouseY-this.wy)/this.wh
        


        if(this.ww-delta>300){
            this.ww-=delta
            this.wh=this.ww/1.33
        }
        


        this.wx = mouseX +  (-this.ww*rateX)
        this.wy = mouseY +  (-this.wh*rateY)

        this.resizeDisplay()
    }

    parseBrush(){
        this.modarr = []
        if(this.mode=='brush'){
            if(mouseY>64&&mouseY<windowHeight-100){
                for (let i = 1; i < path.length; i++) {
                    const point = path[i-1];
                    const nextpoint = path[i]
                    
        
                    //In-between path data
                    if(point.gametime>=this.cursor.start){
                        if(dist(point.x,point.y,this.mouse.x,this.mouse.y)<=(this.brush/2)){
                            this.modarr.push({
                                n:i-1,
                                start_mouse:{x:this.mouse.x,y:this.mouse.y},
                                start_POINT:{x:point.x,y:point.y},
                                rate:1-dist(this.mouse.x,this.mouse.y,point.x,point.y)/(this.brush/2)
                            })
                        }
                        
                    }
        
                    //Breaking Point
                    if(point.gametime>this.cursor.end) break;
                }
            }
        } else if (this.mode == 'advanced') {
            if(mouseY>64&&mouseY<windowHeight-100){
                let leftnode,node,rightnode
                let leftradius,rightradius
                let keypoints = []
                for (let i = 1; i < path.length; i++) {
                    const point = path[i-1];
                    const nextpoint = path[i]
                    
        
                    //In-between path data
                    if(point.gametime>=this.cursor.start){
                        if(point.keypoint){
                            keypoints.push({obj:point,index:i})
                        }
                        
                    }
        
                    //Breaking Point
                    if(point.gametime>this.cursor.end) break;
                }

                if(keypoints.length>=3){
                    let closest = {dist:Infinity,obj:undefined,index:0}
                    keypoints.forEach((e,i)=>{
                        let d = dist(e.obj.x,e.obj.y,this.mouse.x,this.mouse.y)
                        if(d<closest.dist){
                            closest.dist = d
                            closest.obj = e
                            closest.index = i
                        }
                    })
                    node = keypoints[closest.index]
                    leftnode = keypoints[closest.index-1]
                    rightnode = keypoints[closest.index+1]
                    if(leftnode&&node&&rightnode){
                        leftradius = dist(node.obj.x,node.obj.y,leftnode.obj.x,leftnode.obj.y)
                        rightradius = dist(node.obj.x,node.obj.y,rightnode.obj.x,rightnode.obj.y)

                        for (let i = node.index; i < rightnode.index; i++) {
                            let point = path[i]
                            this.modarr.push({
                                n:i,
                                start_mouse:{x:this.mouse.x,y:this.mouse.y},
                                start_POINT:{x:point.x,y:point.y},
                                rate:1-dist(this.mouse.x,this.mouse.y,point.x,point.y)/rightradius
                            })
                            
                        }
                        console.log(this.modarr)
                        for (let i = leftnode.index; i < node.index; i++) {
                            let point = path[i]
                            this.modarr.push({
                                n:i,
                                start_mouse:{x:this.mouse.x,y:this.mouse.y},
                                start_POINT:{x:point.x,y:point.y},
                                rate:1-dist(this.mouse.x,this.mouse.y,point.x,point.y)/leftradius
                            })
                            
                        }
                    }
                }
            }
        }
        
    }
    parseKeyPress(){
        if(keyIsDown(17)){
            if(keyIsDown(37)){ //Left Key
                for (let i = path.length-1; i > 0; i--) {
                    const e = path[i-1];
                    let ne = path[i]
                    if(e.gametime<this.wcursor&&(ne.buttons.k1||ne.buttons.k2)){
                        if(ne.buttons.k1&&!e.buttons.k1){
                            this.cursor_shift(e.gametime-this.cursor.range/2)
                            break;
                        } if(ne.buttons.k2&&!e.buttons.k2) {
                            this.cursor_shift(e.gametime-this.cursor.range/2)
                            break;
                        }
                    }
                }
            }
            if(keyIsDown(39)){ //Right Key
                for (let i = 1; i < path.length; i++) {
                    const e = path[i-1];
                    let ne = path[i]
                    if(e.gametime>this.wcursor&&(ne.buttons.k1||ne.buttons.k2)){
                        if(ne.buttons.k1&&!e.buttons.k1){
                            this.cursor_shift(e.gametime-this.cursor.range/2)
                            break;
                        } if(ne.buttons.k2&&!e.buttons.k2) {
                            this.cursor_shift(e.gametime-this.cursor.range/2)
                            break;
                        }
                    }
                }
            }
        }
    }
    parseRelease(){
        this.modarr = undefined
        
    }
    drawUR(){
        let r300 = timeline.ranges.blue
        let r100 = timeline.ranges.green
        let r50 = timeline.ranges.yellow
        push()
        let origin = {x:windowWidth/2,y:windowHeight - 30 - lower_timeline.active*100}
        strokeWeight(16)
        
        strokeCap(SQUARE)
        stroke(`#dcad46`)
        line(
            windowWidth/2 - (r50),
            windowHeight - 30 - lower_timeline.active*100,
            windowWidth/2 + (r50),
            windowHeight - 30 - lower_timeline.active*100
        )

        stroke(`#57e213`)
        line(
            windowWidth/2 - (r100),
            windowHeight - 30 - lower_timeline.active*100,
            windowWidth/2 + (r100),
            windowHeight - 30 - lower_timeline.active*100
        )

        stroke(`#39c6f2`)
        line(
            windowWidth/2 - (r300),
            windowHeight - 30 - lower_timeline.active*100,
            windowWidth/2 + (r300),
            windowHeight - 30 - lower_timeline.active*100
        )


        
        //Draw clicks until wcursor
        stroke('white')
        strokeWeight(2)
        if(timeline.hits){
            for (let i = 0; i < timeline.hits.length; i++) {
                const e = timeline.hits[i];
                if(e.time<this.wcursor){

                    drawingContext.globalAlpha = constrain(700/Math.abs(e.time-this.wcursor),0,1)
                    line(origin.x-e.pressRange,origin.y-15,origin.x-e.pressRange,origin.y+15)
                } else {break;}
            }
            for (let i = 0; i < timeline.hits.length; i++) {
                const e = timeline.hits[i];
                    if(e.selected){
                        stroke('blue')
                        line(origin.x-e.pressRange,origin.y-15,origin.x-e.pressRange,origin.y+15)
                    }
            }
        }
        

        pop()
    }

    selectPress(){
        if(timeline.hits){
            
            for (let i = 0; i < timeline.hits.length; i++) {
                const e = timeline.hits[i];
                if(e.time>this.cursor.start&&e.time<this.cursor.end){
                    
                    if(dist(e.position.x,e.position.y,this.mouse.x,this.mouse.y)<preview.beatmap.circleRadius){
                        e.selected = !e.selected;
                       
                    }

                    if(e.selected){
                        e.color = 'rgb(0,0,100)'
                    }
                    timeline.analyze()
                    
                }
                if(e.time>this.cursor.end){break;}
            }
        }
    }

    ctrlz(){
        console.log('trigger')
        if(oldpath.length>0){
            
            path = JSON.parse(oldpath[oldpath.length-1])
            timeline.analyze()
            oldpath.pop()
        }
        
    }

    create_key_point(){
        this.mode = 'advanced'
        this.closestPoint.keypoint = true
    }
    kill_keypoints(){
        for (let i = 1; i < path.length; i++) {
            const point = path[i-1];
            const nextpoint = path[i]
            point.keypoint = false;
            this.mode = 'brush'
        }
    }
    fixBrush(){
        if(this.mode == 'fixing'){
            this.kill_keypoints()
            this.mode = 'brush'
        } else {
            this.mode = 'fixing'
        }
        
    }
}



let editor
function createEditor(){
    editor = new EditorCanvas()
}