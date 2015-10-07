define(

	// Dependencies
	["jquery", "vas/core/registry", "vas/core/base/components/widget_book",
	 "text!vas/basic/tpl/widget/book.html" ], 

	/**
	 * This is a reusable component for showing the multi-tabbed book interface.
	 *
 	 * @exports vas-basic/common/widget/book
	 */
	function($, R, BookWidget, tpl) {

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

            // Bind listeners on tab buttons
            this.select(".tab-bar > ul > li").click((function(e) {
            	// Select appropriate group
            	var elm = $(e.target);
            	this.selectTab(elm.data("id"));
            }).bind(this));

            // Select description tab
            this.selectTab("description");

		};

		// Subclass from BookWidget
		DefaultBookWidget.prototype = Object.create( BookWidget.prototype );

		////////////////////////////////////////////////////////////
		//                    Helper Functions                    //
		////////////////////////////////////////////////////////////

		/**
		 * Select a tab by it's class name
		 *
		 * @param {string} name - The tab name
		 */
		DefaultBookWidget.prototype.selectTab = function( name ) {

			// Hide all tabs 
			this.select(".tab-body > div").hide();
			this.select(".tab-bar > ul > li").removeClass("active");

			// Activate requested tab
			this.select(".tab-body > div.body-" + name).show();
			this.select(".tab-bar > ul > li.tab-" + name).addClass("active");

		}

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

				// Show description tab
				this.select(".tab-material").show();

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

			}
		}

		/**
		 * Define the discussion tab
		 *
		 * @param {string} thread - The forum thread ID
		 */
		DefaultBookWidget.prototype.onDefineDiscuss = function( book_id ) {

		}

		/**
		 * Define the book details
		 *
		 * @param {string} message - The description of the error
		 */
		DefaultBookWidget.prototype.onLoadError = function( message ) {
			this.select(".tab-bar > ul > li").hide();
			this.selectTab("error");
		}

		// Store tuning widget component on registry
		R.registerComponent( 'widget.book', DefaultBookWidget, 1 );

	}

);