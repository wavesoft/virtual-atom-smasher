
define(

	// Requirements
	[
		"jquery", "jquery-knob",
		"vas/core/registry", 
		"vas/core/ui",
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
	function($, jqKnob, R, UI, View, User, Analytics, tplIntroGame ) {

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
		var IntroGameScreen = function( hostDOM ) {
			View.call(this, hostDOM);

			hostDOM.addClass("screen-introgame font-handwriting");
			this.loadTemplate( tplIntroGame );

			// The two parameter values
			this.maxEvents  =   35;
			this.parameters = 	{a: 0.333333, b: 0.666666};
			this.values = 		{ vf:12, vs2:0.2, xf: 15, xs2: 4, h: 300, hofs:20 };
			this.easeValues = 	{ vf:12,  vs2:0.2, xf: 15,  xs2: 4, h:300, hofs:20 };
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
				this.trigger('sequence.next', 'continue'); // [SEQUENCING]

				Analytics.fireEvent("intro.skip", {
					"id": (this.checkHistos ? "val-histo" : "val-single"),
					"time": Analytics.stopTimer("introgame-tries"),
				});

			}).bind(this));


			// Handle parameter containers
			this.select(".parm", (function(dom) {

				this.dials = [];
				dom.each((function(i,elm) {
					var dom = $(elm);

					var isLeft = dom.hasClass("parm-left");

					// Create the input dial
					var dial = dom.find("input.dial").knob({
						'width'				: 100,
						'height'			: 100,
						'min'  				: 0,
						'max'  				: 100,
						'step' 				: 1,
						'displayPrevious'	: true,
						'fgColor'			: "#3498DB",
						'bgColor'			: "#BDC3C7",
						'release' 			: (function(isLeft) {

							return function(v) {
								// Update parameter value
								if (isLeft) {
									this.parameters.a = v/100;
								} else {
									this.parameters.b = v/100;
								}
							}

						})(isLeft).bind(this)
					});

					// Register visual aids
					if (isLeft) {
						R.registerVisualAid("introgame.tunable.a", dom);
					} else {
						R.registerVisualAid("introgame.tunable.b", dom);
					}

					this.dials.push(dial);

				}).bind(this));

			}).bind(this));

			// Register other visual aids
			this.select(".btn-submit", function(dom) {
				R.registerVisualAid("introgame.submit", dom);
			});
			this.select(".scale", function(dom) {
				R.registerVisualAid("introgame.results", dom);
			});

			// Blink blinkable elements
			setInterval((function() {
				var blinker = this.select(".blink");
				if (blinker.length == 0) return;
				blinker.toggleClass("blink-hidden");
			}).bind(this), 500);

			// Render view
			this.renderView();

		}
		IntroGameScreen.prototype = Object.create( View.prototype );

		/**
		 * Recalculate values
		 */
		IntroGameScreen.prototype.recalculateValues = function() {

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
			this.select(".scale").removeClass("no-value");
			this.pendingStatusUpdate = true;

		}

		/**
		 * Ease properties
		 */
		IntroGameScreen.prototype.animateProperties = function() {
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
		IntroGameScreen.prototype.nextStep = function() {
			// Schedule next animation
			setTimeout((function() {
				requestAnimationFrame( this.animationStep.bind(this) );
			}).bind(this), 33);
		}

		/**
		 * Update model values
		 */
		IntroGameScreen.prototype.animationStep = function( forceRedraw ) {

			// Check if we should skip redraw
			if (!(forceRedraw === true)) {

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
		IntroGameScreen.prototype.setMode = function( withHistos ) {
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
		IntroGameScreen.prototype.updateStatus = function() {

			var v_range  = 0.9, // Error bar on v-range
				s2_range = 9;   // Error bar on s2-range

			// Handle status change
			var handleStatus = (function(status) {
				if (status == 0) {

					// Update to "Good"
					this.select(".result").attr("class", "result good").text("Correct!");

					// Correct answer
					Analytics.fireEvent("intro.correct_answer", {
						"id": (this.checkHistos ? "val-histo" : "val-single"),
						"time": Analytics.stopTimer("introgame-tries")
					});

					// Good results also trigger "Next" sequence
					setTimeout((function() {
						this.trigger('sequence.next', 'continue');
					}).bind(this), 500);

				} else if (status == 1) {

					// Average answer
					Analytics.fireEvent("intro.wrong_answer", {
						"id": (this.checkHistos ? "val-histo" : "val-single"),
						"time": Analytics.restartTimer("introgame-tries"),
						"type": "average"
					});

					this.select(".result").attr("class", "result average").text("Almost there!");

				} else {

					// Bad answer
					Analytics.fireEvent("intro.wrong_answer", {
						"id": (this.checkHistos ? "val-histo" : "val-single"),
						"time": Analytics.restartTimer("introgame-tries"),
						"type": "bad"
					});

					this.select(".result").attr("class", "result bad").text("Try again!");
				}
			}).bind(this);

			// Enable skip
			UI.showFirstTimeAid("introgame.continue");

			// Compare just values
			var delta = Math.abs(this.values.xf - this.values.vf);
			if (delta > v_range) {
				handleStatus(2);
				return;
			}

			// Double-check good cases when we are also
			// checking histograms.
			if (!this.checkHistos) {

				// Handle average and good value cases
				if (delta > v_range/2) {
					handleStatus(1);
				} else {
					handleStatus(0);
				}
				return;

			} else {

				// Compare histograms
				var status = 0;
				for (var i=0; i<this.vbins.length; i++) {
					var delta = Math.abs(this.xbins[i] - this.vbins[i]);
					if (delta <= s2_range/2) {
						// We are good, don't do anything
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

		}

		/**
		 * Prepare before show
		 */
		IntroGameScreen.prototype.onWillShow = function(cb) {

			// Shuffle values
			/*
			this.parameters.a = parseInt(Math.random() * 100);
			this.parameters.b = parseInt(Math.random() * 100);
			this.select(".parm-left input", (function(elm) {
				elm.val( this.parameters.a ).trigger("change")
			}).bind(this));
			this.select(".parm-right input", (function(elm) {
				elm.val( this.parameters.b ).trigger("change")
			}).bind(this));
			*/

			// Restart analytics timer
			Analytics.restartTimer("introgame-tries");

			// Display
			this.visible = true;
			this.renderView();
			this.nextStep();
			this.animationStep(true);
			this.setMode( this.checkHistos );
			cb();

		}

		/**
		 * When shown, show visual aids
		 */
		IntroGameScreen.prototype.onShown = function() {
			// Show all introgame.* first-time aids
			UI.showAllFirstTimeAids("introgame.");
		};

		/**
		 * Update model values
		 */
		IntroGameScreen.prototype.onHidden = function() {
			this.visible = false;
		}

		/**
		 * Make this screen sequencable
		 */
		IntroGameScreen.prototype.onSequenceConfig = function( config, cb ) {

			// Enable/disable histograms
			this.setMode( !!config['histograms'] );
			cb();

		}

		// Register home screen
		R.registerComponent( "screen.tutorial.introstats", IntroGameScreen, 1 );

	}

);
