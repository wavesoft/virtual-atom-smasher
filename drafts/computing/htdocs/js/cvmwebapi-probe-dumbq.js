(function(global) {

	// Require CVM namespace
	if (global['CVM'] == undefined) {
		console.error("cvmwebapi-probe-dumbq.js requires cernvm-webapi.js to be loaded first!");
		return;
	}

	// Require DQFrontEnd namespace
	if (global['DumbQ'] == undefined) {
		console.error("cvmwebapi-probe-dumbq.js requires dumbq.js to be loaded first!");
		return;
	}

	/**
	 * Probe factory for the Test4Theory Challenge
	 */
	CVM.probes.dumbq = function() {

		// Create a DumbQ Front-end
		var dumbq = new DumbQ.FrontEnd();

		// Bind on dumbq events
		$(dumbq).on('online', (function(e, machine) {

			// Update agent flag
			this.statusFlags.agent = CVM.FLAG_READY;
			this.notifyFlagChange();

		}).bind(this));
		$(dumbq).on('offline', (function(e, machine) {

			// Update agent flag
			this.statusFlags.agent = CVM.FLAG_READY_NOT_ACTIVE;
			this.notifyFlagChange();

		}).bind(this));

		var initialized = false;

		// Return probe function
		return function(apiURL, readyCallback) {

			// If API URL is FALSE, reset counters and/or metrics
			if (!apiURL) {

				// We are not initialized
				initialized = false;

				// Disable dumbq
				dumbq.disable();

				// Reset properties
				this.statusFlags.agent = CVM.FLAG_NOT_READY;
				this.notifyFlagChange();

				return;

			}

			// Otherwise enable dumbq probing
			if (!initialized) {
				initialized = true;
				dumbq.enable( apiURL );
			}

			// Fire the ready callback when we are done
			readyCallback();

		}
	}

})(window);