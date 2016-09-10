const {app, BrowserWindow, Menu} = require('electron')
const {dialog} = require('electron')
const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
require('electron-reload')(__dirname);
let win

function createWindow () {
  win = new BrowserWindow({width: 1200, height: 600})
  win.loadURL(`file://${__dirname}/index.html`)

  win.on('closed', () => {
    win = null
  })

  win.webContents.on('did-finish-load', () => {
    openFile(win, path.resolve(__dirname, 'main.js'))
  })
}

function openFile (instance, filename) {
  fs.readFile(filename, (err, contents) => {
    const text = contents.toString()
    const ast = acorn.parse(text)
    instance.webContents.send('file-open', {filename, text, ast});
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
          readFile(selectedFile);
        }
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform ===
          'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      }
    ]
  }
]));
