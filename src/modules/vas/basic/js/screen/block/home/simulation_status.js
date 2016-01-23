define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/components/home",
	 "text!vas/basic/tpl/screen/block/home/simulation_status.html" ], 

	/**
	 * This is a pop-up tuning panel in the home screen.
	 *
 	 * @exports vas-basic/screen/block/home/simulation_status
	 */
	function($, R, UI, HC, tpl) {

		/**
		 * A pop-up tuning panel.
		 *
		 * @class
		 * @registry screen.block.simulation_status
		 */
		var DefaultSimulationStatus = function(hostDOM) {
			HC.SimulationStatus.call(this, hostDOM);
			hostDOM.addClass("simulation-status");

			// Render template
            this.loadTemplate(tpl);
            this.renderView();

            // If clicked on the machine, go to simulaton display
            this.select(".machine-background").click((function(e) {
            	e.preventDefault();
            	e.stopPropagation();
            	this.trigger("displaySimulation");
            }).bind(this));

		};

		// Subclass from SimulationStatus
		DefaultSimulationStatus.prototype = Object.create( HC.SimulationStatus.prototype );

		/**
		 * Bind to simulation object
		 */
		DefaultSimulationStatus.prototype.onBindToSimulation = function( simulation ) {

			// Helper to map Chi value 0.0 till 9.0+ like this:
			// 
			// 0.0 - 1.0 = 0% - 25%      log(fit) = 0.0 - 1.0
			// 1.0 - 4.0 = 25% - 50%     log(fit) = 1.0 - 2.0
			// 4.0 - 9.0 = 50% - 75%     log(fit) = 2.0 - 3.0
			// 9.0 - 16.0 = 75% - 100%   log(fit) = 3.0 - 4.0
			//
			var mapNeedleRotation = function( fit ) {
				var percent = Math.max( Math.min( Math.sqrt( Math.max(fit, 0) ) * 25, 100 ), 0 );
				return 1.8 * percent; // Return degrees (0-180)
			};

			//
			// A simulation has started
			//
			simulation.on('job.defined', (function(job) {

				this.hostDOM.addClass("visible");

			}).bind(this));

			//
			// A simulation has stopped
			//
			simulation.on('job.undefined', (function(job) {

				this.hostDOM.removeClass("visible");

			}).bind(this));

			//
			// Changes on simulation properties
			//
			simulation.on('update.progress', (function(progress) {

				// Update machine progress
				this.select(".machine-progress .bar")
					.css({
						'width': progress + ' %'
					});

			}).bind(this));
			simulation.on('update.status', (function(message) {

				// Status text mapping
				var map = {

					'idle'      : 'Not running',
					'queued'    : 'Waiting for a slot',
					'starting'  : 'Starting',
					'running'   : 'Running',
					'completed' : 'Completed',

					'stalled'   : 'Stalled!',
					'failed'    : 'Failed!',
					'cancelled' : 'Cancelled!'

				};
				var msg = map[message] || message;

				// Update status message
				this.select(".machine-label")
					.text( msg );

			}).bind(this));
			simulation.on('update.fitAverage', (function(fitScore) {

				// Get needle rotation
				var rot = mapNeedleRotation( fitScore ),
					transform = "rotate("+( 90 - rot )+"deg)";

				// Apply rotation to the needle
				this.select(".machine-needle")
					.css({
						'-webkit-transform': transform,
						'-moz-transform': transform,
						'-ms-transform': transform,
						'-o-transform': transform,
						'transform': transform,
					});

			}).bind(this));

		}


		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.simulation_status', DefaultSimulationStatus, 1 );

	}

);