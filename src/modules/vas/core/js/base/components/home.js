
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
		/**
		 * Initializes a new Simulation Status Component.
		 *
		 * This is the component that remains in the corner of the screen while
		 * a simulation is running in order to report it' progress.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var SimulationStatus = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		SimulationStatus.prototype = Object.create( Component.prototype );

		/**
		 * This function is called when the simulation notification object
		 * is initialized and the screen should start to monitor it's status.
		 *
		 * @param {module:vas-core/simulation~SimulationJob} simulation - The simulation object to bind on
		 */
		SimulationStatus.prototype.onBindToSimulation = function( simulation ) {
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
			'SimulationStatus'	: SimulationStatus,
		};

		return homeComponents;

	}
);
