define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/user", "vas/core/base/components/tuning", "core/util/spinner", "ccl-tracker" ], 

	/**
	 * This is the default tunable widget component for the base interface.
	 *
 	 * @exports vas-basic/common/widget/tunable_slider
	 */
	function($, R, UI, User, TC, Spinner, Analytics) {

		/**
		 * A slider widget rendered as a slider, used by the tuning interface.
		 * 
		 * @class
		 * @registry widget.tunable_slider
		 */
		var DefaultTunableSliderSmall = function(hostDOM) {

			// Initialize widget
			TC.TunableWidget.call(this, hostDOM);

			// Prepare variables
			this.value = null;
			this.lastValue = null;
			this.meta = {};
			this.markers = [];
			this.idleTimer = 0;

			// Add class to host dom
			hostDOM.addClass("widget-tunable-sm");

			// Prepare DOM elements
			this.elmTitle = $('<div class="title"></div>');
			this.hostDOM.append( this.elmTitle );

			this.elmValueHost = $('<div class="value-host"></div>').appendTo(this.hostDOM);
			this.elmValueLabel = $('<div class="value"></div>').appendTo(this.elmValueHost);
			this.btnMinus = $('<a class="minus">-</div>').appendTo(this.elmValueHost);
			this.btnPlus = $('<a class="plus">+</div>').appendTo(this.elmValueHost);


			// Pop-up description of the element on hover
			this.hoverTimer = 0;
			this.elmTitle.mouseenter((function() {
				this.triggerPopup();
			}).bind(this));
			this.hostDOM.mouseleave((function() {
				clearTimeout(this.hoverTimer);
				this.hoverTimer = setTimeout((function() {
					UI.hidePopup((function() {

						// Fire analytics event
						Analytics.fireEvent("tuning.values.explain_time", {
							'id': this.meta['name'],
							'time': Analytics.stopTimer("info-popup")
						});

					}).bind(this));					
				}).bind(this), 100);
			}).bind(this));


		};

		// Subclass from TunableWidget
		DefaultTunableSliderSmall.prototype = Object.create( TC.TunableWidget.prototype );

		////////////////////////////////////////////////////////////
		//                    Helper Functions                    //
		////////////////////////////////////////////////////////////

		/**
		 * Trigger the description pop-up
		 */
		DefaultTunableSliderSmall.prototype.triggerPopup = function() {
			clearTimeout(this.hoverTimer);
			this.hoverTimer = setTimeout((function() {

				// Show pop-up
				UI.showPopup( 
					"widget.onscreen", 
					this.hostDOM,
					(function(hostDOM) {

						// Fire analytics event
						Analytics.fireEvent("tuning.values.explain", {
							'id': this.meta['name']
						});

						// Start analytics timer
						Analytics.restartTimer("info-popup");

						// Prepare the body
						var comBody = R.instanceComponent("popup.tunable", hostDOM);
						if (comBody) {

							// Update infoblock 
							comBody.onMetaUpdate( this.meta );
							comBody.onUpdate( this.value );

							// Adopt events from infoblock as ours
							this.adoptEvents( comBody );

						} else {
							console.warn("Could not instantiate tunable infoblock!");
						}

					}).bind(this),
					{ 
						'offset': $(this.hostDOM).width()/2+20,
						'title' : this.meta['name']
					}
				);

				// Remove highlight
				if (this.hostDOM.hasClass("highlight")) {
					// Mark first-time as seen
					User.markFirstTimeAsSeen("tunable-desc."+this.meta['name']);
					// Remove highlight
					this.hostDOM.removeClass("highlight");
				}


			}).bind(this), 250);

		}

		/**
		 * Apply value on display
		 */
		DefaultTunableSliderSmall.prototype.showValue = function() {
			this.elmValueLabel.text( this.renderValue() );
		}

		/**
		 * Render the value
		 */
		DefaultTunableSliderSmall.prototype.renderValue = function() {
			var v = this.value, dec=0;
			if (this.meta && (this.meta['dec'] != undefined)) dec=this.meta['dec'];
			return v.toFixed(dec);
		}

		/**
		 * Handle a value update from the interface
		 */
		DefaultTunableSliderSmall.prototype.handleValueChange = function(value) {

			// Store the value
			this.value = value;
			this.showValue();

			// Use idle timer before forwarding value change event
			clearTimeout(this.idleTimer);
			this.idleTimer = setTimeout( (function() {
				if (this.prevValue != null) {
					this.trigger('valueChanged', this.value, this.lastValue, this.meta);
				}
				this.prevValue = this.value;
			}).bind(this), 250);

		}

		////////////////////////////////////////////////////////////
		//           Implementation of the TuningWidget           //
		////////////////////////////////////////////////////////////

		/**
		 * Update saved slot value
		 */
		DefaultTunableSliderSmall.prototype.onMarkersDefined = function( markers ) {

		}

		/**
		 * Update tuning widget value
		 */
		DefaultTunableSliderSmall.prototype.onUpdate = function(value, animate) {
			if (value == undefined) return;

			// Update value
			this.lastValue = this.value;
			this.value = value;

			// Display it
			this.showValue();

		}

		/**
		 * Update tuning widget metadata
		 */
		DefaultTunableSliderSmall.prototype.onMetaUpdate = function(meta) {
			this.meta = meta;

			// Update label
			this.elmTitle.html(meta['short']);

			// Update default value
			if (this.value == null)
				this.onUpdate( meta['default'] || 0.0 );

			// Prepare spinner
			if (this.spinner) return;
			this.spinner = new Spinner(this.meta, (function(v) {

				// Spinner works in mapped values, while we internaly
				// work with normalized values. Therefore we trigger handleValueChange
				// passing the normalized value of the spinner value.
				this.handleValueChange( v );

			}).bind(this));

			// Bind button events to the spinner
			this.btnPlus.mousedown((function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.spinner.start(1);
			}).bind(this));
			this.btnPlus.mouseup((function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.spinner.stop();
			}).bind(this));
			this.btnMinus.mousedown((function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.spinner.start(-1);
			}).bind(this));
			this.btnMinus.mouseup((function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.spinner.stop();
			}).bind(this));

		}

		// Store tuning widget component on registry
		R.registerComponent( 'widget.tunable_slider_sm', DefaultTunableSliderSmall, 1 );

	}

);