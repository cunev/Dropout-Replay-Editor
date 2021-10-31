// @ts-nocheck

let preloader
let indrag = false;
let indrags = 0
function initPreloader(){
    preloader = createGraphics(614,440)
    preloader.noStroke()
    preloader.background("#101010")



    
    preloader.fill('#171717')
    preloader.rect(0,0,614,24)

    preloader.image(editorgabu,384,40,412,824.8)

    preloader.image(closer,589,2,19,19)
    
    preloader.image(japanese,10,5)

    preloader.textFont(roboto)
    preloader.fill('white')
    preloader.textSize(30)
    preloader.text('Dropout 5',71,116)

    preloader.textSize(25)
    preloader.text('dropout.cc Replay Editor',71,144)


    document.querySelector("#defaultCanvas0").addEventListener('drop', (event) => { 
        event.preventDefault(); 
        event.stopPropagation(); 
        let path = ''
        for (const f of event.dataTransfer.files) { 
            // Using the path attribute to get absolute file path 
            console.log('File Path of dragged files: ', f.path) 
            path = f.path
        }
        
        createEditorX(path)

    }); 

      
    document.querySelector("#defaultCanvas0").addEventListener('dragover', (e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        indrag = true;
        indrags = 0
      });
      
}

let colorbase = '#F2F2F2'
let darken = '#E3E3E3'
function draw_preloader(){
    push()
        image(preloader,0,0)
        
        push()
        noStroke();
            
        fill("#171717")
        rect(71,208,276,155,7)

        textFont(roboto)

        
        fill('#A5A5A5')
        textAlign(CENTER, CENTER)
        textSize(16)
        if(indrag){
            text('Drag it here :)',71+276/2,208+155/2)
        } else {
            text('Drag & drop replay here',71+276/2,208+155/2)
        }

        pop()
    pop()
    indrags++

    if(indrags>15){
        indrag = false;
    }
    
    
    
}



  