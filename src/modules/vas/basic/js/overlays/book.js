define(

	// Dependencies

	["jquery", "require", "vas/config", "vas/core/user", "vas/core/registry", "vas/core/ui", "vas/core/base/data_widget", "vas/core/db", "ccl-tracker", "vas/core/main" ], 

	/**
	 * This is the default component for displaying information regarding a tunable
	 *
 	 * @exports vas-basic/infoblock/tunable
	 */
	function($, require, Config, User, R, UI, DataWidget, DB, Analytics, VAS) {

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

		/**
		 * The default tunable body class
		 */
		var BookBody = function(hostDOM) {

			// Initialize widget
			DataWidget.call(this, hostDOM);

			// Prepare DOM elements
			hostDOM.addClass("overlay-book");
			this.bookDOM = $('<div class="tabs"></div>').appendTo(hostDOM);
			this.bodyDOM = $('<div class="book-body tabs-body"></div>').appendTo(this.bookDOM);
			this.tabsDOM = $('<div class="book-tabs"></div>').appendTo(this.bookDOM);

			// Prepare tabs
			this.tabs = [];
			this.coverage = [];
			this.currTab = 0;

			// Prepare error tab
			this.errorTab = $('<div class="tab tab-error"><h1>Error loading book</h1><p>It was not possible to find a book under the specified ID!</p></div>')

			// Create first tab
			this.createTab("description", $("<div></div>"), 'cs-blue', '<span class="uicon uicon-explain"></span> Description');


			// Prpare properties
			this.meta = null; 

		};

		// Subclass from ObservableWidget
		BookBody.prototype = Object.create( DataWidget.prototype );

		/**
		 * Remove all tabs
		 */
		BookBody.prototype.clearTabs = function() {
			this.tabs = [];
			this.coverage = [];
			this.currTab = 0;
			this.bodyDOM.empty();
			this.tabsDOM.empty();
		}

		/**
		 * Define the metadata to use for description
		 */
		BookBody.prototype.createTab = function( aidName, content, colorScheme, buttonText, buttonCb ) {
			var tab = $('<div class="tab"></div>'),
				tabBtn = $('<a href="do:show-more" class="'+colorScheme+'">'+buttonText+'</a>'),
				tabID = this.tabs.length;

			// Setup button handlers
			tabBtn.click((function(tabID) {
				return function(e) {
					e.preventDefault();
					e.stopPropagation();
					if (buttonCb) {
						buttonCb();
					} else {
						this.selectTab(tabID);
					}
				}
			})(tabID).bind(this));

			// Register visual aid
			R.registerVisualAid("book.tab."+aidName, tabBtn, {
				'onShown': function() {
					tabBtn.click();
				}
			});

			// Append tab content
			tab.append(content);

			// Put everyhing in place
			this.bodyDOM.append(tab);
			this.tabsDOM.append(tabBtn);

			// Activate first, hide others
			if (tabID == 0) {
				tabBtn.addClass("active");
				this.bookDOM.addClass(colorScheme);
			} else {
				tab.hide();
			}

			// Store to tabs
			this.tabs.push({
				'tab': tab,
				'tabBtn': tabBtn,
				'color': colorScheme
			});
			this.coverage.push(0);

			return tab;

		}

		/**
		 * Select one of the specified tab
		 */
		BookBody.prototype.selectTab = function( index ) {

			// Don't re-activate same tab
			if (this.currTab == index) return;

			// Select tab
			for (var i=0; i<this.tabs.length; i++) {
				if (i == index) {
					this.tabs[i].tab.show();
					this.tabs[i].tabBtn.addClass('active');
					this.bookDOM.addClass(this.tabs[i]['color']);
				} else {
					this.tabs[i].tab.hide();
					this.tabs[i].tabBtn.removeClass('active');
					this.bookDOM.removeClass(this.tabs[i]['color']);
				}
			}

			// Fire tab analytics
			var bookTabTime = Analytics.restartTimer("book-tab");
			Analytics.fireEvent("book.tab_metrics", {
				"id": this.meta['book'],
				"tab": this.currTab,
				"time": bookTabTime,
				"coverage": this.coverage[this.currTab]
			});
			// Trigger user event
			User.triggerEvent("book.tab.change", {
				"book" : this.meta['book'],
				"from": this.currTab,
				"to": index,
				"time": bookTabTime,
				"coverage": this.coverage[this.currTab]
			});

			// Update current tab
			this.currTab = index;

			// Fire tab change analytic
			Analytics.fireEvent("book.tab_change", {
				"id": this.meta['book'],
				"tab": this.currTab
			});

		}

		/**
		 * Handle shown event
		 */
		BookBody.prototype.onShown = function() {
			if (!this.meta) return;
			
			// Check if user has not seen the tuning part tutorial
			if (!User.isFirstTimeSeen("ui.book")) {
				UI.showTutorial("ui.book", function() {
					User.markFirstTimeAsSeen("ui.book");
				});
			}
		}

		/**
		 * Handle hidden event
		 */
		BookBody.prototype.onHidden = function() {
			if (!this.meta) return;

			// Fire tab analytics
			var bookTabTime = Analytics.stopTimer("book-tab");
			Analytics.fireEvent("book.tab_metrics", {
				"id": this.meta['book'],
				"tab": this.currTab,
				"time": bookTabTime,
				"coverage": this.coverage[this.currTab]
			});

			// Fire book analytics
			var bookTime = Analytics.stopTimer("book");
			Analytics.fireEvent("book.hide", {
				"id": this.meta['book'],
				"time": bookTime
			});

			User.triggerEvent("book.tab.change", {
				"book" : this.meta['book'],
				"from": this.currTab,
				"to": "",
				"time": bookTabTime,
				"coverage": this.coverage[this.currTab]
			});
			User.triggerEvent("book.hide", {
				"book" : this.meta['book'],
				"time" : bookTime
			});

		}

		/**
		 * Define the metadata to use for description
		 */
		BookBody.prototype.onMetaUpdate = function( meta ) {
			var self = this;

			// Remove previous tabs
			this.clearTabs();

			// Get the specified book from database
			if (!meta['book']) {
				this.bodyDOM.append(this.errorTab);
				return;
			}

			// Store meta
			this.meta = meta;

			// Load book
			User.readBook(meta['book'], (function(data, errorMsg) {
				if (data != null) {

					// Place description tab
					var body = $('<div class="content"><h1><span class="glyphicon glyphicon-book"></span> ' + data['name'] + '</h1><div>'+replace_macros(data['description'])+'</div></div>');
					this.createTab("description", body, 'cs-blue', '<span class="uicon uicon-explain"></span> Description');

					// Handle book-links inside body
					body.find("a.book-link").click((function(e) {
						e.preventDefault();
						VAS.displayBook( $(e.target).data("book") );
					}).bind(this));

					// Handle body analytics
					body.scroll((function(e) {

						// Update page coverage
						var scrollHeight = e.currentTarget.scrollHeight - $(e.currentTarget).height() - parseFloat($(e).css("padding-top")) - parseFloat($(e).css("padding-bottom"));
							currCoverage = e.currentTarget.scrollTop / scrollHeight;
						if (currCoverage > this.coverage[0]) {
							this.coverage[0] = currCoverage;
						}

					}).bind(this));

					// Place games tab
					if (data['games'] && (data['games'].length > 0)) {
						var games_host = $('<div class="content"></div>'),
							games_iframe = $('<iframe class="split-left" frameborder="0" border=0"></iframe>').appendTo(games_host),
							games_list = $('<div class="split-right list"></div>').appendTo(games_host),
							games_floater = $('<div class="fix-bottom-left"></div>').appendTo(games_host);

						// Games coverage calculation
						var gamesSeen = [];

						for (var i=0; i<data['games'].length; i++) {
							var game = data['games'][i];
								// Create game label
								game_label = $('<div class="list-item"><div class="title"><span class="uicon uicon-game"></span> '+game['title']+'</div><div class="subtitle">'+game['short']+'</div></div>').appendTo(games_list);

							// Activate on click
							(function(game) {

								// Check game type
								var url = game['url'],
									type = 'url',
									redwireid = '';

								// Handle redwire: URLs
								if (url.substr(0,8) == "redwire:") {
									// The EMBED redwire IO parameter
									redwireid = url.substr(8);
									url = 'http://redwire.io/#/game/'+redwireid+'/embed?backgroundColor=%23000000';
									type = 'redwire';
								} else {
									// Otherwise, expect to find 'url' parameter
									url = game['url'];
								}								

								// Register label click
								game_label.click(function() {
									games_list.find(".list-item").removeClass("active");
									$(this).addClass("active");
									games_iframe.attr("src", url);

									// Update floater
									if (type == 'redwire') {
										games_floater.html('<a href="http://redwire.io/#/game/'+redwireid+'/edit" target="_blank"><img src="http://redwire.io/assets/images/ribbon.png" style="border:none; width: 100%"></a>');
									} else {
										games_floater.empty();
									}

									// Update coverage
									if (gamesSeen.indexOf(url) == -1) {
										gamesSeen.push(url);
										self.coverage[1] = gamesSeen.length / data['games'].length;
									}

								});
							})(game);

						}
						this.createTab("games", games_host, 'cs-purple', '<span class="uicon uicon-game"></span> Material')
							.addClass("tab-noscroll").addClass("tab-fullheight");

						// Click on the first item
						games_list.find(".list-item:first-child").click();
					}

					// Place resources tab
					if (data['material'] && (data['material'].length > 0)) {
						var material_host = $('<div class="content"></div>'),
							material_iframe = $('<iframe class="split-left" frameborder="0" border=0"></iframe>').appendTo(material_host),
							material_list = $('<div class="split-right list"></div>').appendTo(material_host),
							material_floater = $('<div class="fix-bottom-left"></div>').appendTo(material_host);

						// material coverage calculation
						var materialSeen = [];

						for (var i=0; i<data['material'].length; i++) {
							var mat = data['material'][i],
								// Create material label
								mat_label = $('<div class="list-item"><div class="title"><span class="uicon uicon-find"></span> '+mat['title']+'</div><div class="subtitle">'+mat['short']+'</div></div>').appendTo(material_list);

							// Activate on click
							(function(mat) {

								// Register label click
								mat_label.click(function() {
									material_list.find(".list-item").removeClass("active");
									$(this).addClass("active");
									material_iframe.attr("src", mat['url']);

									// Update coverage
									if (materialSeen.indexOf(mat['url']) == -1) {
										materialSeen.push(mat['url']);
										self.coverage[2] = materialSeen.length / data['material'].length;
									}

								});
							})(mat);

							/*
								color_css = (mat['color'] ? '; background-color: '+mat['color']+'' : ""),
								a = $('<a target="_blank" class="tile-row" href="'+mat['url']+'" title="'+mat['title']+'">'+
										'<div class="icon" style="background-image: url('+(mat['icon'] || 'static/img/icon-resource.png')+')'+color_css+'"></div>'+
										'<div class="text">'+mat['title']+'</div></a>'+
									  '</a>');
							material_host.append(a);
							*/
						}

						// Create tab
						this.createTab("material", material_host, 'cs-green', '<span class="uicon uicon-find"></span> Research')
							.addClass("tab-noscroll").addClass("tab-fullheight");
							
						// Click on the first item
						material_list.find(".list-item:first-child").click();

					}

					// Place discuss tab
					if (true) {
						var discuss_host = $('<div class="content"></div>'),
							discuss_iframe = $('<iframe class="split-left" frameborder="0" border=0"></iframe>').appendTo(discuss_host),
							discuss_list = $('<div class="split-right list"></div>').appendTo(discuss_host),
							discuss_floater = $('<div class="fix-bottom-left"></div>').appendTo(discuss_host);

						// material coverage calculation
						var discussScreen = [],
							discussTypes = [
								{
									'title': 'Team',
									'short': 'Discuss with your teammates',
									'url'  : Config['forum_vas_api'] + "?auth=" + User.profile['token'] + '&scope=team&term=' + escape(meta['book'])
								},
								{
									'title': 'Public',
									'short': 'Discuss with everyone in the forum',
									'url'  : Config['forum_vas_api'] + "?auth=" + User.profile['token'] + '&scope=public&term=' + escape(meta['book'])
								},
								{
									'title': 'Scientists',
									'short': 'Discuss with the scientists',
									'url'  : Config['forum_vas_api'] + "?auth=" + User.profile['token'] + '&scope=experts&term=' + escape(meta['book'])
								}
							];

						for (var i=0; i<discussTypes.length; i++) {
							var disc = discussTypes[i],
								// Create material label
								disc_label = $('<div class="list-item"><div class="title"><span class="glyphicon glyphicon-uicon glyphicon-comment"></span> '+disc['title']+'</div><div class="subtitle">'+disc['short']+'</div></div>').appendTo(discuss_list);

							// Activate on click
							(function(disc) {

								// Register label click
								disc_label.click(function() {
									discuss_list.find(".list-item").removeClass("active");
									$(this).addClass("active");
									discuss_iframe.attr("src", disc['url']);

									// Update coverage
									if (discussScreen.indexOf(disc['url']) == -1) {
										discussScreen.push(disc['url']);
										self.coverage[3] = discussScreen.length / data['material'].length;
									}

								});
							})(disc);

						}

						// Create tab
						this.createTab("discuss", discuss_host, 'cs-yellow', '<span class="glyphicon glyphicon-comment glyphicon-uicon"></span> Discuss')
							.addClass("tab-noscroll").addClass("tab-fullheight");
							
						// Click on the first item
						discuss_list.find(".list-item:first-child").click();

					}

					// Initial analytics setup
					Analytics.restartTimer("book");
					Analytics.restartTimer("book-tab");
					Analytics.fireEvent("book.show", {
						"id": meta['book']
					});
					User.triggerEvent("book.show", {
						"book" : this.meta['book']
					});

				} else {

					// Place error tab
					this.bodyDOM.append(this.errorTab);

				}

			}).bind(this));
			
		}

		// Store book infoblock component on registry
		R.registerComponent( 'overlay.book', BookBody, 1 );

	}

);