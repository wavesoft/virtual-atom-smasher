define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning", 
	 "text!vas/basic/tpl/screen/block/home/tuning_panel.html" ], 

	/**
	 * This is the default tunable widget component for the base interface.
	 *
 	 * @exports vas-basic/screen/block/home/tuning_panel
	 */
	function($, R, UI, TC, tpl) {

		/**
		 * A pop-up tuning panel.
		 *
		 * @class
		 * @registry screen.block.tuning_panel
		 */
		var DefaultTuningPanel = function(hostDOM) {

			// Initialize widget
			TC.TuningPanel.call(this, hostDOM);

			// Render template
            this.loadTemplate(tpl);
            this.renderView();

			// Prepare DOM
			hostDOM.addClass("tuning-panel");
			this.elmContainer = this.select(".tuning-panel-container");
			this.elmHostOld = this.select(".tunables-group-old");
			this.elmHostNew = this.select(".tunables-group-new");

			// Map of tunables
			this.tunablesMap = {};
			this.valuesMap = {};
			this.firstTunable = false;

			// Size information
			this.oldRows = 0;
			this.newRows = 0;
			this.widthScale = 0;
			this.width = 0;
			this.height = 0;

			this.select(".btn-back").click((function() {
				this.trigger('close');
			}).bind(this));
			this.select(".btn-go").click((function() {
				this.trigger('submitParameters', this.valuesMap);
			}).bind(this));

		};

		// Subclass from TuningPanel
		DefaultTuningPanel.prototype = Object.create( TC.TuningPanel.prototype );

		////////////////////////////////////////////////////////////
		//                    Helper Functions                    //
		////////////////////////////////////////////////////////////

		/**
		 * Register a new tunable widget
		 */
		DefaultTuningPanel.prototype.defineAndRegister = function(metadata, hostDOM, componentName) {
			var container = $('<div></div>').addClass("tunable").appendTo(hostDOM),
				com = R.instanceComponent(componentName, container);
			if (!com) return;

			// Register first tunable
			if (this.firstTunable) {
				this.firstTunable = false;
				R.registerVisualAid( 'tuning.firsttunable', com );				
			}

			// Initialize tunable
			com.onMetaUpdate(metadata);

			// Forward visual events to the component
			this.forwardVisualEvents(com);

			// Adopt all events from the tunables
			this.adoptEvents( com );

			// Bind events
			com.on('valueChanged', (function(newValue) {
				// Update value on valuesMap
				this.valuesMap[metadata['name']] = newValue;
				// Trigger change
				this.trigger('change', this.valuesMap);
			}).bind(this));

			// Listen for mouse events on the container
			container.mouseenter((function() {
				this.trigger('hover', name);
			}).bind(this));

			// Update component value
			com.onUpdate( this.valuesMap[metadata['name']] );

			// Resize to update DOM information
			com.onResize( com.width, com.height );

			// Store component tunables map
			this.tunablesMap[metadata['name']] = com;

			// Return component
			return com;
		}

		/**
		 * Apply new dimentions to layout
		 */
		DefaultTuningPanel.prototype.applySize = function() {

			// Fit the widgets on the specified box size
			var availWidth = this.width - parseInt(this.elmContainer.css("margin-left"))
								   		- parseInt(this.elmContainer.css("margin-right"));
			var availHeight = this.height - parseInt(this.elmContainer.css("margin-top"))
										  - parseInt(this.elmContainer.css("margin-bottom"));

			// Update size of widgets
			var refHeight = 0;
			this.elmHostNew.children().each(function(i,e) {
				$(e).css({
					"width": availWidth * 0.5
				})
				if (!refHeight)
					refHeight = $(e).outerHeight();
			});
			this.elmHostOld.children().each(function(i,e) {
				$(e).css({
					"width": availWidth * 0.25
				})
				if (!refHeight)
					refHeight = $(e).outerHeight();
			});

			// Update size variables
			var pWidth = availWidth * this.widthScale 
							+ parseInt(this.elmContainer.css("margin-left"))
							+ parseInt(this.elmContainer.css("margin-right"));
				pHeight = refHeight * (this.oldRows + this.newRows)
							+ parseInt(this.elmContainer.css("margin-top"))
						  	+ parseInt(this.elmContainer.css("margin-bottom"))

			// Specify dimentions
			this.elmContainer.css({
				'width': availWidth * this.widthScale,
				'height': refHeight * (this.oldRows + this.newRows)
			});

			// Define the dimentions
			this.hostDOM.css({
				// Centering
				'left': (this.width - pWidth) / 2, 
				'top': (this.height - pHeight) / 2,
			});

		}

		////////////////////////////////////////////////////////////
		//           Implementation of the TuningWidget           //
		////////////////////////////////////////////////////////////

		/**
		 * Update level information
		 */
		DefaultTuningPanel.prototype.onLevelDefined = function(details) {
			console.log(details);
			var tunables = details['tunables'];

			// Reset everything
			this.firstTunable = true;
			this.elmHostNew.empty();
			this.elmHostOld.empty();

			// If we don't have tunables, display an error page
			if (!tunables) {
				this.elmContainer.addClass("empty");
				return;
			} else {
				this.elmContainer.removeClass("empty");
			}

			// Process tunables and split into old and new
			var tun_old = [], tun_new = [];
			for (var i=0; i<tunables.length; i++) {
				var t = tunables[i];
				if (t['focus']) {
					tun_new.push(t);
				} else {
					tun_old.push(t);
				}
			}

			// Calculate maximum width and height scale
			this.widthScale = Math.max(
					Math.min( tun_new.length, 2 ) * 0.5,
					Math.min( tun_old.length, 4 ) * 0.25
				);
			this.oldRows = Math.ceil(tun_new.length/2);
			this.newRows = Math.ceil(tun_old.length/4);

			// Hide/show blocks
			if (tun_new.length == 0) { this.elmHostNew.hide(); } else { this.elmHostNew.show(); }
			if (tun_old.length == 0) { this.elmHostOld.hide(); } else { this.elmHostOld.show(); }

			// Generate tunables
			for (var i=0; i<tun_new.length; i++) {
				this.defineAndRegister(tun_new[i], this.elmHostNew, "widget.tunable_slider");
			}
			$('<div class="clear-fix"></div>').appendTo( this.elmHostNew );
			for (var i=0; i<tun_old.length; i++) {
				this.defineAndRegister(tun_old[i], this.elmHostOld, "widget.tunable_slider_sm");
			}
			$('<div class="clear-fix"></div>').appendTo( this.elmHostOld );

			// Apply size
			this.applySize();

		}

		/**
		 * This event is fired when the tunables of this panel should be defined
		 */
		DefaultTuningPanel.prototype.onTuningValuesDefined = function( currentValues ) {

			// Keep a reference of the values map
			this.valuesMap = currentValues;

			// Update all markers
			for (k in currentValues) {
				if (this.tunablesMap[k]) {
					this.tunablesMap[k].onUpdate( this.valuesMap[k] );
				}
			}

		}

		/**
		 * This event is fired when the saved slot values are updated
		 */
		DefaultTuningPanel.prototype.onTuningMarkersDefined = function( markersMap ) {
			// Update all markers
			for (k in markersMap) {
				if (this.tunablesMap[k]) {
					this.tunablesMap[k].onMarkersDefined( markersMap[k] );
				}
			}
		}

		/**
		 * This event is fired when the view is scrolled/resized and it
		 * specifies the height coordinates of the bottom side of the screen.
		 */
		DefaultTuningPanel.prototype.onResize = function(width, height) {

			// Keep size details
			this.width = width;
			this.height = height;

			// Resize
			this.applySize();

		}

		/**
		 * Update a particular parameter
		 */
		DefaultTuningPanel.prototype.onParameterChanged = function(parameter, value) {
			if (!this.tunablesMap[parameter]) return;
			this.tunablesMap[parameter].onUpdate( value, true );
		}

		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_panel', DefaultTuningPanel, 1 );

	}

);