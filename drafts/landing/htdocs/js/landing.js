
$(function() {

	/**
	 * Realign DOM elements
	 */
	function realignDOM() {
		var winHeight = $(window).innerHeight(),
			winWidth = $(window).innerWidth();
		if (winWidth < 768) {
			$(".full-height").css("min-height", 0);
		} else {
			$(".full-height").css("min-height", winHeight);
		}
	}

	/**
	 * Realign parallax elements
	 */
	var parallaxElements = [];
	$(".section.full-height").each(function(host) {
		var host = $(host);
		host.find('.section-parallax').each(function(elm) {
			parallaxElements.push({
				'host': host,
				 'elm': $(elm),
				   'y': parseInt($(elm).data('y')), // Y-Position
			       'd': parseInt($(elm).data('d'))  // Depth
			});
		});
	});
	function realignParallax() {
		var h = $(window).innerHeight();
		for (var i=0; i<parallaxElements.length; i++) {
			var e = parallaxElements[i],
				pos = e.host.position(),
				y = 0;

			if (e.y < 0) {

			} else {

			}
		}
	}

	/**
	 * Bind to DOM events
	 */
	$(window).resize(function() {
		realignDOM();
	});
	realignDOM();

});