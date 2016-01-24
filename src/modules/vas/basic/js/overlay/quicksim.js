define(

	// Dependencies
	[
		"jquery", 
		"vas/core/simulation",
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/quicksim.html"
	],

	/**
	 * Basic version of the quicksim overlay
	 *
	 * This overlay is presented to the user when he/she tries some values.
	 * It starts the simulation and waits until the data make some sense
	 * before allowing the user to continue.
	 *
	 * @exports vas-basic/overlay/quicksim
	 */
	function ($, Simulation, C, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic quicksim screen overlay
		 * @augments module:vas-core/base/components/overlays~QuicksimOverlay
		 * @template vas/basic/tpl/overlay/quicksim.html
		 * @registry overlay.quicksim
		 */
		var DefaultQuicksimOverlay = function (hostDOM) {
			C.QuicksimOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("quicksim-overlay");
			this.loadTemplate(tpl);
			this.renderView();

			// Local properties
			this.checkState = 0;
			this.pendingRequest = null;
			this.fit = 0;
			this.nevts = 0;
			this.haltInterface = false;

			// Bind on simulation events
			Simulation.on('update.status', (function(message) {

				// If halted, return
				if (this.haltInterface) return;

				// Status text mapping
				var map = {

					'idle'      : 'The simulation has stopped',
					'queued'    : 'We are queued, waiting for a free slot',
					'starting'  : 'The simulation is starting',
					'running'   : 'The simulation is running',
					'completed' : 'The simulation has completed',

					'stalled'   : 'The simulation is stalled',
					'failed'    : 'The simulation has failed',
					'cancelled' : 'The simulation is cancelled'

				};
				this.select(".quicksim-status").text( map[message] || message );

				// Show some pretty messages
				if (message == 'starting') {
					this.select(".quicksim-text").text("In a few moments we will check your values");
				} else if (message == 'running') {
					this.select(".quicksim-text").text("Evaluating your values");
				}

				// 'Exists' is a special case
				if (message == 'exists') {

					this.select(".quicksim-text").text("We don't have to run the simulation");
					this.select(".quicksim-status").text("Somebody else has already tried this values!");
					this.haltInterface = true;

					// Close interface
					setTimeout((function() {
						this.trigger("close");
					}).bind(this), 2000);
				}

			}).bind(this));
			Simulation.on('update.fitAverage', (function(fit) {

				// If halted, return
				if (this.haltInterface) return;

				// Update leds according to progress
				this.fit = fit;
				this.updateEstimation();

			}).bind(this));
			Simulation.on('update.events', (function(nevts) {

				// If halted, return
				if (this.haltInterface) return;

				// Update number of events
				this.nevts = nevts;
				this.updateEstimation();

			}).bind(this));
			Simulation.on('log', (function(message, telemetry) {

				// If halted, return
				if (this.haltInterface) return;
				this.select(".quicksim-status").text(message);

			}).bind(this));

			//
			// Bind interface events
			//
			this.select(".btn-cancel").click((function() {
				Simulation.abort();
				this.trigger("close");
			}).bind(this));
			this.select(".btn-continue").click((function() {
				this.trigger("showDetails");
				this.trigger("close");
			}).bind(this));

		}

		DefaultQuicksimOverlay.prototype = Object.create(C.QuicksimOverlay.prototype);

		////////////////////////////////////////////////
		// Helper Functions
		////////////////////////////////////////////////

		/**
		 * Reset interface to default
		 */
		DefaultQuicksimOverlay.prototype.resetInterface = function() {
			this.select(".led-1").removeClass("bit-leds-r bit-leds-g bit-leds-y");
			this.select(".led-2").removeClass("bit-leds-r bit-leds-g bit-leds-y");
			this.select(".led-3").removeClass("bit-leds-r bit-leds-g bit-leds-y");
			this.select(".quicksim-status").text("");
			this.select(".quicksim-text").text("");
		}

		/**
		 * Set led state
		 */
		DefaultQuicksimOverlay.prototype.setLeds = function( led, color ) {
			this.select(".led-"+led).removeClass("bit-leds-r bit-leds-g bit-leds-y");
			if (color) {
				this.select(".led-"+led).addClass("bit-leds-"+color);
			}
		}

		/**
		 * Get a choice according to fit
		 */
		DefaultQuicksimOverlay.prototype.getFitChoice = function(fit, choices) {
			if (fit < 2.0) {
				return choices[0];
			} else if (fit < 4.0) {
				return choices[1];
			} else {
				return choices[2];
			}
		}

		/**
		 * Set led state
		 */
		DefaultQuicksimOverlay.prototype.updateEstimation = function() {
			if (this.nevts == 0) {
				this.setLeds(1,'');
				this.setLeds(2,'');
				this.setLeds(3,'');
			} else if (this.nevts < 1000) {
				this.setLeds(1, this.getFitChoice(this.fit, ['g','y','r']));
				this.select(".quicksim-text").html( this.getFitChoice(this.fit,[
						"Looks good so far", 
						"Doesn't look so good, but let's wait for a wihle",
						"Looks bad, but let's wait for a while"
					]) );
			} else if (this.nevts < 3000) {
				this.setLeds(2, this.getFitChoice(this.fit, ['g','y','r']));
				this.select(".quicksim-text").html( this.getFitChoice(this.fit,[
						"It looks like you found something good", 
						"It's not the best, but it might turn out good later",
						"This does not look like a good choice"
					]) );
			} else if (this.nevts < 5000) {
				this.setLeds(3, this.getFitChoice(this.fit, ['g','y','r']));
				this.select(".quicksim-text").html( this.getFitChoice(this.fit,[
						"Your choices look good, click <em>See more</em> for details", 
						"The values might be bad, click <em>See more</em> for details",
						"This seems like a wrong choice, click <em>STOP!</em>"
					]) );
			}
		}

		////////////////////////////////////////////////
		// Interface Implementation
		////////////////////////////////////////////////

		/**
		 * A request was placed to start a simulation
		 */
		DefaultQuicksimOverlay.prototype.onSubmitRequest = function( values, level ) {

			// Unhalt interface
			this.haltInterface = false;

			// Prepare pending request
			this.select(".quicksim-status").text("Starting simulation ...");
			this.select(".quicksim-text").text("We submitted your request, please wait");
			this.pendingRequest = [ values, level ];

		}

		/**
		 * Do the submission only when shown
		 */
		DefaultQuicksimOverlay.prototype.onShown = function() {

			// Submit pending request
			if (this.pendingRequest) {
				Simulation.submit( this.pendingRequest[0], this.pendingRequest[1] );
				this.pendingRequest = null;
			}

		}

		// Register login screen
		R.registerComponent("overlay.quicksim", DefaultQuicksimOverlay, 1);

	}
);
