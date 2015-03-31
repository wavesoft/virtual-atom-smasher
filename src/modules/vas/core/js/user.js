/**
 * [core/main] - Core initialization module
 */
define(["vas/config", "core/util/event_base", "vas/core/db", "vas/core/apisocket", "vas/core/global", "core/analytics/analytics"], 

	function(Config, EventBase, DB, APISocket, Global, Analytics) {

		/**
		 * Database interface
		 *
		 * @class
		 * @exports core/user
		 */
		var User = function() {
			window.user = this;

			// Subclass from EventBase
			EventBase.call(this);

			/**
			 * The user profile variables
			 * @type {object}
			 */
			this.profile = { };

			/**
			 * The dynamic user variables
			 * @type {object}
			 */
			this.vars = { };

			/**
			 * User state as received from the server
			 * @type {object}
			 */
			this.state = { };

			/**
			 * Pile of events
			 * @type {array}
			 */
			this.piledEvents = [];

			/**
			 * The socket used for account I/O
			 * @type {object}
			 */
			this.accountIO = null;

			/**
			 * Callbacks for various config parameters
			 */
			this.accountConfigCallbacks = [];

			/**
			 * The socket used for database I/O
			 * @type {object}
			 */
			this.dbIO = null;

			// On user log-in update credits
			APISocket.on('ready', (function() {

				// Open Account socket when API socket is ready
				this.accountIO = APISocket.openAccount();
				this.dbIO = APISocket.openDb();

				// Bind events
				this.accountIO.on('profile', (function(profile) {

					// Update profile and variables
					this.profile = profile;
					this.vars = profile['vars'];
					this.initVars();

					// Trigger state changes
					this.triggerStateChange( profile['state'], this.state );
					this.state = profile['state'];

					// Send pile of events
					this.sendEventPile();

					// Fire the profile event
					this.trigger('profile', profile);

				}).bind(this));

			}).bind(this));

		}

		// Subclass from EventBase
		User.prototype = Object.create( EventBase.prototype );

		/**
		 * Enable/disable editing of the interface
		 */
		//User.enableIPIDE = true;
		//$("body").addClass("enable-ipide")

		/**
		 * Login and initialize user record
		 *
		 * @param {Object} params - A dictionary that contains the 'username' and 'password' fields.
		 * @param {function(status)} callback - A callback function to fire when the login-process has completed
		 */
		User.prototype.login = function(params, callback) {

			// Try to log-in the user
			this.accountIO.login(params['email'], params['password'], (function(response) {
				
				// If something went wrong, fire error callback
				if (response['status'] != 'ok') {
					if (callback) callback(false, response['message']);
					return;
				}

				// Wait until the user profile arrives
				this.accountIO.callbackOnAction("profile", (function(profile) {

					// Let global listeners that the user is logged in
					Global.events.trigger("login", profile);

					// Handle profile
					this.profile = profile;
					this.vars = profile['vars'];
					this.initVars();

					// If user has an analytics profile, update user ID on analytics
					if (profile['analytics']) {
						// Provide tracking UUID to the analytics
						Analytics.setGlobal("userid", profile['analytics']['uuid']);
					} else {
						// Otherwise disable analytics for this session
						Analytics.disable();
					}

					// Fire callback
					if (callback) callback(true);

				}).bind(this));

			}).bind(this));

		}

		/**
		 * Login and initialize user record
		 *
		 * @param {Object} params - A dictionary that contains the 'username', 'password', 'email' and 'name' fields.
		 * @param {function(status)} callback - A callback function to fire when the register-process has completed
		 */
		User.prototype.register = function(params, callback) {

			// Try to register-in the user
			this.accountIO.register(params, (function(response) {
				
				// If something went wrong, fire error callback
				if (response['status'] != 'ok') {
					if (callback) callback(false, response['message']);
					return;
				}

				// Wait until the user profile arrives
				this.accountIO.callbackOnAction("profile", (function(profile) {

					// Let global listeners that the user is logged in
					Global.events.trigger("login", profile);

					// Handle profile
					this.profile = profile;
					this.vars = profile['vars'];
					this.initVars();					

					// Fire callback
					if (callback) callback(true);

				}).bind(this));

			}).bind(this));

		}

		/**
		 * Handle state changes and trigger the appropriate actions
		 */
		User.prototype.triggerStateChange = function( fromState, toState ) {

			// Get from/to state change
			var fromCfg = toState['config'] || [],
				toCfg = fromState['config'] || [];

			// Handle changes
			for (var i=0; i<this.accountConfigCallbacks.length; i++) {

				// Detect switches
				var cb = this.accountConfigCallbacks[i],
					wasFrom = (fromCfg.indexOf(cb.name) >= 0),
					isTo    = (toCfg.indexOf(cb.name) >= 0);

				// Handle switches
				if (wasFrom != isTo) {
					cb.callback( isTo );
				}

			}

		}

		/**
		 * Unlock the given knowledge refered by it's ID.
		 * The server is going to perform the transaction and fire the callback when ready.
		 *
		 * @param {string} id - The knowledge ID
		 * @param {function(status)} callback - A callback function to fire when the knowledge is unlocked
		 */
		User.prototype.unlockKnowledge = function(id, callback) {

			// Try to register-in the user
			this.accountIO.sendAction("knowledge.unlock", 
				{
					'id': id
				}, 
				(function(response) {

					// Fire callback
					if (response['status'] == 'ok') {
						if (callback) callback( response['knowledge'] );
					}

				}).bind(this)
			);

		}

		/**
		 * Send pile of events
		 */
		User.prototype.sendEventPile = function() {
			// Send all stacked events
			for (var i=0; i<this.piledEvents.length; i++) {
				this.accountIO.triggerEvent(this.piledEvents[i][0], this.piledEvents[i][1]);
			}
			// Reset array
			this.piledEvents = [];
		}

		/**
		 * Trigger an arbitrary user action.
		 */
		User.prototype.triggerEvent = function( eventName, data ) {
			if (!this.accountIO) return;
			if (!this.profile['id']) {
				// Stack events if user is not logged in
				this.piledEvents.push([eventName, data]);
			} else {
				// Otherwise send them now
				this.accountIO.triggerEvent(eventName, data);
			}
		}

		/**
		 * Get the values of a given save slot
		 */
		User.prototype.getSlotValues = function( index, callback ) {

			// Try to register-in the user
			this.accountIO.sendAction("save.get", 
				{
					'id': index
				}, 
				(function(response) {

					// Fire callback
					if (response['status'] == 'ok') {
						if (callback) callback(response['values']);
					}

				}).bind(this)
			);

		}

		/**
		 * Set the value to a save slot
		 */
		User.prototype.saveSlotValues = function( index, values, callback ) {

			// Try to register-in the user
			this.accountIO.sendAction("save.set", 
				{
					'id': index,
					'values': values
				}, 
				(function(response) {

					// Fire callback
					if (response['status'] == 'ok') {
						if (callback) callback(true);
					} else {
						if (callback) callback(false);
					}

				}).bind(this)
			);

		}

		/**
		 * Claim credits
		 */
		User.prototype.claimCredits = function( category, claim, reason ) {

			// Try to register-in the user
			this.accountIO.sendAction("credits.claim", 
				{
					'category': category,
					'claim': claim
				}, 
				(function(response) {

					// Fire callback
					if (response['status'] == 'ok') {
						this.trigger("flash", 
							"You got <strong>"+response['points']+'</strong> science points', 
							reason,
							'flash-icons/coins.png'
							);
					}

				}).bind(this)
			);

		}

		/**
		 * Reset credit claim category
		 */
		User.prototype.resetClaimCategory = function( category ) {

			// Try to register-in the user
			this.accountIO.sendAction("credits.reset", 
				{
					'category': category
				}, 
				(function(response) {

					// Fire callback
					if (response['status'] == 'ok') {

					}

				}).bind(this)
			);

		}

		/**
		 * Initialize the user record 
		 *
		 * This function fetches the database user record and prepares the local fields.
		 */
		User.prototype.initVars = function() {

			// Create enabled_topics if missing
			if (!this.vars['enabled_topics'])
				this.vars['enabled_topics'] = {};

			// Create the explored_knowledge grid
			if (!this.vars['explored_knowledge'])
				this.vars['explored_knowledge'] = {};

			// Create per-task user details
			if (!this.vars['task_details'])
				this.vars['task_details'] = {};

			// Create first-time pop-up status
			if (!this.vars['first_time'])
				this.vars['first_time'] = {};

		}

		/**
		 * Build and return the enabled tunables and enabled observables
		 * by traversing the knowledge grid and the relevant databases.
		 */
		User.prototype.getTuningConfiguration = function( callback ) {

			// Get some useful database information
			var dbMachineParts = DB.cache['definitions']['machine-parts'];

			// Tunable group index and prefix-to-machine parts lookup table
			var tunableGroupIndex = {},
				prefixToMachinePart = {};

			// Populate prefix-to-machine part index
			for (k in dbMachineParts) {
				if (k[0] == "_") continue;
				if (!dbMachineParts[k]['prefixes']) continue;
				for (var i=0; i<dbMachineParts[k]['prefixes'].length; i++) {
					// Map this prefix to machine part ID
					prefixToMachinePart[dbMachineParts[k]['prefixes'][i]] = k;
				}
			}

			// Forward query to user API
			this.accountIO.getTuningConfiguration(function(cfg) {

				// Prepare 'machineParts' on the configuration
				cfg.machineParts = [];

				// From tunables, lookup the machine part they belong
				for (var i=0; i<cfg.tunables.length; i++) {

					// Get tunable name
					var tun = cfg.tunables[i],
						tunName = tun.name;

					// Find tunable prefix
					var tunPrefix = tunName.split(":")[0],
						machinePart = prefixToMachinePart[tunPrefix];

					// Get/Place group
					var machineGroup = tunableGroupIndex[machinePart];
					if (!machineGroup) {
						machineGroup = { "part": machinePart, "tunables": [] };
						tunableGroupIndex[machinePart] = machineGroup;
						cfg.machineParts.push(machineGroup);
					}

					// Append tunable on the machine tunables
					machineGroup.tunables.push( tun );

				}

				// Callback with the configuration
				callback( cfg );

			});

		}

		/**
		 * Return a list of teams in the game
		 */
		User.prototype.getTeamListing = function( callback ) {
			this.accountIO.getTeamListing( callback );
		}

		/**
		 * Request to change team
		 */
		User.prototype.requestToJoinTeam = function( teamID, callback ) {
			this.accountIO.requestToJoinTeam( teamID, callback );
		}

		/**
		 * Build and return the user's achievements information tree
		 */
		User.prototype.getAchievementsTree = function( callback ) {
			this.accountIO.getAchievementsTree( callback );
		}

		/**
		 * Return a list of the currently unlocked deatures
		 */
		User.prototype.getUnlockedFeatures = function( feature ) {

			// Get knowledge grid as a flat list

		}

		/**
		 * Build and return the list of papers known to the user.
		 */
		User.prototype.getPapers = function( query, callback ) {

			// Query papers
			this.accountIO.listPapers(query, (function(papers) {

				// Update all papers and tag which ones are mine
				for (var i=0; i<papers.length; i++) {
					// Check if this is mine
					papers[i].mine = (papers[i].owner == this.profile['id']);
				}

				// Fire callback
				if (callback)
					callback(papers);

			}).bind(this));

		}

		/**
		 * Return the user and team papers
		 */
		User.prototype.getProfilePapers = function( callback ) {
			// Query papers
			this.accountIO.getProfilePapers( callback );
		}

		/**
		 * Return a signle paper.
		 */
		User.prototype.readPaper = function( paper_id, callback ) {

			// Query knowledge grid
			this.accountIO.readPaper(paper_id, (function(paper) {

				// Check for invalid paper
				if (!paper) {
					if (callback) callback(null);
					return;
				}

				// Check if this paper is editable
				paper.editable = 
					(paper.owner == this.profile['id']) &&
					((paper.status == 0 /* Draft */) || (paper.status == 1 /* Team Review */));

				// Fire callback
				if (callback)
					callback(paper);

			}).bind(this));

		}

		/**
		 * Update a signle paper.
		 */
		User.prototype.updatePaper = function( paper_id, fields, callback ) {
			// Update paper
			this.accountIO.updatePaper(paper_id, fields, callback);
		}

		/**
		 * Delete a signle paper.
		 */
		User.prototype.deletePaper = function( paper_id, callback ) {
			// Update paper
			this.accountIO.deletePaper(paper_id, callback);
		}

		/**
		 * Cite a signle paper.
		 */
		User.prototype.citePaper = function( paper_id, callback ) {
			// Cite paper
			this.accountIO.citePaper(paper_id, callback);
		}

		/**
		 * Shorthand to get the current user's paper
		 */
		User.prototype.getUserPaper = function( callback ) {
			// Get user paper
			this.readPaper( this.profile['activePaper'], callback );
		}

		/**
		 * Shorthand to get the current user's private messages
		 */
		User.prototype.getUserMessages = function( callback ) {
			// Get user messages
			this.accountIO.getUserMessages( callback );
		}

		/**
		 * Shorthand to get user team details
		 */
		User.prototype.getUserTeamDetails = function( callback ) {
			// Get team details
			this.accountIO.getUserTeamDetails( callback );
		}

		/**
		 * Shorthand to update the current user's paper
		 */
		User.prototype.updateUserPaper = function( fields, callback ) {
			// Get user paper
			this.updatePaper( this.profile['activePaper'], fields, callback );
		}

		/**
		 * Create new paper on the user account
		 */
		User.prototype.createPaper = function( callback ) {
			// Create a new paper
			this.accountIO.createPaper( callback );
		};

		/**
		 * Focus on a particular paper
		 */
		User.prototype.focusPaper = function( paper_id, callback ) {
			// Create a new paper
			this.accountIO.focusPaper( paper_id, callback );
		};

		/**
		 * Get book questions
		 */
		User.prototype.getBookExam = function( callback ) {
			// Get user paper
			this.accountIO.getBookExam( callback );
		}

		/**
		 * Send book answers
		 */
		User.prototype.sendBookAnswers = function( answers, callback ) {
			// Get user paper
			this.accountIO.sendBookAnswers( answers, callback );
		}

		/**
		 * Return a book.
		 */
		User.prototype.readBook = function( book_name, callback ) {

			// Query knowledge grid
			this.accountIO.readBook(book_name, (function(book) {

				// Check for invalid paper
				if (!book) {
					if (callback) callback(null, "No such book found");
				} else {
					if (callback) callback(book);
				}

			}).bind(this));

		}

		/**
		 * Get book profile
		 */
		User.prototype.getProfileBooks = function(callback) {
			// Forward book profile request
			this.accountIO.getProfileBooks(callback);
		}

		/**
		 * Commit user variables to the database
		 */
		User.prototype.commitUserRecord = function() {
			// Commit user variables
			this.accountIO.sendVariables(this.vars);
		}

		/**
		 * Shorthand to get the specified part details
		 */
		User.prototype.getPartDetails = function( partName, callback ) {
			// Get part papers
			this.accountIO.getPartDetails( partName, callback );
		}

		/**
		 * Shorthand to unlock the specified part
		 */
		User.prototype.unlockMachineStage = function( partName, callback ) {
			// Get part papers
			this.accountIO.unlockMachineStage( partName, callback );
		}

		/**
		 * Build and return the user's task information tree
		 */
		User.prototype.getTaskDetails = function( task_id ) {
			var db_task = DB.cache['tasks'][task_id],
				u_task  = this.vars['task_details'][task_id];

			// Check if the entire record is missing
			if (!db_task) return null;

			// Populate additional fields
			if (!u_task) {
				this.vars['task_details'][task_id] = u_task = {
					'enabled': false,
					'seen_intro': false,
					'save': [null,null,null,null]
				}
			}

			// Update db_task fields
			db_task['enabled'] = u_task['enabled'];
			db_task['seen_intro'] = u_task['seen_intro'];
			db_task['save'] = u_task['save'];

			// Return data
			return db_task;

		}

		/**
		 * Build and return the user's topic information
		 */
		User.prototype.getTopicDetails = function( topic_id ) {
			var topic = DB.cache['topic_index'][topic_id];
			if (!topic) return;

			// Fetch task information for this topic
			var taskDetails = [];
			for (var i=0; i<topic.tasks.length; i++) {
				// Collect task details
				taskDetails.push( this.getTaskDetails(topic.tasks[i]) );
				// The first one is always enabled
				if (i==0) taskDetails[0].enabled = true;
			}

			// Update task details
			topic.taskDetails = taskDetails;
			return topic;
		}

		/**
		 * Build and return the user's topic information tree
		 */
		User.prototype.getTopicTree = function() {

			// Prepare nodes and links
			var nodes = [],
				links = [],
				node_id = {};

			// Traverse nodes
			var traverse_node = (function(node, parent) {

				// Skip invisible nodes
				if ((parent != null) && !this.vars['enabled_topics'][node['_id']])
					return;

				// Store to nodes & it's lookup
				var curr_node_id = nodes.length;
				node_id[node['_id']] = curr_node_id;
				nodes.push( node );

				// Check if we should make a link
				if (parent != null) {
					var parent_id = node_id[parent['_id']];
					links.push({ 'source': curr_node_id, 'target': parent_id });
				}

				// Traverse child nodes
				for (var i=0; i<node.children.length; i++) {
					traverse_node( node.children[i], node );
				}

			}).bind(this);

			// Start node traversal
			traverse_node( DB.cache['topic_root'], null );

			// Return the tree data
			return {
				'nodes': nodes,
				'links': links
			};

		}

		/**
		 * Grant user access to the specified topic
		 */
		User.prototype.enableChildTopics = function(topic_id) {

			// Lookup children
			var topic = DB.cache['topic_index'][topic_id];
			for (var i=0; i<topic.children.length; i++) {
				// Grant access to the given topic
				this.vars['enabled_topics'][topic.children[i]['_id']] = 1;
			}

			// Commit changes
			this.commitUserRecord();

		}

		/**
		 * Get the save slots for the tasks
		 */
		User.prototype.getTaskSaveSlots = function(task) {

			// Make sure data exist
			if (!this.vars['task_details'][task_id])
				this.vars['task_details'][task_id] = {};
			if (!this.vars['task_details'][task_id]['save'])
				this.vars['task_details'][task_id]['save'] = [null,null,null,null];

			// Return save slot info
			return this.vars['task_details'][task_id]['save'];

		}

		/**
		 * Update the save slot of a particular task
		 */
		User.prototype.setTaskSaveSlot = function(task_id, slot, data) {
			
			// Make sure data exist
			if (!this.vars['task_details'][task_id])
				this.vars['task_details'][task_id] = {};
			if (!this.vars['task_details'][task_id]['save'])
				this.vars['task_details'][task_id]['save'] = [null,null,null,null];

			// Wrap slot index
			if (slot<0) slot=0;
			if (slot>3) slot=3;

			// Update slot data
			this.vars['task_details'][task_id]['save'][slot] = data;

			// Commit changes
			this.commitUserRecord();

		}

		/**
		 * Enable a task
		 */
		User.prototype.setTaskAnimationAsSeen = function(task_id) {

			// Make sure data exist
			if (!this.vars['task_details'][task_id])
				this.vars['task_details'][task_id] = {};
			if (!this.vars['task_details'][task_id]['save'])
				this.vars['task_details'][task_id]['save'] = [null,null,null,null];

			// Grant access to the given task
			this.vars['task_details'][task_id]['seen_intro'] = 1;

			// Commit changes
			this.commitUserRecord();

		}

		/**
		 * Enable a task
		 */
		User.prototype.enableTask = function(task_id) {

			// Make sure data exist
			if (!this.vars['task_details'][task_id])
				this.vars['task_details'][task_id] = {};
			if (!this.vars['task_details'][task_id]['save'])
				this.vars['task_details'][task_id]['save'] = [null,null,null,null];

			// Grant access to the given task
			this.vars['task_details'][task_id]['enabled'] = 1;

			// Commit changes
			this.commitUserRecord();

		}

		/**
		 * Mark a task as completed, by selecting the next one
		 */
		User.prototype.markTaskCompleted = function(task_id, topic_id) {

			// Fetch topic information
			var topic = this.getTopicDetails(topic_id);

			// Check which tasks are handled by the user
			for (var i=0; i<topic.taskDetails.length; i++) {
				var task = topic.taskDetails[i];
				if (task['_id'] == task_id) {
					// Did we reach the end?
					if (i == topic.taskDetails.length-1) {
						// Enable next topic
						this.enableChildTopics(topic_id);
						return;
					} else {
						// Enable next task
						this.enableTask(topic.taskDetails[i+1]['_id']);
						return;
					}
				}
			}

		}


		/**
		 * Check if a topic is complete
		 */
		User.prototype.hasCompletedTopic = function(topic_id) {

			// Fetch topic information
			var topic = DB.cache['topic_index'][topic_id];

			// Check which tasks are handled by the user
			for (var i=0; i<topic.tasks.length; i++) {
				var task = this.vars['task_details'][topic.tasks[i]];
				// Found at least one not completed
				if (!task || !task.enabled)
					return false;
			}

			// Everything was completed!
			return true;

		}

		/**
		 * Get first-time aids detail
		 */
		User.prototype.getFirstTimeDetails = function() {
			if (!DB.cache['first_time']) return [];

			var details = {};
			for (var k in DB.cache['first_time']) {
				var ft = DB.cache['first_time'][k];

				// Check if this first-time is shown
				if (!this.vars['first_time'][k]) {
					ft.shown = false;
				} else {
					ft.shown = this.vars['first_time'][k];
				}

				// Store details
				details[k] = ft;
			}

			return details;
		}

		/**
		 * Check if first-time is seen
		 */
		User.prototype.isFirstTimeSeen = function(aid_id) {
			return !!this.vars['first_time'][aid_id];
		}

		/**
		 * Mark a first-time aid as seen
		 */
		User.prototype.markFirstTimeAsSeen = function(aid_id) {

			// If already seen, don't do anything
			if ((this.vars['first_time'] !== undefined) &&
				(this.vars['first_time'][aid_id])) return;

			// Update first_time aid status
			this.vars['first_time'][aid_id] = 1;

			// Commit changes
			this.commitUserRecord();

		}

		/**
		 * Handle configuration changes
		 */
		User.prototype.onConfigChanged = function( configName, callback ) {
			
			// Register callback for the given configuration parameter
			this.accountConfigCallbacks.push({
				'name': configName,
				'callback' : callback
			});

			// Fire it now
			var cfg = this.state['config'] || [];
			callback( cfg.indexOf(configName) >= 0 );

		}

		/**
		 * Build and return a flat version of the knowledge tree.
		 */
		/*
		User.prototype.getKnowledgeList = function() {
			// Prepare answer array
			var ans = [];

			// Iterate over the knowledge grid
			for (var i=0; i<DB.cache['knowlege_grid_list'].length; i++) {
				var item = DB.cache['knowlege_grid_list'][i];
				// Check it item is explored
				item['enabled'] = !!(this.vars['explored_knowledge'][item['_id']]);
				if (item['parent'] == null) item['enabled']=true;
				ans.push(item);
			}
			return ans;
		}
		*/



		// Return the user scope
		var user = new User();
		return user;
	}

);