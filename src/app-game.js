
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
 */
requirejs(['require', 'extern', 'core', 'vas', 'tootr', 'less!../app-game'], 
	function (require, Extern, Core, VAS, Tootr) {

		require(
			[
				// Core components required by bootstrap
				"jquery",
				"vas/core",
				// Game modules
				"vas/basic",
				"vas/3d/main",
			], 
			function($, main) {

				console.log("Loaded!");
				$(function() {
					console.log("Initializing...");
					// Initialize VAS 
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
