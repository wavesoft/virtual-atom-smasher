
/**
 * [core/main] - Core initialization module
 */
define("vas/core",

	["jquery", "ccl-tracker", "vas/config",  "vas/core/registry", "vas/core/ui", "vas/core/db", "vas/core/user", "vas/core/apisocket", "vas/core/base/components", "core/util/progress_aggregator", "vas/core/liveq/core", "vas/core/liveq/Calculate" ], 

	function($, Analytics, config, R, UI, DB, User, APISocket, Components, ProgressAggregator, LiveQCore, LiveQCalc) {
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
		 * Show introduction tutorial if not yet seen
		 */
		var showIntroIfNeeded = function( readyCallback ) {

			// If not first time seen
			if (!User.isFirstTimeSeen("intro")) {

					// Ask user if he/she wants to take the intro tutorial
					UI.scheduleFlashPrompt(
						"Welcome to V.A.S.", 
						"Is this your first time you join the Virtual Atom Smasher game?", 
						[
							{ 
								"label"    : "Yes, guide me!",
								"class"    : "btn-yellow",
							  	"callback" : function(){
									// Display the intro sequence
									UI.scheduleSequence( DB.cache['definitions']['intro-sequence']['sequence'] , function() {
										// Mark introduction sequence as shown
										User.markFirstTimeAsSeen("intro");

										// Fire ready callback when finished
										if (readyCallback) readyCallback();

									});
								}
							},
							{
								"label"    : "Later",
								"class"    : "btn-darkblue",
								"callback" : function(){
									// Mark introduction sequence as shown
									User.markFirstTimeAsSeen("intro");
									// Fire ready callback
									if (readyCallback) readyCallback();
								}
							}
						],
						"logo.png"
					);

			} else {

				// Fire ready callback right away
				if (readyCallback) readyCallback();

			}

		}

		/**
		 * Initialize VAS to the given DOM element
		 */
		VAS.initialize = function( readyCallback ) {

			// If we have HTTP enforcing, apply it now
			if (config.enforce_http && (window.location.protocol != "http:")) {

				// Skip if we have '#noenforce' hash
				if (window.location.hash != '#noenforce') {
					// Redirect and return
					window.location = 'http:' + String(window.location).split(":")[1];
					return;
				}
				
			}

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
				if (dim !== undefined) {
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
				if (type == "critical") {
					UI.growl(message, 0, "critical")
				} else {
					UI.growl(message, 5000, type || "success")
				}
			});
			User.on('flash', function(title,body,icon) {
				UI.scheduleFlash(title, body, icon);
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
						UI.logError(message);
					});

					// Critical socket error
					APISocket.on('critical', function(message) {
						// API socket error
						UI.logError(message, true);
						prog_api.fail("Could not initialize core I/O socket!" + message, true);
					});

					// Handle notifications
					APISocket.on('notification', function(evDetails) {
						if (evDetails['type'] == "critical") {
							// Do not expire on critical
							UI.growl(evDetails['message'], 0, "critical");

						} else if (evDetails['type'] == "flash") {
							// Flash goes to flash
							UI.scheduleFlash(
								evDetails['title'],
								evDetails['message'],
								evDetails['icon']
								);
						} else if (evDetails['type'] == "analytics") {
							// Forward analytics event
							Analytics.fireEvent( evDetails['id'], evDetails['data'] || {} );
						} else {
							// Any other type goes to growl
							var msg = evDetails['message'];
							if (evDetails['title'])
								msg = "<strong>"+evDetails['title']+":</strong> " + msg;
							UI.growl(msg, evDetails['type'])
						}
					});

					// Handle commands
					APISocket.on('command', function(cmdDetails) {

						// Display a tutorial
						if (cmdDetails['type'] == "tutorial") {
							// Schedule tutorial
							UI.scheduleTutorial( cmdDetails['name'] );
						}
						
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

								// Start activity autocommit
								VAS.startActivityAutocommit();

								// Post-login initialize
								VAS.postLoginInitialize(function() {
									// Display home page
									VAS.displayTuningScreen();
								});

							}
						});
					});
					scrLogin.on('register', function(email, password) {
						UI.showOverlay("screen.register", function(scrRegister) {

							// Update information
							scrRegister.onProfileDefined({
								'email': email,
								'password': password
							});

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

										// Alert on unload
										VAS.alertUnload = true;

										// Start activity autocommit
										VAS.startActivityAutocommit();

										// Post-login initialize
										VAS.postLoginInitialize(function() {
											// Display home page
											VAS.displayTuningScreen();
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
					scrStatus.on('feedback', function(data) {
						VAS.sendFeedback(data);
					});
                    scrStatus.on('logout', function(data) {
                        // Go to login screen
						UI.selectScreen("screen.login");
                        // Logout
                        APISocket.openAccount().logout();
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
						UI.scheduleFlash(title, body, icon);
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

					// Bind events
					scrJobs.on('hideJobs', function() {
						VAS.displayTuningScreen(UI.Transitions.DIFF_BOTTOM);
					});
					scrJobs.on('feedback', function(data) {
						VAS.sendFeedback(data);
					});
					scrJobs.on('logout', function(data) {
                        // Go to login screen
						UI.selectScreen("screen.login");
                        // Logout
                        APISocket.openAccount().logout();
					});

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
								UI.scheduleFlash(
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
						UI.scheduleFlash(title, body, icon);
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
					scrTuning.on('showCourse', function(courseName) {
						VAS.displayCourse(courseName, function() {
							VAS.displayTuningScreen();
						});
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
					scrTuning.on('flash', function(title,body,icon) {
						UI.scheduleFlash(title, body, icon);
					});
					scrTuning.on('displayStatus', function() {
						VAS.displayStatus();
					});
					scrTuning.on('displayJobs', function() {
						VAS.displayJobs();
					});
					scrTuning.on('feedback', function(data) {
						VAS.sendFeedback(data);
					});
                    scrTuning.on('logout', function(data) {
                        // Go to login screen
						UI.selectScreen("screen.login");
                        // Logout
                        APISocket.openAccount().logout();
					});

					// Reload tuning configuration
					scrTuning.on('reload', function() {
						User.getTuningConfiguration(function(config) {
							scrTuning.onTuningConfigUpdated( config );
						});
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
					},
					function(cb) {
						// Show pre-evaluation questionnaire
						if (!User.isFirstTimeSeen("learningeval.pre")) {
							VAS.displayLearningEval(function(completed) {
								if (completed) User.markFirstTimeAsSeen("learningeval.pre");
								cb();
							});
						} else {
							cb();
						}
					},
					function(cb) {
						// Show introduction screen if needed, otherwise
						// fire the callback right away
						showIntroIfNeeded( cb );
					}
				],
				seq_index = -1,
				seq_next = function() {
					if (seq_index >= sequence.length-1) {
						cb();
					} else {
						seq_index += 1;
						sequence[seq_index]( seq_next );
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
			UI.selectScreen("screen.jobs", animateBackwards ? UI.Transitions.DIFF_BOTTOM : UI.Transitions.DIFF_TOP);

		}

		/**
		 * Check user's record and show the appropriate courses screen
		 * configuration.
		 */
		VAS.displayKnowledge = function( animateBackwards ) {

			/* DEPRECATED!
			// Get user's knowledge from database 
			User.getKnowledgeTree(function(config) {

				// Setup home screen
				VAS.scrKnowledge.onTopicTreeUpdated( config );

				// Select home screen
				UI.selectScreen("screen.knowledge", animateBackwards ? UI.Transitions.ZOOM_OUT : UI.Transitions.ZOOM_IN);


			});
			*/

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
		VAS.displayTuningScreen = function( anim ) {

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
		VAS.displayExamOverlay = function( cb_completed ) {

			// Get tuning configuration
			User.getBookExam(function(questions) {

				// Check for missing questions
				if (!questions) {
					UI.growl("There are no questions available for the knowledge you have explored so far!")
					return;
				}

				// Display questionnaire overlay
				UI.showOverlay("overlay.questionaire", (function(qOvr) {
					qOvr.onQuestionaireDefined({
						'id' 		: 'book-exam',
						'title' 	: '<span class="glyphicon glyphicon-ok-circle"></span> Take out a pen and paper!',
						'subtitle'	: 'Here is a quick questionaire. If you successfuly pass this you can get up to <strong>10</strong> science points!',
						'questions'	: questions,
						'validate'	: true,
						'skip' 		: false,
					})
					qOvr.on("answers", function(answers) {
						User.sendBookAnswers(answers);
					});
					qOvr.on("close", function() {
						if (cb_completed) cb_completed();
					});
				}).bind(this));

			});


		}

		/**
		 * Display learning evaluation questionnaire
		 */
		VAS.displayLearningEval = function( cb_completed ) {

			// Display evaluation
			UI.showOverlay("overlay.embed", (function(qOvr) {

				// Configure Embed frame
				qOvr.onEmbedConfigured({
					'url' 	: '//tecfalabs.unige.ch/survey/index.php/948573/lang-en/newtest/Y?userID=' + User.profile['trackid'],
					'block'	: true,
				});

				// Handle close event
				qOvr.on("close", function() {
					if (cb_completed) cb_completed(true);
				});
				qOvr.on("dispose", function() {
					if (cb_completed) cb_completed(false);
				});

			}).bind(this));

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
			UI.showOverlay("overlay.book", (function(comBook) {

				// Update metadata
				comBook.onMetaUpdate({ 'book': bookID });

			}).bind(this));

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

		/**
		 * Send feedback regarding our currently visible interface
		 */
		VAS.sendFeedback = function(details) {
			
			// Show feedback overlay and define details
			UI.showOverlay("overlay.feedback", function(com) {

				// Inject additional information
				details['version'] = config.version;

				com.onFeedbackDetailsDefined(details);
			});

		}

		/**
		 * Submit current activity counter to the server
		 */
		VAS.commitActivity = function() {

			// Calculate activity delta and store on activity counter
			if (VAS.activityTimestamp != 0)
				VAS.activityCounter += (Date.now() - VAS.activityTimestamp);

			// Commit to server
			if (VAS.activityCounter > 0) {
				User.commitActivityTimer( VAS.activityCounter );
				VAS.activityCounter = 0;
			}

			// Update activity timestamp
			VAS.activityTimestamp = Date.now();

		}

		/**
		 * Start commiting user activity
		 */
		VAS.startActivityAutocommit = function() {

			// Define activity timestamp
			VAS.activityTimestamp = Date.now();

			// Commit activity every 30 seconds
			VAS.activityCommitTimer = setInterval( VAS.commitActivity, 30000 )

			// Stop / Start activity on window blur/focus
			$(window).blur(function() {
				// Commit activity
				VAS.commitActivity();
				// Reset timestamp
				VAS.activityTimestamp = 0;
			});

			$(window).focus(function() {
				// Set timestamp
				VAS.activityTimestamp = Date.now();
			});

		}

		/**
		 * Initialize VAS with the given game configuration and run
		 */
		VAS.run = function() {

			// Switch to login screen
			UI.selectScreen( "screen.login" );

			// Start activity counter
			VAS.activityCounter = 0;
			VAS.activityTimestamp = 0;

		}

		return VAS;
	}

);