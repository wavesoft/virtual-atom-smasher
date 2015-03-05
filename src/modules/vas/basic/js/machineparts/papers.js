define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/db", "vas/core/user", "vas/core/base/view", "text!vas/basic/tpl/machine/papers.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, DB, User, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var PaperMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);

			// Load template
			this.loadTemplate( tplContent );

			// Handle DO URLs
			this.handleDoURL('beep', function(what) {
				alert(what);
			});

		};

		// Subclass from ObservableWidget
		PaperMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		PaperMachinePart.prototype.onMachinePartDefined = function( part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );

		}

		/**
		 * Render view before show
		 */
		PaperMachinePart.prototype.onWillShow = function( cb ) {

			// Get user's papers
			User.getPapers((function(papers) {

				// Update parameter
				this.setViewData('papers', papers);

				// Render view
				this.renderView();

				// Callback
				cb();

			}).bind(this));

		}

		/**
		 * User focused on tunable
		 */
		PaperMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		PaperMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		PaperMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.paper', PaperMachinePart, 1 );

	}

);