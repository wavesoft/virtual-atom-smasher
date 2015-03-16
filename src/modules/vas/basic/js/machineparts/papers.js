define(

	// Dependencies

	["jquery", "quill", "vas/core/registry", "vas/core/db", "vas/core/user", "vas/core/base/view", "core/analytics/analytics",
	 "text!vas/basic/tpl/machine/papers.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/paper
	 */
	function(config, Quill, R, DB, User, ViewComponent, Analytics, tplContent) {

		/**
		 * The default tunable body class
		 */
		var PaperMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-papers");

			// Load template
			this.loadTemplate( tplContent );
			this.setViewData( 'showPapers', true );

			// Setu properties
			this.focusedPaper = null;
			this.quill = null;
			this.tunables = [];
			this.paperEditable = false;
			this.tunableValues = [];

			// Handle DO URLs
			this.handleDoURL('searchPapers', (function() {

				// Define terms
				this.setViewData( 'terms', this.forms.search.terms );

				// Request paper reload
				this.reloadPapers({
					'terms': '%'+this.forms.search.terms+'%'
				});

			}).bind(this));
			this.handleDoURL('viewPaper', (function(id) {

				// Get paper details
				User.readPaper(id, (function(paper) {

					this.paperEditable = paper['editable'];
					this.displayPaper( paper );

				}).bind(this));

			}).bind(this));
			this.handleDoURL('closePaper', (function() {

				// If this is editable, save
				if (this.paperEditable && this.focusedPaper) {
					// Update user paper
					User.updatePaper(this.focusedPaper, {
						'title': this.forms.paper.title,
						'body': this.quill.getHTML(),
					});
				}

				// Display list
				this.displayList();

			}).bind(this));
			this.handleDoURL('changeValue', (function(parameter, value) {

				this.trigger('changeValue', parameter, value);

			}).bind(this));
			this.handleDoURL('applyAll', (function() {

				// Apply all values to tunables
				for (var i=0; i<this.tunables.length; i++) {
					this.trigger('changeValue', this.tunables[i].name, this.tunables[i].value);
				}

			}).bind(this));
			this.handleDoURL('newPaper', (function() {

				// Create new paper
				User.createPaper((function(paper) {
					paper.editable = true;
					this.displayPaper(paper);
				}).bind(this));

			}).bind(this));
			this.handleDoURL('deletePaper', (function() {

				// Require a focus
				if (!this.focusedPaper) return;

				if (window.confirm("This action is not undoable. This will delete this paper and it's results!")) {
					User.deletePaper(this.focusedPaper, (function() {
						this.displayList();
					}).bind(this));
				}

			}).bind(this));

			// Start Quill on possible editable text areas
			this.select('.quill', (function(dom) {
				this.quill = new Quill(dom.get(0),{
					theme: 'snow'
				});
			}).bind(this));

		};

		// Subclass from ObservableWidget
		PaperMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Undefine paper and show papers screen
		 */
		PaperMachinePart.prototype.displayList = function( ) {
			// Undefine paper
			this.paper = null;
			this.setViewData('paper', false);
			this.reloadPapers({
				'terms': '%'+this.getViewData("terms")+'%'
			}, false, 'fade');

			// Trigger user event
			var paperTimer = Analytics.stopTimer("paper-time");
			User.triggerEvent("paper.hide", {
				'paper': this.focusedPaper,
				'time': paperTimer
			});
			
			// Unset focus
			this.focusedPaper = null;
		}

		/**
		 * Define a paper and show it's screen
		 */
		PaperMachinePart.prototype.displayPaper = function( paper ) {

			// Update tunables
			this.paper = paper;
			this.applyTunables();

			// Define paper
			this.setViewData('paper', paper);
			this.renderView('fade');

			// Set focus
			this.focusedPaper = paper['id'];

			// Trigger user event
			Analytics.restartTimer("paper-time");
			User.triggerEvent("paper.show", {
				'paper': paper['id']
			});

		}

		/**
		 * Render view before show
		 */
		PaperMachinePart.prototype.reloadPapers = function( query, cb, transition ) {

			// Request papers
			User.getPapers(query, (function(papers) {

				// Update papers and render view
				this.setViewData('papers', papers);
				this.renderView(transition);

				// Fire callbacks
				if (cb) cb();

			}).bind(this));

		}

		/**
		 * Update tunables
		 */
		PaperMachinePart.prototype.applyTunables = function() {
			if (!this.tunables) return;

			// Get paper values
			for (var i=0; i<this.tunables.length; i++) {
				var t = this.tunables[i],
					v = this.tunables[i].default;
				
				// Update value
				if (this.paper) {
					if (this.paper.tunableValues[t.name] !== undefined)
						v = this.paper.tunableValues[t.name];
				}

				// Check if this value is the same to user values
				var match = "equal";
				if (this.tunableValues[t.name] != undefined) {
					var refValue = Number( this.tunableValues[t.name] ),
						distScale = Math.abs(refValue - v) / Math.abs(t.min - t.max);

					// Handle value differences
					if (refValue == v) {
						match = "equal";
					} else if (distScale < 1/5) {
						match = "close";
					} else {
						match = "far";
					}
				}

				// Update additional parameters
				this.tunables[i]['match'] = match;
				this.tunables[i]['value'] = Number(v).toFixed( t.dec );
				this.tunables[i]['cssname'] = t['name'].replace(":","_");
			}
			this.setViewData('tunables', this.tunables);
		}

		/**
		 * Update machine details
		 */
		PaperMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );
			this.setViewData( 'terms', "" );

		}

		/**
		 * Render view before show
		 */
		PaperMachinePart.prototype.onWillShow = function( cb ) {

			// Reload papers (and re-render view)
			// When done, fire callback
			this.reloadPapers({}, cb);

		}

		/**
		 * User focused on tunable
		 */
		PaperMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		PaperMachinePart.prototype.onTunablesDefined = function( tunables ) {

			// Update tunables
			this.tunables = tunables;

			// Apply tunables
			this.applyTunables();
			this.renderView();

		};

		/**
		 * Define the values on the tunables
		 */
		PaperMachinePart.prototype.onTuningValuesDefined = function( values ) {

			// Update tunable values
			this.tunableValues = values;

			// Apply changes
			this.applyTunables();
			this.renderView();

		};

		/**
		 * A tuning parameter value has changed
		 */
		PaperMachinePart.prototype.onTuningValueChanged = function( parameter, value ) {	

			// Update & apply tunables
			this.tunableValues[parameter] = value;
			this.applyTunables();

			// Update tunables in the UI
			for (var i=0; i<this.tunables.length; i++) {
				var t = this.tunables[i],
					val = this.select("a[name="+t.cssname+"]");
				if (!val) continue;

				// Update value and class
				val.find(".value").text( t.value );
				val.attr("class", "match-" + t.match );

			}

		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.paper', PaperMachinePart, 1 );

	}

);