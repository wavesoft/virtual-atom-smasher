define(

	// Dependencies
	[
		"jquery", 
		"vas/core/base/components/overlay_knowledge", 
		"vas/core/registry", 
		"text!vas/basic/tpl/overlay/knowledge.html"
	],

	/**
	 * Basic version of the knowledge screen
	 *
	 * @exports vas-basic/overlay/knowledge
	 */
	function ($, KnowledgeOverlay, R, tpl) {

		/**
		 * @class
		 * @classdesc The basic knowledge screen overlay
         * @augments module:vas-core/base/components/overlays~KnowledgeOverlay
         * @template vas/basic/tpl/overlay/knowledge.html
         * @registry overlay.knowledge
		 */
		var DefaultKnowledgeOverlay = function (hostDOM) {
			KnowledgeOverlay.call(this, hostDOM);

			// Load view template and plutins
			hostDOM.addClass("knowledge");
			this.loadTemplate(tpl);
            this.renderView();

            // Local properties
            this.bookListElements = { };

			///////////////////////////////
			// View Control
			///////////////////////////////

			//
			// Book widget
			//
			this.bookWidget = R.instanceComponent("widget.book", this.select(".content-body"));
			this.forwardVisualEvents(this.bookWidget);

			this.bookWidget.on('explain', (function(book) {
				// Ensure that the term is visible
				this.ensureAccessible( book );
				// Select that appropriate term
				this.focusTerm( book, true );
				// Request to populate the specified bok
				this.bookWidget.doPopulateBook( book );
			}).bind(this));

		}

		DefaultKnowledgeOverlay.prototype = Object.create(KnowledgeOverlay.prototype);

		////////////////////////////////////////////////////////////
		//                    Helper Functions                    //
		////////////////////////////////////////////////////////////

		/**
		 * Ensure that the term is accessible
		 */
		KnowledgeOverlay.prototype.ensureAccessible = function( name ) {
			if (!this.bookListElements[name]) return;

			// Make sure the item is 'visibed'
			if (this.bookListElements[name].hasClass("status-locked")) {
				this.bookListElements[name]
					.removeClass("status-locked")
					.addClass("status-visited");
			}
		}

		/**
		 * Focus on the particular term
		 */
		KnowledgeOverlay.prototype.focusTerm = function( name, animate ) {

			// Unselect previous term
			this.select(".content-list > ul > li.active").removeClass("active");

			// Pick specific term
			var element = this.bookListElements[name],
				host = this.select(".content-list");
			if (!element) return;

			// Activate
			element.addClass("active");

			// Sroll to focus if asked
			if (animate) {
			    var scrollTop = host.scrollTop(),
			    	topPosition = element.position().top + scrollTop,
			    	elmHeight = element.outerHeight(),
			    	innerHeight = host.innerHeight();
			    if ((topPosition + elmHeight) > (scrollTop + innerHeight)) {
			        host.animate({scrollTop: 
			        	topPosition - innerHeight + elmHeight + 5
			        }, 500);
			    } else if (topPosition < scrollTop) {
			        host.animate({scrollTop: 
			        	topPosition - 5
			        }, 500);
			    }
			}

		}

		////////////////////////////////////////////////////////////
		//         Implementation of the KnowledgeOverlay         //
		////////////////////////////////////////////////////////////

		/**
		 * Define the book listing
		 *
		 * The following objects are accessible through the
		 * books array.
		 *
		 * ```javascript
		 * {
		 *    'name'		: "..",		// The name of the book
		 *    'isNew'		: false,	// Denotes if the book is new
		 *    'isVisited'	: false,	// Denotes if the book is visited
		 *    'isMastered'	: false,	// Denotes if the book is mastered
		 * }
		 * ```
		 *
		 * @param {array} books - The book objects to display in the listing
		 * @param {int} numVisited - Number of visited books
		 * @param {int} numMastered - Number of mastered books
		 */
		KnowledgeOverlay.prototype.onListingUpdated = function( books, numVisited, numMastered ) {

			// Reset properties
			this.bookListElements = { };

			// Empty and re-populate list
			var focusItem = "";
			var list = this.select(".content-list > ul").empty();
			for (var i=0; i<books.length; i++) {
				// Make scope explicit
				(function(book) {
					var item = $('<li></li>').appendTo(list);
					this.bookListElements[book.name] = item;
					if (!focusItem) focusItem = book.name;
					
					// Depending on the status, add appropriate icon
					if (book.isMastered) {
						item.addClass("status-mastered").append(
							$('<span class="glyphicon glyphicon-king"></span>')
						);
					} else if (book.isVisited) {
						item.addClass("status-visited").append(
							$('<span class="glyphicon glyphicon-eye-open"></span>')
						);
					} else {
						item.addClass("status-locked").append(
							$('<span class="glyphicon glyphicon-lock"></span>')
						);
					}

					// Append text
					item.append($('<span></span>').text(book.name));

					// Handle click
					item.click((function() {
						// Select term
						this.focusTerm( book.name, true );
						// Populate book
						this.bookWidget.doPopulateBook( book.name );
					}).bind(this));


				}).bind(this)(books[i]);
			}

			// Resize progress bars
			this.select(".bar-mastered").css("width", (100*numMastered/books.length)+'%' );
			this.select(".bar-visited").css("width", (100*numVisited/books.length)+'%' );

			// Focus on the first item
			this.focusTerm( focusItem, false );
			this.bookWidget.doPopulateBook( focusItem );

		}

		/**
		 * Populate the interface before showing it
		 *
		 * @param {function} cb - The callback to fire when the website is loaded
		 */
		DefaultKnowledgeOverlay.prototype.onWillShow = function(cb) {

			// Update listing when shown
			this.doUpdateListing( cb );

		}

		// Register login screen
		R.registerComponent("overlay.knowledge", DefaultKnowledgeOverlay, 1);

	}
);
