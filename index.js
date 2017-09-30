const electron = require('electron');
const { app, BrowserWindow, Menu } = electron;

let windows = {
  'characterSelect': {},
  'quickReference': {},
  'description': {},
  'mainStats': {}
};

app.on('ready', () => {
  // First, bootstrap the app
  // then open up a character selection window.
  if( typeof windows.characterSelect.window === 'undefined' ) {
    windows.characterSelect.window = new BrowserWindow({
      width: 300,
      height: 200,
      title: 'Choose a Character'
    });
    windows.characterSelect.window.loadURL(`file://${__dirname}/templates/character-select.html`);
  }
});

// function createNewWindow( type, title){
//   winType = typeof type === 'Object' ? type : BrowserWindow;
//   if( typeof windows[type] === undefined ){ return false; }
//   if( typeof windows[type].window === undefined ) {
//     let window = new winType({
//       width: 300,
//       height: 200,
//       title: title ? title : 'Untitled Window'
//     });
//   }
// }

// SNIPPETS
// app.on('ready', () => {
//   //mainWindow = new BrowserWindow({});
//   //mainWindow.loadURL(`file://${__dirname}/templates/index.html`);
//   //mainWindow.on('closed', () => app.quit() );
//
//   characterSelectWindow = new BrowserWindow({});
//   characterSelectWindow.loadURL(`file://${__dirname}/templates/character-select.html`);
//
//   const mainMenu = Menu.buildFromTemplate(menuTemplate);
//   Menu.setApplicationMenu(mainMenu);
// });
//
//
// const menuTemplate = [
//   {
//     label: 'File',
//     submenu: [
//       {
//         label: 'Open Characters',
//         click(){ createNewWindow() }
//       },
//       {
//         label: 'Quit',
//         accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
//         click() {
//           app.quit();
//         }
//       }
//     ]
//   }
// ];
// if( process.platform === 'darwin'){
//   menuTemplate.unshift({});
// }
// if( process.env.NODE_ENV !== 'production'){
//   menuTemplate.push({
//     label:'Dev',
//     submenu:[
//       {
//         label: 'Open Dev Tools',
//         click(item, focusedWindow){
//           focusedWindow.toggleDevTools();
//         }
//       }
//     ]
//   })
// }