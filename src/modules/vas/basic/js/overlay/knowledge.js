define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/knowledge.html"
	],

	/**
	 * Basic version of the knowledge screen
	 *
	 * @exports vas-basic/overlay/knowledge
	 */
	function ($, C, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic knowledge screen overlay
         * @augments module:vas-core/base/components/overlays~KnowledgeOverlay
         * @template vas/basic/tpl/overlay/knowledge.html
         * @registry overlay.knowledge
		 */
		var DefaultKnowledgeOverlay = function (hostDOM) {
			C.KnowledgeOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("knowledge");
			this.loadTemplate(tpl);
            this.renderView();

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultKnowledgeOverlay.prototype = Object.create(C.KnowledgeOverlay.prototype);

		// Register login screen
		R.registerComponent("overlay.knowledge", DefaultKnowledgeOverlay, 1);

	}
);
