
define(

	// Requirements
	[ 
		"mathjax",
		"vas/core/registry", "vas/core/base/data_widget", "vas/core/liveq/Calculate",
		"text!vas/basic/tpl/observable_point.html"
	],

	/**
	 * Basic version of the jobs screen
	 *
	 * @exports basic/components/simulation/observable_point
	 */
	function( MathJax, R, DataWidget, Calculate, tpl ) {

		/**
		 * @class
		 * @classdesc The circular target in the simulation status screen
		 */
		var ObservableWidget = function( hostDOM ) {
			DataWidget.call(this, hostDOM);

			// Setup class and template
			hostDOM.addClass("observable");
			this.loadTemplate( tpl );
			this.renderView();

		}

		ObservableWidget.prototype = Object.create( DataWidget.prototype );

		/**
		 * Update metadata
		 */
		ObservableWidget.prototype.onMetaUpdate = function( meta ) {

			// Update title (with LaTeX support)
			var title = this.select(".title");
			title.html(meta['short']); MathJax.typeset( title );

		}

		/**
		 * Update data
		 */
		ObservableWidget.prototype.onUpdate = function( histogram ) {

			// Calculate the chi-squared fit (with errors) between
			// the histogram and the reference.
			var chi2fit = Calculate.chi2WithError( histogram.data, histogram.ref.data );

			// Helper to map Chi value 0.0 till 9.0+ like this:
			// 
			// 0.0 - 1.0 = 0% - 25%      log(fit) = 0.0 - 1.0
			// 1.0 - 4.0 = 25% - 50%     log(fit) = 1.0 - 2.0
			// 4.0 - 9.0 = 50% - 75%     log(fit) = 2.0 - 3.0
			// 9.0 - 16.0 = 75% - 100%   log(fit) = 3.0 - 4.0
			//
			var mapPercent = function( fit ) {
				return Math.max( Math.min( Math.sqrt( Math.max(fit, 0) ) * 25, 100 ), 0 );
			};

			// Update labels
			this.select(".label-fit").html( chi2fit[0].toFixed(2) );
			this.select(".label-error").html( "&plusmn;" + chi2fit[1].toFixed(2) );

			// Find uncertainty and value in percentage of the width
			var pMin = mapPercent(chi2fit[0] - chi2fit[1]),
				pMax = mapPercent(chi2fit[0] + chi2fit[1]),
				pVal = mapPercent(chi2fit[0]);

			// Visualise them
			this.select(".circle").css({
				"left": pVal + "%"
			});
			this.select(".errorbar").css({
				"left": pMin + "%",
				"width": (pMax - pMin) + "%"
			});

			// Pick fit color
			this.hostDOM.removeClass("fit-perfect fit-good fit-average fit-bad")
			if (chi2fit[0] < 1) { // 1 sigma
				this.hostDOM.addClass("fit-perfect")
			} else if (chi2fit[0] < 4) { // 2 sigma
				this.hostDOM.addClass("fit-good")
			} else if (chi2fit[0] < 9) { // 3 sigma
				this.hostDOM.addClass("fit-average")
			} else {
				this.hostDOM.addClass("fit-bad")
			}

		}

		// Register jobs screen
		R.registerComponent( "widget.observable_point", ObservableWidget, 1 );


	}

);
