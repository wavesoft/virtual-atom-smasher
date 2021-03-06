
/**
 * [core/media] - Virtual Atom Smasher Media
 */
define("vas/media", [ "require", "popcorn" ], 
	function(require, Popcorn) {

	// Media configuration
	var Media = {
		"img" 		: require.toUrl("../img"),
		"mov" 		: require.toUrl("../mov"),

		"_seqidx"	: 1,
	};

	/**
	 * Create an appropriate popcorn video wrapper for the url
	 * specified.
	 */
	Media.createVideoWrapper = function( url, hostElement ) {
		var videoWrapper = null,
			host = $(hostElement),
			timedOut = false,
			timeoutTimer = null;

		// Clear host element
		host.empty();

		// Prepare video element according to url
		if (url.match( /[\/.]youtube\./i )) {

			//
			// [*.youtube.*] - YouTube Video Source
			// 
			// Create a popcorn video wrapper
			//
			videoWrapper = Popcorn.HTMLYouTubeVideoElement( host[0] );
			videoWrapper.src = url;

		} else if (url.match( /[\/.]vimeo\./i )) {

			//
			// [*.vimeo.*] - Vimeo Video Source
			// 
			// Create a vimeo video wrapper
			//
			videoWrapper = Popcorn.HTMLVimeoVideoElement( host[0] );
			videoWrapper.src = url;

		} else if (url.match( /^vas:/i )) {

			//
			// [vas:*] - HTML5 Video from VAS resources
			// 

			// Get local media URL
			var localURL = Media.mov + "/" + url.substring(6);

			// Create smart wrapper
			videoWrapper = Popcorn.smart( host[0], localURL );

		} else {

			// On error return null
			return null;

		}

		// Register callbacks
		videoWrapper.addEventListener('loadeddata', function() {
			clearTimeout(timeoutTimer);
			if (timedOut) return;
			$(videoWrapper).triggerHandler('loaded');
		});

		// Register timeout
		timeoutTimer = setTimeout(function() {
			timedOut = true;
			$(videoWrapper).triggerHandler('timeout');
		}, 10000);
		

		// Return video wrapper
		return videoWrapper;

	}

	/**
	 * Return a media image
	 */
	Media.image = function(path) {
		return require.toUrl( "vas/media/img/" + path );
	}

	/**
	 * Return a media video
	 */
	Media.video = function(path) {
		return require.toUrl( "vas/media/video/" + path );
	}

	// Return module configuration
	return Media;

});
