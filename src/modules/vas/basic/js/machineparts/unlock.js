define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/user", "vas/core/base/view", "core/analytics/analytics",
	 "text!vas/basic/tpl/machine/unlock.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/paper
	 */
	function(config, R, UI, User, ViewComponent, Analytics, tplContent) {

		/**
		 * The default tunable body class
		 */
		var UnlockMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-unlock");

			// Load template
			this.loadTemplate( tplContent );

			// Handle do url
			this.handleDoURL('unlockStage', (function(stage) {
				User.unlockMachineStage(stage, (function(isOK) {
					// Reload machine part
					this.trigger('reload');
				}).bind(this));
			}).bind(this));

			// Register visual aids
			this.select("ul li:not(.header)", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.unlock.first", elm.first());
			});
			this.select("ul li.unlocked", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.unlock.unlocked", elm.first());
			});
			this.select("ul li.unlockable:not(.no-credit)", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.unlock.unlockable", elm.first());
			});
			this.select("ul li.locked", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.unlock.locked", elm.first());
			});
			this.select("ul li.unlockable.no-credit", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.unlock.nocredit", elm.first());
			});

		};

		// Subclass from ObservableWidget
		UnlockMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		UnlockMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );
			this.setViewData( 'terms', "" );

			// Process part stages
			var stages = part['stages'], firstLocked = true;
			for (var i=0; i<stages.length; i++) {
				if (stages[i].locked) {
					if (firstLocked) {
						firstLocked=false;
						stages[i]['unlockable'] = true;
						stages[i]['canunlock'] = (User.profile['points'] >= stages[i]['cost'])
					}
				}
			}
			this.setViewData( 'stages', stages );

		}

		/**
		 * Render view before show
		 */
		UnlockMachinePart.prototype.onWillShow = function( cb ) {
			this.renderView();
			cb();
		}

		/**
		 * User focused on tunable
		 */
		UnlockMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		UnlockMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		UnlockMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};

		/**
		 * A tuning parameter value has changed
		 */
		UnlockMachinePart.prototype.onTuningValueChanged = function( parameter, value ) {	

		}

		/**
		 * Display firs-time aids when possible
		 */
		UnlockMachinePart.prototype.onShowFirstTimeAids = function() {	
			UI.showAllFirstTimeAids("machinepart.tabcontent.unlock");
		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.unlock', UnlockMachinePart, 1 );

	}

);