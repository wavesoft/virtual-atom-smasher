define(

	// Dependencies

	["jquery", "require", "vas/core/registry","vas/core/base/component", "vas/core/db" ], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlays/help
	 */
	function(config, require, R, Component, DB) {

		/**
		 * A full-screen overlay that shows an explanatory image.
		 *
		 * @class
		 * @registry overlay.help
		 */
		var OverlayHelp = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);

			// Prepare data
			this.helpHostDOM = $('<div class="help-overlay"></div>').appendTo(hostDOM);
			
			// Click on close
			this.helpHostDOM.click((function(e) {
				// Stop event
				e.preventDefault();
				e.stopPropagation();
				// Close
				this.trigger('close');
			}).bind(this));

		};

		// Subclass from ObservableWidget
		OverlayHelp.prototype = Object.create( Component.prototype );

		/**
		 * Define help content
		 */
		OverlayHelp.prototype.onHelpDefined = function( images ) {
			// Define background-image
			this.helpHostDOM.css( "background-image", "url("+images[0]+")" );
		}

		/**
		 * Add black background for the help window 
		 */
		OverlayHelp.prototype.onWillShow = function( cb ) {
			var gameDOM = this.hostDOM.parent().parent();
			gameDOM.css("background-color", "rgba(0,0,0,0.5)");
			cb();
		}

		/**
		 * Remove black background for the help window 
		 */
		OverlayHelp.prototype.onHidden = function() {
			var gameDOM = this.hostDOM.parent().parent();
			gameDOM.css("background-color", "");
		}


		// Store overlay component on registry
		R.registerComponent( 'overlay.help', OverlayHelp, 1 );

	}

);