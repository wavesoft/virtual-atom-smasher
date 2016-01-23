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

			// Bind on simulation events
			Simulation.on('update.status', (function(message) {

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

			}).bind(this));
			Simulation.on('update.fitAverage', (function(fit) {

				// Update leds according to progress

			}).bind(this));
			Simulation.on('update.agents', (function(agents) {

				// Update agents

			}).bind(this));

			//
			// Reset when job is undefined
			//
			Simulation.on('job.undefined', (function() {
				this.resetInterface();
				this.trigger("close");
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
			this.select(".led-1").removeClass(".bit-leds-r .bit-leds-g .bit-leds-y");
			this.select(".led-2").removeClass(".bit-leds-r .bit-leds-g .bit-leds-y");
			this.select(".led-3").removeClass(".bit-leds-r .bit-leds-g .bit-leds-y");
			this.select(".quicksim-status").text("");
			this.select(".quicksim-text").text("");
		}

		////////////////////////////////////////////////
		// Interface Implementation
		////////////////////////////////////////////////

		/**
		 * A request was placed to start a simulation
		 */
		DefaultQuicksimOverlay.prototype.onSubmitRequest = function( values, level ) {

			// Prepare pending request
			this.select(".quicksim-status").text("Starting simulation ...");
			this.select(".quicksim-text").text("We sent a simulation request, please wait");
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
