
define(["vas/config", "require", "vas/core/base/data_widget", "vas/core/base/component", "vas/core/user" ], 

	/**
	 * This module provides the base classes for all the game-wide widgets
	 *
 	 * @exports vas-core/base/components/widget_book
	 */
	function(config, require, DataWidget, Component, User) {

		/**
		 * Find base directory for images
		 */
		var img_dir = require.toUrl(".").split("/").slice(0,-2).join("/") + "/img";

		/**
		 * Replace book macros (helpers for specifying images in the description)
		 */
		function replace_macros(body) {
			var text = body;
			// Replace macros
			text = text.replace(/\${images}/gi, img_dir);
			// Return text
			return text;
		}

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new book widget.
		 *
		 * This is a reusable widget that displays the book contents.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var BookWidget = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		BookWidget.prototype = Object.create( Component.prototype );

		////////////////////////////////////////
		// View API
		////////////////////////////////////////

		/**
		 * Define the first (description) tab
		 *
		 * @param {string} title - The title of the description
		 * @param {string} body - The HTML content to render
		 */
		BookWidget.prototype.onDefineDescription = function( title, body ) {

		}

		/**
		 * Define the second (material) tab
		 *
		 * @param {array} items - A list of items to display
		 */
		BookWidget.prototype.onDefineMaterial = function( items ) {

		}

		/**
		 * Define the third (research) tab
		 *
		 * @param {array} items - A list of items to display
		 */
		BookWidget.prototype.onDefineResearch = function( items ) {

		}

		/**
		 * Define the discussion tab
		 *
		 * @param {string} thread - The forum thread ID
		 */
		BookWidget.prototype.onDefineDiscuss = function( book_id ) {

		}

		/**
		 * Define the book details
		 *
		 * @param {string} message - The description of the error
		 */
		BookWidget.prototype.onLoadError = function( message ) {

		}

		////////////////////////////////////////
		// Controller API
		////////////////////////////////////////

		/**
		 * Populate book with the specified details
		 *
		 * @param {object} details - An object containing book details
		 * @controller
		 */
		BookWidget.prototype.doPopulateBook = function( book, callback ) {
			// Load book
			User.readBook(book, (function(data, errorMsg) {
				if (data != null) {

					// (1) Define book description
					this.onDefineDescription(
						data['name'],
						replace_macros(data['description'])
					);

					// (2) Define forum thead (that's simple)
					this.onDefineDiscuss( book );

					// (3) Define material tab
					if (data['games'] && (data['games'].length > 0)) {
						this.onDefineMaterial( data['games'] );
					} else {
						this.onDefineMaterial( null );
					}

					// (4) Define Research tab
					if (data['material'] && (data['material'].length > 0)) {
						this.onDefineResearch( data['material'] );
					} else {
						this.onDefineResearch( null );
					}

				} else {
					// Place error tab if no body was received
					this.onLoadError(errorMsg);
				}

				// Fire callback
				if (callback) callback();

			}).bind(this));
		}

		////////////////////////////////////////////////////////////
		//             Event definitions for JSDoc                //
		////////////////////////////////////////////////////////////

		/**
		 * This event is fired when the user requests details for another book.
		 *
		 * @param {string} name - The book to show
		 * @event module:vas-core/base/components/widget_book~BookWidget#explain		
		 */

		// Return book widget prototype
		return BookWidget;

	}
);
