define(

	// Dependencies

	["jquery", "vas/config", "vas/core/registry", "vas/core/user", "vas/core/base/component" ], 

	/**
	 * This is the default component for displaying user feedback form
	 *
 	 * @exports vas-basic/overlay/feedback
	 */
	function($, Config, R, User, Component) {

		/**
		 * The default feedback overlay screen
		 *
		 * @class
		 * @registry overlay.feedback
		 *
		 */
		var OverlayFeedback = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			hostDOM.addClass("feedback-overlay");
			hostDOM.addClass("overlay-rounded-frame");

			// Prepare iframe
			this.innerFrame = $('<iframe frameborder="0"></iframe>').appendTo(this.hostDOM);

		};

		// Subclass from ObservableWidget
		OverlayFeedback.prototype = Object.create( Component.prototype );

		/**
		 * Define feedback details
		 */
		OverlayFeedback.prototype.onFeedbackDetailsDefined = function( details ) {

			// JSON-Encode
			var feedbackStr = escape(JSON.stringify( details ));

			// Navigate to inner frame
			this.innerFrame.attr("src", Config.forum_vas_api + '?auth=' + User.profile['token'] + "&feedback=" + feedbackStr);

		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.feedback', OverlayFeedback, 1 );

	}

);