var Filesaver, collections, safename, fs;

// get dependencies
safename = require( './safename' );
fs = require( 'fs' );



/**
 * Filesaver constructor
 * @param {Object} collections Collections schema
 */

Filesaver = function (cols) {
	// Store colelctions in private
	collections = cols;

	// check for existing folders
	for (col in collections) {
		if (!fs.existsSync( collections[col].path )){
			// create folder if not exists
			fs.mkdir( collections[col].path );
		}
	}
};



/**
 * Add a new collection setup
 * @param  {String}   name       name of new collection
 * @param  {Object}   collection Collection schema
 * @param  {Function} callback   no signature callback
 */

Filesaver.prototype.collection = function (name, collection, callback) {
	// create folder if not exists
	if (!fs.existsSync( collection.path )) {
		fs.mkdir( collection.path );
	}
	// add collection
	collections[name] = collection;
	// callback if exists
	if (callback){
		callback();
	}
}



/**
 * Add a new file without overwrite anyone
 * @param {String}   collection Name of collection to insert the file
 * @param {String}   origin     path to origin file
 * @param {String}   target     name target file
 * @param {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.add = function (collection, origin, target, callback) {

	var _this = this, rename, filename, destiny;

	/**
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
			return _this.overwrite( collection, origin, path, callback );
		}
	};

	// get filename and destiny
	filename = origin.split('/').pop();
	destiny = '' + collections[collection].path + '/' + filename;
	
	// check if file exists
	if (fs.exists( destiny )) {
		rename( '' + destiny + '_1', callback );
	} else {
		// write file
		return this.overwrite( collection, origin, destiny, callback );
	}
}



/**
 * Remove old file and then add the new one
 * @param  {[type]}   collection [description]
 * @param  {[type]}   origin     [description]
 * @param  {[type]}   target     [description]
 * @param  {Function} callback   [description]
 */

Filesaver.prototype.replace = function (collection, origin, target, callback) {
	// set target
	var filename = origin.split('/').pop();
	var destiny = '' + collections[collection].path + '/' + filename;
	var target = '' + collections[collection].path + '/' + target;

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

Filesaver.prototype.overwrite = function (collection, origin, target, callback) {
	// set target
	var destiny = '' + collections[collection].path + '/' + target;

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