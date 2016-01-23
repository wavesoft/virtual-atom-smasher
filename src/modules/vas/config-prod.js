
define({

	/**
	 * The DOM element where the whole game is going to be
	 * developed around.
	 */
	'dom-host' 			: '#game-frame',

	/**
	 * Forum VAS API URL
	 */
	'forum_vas_api'		: '/forum/vasapi.php',

	/**
	 * Base URL for images
	 */
	'images_url'		: 'static/img',

	/**
	 * LiveQ-Specific configuration
	 */
	'liveq' : {
		'socket_url'	: 'wss://test4theory.cern.ch/vas/labsocket/'
	},

	/**
	 * API to LiveQ
	 */
	'core' : {
		'socket_url' :  ((window.location.protocol=="https:") ? 'wss:' : 'ws:') + '//test4theory.cern.ch/vas/api/io'
	},

	/**
	 * CouchDB Database Configuration
	 */
	'db': {
		'url' 			: '//test4theory.cern.ch/vas/db',
		'databases'		: {
			'tunables'		: 'tunables',
			'observables'	: 'observables',
			'levels'		: 'levels',
		}
	},

	/**
	 * Configurable classes for various components
	 */
	'css': {
		'nav-mini'		: 'nav-mini',
		'screen'		: 'screen',
		'overlay'		: 'overlay',
		'overlay-flash'	: 'overlay-flash',
		'backdrop'		: 'backdrop',
		'foreground'	: 'foreground',
		'error-screen' 	: 'error-screen',
	},

	/**
	 * Color transition points between good-average-bad values,
	 * normalized to 1.0.
	 */
	'chi2-bounds': {
		'min'		: 0.1,
		'good'		: 1,
		'average'	: 4,
		'max'		: 500,
	},

	/**
	 * Voice API
	 */
	'voiceapi': {
		'baseURL'	: "//test4theory.cern.ch/voiceapi",
		'api_key'	: "9b7b04b2ebc87af8723d09b4123f1c8fe62dad75"
	},

	/**
	 * Enforce 'http' (webapi and survey bugfix)
	 */
	'enforce_http': true,

	/**
	 * Version
	 */
	'version': 'master-f999a9d',

});
