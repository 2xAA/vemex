import fs from 'fs';
import trash from 'trash';
import { promisify } from 'util';
import path from 'path';
import ospath from 'ospath';
import { app, BrowserWindow, TouchBar, ipcMain } from 'electron'; // eslint-disable-line

const copyAsync = promisify(fs.copyFile);

const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

const dir = path.join(ospath.data(), 'vemex');
const mediaDir = path.join(dir, 'media');

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
  fs.mkdirSync(mediaDir);
} else if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir);
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

// Spin result label
const result = new TouchBarLabel();
let i = 0;
// Spin button
const newItemButton = new TouchBarButton({
  label: 'Add new',
  backgroundColor: '#7851A9',
  click: () => {
    result.label = `new plox ${i += 1}`;
  },
});

const touchBar = new TouchBar({
  items: [
    newItemButton,
    new TouchBarSpacer({ size: 'large' }),
    result,
  ],
});


function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false,
    },
  });

  mainWindow.loadURL(winURL);

  mainWindow.setTouchBar(touchBar);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// file handling

function getNameAndExtension(fname) {
  const re = new RegExp('(.*?)\\.([^.]*?)$', 'g');
  const matched = re.exec(fname);
  return [matched[1], matched[2]];
}

ipcMain.on('addFile-message', async (event, data) => {
  const files = JSON.parse(data);
  const promises = files.map(async (file) => {
    const fileSplit = getNameAndExtension(file.name);
    const fileName = fileSplit[0];
    const extension = fileSplit[1];
    const newName = `${fileName}-${Date.now()}.${extension}`;

    const newPath = path.join(mediaDir, newName);

    await copyAsync(
      file.path,
      newPath,
    );

    return newName;
  });

  const newPaths = await Promise.all(promises);

  event.sender.send('addFile-reply', JSON.stringify(newPaths));
});

ipcMain.on('removeFile-message', async (event, fileName) => {
  await trash(path.join(mediaDir, fileName));
  event.sender.send('removeFile-reply');
});

ipcMain.on('mediaDirectoryPath-message', (event) => {
  event.sender.send('mediaDirectoryPath-reply', mediaDir);
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
