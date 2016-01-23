define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/results.html"
	],

	/**
	 * Basic version of the results screen
	 *
	 * @exports vas-basic/overlay/results
	 */
	function ($, C, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic results screen overlay
         * @augments module:vas-core/base/components/overlays~ResultsOverlay
         * @template vas/basic/tpl/overlay/results.html
         * @registry overlay.results
		 */
		var DefaultResultsOverlay = function (hostDOM) {
			C.ResultsOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("results");
			this.loadTemplate(tpl);
            this.renderView();

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultResultsOverlay.prototype = Object.create(C.ResultsOverlay.prototype);

		// Register login screen
		R.registerComponent("overlay.results", DefaultResultsOverlay, 1);

	}
);
