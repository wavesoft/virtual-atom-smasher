
/**
 * [core/main] - Core initialization module
 */
define("vas/core",

	["jquery", "ccl-tracker", "vas/config",  "vas/core/registry", "vas/core/ui", "vas/core/db", "vas/core/user", "vas/media", "vas/core/apisocket", "vas/core/base/components", "core/util/progress_aggregator", "vas/core/liveq/core", "vas/core/liveq/Calculate" ], 

	function($, Analytics, config, R, UI, DB, User, Media, APISocket, Components, ProgressAggregator, LiveQCore, LiveQCalc) {
		var VAS = { };

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
						"logo/vas.png"
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
			User.on('profile', function(profile) {

				// Check if the user can see the evaluation questionnaire
				if (!User.isFirstTimeSeen("learningeval.post")) {
					User.canTakePostEvaluation(function() {
						VAS.displayPostEvalPrompt();
					});
				}

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

					// Handle server events
					APISocket.on('event', function(evDetails) {
						var evName = evDetails['name'],
							evData = evDetails['data'] || {};

						// -----------------------------
						//  UI Alert Message
						// -----------------------------
						if ( evName == 'alert' ) {

							if (evData['type'] == "critical") {

								// Do not expire on critical
								UI.growl(evData['message'], 0, "critical");

							} else if (evData['type'] == "flash") {

								// Flash goes to flash
								UI.scheduleFlash(
									evData['title'],
									evData['message'],
									evData['icon']
									);

							} else {

								// Any other type goes to growl
								var msg = evData['message'];
								if (evData['title'])
									msg = "<strong>"+evData['title']+":</strong> " + msg;
								UI.growl(msg, evData['type'])

							}
						}

						// -----------------------------
						//  Analytics Event
						// -----------------------------
						else if (evName == "analytics") {

							// Forward analytics event
							Analytics.fireEvent( evData['id'], evData['data'] || {} );

						}

						// -----------------------------
						//  Credits have changed
						// -----------------------------
						else if (evName == "credits") {

							// If the user gets credits show first-time
							if (!User.isFirstTimeSeen("credits.intro")) {
								// Show the science points intro once
								VAS.displayHelp("02-science-points");
								User.markFirstTimeAsSeen("credits.intro");
							}

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
									VAS.displayHomeScreen();
								});

							}
						});
					});
					scrLogin.on('password_reset', function(email) {

						// If e-mail is missing, growl
						if (!email) {
							UI.growl("Please fill-in your e-mail address first!", "alert", 5000);
							return;
						} 

						// Request password reset pin
						var accountAPI = APISocket.openAccount();
						accountAPI.requestPasswordReset(email, function(data) {
							if (data['status'] != "ok") {
								// Growl errors
								UI.growl(data['message'], "alert", 5000);
							} else {

								// When the reset e-mail is sent, open the reset password interface
								UI.showOverlay("overlay.passwordreset", function(scrReset) {

									UI.growl( "We have sent a password reset pin to your e-mail address", "info", 10000 );

									// Call the onProfileDefined functinon to inform the
									// password reset screen about the user's profile.
									scrReset.onProfileDefined({
										'email': email,
									});

									// Wait for 'submit' event to complete password reset
									scrReset.on('submit', function( pin, password ) {

										// Complete password reset
										accountAPI.completePasswordReset( email, pin, password, function(data) {
											if (data['status'] != "ok") {

												// Display errors in the overlay
												scrReset.onPasswordResetError( data['message'] );

											} else {

												// Hide overlay upon completion
												UI.hideOverlay();
												// ----------------------------

												// Alert on unload
												VAS.alertUnload = true;

												// Start activity autocommit
												VAS.startActivityAutocommit();

												// Post-login initialize
												VAS.postLoginInitialize(function() {
													// Display home page
													VAS.displayHomeScreen();
												});

												// ----------------------------

											}
										});

									});

								});

							}
						});


					});
					scrLogin.on('register', function(email, password) {
						UI.showOverlay("overlay.register", function(scrRegister) {

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

										// Hide register overlay
										UI.hideOverlay();

										// Alert on unload
										VAS.alertUnload = true;

										// Start activity autocommit
										VAS.startActivityAutocommit();

										// Post-login initialize
										VAS.postLoginInitialize(function() {
											// Display home page
											VAS.displayHomeScreen();
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
					prog_introstats.ok("Statistics tutorial is ready");
					cb();
				};	

			var //prog_results = progressAggregator.begin(1),
				init_results = function(cb) {
					var scrResults = VAS.scrResults = UI.initAndPlaceScreen("screen.results");
					if (!scrResults) {
						UI.logError("Core: Unable to initialize results screen!");
						return;
					}

					// Bind events
					scrResults.on('help', function(term) {
						VAS.displayHelp(term);
					});
					scrResults.on('hideResults', function() {
						UI.selectPreviousScreen()
					});

					// Complete login
					prog_results.ok("Results screen ready");
					cb();
				};	

			var //prog_status = progressAggregator.begin(1),
				init_status = function(cb) {
					var scrStatus = VAS.scrStatus = UI.initAndPlaceScreen("screen.status");
					if (!scrStatus) {
						UI.logError("Core: Unable to initialize status screen!");
						return;
					}

					// Bind events
					scrStatus.on('help', function(term) {
						VAS.displayHelp(term);
					});
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

			var //prog_team = progressAggregator.begin(1),
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
					scrHome.on('help', function(term) {
						VAS.displayHelp(term);
					});
					scrHome.on('showBook', function(bookID) {
						VAS.displayBook(bookID);
					});
					scrHome.on('showCourse', function(courseName) {
						VAS.displayCourse(courseName, function() {
							VAS.displayTuningScreen();
						});
					});
					scrHome.on('submitParameters', function( values, observables ) {

						// Set job detals and display jobs screen
						VAS.scrJobs.onSubmitRequest( values, observables );
						VAS.displaySimulation();

					});
					scrHome.on('interpolateParameters', function(values) {
						LiveQCore.requestInterpolation( values, 
							function(histograms) {
								scrHome.onUpdate(histograms);
								VAS.referenceHistograms = histograms;
							},
							function(error) {
								UI.growl("Could not request interpolation! "+error, "alert", 5000);
							}
						);

					});
					scrHome.on('flash', function(title,body,icon) {
						UI.scheduleFlash(title, body, icon);
					});
					scrHome.on('displayStatus', function() {
						VAS.displayStatus();
					});
					scrHome.on('displaySimulation', function() {
						VAS.displaySimulation();
					});
					scrHome.on('feedback', function(data) {
						VAS.sendFeedback(data);
					});
                    scrHome.on('logout', function(data) {
                        // Go to login screen
						UI.selectScreen("screen.login");
                        // Logout
                        APISocket.openAccount().logout();
						// Stop auto-commit timers
						VAS.stopActivityAutocommit();
					});

					// Reload tuning configuration
					scrHome.on('reload', function() {
						User.getTuningConfiguration(function(config) {
							scrHome.onTuningConfigUpdated( config );
						});
					});

					// Complete home
					prog_home.ok("Home screen is ready");
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
					prog_cinematic.ok("Cinematic screen is ready");
					cb();
				};				

			var prog_sim = progressAggregator.begin(1),
				init_sim = function(cb) {
					var scrJobs = VAS.scrJobs = UI.initAndPlaceScreen("screen.simulation");
					if (!scrJobs) {
						UI.logError("Core: Unable to initialize jobs screen!");
						return;
					}

					// Bind events
					scrJobs.on('help', function(term) {
						VAS.displayHelp(term);
					});
					scrJobs.on('hideJobs', function() {
						VAS.displayHomeScreen(UI.Transitions.DIFF_BOTTOM);
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
					prog_sim.ok("Simulation screen is ready");
					cb();
				};				

			var //prog_courseroom = progressAggregator.begin(1),
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

			var //prog_menu = progressAggregator.begin(1),
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
						VAS.displaySimulation();
					});
					scrMenu.on('showKnowledge', function() {
						VAS.displayKnowledge();
					});

					// Complete login
					prog_menu.ok("Menu screen ready");
					cb();
				};				

			var //prog_courses = progressAggregator.begin(1),
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
									'flash-icons/books.png'
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
					scrKnowledge.on('help', function(term) {
						VAS.displayHelp(term);
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

			var //prog_tune = progressAggregator.begin(1),
				init_tune = function(cb) {

					// Create tuning screen
					var scrTuning = VAS.scrTuning = UI.initAndPlaceScreen("screen.tuning", Components.TuningScreen);
					if (!scrTuning) {
						UI.logError("Core: Unable to initialize explaination screen!");
						return;
					}

					// Bind events
					scrTuning.on('help', function(term) {
						VAS.displayHelp(term);
					});
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
						VAS.displaySimulation();

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
					scrTuning.on('displaySimulation', function() {
						VAS.displaySimulation();
					});
					scrTuning.on('feedback', function(data) {
						VAS.sendFeedback(data);
					});
                    scrTuning.on('logout', function(data) {
                        // Go to login screen
						UI.selectScreen("screen.login");
                        // Logout
                        APISocket.openAccount().logout();
						// Stop auto-commit timers
						VAS.stopActivityAutocommit();
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
						init_api, 
						init_home, 
						init_sim, 
						init_cinematic, 
						// init_courseroom, 
						// init_courses, 
						init_introstats, 
						init_login, 
						// init_status, 
						// init_team,
						// init_tune, 
						// init_results,
						// init_menu
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
							VAS.displayLearningPreEval(function(completed) {
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
		 * Display a post-evaluation questionnaire prompt
		 */
		VAS.displayPostEvalPrompt = function() {

			// Show prompt only one
			if (VAS.__postEvalPromptShown)
				return;

			// Ask user if he/she wants to take the intro tutorial
			UI.scheduleFlashPrompt(
				"Learning Evaluation", 
				"You seem like a master in this game. Would you like to take a short questionnaire?", 
				[
					{ 
						"label"    : "Yes, show it!",
						"class"    : "btn-blue",
					  	"callback" : function(){
					  		// Display post-evaluation questionnaire
							VAS.displayLearningPostEval(function(completed) {
								if (completed) User.markFirstTimeAsSeen("learningeval.post");
							});
						}
					},
					{
						"label"    : "Later",
						"class"    : "btn-darkblue",
						"callback" : function(){
							// Mark the post-evaluation prompt as shown
							VAS.__postEvalPromptShown = true;
						}
					}
				],
				"flash-icons/atom.png"
			);

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
		VAS.displayHomeScreen = function( anim ) {

			// Select home screen
			if (anim == undefined) anim = UI.Transitions.ZOOM_IN;
			UI.selectScreen("screen.home", anim );

		}

		/**
		 * Display the jobs screen
		 */
		VAS.displaySimulation = function( animateBackwards ) {

			// Select jobs screen
			UI.selectScreen("screen.simulation", animateBackwards ? UI.Transitions.DIFF_BOTTOM : UI.Transitions.DIFF_TOP);

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
		 * Display learning pre-evaluation questionnaire
		 */
		VAS.displayLearningPreEval = function( cb_completed ) {

			// Display evaluation
			UI.scheduleOverlay("overlay.embed", (function(qOvr) {

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
		 * Display learning post-evaluation questionnaire
		 */
		VAS.displayLearningPostEval = function( cb_completed ) {

			// Display evaluation
			UI.scheduleOverlay("overlay.embed", (function(qOvr) {

				// Configure Embed frame
				qOvr.onEmbedConfigured({
					'url' 	: '//tecfalabs.unige.ch/survey/index.php/927274/lang-en/newtest/Y?userID=' + User.profile['trackid'],
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
		 * Display user's eligiblity on the currently active awards
		 */
		VAS.displayEligibility = function( bookID ) {

			// Fetch eligibility details
			User.getEligibilityStatus(function(details) {

				// Show eligibility overlay
				UI.showOverlay("overlay.eligibility", (function(comOverlay) {

					// Update details
					comOverlay.onEligibilityInformation(details);

				}).bind(this));

			});

		}

		/**
		 * Display the introduction video
		 */
		VAS.displayIntro = function() {

			// Display the intro sequence
			UI.scheduleSequence( DB.cache['definitions']['intro-sequence']['sequence'] , function() {
				// Display home page
				VAS.displayHomeScreen();
			});

		}

		/**
		 * Display a help screen for the specified term
		 */
		VAS.displayHelp = function(term) {

			// Handle Videos
			if (term == '00-intro-video') {
				this.displayIntro();

			// Handle images
			} else if (term == '01-help-intro') {
				UI.scheduleHelpOverlay( Media.image("help/01-help-intro.png") );
			} else if (term == '02-science-points') {
				UI.scheduleHelpOverlay( Media.image("help/02-science-points.png") );
			} else if (term == '03-simulation') {
				UI.scheduleHelpOverlay( Media.image("help/03-simulation.png") );
			} else if (term == '04-histogram') {
				UI.scheduleHelpOverlay( Media.image("help/04-histogram.png") );
			} else if (term == '05-learning') {
				UI.scheduleHelpOverlay( Media.image("help/05-learning.png") );
			}

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
			// Enable auto-commit activity flag
			VAS.activityCommitEnabled = true;
		}

		/**
		 * Stop commiting user activity
		 */
		VAS.stopActivityAutocommit = function() {
			// Disable auto-commit activity flag
			VAS.activityCommitEnabled = false;
			// Clear timer
			clearInterval( VAS.activityCommitTimer );
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

		// Stop / Start activity on window blur/focus
		$(window).blur(function() {
			if (!VAS.activityCommitEnabled) return;
			// Commit activity
			VAS.commitActivity();
			// Reset timestamp
			VAS.activityTimestamp = 0;
		});

		$(window).focus(function() {
			if (!VAS.activityCommitEnabled) return;
			// Set timestamp
			VAS.activityTimestamp = Date.now();
		});

		return VAS;
	}

);