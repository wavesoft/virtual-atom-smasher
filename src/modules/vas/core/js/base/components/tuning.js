
define(["vas/config", "vas/core/base/data_widget", "vas/core/base/component" ], 

	/**
	 * This module provides the base classes for all the tuning-related operations
	 * such as editing a tunable parameters and visualizing observable results.
	 *
 	 * @exports vas-core/base/components/tuning
	 */
	function(config, DataWidget, Component) {

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Tuning Widget Component.
		 *
		 * This component is used for allowing the user to visually edit the value of
		 * a tunable component.
		 *
		 * @class
		 * @classdesc Base class for providing a tunable parameter editing interface.
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:core/base/data_widget~DataWidget
		 *
		 */
		var TunableWidget = function( hostDOM ) {

			// Initialize base class
			DataWidget.call(this, hostDOM);

		}

		// Subclass from DataWidget
		TunableWidget.prototype = Object.create( DataWidget.prototype );

		/**
		 * Update the display of saved slots
		 */
		TunableWidget.prototype.onSaveSlotUpdate = function(slots) {
		}

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Observable Widget Component.
		 *
		 * This component is used to render the value of an observable
		 *
		 * @class
		 * @classdesc Base class for providing a tunable visualization.
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:core/base/data_widget~DataWidget
		 *
		 */
		var ObservableWidget = function( hostDOM ) {

			// Initialize base class
			DataWidget.call(this, hostDOM);

		}

		// Subclass from DataWidget
		ObservableWidget.prototype = Object.create( DataWidget.prototype );


		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Tuning Panel component.
		 *
		 * This component is used to display a group of relevant tuning parameters
		 *
		 * @class
		 * @classdesc Base class for providing a tunable visualization.
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:core/base/data_widget~DataWidget
		 *
		 */
		var TuningPanel = function( hostDOM ) {

			// Initialize base class
			DataWidget.call(this, hostDOM);

		}

		// Subclass from DataWidget
		TuningPanel.prototype = Object.create( DataWidget.prototype );

		/**
		 * Define tunables panel
		 */
		TuningPanel.prototype.onTuningPanelDefined = function(title, tunables) {
		}

		/**
		 * Update tuning panel
		 */
		TuningPanel.prototype.onParameterChanged = function(parameter, value) {	
		}

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Tuning Screen component.
		 *
		 * This component is embedded in the home or other screens in order
		 * to display the tuning configuration.
		 *
		 * @class
		 * @classdesc Base class for providing a tunable visualization.
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var TuningScreen = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from DataWidget
		TuningScreen.prototype = Object.create( Component.prototype );

		/**
		 * This function is called when the level details are defined
		 *
		 * @param {array} tunables - A list of the tunables the user can change
		 */
		TuningScreen.prototype.onLevelDefined = function( tunables ) {
		}

		/**
		 * This function is called when the user has submitted a simulation.
		 * The simulation values are specified in order to update the tunable
		 * labels.
		 *
		 * @param {object} values - The values of the current run or NULL if inactive
		 */
		TuningScreen.prototype.onActiveRunDefined = function( values ) {
		}

		////////////////////////////////////////////////////////////
		//             Event definitions for JSDoc                //
		////////////////////////////////////////////////////////////

		/**
		 * This event is fired when the user requested more information regarding the 
		 * tunable component (typically this appears when the user leaves the mouse for
		 * a couple of milliseconds on the tile)
		 *
		 * @param {object} meta - The metadata of the tunable widget to show more details for
		 * @event module:core/base/tuning_components~TunableWidget#showDetails		
		 */

		/**
		 * This event is fired when the tunable component does not require to 
		 * the additional information displayed.
		 *
		 * @event module:core/base/tuning_components~TunableWidget#hideDetails		
		 */

		/**
		 * This event is fired when the user has clicked on the tunable component.
		 *
		 * @event module:core/base/tuning_components~TunableWidget#click	
		 */

		/**
		 * This event is fired when the user has changed the value of the tunable.
		 *
		 * @param {number} value - The current value of the widget
		 * @param {number} prevValue - The previous value of the widget
		 * @param {object} meta - The metadata of the tunable widget
		 * @event module:core/base/tuning_components~TunableWidget#valueChanged	
		 */

		/**
		 * This event is fired when the user requested more information regarding the 
		 * observable component (typically this appears when the user leaves the mouse for
		 * a couple of milliseconds on the tile)
		 *
		 * @param {object} meta - The metadata of the observable widget to show more details for
		 * @event module:core/base/tuning_components~ObservableWidget#showDetails		
		 */

		/**
		 * This event is fired when the observable component does not require to 
		 * the additional information displayed.
		 *
		 * @event module:core/base/tuning_components~ObservableWidget#hideDetails		
		 */

		/**
		 * This event is fired when the user has clicked on the observable component.
		 *
		 * @event module:core/base/tuning_components~ObservableWidget#click	
		 */

		////////////////////////////////////////////////////////////

		// Expose tuning components
		var tuningComponents = {
			'TunableWidget'		: TunableWidget,
			'TuningPanel'		: TuningPanel,
			'ObservableWidget'	: ObservableWidget,
		};

		return tuningComponents;

	}
);
