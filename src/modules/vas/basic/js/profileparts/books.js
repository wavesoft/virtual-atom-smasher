define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry","vas/core/base/view", "vas/core/user",
	  "text!vas/basic/tpl/profileparts/books.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/books
	 */
	function(config, require, R, View, User, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfileBooks = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-books");
			this.loadTemplate(tplBooks);

			// Render view
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileBooks.prototype = Object.create( View.prototype );


		// Store overlay component on registry
		R.registerComponent( 'profilepart.book', ProfileBooks, 1 );

	}

);