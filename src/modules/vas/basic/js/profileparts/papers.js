define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry", "vas/core/ui", "vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/papers.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/papers
	 */
	function(config, require, R, UI, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfilePapers = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-papers");
			this.loadTemplate(tplBooks);

			// Handle DO urls
			this.handleDoURL('viewPapers', (function() {

				// Show histograms overlay
				UI.showOverlay("overlay.publicpapers", (function(com) {
				}).bind(this));

			}).bind(this));

			// Render view
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfilePapers.prototype = Object.create( View.prototype );

		/**
		 * Update papers before view
		 */
		ProfilePapers.prototype.onWillShow = function(cb) {

			// Get user papers
			User.getProfilePapers((function(user, team) {
				this.setViewData('user_papers', user);
				this.setViewData('team_papers', team);

				// Show
				this.renderView();
				cb();

			}).bind(this));

		};


		// Store overlay component on registry
		R.registerComponent( 'profilepart.papers', ProfilePapers, 1 );

	}

);