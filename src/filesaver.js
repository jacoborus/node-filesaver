var Filesaver, collections, safename, fs, msgErr, rename;

// get dependencies
safename = require( './safename' );
fs = require( 'fs' );

/* private methods */

msgErr = function ( msg ) {
	this.msg = msg;
	this.name = "Error";
}

var firstsufix = function (name) {
	var splitted, suff;
	splitted = name.split( '_' );
	if (splitted.length === 1) {
		return '' + name + '_0';
	} else {
		suff = splitted.pop();
		if (Number(suff) === NaN) {
			return '' + name + '_0';
		} else {
			return name;
		}
	}
}

var add1 = function (name) {
	var splitted, sufix;
	splitted = name.split( '_' );
	sufix = splitted.pop();
	sufix = 1 + Number( sufix );
	splitted.push( sufix );
	return splitted.join( '_' );
}

var joinplused = function (arr) {
	arr[0] = add1( arr[0] );
	return arr.join( '.' );
}

var splitName = function (name) {
	var arr, name, ext;
	arr = name.split('.');
	name = arr.shift();
	ext = arr.join('.');
	return [name, ext];
}

var renamer = function (name) {
	return joinplused( splitName( name ));
}


/**
 * Filesaver constructor.
 *
 * Example:
 * 
 * ```js
 * var collections = {
 *     images: './images',
 *     books: './books'
 * }
 * var filesaver = new Filesaver( collections );
 * ```
 * 
 * @param {Object} collections Collections schema
 */

Filesaver = function (cols) {
	// Store collections in private
	collections = cols;

	// check for existing folders
	for (col in collections) {
		if (!fs.existsSync( collections[col] )){
			// create folder if not exists
			fs.mkdir( collections[col] );
		}
	}
};



/**
 * Add a new collection
 *
 * Example:
 *
 * ```js
 * filesaver.collection( 'documents', './path/to/folder', function () {
 *     // do something
 * });
 * ```
 * @param  {String}   name       name of new collection
 * @param  {Object}   collection Collection schema
 * @param  {Function} callback   no signature callback
 */

Filesaver.prototype.collection = function (name, folder, callback) {
	// create folder if not exists
	if (!fs.existsSync( folder )) {
		fs.mkdir( folder );
	}
	// add collection
	collections[name] = folder;
	// callback if exists
	if (callback){
		callback();
	}
}


/**
 * Add a new file without overwrite anyone
 *
 * Example:
 *
 * ```js
 * filesaver.add( 'images', '/path/to/temp/file.jpg', 'avatar.jpg', function (err, data) {
 *     console.log( data );
 *     // ->
 *     // filename: 'avatar_2.jpg',
 *     // filepath: './images'
 * });
 * ```
 * 
 * @param {String}   collection Name of collection to insert the file
 * @param {String}   origin     path to origin file
 * @param {String}   target     name target file
 * @param {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */



Filesaver.prototype.add = function (collection, origin, target, callback) {
	// check for valid arguments
	if (collection && origin && (typeof collection === 'string') && (typeof origin === 'string')) {

		var _this = this, checker, filename, destiny, rename, toCheck;

		/*
		 * +1 to filename sufix if file exists, else callback
		 * @param  {String} path path to check
		 */
		checker = function (path) {
			if (fs.existsSync( '' + collections[collection] + '/' + path )) {

				checker( renamer(path), callback);

			} else {
				return _this.replace( collection, origin, path, callback );
			}
		};

		rename = function (path) {
			var splitted, name, split_, num;

			splitdot = path.split( '.' );
			name = splitdot.shift();
			split_ = name.split( '_' );
			num = split_.pop();
			num = 1 + num;
			split_.push( num );
			name = split_.join( '_' );
			splitdot.unshift( name );

			checker( splitdot.join( '.' ));
		}


		// get filename and destiny
		filename = origin.split('/').pop();
		destiny = '' + collections[collection] + '/' + target;


		if (fs.existsSync( destiny )) {

			toCheck = [ firstsufix( splitName(target)[0] ), splitName(target)[1] ].join( '.' );

			checker( toCheck, callback);

		} else {
			return _this.replace( collection, origin, target, callback );
		}


		
	} else {
		console.log('error!');
		throw new msgErr( 'Collection or origin not valid' );
	}

}



/**
 * Remove old file and then add the new one
 *
 * Example:
 * 
 * ```js
 * filesaver.swap( 'images', '/path/to/temp/file.jpg', 'avatar.jpg', function (err, data) {
 *     console.log( data );
 *     // ->
 *     // filename: 'file.jpg',
 *     // filepath: './images'
 * });
 * ```
 * 
 * @param  {String}   collection name of collection
 * @param  {String}   origin     path to origin file
 * @param  {String}   target     name of file to remove
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.swap = function (collection, origin, target, callback) {
	// check for valid arguments
	if (collection && origin && (typeof collection === 'string') && (typeof origin === 'string')) {
		// set target
		var filename = origin.split('/').pop();
		var destiny = '' + collections[collection] + '/' + filename;
		var target = '' + collections[collection] + '/' + target;

		// read origin
		fs.readFile( origin, function (err, data) {
			if (err) {
				callback( err );
			} else {
				// remove target file
				fs.unlinkSync( target );
				// write file
				fs.writeFile( destiny, data, function (err2) {
					if (callback) {
						if (err2) {
							callback( err2 );
						} else {
							callback( null, {
								filename: filename,
								filepath: destiny
							});
						}
					}
				});
			}
		});
	} else {
		throw new msgErr( 'Collection or origin not valid');
	}
}



/**
 * Write or overwrite file
 * 
 * Example:
 * 
 * ```js
 * filesaver.replace( 'images', '/path/temp/file.jpg', 'avatar.jpg', function (err, data) {
 *     console.log( data );
 *     // ->
 *     // filename: 'avatar.jpg',
 *     // filepath: './images'
 *     });
 * ```
 * 
 * @param  {String}   collection name of parent collection
 * @param  {String}   origin     path to origin file
 * @param  {String}   target     name of target file
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.replace = function (collection, origin, target, callback) {
	
	// check for valid arguments
	if (collection && origin && (typeof collection === 'string') && (typeof origin === 'string')) {

		// set target
		var destiny = '' + collections[collection] + '/' + target;

		// read origin
		fs.readFile( origin, function (err, data) {
			if (err) {
				callback( err );
			} else {
				// write file
				fs.writeFile( destiny, data, function (err2) {
					if (err2) {
						callback( err2 );
					} else {
						callback( null, {
							filename: destiny.split('/').pop(),
							filepath: destiny
						});
					}
				});
			}
		});
	} else {
		throw new msgErr( 'Collection or origin not valid');
	}
}


module.exports = Filesaver;
