// @ts-nocheck

let lower_timeline
function createLowerTimeline(){
    lower_timeline = new LowerTimeline()
}

class LowerTimeline{
    constructor(){
        this.pg = createGraphics(windowWidth, 350)
        this.redraw()


        this.active = true;
    }
    redraw(){
        this.pg.background(colors.lower.back)
        let kp = {k1:false,k2:false}
        let regions = []
        this.pg.push()
        this.pg.noStroke()
        this.pg.fill(colors.lower.zones)
        this.pg.rect(40,30,width-80,45,15)

        this.pg.rect(40,105,width-80,45,15)

        this.pg.pop()
        this.pg.push()
        for (let i = 1; i < path.length; i++) {

            
            if(path[i].gametime>editor.cursor.start){
                let rate = (path[i].gametime-editor.cursor.start)/(editor.cursor.end-editor.cursor.start)
                let xat = rate*windowWidth
                if(path[i].isSlice){
                    this.pg.push()
                    this.pg.stroke('red')
                    this.pg.strokeWeight(3)
                    this.pg.line(xat,windowHeight-100,xat,windowHeight)
                    this.pg.pop()
                }
                

                let p = path[i-1]
                let np = path[i]
                

                if(p.buttons.k1&&kp.k1==false){
                    kp.k1 = p.gametime
                }
                if(!p.buttons.k1&&kp.k1!==false){
                    regions.push({start:kp.k1,end:p.gametime,type:'k1'})
                    kp.k1 = false;
                }
                if(p.buttons.k2&&kp.k2==false){
                    kp.k2 = p.gametime
                }
                if(!p.buttons.k2&&kp.k2!==false){
                    regions.push({start:kp.k2,end:p.gametime,type:'k2'})
                    kp.k2 = false;
                }
                
            }

            //End here
            if(path[i].gametime>editor.cursor.end)break;
            
        }

        if(kp.k1!==false){
            regions.push({start:kp.k1,end:editor.cursor.end,type:'k1'})
            kp.k1 = false;
        }
        if(kp.k2!==false){
            regions.push({start:kp.k2,end:editor.cursor.end,type:'k2'})
            kp.k2 = false;
        }
        this.pg.noStroke()
        if(timeline.hits){
            for (let i = 0; i < timeline.hits.length; i++) {
                const circle = timeline.hits[i];
                if(circle.time>editor.cursor.start){
                    let rate = (circle.time-editor.cursor.start)/(editor.cursor.end-editor.cursor.start)
                    let xat = rate*windowWidth
                    this.pg.push()
                        this.pg.drawingContext.globalAlpha = 0.95
                        this.pg.fill(colors.lower.normalclicks)
                        if(circle.bad===true){
                            this.pg.fill(colors.reds)
                        }
                        if(circle.selected){
                            this.pg.stroke('blue')
                            this.pg.strokeWeight(3)
                        }
        
                        if(circle.bad==='100'){
                            this.pg.fill(colors.greens)
                        }
                        if(circle.bad==='50'){
                            this.pg.fill(colors.yellows)
                        }
                        let base = 172/2
                        if(circle.duration){
                            let rate2 = ((circle.time+circle.duration)-editor.cursor.start)/(editor.cursor.end-editor.cursor.start)
                            let xat2 = rate2*windowWidth
                            this.pg.rect(xat,base,xat2-xat,10,9)
                        } else {
                            this.pg.rect(xat,base,10,10,9)
                        }
                        
                    this.pg.pop()
                }

                if(circle.time>editor.cursor.end)break;
            }
        }
        
        regions.forEach(e=>{
            if(!e.end){
                e.end = 25
            }
            let rate = (e.start-editor.cursor.start)/(editor.cursor.end-editor.cursor.start)
            let xat = rate*windowWidth
            let rate2 = (e.end-editor.cursor.start)/(editor.cursor.end-editor.cursor.start)
            let xat2 = rate2*windowWidth
            if(e.type == 'k1'){
                this.pg.fill('#BB6BD9')
                this.pg.rect(xat,36,xat2-xat,32,5)
            }
            if(e.type == 'k2'){
                this.pg.fill('#F2994A')
                this.pg.rect(xat,111,xat2-xat,32,5)
            }
            
        })

        this.pg.pop()
        this.pg.push()

        this.pg.strokeJoin(ROUND)
        this.pg.fill(colors.lower.tri)
        this.pg.strokeWeight(2.5)
        this.pg.stroke(colors.lower.tri)
        this.pg.triangle(width/2-6,25-15, width/2+6,25-15, width/2,20)
        
        this.pg.line(windowWidth/2,30,windowWidth/2,145)
        this.pg.pop()
    }

    drawSlices(){
        push()
        stroke('rgba(255,255,255,0.6)')
        strokeWeight(1)
        for (let i = 1; i < path.length; i++) {

            
            if(path[i].gametime>editor.cursor.start){
                
                if(path[i].isSlice){
                    let rate = (path[i].gametime-editor.cursor.start)/(editor.cursor.end-editor.cursor.start)
                    let xat = rate*windowWidth
                    
                    line(xat,windowHeight-100,xat,windowHeight)
                    
                }
            }

            //End here
            if(path[i].gametime>editor.cursor.end)break;
            
        }
        pop()
    }
    draw(){
        if(this.active){
            
            if(this.drawIn){
                this.add()
                this.redraw()
            }
            push()
            drawingContext.shadowBlur = 11
            drawingContext.shadowColor = 'rgba(0,0,0,0.20)'
            image(this.pg,0,windowHeight-172)
            pop()
            this.drawSlices()
        }
        
        
    }

    drawSlicerPointer(){
        if(mouseY>windowHeight-100 && this.active){
            push()
                strokeWeight(1)
                stroke('red')
                let xat = mouseX
                line(xat,windowHeight-100,xat,windowHeight)

            pop()
        }
       
    }

    add(){
        if(mouseY>windowHeight-86){ //K2
            let rate = (mouseX)/windowWidth
            let xat = editor.cursor.start + rate*(editor.cursor.end-editor.cursor.start)
            let closest = Infinity
            let el
            for (let i = 0; i < path.length; i++) {
                const e = path[i];
                if(Math.abs(xat-e.gametime)<closest){
                    closest = Math.abs(xat-e.gametime)
                    el = e
                }
                
            }
            if(mouseButton==0){
                el.buttons.k2 = true;
            } else {
                el.buttons.k2 = false;
            }
            
        } else { //K1
            let rate = (mouseX)/windowWidth
            let xat = editor.cursor.start + rate*(editor.cursor.end-editor.cursor.start)
            let closest = Infinity
            let el
            for (let i = 0; i < path.length; i++) {
                const e = path[i];
                if(Math.abs(xat-e.gametime)<closest){
                    closest = Math.abs(xat-e.gametime)
                    el = e
                }
                
            }
            if(mouseButton==0){
                el.buttons.k1 = true;
            } else {
                el.buttons.k1 = false;
            }
        }
    }


    parsePress(button){
        if(this.active){
            if(mouseY>windowHeight-172){
                this.drawIn = true;
            }
        }
        
    }
    parseRelease(){
        this.drawIn = false;
    }

    slice(){
        if(mouseY>windowHeight-100){
            let rate = (mouseX)/windowWidth
            let xat = editor.cursor.start + rate*(editor.cursor.end-editor.cursor.start)
            for (let i = 0; i < path.length; i++) {
                const second = path[i];
                if(second.gametime>xat){
                    const first = path[i-1]
                    // first.isSlice = true;
                    // second.isSlice = true;


                    let newOne = JSON.parse(JSON.stringify(first))


                    let time_total = second.gametime-first.gametime
                    let time_current = (xat-first.gametime)/time_total
                    newOne.gametime = time_current*time_total + first.gametime
                    let pos_total = second.gametime-first.gametime
                    let pos_current = newOne.gametime-first.gametime
                    let pos_rate = pos_current/pos_total



                    let vp = {
                        x:first.x + (second.x-first.x)*pos_rate,
                        y:first.y + (second.y-first.y)*pos_rate
                    }

                    newOne.x = vp.x
                    newOne.y = vp.y

                    newOne.isSlice = true;


                    newOne.timestamp = Math.round(second.timestamp*pos_rate)
                    console.log(newOne.timestamp)
                    second.timestamp = second.timestamp-newOne.timestamp


                    newOne.gametime = first.gametime+newOne.timestamp
                    path = [...path.slice(0,i),newOne,...path.slice(i,path.length)]
                    break;
                }
                // e.isSlice = true;
            }
        }
        
    }
}
