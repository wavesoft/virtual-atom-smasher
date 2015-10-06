
define(["core/util/event_base"], 

	/**
	 * This module provides histogram metadata 
	 *
	 * @exports vas-core/data/histogram_meta
	 */
	function(EventBase) {

		/**
		 * Instantiate a new componet
		 *
		 * @class
		 * @classdesc The base Component class. All other components are derrived from this.
		 * @augments module:core/util/event_base~EventBase
		 */
		var HistogramMetadata = function() {

			// Initialize superclass
			EventBase.call(this);

		}
		HistogramMetadata.prototype = Object.create( EventBase.prototype );

		

		return HistogramMetadata;
	}

);