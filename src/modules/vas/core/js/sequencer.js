
define(["core/util/event_base"], 

	function(EventBase) {

		/**
		 * @class Sequencer
		 */
		var Sequencer = function() {
			EventBase.apply(this);
		};

		// Subclass from EventBase
		Sequencer.prototype = Object.create( EventBase.prototype );

		// Return sequencer instance
		return new Sequencer();

	}

);