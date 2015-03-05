define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/base/view", "text!vas/basic/tpl/machine/describe.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var DescribeMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);

			// Load template
			this.loadTemplate( tplContent );

		};

		// Subclass from ObservableWidget
		DescribeMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		DescribeMachinePart.prototype.onMachinePartDefined = function( part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );

		}

		/**
		 * Render view before show
		 */
		DescribeMachinePart.prototype.onWillShow = function( cb ) {
			// Render view
			this.renderView();
			// Callback
			cb();
		}

		/**
		 * User focused on tunable
		 */
		DescribeMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		DescribeMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		DescribeMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.describe', DescribeMachinePart, 1 );

	}

);