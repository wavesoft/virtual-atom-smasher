
define(

	// Requirements
	[
		"jquery", "jquery-transition-event", "d3", 
		"vas/core/db", "vas/core/ui", "sha1", "vas/config", 
		"vas/core/registry", "vas/core/base/components", 
		"vas/core/user", "vas/core/apisocket", 
		"vas/core/liveq/Calculate", "core/analytics/analytics"
	],

	/**
	 * Basic version of the home screen
	 *
	 * @exports basic/components/explain_screen
	 */
	function($, $te, d3, DB, UI, SHA1, config, R,C, User, APISocket, Calculate, Analytics ) {

		/**
		 * @class
		 * @classdesc The basic home screen
		 */
		var TuningScreen = function( hostDOM ) {
			C.TuningScreen.call(this, hostDOM);

			// Prepare host
			hostDOM.addClass("tuning2");

			// Setup local variables
			this.machineConfigurationsEnabled = {};
			this.machinePartsEnabled = {};
			this.machinePartTunables = {};
			this.observables = [];
			this.values = {};
			this.lastHistograms = [];
			this.markers = {};
			this.focusMachinePartID = null;
			this.popoverPos = {};
			this.popoverVisible = false;

			this.analyticsEstimateTime = 0;

			// Team header
			$('<h1><span class="highlight">Tuning</span> The Quantum Machine</h1><div class="subtitle">Fiddle with the quantum machine and find the best values</div>').appendTo(hostDOM);

			// Menu icons
			var btnHost = $('<div class="menu-icon"></div>').appendTo(hostDOM),
				btnFeedback = $('<div class="navbtn-large navbtn-upper navbtn-feedback"><span class="glyphicon glyphicon-bullhorn"></span><div class="title">Feedback</div></div>').appendTo(btnHost),
				btnUpward = $('<div class="navbtn-large navbtn-upper"><span class="glyphicon glyphicon-menu-up icon-direction icon-direction-up"></span><span class="glyphicon glyphicon-cog"></span><div class="title">Simulation</div></div>').appendTo(btnHost),
				btnForward = $('<div class="navbtn-large navbtn-upper"><span class="glyphicon glyphicon-menu-right icon-direction icon-direction-right"></span><span class="glyphicon glyphicon-user"></span><div class="title">Status</div></div>').appendTo(btnHost);

			// Register click handlers
			btnFeedback.click((function() {
				this.trigger("feedback", {
					"screen": "tuning"
				});
			}).bind(this));
			btnForward.click((function() {
				this.trigger("displayStatus");
			}).bind(this));
			btnUpward.click((function() {
				this.trigger("displayJobs");
			}).bind(this));

			// Show feedback video when user moves mouse over
			btnFeedback.mouseenter((function() {
				setTimeout((function() {
					if (!User.isFirstTimeSeen("ui.button.feedback")) {
						User.markFirstTimeAsSeen("ui.button.feedback");
						UI.scheduleTutorial("ui.button.feedback", function() {
						});
					}
				}).bind(this), 500);
			}).bind(this));

			// Create status frame
			var elmStatus = this.elmStatus = $('<div class="status-frame"></div>').appendTo(hostDOM),
				eCreditsRow = $('<div class="row-credits"></div>').appendTo(elmStatus),
				eCreditsLbl = $('<span class="label">Science Points: </span>').appendTo(eCreditsRow)
				elmStausCredits = $('<span class="value"></span>').appendTo(eCreditsRow);

			// Update status frame on profile update
			User.on('profile', (function(profile) {

				// Update user credit
				elmStausCredits.text(profile['points']);

				// Update Machine part counters
				var counters = profile['state']['partcounters'] || {};
				this.machine.onMachineCountersUpdated(counters);

			}).bind(this));

			// ---------------------------------
			// Create machine backdrop
			// ---------------------------------

			// Create a machine
			this.machineDOM = $('<div class="fullscreen fx-animated"></div>').appendTo(hostDOM);
			this.machine = R.instanceComponent("backdrop.machine", this.machineDOM);
			this.forwardVisualEvents( this.machine, { 'left':0, 'top': 0, 'width': '100%', 'height': '100%' } );
			
			// Setup machine
			this.machine.onMachinePartsEnabled({});

			this.machine.on('click', (function(eid, pos) {
				this.showPopover(pos, eid);
			}).bind(this));

			// ---------------------------------
			// Create help message panel
			// ---------------------------------

			// Create a description vrame
			var descFrame = this.descFrame = $('<div class="description-frame visible"></div>'); //.appendTo(hostDOM);
			this.descTitle = $('<h1>No part selected</h1>').appendTo(descFrame);
			this.descBody = $('<div>Please move your mouse over a machine part to see more information.</div>').appendTo(descFrame);

			// Bind listeners
			this.machine.on('hover', (function(id) {
				var details = DB.cache['definitions']['machine-parts'][id];
				this.btnCourse.addClass("disabled").off('click');
				if (details == undefined) {
					this.descTitle.text("Quantum Machine");
					this.descBody.html("Move your mouse over a component in order to see more details.");
				} else {
					if (!this.machinePartsEnabled[id]) {
						this.descTitle.html('<span class="glyphicon glyphicon-lock"></span> Part Locked');
						this.descBody.html("You don't have enough experience in order to tune this component. Go back to the <em>Knowlege Tree</em> and unlock new topics.");
					} else {
						this.descTitle.text(details['description']['title']);
						this.descBody.html(details['description']['body']);
						if (details['description']['course']) {
							this.btnCourse
								.removeClass("disabled")
								.off('click')
								.on('click', (function(e) {
									this.trigger("showCourse", details['description']['course']);
								}).bind(this));
						}
					}
				}
			}).bind(this));

			// Create course button
			this.btnCourse = $('<button class="btn-course btn-shaded btn-teal btn-with-icon disabled"><span class="glyphicon glyphicon-book"></span><br />Course</button>').appendTo(descFrame);

			// ---------------------------------
			// Create tuning panel
			// ---------------------------------

			// Prepare tuning panel DOM
			this.tuningMask = $('<div class="fullscreen mask"></div>').hide().appendTo(hostDOM);
			this.tunableGroup = $('<div class="parameter-group"></div>').appendTo(this.tuningMask);
			this.tuningMask.click((function() {
				this.hidePopover((function() {
				}).bind(this));
			}).bind(this));

			// Prepare tuning panel with it's blocking frame
			this.tuningPanel = R.instanceComponent("widget.tunable.tuningpanel", this.tunableGroup);
			this.tunableGroup.click(function(e) {
				e.stopPropagation();
				e.preventDefault();
			});

			// Bind events
			this.tuningPanel.on('change', (function(e) {

			}).bind(this));
			this.tuningPanel.on('hover', (function(tunable) {
				this.updateAssistance( tunable );
			}).bind(this));
			this.tuningPanel.on('showBook', (function(book) { // Incoming events 
				this.trigger('showBook', book);
			}).bind(this));
			this.tuningPanel.on('showCourse', (function(course) { // Incoming events 
				this.trigger('showCourse', course);
			}).bind(this));
			this.tuningPanel.on('valueChanged', (function(toValue, fromValue, meta) {

				// Update value
				this.values[meta['name']] = toValue;

				// Forward to machine part
				this.machinePartComponent.onTuningValueChanged( meta['name'], toValue );

				// A tuning value changed
				Analytics.fireEvent("tuning.values.change", {
					'id': meta['name'],
					'scale': Math.abs(fromValue - toValue) / (meta['max'] - meta['min'])
				});

				// Forward event
				User.triggerEvent("tuning.values.change", {
					'parameter': meta['name'],
					'from': fromValue,
					'to': toValue
				});

			}).bind(this));

			// ---------------------------------
			// Create tuning assistance panel
			// ---------------------------------

			// Create a assistance frame
			this.machinePartDOM = $('<div class="machinepart-frame"></div>').appendTo(hostDOM);
			this.machinePartComponent = R.instanceComponent( "overlay.machinepart", this.machinePartDOM );
			this.adoptEvents(this.machinePartComponent);

			// Hide explain frame
			this.machinePartDOM.css({
				'left': -300
			});

			// Handle machine parts event
			this.machinePartComponent.on('changeValue', (function(k,v) {
				// Update parameter on machine part component
				this.tuningPanel.onParameterChanged(k,v);
			}).bind(this));
			this.machinePartComponent.on('reload', (function() {

				// If we have a focused machine part, reload it
				if (this.focusMachinePartID) {
					User.getPartDetails(this.focusMachinePartID, (function(details) {
						this.setupPopover( details );
					}).bind(this));
				}
				
			}).bind(this));

			// ---------------------------------
			// Create machine types
			// ---------------------------------

			// Get machine components
			var machineOverlay = this.machineDOM.find(".r-machine-overlay");

			// Machine modes
			this.machineConfigModes = [
				"ee", "ppbar"
			];
			this.machineConfigBtns = [
				$('<button class="btn-machine-beam beam-1 btn-shaded btn-green">Electrons</button>').appendTo(machineOverlay),
				$('<button class="btn-machine-beam beam-2 btn-shaded btn-green">Protons</button>').appendTo(machineOverlay)
			];
			for (var i=0; i<this.machineConfigBtns.length; i++) {
				this.machineConfigBtns[i].click( (function(configMode) {
					return function() {
						this.setMachineConfiguration(configMode);
					}
				})(this.machineConfigModes[i]).bind(this));
			}
			
			// ---------------------------------
			// Create a control board
			// ---------------------------------

			var controlBoardHost = this.controlBoardHost = $('<div class="control-board"></div>').appendTo(hostDOM),
				descBoard = $('<div></div>').appendTo(controlBoardHost);

			this.btnEstimate = $('<button class="btn-shaded btn-with-icon btn-red"><span class="glyphicon glyphicon-unchecked"></span><br />Estimate</button>').appendTo(descBoard);
			this.btnValidate = $('<button class="btn-shaded btn-with-icon btn-red btn-striped "><span class="glyphicon glyphicon-expand"></span><br />Validate</button>').appendTo(descBoard);
			this.panelStatus = $('<div class="panel-shaded">---</div>').appendTo(descBoard);
			this.btnView = $('<button class="btn-shaded btn-with-icon btn-darkblue"><span class="glyphicon glyphicon-dashboard"></span><br />View</button>').appendTo(descBoard);

			// Bind events
			this.btnEstimate.click((function() {
				this.estimateResults();
			}).bind(this));
			this.btnValidate.click((function() {
				this.validateResults();
			}).bind(this));

			// View histograms
			this.btnView.click((function() {

				// Show histograms overlay
				UI.showOverlay("overlay.histograms", (function(com) {
					com.onHistogramsDefined( this.lastHistograms );
				}).bind(this));

			}).bind(this));

			// Create help button
			this.btnHelp = $('<button class="btn-help btn-shaded btn-teal btn-with-icon"><span class="glyphicon glyphicon-bookmark"></span><br />Help</button>').appendTo(this.hostDOM);
			this.btnHelp.click((function() {
				//this.descFrame.toggleClass("visible");
				UI.scheduleTutorial("ui.tuning");
			}).bind(this));

			// ---------------------------------
			// Register first-time & visual aids
			// ---------------------------------

			R.registerVisualAid("tuning.control.estimate", this.btnEstimate, { "screen": "screen.tuning" });
			R.registerVisualAid("tuning.control.validate", this.btnValidate, { "screen": "screen.tuning" });
			R.registerVisualAid("tuning.control.status", this.panelStatus, { "screen": "screen.tuning" });
			R.registerVisualAid("tuning.control.view", this.btnView, { "screen": "screen.tuning" });
			R.registerVisualAid("tuning.machine.beam", this.machineConfigBtns[1], { "screen": "screen.tuning" });
			R.registerVisualAid("tuning.menu.credits", elmStatus, { "screen": "screen.tuning" });
			R.registerVisualAid("ui.button.feedback", btnFeedback, { "screen": "screen.tuning" });

		}
		TuningScreen.prototype = Object.create( C.TuningScreen.prototype );

		/** 
		 * Hide pop-up
		 */
		TuningScreen.prototype.hidePopover = function(callback) {

			// Hide control board
			this.controlBoardHost.removeClass("visible");

			// Hide machine part component
			this.machinePartComponent.onWillHide((function() {

				// Remove back-blur fx on the machine DOM
				this.machine.onWillShow((function() {
					this.machineDOM.removeClass("fx-backblur").afterTransition((function() {
						this.machine.onShown();
					}).bind(this));
				}).bind(this));

				// Hide assistance panels
				this.machinePartDOM.css({
					'left': -300
				});
				//setTimeout((function() {
				//	this.descFrame.addClass("visible");
				//}).bind(this), 100);

				// Hide element
				this.tunableGroup.addClass("hidden");
				this.tunableGroup.css(this.popoverPos).css({
					'transform': '',
					'oTransform': '',
					'msTransform': '',
					'webkitTransform': '',
					'mozTransform': '',
				})

				// Cleanup upon animation completion
				setTimeout((function() {
					this.tunableGroup.removeClass("animating");
					this.tuningMask.hide();
					if (callback) callback();
				}).bind(this), 200);

				// Fire analytics			
				var expandTime = Analytics.stopTimer("tuning-machine-part");
				Analytics.fireEvent("tuning.machine.expand_time", {
					"id": this.focusMachinePartID,
					"time": expandTime
				});
				User.triggerEvent("tuning.machine.collapse", {
					'part': this.focusMachinePartID,
					'time': expandTime
				});

				// The component is now hidden
				this.machinePartComponent.onHidden();

				// The popover is now invisible
				this.popoverVisible = false;

			}).bind(this));

		}

		/**
		 * Setup popover with the details given
		 */
		TuningScreen.prototype.setupPopover = function(details) {

			// Find out what tunables are in this machine part 
			var machinePartID = this.focusMachinePartID,
				tunables = this.machinePartTunables[machinePartID],
				hasTunables = (tunables && (tunables.length > 0));

			// Setup tuning panel if we have tunables
			this.tuningPanel.onTuningPanelDefined( details.title, tunables );
			this.tuningPanel.onTuningValuesDefined( this.values );
			this.tuningPanel.onTuningMarkersDefined( this.markers );
			this.machinePartComponent.onTunablesDefined( tunables );
			this.machinePartComponent.onMachinePartDefined( machinePartID, details, this.machinePartsEnabled[machinePartID] );
			this.machinePartComponent.onTuningValuesDefined( this.values );

			// Calculate centered coordinates
			var sz_w = this.tuningPanel.width, 
				sz_h = this.tuningPanel.height,
				tX = this.width * 4/6, 
				tY = this.height / 2 - 100,
				pX = this.width * 1/4, 
				pY = this.height / 2;

			// Wrap inside screen coordinates
			if (tX - sz_w/2 < 0) tX = sz_w/2;
			if (tY - sz_h/2 < 0) tY = sz_h/2;
			if (tX + sz_w/2 > this.width) tX = this.width - sz_w/2;
			if (tY + sz_h/2 > this.height) tY = this.height - sz_h/2;

			// Center screen if no tunables
			if (!hasTunables) {
				pX = this.width / 2;
				//pY -= 40;
				this.tunableGroup.hide();
			} else {
				// Otherwise show animating
				this.tunableGroup.show();
				this.tunableGroup.addClass("animating");

				// Check if user has not seen the tuning part tutorial
				if (!User.isFirstTimeSeen("tuning.firsttunable")) {
					UI.scheduleTutorial("ui.tuning.firsttunable", function() {
						User.markFirstTimeAsSeen("tuning.firsttunable");
					});
				}

			}

			// Prepare show sequence
			setTimeout((function() {

				// Display tuning panel if tunables > 0
				if (hasTunables) {

					// Show tuning panel
					this.tuningPanel.onResize(sz_w, sz_h);
					this.tuningPanel.onWillShow((function() {
						// Make element animated
						this.tunableGroup.removeClass("hidden");
						// Add css
						this.tunableGroup.css({
							'left': tX,
							'top': tY
						});				
						// Shown
						this.tuningPanel.onShown();

					}).bind(this));

					// Remove full
					this.machinePartDOM.removeClass("full");

				} else {
					// Add full
					this.machinePartDOM.addClass("full");
				}

				// Display machine Part Component
				this.machinePartComponent.onWillShow((function() {

					// Callback Shown
					this.machinePartComponent.onShown();

					// Move machinePart DOM in place
					this.machinePartDOM.css({
						'left': pX,
						'top' : pY
					});

				}).bind(this));

				// Show the assistance panels
				//this.descFrame.removeClass("visible");

				// Show controlBoardHost if visible
				if (this.machinePartsEnabled[machinePartID]) {
					this.controlBoardHost.addClass("visible").afterTransition((function() {
						setTimeout((function() {

							// Fire first-time interface aids
							if (!this.btnEstimate.hasClass("disabled"))
								UI.showFirstTimeAid("tuning.control.estimate");
							if (!this.btnValidate.hasClass("disabled"))
								UI.showFirstTimeAid("tuning.control.validate");

						}).bind(this), 100);

					}).bind(this));
				} else {
					this.controlBoardHost.removeClass("visible")
				}

				
			}).bind(this), 10);
		}

		/** 
		 * Show popover over the given coordinates
		 */
		TuningScreen.prototype.showPopover = function( pos, machinePartID ) {

			// Keep popover details
			this.popoverPos = pos;
			this.focusMachinePartID = machinePartID;

			// Query machine part details
			User.getPartDetails(machinePartID, (function(details) {

				// Check if this machine part has an introduction course, and
				// prompt the user to show it
				var _showMachineAnimation = (function() {
					if (details['animation']) {

						// Show the prompt once
						if (!User.isFirstTimeSeen("course-" + details['animation'])) {

							// Ask user if he/she wants to take the intro tutorial
							UI.scheduleFlashPrompt(
								details['title'], 
								"Would you like to see a short course explaining this part?", 
								[
									{ 
										"label"    : "Yes, show it!",
									  	"callback" : (function(){
											// Mark introduction sequence as shown
											User.markFirstTimeAsSeen("course-" + details['animation']);
									  		// Trigger the course display
									  		this.trigger("showCourse", details['animation']);
										}).bind(this)
									},
									{
										"label"    : "Later",
										"class"    : "btn-darkblue",
										"callback" : (function(){
											// Mark introduction sequence as shown
											User.markFirstTimeAsSeen("course-" + details['animation']);
											// Show the first-time aid of the course
											UI.showFirstTimeAid("tuning.machinepart.course");
											// We can now show first-time aids on the machine part
											this.machinePartComponent.onShowFirstTimeAids();
										}).bind(this)
									}
								],
								"flash-icons/course.png"
							);

						} else {
							// We can now show first-time aids on the machine part
							this.machinePartComponent.onShowFirstTimeAids();
						}

					} else {
						// We can now show first-time aids on the machine part
						this.machinePartComponent.onShowFirstTimeAids();
					}
				}).bind(this);

				// Check if user has not seen the machine part tutorial
				if (!User.isFirstTimeSeen("tuning.machinepart")) {
					UI.scheduleTutorial("ui.tuning.machinepart", function() {
						User.markFirstTimeAsSeen("tuning.machinepart");
						_showMachineAnimation();
					});
				} else {
					_showMachineAnimation();
				}

				// Add back-blur fx on the machine DOM
				this.machine.onWillHide((function() {
					this.machineDOM.addClass("fx-backblur").afterTransition((function() {
						this.machine.onHidden();
					}).bind(this));
				}).bind(this));

				// Apply position
				this.tunableGroup.css(this.popoverPos = pos);

				// Fire analytics
				Analytics.restartTimer("tuning-machine-part");
				Analytics.fireEvent("tuning.machine.expand", {
					"id": machinePartID
				});
				User.triggerEvent("tuning.machine.expand", {
					"part": machinePartID
				});

				// Setup popover
				this.setupPopover( details );

				// Prepare show sequence
				this.tuningMask.show();

				// The popover is now visible
				this.popoverVisible = true;

			}).bind(this));

		}

		/** 
		 * Configure machine for either ee or ppbar
		 */
		TuningScreen.prototype.setMachineConfiguration = function( configMode ) {
			var index = this.machineConfigModes.indexOf( configMode );
			if (index < 0) return;

			// Reset all buttons
			for (var i=0; i<this.machineConfigBtns.length; i++) {
				this.machineConfigBtns[i].removeClass("btn-striped");
			}
			this.machineConfigBtns[index].addClass("btn-striped");

			// Update backdrop machine configuration
			this.machine.onMachineConfigChanged({
				'beam': configMode
			});

		}

		/** 
		 * Take a snapshot of the current values and save on markers
		 */
		TuningScreen.prototype.snapshotMarkers = function() {

			// Save user values
			User.saveSlotValues("L", this.values);

			// Update 'L' markers
			for (k in this.values) {
				if (typeof(this.values[k]) != 'number') continue;
				if (!this.markers[k]) this.markers[k] = {};
				this.markers[k]['L'] = this.values[k];
			}

		}

		/**
		 * Calculate evaluation ID
		 */
		TuningScreen.prototype.getTuneID = function() {

			// Create a string to hash
			var str = "";

			// Summarize
			for (var k in this.values) {
				str += k + "=" + this.values[k].toString() + ",";
			}

			// Checksum
			return SHA1.hash(str);

		}

		/** 
		 * Submit results for estimation
		 */
		TuningScreen.prototype.estimateResults = function() {

			// Commit estimate transaction
			this.analyticsEstimateTime = Analytics.restartTimer("tuning")

			// Forward event
			User.triggerEvent("tuning.values.estimate", {
			});

			// Submit for interpolation
			this.lab.estimateJob( this.values, this.observables );

			// Save user values
			this.snapshotMarkers();

		}

		/** 
		 * Submit results for validation
		 */
		TuningScreen.prototype.validateResults = function() {

			// Commit estimate transaction
			Analytics.fireEvent("tuning.values.will_validate", {
				"id": this.getTuneID(),
				"time": Analytics.restartTimer("tuning"),
				"values": this.values
			});

			// Forward event
			User.triggerEvent("tuning.values.validate", {
			});
			
			// Submit for interpolation
			this.trigger( 'submitParameters', this.values, this.observables );

			// Save user values
			this.snapshotMarkers();

		}

		/** 
		 * Update the assistance panel for the given tunable ID 
		 */
		TuningScreen.prototype.updateAssistance = function( tunable ) {

			// Change title
			this.machinePartComponent.onTunableFocus( tunable );

		}

		/**
		 * Setup lab before showing
		 */
		TuningScreen.prototype.onWillShow = function(cb) {

			// Open/Resume labSocket
			this.lab = APISocket.openLabsocket();
			this.lab.on('histogramsUpdated', (function(histos) {

				// Save last histograms
				this.lastHistograms = histos;

				// Enable view option
				this.btnView.removeClass("disabled");
				UI.showFirstTimeAid("tuning.control.view");

				// Calculate the Chi2 over all histograms
				var chi2 = 0;
				for (var i=0; i<histos.length; i++) {
					var v = Calculate.chi2(histos[i].data, histos[i].ref.data);
					chi2 += v;
				}
				chi2 /= histos.length;

				// Classify and display
				var msg = "Bad",
					claim = "",
					claim_reason = "";

				if (chi2 < 1) {
					msg = "Perfect";
					claim = "perfect";
					claim_reason = "for your excellet guess";
				} else if (chi2 < 2) {
					msg = "Good";
					claim = "good";
					claim_reason = "for your good estimate";
				} else if (chi2 < 4) {
					msg = "Fair";
					claim = "fair";
					claim_reason = "your fair attempt";
				}
				msg += "(" + chi2.toFixed(2) + ")";

				// Print result
				this.panelStatus.text(msg);

				// Place credits claim request
				if (claim != "")
					User.claimCredits("estimate", claim, claim_reason);

				// Fire analytics
				Analytics.fireEvent("tuning.values.estimate", {
					"id": this.getTuneID(),
					"time": this.analyticsEstimateTime,
					"fit": chi2,
					"values": this.values
				});

			}).bind(this));
	
			// If we have a popover visible, trigger update events
			if (this.popoverVisible) {
				this.machinePartComponent.onWillShow((function() {
					// Callback Shown
					this.machinePartComponent.onShown();
				}).bind(this));
			}
			
			// Continue
			cb();

		}

		/** 
		 * Display visual aids when shown
		 */
		TuningScreen.prototype.onShown = function() {

			// Check if user has not seen the intro tutorial
			if (!User.isFirstTimeSeen("tuning.intro")) {
				// Display the intro sequence
				UI.scheduleTutorial("ui.tuning", function() {
					// Mark introduction sequence as shown
					User.markFirstTimeAsSeen("tuning.intro");
				});
			}

			// Make sure we have a 'tuning' timer
			Analytics.startTimer("tuning");

		}

		/** 
		 * Define the parameters of the machine
		 */
		TuningScreen.prototype.onTuningConfigUpdated = function( tuningConfig ) {

			// ============================
			// Update observables
			// ============================

			// Set the observables trim
			this.observables = tuningConfig.observables;

			// ============================
			// Machine configurations
			// ============================

			// First update enabled machine configurations
			this.machineConfigurationsEnabled = {};
			for (var i=0; i<tuningConfig.configurations.length; i++) {
				var cfgName = tuningConfig.configurations[i];
				this.machineConfigurationsEnabled[cfgName] = true;
			}

			// Then update UI to reflect the configurations
			//if (!this.machineConfigurationsEnabled['sim-interpolate']) {
			//	this.btnEstimate.addClass("disabled");
			//} else {
			User.onConfigChanged("sim-interpolate", (function(isEnabled) {
				if (isEnabled) {
					this.btnEstimate.removeClass("disabled");
					if (this.controlBoardHost.hasClass("visible")) {
						UI.showFirstTimeAid("tuning.control.estimate");
					}
				} else {
					this.btnEstimate.addClass("disabled");
				}
 			}).bind(this));
			//}
			//if (!this.machineConfigurationsEnabled['sim-run']) {
			//	this.btnValidate.addClass("disabled");
			//} else {
			User.onConfigChanged("sim-validate", (function(isEnabled) {
				if (isEnabled) {
					this.btnValidate.removeClass("disabled");
					if (this.controlBoardHost.hasClass("visible")) {
						UI.showFirstTimeAid("tuning.control.validate");
					}
				} else {
					this.btnValidate.addClass("disabled");
				}
			}).bind(this));
			//}

			// Update machine modes
			for (var i=0; i<this.machineConfigBtns.length; i++) {
				this.machineConfigBtns[i].addClass("disabled");
				this.machineConfigBtns[i].removeClass("btn-striped");
			}

			// Enable mode buttons
			var lastMode = "";
			if (this.machineConfigurationsEnabled['beam-ee']) {
				this.machineConfigBtns[0].removeClass("disabled");
				lastMode = "beam-ee";
			}
			if (this.machineConfigurationsEnabled['beam-ppbar']) {
				this.machineConfigBtns[1].removeClass("disabled");
				lastMode = "beam-ppbar";
			}
			this.setMachineConfiguration(lastMode.substr(5));

			// ============================
			// Machine parts & Tunables
			// ============================

			// Reset tunable values
			this.values = {};
			this.markers = {};

			// First update enabled machine parts
			this.machinePartsEnabled = {};
			for (var i=0; i<tuningConfig.machineParts.length; i++) {
				var partName = tuningConfig.machineParts[i].part,
					tunables = tuningConfig.machineParts[i].tunables;
				this.machinePartsEnabled[partName] = true;
				this.machinePartTunables[partName] = tunables;

				// Place tunable values on map
				for (var j=0; j<tunables.length; j++) {
					this.values[tunables[j]['name']] = tunables[j]['default'] || tunables[j]['min'] || 0.0;
				}
			}

			// Then update interface
			this.machine.onMachinePartsEnabled( this.machinePartsEnabled );

			// ============================
			// Initialize values
			// ============================

			// Get save slot values
			User.getSlotValues("L", (function(values) {
				
				// Prepare markers
				var markers = {};

				// Update local values
				for (k in values) {
					this.values[k] = values[k];
					markers[k] = {
						'L': values[k]
					};
				}

				// Update markers
				this.markers = markers;


			}).bind(this));

			// Reset UI
			this.btnView.addClass("disabled");
			this.panelStatus.text("---");

		}


		// Register home screen
		R.registerComponent( "screen.tuning", TuningScreen, 1 );

	}

);
