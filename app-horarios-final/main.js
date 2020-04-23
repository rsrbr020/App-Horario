// const electron= require("electron");

// const {app, BrowserWindow} = electron;
// let mainWindow;

// // var win = new BrowserWindow({
// //     minWidth: 300,
// //     minHeight: 300
// // });


// app.on("ready", ()=>{
//     const icon= __dirname+ "/src/img/logo.png";
//     mainWindow= new BrowserWindow({
//         width: 800, 
//         height: 600,
//         backgroundColor: "#000",
//         show: true,
//         minWidth: 500, 
//         minHeight: 400, 
//         icon,
//         webPreferences:{
//             nodeIntegration: true
//         }
//     });
//     mainWindow.loadFile(__dirname+ "/src/index.html");
//     mainWindow.on("closed", function(){
//         mainWindow = null;
//     });
// });


const { app, BrowserWindow} = require('electron');

app.setAppUserModelId("com.vrldesenvolvimento.app-horarios-electron");

function createWindow(){
  const icon= __dirname+ "/src/img/logo1.png";
  // Cria uma janela de navegação.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // retirar dev tools
      devTools: false
    },
    backgroundColor: "#FFFFFF",
    show: true,
    minWidth: 500, 
    minHeight: 400, 
    icon,
    frame: false
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  // and load the index.html of the app.
  win.loadFile(__dirname+ '/src/index.html');

  // Open the DevTools.
  win.webContents.openDevTools();

  // retirar menu do electron, nao atualiza se tirar
  win.setMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
  app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // No macOS é comum para aplicativos e sua barra de menu 
  // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.