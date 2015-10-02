define(

	// Dependencies
	["jquery", "d3", "vas/core/registry","vas/core/base/data_widget", "vas/core/liveq/Calculate" ], 

	/**
	 * This is the default data widget for visualizing a historgram
	 *
 	 * @exports vas-basic/common/dataviz/histogram_combined
	 */
	function(config, d3, R, DataWidget, Calculate) {

		/**
		 * This components visualizes a histogram composed of a ratio plot and a full plot.
		 *
		 * @class
		 * @registry dataviz.histogram.combined
		 */
		var CombinedHistogram = function(hostDOM) {

			// Initialize widget
			DataWidget.call(this, hostDOM);
			hostDOM.addClass("back-white dv-combined");

			// Local properties
			this.subPlots = [];

			// Register plot and ratio
			this.registerSubPlot( "dataviz.histogram.full",  	 0, 0,     "100%", "60%" );
			this.registerSubPlot( "dataviz.histogram_ratio.full", 0, "60%", "100%", "36%" );

		}

		// Subclass from ObservableWidget
		CombinedHistogram.prototype = Object.create( DataWidget.prototype );

		/**
		 * Register a histogram with the specified coordinates
		 * @private
		 */
		CombinedHistogram.prototype.registerSubPlot = function( className, x, y, w, h ) {

			// Create size info
			var sizeInfo = {
				'left': x,
				'top': y,
				'width': w,
				'height': h
			};

			// Create plot DOM
			var plotDom = $('<div class"dv-subplot"></div>')
							.css(sizeInfo)
							.appendTo(this.hostDOM);

			// Instance component
			var plotCom = R.instanceComponent(className, plotDom);
			if (!plotCom) {
				plotDom.remove();
				console.error("Could not instantiate sub-plot component ", className);
				return;
			}

			// Register component
			this.subPlots.push( plotCom );

			// Forward events
			this.forwardVisualEvents( plotCom, sizeInfo );
			this.forwardEvents(plotCom, [
					"onUpdate",
					"onMetaUpdate"
				]);

		}

		// Store histogram data visualization on registry
		R.registerComponent( 'dataviz.histogram.combined', CombinedHistogram, 1 );

	}

);