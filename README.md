node-filesaver
==============

Stores files in folders easily with node.js.
**NOT READY FOR PRODUCTION**


## Installation

Install with npm
```
$ npm install filesaver
```


## Features

- Safe filenames
- Avoid duplicate names
- Add, overwrite or replace files in collections/folders

## Usage

```js
var Filesaver = require( 'filesaver' );
```

## API

### Filesaver(folders)

Filesaver constructor

Example:

```js
var folders = {
    images: './images',
    books: './books'
}
var filesaver = new Filesaver( folders );
```

**Parameters**

- **folders**:  *Object*,  Folders schema



### addFolder(name, path, callback)

Add a new folder

Example:

```js
filesaver.addFolder( 'documents', './path/to/folder', function () {
// do something
});
```


**Parameters**

- **name**:  *String*,  name of new folder collection
- **path**:  *Object*,  path to its folder
- **callback**:  *Function*,  no signature callback



### add(folder, origin, target, callback)

Add a new file without overwrite anyone

Example:

```js
filesaver.add( 'images', '/path/to/temp/file.jpg', 'avatar.jpg', function (err, data) {
    console.log( data );
    // ->
    // filename: 'avatar_2.jpg',
    // filepath: './images/avatar_2.jpg'
});
```

**Parameters**

- **folder**:  *String*,  Name of folder to insert the file
- **origin**:  *String*,  path to origin file
- **target**:  *String*,  name of target file
- **callback**:  *Function*,  Signature: error, data. Data signature:{filename, filepath}



### swap(folder, origin, target, callback)

Remove old file and then add the new one

Example:

```js
filesaver.swap( 'images', '/path/to/temp/file.jpg', 'willBeRemoved.jpg', function (err, data) {
    console.log( data );
    // ->
    // filename: 'file.jpg',
    // filepath: './images/file.jpg'
});
```

**Parameters**

- **folder**:  *String*,  name of folder
- **origin**:  *String*,  path to origin file
- **target**:  *String*,  name of file to remove
- **callback**:  *Function*,  Signature: error, data. Data signature:{filename, filepath}



### replace(folder, origin, target, callback)

Write or overwrite file

Example:

```js
filesaver.replace( 'images', '/path/temp/file.jpg', 'avatar.jpg', function (err, data) {
    console.log( data );
    // ->
    // filename: 'avatar.jpg',
    // filepath: './images/avatar.jpg'
});
```

**Parameters**

- **folder**:  *String*,  name of parent folder folder
- **origin**:  *String*,  path to origin file
- **target**:  *String*,  name of target file
- **callback**:  *Function*,  Signature: error, data. Data signature:{filename, filepath}



<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/node-filesaver/master/LICENSE)