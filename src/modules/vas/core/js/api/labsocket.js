/**
 * [core/api/labsocket] - LabSocket API
 */
define(["vas/core/api/interface", "vas/core/liveq/LiveQ", "vas/core/liveq/LabProtocol", "vas/core/liveq/BufferReader", "vas/config"], 

	function(APIInterface, LiveQ, LabProtocol, BufferReader, Config) {

		/**
		 * APISocket LabSocket
		 *
		 * @augments module:vas-core/api/interface~APIInterface
		 * @exports vas-core/api/labsocket
		 */
		var APILabSocket = function(apiSocket, config) {

			// Initialize superclass
			APIInterface.call(this, apiSocket);

			// Create an instance to LabProtocol and fetch all events
			this.labProtocol = new LabProtocol();
			this.labProtocol.forwardAllEventsTo(this);

			// Setup properties
			this.running = false;
			this.focusedJid = 0;
			this.jobs = [];

			// Prepare handshake frame
			var handshakeFrame = {
				"version": LiveQ.version
			};

			// Append tunables/observables if specified
			var cfg = config || {};
			if (cfg.tunables) handshakeFrame['tunables'] = cfg.tunables;
			if (cfg.observables) handshakeFrame['observables'] = cfg.observables;

			// Do handshake
			this.sendAction("open", handshakeFrame);

			// We are connected
			this.connected = true;

			// Fire callbacks
			this.trigger('connected', this);

		}

		// Subclass from APIInterface
		APILabSocket.prototype = Object.create( APIInterface.prototype );

		/**
		 * Handle labSocket event
		 *
		 * @param {string} action - The action name
		 * @param {object} data - The action parameters
		 */
		APILabSocket.prototype.handleAction = function(action, data) {

			if (action == "job.status") {  /* Status message */
				console.log(data['message']);

				// Fire callbacks
				this.trigger('log', data['message'], data['vars']);

			} else if (action == "error") { /* Error message */
				console.error("I/O Error:",data['message']);

				// Fire callbacks
				this.trigger('error', data['message'], false);

			} else if (action == "job.completed") { /* Job completed */
				console.log("Job completed");

				// Fire callbacks
				this.trigger('runCompleted');

				// Simulation is completed
				this.running = false;

			} else if (action == "job.exists") { /* Job already exists */
				console.log("Job exists");

				// Fire callbacks
				this.trigger('runExists');

				// Simulation is completed
				this.running = false;

			} else if (action == "job.failed") { /* Simulation failed */
				console.error("Simulation error:", data['message']);

				// Fire callbacks
				this.trigger('runError', data['message']);

				// Simulation is completed
				this.running = false;

			} else if (action == "job.added") { /* Simulation job added */

				// Job added
				this.trigger('jobAdded', data['job']);

				// Keep jobs
				this.jobs.push( data['job'] );

			} else if (action == "job.removed") { /* Simulation job removed */

				// Job added
				this.trigger('jobRemoved', data['job']);

				// Remove from jobs
				var job = data['job'];
				for (var i=0; i<this.jobs.length; i++) {
					if (this.jobs[i]['id'] == job['id']) {
						this.jobs.splice(i,1);
						break;
					}
				}

			} else if (action == "job.details") { /* Simulation job updated */

				// Job added
				this.trigger('jobDetails', data['job'], data['agents']);

			} else if (action == "job.deactivate") { /* The currently focused job got defocused */

				// Fire callbacks
				this.trigger('jobDeselected', data['jid']);

			}

		}

		/**
		 * Handle labSocket binary frame
		 *
		 * @param {int} action - The action frame ID (16-bit integer)
		 * @param {ArrayBuffer} data - The action payload as a javascript ArrayBuffer
		 */
		APILabSocket.prototype.handleData = function(action, data) {

			// Encapsuate ArrayBuffer in a BufferReader class
			var reader = new BufferReader(data);

			// Skip the first 64-bit (frame header)
			reader.getUint32(); reader.getUint32();

			// Handle frame action
			if (action == 0x01) { /* Configuration Frame */

				// Handle configuration frame
				this.labProtocol.handleConfigFrame( reader );

			} else if (action == 0x02) { /* Histogram Data Frame */

				// Handle histogram data frame
				this.labProtocol.handleFrame( reader );

			}

		}

		/**
		 * Send a simulation request
		 *
		 * @param {object} parameters - An object with the tunable parameter names and their values
		 * @param {array} histograms - A list of histogram names that you want to observe
		 * @param {function} callback - The callback to fire when a response arrives
		 *
		 */
		APILabSocket.prototype.submitJob = function(parameters, histograms, level, callback) {

			// Submit a job request
			this.sendAction("job.submit", {
				'parameters': parameters,
				'observables': histograms || [],
				'level': level
			}, callback);

			// Mark simulation as active
			this.running = true;

		}

		/**
		 * Validate job request
		 *
		 * @param {object} parameters - An object with the tunable parameter names and their values
		 * @param {array} histograms - A list of histogram names that you want to observe
		 * @param {function} callback - The callback to fire when a response arrives
		 *
		 */
		APILabSocket.prototype.verifyJob = function(parameters, histograms, callback) {

			// Submit a job request
			this.sendAction("job.verify", {
				'parameters': parameters,
				'observables': histograms || []
			}, function(data) {
				// Fire callback
				if (callback) callback(data['status'], data);
			});


		}

		/**
		 * Send an interpolation request
		 *
		 * @param {object} parameters - An object with the tunable parameter names and their values
		 * @param {array} histograms - A list of histogram names that you want to observe
		 *
		 */
		APILabSocket.prototype.estimateJob = function(parameters, histograms) {

			// Send job estimation
			this.sendAction("job.estimate", {
				'parameters': parameters,
				'observables': histograms || []
			});

		}

		/**
		 * Enumerate all the jobs available for the user
		 */
		APILabSocket.prototype.enumJobs = function() {

			// Remove all previous jobs
			for (var i=0; i<this.jobs.length; i++) {
				this.trigger('jobRemoved', this.jobs[i]);
			}
			this.jobs = [];

			// Request job enumeration
			this.sendAction("job.enum");

		}

		/**
		 * Focus on the particular job 
		 */
		APILabSocket.prototype.selectJob = function( jobid ) {
			
			// Request job focus change
			this.sendAction("job.select", { 'jid': jobid });
		
		}

		/**
		 * Abort a the particular job 
		 */
		APILabSocket.prototype.abortJob = function( jobid ) {
			
			// Request job focus change
			this.sendAction("job.abort", { 'jid': jobid });
		
		}

		/**
		 * Deselect a possible active job 
		 */
		APILabSocket.prototype.deselectJob = function() {
			
			// Request job focus change
			this.sendAction("job.deselect");
		
		}

		/**
		 * Get details about the specified job
		 */
		APILabSocket.prototype.getJobDetails = function( jobid, callback ) {

			// Submit a job request
			this.sendAction("job.details", {
				'jid': jobid
			}, function(data) {
				if (callback) callback(data['data']);
			});

		}

		/**
		 * Get job results
		 */
		APILabSocket.prototype.getJobResults = function( jobid, callback ) {

			// Submit a job request
			this.sendAction("job.results", {
				'jid': jobid
			}, function(data) {
				if (callback) callback(data['data']);
			});

		}

		/**
		 * This event is fired when the socket is connected.
		 *
		 * @event module:vas-core/api/labsocket~APILabSocket#connected		
		 */

		/**
		 * This event is fired when the socket is disconnected.
		 *
		 * @event module:vas-core/api/labsocket~APILabSocket#disconnected		
		 */

		/**
		 * This event is fired when the socket is connected.
		 *
		 * @param {string} errorMessage - The error message
		 * @param {boolean} recoverable - If true the error is recoverable
		 * @event module:vas-core/api/labsocket~APILabSocket#error		
		 */

		/**
		 * This event is fired when there was a simulation error.
		 *
		 * @param {string} errorMessage - The error message
		 * @event module:vas-core/api/labsocket~APILabSocket#runError		
		 */

		/**
		 * This event is fired when the simulation is completed.
		 *
		 * @event module:vas-core/api/labsocket~APILabSocket#runCompleted		
		 */

		/**
		 * A log message arrived from the server.
		 *
		 * @param {string} logMessage - The message to log
		 * @event module:vas-core/api/labsocket~APILabSocket#log		
		 */

		// Return the APILabSocket class
		return APILabSocket;

	}

);