
define("vas/basic", ['require',

	// Common
	'./common/onscreen',
	'./common/tvhead_agent',

	// Common popus
	'./common/popup/observable',
	'./common/popup/tab/observable_desc',

	// Common data visualization
	'./common/dataviz/histogram_compact',
	'./common/dataviz/histogram_compact_ratio',
	'./common/dataviz/histogram_full',
	'./common/dataviz/histogram_full_ratio',
	'./common/dataviz/histogram_combined',

	// Widgets
	'./common/widget/tunable_slider',

	// Screens
	'./screen/bsod',
	'./screen/login',
	'./screen/progress',
	'./screen/home',
	'./screen/cinematic',
	'./screen/introgame',
	'./screen/simulation',

	// Blocks
	'./screen/block/simulation/observable_point',
	'./screen/block/home/tuning_panel',
	'./screen/block/home/tuning_screen',
	'./screen/block/home/tuning_notepad',
	'./screen/block/home/machine',

	// Backdrops
	'./screen/backdrop/login',
	'./screen/backdrop/progress',
	'./screen/backdrop/home',
	'./screen/backdrop/simulation',

	// Overlays
	'./overlay/register',
	'./overlay/embed',
	'./overlay/flash',
	'./overlay/help',
	'./overlay/jobstatus',
	'./overlay/histograms',
	'./overlay/feedback',
	'./overlay/passwordreset',
	'./overlay/book',
	'./overlay/knowledge',
	'./overlay/papers',
	'./overlay/teams',


], function(require) {

	// Return module configuration
	return {
		'img' : require.toUrl('../img')
	};

});
