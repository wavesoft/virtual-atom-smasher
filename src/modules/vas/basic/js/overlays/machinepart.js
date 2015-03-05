define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/base/component"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, Component) {

		/**
		 * The default tunable body class
		 */
		var MachinePart = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			this.hostDOM.addClass("describe-machine-part");

			// Setup tabs
			this.tabsDOM = $('<div class="tabs"></div>').appendTo(hostDOM);
			this.containers = [];
			this.tabs = [];
			this.components = [];
			this.lastFocusedTab = 0;

			// Register description tab
			this.registerTab( 'overlay.machinepart.describe', 'Description' );
			this.registerTab( 'overlay.machinepart.paper', 'Papers' );

		};

		// Subclass from ObservableWidget
		MachinePart.prototype = Object.create( Component.prototype );

		/**
		 * Select a tab
		 */
		MachinePart.prototype.selectTab = function( index ) {
			// Keep the last focused tab
			this.lastFocusedTab = index;
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

			// Adopt/Forward events to the client component
			this.adoptEvents( com );
			this.forwardVisualEvents( com );
			this.forwardEvents( com, [
					'onTunableFocus',
					'onTunablesDefined',
					'onTunablesDefined',
					'onMachinePartDefined'
				]);

			// Register
			(function(idx) {
				tab.click((function(e) {
					// Select tab on click
					this.selectTab(idx);
				}).bind(this));
			}).bind(this)(this.tabs.length - 1);

			// Focus first tab
			this.selectTab(0);

		};

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
		 * The machine part configuration defined
		 */
		MachinePart.prototype.onMachinePartDefined = function( config, isEnabled ) {
			if (!isEnabled) {
				
				// Activate only first tab
				for (var i=1; i<this.tabs.length; i++) {
					this.containers[i].hide();
					this.tabs[i].hide();
				}

				// Select first tab
				this.selectTab(0);

			} else {

				// Activate all tabs if enabled
				for (var i=1; i<this.tabs.length; i++) {
					this.tabs[i].show();
				}

				// Select last focused tab
				this.selectTab(this.lastFocusedTab);

			}
		};

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart', MachinePart, 1 );

	}

);