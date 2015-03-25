define(

	// Dependencies

	[ "jquery", "require", "vas/config", "vas/core/registry","vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/user.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/user
	 */
	function($, require, Config, R, View, User, tplBooks) {

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
			this.setViewData( 'avatars', require.toUrl('vas/basic/img/avatars')+'/' );
			this.setViewData( 'vasapi', Config.forum_vas_api + '?auth=' + User.profile['token'] );
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileUser.prototype = Object.create( View.prototype );

		/**
		 * Upon showing user profile
		 */
		ProfileUser.prototype.onWillShow = function(cb) {

			User.getUserMessages((function(messages) {

				// Update user messages
				this.setViewData('profile', User.profile);
				this.setViewData('messages', messages);
				this.renderView();

				// Fire callback
				cb();

			}).bind(this));

		}

		// Store overlay component on registry
		R.registerComponent( 'profilepart.user', ProfileUser, 1 );

	}

);