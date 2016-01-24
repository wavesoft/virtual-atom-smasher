/**
 * [core/main] - Core initialization module
 */
define(["vas/config", "vas/core/user", "core/util/event_base", "vas/core/apisocket", "vas/core/global", 
		"vas/core/liveq/Calculate", "ccl-tracker"], 

	/**
	 * User API fast interface.
	 */
	function(Config, User, EventBase, APISocket, Global, Calculate, Analytics) {

		/**
		 * Job status constnat
		 */
		var JOB_STATUS = ['queued', 'running', 'completed', 'failed', 'cancelled', 'stalled', 'exists'];

		/**
		 * Class that holds and maintains the active job details
		 * @class
		 */
		var SimulationJob = function( parent, id ) {
			this.parent = parent;

			/**
			 * The Job ID
			 * @type {string}
			 */
			this.id = id;

			/**
			 * The linked level details
			 * @type {Object}
			 */
			this.levelDetails = null;

			/**
			 * The hisograms
			 * @type {array}
			 */
			this.histograms = [];

			/**
			 * The goodness of fit for each histogram
			 * @type {array}
			 */
			this.fits = [];

			/**
			 * The average value of the chi² distribution
			 * @type {Number}
			 */
			this.fitAverage = 0;

			/**
			 * The observable metadata
			 * @type {object}
			 */
			this.observablesMetadata = {};

			/**
			 * Rate of events per second
			 * @type {Number}
			 */
			this.eventRate = 0;

			/**
			 * Number of events
			 * @type {Number}
			 */
			this.events = 0;

			/**
			 * Maximum number of events
			 * @type {Number}
			 */
			this.maxEvents = 0;

			/**
			 * Progress in the simulation
			 * @type {Number}
			 */
			this.progress = 0;

			/**
			 * Rest of job metadata
			 * @type {object}
			 */
			this.meta = {};

			/**
			 * Agent details
			 * @type {array}
			 */
			this.agents = [];

			/**
			 * The current job state
			 * @type {string}
			 */
			this.status = "idle";

			// Last properties for rate counting
			this._lastNevtsTimestamp = 0;
			this._rateRing = [];
			this._contributeTimer = 0
			this._contributeAlertSent = false;

		};

		/**
		 * Update the histograms
		 */
		SimulationJob.prototype.setHistograms = function( histograms ) {

			// Update histograms
			this.histograms = histograms;

			// Inject metadata
			for (var i=0; i<this.histograms.length; i++) {
				this.histograms[i].meta = 
					this.observablesMetadata[ this.histograms[i].id ];
			}

			// Update histograms
			this.parent.trigger('update.histograms', this.histograms);

			// Run analysis over the histograms
			var fitCount = 0;
			this.fitAverage = 0;
			this.fits = [];
			for (var i=0; i<histograms.length; i++) {
				var h = histograms[i],
					chi2 = Calculate.chi2WithError( h.ref.data, h.data, 0.05 );

				// If chi2 is null, set some defaults
				if (!chi2) {

					// Update fits
					this.fits.push({
						'id': h.id,
						'fit': 0,
						'error': 0,
					});

				} else {
					// Update fits
					this.fits.push({
						'id': h.id,
						'fit': chi2[0],
						'error': chi2[1]
					});

					// Update average
					this.fitAverage += chi2[0];
					fitCount++;
				}

			}
			if (fitCount > 0) this.fitAverage /= fitCount;

			// Update fits
			this.parent.trigger('update.fits', this.fits);

			// Update average fit
			this.parent.trigger('update.fitAverage', this.fitAverage);

			// If we have data, we are running
			if (!histograms[0].data.empty) {
				this.setStatus("running");
			}

		}

		/**
		 * Update the current number of events and the event rate estimate
		 */
		SimulationJob.prototype.updateNevts = function( nevts ) {

			// Update number
			var currTime = Date.now();

			// Define or update rate
			if (this._lastNevtsTimestamp == 0) {
				this._lastNevtsTimestamp = currTime;

			} else {

				// If for any reason nevts is smaller, reset
				if (nevts < this.events) {
					this._rateRing = [];
					this.eventRate = 0;

				} else {

					// Calculate rate (events / ms)
					var rate = (nevts - this.events) * 1000 / (currTime - this._lastNevtsTimestamp);

					// Round values through event rate ring
					this._rateRing.push(rate);
					if (this._rateRing.length > 10) this._rateRing.shift();

					// Average
					this.eventRate = 0;
					for (var i=0; i<this._rateRing.length; i++)
						this.eventRate += this._rateRing[i];
					this.eventRate /= this._rateRing.length;

					// Update event rate
					this.parent.trigger('update.eventRate', this.eventRate);

				}

			}

			// Update events
			this._lastNevtsTimestamp = currTime;
			this.events = nevts;

			// If we have max events, update progress
			if (this.maxEvents) {
				this.progress = 100 * nevts / this.maxEvents;
				this.parent.trigger('update.progress', this.progress);
			}

			// Update number of events
			this.parent.trigger('update.events', nevts);

		}

		/**
		 * Update the current agents
		 */
		SimulationJob.prototype.setAgents = function( agents ) {

			// Reset agents array
			this.agents = [];
			for (var i=0; i<agents.length; i++) {
				var a = agents[i];

				// Parse lat/lng if exist, otherwise use random
				var lat = String(Math.random() * 180 - 90),
					lng = String(Math.random() * 180);

				// Update lat/lng
				if (a['latlng'] != undefined) {
					var parts = a['latlng'].split(",");
					lat = Number(parts[0]);
					lng = Number(parts[1]);
				}

				// Add agent
				this.agents.push({
					'uuid': a['uuid'],
					'lat': lat,
					'lng': lng
				});
			}

			// Update agents
			this.parent.trigger('update.agents', this.agents);

		}

		/**
		 * Add an agent
		 */
		SimulationJob.prototype.addAgent = function( uuid, lat, lng ) {
			// Add agent
			this.agents.push({
				'uuid' : uuid,
				'lat'  : lat,
				'lng'  : lng
			});

			// Update agents
			this.parent.trigger('update.agents', this.agents);

			// Transient status handling
			if (this.status == "queued") {
				this.setStatus("starting");
			}

		}

		/**
		 * Remove an agent
		 */
		SimulationJob.prototype.removeAgent = function( uuid ) {
			for (var i=0; i<this.agents.length; i++) {
				if (this.agents[i].uuid == uuid) {

					// Delete agent
					this.agents.splice(i,1);

					// Update agents
					this.parent.trigger('update.agents', this.agents);

					// Transient status handling
					if ((this.agents.length == 0) && (["starting","running"].indexOf(this.status) != -1)) {
						this.setStatus("queued");
					}

					// Do not continue
					return;
				}
			}
		}

		/**
		 * Reset all properties
		 */
		SimulationJob.prototype.reset = function() {

			// Reset properties
			this.histograms = [];
			this.observablesMetadata = {};
			this.fits = [];
			this.fitAverage = 0;
			this.events = 0;
			this.eventRate = 0;
			this.maxEvents = 0;
			this.progress = 0;
			this.meta = {};
			this.agents = [];
			this.status = "idle";
			this._lastNevtsTimestamp = 0;
			this._rateRing = [];

			// Send interface udpate events to reset
			this.triggerUpdates();

		}

		/**
		 * Trigger updates
		 */
		SimulationJob.prototype.triggerUpdates = function() {
			this.parent.trigger('update.eventRate', this.eventRate);
			this.parent.trigger('update.progress', this.progress);
			this.parent.trigger('update.events', this.events);
			this.parent.trigger('update.agents', this.agents);
			this.parent.trigger('update.histograms', this.histograms);
			this.parent.trigger('update.fits', this.fits);
			this.parent.trigger('update.fitAverage', this.fitAverage);
			this.parent.trigger('update.status', this.status);
		}

		/**
		 * Change state
		 */
		SimulationJob.prototype.setStatus = function( status ) {

			// Don't change status if we are on the same
			if (this.status == status) return;
			this.status = status;

			// Trigger status change
			this.parent.trigger('update.status', this.status);

			// If we are queued for too long, prompt the user
			// to start his own computing resources
			if (!this._contributeAlertSent) {
				if (status == 'queued') {

					// Wait a minute
					this._contributeTimer = setTimeout((function() {

						// Send alert
						this._contributeAlertSent = true;
						this.parent.trigger("notify.startResources");

					}).bind(this), 60000);

				} else {

					// Abort timer otherwise
					clearTimeout(this._contributeTimer);

				}
			}

		}

		/**
		 * Simulation Control and Realtime Feedback
		 *
		 * @class
		 * @classdesc Simulation Control and Realtime Feedback Class
		 * @augments module:core/util/event_base~EventBase
		 * @exports vas-core/simulation
		 */
		var Simulation = function() {

			// Subclass from EventBase
			EventBase.call(this);

			/**
			 * Cache of observable definitions
			 * @type {object}
			 */
			this._observableDetails = {};

			/**
			 * Active job metadata
			 * @type {vas-core/simulation~SimulationJob}
			 */
			this.activeJob = null;

			// Idle helper
			this._idle = false;
			this._idleCallbacks = [];

			// On user log-in update status
			Global.events.on('login', (function(profile) {

				// Open a LabSocket interface
				this.labapi = APISocket.openLabsocket();
				this.bindToLabsocket( this.labapi );

				// Enumerate pending jobs
				this.labapi.enumJobs();

			}).bind(this));

			/**
			 * Receive job update events
			 */
			APISocket.on('event', (function(evDetails) {
				var evName = evDetails['name'],
					evData = evDetails['data'] || {};

				// -----------------------------
				//  Job Update
				// -----------------------------
				if (evName == 'job_update') {

					// Check if this is our current job
					if (this.activeJob && (this.activeJob.id == evDetails['job'])) {
						// Update status
						this.activeJob.setStatus( JOB_STATUS[evDetails['status']] );
					}

				}

			}).bind(this));

		};

		// Subclass from EventBase
		Simulation.prototype = Object.create( EventBase.prototype );

		///////////////////////////////////////////////////////
		// Helper Functions
		///////////////////////////////////////////////////////

		/**
		 * Fire the specified callback when no pending operation in place
		 */
		Simulation.prototype.onIdle = function( callback ) {
			if (this._idle) {
				callback();
				return;
			}
			this._idleCallbacks.push(callback);
		}

		/**
		 * Acuire/Release Idle lock
		 */
		Simulation.prototype._setIdle = function( idle ) {
			this._idle = idle;
			if (idle && (this._idleCallbacks.length > 0)) {
				for (var i=0; i<this._idleCallbacks.length; i++) {
					try {
						this._idleCallbacks[i]();
					} catch (e) {
						console.error("Error triggering onIdle callback!");
					}
				}
			}
		}
		/**
		 * Get (optionally cached) definitions of the specified list of observables
		 */
		Simulation.prototype.getObservableDetails = function( names, callback ) {

			// Check what is not cached
			var ans = {},
				queryNames = [];
			for (var i=0; i<names.length; i++) {
				if (this._observableDetails[names[i]] === undefined) {
					// Schedule for query
					queryNames.push( names[i] );
				} else {
					// Oterwise update right now
					ans[ names[i] ] = this._observableDetails[names[i]];
				}
			}

			// If everything is cached, callback now
			if (queryNames.length == 0) {
				callback( ans );
				return;
			}

			// Otherwise, query DB
			var DB = APISocket.openDb();
			this._setIdle(false);
			DB.getMultipleRecords("observable", names, (function(docs) {

				// Handle response
				for (var i=0; i<docs.length; i++) {
					var obs = docs[i];

					// Update cache and answer
					this._observableDetails[obs['name']] = obs;
					ans[obs['name']] = obs;

				}

				// Fire callback
				callback( ans );

				// We are now idle
				this._setIdle(true);

			}).bind(this));

		}

		/**
		 * Bind to a particular job
		 */
		Simulation.prototype.bindToJob = function( jid ) {

			// Crete management class
			this.activeJob = new SimulationJob( this, jid );

			// Select the particular job
			// (This will trigger a 'jobDetails' event)
			this.labapi.selectJob( jid );

		}

		/**
		 * Unbind from the active job
		 */
		Simulation.prototype.unbindFromJob = function() {

			// Make sure we are idle
			this.onIdle((function() {

				// Release job description
				if (this.activeJob) {
					this.activeJob.reset();			
					this.activeJob = null;

					// The job is now undefined
					this.trigger('job.undefined');
				}

				// Change state to idle
				this.trigger('update.status', "idle");

			}).bind(this));

		}

		/**
		 * Bind to lab socket events
		 */
		Simulation.prototype.bindToLabsocket = function( labSocket ) {

			//
			// All LabSocket errors are logged to console
			//
			labSocket.on('error', (function(message, critical) {

				// Forward event
				this.trigger('error', message, critical);

			}).bind(this));

			//
			// When a histogram is added, we are creating an observable
			//
			labSocket.on('histogramsAdded', (function(histos, channelID) {

				// Forward event
				this.trigger('histogramsAdded', histos, channelID);

				// Skip uninteresting channels
				if (channelID != 0) return;

				// If we don't have an active job something went wrong
				if (!this.activeJob) {
					console.error("Got histogramsAdded, without having an active job!");
					return;
				}

				// Collect names of histograms
				var histoNames = [];
				for (var i=0; i<histos.length; i++) {
					histoNames.push(histos[i].id);
				}

				// Get observable metadata and update job details
				this.getObservableDetails( histoNames, (function(meta) { 

					// Update observables metadata
					this.activeJob.observablesMetadata = meta;

					// Update histograms
					this.activeJob.setHistograms( histos );

					// The job is now defined
					this.trigger('job.defined', this.activeJob);

				}).bind(this));

			}).bind(this));


			//
			// When the bulk of histograms is updated, update
			// the possibly open overlay component.
			//
			labSocket.on('histogramsUpdated', (function(histos, channelID) {

				// Forward event
				this.trigger('histogramsUpdated', histos, channelID);

				// Check if this set of histogram targets a query
				if (channelID != 0) {

					// Check if this is for a query
					if (this.pendingQueryCallback && (channelID == 1)) {
						// Trigger callback & Reset
						this.pendingQueryCallback( histos )
						this.pendingQueryCallback = null;
					}

					// Discard
					return;

				}


				// If we don't have an active job something went wrong
				if (!this.activeJob) {
					console.error("Got histogramsUpdated, without having an active job!");
					return;
				}

				// Update histograms
				this.activeJob.setHistograms( histos );

				// // Update histograms and index
				// this.lastHistograms = histos;
				// for (var i=0; i<histos.length; i++) {
				// 	this.lastHistogramsIndex[histos[i].id] = histos[i];
				// }

				// // Make 'view' button clickable
				// this.select(".p-view").removeClass("disabled");

				// // Update all observables
				// for (var i=0; i<histos.length; i++) {
				// 	var h = histos[i];
				// 	this.updateObservable( h.id, h );
				// }

				// // Update overlay component
				// if (this.overlayComponent) {
				// 	this.overlayComponent.onHistogramsDefined( histos );
				// }

			}).bind(this));


			//
			// When metadata are updated, calculate various metrics 
			//
			labSocket.on('metadataUpdated', (function(meta) {

				// Forward event
				this.trigger('metadataUpdated', meta);

				// Skip uninteresting channels
				if (meta['channel'] != 0) return;

				// If we don't have an active job something went wrong
				if (!this.activeJob) {
					console.error("Got metadataUpdated, without having an active job!");
					return;
				}

				// Update number of events and rate counter
				this.activeJob.updateNevts( parseInt(meta['nevts']) );

			}).bind(this));


			//
			// Listen for telemetry data and update worlders
			//
			labSocket.on('log', (function(logLine, telemetryData) {

				// Forward event
				this.trigger('log', logLine, telemetryData);

				// If we don't have an active job something went wrong
				if (!this.activeJob) {
					return;
				}

				// Handle telemetry data
				if (telemetryData['agent_added']) {

					// Parse lat/lng if exist, otherwise use random
					var lat = String(Math.random() * 180 - 90),
						lng = String(Math.random() * 180);
					// Update lat/lng
					if (telemetryData['agent_added_latlng'] != undefined) {
						var parts = telemetryData['agent_added_latlng'].split(",");
						lat = Number(parts[0]);
						lng = Number(parts[1]);
					}

					// Add agent
					this.activeJob.addAgent( telemetryData['agent_added'],lat,lng );

				} else if (telemetryData['agent_removed']) {

					// Remove agent
					this.activeJob.removeAgent( telemetryData['agent_removed'] );

				}

			}).bind(this));

			//
			// Reset interface when current job is deselected
			//
			labSocket.on('jobDeselected', (function(jobid) {

				// Forward event
				this.trigger('jobDeselected', jobid);

				// Unbind job when deselected
				if (this.activeJob && (this.activeJob.id == jobid))
					this.unbindFromJob();

			}).bind(this));

			//
			// Handle job listings
			//
			labSocket.on('jobAdded', (function(job) {

				// Forward event
				this.trigger('jobAdded', job);

				// The first job is activated
				if (!this.activeJob) {
					this.bindToJob( job['id'] );
				}

			}).bind(this));
			labSocket.on('jobRemoved', (function(job) {

				// Forward event
				this.trigger('jobRemoved', job);

				// Unbind job when removed
				if (this.activeJob && (this.activeJob.id == jobid))
					this.unbindFromJob();

			}).bind(this));

			//
			// When job is completed, reset interface
			//
			labSocket.on('runCompleted', (function() {

				// Forward event
				this.trigger('runCompleted');

				// Unbind job when completed
				if (this.activeJob) {
					this.activeJob.setStatus("completed");
					this.unbindFromJob();
				}

			}).bind(this));

			//
			// When such job is already exists
			//
			labSocket.on('runExists', (function() {

				// Forward event
				this.trigger('runExists');

				// If we don't have an active job something went wrong
				if (!this.activeJob) {
					console.error("Got runExists, without having an active job!");
					return;
				}

				// Unbind job when completed
				if (this.activeJob) {
					this.activeJob.setStatus("exists");
					this.unbindFromJob();
				}

				// // Make the interface aware of the situation
				// this.select(".p-run-status").text( "ARCHIVED" );
				// this.select(".p-progress .panel-value").text( "---" );
				// this.select(".p-machines .panel-value").text("---");
				// this.select(".p-events .panel-value").text("---");
				// this.select(".p-abort").addClass("disabled");
				// this.select(".p-details").removeClass("disabled");

				// // Set the existing flag
				// this.existingResults = true;

				// // Do not allow to submit another job
				// UI.scheduleFlash(
				// 	"Existing Submission", 
				// 	"Someone has already tried this configuration. We are presenting you the results.",
				// 	"flash-icons/relax.png"
				// );

			}).bind(this));

			//
			// Apply job details when they arrive
			//
			labSocket.on('jobDetails', (function(job, agents) {

				// Forward event
				this.trigger('jobDetails', job, agents);

				// If we don't have an active job something went wrong
				if (!this.activeJob) {
					console.error("Got jobDetails, without having an active job!");
					return;
				}

				// Keep job details
				this.activeJob.meta = job;
				this.activeJob.maxEvents = job['maxEvents'];
				this.activeJob.setAgents( agents );

				// Update status
				this.activeJob.setStatus( JOB_STATUS[job['status']] );

				// Get level details
				if (!this.activeJob.levelDetails) {
					// Query level details from job record
					User.getLevelDetails( job['level'], (function(details) {
						this.activeJob.levelDetails = details;
					}).bind(this));
				}

			}).bind(this));

		}

		///////////////////////////////////////////////////////
		// Public Interface
		///////////////////////////////////////////////////////

		/**
		 * Check if we can submit the specified job
		 */
		Simulation.prototype.canSubmit = function( tunables, level, callback ) {

			// If we have an active job callback right away
			if (this.activeJob != null) {
				callback(false, "You can only submit one job. Please wait until it's finished or abort the previous one.");
				return;
			}

			// But don't trust only our cached state
			this.labapi.verifyJob( tunables, [], (function(status) {
				if (status == "ok") {
					callback(true);
				} else if (status == "conflict") {
					callback(false, "You can only submit one job. Please wait until it's finished or abort the previous one.");
				}
			}).bind(this));

		}

		/**
		 * Submit simulation parameters and start
		 */
		Simulation.prototype.submit = function( tunables, level ) {

			// Make sure no duplicates exist
			if (this.activeJob != null) {
				console.error("You can only submit a job if there is no other running!");
				return;
			};

			// Get level details
			User.getLevelDetails( level, (function(levelDetails) {

				// Try to submit job
				this.labapi.submitJob( tunables, [], level, (function(job) {
					var jid = job['jid'];
					console.log("Job submission completed",job);

					// Create active job
					this.activeJob = new SimulationJob( this, jid );

					// Set level details
					this.activeJob.levelDetails = levelDetails;

					// The 'histogramsAdded' and 'jobDetails' will be fired soon

				}).bind(this) );

			}).bind(this));

		}

		/**
		 * Abort a running simulation
		 */
		Simulation.prototype.abort = function() {

			// Don't do anything if there is an active job
			if (!this.activeJob)
				return;

			// Abort job
			this.labapi.abortJob( this.activeJob.id );

		}

		/**
		 * Get results of some particular simulation
		 */
		Simulation.prototype.getResults = function( jid, callback ) {

			// Set a pending query
			this.pendingQueryCallback = callback;

			// Send request
			this.labapi.getJobResults(jid, (function(data) {
				// Check for errors
				if (data['status'] != 'ok') {

					// Trigger error if failed
					this.pendingQueryCallback = null;
					if (callback) callback([], data['message']);

				}
			}).bind(this));

		}

		///////////////////////////////////////////////////////
		// Events Definition
		///////////////////////////////////////////////////////

		/**
		 * The simulation state has changes
		 *
		 * 	- idle 	    : No simulation is running
		 *  - queued    : The simulation is queued
		 *  - starting  : The simulation has started to one or more workers
		 *  - running   : The simulation is running
		 *  - halted    : The simulation is halted
		 *
		 * @param {string} state - The new state name
		 * @event module:vas-core/simulation~Simulation#stateChanged		
		 */

		/**
		 * A job was defined
		 *
		 * @param {vas-core/simulation~SimulationJob} job - The job that was just defined
		 * @event module:vas-core/simulation~Simulation#job.defined		
		 */

		/**
		 * A job was undefined
		 *
		 * @param {vas-core/simulation~SimulationJob} job - The job that was just undefined
		 * @event module:vas-core/simulation~Simulation#job.undefined		
		 */

		/**
		 * This message is sent when the user stays on 'queued' for too long,
		 * this should be handled according tot he currently active component to 
		 * prompt the user to start a resource through citizengrid.
		 *
		 * @event module:vas-core/simulation~Simulation#notify.startResources		
		 */

		///////////////////////////////////////////////////////

		// Create singleton
		var simulation = new Simulation();
		return simulation;

	}

);