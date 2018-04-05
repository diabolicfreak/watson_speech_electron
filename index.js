const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const watson = require('watson-developer-cloud');
require('dotenv').config();
require('electron-reload')(__dirname);

const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`); 
});

/**Generate new token */
var authorization = new watson.AuthorizationV1({
  username: process.env.SPEECH_TO_TEXT_USERNAME,
  password: process.env.SPEECH_TO_TEXT_PASSWORD,
  url: 'https://stream.watsonplatform.net/authorization/api', // Speech tokens
});

authorization.getToken({
  url: 'https://stream.watsonplatform.net/speech-to-text/api'
},
function (err, token) {
  if (!token) {
    console.log('error:', err);
  } else {
    mainWindow.webContents.send(
      'watson:token',
      token
    );
  }
});
 
/**Send length of media file */
ipcMain.on('video:submit', (event, path)=>{
  ffmpeg.ffprobe(path, (err, metadata)=>{
    mainWindow.webContents.send(
      'video:metadata',
      metadata.format.duration
    );
  });
});

