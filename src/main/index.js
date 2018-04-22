'use strict'

import { app, BrowserWindow, Menu, dialog } from 'electron'
import manualUpdater from './auto_updater.js'

console.log(manualUpdater)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const menuTemplate = [
  {
    label: 'Bar Manager',
    submenu: [
      {
        label: 'About',
        click: () => {
          dialog.showMessageBox({
            type: 'none',
            buttons: ['Cerrar'],
            title: 'About',
            message: 'Bar Manager 3.0',
            detail: 'Sistema integral para administrar tu restaurante, bar, pizzeria, etc...'
          })
        }
      },
      {
        label: 'Actualizaciones',
        click: manualUpdater.checkForUpdates
      },
      {
        type: 'separator'
      },
      {
        label: 'Salir',
        click: () => {
          app.quit()
        }
      }
    ]
  }
]

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  const menu = Menu.buildFromTemplate(menuTemplate)
  // menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
  // menu.append(new MenuItem({type: 'separator'}))
  // menu.append(new MenuItem({label: 'MenuItem2', type: 'checkbox', checked: true}))

  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
