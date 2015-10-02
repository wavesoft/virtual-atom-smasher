define(

	// Dependencies

	[ "jquery", "require", "vas/core/registry","vas/core/base/view", "vas/core/user", "core/util/graphroute",
	  "text!vas/basic/tpl/profileparts/achievements.html" ], 

	/**
	 * This is the default component for displaying the status of the books of the user
	 *
 	 * @exports vas-basic/profileparts/achievements
	 */
	function(config, require, R, View, User, GraphRoute, tplBooks) {

		/**
		 * The default tunable body class
		 */
		var ProfileAchievements = function(hostDOM) {

			// Initialize widget
			View.call(this, hostDOM);

			// Initialize view
			hostDOM.addClass("profile-achievements");
			this.loadTemplate(tplBooks);

			// Bind selections
			this.select(".achievements-body", this.updateGraph.bind(this));

			// Render view
			this.setViewData('img', require.toUrl('vas/basic/img'));
			this.renderView();

		};

		// Subclass from ObservableWidget
		ProfileAchievements.prototype = Object.create( View.prototype );

		/**
		 * Handle hovering over a node
		 */
		ProfileAchievements.prototype.hoverNode = function( node ) {
			if (!node) {
				this.select(".achievements-footer h4").text("---");
				this.select(".achievements-footer p").text("---");
			} else {
				this.select(".achievements-footer h4").text(node.name);
				this.select(".achievements-footer p").text("Some paragraph");
			}
		}

		/**
		 * Update Graph
		 */
		ProfileAchievements.prototype.updateGraph = function( host ) {

			var testGraph = {
				'name': 'a',
				'children': [
					{
						'name': 'b',
						'children': []
					},
					{
						'name': 'c',
						'children': [
							{
								'name': 'e',
								'children': []
							},
							{
								'name': 'f',
								'children': []
							},
						]
					},
					{
						'name': 'd',
						'children': [
							{
								'name': 'h',
								'children': [
								{
									'name': 'l',
									'children': [
									{
										'name': 'm',
										'children': [
										{
											'name': 'n',
											'children': [
											{
												'name': 'o',
												'children': []
											}
											]
										}
										]
									}
									]
								}
								]
							},
							{
								'name': 'i',
								'children': []
							},
							{
								'name': 'g',
								'children': []
							},
							{
								'name': 'j',
								'children': []
							},
							{
								'name': 'k',
								'children': []
							}
						]
					}
				]
			};

			// Solve graph visualization
			var router = new GraphRoute(testGraph).solve(),
				table = router.solutionAsTable(
						(function(node) { /* Node Generation Function */
							var dom = $('<td><div><span class="glyphicon glyphicon-volume-up"></span><div class="popup">Node '+node.name+'</div></div></td>')
							dom.mouseover((function(e) {
								this.hoverNode(node);
							}).bind(this));
							dom.mouseout((function(e) {
								this.hoverNode(null);
							}).bind(this));
							return dom;
						}).bind(this)
					);

			// Replace table in host
			host.empty();
			host.append( table );

		}

		// Store overlay component on registry
		R.registerComponent( 'profilepart.achievements', ProfileAchievements, 1 );

	}

);