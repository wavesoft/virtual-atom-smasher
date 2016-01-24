define(

	// Dependencies
	["jquery", "core/ui/tabs", "core/ui/table", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning",
	 "text!vas/basic/tpl/screen/block/home/tuning_notepad/values.html" ], 

	/**
	 * This is the tuning notepad 'values' tab,  shown aside with the tuning panel
	 *
 	 * @exports vas-basic/screen/block/home/tuning_notepad/values
	 */
	function($, Tabs, Table, R, UI, TC, tpl) {

		/**
		 * @class
		 * @registry screen.block.tuning_notepad.values
		 * @template screen/block/home/tuning_notepad/values.html
		 * @augments module:vas-core/base/components/tuning~TuningNotepad
		 */
		var DefaultTuningNotepadValues = function(hostDOM) {
			// Initialize widget
			TC.TuningNotepad.call(this, hostDOM);
			hostDOM.addClass("tuning-notepad-values");

			// Render template
            this.loadTemplate(tpl);
            this.renderView();

			// Create a tabs controller
			this.tabsController = new Tabs(
					this.select(".values-body"),
					this.select(".values-tabs > ul")
				);

			// Create a table controller
			this.tableController = new Table(
					this.select(".results-table")
				);
			this.tableController
				.addColumn("name", "Tunable", 8)
				.addColumn("vlaue", "Value", 4);

            // Set-up body
            this.select(".body-hint").hide();

		}

		// Subclass from TuningNotepad
		DefaultTuningNotepadValues.prototype = Object.create( TC.TuningNotepad.prototype );

		/**
		 * Update level information
		 */
		DefaultTuningNotepadValues.prototype.onLevelDefined = function(details) {

		}

		/**
		 * Definition of last run values
		 */
		DefaultTuningNotepadValues.prototype.onLastRunDefined = function( values ) {

		}

		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_notepad.values', DefaultTuningNotepadValues, 1 );

	}

);