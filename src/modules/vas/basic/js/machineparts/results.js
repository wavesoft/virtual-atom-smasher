define(

	// Dependencies

	["jquery", "quill", "mathjax", "vas/core/registry", "vas/core/ui", "vas/core/db", "vas/core/user", "vas/core/apisocket", "vas/core/base/view", 
	 "text!vas/basic/tpl/machine/results.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/results
	 */
	function(config, Quill, MathJax, R, UI, DB, User, APISocket, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var ResultsMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-results");

			// Load template
			this.loadTemplate( tplContent );

			// Handle DO URLs
			this.handleDoURL('viewHistograms', (function(job_id) {
				this.showResults( job_id );
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

				// Typeset math
				MathJax.typeset( this.hostDOM );

				// We are ready
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

		/**
		 * Display firs-time aids when possible
		 */
		ResultsMachinePart.prototype.onShowFirstTimeAids = function() {	
			UI.showAllFirstTimeAids("machinepart.tabcontent.results");
		}

		/**
		 * Show the results of the specified job
		 */
		ResultsMachinePart.prototype.showResults = function(job_id) {
			// Open/Resume labSocket
			var lab = APISocket.openLabsocket();
			lab.on('histogramsUpdated', (function(histos) {

				// Show histograms overlay
				UI.showOverlay("overlay.histograms", (function(com) {
				}).bind(this)).onHistogramsDefined( histos );

			}).bind(this));

			// Request results
			lab.getJobResults( job_id );
		}


		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.results', ResultsMachinePart, 1 );

	}

);