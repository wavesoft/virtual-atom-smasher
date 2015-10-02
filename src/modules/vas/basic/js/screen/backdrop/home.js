
define(

	// Requirements
	["vas/core/registry", "vas/core/base/components"],

	/**
	 * Basic version of the home backdrop
	 *
	 * @exports vas-basic/screen/backdrop/home
	 */
	function(R,C) {

		/**
		 * This is the basic home screen backdrop
		 *
		 * @class
		 * @classdesc The basic home screen backdrop
		 * @registry backdrop.home
		 */
		var HomeBackdrop = function( hostDOM ) {
			C.Backdrop.call(this, hostDOM);

			// The screen backdrop is just black
			//hostDOM.css({ 'background-color': '#FFF' });

		}
		HomeBackdrop.prototype = Object.create( C.Backdrop.prototype );

		// Register home screen
		R.registerComponent( "backdrop.home", HomeBackdrop, 1 );

	}

);