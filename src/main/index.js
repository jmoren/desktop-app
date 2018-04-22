'use strict'

import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import manualUpdater from './manual_updater.js'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let menu

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
        label: 'Check Updates',
        click: () => {
          manualUpdater.checkForUpdates(mainWindow)
        }
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
  },
  {
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Open Dev tools',
        click: () => {
          mainWindow.webContents.openDevTools()
        }
      }
    ]
  }
]

function createWindow () {
  mainWindow = new BrowserWindow({
    backgroundColor: '#E4E7ED'
  })

  menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(winURL)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.on('dom-ready', () => {
    manualUpdater.checkForUpdates(mainWindow)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

ipcMain.on('install-updates', (event, args) => {
  if (process.env.NODE_ENV === 'development') {
    app.quit()
  } else {
    manualUpdater.confirm()
  }
})

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
