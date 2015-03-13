define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry","vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/papers.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/papers
	 */
	function(config, require, R, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfilePapers = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-papers");
			this.loadTemplate(tplBooks);

			// Render view
			this.setViewData('img', require.toUrl('vas/basic/img'));
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfilePapers.prototype = Object.create( View.prototype );


		// Store overlay component on registry
		R.registerComponent( 'profilepart.papers', ProfilePapers, 1 );

	}

);