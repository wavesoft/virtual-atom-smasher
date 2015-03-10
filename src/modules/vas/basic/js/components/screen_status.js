

define(

	/**
	 * Dependencies
	 */
	["jquery", "vas/config", "vas/core/registry", "vas/core/base/view",
	 "text!vas/basic/tpl/status.html"
	],

	/**
	 * Basic version of the home screen
	 *
	 * @exports vas-basic/components/tuning_screen
	 */
	function($, config, R, View, tplStatus) {

		/**
		 * Tuning dashboard screen
		 */
		var StatusScreen = function(hostDOM) {
			View.call(this, hostDOM);

			// Load view template
			hostDOM.addClass("status");
			this.loadTemplate(tplStatus);

			this.select(".com-paper", (function(e) {
				e.click(function() {
					$(this).parent().find(".com-paper.focused").removeClass("focused");
					$(this).addClass("focused");
				});
			}).bind(this));

		}
		StatusScreen.prototype = Object.create( View.prototype );

		///////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////
		////                            HOOK HANDLERS                              ////
		///////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////

		/**
		 * Render before showing
		 */
		StatusScreen.prototype.onWillShow = function(cb) {

			// Render view before showing
			this.renderView();
			cb();

		}

		// Register screen component on the registry
		R.registerComponent( 'screen.status', StatusScreen, 1 );

	}

);