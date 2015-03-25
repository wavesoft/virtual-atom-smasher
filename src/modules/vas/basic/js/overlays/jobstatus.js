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
			hostDOM.addClass("overlay-rounded-frame");

			// Load job status template
			this.loadTemplate(tplJobStatus);

		};

		// Subclass from View
		OverlayJobStatus.prototype = Object.create( View.prototype );

		/**
		 * Define/Update job details
		 */
		OverlayJobStatus.prototype.onJobDetailsUpdated = function(details) {

			// Expand tunables
			var tunables = [];
			for (var k in details['userTunes']) {
				tunables.push({
					'name': k,
					'value': details['userTunes'][k]
				});
			}

			// Convert job status integer to string
			var status_str = [
				'Pending', 'Running', 'Completed',
				'Failed', 'Cancelled', 'Stalled'
			];
			details['status_str'] = status_str[ details['status'] ];

			// Update view
			this.setViewData('job', details);
			this.setViewData('tunables', tunables);
			this.renderView();
		}

		/**
		 * Render before show
		 */
		OverlayJobStatus.prototype.onWillShow = function(cb) {
			this.renderView();
			cb();
		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.jobstatus', OverlayJobStatus, 1 );

	}

);