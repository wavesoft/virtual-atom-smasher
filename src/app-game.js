
/**
 * Configure application
 */
requirejs.config({

	//By default load any module IDs from js/lib
	'baseUrl': 'modules',

	// Import external packages
	'packages': [
		'extern',
		'core',
		'vas',
		{
			'name': 'tootr',
			'location': 'tootr/js'
		}
	],

    /**
     * Global configuration
     */
	config: {
		'waitSeconds'	: 20
	},

    /**
     * Paths to modules
     */
	paths: {
		'tootr/img' 	: 'tootr/img',
		'vas/config' 	: 'vas/config-debug'
	},

    /**
     * Mapping to other modules
     */
	map: {
		'*': {
			'less'		 : 'extern/require-less/js/less',
			'text'		 : 'extern/require-text/js/text-2.0.14'
		},
	}

});


/**
 * Start application
 *
 * NOTE: First load packages and then require() the actual code modules
 */
requirejs(['require', 'extern', 'core', 'vas', 'tootr'

// ------------------------------------------------------
// When building release version, the LESS code is pre-compiled
// However in debug version, we are using less plugin for dynamic
// re-creation of the css
// ------------------------------------------------------
//>>excludeStart("releaseBuild", pragmas.releaseBuild)
	,'less!../app-game'
//>>excludeEnd("releaseBuild")
// ------------------------------------------------------

	],
	function (require, Extern, Core, VAS, Tootr) {

		require(
			[
				// Core components required by bootstrap
				"jquery",
				"vas/core",
				// Google tag manager
				"google-tag-manager",
				// Game modules
				"vas/basic",
				"vas/3d/main",
			], 
			function($, main, GTM) {

				console.log("Loaded!");
				$(function() {
					
					// Load GTM when libraries are in place
					var gtm = new GTM('GTM-PBX27K');

					// Helper function to run game
					var runGame = function() {
						// Initialize VAS 
						console.log("Initializing...");
						main.initialize(function() {
							// Wait until VAS is ready and run it
							console.log("Running...");
							main.run();
						});
					};

					// Helper function to initialize core components
					// and display BSOD with the given message
					var abortGame = function(message) {
						// Initialize vas/core/main module
						main.initialize(function() {
							// Log critical error (rendered using BSOD)
							require("vas/core/ui").logError(message , true);
						});
					}

					// Chain of additional loading actions
					var loadChain = [];

					// Parse hash-arguments
					var args = { },
						hashParts = String(window.location).split("#"),
						hash = (hashParts.length > 1) ? hashParts[1] : "",
						hashParts = hash.split("&");
					for (var i=0; i<hashParts.length; i++) {
						var parts = hashParts[i].split("="),
							arg = parts[0], value = decodeURIComponent(parts[1]);

						// Load extension pack
						if (arg == "load") {
							var pkgURL = "";
							if (value.indexOf("@") > -1) {
								// Github version
								parts = value.split("@");
								pkgURL = "https://rawgit.com/"+parts[1]+"/"+parts[0]+"/master/src/main.js";
							} else {
								// Raw URL
								pkgURL = value;
							}

							// Register the loading of that package as a chain function
							loadChain.push((function(pkgURL) {
								return function(cb) {
									// Load package by it's URL
									require([ pkgURL ], function( PackageInstance) {

										// Include stylesheet from the customisations
										var parts = pkgURL.split("/"),
											cssURL = parts.slice(0, parts.length-1).join("/") + "/css/style.css";

										// Empbed the CSS element
										alert(cssURL);
										$('<link rel="stylesheet" type="text/css"></link>').attr('href', cssURL).appendTo($('head'));

										// Package is loaded, fire callback
										cb();
									}, function(err) {
										// If an error occured, fire BSOD
										abortGame("Could not load extension " + pkgURL)
									});
								}
							})(pkgURL));

						}

					}

					// Run load chain
					loadChain.push( runGame );
					var loadChainStep = function(cb, index) {
						var i = index || 0;
						// If we run out of chain, stop
						if (i >= loadChain.length) return;
						// Run function in chain and call next function when completed
						loadChain[i](function() { loadChainStep(cb, i+1); })
					};

					// Start load chain
					loadChainStep();

				});

			}
		);

	}
);
