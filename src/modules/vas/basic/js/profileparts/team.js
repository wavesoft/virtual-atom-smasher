define(

	// Dependencies

	[ "jquery", "vas/config", "require", "vas/core/registry","vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/team.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/team
	 */
	function($, Config, require, R, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfileTeam = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-team");
			this.loadTemplate(tplBooks);

			// Render view
			this.setViewData( 'vasapi', Config.forum_vas_api + '?auth=' + User.profile['token'] );
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileTeam.prototype = Object.create( View.prototype );


		// Store overlay component on registry
		R.registerComponent( 'profilepart.team', ProfileTeam, 1 );

	}

);