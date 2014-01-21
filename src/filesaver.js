var Filesaver, safename, fs, msgErr, rename, mkdirp;

// get dependencies
safename = require( './safename' );
fs = require( 'fs' );
mkdirp = require( 'mkdirp' );

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
 * var folders = {
 *     images: './images',
 *     books: './books'
 * }
 * var filesaver = new Filesaver( folders );
 * ```
 * 
 * @param {Object} folders Folders schema
 */

Filesaver = function (folders) {
	// Store folders in private
	this.folders = folders;

	// check for existing folders
	for (x in this.folders) {
		if (!fs.existsSync( folders[x] )){
			// create folder if not exists
			mkdirp( folders[x] );
		}
	}
};



/**
 * Add a new folder
 *
 * Example:
 *
 * ```js
 * filesaver.addFolder( 'documents', './path/to/folder', function () {
 *     // do something
 * });
 * ```
 * @param  {String}   name       name of new folder collection
 * @param  {Object}   path       path to its folder
 * @param  {Function} callback   no signature callback
 */

Filesaver.prototype.addFolder = function (name, path, callback) {
	var _this = this;

	fs.exists( path, function (exists) {
		if (!exists) {
			// create folder if not exists
			mkdirp( path );
		}
		// add folder
		_this.folders[name] = path;
		// callback if exists
		if (callback){
			callback();
		}
	});
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
 *     // filepath: './images/avatar_2.jpg'
 * });
 * ```
 * 
 * @param {String}   folder Name of folder to insert the file
 * @param {String}   origin     path to origin file
 * @param {String}   target     name of target file
 * @param {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */



Filesaver.prototype.add = function (folder, origin, target, callback) {
	// check for valid arguments
	if (folder && origin && (typeof folder === 'string') && (typeof origin === 'string')) {

		var _this = this, checker, filename, destiny, rename, toCheck;

		/*
		 * +1 to filename sufix if file exists, else callback
		 * @param  {String} path path to check
		 */
		checker = function (path) {
			if (fs.existsSync( '' + folders[folder] + '/' + path )) {

				checker( renamer(path), callback);

			} else {
				return _this.replace( folder, origin, path, callback );
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
		destiny = '' + folders[folder] + '/' + target;


		if (fs.existsSync( destiny )) {

			toCheck = [ firstsufix( splitName(target)[0] ), splitName(target)[1] ].join( '.' );

			checker( toCheck, callback);

		} else {
			return _this.replace( folder, origin, target, callback );
		}


		
	} else {
		throw new msgErr( 'Folder or origin not valid' );
	}

}



/**
 * Remove old file and then add the new one
 *
 * Example:
 * 
 * ```js
 * filesaver.swap( 'images', '/path/to/temp/file.jpg', 'willBeRemoved.jpg', function (err, data) {
 *     console.log( data );
 *     // ->
 *     // filename: 'file.jpg',
 *     // filepath: './images/file.jpg'
 * });
 * ```
 * 
 * @param  {String}   folder     name of folder
 * @param  {String}   origin     path to origin file
 * @param  {String}   target     name of file to remove
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.swap = function (folder, origin, target, callback) {
	var _this = this;
	if (target) {
		fs.unlink( target, function(){
			_this.replace( folder, origin, callback );
		});
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
 *     // filepath: './images/avatar.jpg'
 *     });
 * ```
 * 
 * @param  {String}   folder     name of parent folder folder
 * @param  {String}   origin     path to origin file
 * @param  {String}   target     name of target file
 * @param  {Function} callback   Signature: error, data. Data signature:{filename, filepath}
 */

Filesaver.prototype.replace = function (folder, origin, target, callback) {
	
	// check for valid arguments
	if (folder && origin && (typeof folder === 'string') && (typeof origin === 'string')) {
		// check for existing folder
		if (this.folders[folder]) {

			// check if target is callback
			if (!callback && typeof target === 'function') {
				var callback = target;
				target = origin.split( '/' ).pop();
			} else if (!target) {
				var target = target = origin.split( '/' ).pop();
			}


			// set target
			var destiny = '' + this.folders[folder] + '/' + target;
			// write file
			fs.writeFile(
				destiny,
				fs.readFileSync( origin ),
				function (err) {
					if (callback) {
						callback( err, {
							filename: destiny.split( '/' ).pop(),
							filepath: destiny
						});
					}
				}
			);

		} else if (callback) {
			callback( 'invalid folder' );
		}
	} else {
		throw new msgErr( 'folder or origin not valid' );
	}
}


module.exports = Filesaver;
