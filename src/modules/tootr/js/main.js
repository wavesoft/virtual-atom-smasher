define(function() {

	var Tootr = {
		'apiURL' : '/vas/tootr'
	};

	/**
	 * Configure TootR interface
	 */
	Tootr.configure = function(config) {
		var cfg = config || {};
		this.apiURL = config['apiURL'];
	}

	/**
	 * Place TootR in the given component
	 */
	Tootr.register = function(element) {
		require(["tootr/canvas"], function(Canvas) {
			var canvas = new Canvas(element);
		});
	}

	// Return TootR Interface
	return Tootr;

});