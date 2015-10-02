define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/component", "vas/core/user", "ccl-tracker"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, UI, Component, User, Analytics) {

		/**
		 * The default tunable body class
		 */
		var MachinePart = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			this.hostDOM.addClass("describe-machine-part com-paper");

			// Setup tabs
			this.tabsDOM = $('<div class="tabs"></div>').appendTo(hostDOM);
			this.containers = [];
			this.tabs = [];
			this.components = [];
			this.lastFocusedTab = null;
			this.visible = false;
			this.tabEnabled = [];
			this.tabVisible = [];
			this.canShowFirstTimeAids = false;

			// Register description tab
			this.registerTab( 'overlay.machinepart.describe', 'Description' );
			this.registerTab( 'overlay.machinepart.unlock', 'Unlock' );
			this.registerTab( 'overlay.machinepart.results', 'Current Results' );
			this.registerTab( 'overlay.machinepart.paper', 'Papers' );

			// Hide/show machine parts based on configuration
			/*
			User.onConfigChanged("tab-mypaper", (function(isEnabled) {
				this.setTabVisibility( 2, isEnabled );
				this.tabEnabled[2] = isEnabled;
				if (isEnabled && this.visible) {
					UI.showFirstTimeAid("machinepart.tab.overlay.machinepart.mypaper");
				}
			}).bind(this));
			User.onConfigChanged("tab-papers", (function(isEnabled) {
				this.setTabVisibility( 3, isEnabled );
				this.tabEnabled[3] = isEnabled;
				if (isEnabled && this.visible) {
					UI.showFirstTimeAid("machinepart.tab.overlay.machinepart.paper");
				}
			}).bind(this));
*/

			// Tabs to show when disabled
			this.disabledModeTabs = [0,1];

		};

		// Subclass from ObservableWidget
		MachinePart.prototype = Object.create( Component.prototype );

		/**
		 * Set tab visibility
		 */
		MachinePart.prototype.setTabVisibility = function( index, visible ) {
			// Check visibility
			if (this.tabVisible[index] == visible)
				return;

			// Handle change
			if (!visible) {

				// Hide tab
				this.tabs[index].hide();

				// Focus away from the tab
				this.tabs[index].removeClass("focused").hide();
				if (this.lastFocusedTab == index)
					this.selectTab(0);

			} else {

				// Hide tab
				this.tabs[index].show();
				// Display tab
				this.tabs[index].removeClass("focused").show();
			}

			// Update visibility
			this.tabVisible[index] = visible;
		}

		/**
		 * Select a tab
		 */
		MachinePart.prototype.selectTab = function( index ) {

			var __continueShow = (function() {

				// Keep the last focused tab
				this.lastFocusedTab = index;

				// Show the current component
				this.components[index].show((function() {

					// Focus the particular tab
					for (var i=0; i<this.containers.length; i++) {
						if (i == index) {
							this.containers[i].show();
							this.tabs[i].addClass('focused');
						} else {
							this.containers[i].hide();
							this.tabs[i].removeClass('focused');
						}
					}

					// Fire this on the active component
					if (this.canShowFirstTimeAids)
						this.components[index].onShowFirstTimeAids();

				}).bind(this));

			}).bind(this);

			// Fire analytics
			var partTabTime = Analytics.restartTimer("machinepart-tab");
			User.triggerEvent("machinepart.tab.change", {
				"part" : this.partID,
				"from": this.lastFocusedTab,
				"to": index,
				"time": partTabTime
			});

			// Hide previous component
			if (this.lastFocusedTab !== null) {
				this.components[this.lastFocusedTab].hide( __continueShow );
			} else {
				__continueShow();
			}

		}

		/**
		 * Register a component on a tab
		 */
		MachinePart.prototype.registerTab = function( docName, tabName ) {

			// Create document
			var dom = $('<div class="content"></div>').appendTo(this.hostDOM).hide();
			this.containers.push(dom);

			// Create tab
			var tab = $('<div class="tab"></div>').text(tabName).appendTo(this.tabsDOM);
			this.tabs.push(tab);

			// Create component
			var com = R.instanceComponent( docName, dom );
			this.components.push(com);

			// Put visible and enable array entries
			this.tabVisible.push(true);
			this.tabEnabled.push(true);

			// Adopt/Forward events to the client component
			this.adoptEvents( com );
			this.forwardVisualEvents( com );
			this.forwardEvents( com, [
					'onTunableFocus',
					'onTunablesDefined',
					'onTuningValuesDefined',
					'onTuningValueChanged',
					'onMachinePartDefined'
				]);

			// Register
			(function(idx) {
				tab.click((function(e) {
					// Select tab on click
					this.selectTab(idx);
				}).bind(this));
			}).bind(this)(this.tabs.length - 1);

			// Register visual aid
			R.registerVisualAid("machinepart.tab." + docName, tab, {
				"screen": "screen.tuning",
				"onWillShow": function(cb) {
					tab.trigger("click");
					cb();
				}
			});
			R.registerVisualAid("machinepart.tabbody." + docName, dom, {
				"screen": "screen.tuning",
				"onWillShow": function(cb) {
					tab.trigger("click");
					cb();
				}
			});

			// Focus first tab
			this.selectTab(0);

		};

		/**
		 * We are ready to show the first-time aids
		 */
		MachinePart.prototype.onShowFirstTimeAids = function() {
			// We can show first time aids
			this.canShowFirstTimeAids = true;

			// If we can show first-time aids, show them now
			if (this.visible) {
				// Show my first-time aids
				UI.showAllFirstTimeAids("machinepart.tab.");
				// SHow first-time aids on the active tab
				this.components[ this.lastFocusedTab ].onShowFirstTimeAids();
			}
			
		}

		/**
		 * User focused on tunable
		 */
		MachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		MachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		MachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};
		
		/**
		 * A tuning parameter value has changed
		 */
		MachinePart.prototype.onTuningValueChanged = function( parameter, value ) {	

		}

		/**
		 * The machine part configuration defined
		 */
		MachinePart.prototype.onMachinePartDefined = function( partID, config, isEnabled ) {
			this.partID = partID;
			if (!isEnabled) {
				
				// Activate only first tab
				for (var i=0; i<this.tabs.length; i++) {
					if (this.disabledModeTabs.indexOf(i) < 0) {
						// Hide this tab
						this.setTabVisibility( i, false );
					}
				}

			} else {

				// Activate all tabs if enabled
				for (var i=1; i<this.tabs.length; i++) {
					this.setTabVisibility( i, this.tabEnabled[i] );
				}

				// Select last focused tab
				this.selectTab(this.lastFocusedTab);

			}
		};

		/**
		 * The component is now visile
		 */
		MachinePart.prototype.onShown = function() {
			Analytics.restartTimer("machinepart-tab");
			Analytics.restartTimer("machinepart");

			User.triggerEvent("machinepart.show", {
				"part" : this.partID
			});

			this.visible = true;

			// If we can show first-time aids, show them now
			if (this.showFirstTimeAid) {
				// Show my first-time aids
				UI.showAllFirstTimeAids("machinepart.tab.");
				// SHow first-time aids on the active tab
				this.components[ this.lastFocusedTab ].onShowFirstTimeAids();
			}
		}

		/**
		 * The component is now hidden
		 */
		MachinePart.prototype.onHidden = function() {
			var partTabTime = Analytics.stopTimer("machinepart-tab"),
				machineTime = Analytics.stopTimer("machinepart");

			User.triggerEvent("machinepart.tab.change", {
				"part" : this.partID,
				"from": this.lastFocusedTab,
				"to": "",
				"time": partTabTime
			});
			User.triggerEvent("machinepart.hide", {
				"part" : this.partID,
				"time" : machineTime
			});

			this.visible = false;
		}


		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart', MachinePart, 1 );

	}

);