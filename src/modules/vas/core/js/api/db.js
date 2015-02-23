/**
 * [core/api/db] - Database API
 */
define(["vas/core/api/interface", "vas/config"], 

	function(APIInterface, Config) {

		/**
		 * APISocket Database Record
		 */

		var APIDocument = function(parent, name) {
			this.parent = parent;
			this.name = name;
		}

		/**
 		 * Get a document from the document
		 */
		APIDocument.prototype.get = function(index, cb) {
			
			// Send document/get action
			this.parent.sendAction("doc.get", {
				'document': this.name
			}, function(data) {

			});

		}

		/**
 		 * Store a record in the document
		 */
		APIDocument.prototype.put = function(index, doc, cb) {

			// Send document/put action
			this.parent.sendAction("doc.put", {
				'document': this.name,
				'data': doc
			}, function(data) {

			});

		}

		/**
 		 * Return all records from the database
		 */
		APIDocument.prototype.all = function(cb) {
			
		}

		/**
 		 * Filter documents using the given query
		 */
		APIDocument.prototype.filter = function(query, cb) {
			
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
		 * Perform login 
		 */
		APIDatabase.prototype.get = function(username, password, callback) {

			// Log-in user and fire callback when logged in
			this.sendAction("login", {
				'username': username,
				'password': password
			}, callback);
			
		}

		/**
		 * Open a document
		 */
		APIDatabase.prototype.openDocument = function( name ) {
			// Create a document instance and return
			var doc = new APIDocument(this, name);
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