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
		 * @augments module:vas-core/api/interface~APIInterface
		 * @exports vas-core/api/account
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
		 * Perform logout 
		 */
		APIAccount.prototype.logout = function(callback) {

			// Log-out user and fire callback when logged out
			this.sendAction("logout", {
			}, callback);

		}

		/**
		 * Perform password reset 
		 */
		APIAccount.prototype.requestPasswordReset = function(email, callback) {

			// Fire password reset without pin, in order to allocate new
			this.sendAction("passwordReset", {
				'email': email
			}, callback);

		}

		/**
		 * Perform password reset 
		 */
		APIAccount.prototype.completePasswordReset = function(email, pin, password, callback) {

			// Fire password reset with pin and pasword
			this.sendAction("passwordReset", {
				'email': email,
				'pin': pin,
				'password': password
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
		 * Get user messages
		 */
		APIAccount.prototype.getUserMessages = function( callback ) {
			// Query server
			this.sendAction("messages", {
			}, function(data) {
				if (data && callback) callback(data['messages']);
			});
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
		 * Get achievements tree
		 */
		APIAccount.prototype.getAchievementsTree = function(callback) {
			// Query server
			this.sendAction("achievements.tree", {}, function(data) {
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
		 * Get profile papers
		 */
		APIAccount.prototype.getProfilePapers = function(callback) {
			// Query server
			this.sendAction("papers.profile", {
			}, function(data) {
				if (data && callback) callback(data['user'], data['team']);
			});
		}

		/**
		 * Get result details
		 */
		APIAccount.prototype.getJobResults = function(job_id, callback) {
			// Query server
			this.sendAction("job.results", {
				'id': job_id
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get paper resutls
		 */
		APIAccount.prototype.getPaperResults = function(paper_id, callback) {
			// Query server
			this.sendAction("papers.results", {
				'id': paper_id
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
		 * Focus on a particular paper
		 */
		APIAccount.prototype.focusPaper = function(paper_id, callback) {
			// Query server
			this.sendAction("papers.focus", {
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
		 * Use the specified job as paper default
		 */
		APIAccount.prototype.makePaperJobDefault = function(paper_id, job_id, callback) {
			// Query server
			this.sendAction("papers.set.defaultjob", {
				'id': paper_id,
				'job': job_id,
			}, function(data) {
				if (data && callback) callback(data['status'] == 'ok', data['error']);
			});
		};

		/**
		 * Create a new paper
		 */
		APIAccount.prototype.createPaper = function( callback) {
			// Query server
			this.sendAction("papers.create", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Delete a particular paper
		 */
		APIAccount.prototype.deletePaper = function(paper_id, callback) {
			// Query server
			this.sendAction("papers.delete", {
				'id': paper_id
			}, function(data) {
				if (data && callback) callback(data['status'] == 'ok', data['error']);
			});
		}

		/**
		 * Cite a particular paper
		 */
		APIAccount.prototype.citePaper = function(paper_id, callback) {
			// Query server
			this.sendAction("papers.cite", {
				'id': paper_id
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
		 * Get team details
		 */
		APIAccount.prototype.getUserTeamDetails = function( callback) {
			// Query server
			this.sendAction("team.details", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get an exam for the currently known books
		 */
		APIAccount.prototype.getBookExam = function(callback) {
			// Query server
			this.sendAction("books.exam", {
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
		 * Query and return learning evaluation questions
		 */
		APIAccount.prototype.getLearningEvalQuestions = function( callback ) {
			// Query server
			this.sendAction("learning.evaluation", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}
		
		/**
		 * Send back evaluation questions
		 */
		APIAccount.prototype.sendLearningEvalAnswers = function( answers, id, callback ) {
			// Query server
			this.sendAction("learning.answers", {
				'id': id,
				'answers': answers
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
		 * Get machine part stages
		 */
		APIAccount.prototype.getPartDetails = function(name, callback) {
			// Query server
			this.sendAction("parts.details", {
				'part': name
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get observable details
		 */
		APIAccount.prototype.getObservableDetails = function(listOfObservables, callback) {
			// Query server
			this.sendAction("observables.details", {
				'observables': listOfObservables
			}, function(data) {
				if (data && callback) {

					// Create an indexed list
					var dat = data['data'], ans = { };
					for (var i=0; i<dat.length; i++) {
						ans[dat[i].name] = dat[i];
					}

					// Fire callback with indexed list of observables
					callback(ans);

				}
			});
		}

		/**
		 * Get all levels including their status
		 */
		APIAccount.prototype.enumLevels = function(callback) {
			// Query server
			this.sendAction("levels.enum", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get level details for the specified level
		 */
		APIAccount.prototype.getLevelDetails = function(level, callback) {
			// Query server
			this.sendAction("levels.details", {
				'level': level
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Unlock a particular machine part stage
		 */
		APIAccount.prototype.unlockMachineStage = function(stage, callback) {
			// Unlock machine part
			this.sendAction("parts.unlock", {
				'id': stage
			}, function(data) {
				if (data && callback) callback(data['status'] == "ok");
			});
		}

		/**
		 * Get team listing
		 */
		APIAccount.prototype.getTeamListing = function(callback) {
			// Query server
			this.sendAction("team.listing", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get team resources
		 */
		APIAccount.prototype.getTeamResources = function(callback) {
			// Query server
			this.sendAction("team.resources", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get team details
		 */
		APIAccount.prototype.getTeamDetails = function(callback) {
			// Query server
			this.sendAction("team.details", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get team forum notes
		 */
		APIAccount.prototype.getTeamNotes = function(callback) {
			// Query server
			this.sendAction("team.notes", {
			}, function(data) {
				if (data && callback) callback(data['data']);
			});
		}

		/**
		 * Get team listing
		 */
		APIAccount.prototype.requestToJoinTeam = function(team, callback) {
			// Query server
			this.sendAction("team.join", {
				'team': team
			}, function(data) {
				if (data && callback) callback(data['status'] == "ok");
			});
		}

		/**
		 * Commit activity timer
		 */
		APIAccount.prototype.commitActivityTimer = function( activityMs ) {
			// Update activity counter
			this.sendAction("user.activity", {
				'counter': activityMs
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