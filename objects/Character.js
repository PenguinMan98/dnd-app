const electron = require('electron');
const { ipcMain } = electron;
const Gun = require('gun');
const localData = new Gun();
const characters = localData.get('characters');

class Character{
  constructor( cId, callback ) {
    console.log('character being created',cId);
    // fetch the character from Gun
    characters.get(cId).on( (character, key) => {
      console.log('gun returns:',character,key);
      character.id = key;
      this.buildCharacter(character, callback);
    });
  }

  // build the local data from the data returned by Gun
  buildCharacter( character, callback ){
    delete character['_'];
    delete character['>'];
    console.log('character data received', character);
    callback(character);
  }
  // save the local data to Gun
  saveCharacter( ){
    console.log('saving character data ');
  }
}

module.exports = Character;

