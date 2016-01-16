define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/profile.html"
	],

	/**
	 * Basic version of the profile screen
	 *
	 * @exports vas-basic/overlay/profile
	 */
	function ($, C, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic profile screen overlay
         * @augments module:vas-core/base/components/overlays~ProfileOverlay
         * @template vas/basic/tpl/overlay/profile.html
         * @registry overlay.profile
		 */
		var DefaultProfileOverlay = function (hostDOM) {
			C.ProfileOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("profile");
			this.loadTemplate(tpl);
            this.renderView();

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultProfileOverlay.prototype = Object.create(C.ProfileOverlay.prototype);

		// Register login screen
		R.registerComponent("overlay.profile", DefaultProfileOverlay, 1);

	}
);
