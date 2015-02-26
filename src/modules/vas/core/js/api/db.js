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
			
			// Send table/get action
			this.parent.sendAction("table.get", {
				'table': this.name,
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
 		 * Store a record in the table
		 */
		DBTable.prototype.put = function(index, doc, cb) {

			// Send table/put action
			this.parent.sendAction("table.put", {
				'table': this.name,
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
 		 * Return all records from the database
		 */
		DBTable.prototype.all = function(cb) {
			
		}

		/**
 		 * Filter documents using the given query
		 */
		DBTable.prototype.filter = function(query, cb) {
			
		}

		/**
 		 * Close table when we are done
		 */
		DBTable.prototype.close = function() {

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
		 * Handle chatroom event
		 */
		APIDatabase.prototype.handleAction = function(action, data) {
			if (!this.active) return;

			if (action == "profile") { /* Profile information arrived */
				this.trigger('profile', data);

			}
		}

		// Return the Chatroom class
		return APIDatabase;

	}

);