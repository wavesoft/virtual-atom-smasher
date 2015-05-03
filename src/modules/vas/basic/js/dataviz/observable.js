define(

	// Dependencies
	["jquery", "vas/core/registry","vas/core/base/data_widget" ], 

	/**
	 * This is the default data widget for observable body description
	 *
 	 * @exports vas-basic/dataviz/observable
	 */
	function($, R, DataWidget) {

		/**
		 * The default observable description data visualization
		 */
		var DataVizObservable = function(hostDOM) {

			// Initialize widget
			DataWidget.call(this, hostDOM);

		};

		// Subclass from ObservableWidget
		DataVizObservable.prototype = Object.create( DataWidget.prototype );

		///////////////////////////////////////////////////////////////////////////////
		////                          EVENT HANDLERS                               ////
		///////////////////////////////////////////////////////////////////////////////

		/**
		 * Update the histogram with the data given
		 * @param {object} data - The new data to render on the histogram
		 */
		DataVizObservable.prototype.onUpdate = function( data ) {

		}

		/**
		 * Update the histogram with the data given
		 * @param {object} data - The new data to render on the histogram
		 */
		DataVizObservable.prototype.onMetaUpdate = function( meta ) {

			// Update description body
			this.hostDOM.empty();
			this.hostDOM.append( $(meta['desc']) );

		}

		// Store histogram data visualization on registry
		R.registerComponent( 'dataviz.observable', DataVizObservable, 1 );

	}

);