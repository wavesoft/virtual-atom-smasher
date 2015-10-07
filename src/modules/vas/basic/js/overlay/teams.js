define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/teams.html"
	],

	/**
	 * Basic version of the teams screen
	 *
	 * @exports vas-basic/screen/teams
	 */
	function ($, C, R, tpl) {

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

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultTeamsOverlay.prototype = Object.create(C.TeamsOverlay.prototype);

		// Register login screen
		R.registerComponent("overlay.teams", DefaultTeamsOverlay, 1);

	}
);
