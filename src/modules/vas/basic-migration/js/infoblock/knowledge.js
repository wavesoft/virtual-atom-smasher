define(

	// Dependencies
	["jquery", "vas/core/registry","vas/core/base/data_widget", "vas/core/user" ], 

	/**
	 * This is the default component for displaying information regarding a knowledge topic
	 *
 	 * @exports vas-basic/infoblock/knowledge
	 */
	function(config, R, DataWidget, User) {

		/**
		 * The default knowledge body class
		 */
		var KnowlegeBody = function(hostDOM) {

			// Initialize widget
			DataWidget.call(this, hostDOM);

			// Prepare infoblock
			this.element = $('<div class="body-more"></div>');
			hostDOM.append(this.element);
			this.bodyDOM = $('<div class="body"></div>');
			this.moreLinks = $('<div class="more"></div>');
			this.element.append(this.bodyDOM);
			this.element.append(this.moreLinks);

		};

		// Subclass from ObservableWidget
		KnowlegeBody.prototype = Object.create( DataWidget.prototype );

		/**
		 * Define the metadata to use for description
		 */
		KnowlegeBody.prototype.onMetaUpdate = function( meta ) {

			// Prepare 'more' links
			this.moreLinks.empty();

			// Prepare body DOM
			this.bodyDOM.empty();
			this.bodyDOM.append($('<div>'+meta['desc']+'</div>'));

			// If it's not enabled show how much credits it costs
			if (!meta['enabled']) {

				// Put credits button
				var l = $('<a href="do:show-more"><span class="uicon uicon-money"></span> Unlock for <strong>' + meta['cost'] + '</strong> credits</a>');
				l.click((function(e) {
					e.preventDefault();
					e.stopPropagation();
					this.trigger('unlock', meta['id']);
				}).bind(this));
				this.moreLinks.append( l );

			} else {

				// Check for re-triggerable actions
				var actions = meta['actions'];

				// Put an 'explain this' button which triggers the 'explain' event
				if (meta['book']) {
					var l = $('<a href="do:show-more"><span class="uicon uicon-book"></span> Learn More</a>');
					l.click((function(e) {
						e.preventDefault();
						e.stopPropagation();
						this.trigger('explain', meta['book'] );
					}).bind(this));
					this.moreLinks.append( l );
				}

				// Put a 'Course' button if we have a course
				if (actions['course'] != undefined) {
					var l = $('<a href="do:show-more"><span class="uicon uicon-course"></span> Course</a>');
					l.click((function(e) {
						e.preventDefault();
						e.stopPropagation();
						this.trigger('course', actions['course'] );
					}).bind(this));
					this.moreLinks.append( l );
				}

				// Put a 'Tutorial' button if we have a tutorial
				if (actions['tutorial']) {
					var l = $('<a href="do:show-more"><span class="uicon uicon-play"></span> Tutorial</a>');
					l.click((function(e) {
						e.preventDefault();
						e.stopPropagation();
						this.trigger('tutorial', actions['tutorial'] );
					}).bind(this));
					this.moreLinks.append( l );
				}

			}


		}

		// Store tunable infoblock component on registry
		R.registerComponent( 'infoblock.knowledge', KnowlegeBody, 1 );

	}

);