
define(

	// Requirements
	[ 
		"ccl-tracker",
		"vas/core/simulation", "vas/core/registry", "vas/core/base/components", 
		"vas/core/ui", "vas/core/user", "vas/media", "vas/core/apisocket",
		"text!vas/basic/tpl/screen/simulation.html"
	],

	/**
	 * Basic version of the jobs screen
	 *
	 * @exports vas-basic/screen/simulation
	 */
	function( Analytics, Simulation, R, C, UI, User, Media, APISocket, tplMain ) {

		/**
		 * @class
		 * @classdesc The basic simulation screen
         * @augments module:vas-core/base/components~SimulationScreen
         * @template vas/basic/tpl/screen/simulation.html
         * @registry screen.simulation
		 */
		var SimulationScreen = function( hostDOM ) {
			C.SimulationScreen.call(this, hostDOM);

			// Setup class and template
			hostDOM.addClass("simulation");
			this.loadTemplate( tplMain );
			this.renderView();

			// Setup properties
			this.observables = [];
			// this.rateRing = [];
			this.overlayComponent = null;
			this.lastHistograms = [];

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
				// Abort job
				Simulation.abort();
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

				// // Show job details
				// this.labapi.getJobDetails(this.activeJob, (function(details) {
				// 	// Show job details overlay
				// 	UI.showOverlay("overlay.jobstatus", (function(com) {
				// 		com.onJobDetailsUpdated( details );
				// 	}).bind(this));
				// }).bind(this));

			}).bind(this));

			//
			// Bind a handler to the 'play game' button
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

			//
			// Bind to shared simulation proxy
			//
			this.bindToSimulation();

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
			this.observables = [];
			this.lastHistograms = [];

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
			obs.com = R.instanceComponent( "screen.block.observable_point", obs.dom );
			if (!obs.com) {
				console.error("Unable to load component for visualising observable point");
				return;
			}

			// Update component metadata
			obs.com.onMetaUpdate( meta );

			// Store on observables
			this.observables.push( obs );

			// REturn record
			return obs;

		}

		/**
		 * Helper function to listen on events from the shared simulation class
		 */
		SimulationScreen.prototype.bindToSimulation = function() {
			var self = this;

			//
			// Update interface widgets
			//
			Simulation.on('update.eventRate', (function(rate) {
				this.select(".p-events .panel-value").text( Math.round(rate) + " /s" );
			}).bind(this));
			Simulation.on('update.progress', (function(value) {
				this.select(".p-progress .panel-value").text( Math.round(value)+" %");
			}).bind(this));
			Simulation.on('update.events', (function(agents) {

			}).bind(this));

			//
			// Agent information is updated
			//
			Simulation.on('update.agents', (function(agents) {

				// Remove & Replace Pins
				this.globe.removeAllPins();
				for (var i=0; i<agents.length; i++) {
					var a = agents[i];
					this.globe.addPin( a.lat, a.lng );
				}

				// Start/Stop Globe
				this.globe.setPaused( agents.length == 0 );

				// Update number of machines
				this.select(".p-machines .panel-value").text( agents.length );

			}).bind(this));

			//
			// Update status
			//
			Simulation.on('update.status', (function( status ) {

				// Update status message
				if (status == "idle") status = "---";
				this.select(".p-run-status").text( status.toUpperCase() );

			}).bind(this));

			//
			// Histogram information is updated
			//
			Simulation.on('update.histograms', (function( histos ) {

				// Make 'view' button clickable
				this.select(".p-view").removeClass("disabled");

				// Update all observables
				for (var i=0; i<histos.length; i++) {
					var h = histos[i];
					this.updateObservable( h.id, h );
				}

				// Update overlay component
				this.lastHistograms = histos;
				if (this.overlayComponent) {
					this.overlayComponent.onHistogramsDefined( histos );
				}

			}).bind(this));

			//
			// When a job is defined, update 
			//
			Simulation.on('job.defined', (function( job ) {

				// Create observables
				for (var i=0; i<job.histograms.length; i++) {
					var h = job.histograms[i];

					// Fire respective observable
					var obs = this.createObservable( h.id, h.meta );
					obs.com.onUpdate( h );

				}

				// Rearrange them
				this.rearrangeObservables();

				// Enable abort
				this.select(".p-abort").removeClass("disabled");

			}).bind(this));

			//
			// When a job is undefined, reset interface 
			//
			Simulation.on('job.undefined', (function() {
				this.resetInterface();
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
		SimulationScreen.prototype.onSubmitRequest = function( tunables, observables, level ) {
			this.submitTunables = tunables;
			this.submitObservables = observables;
			this.submitLevel = level;
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
			// this.resetInterface();

			// If there is an active simulation, request interface updates
			if (Simulation.activeJob) {
				Simulation.activeJob.triggerUpdates();
			}

			// // Open a LabSocket interface
			// this.labapi = APISocket.openLabsocket();
			// this.bindToLabsocket( this.labapi );

			// // Check if we should start a job
			// if (this.submitTunables) {

			// 	// Validate jobs
			// 	this.labapi.verifyJob( this.submitTunables, this.submitObservables, (function(status) {

			// 		// If we are good, submit it now!
			// 		if (status == "ok") {

			// 			// Submit job
			// 			this.labapi.submitJob( this.submitTunables, this.submitObservables, this.submitLevel );

			// 			// Check if user has not seen the intro tutorial, show it now
			// 			if (!User.isFirstTimeSeen("simulation.intro")) {
			// 				// Display the intro help screen
			// 				this.trigger("help", "03-simulation");
			// 				this.trigger("help", "04-histogram");
			// 				// Mark introduction sequence as shown
			// 				User.markFirstTimeAsSeen("simulation.intro");
			// 			}

			// 		} else if (status == "conflict") {

			// 			// Do not allow to submit another job
			// 			UI.scheduleFlash(
			// 				"Multiple submission", 
			// 				"You can only submit one job. Please wait until it's finished or abort the previous one!",
			// 				"flash-icons/alert.png"
			// 			);

			// 			// Request listing to connect to previous job
			// 			this.labapi.enumJobs();

			// 		}

			// 		// Reset
			// 		this.submitTunables = null;
			// 		this.submitObservables = null;
			// 		this.submitLevel = null;

			// 	}).bind(this));

			// } else {

			// 	// Otherwise request listing to connect to previous jobs
			// 	this.labapi.enumJobs();

			// }

			// Fire callback
			cb();

		}


		// Register jobs screen
		R.registerComponent( "screen.simulation", SimulationScreen, 1 );


	}

);
