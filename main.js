const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const ipc = ipcMain;

// Advoid the installer go start the app multiple times
if (require('electron-squirrel-startup')) return app.quit();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 600,
        minHeight: 532,
        titleBarStyle: 'hidden',
        frame: false,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: "icon source here",
    });

    ipc.on("closeApp", () => {
        mainWindow.close();
    });
    ipc.on("minApp", () => {
        mainWindow.minimize();
    });
    ipc.on("maxApp", () => {
        if(mainWindow.isMaximized()) {
            mainWindow.webContents.send("changeIr");
            mainWindow.restore();
        } else {
            mainWindow.webContents.send("changeImx");
            mainWindow.maximize();
        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        });

    mainWindow.loadFile("src/index.html")
    }

    app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});