define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry", "vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/books.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/books
	 */
	function($, require, R, View, User, tplBooks) {

		/**
		 * Helper to format time
		 */
		function formatTime(totalSec) {
			var hours = parseInt( totalSec / 3600 ) % 24;
			var minutes = parseInt( totalSec / 60 ) % 60;
			var seconds = totalSec % 60;
			return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		}

		/**
		 * The default tunable body class
		 */
		var ProfileBooks = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-books");
			this.loadTemplate(tplBooks);

			this.handleDoURL('showBook', (function(paper) {
				this.trigger('showBook', paper);
			}).bind(this));
			this.handleDoURL('takeExam', (function() {
				this.trigger('takeExam');
			}).bind(this));

			// Cooldown timer
			this.cooldownTimeLeft = 0;

			// Handle profile changes in order to check if we
			// can (or cannot) take an exam
			var applyProfile = (function(profile) {

				// Check if cooldown timer is there
				var cooldowns = profile['state']['cooldown'] || {};
				if (!cooldowns['book-exam']) {
					this.cooldownTimeLeft = 0;
					this.updateTakeTest();
					return;
				}

				// Get difference
				this.cooldownTimeLeft = parseInt(cooldowns['book-exam']) - parseInt(Date.now()/1000);
				if (this.cooldownTimeLeft < 0) {
					this.cooldownTimeLeft = 0;
				}

				// Update the take test button
				this.updateTakeTest();

			}).bind(this);

			User.on('profile', (function(profile) {
				applyProfile(profile);
				setTimeout((function() {
					this.reloadBooks();
				}).bind(this), 500);
			}).bind(this));
			applyProfile(User.profile);

			// Update cooldown timer
			setInterval((function() {
				
				// When zero this is not functional
				if (this.cooldownTimeLeft == 0) return;

				// Cooldown
				this.cooldownTimeLeft--;
				this.updateTakeTest();

			}).bind(this), 1000);

			// Render view
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileBooks.prototype = Object.create( View.prototype );

		/**
		 * Update cooldown timer
		 */
		ProfileBooks.prototype.updateTakeTest = function() {
			var btnExam = this.select("button.btn-master");
			if (this.cooldownTimeLeft == 0) {
				btnExam.attr("class", "btn-master b-purple");
				btnExam.removeAttr("disabled");
				btnExam.html('<span class="glyphicon glyphicon-education"></span> Master Your Knowledge');
			} else {
				btnExam.attr("class", "btn-master b-gray");
				btnExam.attr("disabled", "disabled");
				btnExam.html('<span class="glyphicon glyphicon-education"></span> You can take an exam again in '+formatTime(this.cooldownTimeLeft));
			}
		}

		/**
		 * Update books on show
		 */
		ProfileBooks.prototype.reloadBooks = function(cb) {
			User.getProfileBooks((function(books) {
				var seenCount = 0,
					masterCount = 0;

				// Expand states
				for (var i=0; i<books.length; i++) {
					books[i].isNew = (books[i]['state'] == 0);
					books[i].isVisisted = (books[i]['state'] == 1);
					books[i].isMastered = (books[i]['state'] == 2);
					if (books[i]['state'] == 1) {
						seenCount += 1;
					} else if (books[i]['state'] == 2) {
						seenCount += 1;
						masterCount += 1;
					}
				}

				this.setViewData('books', books);
				this.setViewData('progress_seen', parseInt(seenCount*100/books.length)+'%' );
				this.setViewData('progress_master', parseInt(masterCount*100/books.length)+'%' );
				this.renderView();
				this.updateTakeTest();
				if (cb) cb();

			}).bind(this));
		}

		/**
		 * Update books on show
		 */
		ProfileBooks.prototype.onWillShow = function(cb) {
			this.reloadBooks( cb );
		}

		// Store overlay component on registry
		R.registerComponent( 'profilepart.book', ProfileBooks, 1 );

	}

);