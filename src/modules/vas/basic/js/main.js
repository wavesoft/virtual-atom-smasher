
define(

	// Named alias
	"vas/basic", [ 'require',
	
	// Dependencies

	// Screens
	'vas/basic/components/screen_bsod',
	'vas/basic/components/screen_cinematic',
	'vas/basic/components/screen_courseroom',
	'vas/basic/components/screen_home',
	'vas/basic/components/screen_ipide',
	'vas/basic/components/screen_jobs',
	'vas/basic/components/screen_knowledge',
	'vas/basic/components/screen_login',
	'vas/basic/components/screen_menu',
	'vas/basic/components/screen_progress',
	'vas/basic/components/screen_register',
	'vas/basic/components/screen_results',
	'vas/basic/components/screen_team',
	'vas/basic/components/screen_team_machines',
	'vas/basic/components/screen_team_messages',
	'vas/basic/components/screen_team_notebook',
	'vas/basic/components/screen_team_people',
	'vas/basic/components/screen_tuning',
	'vas/basic/components/screen_tutorial_stats',
	'vas/basic/components/screen_status',
	'vas/basic/components/screen_introgame',
	'vas/basic/components/screen_passwordreset',
	'vas/basic/components/screen_simulation',
	// 'vas/basic/components/screen_home_new',

	// Subscreens
	'vas/basic/components/screen_observable_short',

	// Other components
	'vas/basic/components/nav_mini',
	'vas/basic/components/tvhead_agent',

	// Backdrops
	'vas/basic/components/backdrop_home',
	'vas/basic/components/backdrop_knowledge',
	'vas/basic/components/backdrop_login',
	'vas/basic/components/backdrop_machine',
	'vas/basic/components/backdrop_progress',
	'vas/basic/components/backdrop_results',
	'vas/basic/components/backdrop_tuning',

	// Tuning-related
	"vas/basic/components/tuning/observable",
	"vas/basic/components/tuning/pin",
	"vas/basic/components/tuning/pin_widget",
	"vas/basic/components/tuning/status-observe",
	"vas/basic/components/tuning/status-tune",
	"vas/basic/components/tuning/tunable", 
	"vas/basic/components/tuning/tuning_panel",

	// Running-related
	"vas/basic/components/running/observable",
	"vas/basic/components/running/status",

	// Simulation screen-related
	'vas/basic/components/simulation/observable_point',

	// Misc components
	"vas/basic/components/onscreen",	

	// Explain screen details
	'vas/basic/components/explain/blackboard',
	'vas/basic/components/explain/book',
	'vas/basic/components/explain/machine',
	'vas/basic/components/explain/physics',

	// Data
	'vas/basic/data/trainhisto',

	// Data vizualization
	'vas/basic/dataviz/histogram',
	'vas/basic/dataviz/histogram_full',
	'vas/basic/dataviz/histogram_fullratio',
	'vas/basic/dataviz/histogram_plain',
	'vas/basic/dataviz/histogram_ratio',
	'vas/basic/dataviz/histogram_combined',
	'vas/basic/dataviz/observable',

	// Information blocks
	'vas/basic/infoblock/book',
	'vas/basic/infoblock/knowledge',
	'vas/basic/infoblock/observable',
	'vas/basic/infoblock/tunable',

	// Overlays
	'vas/basic/overlays/book',
	'vas/basic/overlays/flash',
	'vas/basic/overlays/histograms',
	'vas/basic/overlays/questionaire',
	'vas/basic/overlays/machinepart',
	'vas/basic/overlays/jobstatus',
	'vas/basic/overlays/publicpapers',
	'vas/basic/overlays/switchteam',
	'vas/basic/overlays/feedback',
	'vas/basic/overlays/embed',
	'vas/basic/overlays/help',
	'vas/basic/overlays/eligibility',

	// Machine parts
	'vas/basic/machineparts/describe',
	'vas/basic/machineparts/papers',
	'vas/basic/machineparts/results',
	'vas/basic/machineparts/unlock',

	// Profile parts
	'vas/basic/profileparts/achievements',
	'vas/basic/profileparts/books',
	'vas/basic/profileparts/papers',
	'vas/basic/profileparts/user',
	'vas/basic/profileparts/team',

], function(require) {

	// Return module configuration
	return {
		'img' : require.toUrl('../img')
	};

});
