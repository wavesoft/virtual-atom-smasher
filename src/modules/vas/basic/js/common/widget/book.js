define(

	// Dependencies
	["jquery", "core/ui/tabs", "vas/core/registry", "vas/config", "vas/core/user", "vas/core/base/components/widget_book",
	 "text!vas/basic/tpl/widget/book.html" ], 

	/**
	 * This is a reusable component for showing the multi-tabbed book interface.
	 *
 	 * @exports vas-basic/common/widget/book
	 */
	function($, Tabs, R, Config, User, BookWidget, tpl) {

		/**
		 * This is a reusable component for showing the multi-tabbed book interface.
		 * 
		 * @class
		 * @registry widget.book
		 */
		var DefaultBookWidget = function(hostDOM) {

			// Initialize widget
			BookWidget.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("widget-book");
			this.loadTemplate(tpl);
            this.renderView();

            // Setup buttons
            this.tabsController = new Tabs(
            		this.select(".tab-body"),
            		this.select(".tab-bar > ul")
            	);

            // Select description tab
            this.tabsController.selectTab("description");

            // Load first sub-tab only when component is clicked
            this.select(".tab-material, .tab-research, .tab-discuss").click((function(e) {
            	var bodyElm = this.select(".body-" + $(e.target).data('id') );
            	// Click first unselected tab
            	if (bodyElm.find(".horiz-tab-bar > ul > li.active").length == 0)
            		bodyElm.find(".horiz-tab-bar > ul > li:first").click();
            }).bind(this));

		};

		// Subclass from BookWidget
		DefaultBookWidget.prototype = Object.create( BookWidget.prototype );

		////////////////////////////////////////////////////////////
		//            Implementation of the BookWidget            //
		////////////////////////////////////////////////////////////

		/**
		 * Define the first (description) tab
		 *
		 * @param {string} title - The title of the description
		 * @param {string} body - The HTML content to render
		 */
		DefaultBookWidget.prototype.onDefineDescription = function( title, body ) {

			// Update description
			var body = this.select(".body-description").empty()
				.append($('<h1><span class="glyphicon glyphicon-book"></span> ' + title + '</h1>'))
				.append($('<div></div>').html(body));

			// Bind on links
			body.find(".book-link").click((function(e) {
				// Express the request to explain the specified book
				e.preventDefault(); e.stopPropagation();
				this.trigger("explain", $(e.target).data("book") );
			}).bind(this));

			// When defined, it means that the item is reset, therefore focus
			// on the first tab
            this.tabsController.selectTab("description");

		}

		/**
		 * Define the second (material) tab
		 *
		 * @param {array} items - A list of items to display
		 */
		DefaultBookWidget.prototype.onDefineMaterial = function( items ) {
			if (!items) {
				this.select(".tab-material").hide();
			} else {

				// Show material tab
				this.select(".tab-material").show();

				// Get a reference to the contnet iframe
				var iframe = this.select(".body-material iframe");

				// Populate tabs
				var tabs = this.select(".body-material .horiz-tab-bar > ul").empty();
				for (var i=0; i<items.length; i++) {
					var tab = $('<li></li>')
						.append( $('<span></span>').text(items[i].title + ' ') )
						.append( $('<a target="_blank"><span class="glyphicon glyphicon-new-window"></span></a>').attr("href", items[i].url) )
						.data("url", items[i].url)
						.appendTo(tabs)
						.click(function() {
							// Set URL
							iframe.attr("src", $(this).data("url"));
							// Select
							$(this).parent().find("li.active").removeClass("active");
							$(this).addClass("active");
						});
				}

			}
		}

		/**
		 * Define the third (research) tab
		 *
		 * @param {array} items - A list of items to display
		 */
		DefaultBookWidget.prototype.onDefineResearch = function( items ) {
			if (!items) {
				this.select(".tab-research").hide();
			} else {

				// Show research tab
				this.select(".tab-research").show();

				// Get a reference to the contnet iframe
				var iframe = this.select(".body-research iframe");

				// Populate tabs
				var tabs = this.select(".body-research .horiz-tab-bar > ul").empty();
				for (var i=0; i<items.length; i++) {
					var tab = $('<li></li>')
						.append( $('<span></span>').text(items[i].title + ' ') )
						.append( $('<a target="_blank"><span class="glyphicon glyphicon-new-window"></span></a>').attr("href", items[i].url) )
						.data("url", items[i].url)
						.appendTo(tabs)
						.click(function() {
							// Navigate
							iframe.attr("src", $(this).data("url"));
							// Select
							$(this).parent().find("li.active").removeClass("active");
							$(this).addClass("active");
						});
				}

			}
		}

		/**
		 * Define the discussion tab
		 *
		 * @param {string} thread - The forum thread ID
		 */
		DefaultBookWidget.prototype.onDefineDiscuss = function( book_id ) {

			// Prepare tabs
			var items = [
				{
					'title': 'Team (Private)',
					'short': 'Discuss with your teammates',
					'url'  : Config['forum_vas_api'] + "?auth=" + User.profile['token'] + '&scope=team&term=' + escape(book_id) + '#content'
				},
				{
					'title': 'Public',
					'short': 'Discuss with everyone in the forum',
					'url'  : Config['forum_vas_api'] + "?auth=" + User.profile['token'] + '&scope=public&term=' + escape(book_id) + '#content'
				},
				{
					'title': 'Scientists',
					'short': 'Discuss with the scientists',
					'url'  : Config['forum_vas_api'] + "?auth=" + User.profile['token'] + '&scope=experts&term=' + escape(book_id) + '#content'
				}
			];

			// Get a reference to the contnet iframe
			var iframe = this.select(".body-discuss iframe");

			// Populate tabs
			var tabs = this.select(".body-discuss .horiz-tab-bar > ul").empty();
			for (var i=0; i<items.length; i++) {
				var tab = $('<li></li>')
					.append( $('<span></span>').text(items[i].title + ' ') )
					.append( $('<a target="_blank"><span class="glyphicon glyphicon-new-window"></span></a>').attr("href", items[i].url) )
					.data("url", items[i].url)
					.appendTo(tabs)
					.click(function() {
						// Navigate
						iframe.attr("src", $(this).data("url"));
						// Select
						$(this).parent().find("li.active").removeClass("active");
						$(this).addClass("active");
					});
			}

		}

		/**
		 * Define the book details
		 *
		 * @param {string} message - The description of the error
		 */
		DefaultBookWidget.prototype.onLoadError = function( message ) {
			this.select(".tab-bar > ul > li").hide();
			this.tabsController.selectTab("error");
		}

		// Store tuning widget component on registry
		R.registerComponent( 'widget.book', DefaultBookWidget, 1 );

	}

);