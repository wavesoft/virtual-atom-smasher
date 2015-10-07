
define(["vas/config", "vas/core/base/component", "vas/core/user" ], 

	/**
	 * This module provides the class definition for the knowledge screen
	 *
 	 * @exports vas-core/base/components/overlay_knowledge
	 */
	function(config, Component, User) {

		////////////////////////////////////////////////////////////
		/**
		 * Initializes a new Knowledge Screen Component.
		 *
		 * This is the component with the abstract qunatum simulation
		 * machine graphic is rendered.
		 *
		 * @class
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @augments module:vas-core/base/component~Component
		 *
		 */
		var KnowledgeOverlay = function( hostDOM ) {

			// Initialize base class
			Component.call(this, hostDOM);

		}

		// Subclass from Component
		KnowledgeOverlay.prototype = Object.create( Component.prototype );

		////////////////////////////////////////
		// View API
		////////////////////////////////////////

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
		 *    'isVisisted'	: false,	// Denotes if the book is visited
		 *    'isMastered'	: false,	// Denotes if the book is mastered
		 * }
		 * ```
		 *
		 * @param {array} books - The book objects to display in the listing
		 * @param {int} numVisited - Number of visited books
		 * @param {int} numMastered - Number of mastered books
		 */
		KnowledgeOverlay.prototype.onListingUpdated = function( books, numVisited, numMastered ) {

		}

		////////////////////////////////////////
		// Controller API
		////////////////////////////////////////

		/**
		 * Update the listing in the knowledge overlay
		 *
		 * @param {function} callback - The function to call when updat is completed
		 * @controller
		 */
		KnowledgeOverlay.prototype.doUpdateListing = function( callback ) {
			// Load book
			User.getProfileBooks((function(books) {
				var seenCount = 0,
					masterCount = 0;

				// Expand states
				for (var i=0; i<books.length; i++) {
					books[i].isNew = (books[i]['state'] == 0);
					books[i].isVisited = (books[i]['state'] == 1);
					books[i].isMastered = (books[i]['state'] == 2);
					if (books[i]['state'] == 1) {
						seenCount += 1;
					} else if (books[i]['state'] == 2) {
						seenCount += 1;
						masterCount += 1;
					}
				}

				// Update interface
				this.onListingUpdated( books, seenCount, masterCount );

				// Fire callback
				if (callback) callback();

			}).bind(this));
		}

		////////////////////////////////////////////////////////////
		//             Event definitions for JSDoc                //
		////////////////////////////////////////////////////////////

		////////////////////////////////////////////////////////////
		return KnowledgeOverlay;

	}
);
