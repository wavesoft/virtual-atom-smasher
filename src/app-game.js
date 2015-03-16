
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

	paths: {
		'tootr/img': 'tootr/img'
	},

	map: {
		'*': {
			'less': 'extern/require-less/js/less',
			'text': 'extern/require-text/js/text-2.0.14'
		},
	}

});

/**
 * Start application
 *
 * NOTE: First load packages and then require() the actual code modules
 */
requirejs(['require', 'extern', 'core', 'vas', 'tootr' ], //'less!../app-game'], 
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
