
/**
 * Configure application
 */
requirejs.config({

	//By default load any module IDs from js/lib
	'baseUrl': 'modules',

	// Import external packages
	'packages': [
		'extern',
		'tootr',
		'core',
		'tootr_editor'
	]

});

/**
 * Start application
 */
requirejs(['extern', 'core', 'tootr', 'tootr_editor'], 
	function (Extern, Tootr, TootrEditor) {

	}
);
