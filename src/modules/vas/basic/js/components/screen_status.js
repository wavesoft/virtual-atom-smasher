

define(

	/**
	 * Dependencies
	 */
	["jquery", "vas/config", "vas/core/registry", "vas/core/base/view",
	 "text!vas/basic/tpl/status.html"],

	/**
	 * Basic version of the home screen
	 *
	 * @exports vas-basic/components/tuning_screen
	 */
	function($, config, R, View, tplStatus) {

		/**
		 * Tuning dashboard screen
		 */
		var StatusScreen = function(hostDOM) {
			View.call(this, hostDOM);

			// Load view template
			hostDOM.addClass("status");
			this.loadTemplate(tplStatus);

			// Reset properties
			this.paperDOMs = [];
			this.buttonDOMs = [];
			this.components = [];
			this.focusedPaper = 0;

			// Register page parts
			var components = [
				[ "profilepart.achievements", 	"Achievements",		"glyphicon glyphicon-tower" 	],
				[ "profilepart.book", 			"Knowledge",		"glyphicon glyphicon-book" 		],
				[ "profilepart.papers", 		"Papers",			"glyphicon glyphicon-education" ],
				[ "profilepart.team", 			"Team",				"glyphicon glyphicon-globe" 	],
				[ "profilepart.user", 			"User Profile",		"glyphicon glyphicon-user" 		],
			];

			// When paper hosts becomes available
			this.select(".paper-host", (function(e) {

				// Reset DOM
				this.paperDOMs = [];
				this.buttonDOMs = [];
				this.components = [];

				// For each component iterate
				for (var i=0; i<components.length; i++) {

					// Setup paper
					var component 	= components[i][0],
						name 		= components[i][1],
						icon 		= components[i][2],
						paper 		= $('<div class="com-paper"></div>'),
						content 	= $('<div class="content"></div>').appendTo(paper),
						component 	= R.instanceComponent(component, paper);

					// Add label
					$('<div class="tabs"></div>')
						.append($('<div class="tab focused"></div>').text(name))
						.appendTo(paper);

					// Adopt and forward
					this.forwardVisualEvents(component);
					this.adoptEvents(component);

					// Add align classes
					paper.addClass("r"+this.paperDOMs.length);

					// Create button
					var btn = $('<div class="profilebtn-large profilebtn-lower"><span class="'+icon+'"></span><div class="title">'+name+'</div></div>');
					btn.click((function(idx) {
						return function(e) {
							this.focusPaper(idx);
						}
					})(this.buttonDOMs.length).bind(this));

					// Store on paper DOMs
					this.buttonDOMs.push(btn);
					this.paperDOMs.push(paper);
					this.components.push(component);

					// Even on left, odd on right
					e.append(paper);
					if (i % 2 == 0) {
						this.select(".buttons-left").append(btn);
					} else {
						this.select(".buttons-right").append(btn);
					}

				}
		
				// Focus first paper
				this.focusPaper( this.focusedPaper );

			}).bind(this));

			// Go back
			this.handleDoURL('hideStatus', (function() {
				this.trigger('hideStatus');
			}).bind(this));

		}
		StatusScreen.prototype = Object.create( View.prototype );

		/**
		 * Focus a particular paper
		 */
		StatusScreen.prototype.focusPaper = function( paper ) {
			this.focusedPaper = paper;
			for (var i=0; i<this.buttonDOMs.length; i++) {
				if (i == paper) {
					this.buttonDOMs[i].addClass("active");
					this.components[i].onWillShow((function(i) {
						return function() {
							this.paperDOMs[i].addClass("focused");
							this.components[i].onShown();
						}
					})(i).bind(this));
				} else {
					this.buttonDOMs[i].removeClass("active");
					this.components[i].onWillHide((function(i) {
						return function() {
							this.paperDOMs[i].removeClass("focused");
							this.components[i].onHidden();
						}
					})(i).bind(this));
				}
			}
		}

		///////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////
		////                            HOOK HANDLERS                              ////
		///////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////

		/**
		 * Render before showing
		 */
		StatusScreen.prototype.onWillShow = function(cb) {

			// Render view before showing
			this.renderView();
			cb();

		}

		// Register screen component on the registry
		R.registerComponent( 'screen.status', StatusScreen, 1 );

	}

);