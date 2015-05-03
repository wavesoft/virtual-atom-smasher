define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/component", "vas/core/db", "vas/core/user", "core/analytics/analytics" ], 

	/**
	 * This is the default component for displaying questionnaires
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, UI, Component, DB, User, Analytics) {

		/**
		 * The default tunable body class
		 */
		var OverlayQuestionaire = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			hostDOM.addClass("embed-overlay");
			hostDOM.addClass("overlay-rounded-frame");

			// Create the iframe
			this.embedIframe = $('<iframe frameborder="0"></iframe>').appendTo( hostDOM );

			// Handle load events in order to navigate away after the load event
			this.initialLoad = false;
			this.embedIframe.on('load', (function(e) {

				// Ignore initial load
				if (this.initialLoad) {
					this.initialLoad = false;
					return;
				}

				// Each other 'load' equals to 'close'
				this.trigger('close');

			}).bind(this));

		};

		// Subclass from ObservableWidget
		OverlayQuestionaire.prototype = Object.create( Component.prototype );

		/**
		 * Reposition flashDOM on resize
		 */
		OverlayQuestionaire.prototype.onEmbedConfigured = function( config ) {

			// Navigate to the specified URL
			this.initialLoad = true;
			this.embedIframe.attr( "src", config['url'] );


		}


		// Store overlay component on registry
		R.registerComponent( 'overlay.embed', OverlayQuestionaire, 1 );

	}

);