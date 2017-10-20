const Path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain, Tray } = electron;
const Gun = require('gun');
const localData = new Gun();
const Character = require('./objects/Character.js');
const DndTray = require('./objects/DndTray.js');

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
let currentCharacter = null;

let windows = {
  'characterSelect': {},
  'quickReference': {},
  'description': {},
  'mainStats': {}
};
let tray;

app.on('ready', () => {
  // First, bootstrap the app
  const iconName = isWin ? 'penguin_heart_icon_uYg_icon.ico' : 'penguin_heart_icon_mac.png';
  const iconPath = Path.join(__dirname, `./assets/${iconName}`);
  tray = new DndTray(iconPath, windows);

  // then open up a character selection window.
  popCharacterSelect();
  // boot up the quick reference window. This is the main window of the app. If this one is closed, exit the app.
  if( typeof windows.quickReference.window === 'undefined' ) {
    windows.quickReference.window = new BrowserWindow({
      width: 600,
      height: 400,
      title: 'Quick Reference',
      frame: true,
      resizable: true,
      show: false,
      skipTaskbar: true
    });
    windows.quickReference.window.loadURL(`file://${__dirname}/templates/quick-reference.html`);
    windows.quickReference.window.on('closed',() => { windows.quickReference.window = null; appClose(); } );
  }
});


// ===== UI EVENTS =====

// catch a new character creation event.
ipcMain.on('character:new', () => {
  console.log('building new character');
  currentCharacter = new Character(null, (character) => {
    console.log('new character callback',character);
    loadCharacter(character);
  });
});

// catch a load character event
ipcMain.on('character:load',(event, data) => {
  console.log('building character from id', data.cId);
  currentCharacter = new Character(data.cId, (character) => {
    console.log('new character callback',character);
    loadCharacter(character);
  });
});

// ===== Helper Functions =====

let loadCharacter = function( character ){
  console.log('loading quick reference with character', character);
  windows.quickReference.window.send('character:load',{'character': character});
  windows.quickReference.window.show();
  // these lines build the menu template
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
};

let popCharacterSelect = function(){
  console.log(typeof windows.characterSelect.window);
  if( typeof windows.characterSelect.window === 'undefined' || !windows.characterSelect.window ) {
    windows.characterSelect.window = new BrowserWindow({
      width: 300,
      height: 400,
      title: 'Choose a Character',
      frame: false,
      skipTaskbar: true
    });
    //console.log('app cs window bounds',windows.characterSelect.window.getBounds().height,windows.characterSelect.window.getBounds().width);
    windows.characterSelect.window.loadURL(`file://${__dirname}/templates/character-select.html`);
    windows.characterSelect.window.on('closed',() => windows.characterSelect.window = null );
  }else{
    windows.characterSelect.window.show();
  }
};

let appClose = function(){
  for(let i in windows){
    if(windows.hasOwnProperty(i)){
      windows[i].window = null;
    }
  }
  app.quit();
};

// basic menu
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Characters',
        accelerator: isMac ? 'Command+S' : 'Ctrl+S',
        click(){
          popCharacterSelect();
        }
      },
      {
        label: 'Quit',
        accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];
// mac fix
if( isMac ){
  menuTemplate.unshift({});
}
// dev only
if( process.env.NODE_ENV !== 'production'){
  menuTemplate.push({
    label:'Dev',
    submenu:[
      {
        label: 'Open Dev Tools',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  })
}

// SNIPPETS
// ipcMain.on('thing:action', (event, data) => {
//   console.log('I got data:',data);
// });
// windows.characterSelect.window.send('thing:action',{});

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