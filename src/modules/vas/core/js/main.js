
/**
 * [core/main] - Core initialization module
 */
define("vas/core",

	["jquery", "vas/config",  "vas/core/registry", "vas/core/ui", "vas/core/db", "vas/core/user", "vas/core/apisocket", "vas/core/base/components", "core/util/progress_aggregator", "vas/core/liveq/core", "vas/core/liveq/Calculate" ], 

	function($, config, R, UI, DB, User, APISocket, Components, ProgressAggregator, LiveQCore, LiveQCalc) {
		var VAS = { };

		/**
		 * Helper dummy progress updater
		 */
		var _DummyRunner_ = function() {
			this.onUpdate = null;
			this.onCompleted = null;
			this.progress = 0;
			this.started = false;
			this.data = null;

			// Progress step
			this.step = function() {
				this.progress += 0.01;
				if (this.progress>=1) {
					this.progress = 1;
					if (this.onCompleted) this.onCompleted();
				} else {
					setTimeout(this.step.bind(this), 100);
				}
				if (this.onUpdate) this.onUpdate( this.data, this.progress );
			}

			// Progress start
			this.start = function() {
				if (this.started) return;
				this.started = true;
				this.step();
			}

		};

		/**
		 * Override error logging from UI
		 */
		UI.logError = function( message, critical ) {

			if (critical) {
				console.error(message);

				// Display BSOD if critical
				var bsod = UI.selectScreen("screen.bsod");
				if (bsod) bsod.onBSODDefined(message, '<span class="glyphicon glyphicon-off"></span>');

				// Hide overlay
				UI.hideOverlay();

				// Enter UI Lockdown
				UI.lockdown = true;

				// Don't alert on unload
				VAS.alertUnload = false;

			} else {
				console.warn(message);

				// Otherwise display a growl
				UI.growl(message, "alert");
			}

		}

		/**
		 * Initialize VAS to the given DOM element
		 */
		VAS.initialize = function( readyCallback ) {

			// Absolutely minimum UI initializations
			UI.initialize();

			window.vas = this;

			// Prepare properties
			VAS.alertUnload = false;
			VAS.referenceHistograms = null;
			VAS.activeTask = "";
			VAS.activeTopic = "";
			VAS.runningTask = "";
			VAS.runningTopic = "";

			// Prepare core screens
			var scrProgress = UI.initAndPlaceScreen("screen.progress", Components.ProgressScreen);
			if (!scrProgress) {
				UI.logError("Core: Unable to initialize progress screen!");
				return;
			}
			var scrBSOD = UI.initAndPlaceScreen("screen.bsod", Components.BSODScreen);
			if (!scrBSOD) {
				UI.logError("Core: Unable to initialize BSOD screen!");
				return;
			}

			// Prepare progress aggregator
			var progressAggregator = new ProgressAggregator();
			progressAggregator.on('progress', function(progress, message){ scrProgress.onProgress(progress, message); });
			progressAggregator.on('error', function(message){ scrProgress.onProgressError(message); UI.logError(message); });
			progressAggregator.on('completed', function(){
				scrProgress.onProgressCompleted(); 
				if (readyCallback) readyCallback();
			});

			// Create the mini-nav menu
			var mininavDOM = $('<div class="'+config.css['nav-mini']+'"></div>');
			UI.host.append(mininavDOM);
			
			// Try to create mini-nav
			UI.mininav = R.instanceComponent("nav.mini", mininavDOM);
			if (UI.mininav !== undefined) {

				// Check for preferred dimentions
				var dim = UI.mininav.getPreferredSize();
				if (dim != undefined) {
					mininavDOM,css({
						'width': dim[0],
						'height': dim[1]
					});
					UI.mininav.onResize( dim[0], dim[1] );
				} else {
					UI.mininav.onResize( mininavDOM.width(), mininavDOM.height() );
				}

				// Bind events
				UI.mininav.on("changeScreen", function(to) {
					if (to == "screen.home") {
						VAS.displayHome(true);
					} else {
						UI.selectScreen(to, UI.Transitions.ZOOM_OUT);
					}
				});
				// Bind events
				UI.mininav.on("displayKnowledge", function() {
					VAS.displayKnowledge();
				});
				UI.mininav.on("displayStatus", function() {
					VAS.displayStatus();
				});
				UI.mininav.on("displayTuningScreen", function() {
					VAS.displayTuningScreen();
				});
				UI.mininav.on("displayJobs", function() {
					VAS.displayJobs();
				});
				UI.mininav.on('displayMenu', function() {
					VAS.displayMenu();
				});

			}

			// Add CernVM WebAPI script to the main page
			$('head').append('<script type="text/javascript" src="http://cernvm.cern.ch/releases/webapi/js/cvmwebapi-latest.js"></script>');

			// Listen to global user events
			User.on('notification', function(message, type) {
				UI.growl(message, 5000, type || "success")
			});
			User.on('flash', function(title,body,icon) {
				UI.showFlash(title, body, icon);
			});


			// Break down initialization process in individual chainable functions
			var prog_api = progressAggregator.begin(1),
				init_api = function(cb) {

					// Register core handlers
					APISocket.on('ready', function() {
						// API socket ready
						prog_api.ok("Core I/O socket initialized");
						cb();
					});
					APISocket.on('error', function(message) {
						// Generic error message from the socket
						UI.logError('I/O Error: '+message);
					});

					// Critical socket error
					APISocket.on('critical', function(message) {
						// API socket error
						UI.logError(message, true);
						prog_api.fail("Could not initialize core I/O socket!" + message, true);
					});

					// Growl notificataions
					APISocket.on('notification', function(message, type) {
						UI.growl(message, type)
					});

					// Connect to core socket
					APISocket.connect( config.core.socket_url );

				};

			var prog_login = progressAggregator.begin(1),
				init_login = function(cb) {

					var scrLogin = UI.initAndPlaceScreen("screen.login");
					if (!scrLogin) {						
						UI.logError("Core: Unable to initialize login screen!");
						return;
					}

					// Bind events
					scrLogin.on('login', function(email, password) {
						User.login({
							'email' : email,
							'password' : password
						}, function(status, errorMsg) {
							if (!status) {
								UI.growl("Could not log-in! "+errorMsg, "alert")
							} else {

								// Alert on unload
								VAS.alertUnload = true;

								// Post-login initialize
								VAS.postLoginInitialize(function() {

									// User is logged-in, check if he has sheen the introduction
									// sequence
									if (!User.isFirstTimeSeen("intro")) {
											// Display the intro sequence
											UI.displaySequence( DB.cache['definitions']['intro-sequence']['sequence'] , function() {
												// Mark introduction sequence as shown
												User.markFirstTimeAsSeen("intro");
												// Display home page
												VAS.displayTuningScreen();
											});
									} else {
										VAS.displayTuningScreen();
									}

								});

							}
						});
					});
					scrLogin.on('register', function(user, password) {
						UI.showOverlay("screen.register", function(scrRegister) {

							// On cancel just hide
							scrRegister.on('cancel', function() {
								UI.hideOverlay();
							});

							// Handle register event
							scrRegister.on('register', function(profile) {

								// Try registering the user
								User.register(profile, function(status, errorMsg) {
									if (!status) {
										scrRegister.onRegistrationError(errorMsg);
									} else {

										/////////////
										// The user is registered and logged in
										/////////////

										// Post-login initialize
										VAS.postLoginInitialize(function() {

											// Hide overlay
											UI.hideOverlay();

											// Display the intro sequence
											UI.displaySequence( DB.cache['definitions']['intro-sequence']['sequence'] , function() {
												// Mark introduction sequence as shown
												User.markFirstTimeAsSeen("intro");
												// Display home page
												VAS.displayTuningScreen();
											});

										});

									}
								});

							});

						});
					});
					// Complete login
					prog_login.ok("Home screen ready");
					cb();
				};

			var prog_introstats = progressAggregator.begin(1),
				init_introstats = function(cb) {
					var scrIntroStats = VAS.scrIntroStats = UI.initAndPlaceScreen("screen.tutorial.introstats");
					if (!scrIntroStats) {
						UI.logError("Core: Unable to initialize introduction to statistics minigame screen!");
						return;
					}

					// Complete login
					prog_introstats.ok("Statistics tutorial ready");
					cb();
				};	

			var prog_results = progressAggregator.begin(1),
				init_results = function(cb) {
					var scrResults = VAS.scrResults = UI.initAndPlaceScreen("screen.results");
					if (!scrResults) {
						UI.logError("Core: Unable to initialize results screen!");
						return;
					}

					// Bind events
					scrResults.on('hideResults', function() {
						UI.selectPreviousScreen()
					});

					// Complete login
					prog_results.ok("Results screen ready");
					cb();
				};	

			var prog_status = progressAggregator.begin(1),
				init_status = function(cb) {
					var scrStatus = VAS.scrStatus = UI.initAndPlaceScreen("screen.status");
					if (!scrStatus) {
						UI.logError("Core: Unable to initialize status screen!");
						return;
					}

					// Bind events
					scrStatus.on('hideStatus', function() {
						VAS.displayTuningScreen(UI.Transitions.DIFF_LEFT);
					});
					scrStatus.on('showBook', function(bookID) {
						VAS.displayBook(bookID);
					});
					scrStatus.on('takeExam', function() {
						VAS.displayExamOverlay();
					});

					// Complete login
					prog_status.ok("Results screen ready");
					cb();
				};	

			var prog_team = progressAggregator.begin(1),
				init_team = function(cb) {

					// Prepare team screens
					var teamScreens = [
						"screen.team", "screen.team.people", "screen.team.machines", "screen.team.notebook",
						"screen.team.messages"
					];

					for (var i=0; i<teamScreens.length; i++) {
						var scr = UI.initAndPlaceScreen(teamScreens[i]);
						if (!scr) {
							UI.logError("Core: Unable to initialize screen "+teamScreens[i]+"!");
							return;
						}

						scr.on("changeScreen", function(scr, transition) {
							UI.selectScreen(scr, transition);
						});
					}

					// Complete login
					prog_team.ok("Team screens ready");
					cb();
				};				

			var prog_home = progressAggregator.begin(1),
				init_home = function(cb) {
					var scrHome = VAS.scrHome = UI.initAndPlaceScreen("screen.home");
					if (!scrHome) {
						UI.logError("Core: Unable to initialize home screen!");
						return;
					}

					// Bind events
					scrHome.on('changeScreen', function(name) {
						UI.selectScreen(name);
					});
					scrHome.on('showKnowledge', function() {
						VAS.displayKnowledge();
					});
					scrHome.on('showMachine', function(name) {
						VAS.displayTuningScreen();
					});
					scrHome.on('showJobs', function() {
						VAS.displayJobs();
					});
					scrHome.on('flash', function(title,body,icon) {
						UI.showFlash(title, body, icon);
					});

					// Fire the basic state change events
					scrHome.onStateChanged( 'simulating', false );

					// Complete home
					prog_home.ok("Home screen ready");
					cb();
				};

			var prog_cinematic = progressAggregator.begin(1),
				init_cinematic = function(cb) {
					var scrCinematic = VAS.scrCinematic = UI.initAndPlaceScreen("screen.cinematic");
					if (!scrCinematic) {
						UI.logError("Core: Unable to initialize cinematic screen!");
						return;
					}

					// Complete login
					prog_cinematic.ok("Cinematic screen ready");
					cb();
				};				

			var prog_jobs = progressAggregator.begin(1),
				init_jobs = function(cb) {
					var scrJobs = VAS.scrJobs = UI.initAndPlaceScreen("screen.jobs");
					if (!scrJobs) {
						UI.logError("Core: Unable to initialize jobs screen!");
						return;
					}

					// Complete login
					prog_jobs.ok("Jobs screen ready");
					cb();
				};				

			var prog_courseroom = progressAggregator.begin(1),
				init_courseroom = function(cb) {
					var scrCourseroom = VAS.scrCourseroom = UI.initAndPlaceScreen("screen.courseroom");
					if (!scrCourseroom) {
						UI.logError("Core: Unable to initialize courseroom screen!");
						return;
					}

					// Complete login
					prog_courseroom.ok("Courseroom screen ready");
					cb();
				};				

			var prog_menu = progressAggregator.begin(1),
				init_menu = function(cb) {
					var scrMenu = VAS.scrMenu = UI.initAndPlaceScreen("screen.menu");
					if (!scrMenu) {
						UI.logError("Core: Unable to initialize menu screen!");
						return;
					}

					scrMenu.on('showMachine', function() {
						VAS.displayTuningScreen();
					});
					scrMenu.on('showTeam', function() {
						VAS.displayTeam();
					});
					scrMenu.on('showJobs', function() {
						VAS.displayJobs();
					});
					scrMenu.on('showKnowledge', function() {
						VAS.displayKnowledge();
					});

					// Complete login
					prog_menu.ok("Menu screen ready");
					cb();
				};				

			var prog_courses = progressAggregator.begin(1),
				init_courses = function(cb) {
					var scrKnowledge = VAS.scrKnowledge = UI.initAndPlaceScreen("screen.knowledge");
					if (!scrKnowledge) {
						UI.logError("Core: Unable to initialize knowledge screen!");
						return;
					}

					// Handle buy action
					scrKnowledge.on('unlock', function(knowledge_id) {
						User.unlockKnowledge(knowledge_id, function(knowlegeDetails) {
							// Unlock successful, display alert

							// Get topic details
							if (knowlegeDetails) {

								// Show flash banner
								UI.showFlash(
									'Knowledge expanded',
									'You have just expanded your knowlege and unlocked the topic <em>'+knowlegeDetails['title']+'</em>',
									'/flash-icons/books.png'
								);

								// Handle knowledge actions
								var actions = knowlegeDetails['actions'];
								if (actions['course'] !== undefined) {

									// Display course
									VAS.displayCourse(actions['course'], function() {
										VAS.displayTuningScreen();
										setTimeout(showBanner, 500);
									});

								} else {

									// Switch directly to tuning screen
									VAS.displayTuningScreen();
								}

							} else {
								// Switch directly to tuning screen
								VAS.displayTuningScreen();
							}


						});
					});
					scrKnowledge.on('flash', function(title,body,icon) {
						UI.showFlash(title, body, icon);
					});
					scrKnowledge.on('course', function(name) {
						VAS.displayCourse(name, function() {
							VAS.displayKnowledge();
						});
					});
					scrKnowledge.on('explain', function(bookID) {
						VAS.displayBook(bookID);
					});

					// Complete login
					prog_courses.ok("knowledge screen ready");
					cb();
				};				

			var prog_tune = progressAggregator.begin(1),
				init_tune = function(cb) {

					// Create tuning screen
					var scrTuning = VAS.scrTuning = UI.initAndPlaceScreen("screen.tuning", Components.TuningScreen);
					if (!scrTuning) {
						UI.logError("Core: Unable to initialize explaination screen!");
						return;
					}

					// Bind events
					scrTuning.on('showBook', function(bookID) {
						VAS.displayBook(bookID);
					});
					scrTuning.on('submitParameters', function( values, observables ) {

						// Set job detals and display jobs screen
						VAS.scrJobs.onSubmitRequest( values, observables );
						VAS.displayJobs();

					});
					scrTuning.on('interpolateParameters', function(values) {
						LiveQCore.requestInterpolation( values, 
							function(histograms) {
								scrTuning.onUpdate(histograms);
								VAS.referenceHistograms = histograms;
							},
							function(error) {
								UI.growl("Could not request interpolation! "+error, "alert", 5000);
							}
						);

					});
					scrTuning.on('course', function(name) {
						UI.screens["screen.courseroom"].onCourseDefined(name);
						UI.selectScreen("screen.courseroom");
					});
					scrTuning.on('flash', function(title,body,icon) {
						UI.showFlash(title, body, icon);
					});
					scrTuning.on("displayStatus", function() {
						VAS.displayStatus();
					});

					// Complete tuning
					prog_tune.ok("Tuning screen ready");
					cb();

				};

			// Wait some time for the background resources to load
			setTimeout(function() {

				var chainRun = [
						init_api, init_home, init_jobs, init_cinematic, init_courseroom, init_courses, 
						init_introstats, init_login, init_status, init_team, init_tune, init_results,
						init_menu
					],
					runChain = function(cb, index) {
						var i = index || 0;

						// If we run out of chain, run callback
						if (i >= chainRun.length) {
							cb();
							return;
						}

						// Run function in chain and call next function when completed
						chainRun[i](function() { runChain(cb, i+1); })
					};

				// Run chained functions
				runChain(function() {

					// We are initialized, register an away alerter
					$(window).bind('beforeunload', function() {
						if (VAS.alertUnload) {
							return "Navigating away will stop your current game session.";
						}
					});

				});

			}, 500)


		}

		/**
		 * VAS Post-login initialize
		 */
		VAS.postLoginInitialize = function(cb) {

			// Run post-login initialization in sequence
			var sequence = [
					function(cb) {
						// Fetch & Cache definitions
						DB.cacheTable("definitions", function(records, cache) {
							// Unserialize documents
							for (var i=0; i<records.length; i++) {
								cache[records[i].key] = JSON.parse(records[i].value);
							}
							cb();
						});
					},
					function(cb) {
						// Fetch & First-Time definitions
						DB.cacheTable("first_time", function() {
							cb();
						});
					}
				],
				seq_index = 0,
				seq_next = function() {
					if (seq_index >= sequence.length) {
						cb();
					} else {
						sequence[seq_index]( seq_next );
						seq_index += 1;
					}
				};

			// Start sequence
			seq_next();

		}

		/**
		 * Display the cinematic screen
		 */
		VAS.displayCinematic = function( video, callback ) {

			// Initialize cinematic screen
			VAS.scrCinematic.onCallbackDefined(callback);
			VAS.scrCinematic.onCinematicDefined(video, (function() {

				// Show cinematic screen
				UI.selectScreen("screen.cinematic");

			}).bind(this));

		}

		/**
		 * Display the courseroom
		 */
		VAS.displayCourse = function( name, callback ) {

			// Initialize courseroom
			VAS.scrCourseroom.onCourseDefined(name);
			UI.selectScreen("screen.courseroom");

			// Rebind callback
			VAS.scrCourseroom.off('completed');
			if (callback) {
				VAS.scrCourseroom.on('completed', callback);
			}

		}

		/**
		 * Display the team window
		 */
		VAS.displayTeam = function() {
			// Show team screen
			UI.selectScreen("screen.team");
		}

		/**
		 * Display menu.
		 */
		VAS.displayMenu = function( animateBackwards ) {

			// Select home screen
			UI.selectScreen("screen.menu", animateBackwards ? UI.Transitions.ZOOM_OUT : UI.Transitions.ZOOM_IN);

		}

		/**
		 * Check user's record and show the appropriate home screen
		 * configuration.
		 */
		VAS.displayHome = function( animateBackwards ) {

			// Select home screen
			UI.selectScreen("screen.home", animateBackwards ? UI.Transitions.ZOOM_OUT : UI.Transitions.ZOOM_IN);

		}

		/**
		 * Display the jobs screen
		 */
		VAS.displayJobs = function( animateBackwards ) {

			// Select jobs screen
			UI.selectScreen("screen.jobs", animateBackwards ? UI.Transitions.ZOOM_OUT : UI.Transitions.ZOOM_IN);

		}

		/**
		 * Check user's record and show the appropriate courses screen
		 * configuration.
		 */
		VAS.displayKnowledge = function( animateBackwards ) {

			// Get user's knowledge from database 
			User.getKnowledgeTree(function(config) {

				// Setup home screen
				VAS.scrKnowledge.onTopicTreeUpdated( config );

				// Select home screen
				UI.selectScreen("screen.knowledge", animateBackwards ? UI.Transitions.ZOOM_OUT : UI.Transitions.ZOOM_IN);


			});

		}

		/**
		 * Display user's status page.
		 */
		VAS.displayStatus = function( animateBackwards ) {

			// Select user status screen
			UI.selectScreen("screen.status", animateBackwards ? UI.Transitions.DIFF_LEFT : UI.Transitions.DIFF_RIGHT);

		}

		/**
		 * Check user's configuration and display the appropriate tuning screen
		 */
		VAS.displayTuningScreen = function(anim) {

			// Get tuning configuration
			User.getTuningConfiguration(function(config) {

				// Start task
				VAS.scrTuning.onTuningConfigUpdated( config );

				// Display tuning screen
				UI.selectScreen("screen.tuning", anim)

			});


		}

		/**
		 * Display random questions from user's book registry
		 */
		VAS.displayExamOverlay = function(anim) {

			// Get tuning configuration
			User.getBookQuestions(function(questions) {

				// Display questionnaire overlay
				UI.showOverlay("overlay.questionaire")
					.onQuestionaireDefined( questions );

			});


		}

		/**
		 * Display the results screen
		 */
		VAS.displayResultsScreen = function( values ) {

			VAS.scrResults.onUpdate( values );

			UI.selectScreen("screen.results");

			var score = 0;
			if (values <= Config['validate']['good']) {
				score = 5;
			} else if (values <= Config['validate']['average']) {

			} else {

			}


		}

		/**
		 * Display the results screen
		 */
		VAS.displayBook = function( bookID ) {

			// Display book
			var comBook = UI.showOverlay("overlay.book");

			// Update metadata
			comBook.onMetaUpdate({ 'book': bookID });

		}

		/**
		 * Check the completed results and continue as required
		 */
		VAS.handleSimulationCompletion = function(histograms) {

			// Calcualte chi-squared average
			var chiAvg = 0;
			for (var i=0; i<histograms.length; i++) {
				// Calculate chi-squared between the data and the reference histogram
				chiAvg += LiveQCalc.chi2WithError( histograms[i].data, histograms[i].ref.data );
			}
			chiAvg /= histograms.length;

			// Get task details & validation minimum
			var taskDetails = DB.cache['tasks'][VAS.runningTask],
				minChi = 1;
				if (taskDetails && taskDetails['validate'] && taskDetails['validate']['accept'])
					minChi = taskDetails['validate']['accept'];

			// Show results screen
			UI.displayResultsScreen( chiAvg, taskDetails['validate'] );

			// Check if we accept this value
			if (chiAvg <= minChi) {
				// Activate next tasks/topics
				User.markTaskCompleted( VAS.runningTask, VAS.runningTopic );
			}

		}

		window.markCompleted = function() {
				User.markTaskCompleted( VAS.runningTask, VAS.runningTopic );
		}

		/**
		 * Initialize VAS with the given game configuration and run
		 */
		VAS.run = function() {

			// Run main game
			UI.selectScreen( "screen.login" );
			//UI.selectScreen( "screen.home" );

		}

		return VAS;
	}

);