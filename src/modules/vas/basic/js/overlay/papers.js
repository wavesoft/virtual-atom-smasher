define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/papers.html"
	],

	/**
	 * Basic version of the papers screen
	 *
	 * @exports vas-basic/overlay/papers
	 */
	function ($, C, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic papers screen overlay
         * @augments module:vas-core/base/components/overlays~PapersOverlay
         * @template vas/basic/tpl/overlay/papers.html
         * @registry overlay.papers
		 */
		var DefaultPapersOverlay = function (hostDOM) {
			C.PapersOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("papers");
			this.loadTemplate(tpl);
            this.renderView();

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultPapersOverlay.prototype = Object.create(C.PapersOverlay.prototype);

		// Register login screen
		R.registerComponent("overlay.papers", DefaultPapersOverlay, 1);

	}
);
