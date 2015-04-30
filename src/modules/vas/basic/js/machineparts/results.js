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

			// Reset properties
			this.selectedJobID = null;
			this.paper = null;

			// Load template
			this.loadTemplate( tplContent );

			// Handle DO URLs
			this.handleDoURL('viewHistograms', (function(job_id) {
				this.showResults( this.selectedJobID );
			}).bind(this));
			this.handleDoURL('focusOnJob', (function(job_id) {
				this.focusOnJob( job_id );
			}).bind(this));
			this.handleDoURL('changeValue', (function(parameter, value) {
				this.trigger('changeValue', parameter, value);
			}).bind(this));
			this.handleDoURL('selectFocused', (function(parameter, value) {

				// Select this results as paper defaults
				User.makePaperJobDefault( this.paper.id, this.selectedJobID, (function(ok) {
					if (ok) {
						// Update list
						this.setViewData('canSelect', false);
						this.update();
					}
				}).bind(this) );

			}).bind(this));

		};

		// Subclass from ObservableWidget
		ResultsMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Helper function to update the results overview
		 */
		ResultsMachinePart.prototype.focusOnJob = function( job_id ) {

			// Keep selected job id
			this.selectedJobID = job_id;

			// Tag focused and unfocused jobs
			var paper = this.getViewData('paper'),
				focusID = this.getViewData('focus');
			if (paper) {
				for (var i=0; i<paper['jobs'].length; i++) {
					paper['jobs'][i].focused = (paper['jobs'][i].id == job_id);
				}
				this.setViewData('paper', paper);
				this.setViewData('focus', job_id);
			}

			// Check if we can select this
			this.setViewData('canSelect', (job_id != this.paper.job_id));

			// Get results for the user's active paper
			User.getJobResults(job_id, (function(details) {

				// Delete unknown tunables
				var tunList = [];
				for (var i=0; i<details.tunables.length; i++) {
					var tun = details.tunables[i];

					// Look for that tunable in local list
					for (var j=0; j<this.tunables.length; j++) {
						// Found, collect it
						if (this.tunables[j].name == tun.name) {
							tunList.push(tun);
							continue;
						}
					}

				}

				// Replace tunables
				details.tunables = tunList;

				// Update and render
				this.setViewData('details', details);
				this.renderView();

				// Typeset math
				MathJax.typeset( this.hostDOM );

			}).bind(this));

		}

		/**
		 * Helper function to update the results overview
		 */
		ResultsMachinePart.prototype.update = function( cb ) {

			// Get results for the user's active paper
			User.getPaperResults(0, (function(paper) {

				// Update paper
				this.paper = paper;

				// If focus is null, focus on the first paper
				if (!this.getViewData('focus')) {
					if (paper['jobs'].length > 0) {

						// Focus on the first paper
						var focusID = paper['jobs'][0].id;
						this.setViewData('focus', focusID);

						// Request details for the specified paper
						this.focusOnJob( focusID );

					}
				}

				// Tag focused and unfocused jobs
				var focusID = this.getViewData('focus', paper.job_id);
				for (var i=0; i<paper['jobs'].length; i++) {
					var job = paper['jobs'][i];

					// Update focused
					job.focused = (job.id == focusID);

					// Update status flags
					job.pending = (job.status == 0);
					job.running = (job.status == 1);
					job.completed = (job.status == 2);
					job.failed = (job.status == 3);
					job.cancelled = (job.status == 4);
					job.stalled = (job.status == 5);
					job.selected = (job.id == paper.job_id);

					// Update status text
					if (job.status == 0) {
						job.status_text = "Pending";
					} else if (job.status == 1) {
						job.status_text = "Pending";
					} else if (job.status == 2) {
						job.status_text = job.fit;
					} else if (job.status == 3) {
						job.status_text = "Failed";
					} else if (job.status == 4) {
						job.status_text = "Cancelled";
					} else if (job.status == 5) {
						job.status_text = "Stalled";
					}

				}

				// Update view
				this.setViewData('paper', paper);
				this.renderView();

				// Typeset math
				MathJax.typeset( this.hostDOM );

				// Fire callback if specified
				if (cb) cb();

			}).bind(this));

		}

		/**
		 * Render view before show
		 */
		ResultsMachinePart.prototype.onWillShow = function( cb ) {

			// Focus at the very first paper
			this.setViewData('focus', null);
			this.setViewData('details', null);

			// When we are about to be loaded, update overview
			this.update( cb );

		}

		/**
		 * Update machine details
		 */
		ResultsMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );

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
			this.tunables = tunables;
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
			lab.on('error', (function(message, critical) {
				UI.logError( message, critical );
			}).bind(this));
			lab.on('histogramsUpdated', (function(histos) {

				// Show histograms overlay
				UI.showOverlay("overlay.histograms", (function(com) {
					com.onHistogramsDefined( histos );
				}).bind(this));

			}).bind(this));

			// Request results
			lab.getJobResults( job_id );
		}


		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.results', ResultsMachinePart, 1 );

	}

);