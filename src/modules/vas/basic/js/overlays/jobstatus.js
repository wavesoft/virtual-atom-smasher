define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/base/view", "vas/core/user",
	 "text!vas/basic/tpl/overlay/jobstatus.html"
	],

	/**
	 * This is the default component for displaying the job status
	 *
 	 * @exports vas-basic/overlay/jobstatus
	 */
	function(config, R, View, User, tplJobStatus) {

		/**
		 * The default tunable body class
		 */
		var OverlayJobStatus = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);
			hostDOM.addClass("jobstatus-overlay");
			this.loadTemplate(tplJobStatus);

		};

		// Subclass from View
		OverlayJobStatus.prototype = Object.create( View.prototype );

		/**
		 * Define/Update job details
		 */
		OverlayJobStatus.onJobDetailsUpdated = function(details) {
			this.setVideData('job', details);
			this.renderView();
		}

		/**
		 * Render before show
		 */
		OverlayJobStatus.onWillShow = function(cb) {
			this.renderView();
			cb();
		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.jobstatus', OverlayJobStatus, 1 );

	}

);