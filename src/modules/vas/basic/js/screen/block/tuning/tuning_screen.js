define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/tuning_components" ], 

	/**
	 * This is the overlay tuning screen .
 	 * @exports vas-basic/screen/block/tuning/tuning_screen
	 */
	function($, R, UI, TC) {

		/**
		 * @class
		 * @registry screen.block.tuning_screen
		 */
		var DefaultTuningScreen = function(hostDOM) {

			// Initialize widget
			TC.TuningPanel.call(this, hostDOM);
		}

		// Subclass from TuningPanel
		DefaultTuningScreen.prototype = Object.create( TC.TuningPanel.prototype );


		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_screen', DefaultTuningScreen, 1 );

	}

);