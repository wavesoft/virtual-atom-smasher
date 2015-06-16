/**
 * Define packages
 */
require.config({
	
	packages: [
		{
			'name': 'vas/core',
			'location': 'vas/core/js'
		},
		{
			'name': 'vas/basic',
			'location': 'vas/basic/js'
		},
		{
			'name': 'vas/3d',
			'location': 'vas/3d/js'
		},
		{
			'name': 'vas/media',
			'location': 'vas/media/js'
		},
	],

	paths: {

		'vas/core/img' : 'vas/core/img',
		
		'vas/basic/img' : 'vas/basic/img',
		'vas/basic/tpl' : 'vas/basic/tpl',
		'vas/basic/css' : 'vas/basic/css',

		'vas/media/img' : 'vas/core/img',
		'vas/media/mov' : 'vas/core/mov',

	}

});
