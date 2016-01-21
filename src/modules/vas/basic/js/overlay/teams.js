define(

	// Dependencies
	[
		"jquery", 
		"core/ui/tabs",
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"vas/core/user",
		"text!vas/basic/tpl/overlay/teams.html"
	],

	/**
	 * Basic version of the teams screen
	 *
	 * @exports vas-basic/screen/teams
	 */
	function ($, Tabs, C, R, User, tpl) {

		/**
		 * @class
		 * @classdesc The basic teams screen overlay
         * @augments module:vas-core/base/components/overlays~TeamsOverlay
         * @template vas/basic/tpl/overlay/teams.html
         * @registry overlay.teams
		 */
		var DefaultTeamsOverlay = function (hostDOM) {
			C.TeamsOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("teams");
			this.loadTemplate(tpl);
            this.renderView();

            // Init tabs controller
            this.tabsController = new Tabs(
            		this.select(".tab-body"), this.select(".tab-bar > ul")
            	);

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultTeamsOverlay.prototype = Object.create(C.TeamsOverlay.prototype);

		//////////////////////////////////////////////////////////////
		// Helper functions
		//////////////////////////////////////////////////////////////

		/**
		 * Update details of all windows
		 */
		DefaultTeamsOverlay.prototype.updateDetails = function(cb) {

			// Completed countdown
			var left = 2,
				cb_countdown = function() {
					if (--left == 0) cb();
				};

			// Perform parallel requests
			User.getTeamResources(function(data) {

				// Update resources
				console.log("Resources:",data);

				cb_countdown();
			});
			User.getTeamDetails(function(data) {

				// Update details
				console.log("Details:",data);

				cb_countdown();
			});

		}

		//////////////////////////////////////////////////////////////
		// Base Callback Handlers 
		//////////////////////////////////////////////////////////////

		/**
		 * Populate the interface before showing it
		 *
		 * @param {function} cb - The callback to fire when the website is loaded
		 */
		DefaultTeamsOverlay.prototype.onWillShow = function(cb) {
			this.updateDetails(cb);
		}

		// Register login screen
		R.registerComponent("overlay.teams", DefaultTeamsOverlay, 1);

	}
);
