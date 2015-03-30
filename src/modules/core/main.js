/**
 * Define packages
 */
require.config({
	
	packages: [
		"core/db",
		"core/util",
		{
			'name' 	: 'core/analytics',
			'main'	: 'analytics'
		},
		"core/ui",
	]

});
