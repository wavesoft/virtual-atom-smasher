define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry","vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/achievements.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/achievements
	 */
	function(config, require, R, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfileAchievements = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-achievements");
			this.loadTemplate(tplBooks);

			// Render view
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileAchievements.prototype = Object.create( View.prototype );


		// Store overlay component on registry
		R.registerComponent( 'profilepart.achievements', ProfileAchievements, 1 );

	}

);