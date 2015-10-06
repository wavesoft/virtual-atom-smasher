define(

	// Dependencies
	["jquery", "vas/core/registry","vas/core/base/data_widget" ], 

	/**
	 * This is the default data widget for observable body description
	 *
 	 * @exports vas-basic/common/popup/tab/observable_desc
	 */
	function($, R, DataWidget) {

		/**
		 * The default observable description data visualization
		 *
		 * @class
		 * @registry popup.tab.observable_desc
	 	 * @thumbnail doc/Thumbnails/infoblock.observable.png
	 	 * @augments module:core/base/data_widget~DataWidget
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
		R.registerComponent( 'popup.tab.observable_desc', DataVizObservable, 1 );

	}

);