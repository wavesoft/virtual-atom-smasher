
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

					// Initialize VAS 
					console.log("Initializing...");
					main.initialize(function() {
						// Wait until VAS is ready and run it
						console.log("Running...");
						main.run();
					});

				});

			}
		);

	}
);
