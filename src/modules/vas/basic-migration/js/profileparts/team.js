define(

	// Dependencies

	[ "jquery", "vas/config", "require", "vas/core/registry", "vas/core/ui", "vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/team.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/team
	 */
	function($, Config, require, R, UI, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfileTeam = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-team");
			this.loadTemplate(tplBooks);

			// Handle change team
			this.handleDoURL('changeTeam', (function() {

				// Show histograms overlay
				UI.showOverlay("overlay.switchteam", (function(com) {
					com.onOnce('close', (function() {
						this.updateTeam();
					}).bind(this));
				}).bind(this));

			}).bind(this));

			// Render view
			this.setViewData( 'vasapi', Config.forum_vas_api + '?auth=' + User.profile['token'] );
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileTeam.prototype = Object.create( View.prototype );

		/**
		 * Refresh team upon showing
		 */
		ProfileTeam.prototype.updateTeam = function(cb) {
			User.getUserTeamDetails((function(team) {

				// Update team details
				this.setViewData('team', team);
				this.renderView();

				// Fire callback
				if (cb) cb();

			}).bind(this));
		}

		/**
		 * Refresh team upon showing
		 */
		ProfileTeam.prototype.onWillShow = function(cb) {
			this.updateTeam( cb );
		}


		// Store overlay component on registry
		R.registerComponent( 'profilepart.team', ProfileTeam, 1 );

	}

);