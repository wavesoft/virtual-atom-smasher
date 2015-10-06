define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning"  ], 

	/**
	 * This is a pop-up tuning panel in the home screen.
	 *
 	 * @exports vas-basic/screen/block/home/tuning_panel
	 */
	function($, R, UI, TC) {

		/**
		 * A pop-up tuning panel.
		 *
		 * @class
		 * @registry screen.block.tuning_panel
		 */
		var DefaultTuningMachine = function(hostDOM) {

		};

		// Subclass from TuningPanel
		DefaultTuningMachine.prototype = Object.create( TC.TuningPanel.prototype );


		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_machine', DefaultTuningMachine, 1 );

	}

);