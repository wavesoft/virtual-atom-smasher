({

    /**
     * Directory where to place the output files
     */
    dir: "../dist/game",

	/**
	 * Where the sources are located
	 */
    appDir: "../../src",

    /**
     * Base directory for the modules
     */
    baseUrl: "modules",

    /**
     * Remove combined files
     */
    removeCombined: true,

    /**
     * Exclude files:
     *
     * - All the editor-related files
     * - All .less files (are generated by less compiler in Makefile)
     * - All .bak files
     * - Some unused externals: require-less
     * - Debug version of the VAS configuratino file
     */
    fileExclusionRegExp: /^.*?-editor\..*|\.less$|\.bak$|require-less|config-debug/,

    /**
     * Pragmas to inform for the release build
     */
    pragmas: {
		releaseBuild: true
    },

    /**
     * Modules to build
     */
    modules: [
        {
            name: "../app-game",
            include: [

            	// Embed the dynamic modules
            	// WARNING: All these modules *MUST* be named explicitly
				"vas/core",
				"vas/basic",
				"vas/media",
				"vas/3d/main",
				"google-tag-manager"

            ]
        }
    ],

    /**
     * Global configuration
     */
	config: {
		'waitSeconds'	: 20
	},

    /**
     * Package configuration
     */
	packages: [

		/////////////////////////////////
		// From app-game.js
		/////////////////////////////////
		'extern',
		'core',
		'vas',
		{
			'name': 'tootr',
			'location': 'tootr/js'
		},

		/////////////////////////////////
		// From core/vas.js
		/////////////////////////////////

		{
			'name': 'vas/core',
			'location': 'vas/core/js'
		},
		{
			'name': 'vas/basic',
			'location': 'vas/basic/js'
		},
		{
			'name': 'vas/media',
			'location': 'vas/media/js'
		},
		{
			'name': 'vas/3d',
			'location': 'vas/3d/js'
		},

		/////////////////////////////////
		// From core/main.js
		/////////////////////////////////

		"core/db",
		"core/util",
		"core/analytics",
		"core/ui",

		/////////////////////////////////
		// From extern/main.js
		/////////////////////////////////

		{
			'name'		: 'jquery',
			'location'	: 'extern/jquery/js',
			'main'		: 'jquery-2.1.1'
		},
		{
			'name'		: 'jquery-ui',
			'location'	: 'extern/jquery-ui/js',
			'main'		: 'jquery-ui-1.11.0'
		},
		{
			'name'		: 'jquery-transition-event',
			'location'	: 'extern/jquery-transition-event/js',
			'main'		: 'jquery-transition-event'
		},
		{
			'name'		: 'fabric',
			'location'	: 'extern/fabric/js',
			'main'		: 'fabric-1.4.9'
		},
		{
			'name'		: 'three',
			'location'	: 'extern/three/js',
			'main'		: 'three-67'
		},
		{
			'name'		: 'three-extras',
			'location'	: 'extern/three-extras'
		},
		{
			'name'		: 'bootstrap',
			'location'	: 'extern/bootstrap/js',
			'main'		: 'bootstrap-3.1.1'
		},
		{
			'name'		: 'tweenjs',
			'location'	: 'extern/tweenjs/js',
			'main'		: 'tweenjs'
		},
		{
			'name'		: 'popcorn',
			'location'	: 'extern/popcorn/js',
			'main'		: 'popcorn-8ae202a'
		},
		{
			'name'		: 'jquery-knob',
			'location'	: 'extern/jquery-knob/js',
			'main'		: 'jquery-knob-1.2.8'
		},
		{
			'name'		: 'd3',
			'location'	: 'extern/d3/js',
			'main'		: 'd3-3.5.5.min'
		},
		{
			'name'		: 'sha1',
			'location'	: 'extern/sha1/js',
			'main'		: 'sha1'
		},
		{
			'name'		: 'dragdealer',
			'location'	: 'extern/dragdealer/js',
			'main'		: 'dragdealer'
		},
		{
			'name'		: 'colorpicker',
			'location'	: 'extern/colorpicker/js',
			'main'		: 'colorpicker.min'
		},
		{
			'name'		: 'codemirror',
			'location'	: 'extern/codemirror/js',
			'main'		: 'codemirror'
		},
		{
			'name'		: 'mustache',
			'location'	: 'extern/mustache/js',
			'main'		: 'mustache'
		},
		{
			'name'		: 'quill',
			'location'	: 'extern/quill/js',
			'main'		: 'quill-0.19.8.min'
		},
		{
			'name'		: 'google-tag-manager',
			'location'	: 'extern/google-tag-manager/js'
		},
		{
			'name'		: 'mathjax',
			'location'	: 'extern/mathjax/js'
		},
		{
			'name'		: 'ccl-tracker',
			'location'	: 'extern/ccl-tracker/js',
			'main'		: 'ccltracker-1.0.min'
		}
	],

	paths: {
		'tootr/img' 	: 'tootr/img',
		'vas/core/img'	: 'vas/core/img',
		'vas/basic/img' : 'vas/basic/img',
		'vas/basic/tpl' : 'vas/basic/tpl',
		'vas/basic/css' : 'vas/basic/css',
		'vas/media/img' : 'vas/media/img',
		'vas/media/mov' : 'vas/media/mov',

		// Use the production config
		'vas/config' 	: 'vas/config-prod',

	},

	map: {
		'*': {
			'less' 		: 'extern/require-less/js/less',
			'text' 		: 'extern/require-text/js/text-2.0.14',
		},
	}

})
