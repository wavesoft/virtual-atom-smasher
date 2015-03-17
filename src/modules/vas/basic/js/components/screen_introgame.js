
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
		 * Normal Distribution Probability Density Function
		 */
		function ndpdf(x,m,s2) {
			var s = Math.sqrt(s2),
				p = -Math.pow(x-m,2)/(2*s2);
			return (1/(s*Math.sqrt(2*Math.PI)))*Math.pow(Math.E, p);
		}

		/**
		 * Return the normal distribution composed of 'bins' bins,
		 * ranged between 'min' and 'max', and focus on mean 'mean',
		 * using the s2 value specified.
		 *
		 * Normalize response to maximum height 'height'
		 */
		function ndist( bins, min, max, mean, s2, height, hOfffset ) {
			var ans = [],
				binw = parseInt((max - min) / bins),
				x = min;

			// Map [-5, 5] to [min, max]
			var ndremap = function(v) {
				return ((v-min)/(max-min))*10-5;
			};

			// Distribute values to bins
			while (x < max) {
				var xl = x, xh = x + binw; x += binw;
				var xm = (xl+xh) / 2;

				// Generate normal distribution values
				ans.push( ndpdf( ndremap(xm), ndremap(mean), s2 ) * (height-hOfffset*2) + hOfffset );
			}

			// Return bin heights
			return ans;
		}

		/**
		 * @class
		 * @classdesc The introduction game screen
		 */
		var IntrogameScreen = function( hostDOM ) {
			View.call(this, hostDOM);

			hostDOM.addClass("screen-introgame font-handwriting");
			this.loadTemplate( tplIntroGame );

			// The two parameter values
			this.maxEvents  =   35;
			this.parameters = 	{a: 0, b: 0};
			this.values = 		{ vf:12, vs2:0.2, xf: 15, xs2: 4, h: 300, hofs:20 };
			this.easeValues = 	{ vf:0,  vs2:0, xf: 0,  xs2: 0, h:0, hofs:0 };
			this.dials = [];
			this.pendingStatusUpdate = false;
			this.checkHistos = false;
			this.vbins = [];
			this.xbins = []

			window.game = this;

			// handle submit request
			this.handleDoURL('simulate', (function() {

				// Recalculate values
				this.recalculateValues();

			}).bind(this));
			this.handleDoURL('continue', (function() {

				// Trigger next action in the sequence
				this.trigger("sequence.next");

			}).bind(this));


			// Handle parameter containers
			this.select(".parm", (function(dom) {

				this.dials = [];
				dom.each((function(i,elm) {
					var dom = $(elm);

					// Create the input dial
					var dial = dom.find("input.dial").knob({
						'width'				: 100,
						'height'			: 100,
						'min'  				: 0,
						'max'  				: 100,
						'step' 				: 1,
						'displayPrevious'	: true,
						'fgColor'			: "#3498DB",
						'release' 			: (function(isLeft) {

							return function(v) {
								// Update parameter value
								if (isLeft) {
									this.parameters.a = v/100;
								} else {
									this.parameters.b = v/100;
								}
							}

						})(dom.hasClass("parm-left")).bind(this)
					});

					this.dials.push(dial);

				}).bind(this));

			}).bind(this));

			// Blink blinkable elements
			setInterval((function() {
				var blinker = this.select(".blink");
				if (blinker.length == 0) return;
				blinker.toggleClass("blink-hidden");
			}).bind(this), 500);

			// Render view
			this.renderView();

		}
		IntrogameScreen.prototype = Object.create( View.prototype );

		/**
		 * Recalculate values
		 */
		IntrogameScreen.prototype.recalculateValues = function() {

	//		((a + b)/2)*scale = target

			var vs2_min = 0.2,
				vs2_max = 5;

			// vf is a correlation between a and b
			this.values.vf = ((this.parameters.a + (1.0-this.parameters.b)) / 2) * 35;
			this.values.vs2 = ((this.parameters.a*2 + this.parameters.b*0.5) / 2.5) * (vs2_max-vs2_min) + vs2_min;
			this.values.h = 300;
			this.values.hofs = 20;
			this.easeValues.h = 0;
			this.easeValues.hofs = 0;

			// Update result
			this.select(".result").attr("class", "result blink").text("Simulating");
			this.pendingStatusUpdate = true;

		}

		/**
		 * Ease properties
		 */
		IntrogameScreen.prototype.animateProperties = function() {
			var changed = false,
				tollerance = 0.08,
				easeFactor = 25,
				properties = ['vf','vs2','xf','xs2', 'h', 'hofs'];

			// Apply to all properties
			for (var i=0; i<properties.length; i++) {
				var p = properties[i],
					diff = this.values[p] - this.easeValues[p];
				if (diff == 0) {
					/* Not changed */
				} else if (Math.abs(diff) < tollerance) {
					this.easeValues[p] = this.values[p];
					changed = true;
				} else {
					this.easeValues[p] += diff / easeFactor;
					changed = true;
				}
			}

			// Return true if nothing changed
			return changed;

		}

		/**
		 * Schedule next animation step
		 */
		IntrogameScreen.prototype.nextStep = function() {
			// Schedule next animation
			setTimeout((function() {
				requestAnimationFrame( this.animationStep.bind(this) );
			}).bind(this), 33);
		}

		/**
		 * Update model values
		 */
		IntrogameScreen.prototype.animationStep = function() {

			// Animate properties and don't do anything
			// if nothing changed
			if (!this.animateProperties()) {

				// Keep animation
				this.nextStep();

				// Update status when completed
				if (this.pendingStatusUpdate) {
					this.updateStatus();
					this.pendingStatusUpdate = false;
				}

				return;
			}

			// If not visible, do nothing
			if (!this.visible) {
				return;
			}

			// Map [0, 35] to [0, scaleWidth]
			var vtow = (function(v) {
				return (v/this.maxEvents)*700;
			}).bind(this);

			// Calculate and apply normal distribution to values
			var velms = this.select(".scale-bin > .scale-tune-value"),
				vbins = this.vbins = ndist( velms.length, 0, this.maxEvents, this.easeValues.vf, this.easeValues.vs2, this.easeValues.h, this.easeValues.hofs );
			velms.each((function(i,elm) {
				$(elm).css('top', 300 - vbins[i]);
			}).bind(this));

			// Update value mean
			this.select(".scale-average.scale-tune-value").css({
				'left': vtow(this.easeValues.vf) - (this.checkHistos ? 0 : 20)
			});
			this.select(".scale-average.scale-tune-value > .average-label").text(this.easeValues.vf.toFixed(1));

			// Calculate and apply normal distribution to values
			var xelms = this.select(".scale-bin > .scale-ref-value"),
				xbins = this.xbins = ndist( xelms.length, 0, this.maxEvents, this.easeValues.xf, this.easeValues.xs2, 300, 20 );
			xelms.each((function(i,elm) {
				$(elm).css('top', 300 - xbins[i]);
			}).bind(this));

			// Update value mean
			this.select(".scale-average.scale-ref-value").css({
				'left': vtow(this.easeValues.xf)
			});
			this.select(".scale-average.scale-ref-value > .average-label").text(this.easeValues.xf.toFixed(1));

			// Next animation step
			this.nextStep();

		}

		/**
		 * Set simulation mode
		 */
		IntrogameScreen.prototype.setMode = function( withHistos ) {
			this.checkHistos = withHistos;
			if (!withHistos) {
				this.select(".scale").addClass("no-histo");
			} else {
				this.select(".scale").removeClass("no-histo");
			}
		}

		/**
		 * Check the results and update status
		 */
		IntrogameScreen.prototype.updateStatus = function() {

			var v_range  = 0.9, // Error bar on v-range
				s2_range = 9;   // Error bar on s2-range

			// Handle status change
			var handleStatus = (function(status) {
				if (status == 0) {
					this.select(".result").attr("class", "result good").text("Correct!");
				} else if (status == 1) {
					this.select(".result").attr("class", "result average").text("Almost there!");
				} else {
					this.select(".result").attr("class", "result bad").text("Try again!");
				}
			}).bind(this);

			// Compare just values
			var delta = Math.abs(this.values.xf - this.values.vf);
			if (delta <= v_range/2) {
				handleStatus(0);
				return;
			} else if (delta <= v_range) {
				handleStatus(1);
				return;
			}

			// Double-check case '2'
			if (!this.checkHistos) {
				handleStatus(2);

			} else {

				// Compare histograms
				var status = 0;
				for (var i=0; i<this.vbins.length; i++) {
					var delta = Math.abs(this.xbins[i] - this.vbins[i]);
					if (delta <= s2_range/2) {
						// We are good
					} else if (delta <= s2_range) {
						// If not 2, switch to 1
						if (status < 1) status = 1;
					} else {
						// Bad, switch to 2
						status = 2;
					}
				}
				handleStatus(status);

			}

			// Enable skip
			this.select(".skip-btn").addClass("visible");

		}

		/**
		 * Prepare before show
		 */
		IntrogameScreen.prototype.onWillShow = function(cb) {

			// Shuffle values
			this.parameters.a = parseInt(Math.random() * 100);
			this.parameters.b = parseInt(Math.random() * 100);
			this.select(".parm-left input").val( this.parameters.a ).trigger("change");
			this.select(".parm-right input").val( this.parameters.b ).trigger("change");

			// Display
			this.visible = true;
			this.renderView();
			this.nextStep();
			cb();
		}

		/**
		 * Update model values
		 */
		IntrogameScreen.prototype.onHidden = function() {
			this.visible = false;
		}

		/**
		 * Make this screen sequencable
		 */
		IntrogameScreen.prototype.onSequenceConfig = function( config, cb ) {

		}

		// Register home screen
		R.registerComponent( "screen.tutorial.introstats", IntrogameScreen, 1 );

	}

);