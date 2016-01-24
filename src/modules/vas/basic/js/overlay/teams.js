define(

	// Dependencies
	[
		"jquery", 
		"vas/config",
		"core/ui/tabs",
		"core/ui/table",
		"core/util/geocode",
		"vas/core/base/components/overlays", 
		"vas/core/registry", 
		"vas/core/user",
		"text!vas/basic/tpl/overlay/teams.html"
	],

	/**
	 * Basic version of the teams screen
	 *
	 * @exports vas-basic/screen/teams
	 */
	function ($, Config, Tabs, Table, Geocode, C, R, User, tpl) {

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
		 * @classdesc The basic teams screen overlay
         * @augments module:vas-core/base/components/overlays~TeamsOverlay
         * @template vas/basic/tpl/overlay/teams.html
         * @registry overlay.teams
		 */
		var DefaultTeamsOverlay = function (hostDOM) {
			C.TeamsOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("teams");
			this.loadTemplate(tpl);
            this.renderView();

            // Init tabs controller
            this.tabsController = new Tabs(
            		this.select(".tab-body"), this.select(".tab-bar > ul")
            	);

            // Init Resources Table
            this.tableResources = 
            	new Table(
            		this.select(".table-resources")
            	)
	            .addColumn( "", "Status", 1,
	            	function(id, data){ 
	            		if (data['jobs_failed'] >= data['jobs_succeed']) {
		            		return $('<img src="modules/vas/basic/img/icons/bullet_error.png" />');
	            		} else {
		            		return $('<img src="modules/vas/basic/img/icons/bullet_green.png" />');
	            		} })
	            .addColumn( "uuid", "ID", 4, 
	            	function(id, data){ return $('<a target="_blank"></a>')
	            		.attr("href","https://www.google.com/maps?q="+data['latlng'])
	            		.text( String(id).split("/")[1] ); })
	            .addColumn( "lastActivity", "Last Activity", 2,
	            	function(ts){ return $('<span></span>').text( dateFromTs(ts) ); })
	            .addColumn( "latlng", "Location", 2,
	            	function(text, data){ 
	            		return $('<span class="do-geocode"></span>').text(text);
	            	})
	            .addColumn( "jobs_succeed", "Good", 1 )
	            .addColumn( "jobs_failed", "Bad", 1 )
	            .addColumn( "slots", "Slots", 1 );

            // Init Resources Table
            this.tableMembers = 
            	new Table(
            		this.select(".table-members")
            	)
	            .addColumn( "", "Status", 1,
	            	function(id, data){ 
	            		return $('<img src="modules/vas/basic/img/icons/user.png" />');
	            	})
	            .addColumn( "name", "Name", 7, "left",
	            	function(name, data){ return $('<a target="_blank"></a>')
	            		.attr("href",Config['forum_vas_api'] + "?auth=" + User.profile['token'] + "&profile="+data['name'])
	            		.text( name ); })
	            .addColumn( "papers", "Papers", 2 )
	            .addColumn( "totalPoints", "Points", 2 )

            // Init Papers Table
            this.tablePapers = 
            	new Table(
            		this.select(".table-papers")
            	)
	            .addColumn( "", "Status", 1,
	            	function(id, data){ 
	            		return $('<img src="modules/vas/basic/img/icons/book_open.png" />');
	            	})
	            .addColumn( "title", "Title", 7, "left" )
	            .addColumn( "fit", "Score", 2 )
	            .addColumn( "citations", "Citations", 2 );

			///////////////////////////////
			// View Control
			///////////////////////////////

		}

		DefaultTeamsOverlay.prototype = Object.create(C.TeamsOverlay.prototype);

		//////////////////////////////////////////////////////////////
		// Helper functions
		//////////////////////////////////////////////////////////////

		/**
		 * Geocode IP to city
		 */
		DefaultTeamsOverlay.prototype.geocodeResourceLocations = function() {

			// Get next item to geocode
			var item = this.select(".table-resources .do-geocode");
			if (item.length == 0) return;

			// Replace contents with geocoded city
			Geocode.geocodeCity( item.text(), function(city) {
				item
					.removeClass("do-geocode")
					.text(city);
			});

			// Chained calls
			setTimeout(this.geocodeResourceLocations.bind(this), 1);

		}

		/**
		 * Update details of all windows
		 */
		DefaultTeamsOverlay.prototype.updateDetails = function(cb) {

			// Completed countdown
			var left = 2,
				cb_countdown = function() {
					if (--left == 0) cb();
				};

			// Perform parallel requests
			User.getTeamResources((function(data) {

				// Update resources
				console.log("Resources:",data);
				this.tableResources.set( data );
				this.geocodeResourceLocations();

				cb_countdown();
			}).bind(this));
			User.getTeamDetails((function(data) {

				// Update details
				console.log("Details:",data);
				this.tableMembers.set( data['members'] );

				cb_countdown();
			}).bind(this));

		}

		//////////////////////////////////////////////////////////////
		// Base Callback Handlers 
		//////////////////////////////////////////////////////////////

		/**
		 * Populate the interface before showing it
		 *
		 * @param {function} cb - The callback to fire when the website is loaded
		 */
		DefaultTeamsOverlay.prototype.onWillShow = function(cb) {
			this.updateDetails(cb);
		}

		// Register login screen
		R.registerComponent("overlay.teams", DefaultTeamsOverlay, 1);

	}
);
