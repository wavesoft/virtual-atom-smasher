(function(global) {

	// Create CVM namespace if missing
	if (global['CVM'] == undefined) {
		console.error("cvmwebapi-avm.js requires cernvm-webapi.js to be loaded first!");
		return;
	}

	/**
	 * Probe factory for the Test4Theory Challenge
	 */
	CVM.probes.test4theory = function() {

		// Initialize probe properties
		var __messages = null;
		var __bootTime = null;
		var __jobConfig = {};
		var __lastJobKey = "";

		// For event rate calculation
		var __lastEvents = 0;
		var __lastEventTimestamp = 0;
		var __eventsRing = [];
		var eventRate = 0;

		// Return probe function
		return function(apiURL, readyCallback) {

			// If API URL is FALSE, reset counters and/or metrics
			if (!apiURL) {

				// Reset properties
				__messages = null;
				__bootTime = null;
				__jobConfig = {};
				__lastJobKey = "";
				__lastEvents = 0;
				__lastEventTimestamp = 0;
				__eventsRing = [];
				eventRate = 0;

				// Fire reseted monitor events
				this.triggerEvent("monitor.cpuLoad", 0,0,0);
				this.triggerEvent("monitor.eventRate", 0);
				this.triggerEvent("monitor.progress", 0.0);
				this.triggerEvent("monitor.jobInfo", null);

				return;
			}

			// Get messages
			if (!__messages) {

				// Try to get copilot-agent.log
				$.ajax({
					'url': apiURL+'/logs/messages?i='+nid,
					'success': (function(data,status,xhr) {

						// Process log lines and find the last one
						var lines = data.split("\n");
						__messages = lines;

						// Find boot time, from the last entry in the logfile
						for (var i=0; i<lines.length; i++) {
							if ((lines[i].indexOf("syslogd")>0) && (lines[i].indexOf("restart")>0)) {
								var date = lines[i].split(/[ \t]+/);
								__bootTime = timestampOf(date[0], date[1], date[2]);
								// Keep iterating until we found the last entry
							}
						}

					}).bind(this),
					'error': (function(data,status,xhr) {
						// Could not get messages. Do nothing
					}).bind(this)
				});

			}

			// Try to get copilot-agent.log
			$.ajax({
				'url': apiURL+'/logs/copilot-agent.log?i='+nid,
				'success': (function(data,status,xhr) {

					// Process log lines and find the last one
					var lines = data.split("\n"),
						parts = lines[lines.length-1].split("] ["),
						logDate = new Date(parts[0].substr(1)),
						nowDate = new Date();

					// Check for recent log
					if (nowDate - logDate > 60000) {
						this.statusFlags.agent = FLAG_READY_NOT_ACTIVE;
					} else {
						this.statusFlags.agent = FLAG_READY;
					}
					this.notifyFlagChange();

				}).bind(this),
				'error': (function(data,status,xhr) {
					this.statusFlags.agent = FLAG_NOT_READY;
					this.notifyFlagChange();
				}).bind(this)
			});

			// Try to get job.err
			$.ajax({
				'url': apiURL+'/logs/job.err?i='+nid,
				'success': (function(data,status,xhr) {

					// If it's empty, that's good news
					data = data.toLowerCase();
					if ((data.indexOf("error") >= 0) || (data.indexOf("critical") >= 0) || (data.indexOf("fail") >= 0)) {
						this.statusFlags.job = FLAG_ERROR;
					} else {
						this.statusFlags.job = FLAG_READY;
					}
					this.notifyFlagChange();

				}).bind(this),
				'error': (function(data,status,xhr) {
					this.statusFlags.job = FLAG_NOT_READY;
					this.notifyFlagChange();
				}).bind(this)
			});

			// If we are ready, include additional information
			if ((this.statusFlags.job == FLAG_READY) && (__messages)) {  

				// Process job output
				$.ajax({
					'url': apiURL+'/logs/job.out?i='+nid,
					'success': (function(data,status,xhr) {
						var currEvents = 0,
							lines = data.split("\n"),
							is_valid = false;

						// Find the runRunvet header in the first few lines
						for (var i=0; i<10; i++) {
							if (lines[i].substr(0,15) == "===> [runRivet]") {
								// Get the time started
								var parts = lines[i].split(/[ \t]+/),
									date = timestampOf(parts[3], parts[4], parts[5]);
								// Check if that date is newer than the boot time
								is_valid = (date > __bootTime);
								break;
							}
						}

						// Get the last line that matches 'Events processed'
						for (var i=lines.length-1; i>=0; i--) {
							if ((lines[i].indexOf("Events processed") >= 0) && is_valid) {
								var currTimestamp = Date.now();
								currEvents = parseInt(lines[i].split(/[ \t]+/)[0]);
								
								// Skip idle states
								if ((__lastEvents == currEvents) && (currTimestamp - __lastEventTimestamp < 10000))
									break;

								// Calculate event rate
								if (currEvents < __lastEvents) {
									this.statusFlags.job = FLAG_PENDING;
									this.triggerEvent("monitor.eventRate", 0);
									this.notifyFlagChange();

								} else {
									var rate = (currEvents - __lastEvents) / (currTimestamp - __lastEventTimestamp) * 60000;

									// Average using ring buffer
									__eventsRing.push(rate);
									if (__eventsRing.length > 5)
										__eventsRing.shift();
									eventRate = 0;
									for (var i=0; i<__eventsRing.length; i++) {
										eventRate += __eventsRing[i];
									}
									eventRate /= __eventsRing.length;

									// Fire dial update
									this.triggerEvent("monitor.eventRate", eventRate);
								}

								// Update last fields
								__lastEvents = currEvents;
								__lastEventTimestamp = currTimestamp;
								break;
							}
						}

						// Quit if we didn't have a valid record
						if (!is_valid) return;

						// Find the first line which contains the configuration info
						var jobKey = "", jobCfg = {};
						for (var i=0; i<lines.length; i++) {

							// Look for input parameters
							if (lines[i].trim() == "Input parameters:") {
								for (i++; lines[i].trim() != ""; i++) {
									var kv = lines[i].split("=");
									jobCfg[kv[0]] = kv[1];
									jobKey += lines[i]+";";
								}
							} 

							// Look for analysis name
							else if (lines[i].substr(0,14) == "analysesNames=") {
								jobCfg['analysesNames'] = lines[i].substr(14);
								jobKey += lines[i]+";";
								break; // And we are done
							}
						}

						// Check if that's a new job
						if (jobKey != __lastJobKey) {
							this.triggerEvent('monitor.jobInfo', jobCfg);
							__lastJobKey = jobKey;
							__jobConfig = jobCfg;
						}

						// Update progress if we have a job
						if (__jobConfig) {
							var progress = currEvents / parseInt(__jobConfig['nevts']);
							this.triggerEvent("monitor.progress", progress);
						}

					}).bind(this),
					'error': (function(data,status,xhr) {
						this.triggerEvent('monitor.jobInfo', null);
						this.triggerEvent("monitor.eventRate", 0);
						this.triggerEvent("monitor.progress", 0);
						if (this.statusFlags.job != FLAG_PENDING) {
							this.statusFlags.job = FLAG_PENDING;
							this.notifyFlagChange();
						}
					}).bind(this)
				});

				// Process top command
				$.ajax({
					'url': apiURL+'/logs/top?i='+nid,
					'success': (function(data,status,xhr) {

						// If it's empty, that's good news
						var lines = data.split("\n");
						if (lines.length <= 0) return;
						var loadParts = lines[0].split("load average: ")[1].split(/[ \t]+/);

						// Get machine load
						this.triggerEvent("monitor.cpuLoad", parseFloat(loadParts[0]), parseFloat(loadParts[1]), parseFloat(loadParts[2]));


					}).bind(this),
					'error': (function(data,status,xhr) {

					}).bind(this)
				});

			}

			// Fire the ready callback when we are done
			readyCallback();

		}
	}

})(window);