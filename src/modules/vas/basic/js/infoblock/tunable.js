define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/user", "vas/core/base/data_widget", "core/analytics/analytics" ], 

	/**
	 * This is the default component for displaying information regarding a tunable
	 *
 	 * @exports vas-basic/infoblock/tunable
	 */
	function(config, R, User, DataWidget, Analytics) {

		/**
		 * The default tunable body class
		 */
		var TunableBody = function(hostDOM) {

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
		TunableBody.prototype = Object.create( DataWidget.prototype );

		/**
		 * Define the metadata to use for description
		 */
		TunableBody.prototype.onMetaUpdate = function( meta ) {

			// Prepare body DOM
			this.bodyDOM.empty();
			this.bodyDOM.append($('<div>'+meta['desc']+'</div>'));

			// Prepare 'more' links
			this.moreLinks.empty();

			// Put an 'explain this' button which triggers the 'explain' event
			if (meta['book']) {
				var l = $('<a href="do:show-more"><span class="uicon uicon-explain"></span> Explain this ...</a>');
				l.click((function(e) {
					e.preventDefault();
					e.stopPropagation();
					this.trigger('showBook', meta['book'] );

					// Mark first-time as seen
					User.markFirstTimeAsSeen("ui.infobook.learnmore");

					// Fire analytics event
					Analytics.fireEvent("tuning.values.learn", {
						'id': meta['name']
					});

				}).bind(this));
				this.moreLinks.append( l );
				
				// Mark as important when seen first time
				if (!User.isFirstTimeSeen("ui.infobook.learnmore")) {
					l.addClass("important");
				}
			}


		}

		// Store tunable infoblock component on registry
		R.registerComponent( 'infoblock.tunable', TunableBody, 1 );

	}

);