
(function(global) {

	var CMD_START = 1,
		CMD_STOP = 2,
		CMD_APPLY = 3,
		CMD_DESTROY = 4,
		CMD_SET_CAP = 5,

		STATE_STOPPED = 0,
		STATE_RUNNING = 1,
		STATE_PENDING = 2,

		FLAG_NOT_READY = 0,
		FLAG_READY = 1,
		FLAG_READY_NOT_ACTIVE = 2,
		FLAG_PENDING = 3,
		FLAG_ERROR = 4;

	// Create CVM namespace if missing
	if (global['CVM'] == undefined) {
		console.error("cvmwebapi-avm.js requires cernvm-webapi.js to be loaded first!");
		return;
	}

	// Bind to analytics if available
	var analytics = null;
	if (global['analytics'] !== undefined)
		analytics = global['analytics'];

	/**
	 * Function to convert month/day/hour:minute:second into an integer
	 */
	var timestampOf = function(m,d,h) {
		var timeParts = h.toString().split(":"),
			monthLookup = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];

		var monthIndex = monthLookup.indexOf(m.toString().toLowerCase());
		if (monthIndex < 0) monthIndex = 0;

		// Convert to seconds (assuming month = 31 days)
		return monthIndex * 2678400 +
			   parseInt(d) * 86400 +
			   parseInt(timeParts[0]) * 3600 +
			   parseInt(timeParts[1]) * 60 +
			   parseInt(timeParts[2]);
	}

	/**
	 * Reusable probe functions
	 */
	CVM.probes = {};

	/**
	 * Autonomous VM is a class which takes care of all the user-triggered operations
	 * of setting-up, modifying and controling the VM.
	 *
	 * Every action happens asynchronously in a 'best-effort' basis.
	 */
	var AutonomousVM = global.CVM.AutonomousVM = function(vmcp) {

		// Setup config parameters
		this.config = {
			'memory': 128,
			'cpus'  : 1,
			'cap'   : 80,
			'vmid'  : 'anonymous',
			// For concurrency with BOINC
			'boinc_username' : '',
			'boinc_authenticator': '',
			'boinc_userid': ''
		};

		// Setup state parameters
		this.state = 0;
		this.pendingCommand = 0;
		this.wa_plugin = null;
		this.wa_session = null;
		this.lastErrorMessage = "";

		// Setup private parameters
		this.__statusProbeTimer = null;
		this.__firstStateEvent = false;
		this.__vmStarted = false;
		this.apiAvailable = false;

		// Pending functions to be called
		// when we have a session
		this.__sessionReadyFn = [];

		// Cache invalidation counter
		this.__nid = 0;

		// Status flags
		this.statusFlags = {
			'webapi'		: FLAG_PENDING,
			'webapi_session': FLAG_NOT_READY,
			'vm'			: FLAG_NOT_READY,
			'api'			: FLAG_NOT_READY,
			'agent'			: FLAG_NOT_READY,
			'job'			: FLAG_NOT_READY
		};

		// Single-instance listeners
		this.listeners = { };

		// Multi-instance listeners
		this.multiListeners = { };

		// Call-on-register functions for every listener. 
		// In principle this is used to forward past events to later-registered listeners.
		this.listenerInitializers = {};

		// Fire-up initial callbacks
		this.triggerEvent('flagChanged', this.statusFlags);
		this.triggerEvent('progressActive', false);
		this.triggerEvent('progress', "Starting WebAPI", 0.0);

		// Probe function
		this.__probe = null;

		// Initialize WebAPI
		this.vmcp = vmcp;
		this.webapiInitialized = false;
		this.webapiSessionInitialized = false;
		this.__initWebAPI();

	};

	/**
	 * Initialize WebAPI connection
	 */
	AutonomousVM.prototype.__initWebAPI = function() {

		// We will (soon) be initialized
		this.webapiInitialized = true;

		// Contact CernVM WebAPI to prepare a VM for us
		CVM.startCVMWebAPI(
			(function(plugin) {

				// Something went wrong
				if (!plugin) {
					this.statusFlags.webapi = FLAG_ERROR;
					this.notifyFlagChange();
					// Forward analytics event
					if (analytics) analytics.fireEvent("webapi.error", {"error": "Cannot start WebAPI"} );
					return;
				}

				// Forward analytics event
				setTimeout(function() { // Delay it a bit
					if (analytics) analytics.fireEvent("webapi.available");
				}, 100);

				// Store webapi instance
				this.wa_plugin = plugin;

				// Bind progress messages
				plugin.addEventListener('started', this.__notifyProgressStart.bind(this));
				plugin.addEventListener('completed', this.__notifyProgressComplete.bind(this));
				plugin.addEventListener('progress', this.__notifyProgress.bind(this));
				plugin.addEventListener('failed', this.__notifyError.bind(this));
				plugin.addEventListener('disconnected', this.__notifyDisconnected.bind(this));

				// Update status flags
				this.statusFlags.webapi = FLAG_READY;
				this.statusFlags.webapi_session = FLAG_PENDING;
				this.notifyFlagChange();

				// Capture the first state event to identify the VM
				// status at creation time.
				this.__firstStateEvent = true;

				// Try to satisfy the current command
				this.satisfyCommand();

			}).bind(this)
		);
	}

	/**
	 * Reset monitor. configurations
	 */
	AutonomousVM.prototype.__resetMonitors = function() {

		// Reset probe
		if (this.__probe)
			this.__probe.bind(this)(null);

	}

	/**
	 * Initialize WebAPI session
	 */
	AutonomousVM.prototype.__initWebAPISession = function() {

		// We will be (soon) initialized
		this.webapiSessionInitialized = true;

		// Request session
		this.wa_plugin.requestSession(this.vmcp, (function(session) {

			// Something went wrong
			if (!session) {
				this.webapi_session.webapi = FLAG_ERROR;
				this.notifyFlagChange();

				// Forward analytics event
				if (analytics) analytics.fireEvent("webapi.error", {"error": "Cannot request session"} );

				return;
			}

			// Forward analytics event
			if (analytics) analytics.fireEvent("webapi.started");

			// Store session instance
			window.s = session;
			this.wa_session = session;
			this.wa_last_state = -1;

			// Fetch original session config
			this.config.memory = session.memory;
			this.config.cpus = session.cpus;
			this.config.cap = session.executionCap;

			// Bind to progress messages
			session.addEventListener('started', this.__notifyProgressStart.bind(this));
			session.addEventListener('completed', this.__notifyProgressComplete.bind(this));
			session.addEventListener('progress', this.__notifyProgress.bind(this));
			session.addEventListener('failed', this.__notifyError.bind(this));

			// Handle VM state changes
			session.addEventListener('stateChanged', this.__handleStateChange.bind(this));
			session.addEventListener('apiStateChanged', this.__handleApiStateChange.bind(this));

			// Fire all the session ready functions
			for (var i=0; i<this.__sessionReadyFn.length; i++)
				this.__sessionReadyFn[i]( session );

			// Let listeners know that we have a CernVM WebAPI
			this.triggerEvent('webapiStateChanged', true);

			// Update status flags
			this.statusFlags.webapi_session = FLAG_READY;
			this.notifyFlagChange();
			
			// Satisfy any pending command
			this.satisfyCommand();


		}).bind(this));

	}


	/**
	 * Fire the listener registered for the given event name
	 */
	AutonomousVM.prototype.triggerEvent = function() {
		var fnArgs = Array.prototype.slice.call(arguments),
			cbName = fnArgs.shift();

		// Register event initializer
		this.listenerInitializers[cbName] = (function(args) {
			return (function(cb) { cb.apply(this, args); }).bind(this);
		}).bind(this)(fnArgs);

		// Fire listener
		if (this.listeners[cbName]) 
			this.listeners[cbName].apply(this, fnArgs);

		// Fire multi-listeners
		if (this.multiListeners[cbName]) {
			for (var i=0; i<this.multiListeners[cbName].length; i++) {
				this.multiListeners[cbName][i].apply(this, fnArgs);
			}
		}

	}

	/**
	 * Forward to the status flag listener that a flag is changed
	 */
	AutonomousVM.prototype.notifyFlagChange = function() {
		// Fire listener
		this.triggerEvent('flagChanged', this.statusFlags);
	}

	/**
	 * Forward to the status flag listener that the plugin has disconnected
	 */
	AutonomousVM.prototype.__notifyDisconnected = function() {
		// Reset flags
		this.statusFlags.webapi = FLAG_NOT_READY;
		this.statusFlags.webapi_session = FLAG_NOT_READY;
		this.statusFlags.vm = FLAG_NOT_READY;
		this.statusFlags.api = FLAG_NOT_READY;
		this.statusFlags.agent = FLAG_NOT_READY;
		this.statusFlags.job = FLAG_NOT_READY;

		// Fire listener
		this.triggerEvent('progressActive', false);
		this.triggerEvent('progress', "Disconnected from WebAPI", 0.0);
		this.triggerEvent('error', "The connection with the CernVM WebAPI plugin was interrupted!");

		// De-initialize webapi
		this.webapiInitialized = false;
		this.webapi = null;
		this.webapiSessionInitialized = false;
		this.webapi_session = null;

		// Let everybody know that API has gone away
		this.triggerEvent('webapiStateChanged', false);

		// Very last event -> Notify flag change
		this.notifyFlagChange();

	}

	/**
	 * Forward to the progress start listener that a progress event stared
	 */
	AutonomousVM.prototype.__notifyProgressStart = function(message) {
		// Fire listeners
		this.triggerEvent('progressActive', true);
		this.triggerEvent('progress', message, 0.0);
	}

	/**
	 * Forward to the progress start listener that a progress event has completed
	 */
	AutonomousVM.prototype.__notifyProgressComplete = function(message) {
		// Fire listeners
		this.triggerEvent('progress', message, 1.0);
		this.triggerEvent('progressActive', false);
	}

	/**
	 * Forward to the progress start listener that a progress event has failed
	 */
	AutonomousVM.prototype.__notifyError = function(message) {

		// Keep last error
		this.lastErrorMessage = message;

		// Check what to fail from the flags
		if (this.statusFlags.webapi == FLAG_PENDING) {
			this.statusFlags.webapi = FLAG_ERROR;
		} else if (this.statusFlags.webapi_session == FLAG_PENDING) {
			this.statusFlags.webapi_session = FLAG_ERROR;
		} else {
			this.statusFlags.vm = FLAG_ERROR;
			this.statusFlags.api = FLAG_NOT_READY;
			this.statusFlags.agent = FLAG_NOT_READY;
			this.statusFlags.job = FLAG_NOT_READY;
		}

		// Fire listeners
		this.triggerEvent('progress', message, 1.0);
		this.triggerEvent('progressActive', false);
		this.triggerEvent('error', message);
		this.notifyFlagChange();

		// Forward analytics event
		if (analytics) analytics.fireEvent("webapi.error", {"error": message});

	}

	/**
	 * Forward to the progress start listener that a progress event is updated
	 */
	AutonomousVM.prototype.__notifyProgress = function(message, value) {
		// Fire listeners
		this.triggerEvent('progress', message, value);
	}

	/**
	 * Handle VM state change
	 */
	AutonomousVM.prototype.__handleStateChange = function(state) {

		// Only process real state changes
		if (this.wa_last_state == state) return;
		this.wa_last_state = state;

		// Handle first stateChange event (which lets us know if the VM is running)
		if (this.__firstStateEvent) {
			this.__vmStarted = (state == 5);
			this.__firstStateEvent = false;
		}

		// Forward state changed
		this.triggerEvent('vmStateChanged', state);

		// Handle flags
		if (state != 5 /*SS_RUNNING*/) {

			// VM exited running state, reset all other variables
			this.statusFlags.vm = FLAG_NOT_READY;
			this.statusFlags.api = FLAG_NOT_READY;
			this.statusFlags.agent = FLAG_NOT_READY;
			this.statusFlags.job = FLAG_NOT_READY;
			// Reset monitors
			this.__resetMonitors();
			// Notify changes
			this.triggerEvent('genericStateChanged', STATE_STOPPED);
			this.notifyFlagChange();

		} else {
			this.statusFlags.vm = FLAG_READY;
			this.triggerEvent('genericStateChanged', STATE_RUNNING);
			this.notifyFlagChange();
		}

		// Handle states for analytics
		if (state == 0) { /* SS_MISSING */
			// Forward event to the window
			if (analytics) analytics.fireEvent("vm.missing")
		} else if (state == 1) { /* SS_AVAILBLE */
			// Forward event to the window
			if (analytics) analytics.fireEvent("vm.available")
		} else if (state == 2) { /* SS_POWEROFF */
			// Forward event to the window
			if (analytics) analytics.fireEvent("vm.poweroff")
		} else if (state == 3) { /* SS_SAVED */
			// Forward event to the window
			if (analytics) analytics.fireEvent("vm.saved")
		} else if (state == 4) { /* SS_PAUSED */
			// Forward event to the window
			if (analytics) analytics.fireEvent("vm.paused")
		} else if (state == 5) { /* SS_RUNNING */
			// Forward event to the window
			if (analytics) analytics.fireEvent("vm.running")
		}

		// Try to satisfy a pending command
		this.satisfyCommand();
	}

	AutonomousVM.prototype.__handleApiStateChange = function(state, apiURL) {

		// Forward api state change
		this.triggerEvent('apiStateChanged', !!state, apiURL );

		// Update flags accordingly
		if (!state) {
			this.apiAvailable = false;
			this.statusFlags.api = FLAG_NOT_READY;
			this.statusFlags.agent = FLAG_NOT_READY;
			this.statusFlags.job = FLAG_NOT_READY;
			// Reset monitors
			this.__resetMonitors();
			// Notify changes
			this.notifyFlagChange();
			this.__stopStatusProbe();
		} else {
			this.apiAvailable = true;
			this.statusFlags.api = FLAG_READY;
			this.notifyFlagChange();
			this.__startStatusProbe(apiURL);
		}

		// Try to satisfy a pending command
		this.satisfyCommand();
		
	}

	/**
	 * Start a probe which is going to contact the VM endpoint and check
	 * periodically for the status of the software INSIDE the VM
	 */
	AutonomousVM.prototype.__startStatusProbe = function(refApiURL) {
		if (this.__statusProbeTimer) clearInterval(this.__statusProbeTimer);
		var apiURL = refApiURL;

		this.__statusProbeTimer = setInterval((function() {
			var nid = ++this.__nid;

			// Allow only one probe to run
			if (this.__probeBusy) return;
			this.__probeBusy = true;

			// Handle probe
			if (this.__probe)
				this.__probe.bind(this)( apiURL, (function() {
					// Release 'busy' flag upon completed
					this.__probeBusy = false;
				}).bind(this) );


		}).bind(this), 5000);
	}

	/**
	 * Stop a VM probe previously started with __startStatusProbe
	 */
	AutonomousVM.prototype.__stopStatusProbe = function() {
		clearInterval(this.__statusProbeTimer);
	}

	/**
	 * Set the probe function to use for getting inside information
	 */
	AutonomousVM.prototype.setProbe = function(probeFactory) {
		// Create a probe using the probe factory in our context
		this.__probe = probeFactory.bind(this)();
	}

	/**
	 * Get a property from the VM (asynchronously)
	 */
	AutonomousVM.prototype.getProperty = function(name, callback) {

		// Function to get property
		var fn = function(session) {
			// Fire callback with the value
			callback(session.getProperty(name));
		};

		// If we don't have a session, schedule, otherwise run it right away
		if (this.wa_session == null) {
			this.__sessionReadyFn.push(fn);
		} else {
			fn(this.wa_session);
		}
	}

	/**
	 * Set a property from the VM (asynchronously)
	 */
	AutonomousVM.prototype.setProperty = function(name, value, callback) {

		// Function to get property
		var fn = function(session) {
			// Set property
			session.setProperty(name, value);
			// Fire callback
			if (callback) callback();
		};

		// If we don't have a session, schedule, otherwise run it right away
		if (this.wa_session == null) {
			this.__sessionReadyFn.push(fn);
		} else {
			fn(this.wa_session);
		}
	}

	/**
	 * Register an event listeners
	 */
	AutonomousVM.prototype.setListener = function(name, func) {
		this.listeners[name] = func;
		if (this.listenerInitializers[name] !== undefined)
			this.listenerInitializers[name](func);
	}

	/** 
	 * Register multiple event listeners
	 */
	AutonomousVM.prototype.addListener = function(name, func) {
		if (!this.multiListeners[name]) this.multiListeners[name]=[];
		this.multiListeners[name].push(func);
	}

	/**
	 * Remove listener initializer on the particular event (acknowlege the event)
	 */
	AutonomousVM.prototype.acknowlege = function(name) {
		if (this.listenerInitializers[name] != undefined)
			delete this.listenerInitializers[name];
	}


	/**
	 * Try to satisfy the pending command
	 */
	AutonomousVM.prototype.satisfyCommand = function() {

		// Start webAPI if not initialized
		if (!this.webapiInitialized) {
			this.__initWebAPI();
			return;
		}

		// Open (new) session if required
		if (!this.webapiSessionInitialized) {
			this.__initWebAPISession();
			return;
		}

		// Check if we can satisfy the pending command
		if (this.pendingCommand == 0) return;
		if (this.wa_session == null) return;

		// Try to handle the pending command
		if ((this.pendingCommand == CMD_START) && (this.wa_session.state != 5 /*SS_RUNNING*/)) {
			
			// Start the VM
			this.wa_session.executionCap = this.config.cap;
			this.wa_session.start(this.config);
			this.triggerEvent('genericStateChanged', STATE_PENDING);

			// Update flags accordingly
			this.statusFlags.vm = FLAG_PENDING;
			this.statusFlags.api = FLAG_NOT_READY;
			this.statusFlags.agent = FLAG_NOT_READY;
			this.statusFlags.job = FLAG_NOT_READY;
			this.notifyFlagChange();

		} else if ((this.pendingCommand == CMD_STOP) && (this.wa_session.state == 5 /*SS_RUNNING*/)) {

			// Save VM on the disk
			this.wa_session.hibernate();

			// Update flags accordingly
			this.statusFlags.vm = FLAG_NOT_READY;
			this.statusFlags.api = FLAG_NOT_READY;
			this.statusFlags.agent = FLAG_NOT_READY;
			this.statusFlags.job = FLAG_NOT_READY;
			this.notifyFlagChange();

		} else if (this.pendingCommand == CMD_SET_CAP) {

			// Modify execution cap
			this.wa_session.executionCap = this.config.cap;

		} else if (this.pendingCommand == CMD_APPLY) {

			// Check what's the state of the VM and act accordingly
			if (this.wa_session.state >= 3 /* SS_SAVED,SS_PAUSED,SS_RUNNING */) {

				// Power off the VM
				this.wa_session.stop();
				this.triggerEvent('genericStateChanged', STATE_PENDING);

				// Update flags accordingly
				this.statusFlags.vm = FLAG_PENDING;
				this.statusFlags.api = FLAG_NOT_READY;
				this.statusFlags.agent = FLAG_NOT_READY;
				this.statusFlags.job = FLAG_NOT_READY;
				this.notifyFlagChange();

				// Schedule a start command if VM was running
				if (this.__vmStarted) {
					this.pendingCommand = CMD_START;
					return;
				}

			} else {

				// We are on SS_MISSING,SS_AVAILABLE or SS_POWEROFF,
				// which means that we don't have VM in locked state.

				// Start right away if the VM was started
				if (this.__vmStarted) {
					this.wa_session.executionCap = this.config.cap;
					this.wa_session.start(this.config);
					this.triggerEvent('genericStateChanged', STATE_PENDING);
				}

				// Update flags accordingly
				this.statusFlags.vm = FLAG_PENDING;
				this.statusFlags.api = FLAG_NOT_READY;
				this.statusFlags.agent = FLAG_NOT_READY;
				this.statusFlags.job = FLAG_NOT_READY;
				this.notifyFlagChange();

			}

		}

		// Reset pending command
		this.pendingCommand = 0;

	}

	/**
	 * Express the interest on starting the VM
	 */
	AutonomousVM.prototype.start = function() {
		this.pendingCommand = CMD_START;
		this.__vmStarted = true;
		this.triggerEvent('genericStateChanged', STATE_PENDING);
		this.satisfyCommand();
	}

	/**
	 * Express the interest on stopping the VM
	 */
	AutonomousVM.prototype.stop = function() {
		this.pendingCommand = CMD_STOP;
		this.__vmStarted = false;
		this.triggerEvent('genericStateChanged', STATE_PENDING);
		this.satisfyCommand();
	}

	/**
	 * Apply changes in the configuration
	 */
	AutonomousVM.prototype.apply = function(config) {
		var changed = false,
			capOnly = true;

		// Iterate on the config specified
		for (var k in config) {
			if (config.hasOwnProperty(k)) {
				// Skip unknown properties
				if (!this.config.hasOwnProperty[k]) continue;
				// Look for changes
				if (this.config[k] != config[k]) {
					// Apply
					this.config[k] = config[k];
					changed = true;
					// Look for non-cap-only changes
					if (k != 'cap') capOnly = false;
				}
			}
		}

		// Check the type of command to send
		if (changed) {
			// If only cap changed, update cap
			if (capOnly) {
				this.pendingCommand = CMD_SET_CAP;
			} else {
				this.pendingCommand = CMD_APPLY;
			}
			// In any case, there was a change, satisfy it
			this.satisfyCommand();
		}

	}

	/**
	 * Apply all changes in the VM
	 */
	AutonomousVM.prototype.applyAll = function() {
		this.pendingCommand = CMD_APPLY;
		this.satisfyCommand();
	}

	/**
	 * Apply only cap change in the VM
	 */
	AutonomousVM.prototype.applyCap = function() {
		this.pendingCommand = CMD_SET_CAP;
		this.satisfyCommand();
	}

	/**
	 * Remove the VM from user's computer
	 */
	AutonomousVM.prototype.destroy = function() {
		if (this.wa_session) {
			this.wa_session.close();
			this.wa_session = null;
			this.webapiSessionInitialized = false;
		}
	}


})(window);