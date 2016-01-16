
define(["vas/config", "vas/core/base/data_widget", "vas/core/base/component" ], 

	/**
	 * This module provides the base classes for all the game-wide overlays
	 *
 	 * @exports vas-core/base/components/overlays
	 */
	function(config, DataWidget, Component) {

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Papers Screen Component.
		 *
		 * This is the component with the abstract qunatum simulation
		 * machine graphic is rendered.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var PapersOverlay = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		PapersOverlay.prototype = Object.create( Component.prototype );

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Teams Screen Component.
		 *
		 * This is the component with the abstract qunatum simulation
		 * machine graphic is rendered.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var TeamsOverlay = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		TeamsOverlay.prototype = Object.create( Component.prototype );

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Profile Overlay Component.
		 *
		 * This is the component were the user can see and edit his/her
		 * profile details.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var ProfileOverlay = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		ProfileOverlay.prototype = Object.create( Component.prototype );

		////////////////////////////////////////////////////////////
		//             Event definitions for JSDoc                //
		////////////////////////////////////////////////////////////

		////////////////////////////////////////////////////////////

		// Expose home components
		var overlays = {
			'PapersOverlay'			: PapersOverlay,
			'TeamsOverlay'			: TeamsOverlay,
			'ProfileOverlay'		: ProfileOverlay,
		};

		return overlays;

	}
);
