define(

	// Dependencies

	["jquery", "quill", "vas/core/registry", "vas/core/db", "vas/core/user", "vas/core/base/view", "text!vas/basic/tpl/machine/papers.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, Quill, R, DB, User, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var PaperMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-papers")

			// Load template
			this.loadTemplate( tplContent );

			// Handle DO URLs
			this.handleDoURL('searchPapers', (function() {

				// Define terms
				this.setViewData( 'terms', this.forms.search.terms );

				// Request paper reload
				this.reloadPapers({
					'terms': '%'+this.forms.search.terms+'%'
				});

			}).bind(this));
			this.handleDoURL('viewPaper', (function(id) {

				// Get paper details
				User.getPaper(id, (function(paper) {

					// Define paper
					this.setViewData('paper', paper);
					this.renderView('fade');

				}).bind(this));

			}).bind(this));
			this.handleDoURL('closePaper', (function() {

				// Undefine paper
				this.setViewData('paper', false);
				this.renderView('fade');

			}).bind(this));

			// Start Quill on possible editable text areas
			this.select('.quill', function(dom) {
				var quill = new Quill(dom.get(0),{
					theme: 'snow'
				});
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
			this.setViewData( 'terms', "" );

		}

		/**
		 * Render view before show
		 */
		PaperMachinePart.prototype.reloadPapers = function( query, cb ) {

			// Request papers
			User.getPapers(query, (function(papers) {

				// Update papers and render view
				this.setViewData('papers', papers);
				this.renderView();

				// Fire callbacks
				if (cb) cb();

			}).bind(this));

		}

		/**
		 * Render view before show
		 */
		PaperMachinePart.prototype.onWillShow = function( cb ) {

			// Reload papers (and re-render view)
			// When done, fire callback
			this.reloadPapers({}, cb);

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