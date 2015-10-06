

define(

	// Requirements
	["jquery", "popcorn", "vas/media", "vas/core/db", "vas/core/ui", "vas/config", "vas/core/registry", "vas/core/base/components", "vas/core/user"],

	/**
	 * Basic version of the home screen
	 *
	 * @exports vas-basic/screen/cinematic
	 */
	function($, Popcorn, Media, DB, UI, config, R,C, User) {

		/**
		 * This screen can show a video cinematic and then
		 * automatically trigger a next action.
		 * 
		 * @class
		 * @classdesc The basic cinematic screen
		 * @registry screen.cinematic
		 */
		var CinematicScreen = function( hostDOM ) {
			C.CinematicScreen.call(this, hostDOM);

			// Prepare the video element for the cinematic screen
			this.videoElm = null;
			this.videoURL = "";

			// Mark host screen for cinematic
			this.hostDOM.addClass("cinematic");

			// Prepare the container for the video
			this.videoContainer = $('<div class="video-container" id="cinematic-video-host"></div>').appendTo(this.hostDOM);
			this.videoBlocker = $('<div class="video-blocker"></div>').appendTo(this.hostDOM);
			this.skipVideo = $('<a href="javascript:;" class="nav-button nav-button-skip">Skip <span class="glyphicon glyphicon-menu-right"></span></a>').appendTo(this.hostDOM);

			// Set a null completed callback
			this.completedCallback = null;
			this.popcorn = null;
			this.isPlaying = false;

			// Handle skip video
			this.skipVideo.click((function(e) {
				e.stopPropagation();
				e.preventDefault();

				this.isPlaying = false;
				this.trigger('completed');
				this.trigger('sequence.next', 'completed'); // [SEQUENCING]
				if (this.completedCallback)
					this.completedCallback();
			}).bind(this));

			// Add pause and rewind
			this.pauseResumeBtn = $('<a href="javascript:;" class="nav-button nav-button-playback"><span class="glyphicon glyphicon-pause"></span></a>').appendTo(this.hostDOM);
			this.pauseResumeBtn.click((function() {
				if (this.isPlaying) {
					if (this.popcorn) this.popcorn.pause();
					this.isPlaying = false;
					this.pauseResumeBtn.html('<span class="glyphicon glyphicon-play"></span>');
				} else {
					if (this.popcorn) this.popcorn.play();
					this.isPlaying = true;
					this.pauseResumeBtn.html('<span class="glyphicon glyphicon-pause"></span>');
				}
			}).bind(this));

		}
		CinematicScreen.prototype = Object.create( C.CinematicScreen.prototype );

		/**
		 * Override the completed callback
		 */
		CinematicScreen.prototype.onCallbackDefined = function( cb_ready ) {
			this.completedCallback = cb_ready;
		}

		/**
		 * Setup cinematic video
		 */
		CinematicScreen.prototype.onCinematicDefined = function( video, cb_ready ) {

			// Dispose previous video
			this.videoContainer.empty();

			// Prepare for the next video
			this.videoURL = video;
			cb_ready();

		}

		/**
		 * [SEQUENCING] Support sequencing
		 */
		CinematicScreen.prototype.onSequenceConfig = function(config, callback) {
			// Forward to onCinematicDefined
			this.onCinematicDefined( config['video'], callback );
		}

		/**
		 * Resize video
		 */
		CinematicScreen.prototype.onResize = function(w,h) {
			this.width = w;
			this.height = h;
		}

		/**
		 * Start video when to be shown
		 */
		CinematicScreen.prototype.onWillShow = function(cb) {

			// Reset playback button status
			this.pauseResumeBtn.html('<span class="glyphicon glyphicon-pause"></span>');

			// Reusable function for completion callback
			var complete_callback = (function() {
				this.trigger('completed');
				this.trigger('sequence.next', 'completed'); // [SEQUENCING]
				this.isPlaying = false;
				if (this.completedCallback)
					this.completedCallback();
			});

			// Create a popcorn video wrapper
			var videoWrapper = Media.createVideoWrapper( this.videoURL, this.videoContainer );
			if (!videoWrapper) {
				// We are invalid
				this.popcorn = null;
				cb();
				// Seuqnce completion right away
				UI.logError("An error occured while trying to load the video object!");
				setTimeout(complete_callback(), 100);
				// Do not continue
				return;
			}

			// Bind events
			$(videoWrapper).on('loaded', function() {
				cb();
			});
			$(videoWrapper).on('timeout', function() {
				// We are invalid
				this.popcorn = null;
				cb();
				// Seuqnce completion right away
				UI.logError("It seems the video is not loading. There might be a network error!");
				setTimeout(complete_callback(), 100);
			});

			// Create a popcorn instance
			this.popcorn = Popcorn( videoWrapper );
			this.popcorn.on('ended', complete_callback);
		}


		/**
		 * Start video when shown
		 */
		CinematicScreen.prototype.onShown = function() {
			if (this.popcorn) this.popcorn.play();
			this.isPlaying = true;
		}

		/**
		 * Start video when to be hidden
		 */
		CinematicScreen.prototype.onWillHide = function(cb) {
			if (this.popcorn) this.popcorn.pause();
			this.isPlaying = false;
			cb();
		}

		// Register screen component on the registry
		R.registerComponent( 'screen.cinematic', CinematicScreen, 1 );

	}

);