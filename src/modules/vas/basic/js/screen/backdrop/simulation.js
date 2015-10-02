
define(

	// Requirements
	["vas/core/registry", "vas/core/base/components"],

	/**
	 * Basic version of the results backdrop
	 *
	 * @exports vas-basic/screen/backdrop/simulation
	 */
	function(R,C) {

		/**
		 * This is the basic simulation screen backdrop
		 *
		 * @class
		 * @classdesc The basic simulation screen backdrop
		 * @registry backdrop.simulation
		 */
		var ResultsBackdrop = function( hostDOM ) {
			C.Backdrop.call(this, hostDOM);

			// The screen backdrop is just black
			/*
			hostDOM.css({
				'background-color': '#FFF',
				'background-image': 'url(static/img/white_abstract.jpg)'
			});
			*/

		}
		ResultsBackdrop.prototype = Object.create( C.Backdrop.prototype );

		// Register simulation screen backdrop
		R.registerComponent( "backdrop.simulation", ResultsBackdrop, 1 );

	}

);