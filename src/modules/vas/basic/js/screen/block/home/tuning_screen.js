define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning",
	 "text!vas/basic/tpl/screen/block/home/tuning_screen.html" ], 

	/**
	 * This is the overlay tuning screen
	 *
 	 * @exports vas-basic/screen/block/home/tuning_screen
	 */
	function($, R, UI, TC, tpl) {

		/**
		 * @class
		 * @registry screen.block.tuning_screen
		 * @template screen/block/home/tuning_screen.html
		 * @augments module:vas-core/base/components/tuning~TuningScreen
		 */
		var DefaultTuningScreen = function(hostDOM) {
			// Initialize widget
			TC.TuningScreen.call(this, hostDOM);

			// Render template
            this.loadTemplate(tpl);
            this.renderView();

            //
            // Create sub-components
            //

            // Tuning screen
            this.tuningPanel = R.instanceComponent("screen.block.tuning_panel", this.select(".tuning-panel"));
            this.forwardVisualEvents( this.tuningPanel );

            // Tuning notepad
            this.tuningNotepad = R.instanceComponent("screen.block.tuning_notepad", this.select(".tuning-notepad"));
            this.forwardVisualEvents( this.tuningNotepad );
            
            this.hostDOM.click((function() {
            	this.trigger('close');
            }).bind(this));

		}

		// Subclass from TuningScreen
		DefaultTuningScreen.prototype = Object.create( TC.TuningScreen.prototype );

		/**
		 * Realign components on resize
		 */
		DefaultTuningScreen.prototype.onResize = function(width, height) {

			// Query the optimal size for the notepad
			// This component is always fixed-size
			var notepadSize = this.tuningNotepad.getPreferredSize();
			if (!notepadSize) notepadSize = [300,300];

			// Reisze host elements
			this.select(".tuning-notepad-host").css({
				'left': 0, 'top': 0,
				'width': notepadSize[0],
				'height': height
			});
			this.select(".tuning-panel-host").css({
				'left': notepadSize[0], 'top': 0,
				'width': width - notepadSize[0],
				'height': height
			});

			// Resize components
			this.tuningNotepad.onResize( notepadSize[0], height );
			this.tuningPanel.onResize( width - notepadSize[0], height );

		}

		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_screen', DefaultTuningScreen, 1 );

	}

);