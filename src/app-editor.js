
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
			'name': 'tootr',
			'location': 'tootr/js'
		},
		{
			'name': 'tootr_editor',
			'location': 'tootr_editor/js'
		}
	]

});

/**
 * Start application
 */
requirejs(['extern', 'core', 'tootr', 'tootr_editor', 'less!app-game'], 
	function (Extern, Core, Tootr, TootrEditor) {

	}
);
