define(

	// Dependencies
	[
		"jquery", 
		"core/ui/table",
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"vas/core/user",
		"vas/config",
		"text!vas/basic/tpl/overlay/profile.html"
	],

	/**
	 * Basic version of the profile screen
	 *
	 * @exports vas-basic/overlay/profile
	 */
	function ($, Table, C, R, User, Config, tpl) {

		function dateFromTs(ts) {
    		var date = new Date(ts*1000);
    		return (
    			('0'+date.getDate()).substr(-2) + '/' +
    			('0'+date.getMonth()).substr(-2) + '/' +
    				 date.getFullYear() + ' ' +
    			('0'+date.getHours()).substr(-2) + ':' +
    			('0'+date.getMinutes()).substr(-2) + ':' +
    			('0'+date.getSeconds()).substr(-2)
    		);
		}

		/**
		 * @class
		 * @classdesc The basic profile screen overlay
         * @augments module:vas-core/base/components/overlays~ProfileOverlay
         * @template vas/basic/tpl/overlay/profile.html
         * @registry overlay.profile
		 */
		var DefaultProfileOverlay = function (hostDOM) {
			C.ProfileOverlay.call(this, hostDOM);
			window.po = this;

			// Load view template and plutins
			hostDOM.addClass("profile");
			this.loadTemplate(tpl);
            this.renderView();

			///////////////////////////////
			// View Control
			///////////////////////////////

			//
			// Create a table controller
			//
			this.tableController = new Table( this.select(".pm-table") );
			this.tableController
				.addColumn("dateline", "Date", 3,
	            	function(ts){ return $('<span></span>').text( dateFromTs(ts) ); })
				.addColumn("from", "From", 3)
				.addColumn("from", "Subject", 6,
					function(text, data) { return $('<a target="_blank"></a>')
						.text(text)
						.attr("href", Config.forum_vas_api + '?auth=' + User.profile['token'] + '&pm=' + data.id ) });

		}

		DefaultProfileOverlay.prototype = Object.create(C.ProfileOverlay.prototype);

		/**
		 * Update on display
		 */
		DefaultProfileOverlay.prototype.onWillShow = function(cb) {

			this.select(".value-title").text( User.profile.displayName );
			this.select(".value-icon").css({
				"background-image": "url(modules/vas/basic/img/avatars/" + User.profile.avatar + ")"
			});
			this.select(".value-score").text( User.profile.totalPoints );

			// Stringify play time
			var time = User.profile.playtime / 1000, 
				timeStr = time.toFixed(0) + " seconds";
			if (time > 60) { time /= 60; timeStr = time.toFixed(0) + " hours" };
			if (time > 24) { time /= 24; timeStr = time.toFixed(0) + " days" };
			if (time > 30) { time /= 30; timeStr = time.toFixed(0) + " months" };
			this.select(".value-time").text( "for " + timeStr );

			// Update url on forum button
			this.select(".btn-forum")
				.attr("href", Config.forum_vas_api + '?auth=' + User.profile['token'] + '&profile=' + User.profile['displayName'] );

			// Get private messages
			user.getUserMessages((function(data) {

				// Set data
				this.tableController.set(data);

				// Callback
				cb();

			}).bind(this));

		}

		// Register login screen
		R.registerComponent("overlay.profile", DefaultProfileOverlay, 1);

	}
);
