
$(function() {

	// Create an autonomous VM that takes care of all the
	// interfacing with WebAPI
	var avm = window.avm = new CVM.AutonomousVM( 'http://test4theory.cern.ch/vmcp?config=test-64-local&uuid=123&group=testers' );

	// Bind listeners
	avm.addListener('progressActive', function(isActive) {

	});
	
	avm.addListener('progress', function(message, percent) {
		var text = $('#status-log').text();
		text = "[" + (new Date()).toLocaleTimeString() + "] " + message + "\n" + text;
		$('#status-log').text(text);
	});

	avm.addListener('failed', function(message) {
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
			if (id == 0) return "Unknown";
			if (id == 1) return "Ready";
			if (id == 2) return "Inactive";
			if (id == 3) return "Pending";
			if (id == 4) return "Error";
		}

		$("#status-webapi").attr("class", classfor(flags['webapi'])).text(textfor(flags['webapi']));
		$("#status-session").attr("class", classfor(flags['webapi_session'])).text(textfor(flags['webapi_session']));
		$("#status-machine").attr("class", classfor(flags['vm'])).text(textfor(flags['vm']));
		$("#status-agent").attr("class", classfor(flags['api'])).text(textfor(flags['api']));
		$("#status-job").attr("class", classfor(flags['agent'])).text(textfor(flags['agent']));

	});

	avm.addListener('genericStateChanged', function(state) {

	});


});