const electron = require('electron');
const { ipcMain } = electron;
const Gun = require('gun');
const localData = new Gun();
const characters = localData.get('characters');

class Character{
  constructor( cId ) {
    console.log('character being created',cId);
    // fetch the character from Gun
    characters.get(cId).on(this.buildCharacter.bind(this));
  }

  // build the local data from the data returned by Gun
  buildCharacter( character, key ){
    console.log('character data received', character.name, key);
  }
  // save the local data to Gun
  saveCharacter( ){
    console.log('saving character data ');
  }
}

module.exports = Character;

// catch a new character creation event.
ipcMain.on('character:new', () => {
  console.log('building new character');
  currentCharacter = new Character();
});
// catch a load character event
ipcMain.on('character:load',(event, data) => {
  console.log('building character from id', data.cId);
  currentCharacter = new Character(data.cId);
});

