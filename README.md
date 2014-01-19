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
- Manage collections in folders
- Stores files by date
- Folder and filename patterns
- Abstract file names
- Classify files by filetype


## Usage

```js
var Filesaver, filesaver, collections;

Filesaver = require( 'filesaver' );

collections = {
	images : {
		path: 'path/to/folder',
		abstract: true
	},
	documents : {
		path: 'path/to/documents',
		pattern : new Date().getFullYear()
	}
};

filesaver = Filesaver( collections );

filesaver( 'images', 'path/to/origin', function (err, data) {
	// do something with data
	// data signature:
	// - origin
	// - destiny
	// - collection
	// - renamed?
});

```

<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/node-filesaver/master/LICENSE)