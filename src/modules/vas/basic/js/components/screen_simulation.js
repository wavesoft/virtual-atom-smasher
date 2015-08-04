
define(

	// Requirements
	[ 
		"ccl-tracker",
		"vas/core/registry", "vas/core/base/components", "vas/core/ui", "vas/core/user", "vas/media", "vas/core/apisocket",
		"text!vas/basic/tpl/simulation.html"
	],

	/**
	 * Basic version of the jobs screen
	 *
	 * @exports basic/components/screen_simulation
	 */
	function( Analytics, R, C, UI, User, Media, APISocket, tplMain ) {

		/**
		 * @class
		 * @classdesc The basic simulation screen
		 */
		var SimulationScreen = function( hostDOM ) {
			C.SimulationScreen.call(this, hostDOM);

			// Setup class and template
			hostDOM.addClass("simulation");
			this.loadTemplate( tplMain );
			this.renderView();

			// Setup properties
			this.observables = [];
			this.rateRing = [];
			this.overlayComponent = null;
			this.labapi = null;
			this.submitTunables = null;
			this.submitObservables = null;

			//
			// Create globe
			//
			this.globe = R.instanceComponent( "widget.globe3d", this.select(".observable-center") );
			if (!this.globe) {
				console.warn("Unable to instantiate Glob3D widget");
			} else {
				this.forwardVisualEvents( this.globe );
			}
			this.globe.setPaused(true);

			//
			// Bind a handler to the 'Help' button
			//
			this.select(".p-help").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();
				// Show help
				this.trigger("help", "03-simulation");
				this.trigger("help", "04-histogram");
			}).bind(this));

			//
			// Bind a handler to the 'Abort' button
			//
			this.select(".p-abort").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();
				// Abort LabAPI job
				if (this.labapi) {
					this.labapi.abortJob( this.activeJob );
					this.resetInterface();
				}
				// Hide jobs
				this.trigger("hideJobs");
			}).bind(this));

			//
			// Bind a handler to the 'View' button
			//
			this.select(".p-view").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();
				// Show histograms
				if (this.lastHistograms) {
					// Show histograms overlay
					UI.showOverlay("overlay.histograms", (function(com) {
						// Define overlay component
						this.overlayComponent = com;
						// Update histograms
						this.overlayComponent.onHistogramsDefined( this.lastHistograms );
					}).bind(this));
				}
			}).bind(this));

			//
			// Bind a handler to the 'Feedback' button
			//
			this.select(".p-feedback").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();
				// Send feedback
				this.trigger("feedback", {
					"screen": "jobs"
				});
			}).bind(this));

			//
			// Bind a handler to the 'Down' button
			//
			this.select(".p-hidejobs").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();
				// Hide panel
				this.trigger("hideJobs");
			}).bind(this));

			//
			// Bind job details
			//
			this.select(".p-details").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();

				// A tuning value changed
				Analytics.fireEvent("simulation.jobdetails", {
				});

				// Show job details
				this.labapi.getJobDetails(this.activeJob, (function(details) {
					// Show job details overlay
					UI.showOverlay("overlay.jobstatus", (function(com) {
						com.onJobDetailsUpdated( details );
					}).bind(this));
				}).bind(this));

			}).bind(this));

			//
			//
			//
			this.select(".p-game").click((function(e) {
				// Cancel event
				e.stopPropagation();
				e.preventDefault();

				// A tuning value changed
				Analytics.restartTimer("simulation.playgame");
				Analytics.fireEvent("simulation.playgame", {
				});

				// Display a mini-game
				UI.showOverlay("overlay.embed", (function(gameOvr) {

					// Configure Embed frame
					gameOvr.onEmbedConfigured({
						'url': '//particle-clicker.web.cern.ch/particle-clicker/'
					});

					// Fire analytics callback when closed
					gameOvr.on("close", function() {
						Analytics.fireEvent("simulation.playgame.time", {
							"time": Analytics.stopTimer("simulation.playgame")
						});
					});
					gameOvr.on("dispose", function() {
						Analytics.fireEvent("simulation.playgame.time", {
							"time": Analytics.stopTimer("simulation.playgame")
						});
					});

				}).bind(this));
			}).bind(this));

		}

		SimulationScreen.prototype = Object.create( C.SimulationScreen.prototype );

		////////////////////////////////////////////////////////////////////////
		// HELPER FUNCTIONS
		////////////////////////////////////////////////////////////////////////

		/**
		 * Reset interface status
		 */
		SimulationScreen.prototype.resetInterface = function() {

			// Empty ovservable hosts
			this.select(".observable-host").empty();
			this.select(".p-run-status").text( "---" );
			this.select(".p-machines .panel-value").text("0");
			this.select(".p-events .panel-value").text("0");
			this.select(".p-progress .panel-value").text("0 %");
			this.select(".p-abort").addClass("disabled");
			this.select(".p-view").addClass("disabled");

			// Reset properties
			this.rateRing = [];
			this.observables = [];
			this.numConnectedMachines = 0;
			this.pinIndex = { };
			this.activeJob = null;

			// Reset globe
			this.globe.removeAllPins();
			this.globe.setPaused(true);

		}

		/**
		 * Resize the target screen
		 */
		SimulationScreen.prototype.resizeTargetScreen = function() {
			var target = this.select(".observable-target"),
				size = Math.min(this.width, this.height) - 100,
				halfSize = size/2;

			target.css({
				"width": size,
				"height": size,
				"-webkit-transform": "translateX(-"+halfSize+"px) translateY(-"+halfSize+"px)",
				"-moz-transform": "translateX(-"+halfSize+"px) translateY(-"+halfSize+"px)",
				"-ms-transform": "translateX(-"+halfSize+"px) translateY(-"+halfSize+"px)",
				"-o-transform": "translateX(-"+halfSize+"px) translateY(-"+halfSize+"px)",
				"transform": "translateX(-"+halfSize+"px) translateY(-"+halfSize+"px)"
			})
		}

		/**
		 * Rearrange observables
		 */
		SimulationScreen.prototype.rearrangeObservables = function() {

			var rotation = 0, rotate_step = 360 / this.observables.length;
			for (var i=0; i<this.observables.length; i++) {

				// Update com
				this.observables[i].dom
					.css( "-webkit-transform", "rotate(" + rotation + "deg)" )
					.css( "-moz-transform", "rotate(" + rotation + "deg)" )
					.css( "-ms-transform", "rotate(" + rotation + "deg)" )
					.css( "-o-transform", "rotate(" + rotation + "deg)" )
					.css( "transform", "rotate(" + rotation + "deg)" );

				// Update dom elements with reverse rotation
				this.observables[i].dom.find(".x-inverse-rotation")
					.css( "-webkit-transform", "rotate(-" + rotation + "deg)" )
					.css( "-moz-transform", "rotate(-" + rotation + "deg)" )
					.css( "-ms-transform", "rotate(-" + rotation + "deg)" )
					.css( "-o-transform", "rotate(-" + rotation + "deg)" )
					.css( "transform", "rotate(-" + rotation + "deg)" );

				// Add flip if rotation exceeds
				if ((rotation > 90) && (rotation < 270)) {
					this.observables[i].dom.addClass("x-flip-label");
				} else {
					this.observables[i].dom.removeClass("x-flip-label");
				}

				// Step to next rotation
				rotation += rotate_step;
			}

		}

		/**
		 * Lookup and update an observable
		 */
		SimulationScreen.prototype.updateObservable = function( id, histogram ) {

			// Iterate over the observables
			for (var i=0; i<this.observables.length; i++) {
				var obs = this.observables[i];

				// Update if found
				if (obs.id == id) {
					obs.com.onUpdate( histogram );
					return;
				}
			}

		}

		/**
		 * Add a new observable in the target
		 */
		SimulationScreen.prototype.createObservable = function( id, meta ) {

			// Create observable record
			var obs = {
				'id'	: id,
				'meta' 	: meta,
				'dom'	: null
			};

			// Create new DOM element
			obs.dom = $("<div></div>").appendTo( this.select(".observable-host") );

			// Allocate new component
			obs.com = R.instanceComponent( "widget.observable_point", obs.dom );
			if (!obs.com) {
				console.error("Unable to load component for visualising observable point");
				return;
			}

			// Update component metadata
			obs.com.onMetaUpdate( meta );

			// Store on observables
			this.observables.push( obs );

		}

		/**
		 * Apply job details
		 */
		SimulationScreen.prototype.applyJobDetails = function( job, agents ) {

			// Select
			this.activeJob = job['id'];

			// Update maximum number of events
			this.maxEvents = job['maxEvents'];

			// Change status label of the focused job
			var jobStatus = ['QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'STALLED'];
			this.select(".p-run-status").text( jobStatus[job['status']] );

			// Start globe spinning if status is running
			this.globe.setPaused( !(job['status'] == 1)  );
			if ((job['status'] < 2) || (job['status'] == 5)) {
				this.select(".p-abort").removeClass("disabled");
				this.select(".p-details").removeClass("disabled");
			}

			// Parse agents
			this.globe.removeAllPins();
			this.pinIndex = { };
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

				// Add a pin to the globe
				this.pinIndex[a['uuid']] = this.globe.addPin( lat, lng );
				this.globe.setPaused(false);

				// Update interface
				this.numConnectedMachines++;
				this.select(".p-machines .panel-value").text(this.numConnectedMachines);

			}

		}

		/**
		 * Bind interface to a particular job
		 */
		SimulationScreen.prototype.bindToJob = function( job ) {

			// Focus on the given job
			this.resetInterface();
			this.labapi.selectJob( job );

			// Focus to job
			this.activeJob = job;

		}

		/**
		 * Bind to LabSocket API
		 */
		SimulationScreen.prototype.bindToLabsocket = function( labSocket ) {

			// Open a database API interface for querying the database
			var DB = APISocket.openDb();

			//
			// All LabSocket errors are logged to console
			//
			labSocket.on('error', (function(message, critical) {
				UI.logError( message, critical );
			}).bind(this));

			//
			// When a histogram is added, we are creating an observable
			//
			labSocket.on('histogramsAdded', (function(histos) {

				// Collect names and map histogram ID to object
				var histoNames = [],
					histoMap = {};
				for (var i=0; i<histos.length; i++) {
					histoNames.push(histos[i].id);
					histoMap[histos[i].id] = histos[i];
				}

				// Query db for observable details
				DB.getMultipleRecords("observable", histoNames, (function(docs) {

					// Handle response
					for (var i=0; i<docs.length; i++) {
						var obs = docs[i],
							hist = histoMap[obs['name']];

						// Fire respective observable
						this.createObservable( hist.id, obs );

					}

					// Rearrange observables
					this.rearrangeObservables();

				}).bind(this));

			}).bind(this));


			//
			// When the bulk of histograms is updated, update
			// the possibly open overlay component.
			//
			labSocket.on('histogramsUpdated', (function(histos) {
				this.lastHistograms = histos;
				this.select(".p-view").removeClass("disabled");
				//this.eStatusLabel.text("RUNNING");

				// Update all observables
				for (var i=0; i<histos.length; i++) {
					var h = histos[i];
					this.updateObservable( h.id, h );
				}

				// Update overlay component
				if (this.overlayComponent) {
					this.overlayComponent.onHistogramsDefined( histos );
				}

			}).bind(this));


			//
			// When metadata are updated, calculate various metrics 
			//
			labSocket.on('metadataUpdated', (function(meta) {
				var currNevts = parseInt(meta['nevts']),
					progValue = currNevts * 100 / this.maxEvents;
				this.select(".p-progress .panel-value").text( Math.round(progValue) + " %" );

				// Calculate rate
				var currTime = Date.now();
				if (this.lastEventsTime) {
					var deltaEvts = currNevts - this.lastEvents,
						deltaTime = currTime - this.lastEventsTime,
						rate = deltaEvts * 1000 / deltaTime,
						avgRate = 0;

					// Average with ring buffer
					this.rateRing.push(rate);
					if (this.rateRing.length > 10) this.rateRing.shift();
					for (var i=0; i<this.rateRing.length; i++) 
						avgRate += this.rateRing[i];
					avgRate /= this.rateRing.length;

					// Update average event rate
					this.select(".p-events .panel-value").text( Math.round(avgRate) + " /s" );
				}
				this.lastEventsTime = currTime;
				this.lastEvents = currNevts;

			}).bind(this));


			//
			// Listen for telemetry data and update worlders
			//
			labSocket.on('log', (function(logLine, telemetryData) {
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

					// Add a pin to the globe
					this.pinIndex[ telemetryData['agent_added'] ] = this.globe.addPin( lat, lng );

					// Update the number of machines
					this.numConnectedMachines++;
					this.select(".p-machines .panel-value").text(this.numConnectedMachines);
					this.globe.setPaused(false);

				} else if (telemetryData['agent_removed']) {

					// Remove a pin from the globe
					var pin = this.pinIndex[ telemetryData['agent_removed'] ];
					this.globe.removePin(pin);
					delete this.pinIndex[ telemetryData['agent_removed'] ];

					// Update the number of machines
					this.numConnectedMachines--;
					this.select(".p-machines .panel-value").text(this.numConnectedMachines);

					// If for any reason we ran out of agents, stop the globe
					if (this.numConnectedMachines <= 0) {
						this.globe.setPaused(true);
					}

				}
			}).bind(this));

			//
			// Reset interface when current job is deselected
			//
			labSocket.on('jobDeselected', (function() {
				this.resetInterface();
			}).bind(this));

			//
			// Handle job listings
			//
			labSocket.on('jobAdded', (function(job) {
				// The first job is activated
				if (!this.activeJob) {
					this.bindToJob( job['id'] );
				}
			}).bind(this));
			labSocket.on('jobRemoved', (function(job) {
				// If that was our job, reset
				if (this.activeJob == job['id']) {
					this.resetInterface();
					this.activeJob = null;
				}
			}).bind(this));

			//
			// When job is completed, reset interface
			//
			labSocket.on('runCompleted', (function() {
				this.resetInterface();
			}).bind(this));

			//
			// Apply job details when they arrive
			//
			labSocket.on('jobDetails', (function(job, agents) {
				// Apply job details
				this.applyJobDetails(job, agents);
			}).bind(this));

		}

		////////////////////////////////////////////////////////////////////////
		// EVENT HANDLERS
		////////////////////////////////////////////////////////////////////////

		/**
		 * Define the job to submit
		 *
		 * This request will be satisfied upon showing the screen by the
		 * onWillShow event.
		 *
		 */
		SimulationScreen.prototype.onSubmitRequest = function( tunables, observables ) {
			this.submitTunables = tunables;
			this.submitObservables = observables;
		}

		/**
		 * Resize on resize
		 */
		SimulationScreen.prototype.onResize = function( width, height ) {
			this.width = width;
			this.height = height;

			// Reisze target screen
			this.resizeTargetScreen();

			// Get the size of the globe
			setTimeout((function() {
				var diameter = this.select(".observable-center").width();
				this.globe.onResize( diameter, diameter );
			}).bind(this), 10);

		}

		/**
		 * Abort simulatio on unload
		 */
		SimulationScreen.prototype.onWillHide = function(cb) {

			// Disconnect from LabAPI
			if (this.labapi) {
				this.resetInterface();
				this.labapi.deselectJob();
			}

			// Pause globe
			this.globe.setPaused(true);

			// Fire callback
			cb();

		}

		/**
		 * Initialize lab on load
		 */
		SimulationScreen.prototype.onWillShow = function(cb) {

			// Reset interface
			this.resetInterface();

			// Open a LabSocket interface
			this.labapi = APISocket.openLabsocket();
			this.bindToLabsocket( this.labapi );

			// Check if we should start a job
			if (this.submitTunables) {

				// Validate jobs
				this.labapi.verifyJob( this.submitTunables, this.submitObservables, (function(status) {

					// If we are good, submit it now!
					if (status == "ok") {

						// Submit job
						this.labapi.submitJob( this.submitTunables, this.submitObservables );

						// Check if user has not seen the intro tutorial, show it now
						if (!User.isFirstTimeSeen("simulation.intro")) {
							// Display the intro help screen
							this.trigger("help", "03-simulation.png");
							this.trigger("help", "04-histogram.png");
							// Mark introduction sequence as shown
							User.markFirstTimeAsSeen("simulation.intro");
						}

					} else if (status == "conflict") {

						// Do not allow to submit another job
						UI.scheduleFlash(
							"Multiple submission", 
							"You can only submit one job. Please wait until it's finished or abort the previous one!",
							"flash-icons/alert.png"
						);

						// Request listing to connect to previous job
						this.labapi.enumJobs();

					}

					// Reset
					this.submitTunables = null;
					this.submitObservables = null;

				}).bind(this));

			} else {

				// Otherwise request listing to connect to previous jobs
				this.labapi.enumJobs();

			}

			// Fire callback
			cb();

		}


		// Register jobs screen
		R.registerComponent( "screen.simulation", SimulationScreen, 1 );


	}

);
