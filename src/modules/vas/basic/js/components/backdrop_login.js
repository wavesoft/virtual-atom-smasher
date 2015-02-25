
define(

	// Requirements
	["require", "vas/core/registry", "vas/core/base/components"],

	/**
	 * Basic version of the login backdrop
	 *
	 * @exports basic/components/backdrop_login
	 */
	function(require, R,C) {

		/**
		 * @class
		 * @classdesc The basic login backdrop
		 */
		var LoginBackdrop = function( hostDOM ) {
			C.Backdrop.call(this, hostDOM);

			// Create three parallax layers
			this.backPx1 = $('<div class="fx-back-parallax fx-parallax-5" style="background-image: url('+require.toUrl('vas/basic/img/backgrounds/back-px-1.png')+')"></div>').appendTo(hostDOM);
			this.backPx2 = $('<div class="fx-back-parallax fx-parallax-10" style="background-image: url('+require.toUrl('vas/basic/img/backgrounds/back-px-2.png')+')"></div>').appendTo(hostDOM);
			this.backPx3 = $('<div class="fx-back-parallax fx-parallax-20" style="background-image: url('+require.toUrl('vas/basic/img/backgrounds/back-px-3.png')+')"></div>').appendTo(hostDOM);

			// Apply parallax animation
			$("body").mousemove((function(e) {
				var x = 1-(e.pageX / $("body").width()), 
					y = 1-(e.pageY / $("body").height());

				window.requestAnimationFrame((function() {
					// Apply parallax
					this.backPx1.css({
						'left': ((x*5)-5)+'%',
						'top': ((y*5)-5)+'%'
					});
					this.backPx2.css({
						'left': ((x*10)-10)+'%',
						'top': ((y*10)-10)+'%'
					});
					this.backPx3.css({
						'left': ((x*20)-20)+'%',
						'top': ((y*20)-20)+'%'
					});
				}).bind(this));

			}).bind(this));

		}
		LoginBackdrop.prototype = Object.create( C.Backdrop.prototype );

		// Register login backdrop
		R.registerComponent( "backdrop.login", LoginBackdrop, 1 );

	}

);