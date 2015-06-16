
define(

	// Requirements
	[ "require", "jquery", "popcorn", "vas/media", "vas/core/ui", "vas/core/registry", "vas/core/base/agent", "ccl-tracker" ],

	/**
	 * Basic version of the home screen
	 *
	 * @exports basic/components/tvhead_agent
	 */
	function(require, $, Popcorn, Media, UI, R, VisualAgent, Analytics) {


		/**
		 * Define custom popcorn plugin that handles the explainations I/O
		 */
		Popcorn.plugin( "maskedFocus", function( options ) {

			var isVisible = true,
				focusElement = null,
				classAdded = null;

			return {
				start: function(event, track) {
					var pluginHost = options.pluginHost;

					// Fire onEnter if defined
					if (options['onEnter'] !== undefined)
						options['onEnter']();

					// Tell video host to aligh with the visual aid
					pluginHost.realign( options.focus );

					// Check if we have duration
					pluginHost.trigger('focusVisualAid',
							options.focus,
							options['end'] - options['start'],
							options['addClass'] || "",
							options['title']
						);

				},
				end: function(event, track) {
					var pluginHost = options.pluginHost;

					// Check if we have duration
					pluginHost.trigger('blurVisualAid');

					// Tell video host to realign without aids
					pluginHost.realign( false );

					// Fire onExit
					if (options['onExit'] !== undefined)
						options['onExit']();

				}
			}

		});

		/**
		 * @class
		 * @classdesc The basic home screen
		 */
		var TVhead = function( hostDOM ) {
			VisualAgent.call(this, hostDOM);

			// Hard-coded dimentions (from CSS)
			this.myWidth = 415;
			this.myHeight = 390;
			this.myHandsOffset = 300;

			// Properties
			this.activeAid = false;
			this.lastAid = false;
			this.lastSeed = Math.random();
			this.boundCallback = null;
			this.stopped = false;

			// Analytics helpers
			this.seqID = null;
			this.timeStarted = 0;

			// Prepare host dom
			this.hostDOM.addClass("tvhead");
			this.tvHead = $('<div class="head"></div>');
			this.tvBody = $('<div class="body"></div>');
			this.hostDOM.append( this.tvHead );
			this.hostDOM.append( this.tvBody );

			// Add skip button
			this.skipBtn = $('<a class="navbtn-skip">Skip <span class="glyphicon glyphicon-menu-right"></span></a>').appendTo(this.hostDOM.parent());
			this.skipBtn.click((function() {
				this.trigger('completed');
			}).bind(this));

		}
		TVhead.prototype = Object.create( VisualAgent.prototype );


		/**
		 * Reset in order to prepare for new animation
		 */
		VisualAgent.prototype.reset = function() {

			// If we are already reset, do nothing
			if (!this.eExplainPopcorn) return;

			// Remove listeners & release popcorn instance
			this.eExplainPopcorn.off('ended', this.boundCallback);
			this.eExplainPopcorn = undefined;

			// Empty tvhead
			this.tvHead.empty();

		}

		/**
		 * Aligh with the visual aid
		 */
		VisualAgent.prototype.realign = function( aid ) {

			this.activeAid = aid;

			// Reset fancy classes
			this.hostDOM.removeClass("left");
			this.hostDOM.removeClass("right");

			// Re-seed random number when aid changes
			// (Used for picking a random side when showing the TV-Head)
			if (aid != this.lastAid) {
				this.lastSeed = Math.random();
				this.lastAid = aid;
			}

			if (!aid) {

				// When we have no element, center ourselves
				this.hostDOM.css({
					'left': (this.width - this.myWidth)/2,
					'top': (this.height - this.myHeight)/2,
				});

				// Remove fancy classes
				this.hostDOM.removeClass("left");
				this.hostDOM.removeClass("right");

			} else {

				// Fetch aid object if we have the ID
				var aid = R.getVisualAid(aid);
				if (!aid) {

					// When no valid element is found, do the same as false
					this.activeAid = false;
					this.hostDOM.css({
						'left': (this.width - this.myWidth)/2,
						'top': (this.height - this.myHeight)/2,
					});

					return;
				}

				// Tollerances that might be hidden outside screen
				var tol_L = 26, tol_R = 26, tol_T = 21, tol_B = 156,
					pad = 10;

				// Get aid dimentions
				var aidOffset = $(aid).offset(),
					aidW = $(aid).width(), aidH = $(aid).height();

				// Align vertically
				var tY = aidOffset.top + aidH/2 - this.myHandsOffset;
				if (tY + tol_T < 0) {
					tY = -tol_T;
				} else if (tY + this.myHeight - tol_B > this.height) {
					tY = this.height - this.myHeight + tol_B;
				}

				// Align horizontally
				var tX = aidOffset.left + pad + aidW,
					posRight = aidOffset.left + pad + aidW,
					fitRight = (aidOffset.left + pad + aidW + this.myWidth - tol_R < this.width),
					posLeft = aidOffset.left - pad - this.myWidth,
					fitLeft = (aidOffset.left - pad - this.myWidth + tol_L > 0);

				// If we have both choices, pick one
				if (fitLeft && fitRight) {
					if (this.lastSeed > 0.5) {
						tX = posRight;
						this.hostDOM.addClass("left");
					} else {
						tX = posLeft;
						this.hostDOM.addClass("right");
					}
				} else if (!fitLeft && fitRight) {
					tX = posRight;
					this.hostDOM.addClass("left");
				} else if (fitLeft && !fitRight) {
					tX = posLeft;
					this.hostDOM.addClass("right");
				} else {

					// Check from which side we should squeeze
					var worseLeft = -tol_L, worseRight = this.width - this.myWidth + tol_R,
						distLeft = (worseLeft + this.myWidth) - aidOffset.left,
						distRight = (aidOffset.left + aidW) - worseRight;

					if (distLeft < distRight) {
						tX = worseLeft;
						this.hostDOM.addClass("right");
					} else {
						tX = worseRight;
						this.hostDOM.addClass("left");
					}

				}

				// Apply position
				this.hostDOM.css({ 'left': tX, 'top': tY });				

			}
		}

		/**
		 * Tutorial sequence is defined
		 */
		VisualAgent.prototype.onSequenceDefined = function(sequence, cb) {

			// We are not stopped
			this.stopped = false;
			this.seqID = sequence['id'];

			// Validate sequence structure
			if (!sequence) {
				console.error("TVhead: Invalid sequence specified");
			}
			if (!sequence.video) {
				console.error("TVhead: Video source not defined in sequence");
				return;
			}
			if (!sequence.aids) sequence.aids = [];

			// Prepare explaination panel for the video
			this.tvHead.empty();
			var videoHost = $('<div id="misc-presentation-video"></div>').css({
				'width': 360,
				'height': 203,
				'pointer-events': 'none'
			});
			this.tvHead.append(videoHost);

			// Prepare video wrapper
			var videoWrapper = Media.createVideoWrapper( sequence.video, videoHost );
			if (!videoWrapper) {

				// We are invalid
				this.eExplainPopcorn = null;
				cb();

				// Seuqnce completion right away
				setTimeout((function() {
					UI.logError("An error occured while trying to load the video object!");
					this.trigger('completed');
				}).bind(this), 100);

				// Do not continue
				return;
			}

			// Bind events
			$(videoWrapper).on('loaded', (function() {
				// Fire callback when we are loaded
				cb();
			}).bind(this));
			$(videoWrapper).on('timeout', (function() {
				// We are invalid
				this.eExplainPopcorn = null;
				cb();
				// Trigger error
				UI.logError("It seems the video is not loading. There might be a network error!");
				setTimeout((function() {
					this.trigger('completed');
				}).bind(this), 100);
			}).bind(this));

			// Initialize popcorn
			this.eExplainPopcorn = Popcorn(videoWrapper);

			// Bind timeline events to the popcorn
			var timeline = sequence.aids;
			for (var i=0; i<timeline.length; i++) {
				var entry = timeline[i];

				// Find where the current frame ends
				var frameEnd = entry.at+(entry['duration'] || 10);
				if (i<timeline.length-1) frameEnd=timeline[i+1].at;

				// Check what to do
				if (entry['focus'] !== undefined) {

					// Focus to the given element
					this.eExplainPopcorn.maskedFocus({

						// Required
						'start': entry.at,
						'end': frameEnd,
						'focus': entry.focus,
						'pluginHost': this,

						// Optional
						'title': entry['title'],
						'text': entry['text'],
						'placement': entry['placement'],
						'addClass': entry['addClass'],
						'onEnter': entry['onEnter'],
						'onExit': entry['onExit']

					});

				}

			}

			// Bind to ended event
			this.boundCallback = (function() {
				this.trigger('completed');
			}).bind(this);
			this.eExplainPopcorn.on('ended', this.boundCallback);

		}

		/**
		 * This function is called by the system when the tutorial should start.
		 */
		VisualAgent.prototype.onStart = function() {

			// If we are stopped, exit
			if (this.stopped) return;

			// Start the video
			if (this.eExplainPopcorn) {

				// Play
				this.eExplainPopcorn.play();

				// Restart timer when video is actually started
				this.eExplainPopcorn.on('playing', (function() {
					this.timeStarted = Date.now();
				}).bind(this));

			}


			// Fire chatroom send event (no details)
			this.timeStarted = Date.now();
			Analytics.restartTimer("interface-tutorial");
			Analytics.fireEvent("interface_tutorial.start", {
				"id": this.seqID,
			});

		};

		/**
		 * This function is called by the system when the tutorial should be
		 * interrupted.
		 */
		VisualAgent.prototype.onStop = function() {

			// We are now stopped
			if (this.stopped) return;
			this.stopped = true;

			// Stop the video
			if (this.eExplainPopcorn) {
				this.eExplainPopcorn.pause();

				// Forward analytics
				var playTime = Date.now() - this.timeStarted,
					mediaTime = this.eExplainPopcorn.duration() * 1000;

				// If ended map to mediaTime
				playTime = mediaTime;

				// Fire analytics event
				Analytics.fireEvent("interface_tutorial.percent", {
					"id": this.seqID,
					"time": playTime / 1000,
					"focused":  Analytics.stopTimer("interface-tutorial") / 1000,
					"percent": playTime / mediaTime,
				});
			}

			// Reset video
			this.reset();

		};

		/**
		 * Put us in the middle of the screen upon display
		 */
		TVhead.prototype.onWillShow = function( cb ) {

			// Remove fancy classes
			this.hostDOM.removeClass("left");
			this.hostDOM.removeClass("right");

			// Center view
			this.hostDOM.css({
				'left': (this.width - this.myWidth)/2,
				'top': (this.height - this.myHeight)/2,
			});

			// We are ready
			cb();
		}

		/**
		 * The host element has changed dimentions
		 */
		TVhead.prototype.onResize = function( width, height ) {

			this.width = width;
			this.height = height;

			this.realign( this.activeAid );
		}


		// Register home screen
		R.registerComponent( "tutorial.agent", TVhead, 1 );

	}

);