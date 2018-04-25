/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
//  import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

let win

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

function sendStatusToWindow (ev, text) {
  win.webContents.send('message', { event: ev, message: text })
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('checking', 'Buscando actualizaciones')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('available', 'Version disponible')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('notAvailable', '')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('error', 'Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let percent = `${Math.floor(progressObj.percent)} %`
  let downloaded = formatSizeUnits(progressObj.transferred)
  let total = formatSizeUnits(progressObj.total)

  sendStatusToWindow('downloading', `${percent} (${downloaded} / ${total})`)
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('downloaded', 'Instalar actualizacion')
})

function confirm () {
  autoUpdater.quitAndInstall()
}

function formatSizeUnits (bytes) {
  if (bytes >= 1073741824) {
    bytes = `${(bytes / 1073741824).toFixed(2)} GB`
  } else if (bytes >= 1048576) {
    bytes = `${(bytes / 1048576).toFixed(2)} MB`
  } else if (bytes >= 1024) {
    bytes = `${(bytes / 1024).toFixed(2)} KB`
  } else if (bytes >= 1) {
    bytes = `${bytes} B`
  }

  return bytes
}

function checkForUpdates (currentWindow) {
  win = currentWindow
  if (process.env.NODE_ENV === 'development') {
    sendStatusToWindow('dev', '')
  } else {
    try {
      autoUpdater.checkForUpdatesAndNotify()
    } catch (error) {
      log.info('error', error)
    }
  }
}

export default {
  checkForUpdates,
  confirm
}
