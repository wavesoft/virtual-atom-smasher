define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry","vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/user.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/user
	 */
	function(config, require, R, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfileUser = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-user");
			this.loadTemplate(tplBooks);

			// Render view
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileUser.prototype = Object.create( View.prototype );


		// Store overlay component on registry
		R.registerComponent( 'profilepart.user', ProfileUser, 1 );

	}

);