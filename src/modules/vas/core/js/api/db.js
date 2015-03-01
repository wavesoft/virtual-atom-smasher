/**
 * [core/api/db] - Database API
 */
define(["vas/core/api/interface", "vas/config"], 

	function(APIInterface, Config) {

		/**
		 * APISocket Database Record
		 */

		var DBTable = function(parent, name) {
			this.parent = parent;
			this.name = name;
		}

		/**
 		 * Get a document from the table
		 */
		DBTable.prototype.get = function(index, cb) {
			// Get table record
			this.parent.getRecord(this.name, index, cb);
		}

		/**
 		 * Store a record in the table
		 */
		DBTable.prototype.put = function(index, doc, cb) {
			// Put table record
			this.parent.putRecord(this.name, index, doc, cb);
		}

		/**
 		 * Return all records from the database
		 */
		DBTable.prototype.all = function(cb) {
			// Get all table records
			this.parent.getAllRecords(this.name, cb);
		}

		/**
 		 * Find documents using the given query
		 */
		DBTable.prototype.find = function(query, cb) {
			// Get all table records
			this.parent.findRecords(this.name, query, cb);
		}

		/**
 		 * Return multiple documents using the given query
		 */
		DBTable.prototype.multiple = function(names, cb) {
			// Get all table records
			this.parent.getMultipleRecords(this.name, names, cb);
		}

		/**
		 * APISocket Database
		 *
		 * This socket manages the user account information, such as session management,
		 * profile information and progress-state information.
		 *
		 * @see {@link module:core/api/interface~APIInterface|APIInterface} (Parent class)
		 * @exports core/api/account
		 */
		var APIDatabase = function(apiSocket) {

			// Initialize superclass
			APIInterface.call(this, apiSocket);

			// Initialize cache
			this.cache = {};

		}

		// Subclass from APIInterface
		APIDatabase.prototype = Object.create( APIInterface.prototype );

		/**
		 * Open a document
		 */
		APIDatabase.prototype.openTable = function( name ) {
			// Create a document instance and return
			var doc = new DBTable(this, name);
			return doc;
		}

		/**
		 * Get a record from the database
		 */
		APIDatabase.prototype.getRecord = function( table, index, cb ) {

			// Send table/get action
			this.sendAction("table.get", {
				'table': table,
				'index': index,
			}, function(data) {
				if (data['status'] != 'ok') {
					// Callback with the error
					if (cb) cb(null, data['error'], data['error_id']);
				} else {
					// Callback with the document
					if (cb) cb(data['doc']);
				}
			});

		}

		/**
		 * Put a record to the database
		 */
		APIDatabase.prototype.putRecord = function( table, index, doc, cb ) {

			// Send table/put action
			this.sendAction("table.put", {
				'table': table,
				'index': index,
				'doc': doc
			}, function(data) {
				if (data['status'] != 'ok') {
					// Callback with the error
					if (cb) cb(false, data['error'], data['error_id']);
				} else {
					// Callback with the acknowledge
					if (cb) cb(true);
				}
			});

		}

		/**
		 * Get all records from the database
		 */
		APIDatabase.prototype.getAllRecords = function( table, cb ) {

			// Send table/get action
			this.sendAction("table.all", {
				'table': table
			}, function(data) {
				if (data['status'] != 'ok') {
					// Callback with the error
					if (cb) cb(null, data['error'], data['error_id']);
				} else {
					// Callback with the document
					if (cb) {

						// Build index
						var index = { }, 
							docs = data['docs'],
							iKey = data['index'] || 'id';

						// Build index
						for (var i=0; i<docs.length; i++)
							index[docs[i][iKey]] = docs[i];

						// Fire callback
						cb(docs, index);
						
					}
				}
			});

		}

		/**
		 * Get multiple records that match the given indices
		 */
		APIDatabase.prototype.getMultipleRecords = function( table, indices, cb ) {

			// Send table/get action
			this.sendAction("table.multiple", {
				'table': table,
				'indices': indices
			}, function(data) {
				if (data['status'] != 'ok') {
					// Callback with the error
					if (cb) cb(null, data['error'], data['error_id']);
				} else {
					// Callback with the document
					if (cb) {

						// Build index
						var index = { }, 
							docs = data['docs'],
							iKey = data['index'] || 'id';

						// Build index
						for (var i=0; i<docs.length; i++)
							index[docs[i][iKey]] = docs[i];

						// Fire callback
						cb(docs, index);

					}
				}
			});

		}

		/**
		 * Find records that match the given criteria
		 */
		APIDatabase.prototype.findRecords = function( table, query, cb ) {

			// Send table/get action
			this.sendAction("table.find", {
				'table': table,
				'query': query
			}, function(data) {
				if (data['status'] != 'ok') {
					// Callback with the error
					if (cb) cb(null, data['error'], data['error_id']);
				} else {
					// Callback with the document
					if (cb) {

						// Build index
						var index = { }, 
							docs = data['docs'],
							iKey = data['index'] || 'id';

						// Build index
						for (var i=0; i<docs.length; i++)
							index[docs[i][iKey]] = docs[i];

						// Fire callback
						cb(docs, index);

					}
				}
			});

		}

		/**
		 * Get all records of the given database and cache them
		 *
		 * @param {string} name - The database records to fetch
		 * @param {string} format - The result format: "list", "object", "tree"
		 * @param {function} callback - The callback to fire when the record is ready
		 */
		APIDatabase.cacheTable = function(name, format, callback) {

			// Handle missing parameters
			if (format == undefined) {
				format = "object";
			}
			if (typeof(format) == "function") {
				callback = format;
				format = "object";
			}

			// Check cache first
			if (this.cache[name] !== undefined) {
				if (callback) callback(this.cache[name]);
				return this.cache[name];
			} else {

				// Call database after
				var db = this.openDatabase(name);
				this.getAllRecords( name, (function(records) {

					// Process records
					if (format == "object") {

						// Setup cache
						this.cache[name] = {};

						// Skip empty records
						if (records && (records.length > 0)) {

							// Check if we should use 'id' or 'name'
							// for the indexing key.
							var idx = 'id';
							if (records[0]['name'] !== undefined)
								idx = 'name';

							// Covert record to object ('_id' is the key)
							for (var i=0; i<records.length; i++) {
								this.cache[name][records[i][idx]] = records[i];
							}

						}

					} else if (format == "tree") {

						// Convert record to tree
						// ('parent' points to a parent entry, 'child' will contain the child nodes, returns root)
						this.cache[name+'_list'] = records;
						this.cache[name+'_index'] = {};
						this.cache[name] = null;

						// Skip empty records
						if (records && (records.length > 0)) {

							// Check if we should use 'id' or 'name'
							// for the indexing key.
							var idx = 'id';
							if (records[0]['name'] !== undefined)
								idx = 'name';

							// First pass: build index & initialize children array
							for (var i=0; i<records.length; i++) {
								records[i].children = [];
								this.cache[name+'_index'][records[i][idx]] = records[i];
								if (!records[i]['parent']) this.cache[name] = this.cache[name+'_index'][records[i][idx]];
							}

							// Second pass: build tree
							for (var i=0; i<records.length; i++) {
								var parent = this.cache[name+'_index'][records[i]['parent']];
								// Check if that's a root item
								if (!parent) continue;
								// Update children and parent with references
								parent.children.push( records[i] );
								records[i]['parent'] = parent;
							}

						}

					} else {

						// Use raw list
						this.cache[name] = records;

					}

					// Fire callback
					if (callback) callback(this.cache[name]);

				}).bind(this));
				
				// Return empty record here
				return null;
			}
		}

		/**
		 * Handle database events
		 */
		APIDatabase.prototype.handleAction = function(action, data) {
			if (!this.active) return;
		}

		// Return the Chatroom class
		return APIDatabase;

	}

);