define(

	// Dependencies
	["jquery", "core/ui/tabs", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning",
	 "text!vas/basic/tpl/screen/block/home/tuning_notepad.html" ], 

	/**
	 * This is the tuning notepad shown aside with the tuning panel
	 *
 	 * @exports vas-basic/screen/block/home/tuning_notepad
	 */
	function($, Tabs, R, UI, TC, tpl) {

		/**
		 * @class
		 * @registry screen.block.tuning_notepad
		 * @template screen/block/home/tuning_notepad.html
		 * @augments module:vas-core/base/components/tuning~TuningNotepad
		 */
		var DefaultTuningNotepad = function(hostDOM) {
			// Initialize widget
			TC.TuningNotepad.call(this, hostDOM);

			// Render template
            this.loadTemplate(tpl);
            this.renderView();

			// Create a tabs controller
			this.tabsController = new Tabs(
					this.select(".notepad-body"),
					this.select(".notepad-tabs > ul")
				);

		}

		// Subclass from TuningNotepad
		DefaultTuningNotepad.prototype = Object.create( TC.TuningNotepad.prototype );

		/**
		 * Realign the DOM element on resize
		 */
		DefaultTuningNotepad.prototype.onResize = function( width, height ) {

			// Center us in the middle of the size allocated
			this.hostDOM.css({
				'left': (width - this.getPreferredSize()[0]) / 2,
				'top': (height - this.getPreferredSize()[1]) / 2,
			});

		}

		/**
		 * The preferred size component is used to fix the size of the
		 * notepad, so we have to return at least the width component.
		 *
		 * @return {array} The preferred dimentions
		 */
		DefaultTuningNotepad.prototype.getPreferredSize = function() {
			return [ 320, 390 ];
		}

		/**
		 * Update level information
		 */
		DefaultTuningNotepad.prototype.onLevelDefined = function(details) {
			this.select(".notepad-title > .level").text("Level "+details['index']);
			this.select(".notepad-title > .title").text(details['title']);
			this.select(".body-help").html(details['desc']);
		}

		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_notepad', DefaultTuningNotepad, 1 );

	}

);