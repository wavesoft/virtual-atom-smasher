define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/view", "vas/core/user", "ccl-tracker",
	 "text!vas/basic/tpl/overlay/switchteam.html"
	],

	/**
	 * This is the default component for displaying the job status
	 *
 	 * @exports vas-basic/overlay/SwitchTeam
	 */
	function($, R, UI, View, User, Analytics, tplSwitchTeam) {

		/**
		 * The default tunable body class
		 */
		var SwitchTeam = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);
			hostDOM.addClass("switchteam-overlay");
			hostDOM.addClass("overlay-rounded-frame");

			this.paper = null;
			this.focusedPaper = null;

			// Handle DO URLs
			this.handleDoURL('joinTeam', (function(id) {

				// Define terms and reload
				User.requestToJoinTeam(id, (function(success) {
					if (success) {
						this.trigger("close");
					}
				}).bind(this));

			}).bind(this));

			// Load template
			this.loadTemplate(tplSwitchTeam);

		};

		// Subclass from View
		SwitchTeam.prototype = Object.create( View.prototype );

		/**
		 * Display the list of teams
		 */
		SwitchTeam.prototype.displayList = function( cb ) {

			// Request team listing
			User.getTeamListing((function(teams){ 
				
				// Update view
				this.setViewData('teams', teams);
				this.renderView();

				// Fire callbacks
				if (cb) cb();

			}).bind(this));

		}

		/**
		 * Render before show
		 */
		SwitchTeam.prototype.onWillShow = function(cb) {
			this.displayList(cb);
		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.switchteam', SwitchTeam, 1 );

	}

);