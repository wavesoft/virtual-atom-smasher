
define(["vas/config", "vas/core/base/data_widget", "vas/core/base/component" ], 

	/**
	 * This module provides the base classes for all the home-related components
	 * such as the machine or the status widget.
	 *
 	 * @exports vas-core/base/components/home
	 */
	function(config, DataWidget, Component) {

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Home Machine Component.
		 *
		 * This is the component with the abstract qunatum simulation
		 * machine graphic is rendered.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var HomeMachine = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		HomeMachine.prototype = Object.create( Component.prototype );

		/**
		 * Update the display of saved slots
		 */
		HomeMachine.prototype.onSaveSlotUpdate = function(slots) {
		}

		////////////////////////////////////////////////////////////
		//             Event definitions for JSDoc                //
		////////////////////////////////////////////////////////////

		/**
		 * This event is fired when the user clicks on discovered items that
		 * display a cinematic.
		 *
		 * @param {string} name - The cinematic to show
		 * @event module:vas-core/base/components/home~HomeMachine#showCinematic		
		 */

		/**
		 * This event is fired when the user clicks on discovered items that
		 * display a book.
		 *
		 * @param {string} name - The book to show
		 * @event module:vas-core/base/components/home~HomeMachine#explain		
		 */

		////////////////////////////////////////////////////////////

		// Expose home components
		var homeComponents = {
			'HomeMachine'		: HomeMachine,
		};

		return homeComponents;

	}
);
