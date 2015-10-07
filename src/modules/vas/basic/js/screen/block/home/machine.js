define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/components/home"  ], 

	/**
	 * This is a pop-up tuning panel in the home screen.
	 *
 	 * @exports vas-basic/screen/block/home/tuning_panel
	 */
	function($, R, UI, HC) {

		/**
		 * A pop-up tuning panel.
		 *
		 * @class
		 * @registry screen.block.tuning_panel
		 */
		var DefaultTuningMachine = function(hostDOM) {
			HC.HomeMachine.call(this, hostDOM);
			hostDOM.addClass("machine-host");
		};

		// Subclass from HomeMachine
		DefaultTuningMachine.prototype = Object.create( HC.HomeMachine.prototype );


		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.machine', DefaultTuningMachine, 1 );

	}

);