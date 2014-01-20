
module.exports = function (collections) {
	var cols, filesaver, save;

	// check for existing folders
	for (col in collections) {
		if (!fs.existsSync( collections[col].path )){
			// create folder if not exists
			fs.mkdir( collections[col].path );
		}
	}


	save = function (opts) {
		var destiny = '' + collections[opts.collection].path + '/' opts.replace;
		// read origin
		fs.readFile( opts.origin, function (err, data) {
			if (err) {
				opts.callback( err );
			} else {
				// write file
				fs.writeFile( destiny, data, function (err2) {
					if (err2) {
						opts.callback( err2 );
					} else {
						callback( null, {
							origin: opts.origin,
							destiny: destiny,
							collection : opts.collection 
						});
					}
				});
			}
		});
	}

	/**
	 * Stores files in collections/folders
	 * @param  {String}   collection name of the collection to store the file
	 * @param  {String}   origin     path to origin file
	 * @param  {String}   replace    (optional) path to file to replace
	 * @param  {Function} callback   Signature: err, data
	 */
	
	filesaver = function (collection, origin, replace, callback) {
		var opts = {};
		//  check collection and origin arguments
		if ((typeof collection === 'string') && (typeof origin === 'string')) {
			if (collections[collection]) {
				opts.collection = collection;
				opts.origin = origin;
				
				// check if 'replace' and 'callback' arguments  were sent
				if (!callback) {
					if (typeof replace === 'function') {
						opts.callback = replace;
						opts.replace = false;
					} else if (typeof replace === 'string') {
						opts.replace = replace;
						opt.callback = false;
					} else {
						opts.replace = opt.origin.split('/').pop();
					}
				}
				save( opts );

			} else {
				callback( 'Collection not found' );
			}
		} else {
			callback( 'Collection or origin no valid' );
		}
	}
	
	return filesaver;

}
