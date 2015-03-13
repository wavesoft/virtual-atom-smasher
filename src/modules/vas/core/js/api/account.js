/**
 * [core/api/account] - Account API
 */
define(["vas/core/api/interface", "vas/config"], 

	function(APIInterface, Config) {

		/**
		 * APISocket Account
		 *
		 * This socket manages the user account information, such as session management,
		 * profile information and progress-state information.
		 *
		 * @see {@link module:core/api/interface~APIInterface|APIInterface} (Parent class)
		 * @exports core/api/account
		 */
		var APIAccount = function(apiSocket) {

			// Initialize superclass
			APIInterface.call(this, apiSocket);

		}

		// Subclass from APIInterface
		APIAccount.prototype = Object.create( APIInterface.prototype );

		/**
		 * Trigger arbitrary events to the server
		 */
		APIAccount.prototype.triggerEvent = function(eventName, args) {

			// Compile arguments
			var kwargs = args || {};
			kwargs['event'] = eventName;

			// Send the trigger
			this.sendAction("trigger", kwargs, (function(response) {

			}).bind(this));

		}

		/**
		 * Perform login 
		 */
		APIAccount.prototype.login = function(email, password, callback) {

			// Log-in user and fire callback when logged in
			this.sendAction("login", {
				'email': email,
				'password': password
			}, callback);
			
		}

		/**
		 * Perform login 
		 */
		APIAccount.prototype.register = function(profile, callback) {

			// Log-in user and fire callback when logged in
			this.sendAction("register", {
				'profile': profile
			}, callback);
			
		}

		/**
		 * Send user variables 
		 */
		APIAccount.prototype.sendVariables = function(vars) {

			// Log-in user and fire callback when logged in
			this.sendAction("variables", {
				'vars': vars
			});
			
		}

		/**
		 * Set a fuse that can only be set once 
		 */
		APIAccount.prototype.setFuse = function(name) {

			// Send the setFuse Action
			this.sendAction("setFuse", {
				'name': name
			});

			// This usually triggers a profile update
			
		}

		/**
		 * Get tuning configuration for this user
		 */
		APIAccount.prototype.getTuningConfiguration = function(callback) {
			// Query server
			this.sendAction("data.tuning", {}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get knowledge grid configuration
		 */
		APIAccount.prototype.getKnowledge = function(callback) {
			// Query server
			this.sendAction("data.knowledge", {}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get user papers
		 */
		APIAccount.prototype.listPapers = function(query, callback) {
			// Query server
			this.sendAction("papers.list", {
				'query': query
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get a particular paper
		 */
		APIAccount.prototype.readPaper = function(paper_id, callback) {
			// Query server
			this.sendAction("papers.read", {
				'id': paper_id
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Update a particular paper
		 */
		APIAccount.prototype.updatePaper = function(paper_id, fields, callback) {
			// Query server
			this.sendAction("papers.update", {
				'id': paper_id,
				'fields': fields,
			}, function(data) {
				if (data && callback) callback(data['status'] == 'ok', data['error']);
			});
		}

		/**
		 * Get a particular book
		 */
		APIAccount.prototype.readBook = function(book_name, callback) {
			// Query server
			this.sendAction("books.read", {
				'name': book_name
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get questionnaire questions for books
		 */
		APIAccount.prototype.getBookQuestions = function(callback) {
			// Query server
			this.sendAction("books.questions", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Send book answers
		 */
		APIAccount.prototype.sendBookAnswers = function(answers, callback) {
			// Query server
			this.sendAction("books.answers", {
				'answers': answers,
			}, function(data) {
				if (data && callback) callback(data['status'] == 'ok', data['error']);
			});
		}

		/**
		 * Get a particular book
		 */
		APIAccount.prototype.getProfileBooks = function(callback) {
			// Query server
			this.sendAction("profile.books", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Handle chatroom event
		 */
		APIAccount.prototype.handleAction = function(action, data) {
			if (!this.active) return;

			if (action == "profile") { /* Profile information arrived */
				this.trigger('profile', data);

			}
		}

		// Return the Chatroom class
		return APIAccount;

	}

);