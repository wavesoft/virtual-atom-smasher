
define(

	// Requirements
	["vas/core/registry", "vas/core/base/components"],

	/**
	 * Basic version of the home backdrop
	 *
	 * @exports vas-basic/screen/backdrop/progress
	 */
	function(R,C) {

		/**
		 * This is the basic progress screen backdrop
		 *
		 * @class
		 * @classdesc The basic progress screen backdrop
		 * @registry backdrop.progress
		 */
		var ProgressBackdrop = function( hostDOM ) {
			C.Backdrop.call(this, hostDOM);

			// The screen backdrop is just black
			hostDOM.css({
				//'background-color'  : '#FFF',
				/*
				'background-image'  : 'url(static/img/particles.jpg)',
				'background-size'   : 'cover',
				'background-repeat' : 'no-repeat',
				*/
			});

		}
		ProgressBackdrop.prototype = Object.create( C.Backdrop.prototype );

		// Register home screen
		R.registerComponent( "backdrop.progress", ProgressBackdrop, 1 );

	}

);