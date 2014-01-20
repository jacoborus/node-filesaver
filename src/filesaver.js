var Filesaver, collections, safename, fs;

// get dependencies
safename = require( './safename' );
fs = require( 'fs' );



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
 *     // do something with err and data
 * });
 * ```
 * 
 * @param {String}   collection Name of collection to insert the file
 * @param {String}   origin     path to origin file
 * @param {String}   target     name target file
 * @param {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.add = function (collection, origin, target, callback) {

	var _this = this, rename, filename, destiny;

	/*
	 * +1 to filename sufix if file exists, else callback
	 * @param  {String} path path to check
	 */
	rename = function (path) {
		if (fs.exists( path )) {
			path = path.split( '_' );
			len = path.length;
			path[len - 1] = 1 + path[len - 1];
			checker( path.join( ), callback);
		} else {
			return _this.replace( collection, origin, path, callback );
		}
	};

	// get filename and destiny
	filename = origin.split('/').pop();
	destiny = '' + collections[collection] + '/' + filename;
	
	// check if file exists
	if (fs.exists( destiny )) {
		rename( '' + destiny + '_1', callback );
	} else {
		// write file
		return this.replace( collection, origin, destiny, callback );
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
 * @param  {String}   collection name of collection
 * @param  {String}   origin     path to origin file
 * @param  {String}   target     name of file to remove
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.swap = function (collection, origin, target, callback) {
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
}



/**
 * Write or overwrite file
 * @param  {String}   collection name of parent collection
 * @param  {String}   origin     path to origin file
 * @param  {String}   target     name of target file
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.replace = function (collection, origin, target, callback) {
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
}


module.exports = Filesaver;
