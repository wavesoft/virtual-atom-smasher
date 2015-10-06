define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning" ], 

	/**
	 * This is the overlay tuning screen
	 *
 	 * @exports vas-basic/screen/block/home/tuning_screen
	 */
	function($, R, UI, TC) {

		/**
		 * @class
		 * @registry screen.block.tuning_screen
		 * @augments module:vas-core/base/components/tuning~TuningScreen
		 */
		var DefaultTuningScreen = function(hostDOM) {
			// Initialize widget
			TC.TuningScreen.call(this, hostDOM);

		}

		// Subclass from TuningScreen
		DefaultTuningScreen.prototype = Object.create( TC.TuningScreen.prototype );

		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_screen', DefaultTuningScreen, 1 );

	}

);