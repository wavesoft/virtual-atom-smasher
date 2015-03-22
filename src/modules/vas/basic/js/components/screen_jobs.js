
define(

	// Requirements
	["jquery", "d3", "vas/core/ui", "vas/core/apisocket", "vas/config", "vas/core/registry", "vas/core/base/components"],

	/**
	 * Basic version of the jobs screen
	 *
	 * @exports basic/components/explain_screen
	 */
	function($, d3, UI, APISocket, config, R,C) {

		/**
		 * @class
		 * @classdesc The basic jobs screen
		 */
		var JobsScreen = function( hostDOM ) {
			C.HomeScreen.call(this, hostDOM);

			// Prepare propertis
			this.activeJob = null;
			this.labapi = false;
			this.submitTunables = null;
			this.submitObservables = null;
			this.histogramLookup = {};
			this.lastHistograms = null;
			this.numConnectedMachines = 0;
			this.lastEvents = 0;
			this.lastEventsTime = 0;
			this.rateRing = [];
			this.listingTimer = 0;
			this.maxEvents = 1000;

			// Prepare host
			hostDOM.addClass("jobs");

			// Setup the registration form
			$('<h1><span class="highlight">Validation</span> Dashboard</h1>').appendTo(hostDOM);
			$('<p>Here you can see the current validation status and your past attempts.</p>').appendTo(hostDOM);

			// Forward icon
			var btnHost = $('<div class="menu-icon"></div>').appendTo(hostDOM),
				btnBackward = $('<div class="profilebtn-large profilebtn-upper"><span class="glyphicon glyphicon-menu-down"></span></div>').appendTo(btnHost);

			// Register backward 
			btnBackward.click((function() {
				this.trigger("hideJobs");
			}).bind(this));

			// ---------------------------------
			// Create status sidescreen
			// ---------------------------------
			this.sideScreenDOM = $('<div class="side-screen"></div>').appendTo(hostDOM);
			this.bgSlice = $('<div class="bg-slice"></div>').appendTo(this.sideScreenDOM);

			// ---------------------------------
			// Create the observable screen
			// ---------------------------------
			this.statusScreenDOM = $('<div class="observable-short"></div>').appendTo(this.sideScreenDOM);
			this.statusScreen = R.instanceComponent("screen.observable.short", this.statusScreenDOM);
			this.forwardVisualEvents(this.statusScreen);

			// ---------------------------------
			// Prepare status fields and buttons
			// ---------------------------------

			// Setup inputs
			this.statusMachines = $('<div class="panel-shaded status-label p-machines"></div>').appendTo(this.sideScreenDOM);
			$('<div class="panel-label">Connected machines</div>').appendTo(this.statusMachines);
			this.statusMachinesValue = $('<div class="panel-value">0</div>').appendTo(this.statusMachines);

			this.statusEvents = $('<div class="panel-shaded status-label p-events"></div>').appendTo(this.sideScreenDOM);
			$('<div class="panel-label">Live event rate</div>').appendTo(this.statusEvents);
			this.statusEventsValue = $('<div class="panel-value">0</div>').appendTo(this.statusEvents);

			this.statusProgress = $('<div class="panel-shaded status-label p-progress"></div>').appendTo(this.sideScreenDOM);
			$('<div class="panel-label">Progress</div>').appendTo(this.statusProgress);
			this.statusProgressValue = $('<div class="panel-value">0 %</div>').appendTo(this.statusProgress);

			// Panel abort and view buttons
			this.btnAbort = $('<button class="p-abort btn-shaded btn-red btn-striped btn-with-icon"><span class="glyphicon glyphicon-remove-circle"></span><br />Abort</button>').appendTo(this.sideScreenDOM);
			this.btnView = $('<button class="p-view btn-shaded btn-darkblue btn-with-icon"><span class="glyphicon glyphicon-dashboard"></span><br />View</button>').appendTo(this.sideScreenDOM);

			// Register visual aids
			R.registerVisualAid("jobs.button.abort", this.btnAbort, { "screen": "screen.jobs" });
			R.registerVisualAid("jobs.button.view", this.btnView, { "screen": "screen.jobs" });

			// Disable by default
			this.btnAbort.addClass("disabled");
			this.btnView.addClass("disabled");

			// Bind callbacks
			this.btnAbort.click((function() {
				if (this.labapi) {
					this.labapi.abortJob( this.activeJob );
					this.resetInterface();
				}
			}).bind(this));
			this.btnView.click((function() {
				if (this.lastHistograms) {
					// Show histograms overlay
					UI.showOverlay("overlay.histograms", (function(com) {
					}).bind(this)).onHistogramsDefined( this.lastHistograms );
				}
			}).bind(this));

			// ---------------------------------
			// Prepare jobs list
			// ---------------------------------

			// Prepare list
			this.eListHost = $('<div class="table-list table-absolute table-scroll table-lg"></div>').appendTo(hostDOM);
			this.eListTable = $('<table></table>').appendTo(this.eListHost);
			this.eListHeader = $('<thead><tr><th class="col-6">Date</th><th class="col-3">Status</th><th class="col-3">Actions</th></tr></thead>').appendTo(this.eListTable);
			this.eListBody = $('<tbody></tbody>').appendTo(this.eListTable);

			// Prepare the progress status label
			this.eStatusLabel = $('<div class="panel-shaded p-run-status">---</div>').appendTo(hostDOM);

			// ---------------------------------
			// Jobs list
			// ---------------------------------

			// List
			this.listJobs = $('<div class="list-jobs"></div>').appendTo(this.hostDOM);
			R.registerVisualAid("jobs.list.jobs", this.listJobs, { "screen": "screen.jobs" });

		}
		JobsScreen.prototype = Object.create( C.HomeScreen.prototype );

		/**
		 * Add a job in the status screen
		 */
		JobsScreen.prototype.addJob = function( job ) {

			// Translate status
			var jobStatus = ['Submitted', 'Running', 'Completed', 'Failed', 'Cancelled', 'Stalled'];

			var row = $('<tr class="joblist-id-'+job['id']+'"></tr>'),
				c1 = $('<td class="col-6"><span class="glyphicon glyphicon-edit"></span> ' + job['submitted'] + '</td>').appendTo(row),
				c2 = $('<td class="col-3">' + jobStatus[job['status']] + '</td>').appendTo(row),
				c3 = $('<td class="col-3 text-right"></td>').appendTo(row)
				b1 = $('<button class="btn-shaded btn-yellow"><span class="glyphicon glyphicon-eye-open"></span></button>').appendTo(c3);

			// Check if selected
			if (job['id'] == this.activeJob)
				row.addClass("selected");

			// Select on click
			row.click((function(job) {
				return function() {
					// Select clicked element
					this.eListBody.children("tr").removeClass("selected");
					row.addClass("selected");
					// Focus job activity on that job
					this.interfaceBind( job['id'] );
				}
			})(job).bind(this));

			// Handle click
			b1.click((function(job) {
				return function() {

				}
			})(job).bind(this));

			// Populate fields
			this.eListBody.append(row);
		}

		/**
		 * Remove a job from the status screen
		 */
		JobsScreen.prototype.removeJob = function( job ) {
			this.eListBody.find('tr.joblist-id-'+job['id']).remove();
		}

		/**
		 * Apply job details
		 */
		JobsScreen.prototype.applyJobDetails = function( job, agents ) {

			// Select
			this.activeJob = job['id'];

			// Update maximum number of events
			this.maxEvents = job['maxEvents'];

			// Focus to given job item on the list
			this.eListBody.children("tr").removeClass("selected");
			this.eListBody.find('tr.joblist-id-'+job['id']).addClass("selected");

			// Change status label of the focused job
			var jobStatus = ['SUBMITTED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'STALLED'];
			this.eStatusLabel.text( jobStatus[job['status']] );

			// Start globe spinning if status is running
			this.statusScreen.globe.setPaused( !(job['status'] == 1)  );
			if (job['status'] < 2) this.btnAbort.removeClass("disabled");

			// Parse agents
			for (var i=0; i<agents.length; i++) {
				var a = agents[i];

				// Parse lat/lng if exist, otherwise use random
				var lat = String(Math.random() * 180 - 90),
					lng = String(Math.random() * 180);

				// Update lat/lng
				if (a['latlng'] != undefined) {
					var parts = a['latlng'].split(",");
					lat = Number(parts[0]);
					lng = Number(parts[1]);
				}

				// Update interface
				this.statusScreen.onWorkerAdded( a['uuid'], {'lat' : lat, 'lng' : lng} );
				this.numConnectedMachines++;
				this.statusMachinesValue.text(this.numConnectedMachines);

			}

		}

		/**
		 * Unbind interface from a job feedback
		 */
		JobsScreen.prototype.resetInterface = function() {

			// Disable buttons
			this.btnView.addClass("disabled");
			this.btnAbort.addClass("disabled");

			// Reset status screen
			this.statusScreen.onObservablesReset();

			// Reset status messages
			this.eStatusLabel.text("---");
			this.statusMachinesValue.text("0");
			this.statusEventsValue.text("0");
			this.statusProgressValue.text("0 %");

			// Reset properties
			this.numConnectedMachines = 0;
			this.lastEventsTime = 0;
			this.lastEvents = 0;
			this.rateRing = [];
			this.activeJob = null;

		}

		/**
		 * Bind interface to a particular job
		 */
		JobsScreen.prototype.interfaceBind = function( job ) {

			// Focus on the given job
			this.resetInterface();
			this.labapi.selectJob( job );

			// Focus to job
			this.activeJob = job;

		}

		/**
		 * Refresh the job listing
		 */
		JobsScreen.prototype.refreshJobListing = function() {
			this.eListBody.empty();
			this.labapi.enumJobs();
		}

		/**
		 * Add a job in the status screen
		 */
		JobsScreen.prototype.onSubmitRequest = function( tunables, observables ) {
			this.submitTunables = tunables;
			this.submitObservables = observables;
		}

		/**
		 * Resize window
		 */
		JobsScreen.prototype.onResize = function( width, height ) {
			this.width = width;
			this.height = height;

			// Calculate inner radius size
			var inPad = 45,
				inW = this.width * 0.6,
				inH = this.height - inPad*2;

			// Resize status screen
			this.statusScreen.onMove( 0, inPad + 40 );
			this.statusScreen.onResize( inW, inH );

			// Resize background graphics
			var sz = Math.max(inW, inH) - 100;
			this.bgSlice.css({
				'height': 2*sz,
				'width': 2*sz,
				'left': width*0.6 - sz*2,
				'top': this.height/2 - sz,
				// Border-radius
				'borderRadius': sz,
				'mozBorderRadius': sz,
				'webkitBorderRadius': sz,
				'mzBorderRadius': sz
			});


		}

		/**
		 * Abort simulatio on unload
		 */
		JobsScreen.prototype.onWillHide = function(cb) {

			// Disconnect from LabAPI
			if (this.labapi) {
				this.resetInterface();
				this.labapi.deselectJob();
			}

			// Clear listing timer
			clearInterval( this.listingTimer );
			this.listingTimer = 0;

			// Fire callback
			cb();

		}

		/**
		 * Initialize lab on load
		 */
		JobsScreen.prototype.onWillShow = function(cb) {

			// Reset observables
			this.statusScreen.onObservablesReset();

			// Open labsocket for I/O and database for resolving
			var DB = APISocket.openDb();
			this.labapi = APISocket.openLabsocket();

			// Register histograms
			this.labapi.on('histogramUpdated', (function(data, ref) {
				this.statusScreen.onObservableUpdated(data, ref);
			}).bind(this));
			this.labapi.on('histogramsAdded', (function(histos) {

				// Collect names and map histogram ID to object
				var histoNames = [],
					histoMap = {};
				for (var i=0; i<histos.length; i++) {
					histoNames.push(histos[i].id);
					histoMap[histos[i].id] = histos[i];
				}

				// Query db for observable details
				DB.getMultipleRecords("observable", histoNames, (function(docs) {

					// Handle response
					for (var i=0; i<docs.length; i++) {
						var obs = docs[i],
							hist = histoMap[obs['name']];

						// Fire respective observable
						this.statusScreen.onObservableAdded(hist.data, hist.ref, obs);

					}

				}).bind(this));

			}).bind(this));
			this.labapi.on('histogramsUpdated', (function(histos) {
				this.lastHistograms = histos;
				this.btnView.removeClass("disabled");
				this.eStatusLabel.text("RUNNING");
			}).bind(this));
			this.labapi.on('metadataUpdated', (function(meta) {
				var currNevts = parseInt(meta['nevts']),
					progValue = currNevts * 100 / this.maxEvents;
				this.statusProgressValue.text( Math.round(progValue) + " %" );

				// Calculate rate
				var currTime = Date.now();
				if (this.lastEventsTime) {
					var deltaEvts = currNevts - this.lastEvents,
						deltaTime = currTime - this.lastEventsTime,
						rate = deltaEvts * 1000 / deltaTime,
						avgRate = 0;

					// Average with ring buffer
					this.rateRing.push(rate);
					if (this.rateRing.length > 10) this.rateRing.shift();
					for (var i=0; i<this.rateRing.length; i++) 
						avgRate += this.rateRing[i];
					avgRate /= this.rateRing.length;

					// Update average event rate
					this.statusEventsValue.text( Math.round(avgRate) + " /s" );
				}
				this.lastEventsTime = currTime;
				this.lastEvents = currNevts;

			}).bind(this));

			// Show/Hide workers based on telem
			this.labapi.on('log', (function(logLine, telemetryData) {
				if (telemetryData['agent_added']) {
					// Parse lat/lng if exist, otherwise use random
					var lat = String(Math.random() * 180 - 90),
						lng = String(Math.random() * 180);
					// Update lat/lng
					if (telemetryData['agent_added_latlng'] != undefined) {
						var parts = telemetryData['agent_added_latlng'].split(",");
						lat = Number(parts[0]);
						lng = Number(parts[1]);
					}
					// Notify the fact that agent was connected
					this.statusScreen.onWorkerAdded(
							telemetryData['agent_added'],
							{'lat' : lat, 'lng' : lng}
						);
					this.numConnectedMachines++;
					this.statusMachinesValue.text(this.numConnectedMachines);

				} else if (telemetryData['agent_removed']) {
					this.statusScreen.onWorkerRemoved(telemetryData['agent_removed']);
					this.numConnectedMachines--;
					this.statusMachinesValue.text(this.numConnectedMachines);

				}
				console.log(">>> ",logLine,telemetryData);
			}).bind(this));

			// Reset interface when current job is deselected
			this.labapi.on('jobDeselected', (function() {
				this.resetInterface();
			}).bind(this));

			// Handle job listings
			this.labapi.on('jobAdded', (function(job) {
				this.addJob(job);
			}).bind(this));
			this.labapi.on('jobRemoved', (function(job) {
				this.removeJob(job);
			}).bind(this));

			// When job details arrive focus
			this.labapi.on('jobDetails', (function(job, agents) {

				// Apply job details
				this.applyJobDetails(job, agents);

			}).bind(this));

			// Check if we should start a job
			if (this.submitTunables) {

				// Submit job
				this.labapi.submitJob( this.submitTunables, this.submitObservables );

				// Reset
				this.submitTunables = null;
				this.submitObservables = null;
			}

			// Refresh job listing AFTER job submission
			this.refreshJobListing();

			// And scheduler update listing every 5 seconds
			this.listingTimer = setInterval(function() {
				this.refreshJobListing();
			}.bind(this), 5000);

			// Show interface
			cb();

		}

		// Register jobs screen
		R.registerComponent( "screen.jobs", JobsScreen, 1 );

	}

);
