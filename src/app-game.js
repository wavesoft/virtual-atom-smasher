
/**
 * Configure application
 */
requirejs.config({

	//By default load any module IDs from js/lib
	'baseUrl': 'modules',

	// Import external packages
	'packages': [
		'extern',
		'game'
	]

});

/**
 * Start application
 */
requirejs(['extern', 'game'],
	function (Extern, Game) {

	}
);
