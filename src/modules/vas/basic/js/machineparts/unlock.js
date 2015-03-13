define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/user", "vas/core/base/view", "core/analytics/analytics",
	 "text!vas/basic/tpl/machine/unlock.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/paper
	 */
	function(config, R, User, ViewComponent, Analytics, tplContent) {

		/**
		 * The default tunable body class
		 */
		var UnlockMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-papers");

			// Load template
			this.loadTemplate( tplContent );


		};

		// Subclass from ObservableWidget
		UnlockMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		UnlockMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );
			this.setViewData( 'terms', "" );

		}

		/**
		 * Render view before show
		 */
		UnlockMachinePart.prototype.onWillShow = function( cb ) {
			this.renderView();
			cb();
		}

		/**
		 * User focused on tunable
		 */
		UnlockMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		UnlockMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		UnlockMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.unlock', UnlockMachinePart, 1 );

	}

);