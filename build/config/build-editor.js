({

    /**
     * Directory where to place the output files
     */
    dir: "../dist/editor",

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
     * Modules to build
     */
    modules: [
        {
            name: "../app-editor"
        }
    ],

    /**
     * Package configuration
     */
	packages: [

		/////////////////////////////////
		// From app-editor.js
		/////////////////////////////////

		'extern',
		'core',
		{
			'name': 'tootr',
			'location': 'tootr/js'
		},
		{
			'name': 'tootr_editor',
			'location': 'tootr_editor/js'
		},

		/////////////////////////////////
		// From core/main.js
		/////////////////////////////////

		'core/db',

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
			'main'		: 'popcorn-1.5.6'
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
		}

	],

	map: {
		'*': {
			'less': 'extern/require-less/less'
		}
	}

})
