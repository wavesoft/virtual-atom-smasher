define(

	// Dependencies

	["jquery", "quill", "vas/core/registry", "vas/core/db", "vas/core/user", "vas/core/base/view", "text!vas/basic/tpl/machine/papers.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/mypaper
	 */
	function(config, Quill, R, DB, User, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var MyPaperMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-papers")

			// Load template
			this.loadTemplate( tplContent );
			this.setViewData( 'showPapers', false );
			this.quill = null;

			// Handle DO URLs
			this.handleDoURL('savePaper', (function() {

				// Update user paper
				User.updateUserPaper({
					'title': this.forms.paper.title,
					'body': this.quill.getHTML(),
				});

			}).bind(this));

			// Start Quill on possible editable text areas
			this.select('.quill', (function(dom) {
				this.quill = new Quill(dom.get(0),{
					theme: 'snow'
				});
			}).bind(this));

		};

		// Subclass from ObservableWidget
		MyPaperMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		MyPaperMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );

		}

		/**
		 * Render view before show
		 */
		MyPaperMachinePart.prototype.onWillShow = function( cb ) {

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
		MyPaperMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		MyPaperMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		MyPaperMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.mypaper', MyPaperMachinePart, 1 );

	}

);