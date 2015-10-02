
define(

	// Requirements
	["vas/config", "vas/core/registry", "vas/core/base/components", "vas/core/ui"],

	/**
	 * Basic black screen of death
	 *
	 * @exports vas-basic/screen/bsod
	 */
	function(config,R,C,UI) {

		/**
		 * This is the 'Black Screen of Death', shown to the user
		 * if something went really wrong.
		 *
		 * @class
		 * @classdesc The basic black screen of death
		 * @registry screen.bsod
		 */
		var BSODScreen = function( hostDOM ) {
			C.BSODScreen.call(this, hostDOM);

			// Make this screen bsod
			hostDOM.addClass("bsod");

			// Create image and text placeholders
			this.eContent = $('<div class="content"></div>').appendTo(hostDOM);
			this.eText = $('<div class="text"></div>').appendTo(this.eContent);
			this.eIcon = $('<div class="image"></div>').appendTo(this.eContent);

		}
		BSODScreen.prototype = Object.create( C.BSODScreen.prototype );

		/**
		 * Black screen of death defined
		 */
		BSODScreen.prototype.onBSODDefined = function(text, icon) {
			if (icon.indexOf("<") == -1) {
				this.eIcon.css("background-image", icon);
				this.eIcon.empty();
			} else {
				this.eIcon.css("background-image", "");
				this.eIcon.append($(icon));
			}
			this.eText.html("<p>" + text + '</p>\n<p>This is a critical error and you cannot continue. Please try to <a href="javascript:location.reload()">refresh the page</a> and try later.</p>');
		}

		// Register login screen
		R.registerComponent( "screen.bsod", BSODScreen, 1 );

	}

);