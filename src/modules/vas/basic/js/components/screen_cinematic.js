

define(

	// Requirements
	["jquery", "popcorn", "vas/core/db", "vas/core/ui", "vas/config", "vas/core/registry", "vas/core/base/components", "vas/core/user"],

	/**
	 * Basic version of the home screen
	 *
	 * @exports basic/components/explain_screen
	 */
	function($, Popcorn, DB, UI, config, R,C, User) {

		/**
		 * @class
		 * @classdesc The basic home screen
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
			this.skipVideo = $('<a href="javascript:;" class="navbtn-skip">Skip <span class="glyphicon glyphicon-menu-right"></span></a>').appendTo(this.hostDOM);

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
			this.pauseResumeBtn = $('<a href="javascript:;" class="navbtn-playback"><span class="glyphicon glyphicon-pause"></span></a>').appendTo(this.hostDOM);
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

			// Create a popcorn video wrapper
			var videoWrapper = Popcorn.HTMLYouTubeVideoElement( "#cinematic-video-host" );
			videoWrapper.src = this.videoURL;
			videoWrapper.addEventListener('loadeddata', function() {
				cb();
			});

			// Create a popcorn instance
			this.popcorn = Popcorn( videoWrapper );
			this.popcorn.on('ended', (function() {
				this.trigger('completed');
				this.trigger('sequence.next', 'completed'); // [SEQUENCING]
				this.isPlaying = false;
				if (this.completedCallback)
					this.completedCallback();
			}).bind(this));
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