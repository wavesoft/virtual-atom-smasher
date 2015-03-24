define(

	// Dependencies

	["jquery", "quill", "vas/core/registry", "vas/core/db", "vas/core/user", "vas/core/base/view", 
	 "text!vas/basic/tpl/machine/results.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/results
	 */
	function(config, Quill, R, DB, User, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var ResultsMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-results")

			// Load template
			this.loadTemplate( tplContent );

			// Handle DO URLs
			this.handleDoURL('viewHistograms', (function() {

			}).bind(this));

		};

		// Subclass from ObservableWidget
		ResultsMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		ResultsMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );

		}

		/**
		 * Render view before show
		 */
		ResultsMachinePart.prototype.onWillShow = function( cb ) {

			// Load user paper
			User.getUserPaper((function(paper) {

				// Set view data
				this.setViewData('paper', paper);
				this.renderView();
				cb();

			}).bind(this));

		}

		/**
		 * User focused on tunable
		 */
		ResultsMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		ResultsMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		ResultsMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};
		
		/**
		 * A tuning parameter value has changed
		 */
		ResultsMachinePart.prototype.onTuningValueChanged = function( parameter, value ) {	

		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.results', ResultsMachinePart, 1 );

	}

);