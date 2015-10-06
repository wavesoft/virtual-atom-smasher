
/**
 * [core/main] - Core initialization module
 */
define(["vas/config", "core/util/event_base"], 

	function(config, EventBase) {

		/**
		 * Global scope where system-wide resources can be placed.
		 *
		 * @exports vas-core/global
		 */
		var Global = { };

		/**
		 * System-wide events
		 * @type {module:vas-core/util/event_base~EventBase}
		 */
		Global.events = new EventBase();

		// Return the global scope
		return Global;
	}

);