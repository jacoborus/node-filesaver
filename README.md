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

## Usage

```js
var Filesaver = require( 'filesaver' );
```

## API

### Filesaver(collections)

Filesaver constructor.

Example:

```js
var collections = {
    images: './images',
    books: './books'
}
var filesaver = new Filesaver( collections );
```



**Parameters**

**collections**:  *Object*,  Collections schema


### collection(name, collection, callback)

Add a new collection

Example:

```js
filesaver.collection( 'documents', )
```


**Parameters**

**name**:  *String*,  name of new collection

**collection**:  *Object*,  Collection schema

**callback**:  *Function*,  no signature callback


### add(collection, origin, target, callback)

Add a new file without overwrite anyone


**Parameters**

**collection**:  *String*,  Name of collection to insert the file

**origin**:  *String*,  path to origin file

**target**:  *String*,  name target file

**callback**:  *Function*,  Signature: error, data. Data signature:{filename, filepath}

### swap(collection, origin, target, callback)

Remove old file and then add the new one


**Parameters**

**collection**:  *String*,  name of collection

**origin**:  *String*,  path to origin file

**target**:  *String*,  name of file to remove

**callback**:  *Function*,  Signature: error, data. Data signature:{filename, filepath}


### replace(collection, origin, target, callback)

Write or overwrite file


**Parameters**

**collection**:  *String*,  name of parent collection

**origin**:  *String*,  path to origin file

**target**:  *String*,  name of target file

**callback**:  *Function*,  Signature: error, data. Data signature:{filename, filepath}



<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/node-filesaver/master/LICENSE)