
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
		{
			'name': 'game',
			'location': 'game/js'
		}
	]

});

/**
 * Start application
 */
requirejs(['extern', 'core', 'game'], 
	function (Extern, Core, Game) {

	}
);
