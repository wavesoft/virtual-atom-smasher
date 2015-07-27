define(

	// Dependencies

	[ "jquery", "mathjax", "sha1", "ccl-tracker", "isotope",
	  "vas/core/registry", "vas/core/ui", "vas/core/db", "vas/core/base/component", "vas/core/apisocket", "vas/core/liveq/Calculate",
	  "text!vas/basic/tpl/overlay/histograms.html"
	], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function($, MathJax, SHA1, Analytics, Isotope,
		     R, UI, DB, Component, APISocket, Calculate,
		     tpl) {

		/**
		 * The default tunable body class
		 */
		var OverlayHistograms = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			hostDOM.addClass("histograms-overlay");
			this.isVisible = false;

			// Load view template and plutins
			this.loadTemplate(tpl);
			this.renderView();

			//
			// We are never going to re-draw the UI,
			// therefore we can use .select() without 
			// callback in order to get the DOM elements
			// we are interested in
			//
			this.elmHistoContainer = this.select(".histo-container");
			this.elmDescHeader = this.select(".histo-name");
			this.elmDescDesc = this.select(".histo-desc");
			this.elmDescCorrelations = this.select(".histo-correlations");
			this.elmDescFrame = this.select(".histo-fit-group");
			this.elmDescFit = this.select(".histo-fit");
			this.elmDescFitDetails = this.select(".histo-fit-details");
			this.elmRightPanel = this.select(".right");
			this.elmRightFooter = this.select(".right-footer");
			this.elmTopNavbar = this.select(".top .nav");

			// Array of histogram objects
			this.histograms = [];
			this.histogramIndex = {};
			this.selectedHistogram = "";

			// Initialize isotope layout mechanism
			this.isotopeContainer = $('<div></div>').appendTo( this.elmHistoContainer );
			this.isotopeLayout = new Isotope(this.isotopeContainer[0], {
				itemSelector: '.histogram',
				layoutMode: 'masonry',
				masonry: {
				  columnWidth: 132
				},
				getSortData: {
				    // Return weight
				    weight: (function( itemElem ) {
				    	var hid = $(itemElem).data("hid"),
				    		record = this.histogramIndex[hid],
				    		fit = record.fit ? record.fit[0] : 0;
				    	// Icons have bigger weight
				    	if ($(itemElem).hasClass("histo-icon")) {
				    		fit += 10000;
				    	}
				    	return fit;
				    }).bind(this)
				}
			});

			// Bind DOM events
			var self = this;
			this.elmTopNavbar.find("li").click(function() {
				// Update filter selection
				self.updateFilterSelection( this );
			})

			// Currently active filter
			this.filter = "all";

			// A unique checksum ID for the current set of histograms
			this.checksumID = "";

		};

		// Subclass from ObservableWidget
		OverlayHistograms.prototype = Object.create( Component.prototype );

		/**
		 * Return true if the histogram with the specified ID is visible
		 */
		OverlayHistograms.prototype.isHistogramVisible = function( hid ) {

			// Require 'hid'
			if (!hid) return false;

			// Get record
			var	record = this.histogramIndex[hid];
			if (!record) return false;

			// Test fit
			var fit = record.fit ? record.fit[0] : 1000000.0;
			if (this.filter == "all") {
				return true;
			} else if (this.filter == "bad") {
				return (fit > 4.0);
			} else if (this.filter == "good") {
				return (fit <= 4.0);
			} else {
				return false;
			}
		}

		/**
		 * Update the filter selection
		 */
		OverlayHistograms.prototype.updateFilterSelection = function( elm ) {
			var element = $(elm);

			// Select element
			this.elmTopNavbar.find("li").removeClass("selected");
			element.addClass("selected");

			// Update filter
			this.filter = element.data("filter")
			this.updateLayout();

		}

		/**
		 * Undefine description panel
		 */
		OverlayHistograms.prototype.resetDescription = function() {

			// Hide right footer
			this.elmRightFooter.hide();

			// Reset text
			this.elmDescHeader.text("Select a histogram");
			this.elmDescDesc.html("<p>Please select a histogram to see more details</p>");

		}

		/**
		 * Update layout 
		 */
		OverlayHistograms.prototype.updateLayout = function( reloadItems ) {

			// Reload items if requested
			if (reloadItems) {
				this.isotopeLayout.reloadItems();
			}

			// Re-arrange by weight
			var self = this;
			this.isotopeLayout.arrange({
				sortBy: 'weight',
				filter: function( element ) {
					return self.isHistogramVisible( $(this).data("hid") );
				}
			});

			// Check if this action will hide the active item
			if (this.selectedHistogram && !this.isHistogramVisible(this.selectedHistogram)) {

				// Get histogram
				var record = this.histogramIndex[this.selectedHistogram];
				if (record) {
					record.dom.removeClass("selected");
				}
				// Deactivate
				this.selectedHistogram = "";

				// Reset description
				this.resetDescription();

			}

		}

		/**
		 * Update the description panel
		 */
		OverlayHistograms.prototype.updateDescription = function( record ) {
			var chi2fit = record.fit,
				status_msg, status_cls;

			// Check on which scale is the fit
			if (chi2fit[0] < 1) { // 1 sigma
				status_msg = "Perfect Match";
				status_cls = "perfect";
			} else if (chi2fit[0] < 4) { // 2 sigma
				status_msg = "Good Match";
				status_cls = "good";
			} else if (chi2fit[0] < 9) { // 3 sigma
				status_msg = "Fair Match";
				status_cls = "average";
			} else {
				status_msg = "Bad Match";						
				status_cls = "bad";
			}

			// Update fit details
			this.elmDescFrame.attr("class", "histo-fit-group "+ status_cls);
			this.elmDescFit.text(status_msg);
			this.elmDescFitDetails.html(
					'<div><strong>Events:</strong> ' + record.nevts + '</div>' + 
					'<div><strong>Error:</strong> ' + chi2fit[0].toFixed(2) + ' ± ' + chi2fit[1].toFixed(2) + '</div>'
				);

			// Update description
			this.elmDescCorrelations.empty();
			if (!record.obs) {
				// Missing observable details
				this.elmDescHeader.text(id);
				this.elmDescDesc.text("(Description is missing)");
			} else {

				// Update observable details
				this.elmDescHeader.html( record.obs.title );
				this.elmDescDesc.html( record.obs.desc );

				// Add correlations
				if (record.obs.correlations) {
					this.elmDescCorrelations.append($('<div class="correlation-label">This historam is sensitive to:</div>'));
					for (var i=0; i<record.obs.correlations.length; i++) {
						var c = record.obs.correlations[i],
							elmHandleTimer = null,
							elm = $('<div class="correlation"></div>')
								.text( c.tunable )
								.appendTo( this.elmDescCorrelations );

					}
				}

				// (Re)typeset math
				MathJax.typeset( this.elmRightPanel );

			}

			// Show right footer
			this.elmRightFooter.show();

		}

		/**
		 * Select a particular histogram 
		 */
		OverlayHistograms.prototype.selectHistogram = function( id ) {

			// Deselect currently selected histogram
			if (this.selectedHistogram) {
				// Get histogram
				var record = this.histogramIndex[this.selectedHistogram];
				if (record) {
					record.dom.removeClass("selected");
				}
				// Deactivate
				this.selectedHistogram = "";
			}

			// If we have no ID, just deselect
			if (!id) return;

			// Activate the specified ID
			var record = this.histogramIndex[id];
			if (!record) {
				console.warn("Unable to select missing histogram #"+id);
				return;
			}

			// Activate
			this.selectedHistogram = id;
			record.dom.addClass("selected");

			// Update description
			this.updateDescription( record );

		}

		/**
		 * Add a new histogram 
		 */
		OverlayHistograms.prototype.histoCreate = function( id, histogram, obsDetails ) {

			// Create histogram data visualization
			var domHisto = $('<div class="histogram histo-icon"></div>').appendTo( this.isotopeContainer ),
				domLabelName = $('<div class="histo-label-name"></div>').appendTo( domHisto ),
				domLabelFit =  $('<div class="histo-label-fit"></div>').appendTo( domHisto ),
				domPlotHost = $('<div class="histo-plot-host"></div>').appendTo( domHisto ),
				domBtnToggle = $('<div class="histo-btn-expand"></div>').appendTo( domHisto ),
				hist = R.instanceComponent("dataviz.histogram_combined", domPlotHost);

			// Select histogram upon clicking on it
			domHisto.data("hid", id);
			domHisto.click((function(histoID) {
				return function(e) {
					e.preventDefault();
					e.stopPropagation();

					if (histoID == this.selectedHistogram) {
						// Perform toggling if already focused
						domBtnToggle.click();
					} else {
						// Otherwise focus
						this.selectHistogram(histoID);
					}
				}				
			})(id).bind(this));

			// Bind toggle button events
			domBtnToggle.click((function(histoID) {
				return function(e) {
					e.preventDefault();
					e.stopPropagation();

					if (domHisto.hasClass("histo-icon")) {
						domHisto.removeClass("histo-icon");
						domBtnToggle.addClass("expanded")
					} else {
						domHisto.addClass("histo-icon");
						domBtnToggle.removeClass("expanded")
					}

					// Re-arrange items on isotope upon completion
					setTimeout((function() {
						this.updateLayout(true);
					}).bind(this), 10);

				};
			})(id).bind(this));

			// Prepare record
			var record = {
				'id'   : id,			// Histogram ID
				'dom'  : domHisto,		// DOM Element
				'com'  : hist,			// Histogram Component
				'obs'  : obsDetails,	// Observable details
				'fit'  : null,			// Current chi-squared fit
				'nevts': null,			// Number of events
				'domfl': domLabelFit,	// Fit label DOM element
			};

			// Store on index and array
			this.histograms.push(record);
			this.histogramIndex[id] = record;

			// Add on isotope
			this.isotopeLayout.appended( domHisto );

			// Update details
			if (obsDetails) {
				domLabelName.html(record.obs.title);
				MathJax.typeset( domLabelName );
			}

		}

		/**
		 * Update histogram data
		 */
		OverlayHistograms.prototype.histoUpdate = function( id, histogram ) {
			var record = this.histogramIndex[id];

			// Update histogram
			record.com.onUpdate( histogram );

			// Update record details
			record.fit = Calculate.chi2WithError( histogram.data, histogram.ref.data );
			record.nevts = histogram.data.nevts;

			// Check on which scale is the fit
			var status_cls;
			if (record.fit[0] < 1) { // 1 sigma
				status_cls = "perfect";
			} else if (record.fit[0] < 4) { // 2 sigma
				status_cls = "good";
			} else if (record.fit[0] < 9) { // 3 sigma
				status_cls = "average";
			} else {
				status_cls = "bad";
			}

			// Update DOM metadata for Isotope layouting
			record.dom.data("fit", record.fit[0]);
			record.dom.data("fit-class", status_cls);

			// Update class
			record.dom.removeClass( "histogram histo-fit-perfect histogram histo-fit-good histogram histo-fit-average histogram histo-fit-bad" );
			record.dom.addClass( "histogram histo-fit-"+status_cls );

			// If that's focused, update description
			if (this.selectedHistogram == id)
				this.updateDescription( record );

			// Update fit label
			record.domfl.text( record.fit[0].toFixed(2) + ' ± ' + record.fit[1].toFixed(2) );

		}

		/**
		 * Delete a histogram 
		 */
		OverlayHistograms.prototype.histoDelete = function( id ) {

			// Deselect histogram if this is selected
			if (this.selectedHistogram == id) {
				this.selectHistogram( false );
				this.resetDescription();
			}

			// Lookup record
			var record = this.histogramIndex[id];
			if (!record) return;

			// Delete DOM
			record.dom.remove();

			// Delete record
			var index = this.histograms.indexOf(record);
			if (index >= 0) this.histograms.splice(index,1);
			delete this.histogramIndex[id];

		}

		/**
		 * Reposition flashDOM on resize
		 */
		OverlayHistograms.prototype.onHistogramsDefined = function( histograms ) {

			// Keep a reference with the histograms processed
			var processed = { },
				newHistograms = [],
				newHistoIDs = [];

			// Start by adding missing histograms
			for (var i=0; i<histograms.length; i++) {
				var id = histograms[i].id;
				// Mark as processed
				processed[id] = true;
				// Add missing histogram
				if (this.histogramIndex[id] == undefined) {
					// Keep the ID and the reference of the histogram
					// for post-processing
					newHistograms.push( histograms[i] );
					newHistoIDs.push( id );
				} 
				// Update existing histograms
				else {
					this.histoUpdate( id, histograms[i] );
				}
			}

			// Delete other missing histograms
			for (var i=0; i<this.histograms.length; i++) {
				var id = this.histograms[i].id;
				// Delete IDs that were not processed
				if (processed[id] == undefined)
					this.histoDelete(id);
			}

			// If we have new histograms, query database to 
			// fetch details and build histograms
			if (newHistograms.length > 0) {

				// Query observable information 
				var Account = APISocket.openAccount();
				Account.getObservableDetails( newHistoIDs, (function(observables) {

					// Create/update every histogram
					for (var i=0; i<newHistograms.length; i++) {
						var id = newHistograms[i].id;
						// Add histogram
						this.histoCreate( id, newHistograms[i], observables[id] );
						// Update histogram
						this.histoUpdate( id, newHistograms[i] );
					}

					// Re-run Isotope layout
					this.isotopeLayout.layout();
					this.updateLayout(true);

				}).bind(this));

			} else {

				// Update sort data
				// Re-arrange isotope items
				this.updateLayout(true);

			}

			// Calculate a hash for analytics details
			var hashData = "", analyticsHistograms = [];
			for (var i=0; i<histograms.length; i++) {
				// Collect ID for checksum calculation
				if (hashData != "") hashData += ";";
				hashData += histograms[i].id;
				analyticsHistograms.push( histograms[i].id );
			}

			// Store analytics hash id
			this.checksumID = SHA1.hash( hashData );

			// Fire analytics
			Analytics.restartTimer("observables")
			Analytics.fireEvent("observables.shown", {
				'id': this.checksumID,
				'histos': analyticsHistograms
			});

		}


		/**
		 * Reposition flashDOM on resize
		 */
		OverlayHistograms.prototype.onWillShow = function( cb ) {

			// Resize histograms to update their UI
			for (var i=0; i<this.histograms.length; i++) {
				var com = this.histograms[i].com,
					w = com.hostDOM.width(),
					h = com.hostDOM.height();
				com.onResize(w,h);
				com.onWillShow(function() {
					com.onShown();
				});
			}

			// Assume shown
			this.isVisible = true;

			// Reset
			this.resetDescription();

			// Fire shown
			cb();

		}

		/**
		 * Reposition flashDOM on resize
		 */
		OverlayHistograms.prototype.onShown = function() {

			// Update layout upon shown
			this.updateLayout();

		}


		/**
		 * Histograms hidden
		 */
		OverlayHistograms.prototype.onHidden = function() {
			if (!this.isVisible) return;

			// Fire analytics
			Analytics.fireEvent("observables.hidden", {
				"id": this.checksumID,
				"time": Analytics.stopTimer("observables")
			});

		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.histograms', OverlayHistograms, 1 );

	}

);