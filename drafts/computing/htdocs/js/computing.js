
$(function() {

	// Create an autonomous VM that takes care of all the
	// interfacing with WebAPI
	var avm = window.avm = new CVM.AutonomousVM( 'http://test4theory.cern.ch/vmcp?config=challenge-dumbq' ),
		dqfe = window.dqfe = new DumbQ.Frontend(),
		cp = window.CreditPiggy;

	// Signaling on 
	$(dqfe).on('online', function(e, machine) {
		avm.statusFlags.agent = true;
		avm.notifyFlagChange();

		// Claim machine in CreditPiggy
		cp.claimWorker( machine['vmid'] );

	});
	$(dqfe).on('offline', function(e) {
		avm.statusFlags.agent = false;
		avm.notifyFlagChange();
	});
	$(dqfe).on('created.instance', function(e, instance) {
		console.log('Instance',instance)
		avm.statusFlags.job = true;
		avm.notifyFlagChange();
	});
	$(dqfe).on('destroyed.instance', function(e) {
		avm.statusFlags.job = false;
		avm.notifyFlagChange();
	});


	// Log a message
	function log(msg, clsName) {
		var l = $('<div></div>').html("[" + (new Date()).toLocaleTimeString() + "] " + msg);
		if (clsName) l.attr('class', clsName);
		$("#status-log").prepend(l);
	}

	// Bind listeners
	avm.addListener('progressActive', function(isActive) {

	});
	
	avm.addListener('progress', function(message, percent) {
		log(message);
	});

	avm.addListener('error', function(message) {
		log(message, 'text-danger');
	});

	avm.addListener('flagChanged', function(flags) {

		// State to class
		function classfor(id) {
			if (id == 0) return "label label-default";
			if (id == 1) return "label label-success";
			if (id == 2) return "label label-warning";
			if (id == 3) return "label label-info";
			if (id == 4) return "label label-danger";
		}

		// State to text
		function textfor(id) {
			if (id == 0) return "Not Ready";
			if (id == 1) return "Ready";
			if (id == 2) return "Inactive";
			if (id == 3) return "Pending";
			if (id == 4) return "Error";
		}

		// Update flag fields
		$("#status-webapi").attr("class", classfor(flags['webapi'])).text(textfor(flags['webapi']));
		$("#status-session").attr("class", classfor(flags['webapi_session'])).text(textfor(flags['webapi_session']));
		$("#status-machine").attr("class", classfor(flags['vm'])).text(textfor(flags['vm']));
		$("#status-api").attr("class", classfor(flags['api'])).text(textfor(flags['api']));
		$("#status-agent").attr("class", classfor(flags['agent'])).text(textfor(flags['agent']));
		$("#status-job").attr("class", classfor(flags['job'])).text(textfor(flags['job']));

	});

	avm.addListener('genericStateChanged', function(state) {
		log('VM is in state ' + state, 'text-muted');
	});

	avm.addListener('apiStateChanged', function(state, api) {
		if (state) {
			dqfe.enable(api);
			log('API available at <a href="'+api+'" target="_blank">'+api+'</a>', 'text-info');
		} else {
			dqfe.disable();
			log('API went offline', 'text-info');
		}
	});


});