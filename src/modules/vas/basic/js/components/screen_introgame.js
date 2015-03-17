
define(

	// Requirements
	[
		"jquery", "jquery-knob",
		"vas/core/registry", 
		"vas/core/base/view", 
		"vas/core/user",
		"core/analytics/analytics",
		"text!vas/basic/tpl/introgame.html",
	],

	/**
	 * Basic version of the introduction game
	 *
	 * @exports basic/components/screen_introgame
	 */
	function($, jqKnob, R, View, User, Analytics, tplIntroGame ) {

		/**
		 * @class
		 * @classdesc The introduction game screen
		 */
		var IntrogameScreen = function( hostDOM ) {
			View.call(this, hostDOM);

			this.loadTemplate( tplIntroGame );

			// The two parameter values
			this.parameters = {a: 0, b: 0};

			// Handle parameter containers
			this.select(".parm", (function(dom) {

				// Create the input dial
				var dial = dom.find("input.dial").knob({
					'width'				: 100,
					'height'			: 100,
				    'min'  				: 0,
				    'max'  				: 100,
				    'step' 				: 1,
				    'displayPrevious'	: true,
				    'fgColor'			: "#C0392B",
		            'release' 			: (function(isA) {

		            	return function (v) {
			            	// Update parameter value
			            	if (isA) {
			            		this.parameters.a = v;
			            	} else {
			            		this.parameters.b = v;
			            	}
			            	// Update model
			            	this.updateModel();
			            }

		            })(dom.hasClass("parm-left")).bind(this)
				});

			}).bind(this));

			// Render view
			this.renderView();

		}
		IntrogameScreen.prototype = Object.create( View.prototype );

		/**
		 * Update model values
		 */
		IntrogameScreen.prototype.updateModel = function() {

		}

		// Register home screen
		R.registerComponent( "screen.tutorial.introstats", IntrogameScreen, 1 );

	}

);
