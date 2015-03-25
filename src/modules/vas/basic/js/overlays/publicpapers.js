define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/view", "vas/core/user",
	 "text!vas/basic/tpl/overlay/publicpapers.html"
	],

	/**
	 * This is the default component for displaying the job status
	 *
 	 * @exports vas-basic/overlay/publicpapers
	 */
	function($, R, UI, View, User, tplPublicpapers) {

		/**
		 * The default tunable body class
		 */
		var PublicPapers = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);
			hostDOM.addClass("publicpapers-overlay");
			hostDOM.addClass("overlay-rounded-frame");

			this.paper = null;
			this.focusedPaper = null;

			// Handle DO URLs
			this.handleDoURL('searchPapers', (function() {

				// Define terms and reload
				this.setViewData( 'terms', this.forms.search.terms );
				this.displayList();

			}).bind(this));
			this.handleDoURL('viewPaper', (function(id) {

				// Get paper details
				this.displayPaper( paper );

			}).bind(this));
			this.handleDoURL('closePaper', (function() {

				// Display list
				this.displayList();

			}).bind(this));
			this.handleDoURL('citePaper', (function(id) {

				// Cite paper
				User.citePaper(id, (function(ok) {

					// Refresh parameter so we can see details
					if (ok) 
						this.displayPaper()

				}).bind(this));

			}).bind(this));


			this.loadTemplate(tplPublicpapers);

		};

		// Subclass from View
		PublicPapers.prototype = Object.create( View.prototype );

		/**
		 * Undefine paper and show papers screen
		 */
		PublicPapers.prototype.displayList = function( cb ) {
			// Undefine paper
			this.paper = null;
			this.setViewData('paper', false);
			this.reloadPapers({
				'public' : true, // Get public papers only
				'cost'   : true, // Estimate cost of each paper
				'terms': '%'+this.getViewData("terms")+'%'
			}, cb, 'fade');

			// Trigger user event
			var paperTimer = Analytics.stopTimer("paper-time");
			User.triggerEvent("paper.hide", {
				'paper': this.focusedPaper,
				'time': paperTimer
			});
			
			// Unset focus
			this.focusedPaper = null;
		}

		/**
		 * Define a paper and show it's screen
		 */
		PublicPapers.prototype.displayPaper = function( paper ) {

			// Get active paper if paper parameter is missing
			if (!paper) {
				paper = this.paper;
			} else {
				this.paper = paper;
			}

			// Read paper
			User.readPaper(paper, (function(paper) {

				// Define paper
				this.setViewData('paper', paper);
				this.renderView('fade');

				// Set focus
				this.focusedPaper = paper['id'];

				// Trigger user event
				Analytics.restartTimer("paper-time");
				User.triggerEvent("paper.show", {
					'paper': paper['id']
				});

			}).bind(this));

		}

		/**
		 * Render view before show
		 */
		PublicPapers.prototype.reloadPapers = function( query, cb, transition ) {

			// Request papers
			User.getPapers(query, (function(papers) {

				// Update papers and render view
				this.setViewData('papers', papers);
				this.renderView(transition);

				// Fire callbacks
				if (cb) cb();

			}).bind(this));

		}

		/**
		 * Render before show
		 */
		PublicPapers.prototype.onWillShow = function(cb) {
			this.displayList(cb);
		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.publicpapers', PublicPapers, 1 );

	}

);