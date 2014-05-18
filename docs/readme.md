node-filesaver
==============

Stores files in folders easily with node.js


## Installation

Install with npm
```
$ npm install filesaver
```


## Features

- Safe filenames
- Avoid duplicate names
- Add, overwrite or replace files in collections/folders

## Example

```js
var Filesaver = require( 'filesaver' );

var folders = {
	images: './images'
}

var filesaver = new Filesaver({ folders: folders, safenames: true });

filesaver.add( 'images', ./path/to/file.jpg, 'photo.jpg', function (err, data) {
    console.log( data );
    // => {filename: 'photo_2.jpg', filepath: './images/photo_2.jpg'}
});
```

