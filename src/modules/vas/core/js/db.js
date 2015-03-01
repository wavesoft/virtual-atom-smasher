/**
 * [core/main] - Core initialization module
 */
define(["vas/core/apisocket"], 

	function(APISocket) {

		// Database class is a shorthand to APISocket DB interface
		var DB = {

			// Table record cache
			'cache': {}

		};

		/**
		 * Open database table
		 */
		DB.openTable = function( name ) {
			// Open table on the APISocket Database Stream
			return APISocket.openDb().openTable(name);
		}

		/**
		 * Download all records of given table and place it on cache
		 */
		DB.cacheTable = function(tableName, callback) {

			var table = APISocket.openDb().openTable(tableName);
			table.all(function(records, index) {

				// Store cache and index
				DB.cache[tableName+'_list'] = records;
				DB.cache[tableName] = index;

				// Fire ready callback
				if (callback) callback(records, DB.cache[tableName]);

			});
		}

		// Return the global scope
		return DB;
	}

);