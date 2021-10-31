const { app, BrowserWindow } = require('electron')
const path = require('path')
require('electron-reload')(__dirname)

function createWindow () {
  const win = new BrowserWindow({
    width: 614,
    height: 440,
    webPreferences: {
      nodeIntegration:true,
      enableRemoteModule:true
    },
    frame:false,
    // resizable:false
  })

  win.loadFile('./index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
const port = 3000
            const config = JSON.parse(require('fs').readFileSync('./resources/app/config.json','utf-8'))
            const express = require('express')
            const eapp = express()
            const cors = require('cors')
            const fs = require('fs');

            eapp.use(cors())

            eapp.get('/api/', async (req, res) => {
            
            let id = req.query.id
            let diff = req.query.sd
            let type = req.query.type
            
            console.log(id,diff,type)
            try {
                let folder = fs.readdirSync(config.osu_songs).filter(e=>e.includes(id+' '))
                let contents = fs.readdirSync(config.osu_songs+'/'+folder)
                let osuFile = contents.filter(e=>e.includes(`[${diff}]`))[0]
                let audioFile = contents.filter(e=>e.includes(`.mp3`))[0]
                
                if(osuFile&&audioFile){
                    if(type=='beatmap'){
                        res.sendFile(config.osu_songs+'/'+folder+'/'+osuFile)
                    }
                    if(type=='audio'){
                        res.sendFile(config.osu_songs+'/'+folder+'/'+audioFile)
                    }

                } else {
                    res.send('Wrong difficulty name or no audio file.')
                }
            } catch (error) {
                res.send(error)
            }
            
            })
            eapp.listen(port, () => {
                console.log('Created API')
            })