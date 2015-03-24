define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/view", "text!vas/basic/tpl/machine/describe.html"], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/machineparts/describe
	 */
	function(config, R, UI, ViewComponent, tplContent) {

		/**
		 * The default tunable body class
		 */
		var DescribeMachinePart = function(hostDOM) {

			// Initialize widget
			ViewComponent.call(this, hostDOM);
			hostDOM.addClass("machinepart-describe")

			// Load template
			this.loadTemplate( tplContent );

			// Handle DO URLs
			this.handleDoURL('showBook', (function(bookID) {
				this.trigger("showBook", bookID);
			}).bind(this));
			this.handleDoURL('showCourse', (function(courseID) {
				this.trigger("showCourse", courseID);
			}).bind(this));

			// Register visual aids
			this.select(".-btn-learn", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.describe.learn", elm);
			});
			this.select(".-btn-course", function(elm) {
				if (elm.length == 0) return;
				R.registerVisualAid("machinepart.tabcontent.describe.course", elm);
			});

		};

		// Subclass from ObservableWidget
		DescribeMachinePart.prototype = Object.create( ViewComponent.prototype );

		/**
		 * Update machine details
		 */
		DescribeMachinePart.prototype.onMachinePartDefined = function( partID, part, isEnabled ) {

			// Update visual interface
			this.setViewData( 'part', part );
			this.setViewData( 'enabled', isEnabled );

		}

		/**
		 * Render view before show
		 */
		DescribeMachinePart.prototype.onWillShow = function( cb ) {
			// Render view
			this.renderView();
			// Callback
			cb();
		}

		/**
		 * User focused on tunable
		 */
		DescribeMachinePart.prototype.onTunableFocus = function( tunable ) {

		};

		/**
		 * Define the list of tunables in the machine part
		 */
		DescribeMachinePart.prototype.onTunablesDefined = function( tunables ) {

		};

		/**
		 * Define the values on the tunables
		 */
		DescribeMachinePart.prototype.onTuningValuesDefined = function( tunables ) {

		};

		/**
		 * A tuning parameter value has changed
		 */
		DescribeMachinePart.prototype.onTuningValueChanged = function( parameter, value ) {	

		}

		/**
		 * Display firs-time aids when possible
		 */
		DescribeMachinePart.prototype.onShowFirstTimeAids = function() {	
			UI.showAllFirstTimeAids("machinepart.tabcontent.describe");
		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.machinepart.describe', DescribeMachinePart, 1 );

	}

);