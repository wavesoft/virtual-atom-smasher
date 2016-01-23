define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/quicksim.html"
	],

	/**
	 * Basic version of the quicksim overlay
	 *
	 * This overlay is presented to the user when he/she tries some values.
	 * It starts the simulation and waits until the data make some sense
	 * before allowing the user to continue.
	 *
	 * @exports vas-basic/overlay/quicksim
	 */
	function ($, C, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic quicksim screen overlay
         * @augments module:vas-core/base/components/overlays~QuicksimOverlay
         * @template vas/basic/tpl/overlay/quicksim.html
         * @registry overlay.quicksim
		 */
		var DefaultQuicksimOverlay = function (hostDOM) {
			C.QuicksimOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("quicksim-overlay");
			this.loadTemplate(tpl);
            this.renderView();

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultQuicksimOverlay.prototype = Object.create(C.QuicksimOverlay.prototype);

		// Register login screen
		R.registerComponent("overlay.quicksim", DefaultQuicksimOverlay, 1);

	}
);
