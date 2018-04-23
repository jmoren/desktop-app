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
  sendStatusToWindow('checking', 'Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('available', 'Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('notAvailable', 'Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('error', 'Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = 'Downloaded ' + Math.floor(progressObj.percent) + '%'
  logMessage = logMessage + ' (' + Math.floor(progressObj.transferred) + '/' + Math.floor(progressObj.total) + ')'
  sendStatusToWindow('downloading', logMessage)
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('downloaded', 'Update downloaded')
})

function confirm () {
  autoUpdater.quitAndInstall()
}

function checkForUpdates (currentWindow) {
  win = currentWindow
  if (process.env.NODE_ENV === 'development') {
    sendStatusToWindow('dev', 'Dev mode')
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
