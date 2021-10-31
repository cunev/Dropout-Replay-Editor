const OsuReplay = require('@brunohpaiva/osu-parser').OsuReplay
const fs = require('fs')
let replay
let path
let duration = 0
let replay_name = 'replay'
let mapImage
let resized = false;
const API_KEY = require('./config.json').API_KEY

function loadReplay(folder){
    const filePath = folder;
    const buffer = fs.readFileSync(filePath);
    replay = OsuReplay.parse(buffer);
    path = replay.actions

    fetch(`https://osu.ppy.sh/api/get_beatmaps?k=${API_KEY}&h=${replay.beatmapHash}`).then(e=>{
        e.json().then((n)=>{
            
            n = n[0]
            console.log(n)
            mapImage = `https://assets.ppy.sh/beatmaps/${n.beatmapset_id}/covers/list@2x.jpg`
            let imgmap = createImg(mapImage,'ref')
            imgmap.position(56,50)
            imgmap.elt.style.borderRadius = '4px'
            imgmap.elt.style.width = '110px'
            imgmap.elt.style.height = '36px'
            imgmap.elt.style.objectFit = 'cover'
            ready(n.version,n.beatmapset_id)
 
        })
    })

    let summation = 0
    path.forEach(e=>{
        summation+=e.timestamp
        e['gametime'] = summation
        if(summation>duration){duration = summation}

        let temp_buttons = {k1:false,k2:false}
        if(e.buttons){
            if(e.buttons.includes('KeyboardOne')||e.buttons.includes('MouseOne')){temp_buttons.k1 = true}
            if(e.buttons.includes('KeyboardTwo')||e.buttons.includes('MouseTwo')){temp_buttons.k2 = true}
        }
        
        e['buttons'] = temp_buttons
    })
    
}

function saveReplay(){
    let newpath = []
    path.forEach(e=>{
        newpath.push({
            timestamp:e.timestamp,
            x:e.x,
            y:e.y,
            buttons:[]
        })
        if(e.buttons.k1){newpath[newpath.length-1].buttons.push('KeyboardOne','MouseOne')}
        if(e.buttons.k2){newpath[newpath.length-1].buttons.push('KeyboardTwo','MouseTwo')}
    })
    replay.actions = newpath
    replay.playerName = `${Math.round(Math.random()*100000)}`
    const osuBuffer = replay.writeToOsuBuffer();
    const buffer = osuBuffer.buffer;
    const filePath = `./${replay_name}_edited.osr`;
    require('fs').writeFileSync(filePath, buffer);
    Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
}