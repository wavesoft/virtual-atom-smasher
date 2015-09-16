define(

	// Dependencies

	["jquery", "vas/core/registry","vas/core/base/components", "text!vas/basic/tpl/overlay/eligibility.html" ], 

	/**
	 * This is the default component for displaying Overlay information when buying something
	 *
 	 * @exports vas-basic/overlay/buy
	 */
	function(config, R, C, tpl) {

		/**
		 * The default tunable body class
		 */
		var OverlayEligibility = function(hostDOM) {

			// Initialize widget
			C.EligibilityScreen.call(this, hostDOM);
			hostDOM.addClass("overlay-rounded-frame");
			hostDOM.addClass("overlay-eligibility");

			// Prepare view
			this.loadTemplate(tpl);
			this.renderView();

		};

		// Subclass from ObservableWidget
		OverlayEligibility.prototype = Object.create( C.EligibilityScreen.prototype );

		/**
		 * Add a status item
		 */
		OverlayEligibility.prototype.addItem = function( label, progress ) {
			var item = $('<div class="segment">'),
				label = $('<div class="segment-label">').appendTo(item),
				progHost = $('<div class="segment-progress"></div>').appendTo(item),
				progInd = $('<div class="indicator"></div>').appendTo(progHost);

			label.text(label);
			progInd.css("width", progress*100 + "%");
		}

		/**
		 * Update eligibility information
		 */
		OverlayEligibility.prototype.onEligibilityInformation = function(info) {
			this.select(".award-title").text(info['title']);
			this.select(".segments").empty();

			// TODO: Populate the UI

		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.eligibility', OverlayEligibility, 1 );

	}

);