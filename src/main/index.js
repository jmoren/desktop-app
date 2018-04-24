'use strict'

import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'
import manualUpdater from './manual_updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let menu

const menuTemplate = [
  {
    label: 'BarManager',
    submenu: [
      {
        label: 'Mesas',
        accelerator: 'CmdOrCtrl+M',
        click: () => {
          openPage('tables')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Clientes',
        accelerator: 'CmdOrCtrl+C',
        click: () => {
          openPage('clients')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Deliveries',
        accelerator: 'CmdOrCtrl+D',
        click: () => {
          openPage('deliveries')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Tickets',
        accelerator: 'CmdOrCtrl+T',
        click: () => {
          openPage('tickets')
        }
      }
    ]
  },
  {
    label: 'Buscar',
    submenu: [
      {
        label: 'Clientes',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          openPage('search')
        }
      }
    ]
  },
  {
    label: 'Administracion',
    submenu: [
      {
        label: 'Usuarios',
        accelerator: 'CmdOrCtrl+U',
        click: () => {
          openPage('Usuarios')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Reportes',
        accelerator: 'CmdOrCtrl+T',
        click: () => {
          openPage('Reportes')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Productos',
        accelerator: 'CmdOrCtrl+P',
        click: () => {
          openPage('Productos')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Configuaracion',
        accelerator: 'CmdOrCtrl+F',
        click: () => {
          openPage('Configuracion')
        }
      }
    ]
  },
  {
    label: 'Info',
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
        type: 'separator'
      },
      {
        label: 'Actualizaciones',
        click: () => {
          manualUpdater.checkForUpdates(mainWindow)
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Salir',
        role: 'quit'
      }
    ]
  },
  {
    label: 'Dev',
    submenu: [
      {
        label: 'DevTools',
        role: 'toggledevtools'
      }
    ]
  }
]

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  mainWindow = new BrowserWindow({
    backgroundColor: '#E4E7ED',
    width: 1024,
    height: 800
  })

  // Add menu
  menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function openPage (page) {
  if (page === 'search') {
    mainWindow.webContents.send('open-search')
  } else if (page === 'clients') {
    mainWindow.webContents.send('open-page', page)
  } else if (page === 'tables') {
    mainWindow.webContents.send('open-page', page)
  } else {
    console.log(`Open page: ${page}`)
  }
}

function startListenerUpdater () {
  ipcMain.on('ready-to-messages', () => {
    manualUpdater.checkForUpdates(mainWindow)
  })

  ipcMain.on('install-updates', (event, args) => {
    if (process.env.NODE_ENV === 'development') {
      app.quit()
    } else {
      manualUpdater.confirm()
    }
  })
}

app.on('ready', () => {
  startListenerUpdater()
  createWindow()
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
