const {app, BrowserWindow, Menu} = require('electron')
const {dialog} = require('electron')
const fs = require('fs')
let win

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click () {
          const [selectedFile] =
            dialog.showOpenDialog({properties: ['openFile']}) || []
          if (!selectedFile) {return}
          fs.readFile(selectedFile, (err, contents) => {
            win.webContents.send('file-open', {
              filename: selectedFile,
              contents: contents.toString()
            });
          })
        }
      }
    ]
  }
]));
