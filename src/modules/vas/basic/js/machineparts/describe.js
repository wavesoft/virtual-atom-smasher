define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/base/view"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, ViewComponent) {

		/**
		 * The default tunable body class
		 */
		var DescribeMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);

		};

		// Subclass from ObservableWidget
		DescribeMachinePart.prototype = Object.create( ViewComponent.prototype );

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.describe', DescribeMachinePart, 1 );

	}

);