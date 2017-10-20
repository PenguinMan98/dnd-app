const electron = require('electron');
const { Tray } = electron;

class DndTray extends Tray{
  constructor( iconPath, windows ){
    super( iconPath );
    //this.windows = windows;

    this.on('click',(event, bounds) => {
      if(windows.quickReference.window && windows.quickReference.window.isVisible()){
        this.appHide();
      }else{
        this.appShow();
      }
    });
  }
  appHide(){
    let thisWindow;
    for(let i in this.windows){
      thisWindow = this.windows[i].window;
      if(this.windows.hasOwnProperty(i) && thisWindow && thisWindow.isVisible){
        this.windows[i].active = true;
        thisWindow.hide();
      }
    }
  };
  appShow(){
    for(let i in this.windows){
      if(this.windows.hasOwnProperty(i) && this.windows[i].active){
        this.windows[i].active = false;
        this.windows[i].window.show();
      }
    }
  };
}

module.exports = DndTray;