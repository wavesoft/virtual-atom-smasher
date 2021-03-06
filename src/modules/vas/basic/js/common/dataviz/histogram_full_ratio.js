define(

	// Dependencies
	["jquery", "d3", "vas/core/registry","vas/core/base/data_widget", "vas/core/liveq/Calculate" ], 

	/**
	 * This is the default data widget for visualizing a historgram
	 *
 	 * @exports vas-basic/common/dataviz/histogram_full_ratio
	 */
	function(config, d3, R, DataWidget, Calculate) {

		/**
		 * The default observable body class
		 *
		 * @class
		 * @registry dataviz.histogram_ratio.full
	 	 * @thumbnail doc/Thumbnails/dataviz.histogram_fullratio.png
	 	 * @augments module:vas-core/base/data_widget~DataWidget
	 	 * @css vas/basic/css/components/common/dataviz/dataviz.less
		 */
		var DataVizHistogram = function(hostDOM) {

			// Initialize widget
			DataWidget.call(this, hostDOM);

			// Prepare margin info
			this.margin = {
				'left': 40,
				'top': 10,
				'bottom': 10,
				'right': 10,
				'title': 5
			};
			this.legend = {
				'bullet': 10,
				'height': 16,
				'titleMargin': 5,
			};
			this.errorBars = {
				'bulletSize' : 2
			}

			// Prepare histogram SVG host
			this.svg = d3.select( this.hostDOM[0] )
						     .append("svg")
						     .attr("class", "dv-plot");
			this.svgPlot = this.svg.append("g")
							 .attr("transform", "translate("+this.margin.left+","+this.margin.top+")");
			this.svgData = this.svgPlot.append("g")
							.attr("class", "data");
			this.svgLegend = this.svgPlot.append("g")
							.attr("class", "legend");

		};

		// Subclass from ObservableWidget
		DataVizHistogram.prototype = Object.create( DataWidget.prototype );

		///////////////////////////////////////////////////////////////////////////////
		////                         UTILITY FUNCTIONS                             ////
		///////////////////////////////////////////////////////////////////////////////

		/**
		 * A Y-scale that protects against zero values
		 */
		DataVizHistogram.prototype.yScaleNonZero = function(y) { 
			if (y == 0) {
				return this.height - this.margin.top - this.margin.bottom;
			} else {
				return this.yScale(y);
			}
		}

		/**
		 * Calculate how many points are inside each region and find
		 * the one with the smallest number of points.
		 *
		 * This function will return the index of the region array specified.
		 *
		 * @param {array} areas - The array of the region boundaries to check (format: [x,y,w,h])
		 */
		DataVizHistogram.prototype.getLeastUsedRegion = function(areas, plots) {

			// Initialize usage array
			var usage = [ ];
			for (var i=0; i<areas.length; i++) {
				usage.push(0);
			}

			// Iterate over the histograms
			for (var j=0; j<plots.length; j++) {
				var histo = plots[j].data;
				// Run over bins and get point positions
				for (var i=0; i<histo.length; i++) {
					// Get position
					var x = this.xScale(histo[i][3]),
						y = this.yScaleNonZero(histo[i][0]);

					// Hit-test areas
					for (var k=0; k<areas.length; k++) {
						if ( (x >= areas[k][0]) && (x <= (areas[k][0]+areas[k][2])) &&
							 (y >= areas[k][1]) && (y <= (areas[k][1]+areas[k][3])) ) {
							usage[k] += 1;
							break;
						}
					}
				}
			}


			// Find minimum
			var min=usage[0], min_index=0;
			for (var i=0; i<usage.length; i++) {
				if (usage[i]<min) {
					min=usage[i];
					min_index=i;
				}
			}

			// Return index
			return min_index;

		}

		/**
		 * Regenerate histogram data
		 */
		DataVizHistogram.prototype.regen = function() {

			// Values are an array of: [y, y+, y-, x, x+, x-]
			// If we have no data, plot no data points
			if ((this.data != null) && !this.data.empty) {

				// ------------------------------------------
				//  Data Definition
				// ------------------------------------------

				// Calculate bounds
				var bounds = this.data.getBounds(),
					xMin  = bounds[0], xMax  = bounds[1],
					yMin  = 0.5, yMax  = 1.5,
					yZero = bounds[4],
					width = this.width - this.margin.left - this.margin.right,
					height = this.height - this.margin.top - this.margin.bottom;

				// Check what kind of scale do we use
				var xScaleClass = d3.scale.linear,
					yScaleClass = d3.scale.linear;

				// Prepare X Axis
				this.xScale = xScaleClass()
					.range([0, width])
					.domain([xMin, xMax])
					.clamp(true);
				this.xAxis = d3.svg.axis()
					.scale(this.xScale)
					.orient("bottom");

				// Prepare Y Axis
				this.yScale = yScaleClass()
					.range([height, 0])
					.domain([yMin, yMax])
					.clamp(true);
				this.yAxis = d3.svg.axis()
					.scale(this.yScale)
					.tickValues([0.5, 1.0, 1.5])
					.orient("left");

				// Prepare plot configuration
				var plots = [
					{
						'id'	 : 'plot-sim',
						'legend' : 'Current aggreement',
						'color'  : '#0066FF',
						'data'   : this.data.values,

						// Get the 1-sigma error band
						'sigma'  : this.ratioBand.values
					}
				];

				// ------------------------------------------
				//  Graphic Definitions
				// ------------------------------------------

				var self = this;
				var pathLine = d3.svg.line()
					.x(function(d,i) { return self.xScale(d[3]); })
					.y(function(d,i) { return self.yScaleNonZero(d[0]); });

				// ------------------------------------------
				//  Graphic Design - Plots
				// ------------------------------------------

				// Loop over plots
				for (var j=0; j<plots.length; j++) {
					var plot = plots[j];

					// Access plot's group
					var group = this.svgData.select("g.plot#"+plot.id);
					if (group.empty()) {
						group = this.svgData.append("g")
							.attr("class", "plot")
							.attr("id", plot.id);
						group.append("g")
							.attr("class", "plot-back");
						group.append("g")
							.attr("class", "plot-fore");
					}

					// Access plot's group
					var groupBack = group.select("g.plot-back"),
						groupFore = group.select("g.plot-fore");

					// ==============
					//  1-sigma band
					// ==============

					var record = groupBack.selectAll("path.plot-band")
									.data(plot.sigma);

					// Enter
					record.enter()
						.append("rect")
							.attr("class", "plot-band");
							//.style("fill", plot.color);

					// Update
					record
						.attr("x", function(d,i){
							return self.xScale( d[3] - d[5] );
						})
						.attr("y", function(d,i){
							return self.yScale( d[0] + d[1] );
						})
						.attr("width", function(d,i) {
							return self.xScale( d[3] + d[4] ) - 
								   self.xScale( d[3] - d[5] );
						})
						.attr("height", function(d,i) {
							return self.yScale( d[0] - d[2] ) -
								   self.yScale( d[0] + d[1] );
						});
						//.style("fill", plot.color);

					// Delete
					record.exit()
						.remove();

					// =============
					//     Plots 
					// =============

					// Access D3 record for this element
					var record = groupFore.selectAll("path.plot-line")
									.data([plot.data]);

					// Enter
					record.enter()
						.append("svg:path")
							.attr("class", "plot-line")
							.attr("stroke", plot.color);

					// Update
					record.attr("d", pathLine)
							.attr("stroke", plot.color);

					// Delete
					record.exit()
						.remove();

					// =============
					//  Data Points
					// =============

					var record = group.selectAll("path.plot-bullet")
									.data(plot.data);

					// Enter
					record.enter()
						.append("svg:path")
							.attr("class", "plot-bullet")
							.attr("stroke", plot.color);

					// Update
					record
						.attr("transform", function(d,i){
							return "translate(" + self.xScale(d[3]) + "," + self.yScaleNonZero(d[0]) + ")"
						})
						.attr("d", function(d,i) {
							var h = self.yScale( d[0] - d[2] ) - self.yScale( d[0] + d[1] );

							// Path for the bullet
							var D_ERR= "M0,-"+(h/2)+
										"L0,"+(h/2)+
										"Z";
							return  D_ERR;

						})
						.attr("stroke", plot.color);					

				}

				// ------------------------------------------
				//  Graphic Design - Axes
				// ------------------------------------------

				// Create the X and Y axis
				if (!this.xAxisGraphic)
					this.xAxisGraphic = this.svgPlot.append("g")
					    .attr("class", "x axis");
				if (!this.yAxisGraphic)
					this.yAxisGraphic = this.svgPlot.append("g")
					    .attr("class", "y axis");

				// Render/Update them
				this.xAxisGraphic
				    .attr("transform", "translate(0,"+this.yScale(1)+")")
					.call(this.xAxis);
				this.yAxisGraphic
					.call(this.yAxis);

				// ------------------------------------------
				//  Graphic Design - Legend
				// ------------------------------------------

				//
				// Find in which region to place the legend.
				// The placeAt gets one of the following values:
				//
				//  +---+---+
				//  | 0 | 1 |
				//  +---+---+
				//  | 2 | 3 |
				//  +---+---+
				//
				var midW = width/2, midH = height/2,
					lb = this.legend.bullet,
					placeAt = this.getLeastUsedRegion([
							[0,0,midW,midH], [midW,0,midW,midH],
							[0,midH,midW,midH], [midW,midH,midW,midH]
						], plots);

				// Calculate offsets, based on the area we should place the legend
				var rightAlign = false, ofsX = 0, ofsY = 0, yDirection = 1;
				if (placeAt == 0) {
					ofsX = this.legend.titleMargin*2 + 20;
					ofsY = 10;
				} else if (placeAt == 1) {
					rightAlign = true;
					ofsX = width;
					ofsY = 10;
				} else if (placeAt == 2) {
					yDirection = -1;
					ofsX = this.legend.titleMargin*2 + 20;
					ofsY = height - this.legend.titleMargin*2 - 10;
				} else if (placeAt == 3) {
					rightAlign = true;
					yDirection = -1;
					ofsX = width;
					ofsY = height - this.legend.titleMargin*2 - 10;
				}

				// Set legend alignment
				this.svgLegend
					.attr("transform", "translate("+ofsX+","+ofsY+")");

				// Collect legends
				var legends = [];
				for (var i=0; i<plots.length; i++) {
					legends.push({
						'text': plots[i].legend,
						'color': plots[i].color
					})
				}
				legends.push({
					'text': 'Goal',
					'color': '#EE3'
				});

				// Open data record
				var record = this.svgLegend.selectAll("g.legend-entry").data(legends);

				// Enter
				var newGroups = record.enter()
					.append("g")
						.attr("class", "legend-entry");
					if (rightAlign) {
						newGroups.append("path")
							.attr("d", "M"+(-lb)+","+(-lb/2)
									  +"L0,"+(-lb/2)
									  +"L0,"+(lb/2)
									  +"L"+(-lb)+","+(lb/2)
									  +"Z" );
						newGroups.append("text")
							.attr("transform", "translate("+(-lb-4)+",0)")
							.style("dominant-baseline", "middle")
							.style("text-anchor", "end" );
					} else {
						newGroups.append("path")
							.attr("d", "M"+lb+","+(-lb/2)
									  +"L0,"+(-lb/2)
									  +"L0,"+(lb/2)
									  +"L"+lb+","+(lb/2)
									  +"Z" );
						newGroups.append("text")
							.attr("transform", "translate("+(lb+4)+",0)")
							.style("dominant-baseline", "middle")
							.style("text-anchor", "start" );
					}

				// Update
				record
					.attr("transform", function(d,i) { 
						return "translate(0,"+(yDirection*i*self.legend.height)+")"
					});
				record.selectAll("text")
					.text(function(d,i) { return d.text; });
				record.selectAll("path")
					.attr("fill", function(d,i) { 
						return d.color; 
					});

				// Delete
				record.exit()
					.remove();

			}

		}

		///////////////////////////////////////////////////////////////////////////////
		////                          EVENT HANDLERS                               ////
		///////////////////////////////////////////////////////////////////////////////

		/**
		 * Update the histogram with the data given
		 * @param {object} data - The new data to render on the histogram
		 */
		DataVizHistogram.prototype.onUpdate = function( data ) {

			// Prepare data variables
			if (!data) {
				this.data = null;
				this.ratioBand = null;
			} else {
				this.data = Calculate.calculateRatioHistogram( data['data'], data['ref'].data );
				this.ratioBand = Calculate.calculateRatioHistogram( data['ref'].data, data['ref'].data );
			}

			// Regen plot
			this.regen();
			
		}

		/**
		 * Hide histogram when to be hidden
		 * @param {function} cb - Callback to fire when hiding process completed
		 */
		 /*
		DataVizHistogram.prototype.onWillHide = function( cb ) {
			$(this.svg).hide();
			cb();
		}
		*/

		/**
		 * Hide histogram when to be shown
		 * @param {function} cb - Callback to fire when showing process completed
		 */
		 /*
		DataVizHistogram.prototype.onWillShow = function( cb ) {
			$(this.svg).show();
			cb();
		}
		*/

		/**
		 * Update the histogram with the data given
		 * @param {object} data - The new data to render on the histogram
		 */
		DataVizHistogram.prototype.onMetaUpdate = function( widget ) {

		}

		/**
		 * Resize histogram to fit container
		 * @param {int} width - The width of the container
		 * @param {int} height - The height of the container
		 */
		DataVizHistogram.prototype.onResize = function( width, height ) {
			this.width = width;
			this.height = height;

			// Resize SVG
			this.svg
				.attr("width", width)
				.attr("height", height);

			// Regen plot
			this.regen();

		}

		// Store histogram data visualization on registry
		R.registerComponent( 'dataviz.histogram_ratio.full', DataVizHistogram, 1 );

	}

);