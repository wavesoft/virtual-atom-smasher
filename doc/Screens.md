This document contains a list with all the UI components currently used in the Virtual Atom Smasher game.



# Table of Contents

<table>
	<tr>
		<th>Component</th>
		<th>Base Class</th>
		<th>Base Class Module</th>
	</tr>

	<tr>
		<td><code><a href="#widgetobservabletuning">widget.observable.tuning</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L53">ObservableWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L53">vas/core/base/tuning_components</a></td>
	</tr>

	<tr>
		<td><code><a href="#widgetonscreen">widget.onscreen</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L926">Popup</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L926">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#widgettunabletuning">widget.tunable.tuning</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L25">TunableWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L25">vas/core/base/tuning_components</a></td>
	</tr>

	<tr>
		<td><code><a href="#widgettunabletuningpanel">widget.tunable.tuningpanel</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L76">TuningPanel</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L76">vas/core/base/tuning_components</a></td>
	</tr>

	<tr>
		<td><code><a href="#datavizhistogram">dataviz.histogram</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#datavizhistogram_combined">dataviz.histogram_combined</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#datavizhistogram_full">dataviz.histogram_full</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#datavizhistogram_fullratio">dataviz.histogram_fullratio</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#datavizhistogram_ratio">dataviz.histogram_ratio</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#datavizobservable">dataviz.observable</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaybook">overlay.book</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayembed">overlay.embed</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayfeedback">overlay.feedback</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayflash">overlay.flash</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayhistograms">overlay.histograms</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayjobstatus">overlay.jobstatus</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaymachinepart">overlay.machinepart</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaymachinepartdescribe">overlay.machinepart.describe</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">ViewComponent</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaymachinepartpaper">overlay.machinepart.paper</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">ViewComponent</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaymachinepartresults">overlay.machinepart.results</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">ViewComponent</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaymachinepartunlock">overlay.machinepart.unlock</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">ViewComponent</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlaypublicpapers">overlay.publicpapers</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayquestionaire">overlay.questionaire</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#overlayswitchteam">overlay.switchteam</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#explainblackboard">explain.blackboard</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L573">ExplainScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L573">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#tutorialagent">tutorial.agent</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/agent.js#L23">VisualAgent</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/agent.js#L23">vas/core/base/agent</a></td>
	</tr>

	<tr>
		<td><code><a href="#profilepartbook">profilepart.book</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#profilepartpapers">profilepart.papers</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#profilepartteam">profilepart.team</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#profilepartuser">profilepart.user</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#navmini">nav.mini</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L859">Nav</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L859">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#backdropknowledge">backdrop.knowledge</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">Backdrop</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#backdroplogin">backdrop.login</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">Backdrop</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#backdropmachine">backdrop.machine</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">Backdrop</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#backdropprogress">backdrop.progress</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">Backdrop</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#backdropresults">backdrop.results</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">Backdrop</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenbsod">screen.bsod</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L431">BSODScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L431">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screencinematic">screen.cinematic</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L736">CinematicScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L736">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screencourseroom">screen.courseroom</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L368">CourseroomScene</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L368">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenhome">screen.home</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">HomeScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenjobs">screen.jobs</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">HomeScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenknowledge">screen.knowledge</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">HomeScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenlogin">screen.login</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js">LoginScree</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenmenu">screen.menu</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">Component</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">vas/core/base/component</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenobservableshort">screen.observable.short</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L232">ObservableScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L232">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenprogress">screen.progress</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L810">ProgressScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L810">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenregister">screen.register</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L399">RegisterScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L399">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenresults">screen.results</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L703">ResultsScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L703">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenstatus">screen.status</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenteam">screen.team</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">TeamScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenteammachines">screen.team.machines</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">TeamScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenteammessages">screen.team.messages</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">TeamScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenteamnotebook">screen.team.notebook</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">TeamScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screenteampeople">screen.team.people</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">TeamScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screentuning">screen.tuning</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L54">TuningScreen</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L54">vas/core/base/components</a></td>
	</tr>

	<tr>
		<td><code><a href="#screentutorialintrostats">screen.tutorial.introstats</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">View</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">vas/core/base/view</a></td>
	</tr>

	<tr>
		<td><code><a href="#infoblockknowledge">infoblock.knowledge</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#infoblockobservable">infoblock.observable</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>

	<tr>
		<td><code><a href="#infoblocktunable">infoblock.tunable</a></code></td>
		<td><code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">DataWidget</a></code></td>
		<td><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">vas/core/base/data_widget</a></td>
	</tr>
</table>

# UI Widgets

## widget.observable.tuning


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/widget.observable.tuning.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>widget.observable.tuning</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/tuning/observable</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L53">[vas/core/base/tuning_components]<strong>.ObservableWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/observable.js#L13">vas/basic/js/components/tuning/observable.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the observable point in the `screen.observable.short` screen that moves towards the center when the chi-squared fit test gets smaller.


### Used by
 * Component [screen.observable.short](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_observable_short.js#L66)


## widget.onscreen


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/widget.onscreen.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>widget.onscreen</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/onscreen</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L926">[vas/core/base/components]<strong>.Popup</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/onscreen.js#L14">vas/basic/js/components/onscreen.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an 'on-screen pop-up' frame that is used to explain various interface parts in-place.


### Used by
 * Component [screen.knowledge](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_knowledge.js#L99)
 * Component [widget.observable.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/observable.js#L94)
 * Component [widget.tunable.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/tunable.js#L98)


## widget.tunable.tuning


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/widget.tunable.tuning.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>widget.tunable.tuning</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/tuning/tunable</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L25">[vas/core/base/tuning_components]<strong>.TunableWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/tunable.js#L13">vas/basic/js/components/tuning/tunable.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a slider widget used by the user to input a value of a tunable parameter.


### Used by
 * Component [widget.tunable.tuningpanel](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/tuning_panel.js#L48)


## widget.tunable.tuningpanel


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/widget.tunable.tuningpanel.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>widget.tunable.tuningpanel</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/tuning/tuning_panel</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/tuning_components.js#L76">[vas/core/base/tuning_components]<strong>.TuningPanel</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/tuning_panel.js#L13">vas/basic/js/components/tuning/tuning_panel.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an auto-sized frame that contains one or more tuning widgets. This is used in the tuning screen.


### Used by
 * Component [screen.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_tuning.js#L166)


# Data Visualization

## dataviz.histogram


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>dataviz.histogram</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/dataviz/histogram</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram.js#L16">vas/basic/js/dataviz/histogram.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [infoblock.observable](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/infoblock/observable.js#L45)


## dataviz.histogram_combined


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/dataviz.histogram_combined.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>dataviz.histogram_combined</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/dataviz/histogram_combined</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram_combined.js#L19">vas/basic/js/dataviz/histogram_combined.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This histogram combines the `dataviz.histogram_full` and `dataviz.histogram_fullratio` into a vertical split-view histogram that shows both value and ratio.


### Used by
 * Component [overlay.histograms](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/histograms.js#L299)


## dataviz.histogram_full


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/dataviz.histogram_full.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>dataviz.histogram_full</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/dataviz/histogram_full</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram_full.js#L70">vas/basic/js/dataviz/histogram_full.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an detailed visualisation of the histogram bins with error bars and error bands.


### Used by
 * Component [dataviz.histogram_combined](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram_combined.js#L29)


## dataviz.histogram_fullratio


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/dataviz.histogram_fullratio.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>dataviz.histogram_fullratio</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/dataviz/histogram_fullratio</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram_fullratio.js#L16">vas/basic/js/dataviz/histogram_fullratio.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an detailed visualisation of the ratio of the histogram bins between theory and reference.


### Used by
 * Component [dataviz.histogram_combined](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram_combined.js#L30)


## dataviz.histogram_ratio


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/dataviz.histogram_ratio.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>dataviz.histogram_ratio</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/dataviz/histogram_ratio</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/histogram_ratio.js#L16">vas/basic/js/dataviz/histogram_ratio.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a simplified visualisation of the ratio of the histogram bins between theory and reference.


### Used by
 * Component [infoblock.observable](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/infoblock/observable.js#L46)


## dataviz.observable


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>dataviz.observable</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/dataviz/observable</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/dataviz/observable.js#L16">vas/basic/js/dataviz/observable.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [infoblock.observable](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/infoblock/observable.js#L44)


# Overlay Window

## overlay.book


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.book.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.book</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/book</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/book.js#L33">vas/basic/js/overlays/book.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an overlay screen that shows a multi-tabbed interface with explainations regarding a parameter


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L1028)


## overlay.embed


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.embed</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/embed</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/embed.js#L17">vas/basic/js/overlays/embed.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L981)


## overlay.feedback


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.feedback</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/feedback</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/feedback.js#L17">vas/basic/js/overlays/feedback.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L1073)


## overlay.flash


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.flash</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/flash</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/flash.js#L22">vas/basic/js/overlays/flash.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/ui](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/ui.js#L797)
 * Module [vas/core/ui](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/ui.js#L863)


## overlay.histograms


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.histograms.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.histograms</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/histograms</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/histograms.js#L22">vas/basic/js/overlays/histograms.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an overlay screen that shows to the user a collection of histograms that may be dynamically updated.


### Used by
 * Component [screen.jobs](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_jobs.js#L114)
 * Component [screen.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_tuning.js#L285)
 * Component [overlay.machinepart.results](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/machineparts/results.js#L259)


## overlay.jobstatus


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.jobstatus.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.jobstatus</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/jobstatus</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/jobstatus.js#L19">vas/basic/js/overlays/jobstatus.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an overlay screen that shows the status of a running job.


### Used by
 * Component [screen.jobs](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_jobs.js#L197)


## overlay.machinepart


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.machinepart.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.machinepart</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/machinepart</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L17">vas/basic/js/overlays/machinepart.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an overlay screen used in the tuning screen to explain details of a particular machine part.


### Used by
 * Component [screen.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_tuning.js#L214)


## overlay.machinepart.describe


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.machinepart.describe.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.machinepart.describe</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/machineparts/describe</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">[vas/core/base/view]<strong>.ViewComponent</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/machineparts/describe.js#L17">vas/basic/js/machineparts/describe.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a tab in the `overlay.machinepart` screen that describes a part of the machine.


### Used by
 * Component [overlay.machinepart](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L35)


## overlay.machinepart.paper


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.machinepart.paper.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.machinepart.paper</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/machineparts/papers</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">[vas/core/base/view]<strong>.ViewComponent</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/machineparts/papers.js#L18">vas/basic/js/machineparts/papers.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a tab in the `overlay.machinepart` screen that provides quick access to the user's papers.


### Used by
 * Component [overlay.machinepart](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L38)


## overlay.machinepart.results


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.machinepart.results.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.machinepart.results</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/machineparts/results</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">[vas/core/base/view]<strong>.ViewComponent</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/machineparts/results.js#L18">vas/basic/js/machineparts/results.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a tab in the `overlay.machinepart` screen that provides quick access to the user's past results.


### Used by
 * Component [overlay.machinepart](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L37)


## overlay.machinepart.unlock


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/overlay.machinepart.unlock.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.machinepart.unlock</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/machineparts/unlock</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js">[vas/core/base/view]<strong>.ViewComponent</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/machineparts/unlock.js#L18">vas/basic/js/machineparts/unlock.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a tab in the `overlay.machinepart` screen that provides the unlocking interface to more parameters.


### Used by
 * Component [overlay.machinepart](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L36)


## overlay.publicpapers


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.publicpapers</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/publicpapers</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/publicpapers.js#L19">vas/basic/js/overlays/publicpapers.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [profilepart.papers](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/profileparts/papers.js#L31)


## overlay.questionaire


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.questionaire</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/questionaire</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/questionaire.js#L17">vas/basic/js/overlays/questionaire.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L953)


## overlay.switchteam


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>overlay.switchteam</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/overlays/switchteam</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/switchteam.js#L19">vas/basic/js/overlays/switchteam.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [profilepart.team](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/profileparts/team.js#L31)


# Explaination Helpers

## explain.blackboard


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/explain.blackboard.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>explain.blackboard</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/explain/blackboard</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L573">[vas/core/base/components]<strong>.ExplainScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/explain/blackboard.js#L18">vas/basic/js/components/explain/blackboard.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the blackboard canvas that is used by the courseroom screen to render the tootr animation.


### Used by
 * Component [screen.courseroom](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_courseroom.js#L109)


# Tutorials

## tutorial.agent


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/tutorial.agent.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>tutorial.agent</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/tvhead_agent</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/agent.js#L23">[vas/core/base/agent]<strong>.VisualAgent</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tvhead_agent.js#L66">vas/basic/js/components/tvhead_agent.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is an interactive agent that is used to explain various interface components to the user.


### Used by
 * Module [vas/core/ui](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/ui.js#L548)


# Other Components

## profilepart.book


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/profilepart.book.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>profilepart.book</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/profileparts/books</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/profileparts/books.js#L28">vas/basic/js/profileparts/books.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a floating tab in the `screen.status` screen that shows the knowledge the user has explored so far.


### Used by
 * Component [screen.status](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_status.js#L38)


## profilepart.papers


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/profilepart.papers.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>profilepart.papers</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/profileparts/papers</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/profileparts/papers.js#L18">vas/basic/js/profileparts/papers.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a floating tab in the `screen.status` screen that shows to the user the papers (s)he has access to.


### Used by
 * Component [screen.status](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_status.js#L39)


## profilepart.team


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/profilepart.team.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>profilepart.team</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/profileparts/team</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/profileparts/team.js#L18">vas/basic/js/profileparts/team.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a floating tab in the `screen.status` screen that shows the status of the user's team.


### Used by
 * Component [screen.status](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_status.js#L40)


## profilepart.user


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/profilepart.user.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>profilepart.user</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/profileparts/user</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/profileparts/user.js#L18">vas/basic/js/profileparts/user.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a floating tab in the `screen.status` screen that shows the user's profile.


### Used by
 * Component [screen.status](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_status.js#L41)


# Navigations

## nav.mini


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>nav.mini</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/nav_mini</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L859">[vas/core/base/components]<strong>.Nav</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L18">vas/basic/js/components/nav_mini.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L180)


# Background Graphics (Backdrops)

## backdrop.knowledge


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>backdrop.knowledge</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/backdrop_knowledge</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">[vas/core/base/components]<strong>.Backdrop</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/backdrop_knowledge.js#L18">vas/basic/js/components/backdrop_knowledge.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [screen.knowledge](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_knowledge.js#L167)


## backdrop.login


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/backdrop.login.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>backdrop.login</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/backdrop_login</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">[vas/core/base/components]<strong>.Backdrop</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/backdrop_login.js#L18">vas/basic/js/components/backdrop_login.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
That's the background graphics (static or dynamic) of the log-in screen.


### Used by
 * Component [screen.login](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_login.js#L37)


## backdrop.machine


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>backdrop.machine</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/backdrop_machine</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">[vas/core/base/components]<strong>.Backdrop</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/backdrop_machine.js#L103">vas/basic/js/components/backdrop_machine.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [screen.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_tuning.js#L105)


## backdrop.progress


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/backdrop.progress.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>backdrop.progress</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/backdrop_progress</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">[vas/core/base/components]<strong>.Backdrop</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/backdrop_progress.js#L18">vas/basic/js/components/backdrop_progress.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
That's the background graphics (static or dynamic) of the progress screen.


### Used by
 * Component [screen.progress](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_progress.js#L27)


## backdrop.results


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>backdrop.results</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/backdrop_results</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L903">[vas/core/base/components]<strong>.Backdrop</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/backdrop_results.js#L18">vas/basic/js/components/backdrop_results.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [screen.results](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_results.js#L37)


# Game Screen

## screen.bsod


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.bsod</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_bsod</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L431">[vas/core/base/components]<strong>.BSODScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_bsod.js#L18">vas/basic/js/components/screen_bsod.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L52)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L160)


## screen.cinematic


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.cinematic</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_cinematic</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L736">[vas/core/base/components]<strong>.CinematicScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_cinematic.js#L19">vas/basic/js/components/screen_cinematic.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L511)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L825)


## screen.courseroom


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.courseroom.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.courseroom</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_courseroom</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L368">[vas/core/base/components]<strong>.CourseroomScene</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_courseroom.js#L18">vas/basic/js/components/screen_courseroom.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a virtual classroom screen, where guests are shown a procedural TootR presentation while alowing them to interact with eachother.


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L551)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L838)


## screen.home


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.home</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_home</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">[vas/core/base/components]<strong>.HomeScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_home.js#L18">vas/basic/js/components/screen_home.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L197)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L478)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L873)
 * Component [screen.knowledge](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_knowledge.js#L207)


## screen.jobs


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.jobs.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.jobs</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_jobs</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">[vas/core/base/components]<strong>.HomeScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_jobs.js#L18">vas/basic/js/components/screen_jobs.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the job dashboard screen, where user can see the status of his/her jobs and the relevant machines and control them.


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L524)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L883)


## screen.knowledge


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.knowledge</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_knowledge</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L653">[vas/core/base/components]<strong>.HomeScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_knowledge.js#L148">vas/basic/js/components/screen_knowledge.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L590)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L102)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L118)


## screen.login


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.login.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.login</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_login</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js">[vas/core/base/components]<strong>.LoginScree</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_login.js#L22">vas/basic/js/components/screen_login.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the landing screen shown to the user when (s)he arrives in the game. From this screen (s)he should be able to log-in, create an account or reset his/her password.


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L304)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L440)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L539)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L704)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L1135)


## screen.menu


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.menu</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_menu</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/component.js#L20">[vas/core/base/component]<strong>.Component</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_menu.js#L18">vas/basic/js/components/screen_menu.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L564)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L862)


## screen.observable.short


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.observable.short.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.observable.short</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_observable_short</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L232">[vas/core/base/components]<strong>.ObservableScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_observable_short.js#L18">vas/basic/js/components/screen_observable_short.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a target-like screen where the status of the observables. Whle the observable results are getting better, each observable point is moving closer to the center.


### Used by
 * Component [screen.jobs](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_jobs.js#L72)


## screen.progress


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.progress.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.progress</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_progress</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L810">[vas/core/base/components]<strong>.ProgressScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_progress.js#L18">vas/basic/js/components/screen_progress.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the splash screen shown during the game initialisation. It has a progress bar in the bottom that shows the current loading state.


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L155)


## screen.register


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.register.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.register</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_register</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L399">[vas/core/base/components]<strong>.RegisterScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_register.js#L35">vas/basic/js/components/screen_register.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the registration screen shown to the user when (s)he selects to register in the game.


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L336)


## screen.results


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.results</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_results</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L703">[vas/core/base/components]<strong>.ResultsScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_results.js#L23">vas/basic/js/components/screen_results.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L401)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L1008)


## screen.status


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.status.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.status</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_status</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_status.js#L21">vas/basic/js/components/screen_status.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is a game screen where the user can see the status of varous game components, such as his/her papers, team, knowledge etc..


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L419)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L915)


## screen.team


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.team</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_team</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">[vas/core/base/components]<strong>.TeamScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team.js#L23">vas/basic/js/components/screen_team.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L455)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L853)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L104)


## screen.team.machines


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.team.machines</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_team_machines</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">[vas/core/base/components]<strong>.TeamScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_machines.js#L18">vas/basic/js/components/screen_team_machines.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L455)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L99)
 * Component [screen.team.people](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_people.js#L48)
 * Component [screen.team.notebook](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_notebook.js#L50)
 * Component [screen.team.messages](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_messages.js#L50)


## screen.team.messages


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.team.messages</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_team_messages</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">[vas/core/base/components]<strong>.TeamScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_messages.js#L18">vas/basic/js/components/screen_team_messages.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L456)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L101)
 * Component [screen.team.people](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_people.js#L54)
 * Component [screen.team.machines](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_machines.js#L57)
 * Component [screen.team.notebook](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_notebook.js#L53)


## screen.team.notebook


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.team.notebook</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_team_notebook</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">[vas/core/base/components]<strong>.TeamScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_notebook.js#L18">vas/basic/js/components/screen_team_notebook.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L455)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L100)
 * Component [screen.team.people](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_people.js#L51)
 * Component [screen.team.machines](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_machines.js#L54)
 * Component [screen.team.messages](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_messages.js#L53)


## screen.team.people


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.team.people</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_team_people</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L336">[vas/core/base/components]<strong>.TeamScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_people.js#L18">vas/basic/js/components/screen_team_people.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L455)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L98)
 * Component [screen.team.machines](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_machines.js#L51)
 * Component [screen.team.notebook](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_notebook.js#L47)
 * Component [screen.team.messages](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_team_messages.js#L47)


## screen.tuning


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/screen.tuning.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.tuning</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_tuning</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/components.js#L54">[vas/core/base/components]<strong>.TuningScreen</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_tuning.js#L24">vas/basic/js/components/screen_tuning.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the main game screen from which user changes the monte-carlo simulation parameters (refered to as 'tuning').


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L656)
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L931)
 * Component [nav.mini](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/nav_mini.js#L115)
 * Component [overlay.machinepart](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L189)
 * Component [overlay.machinepart](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/overlays/machinepart.js#L196)


## screen.tutorial.introstats


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>screen.tutorial.introstats</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/components/screen_introgame</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/view.js#L20">[vas/core/base/view]<strong>.View</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_introgame.js#L65">vas/basic/js/components/screen_introgame.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Module [vas/core/main](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/main.js#L388)


# Information Pop-up Block

## infoblock.knowledge


<table>
	<tr>
		<td><img width="350" src="https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Thumbnails/blank.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>infoblock.knowledge</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/infoblock/knowledge</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/infoblock/knowledge.js#L16">vas/basic/js/infoblock/knowledge.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
(Missing description)


### Used by
 * Component [screen.knowledge](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/screen_knowledge.js#L103)


## infoblock.observable


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/infoblock.observable.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>infoblock.observable</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/infoblock/observable</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/infoblock/observable.js#L19">vas/basic/js/infoblock/observable.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the body of the pop-up infoblock that explains an observable.


### Used by
 * Component [widget.observable.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/observable.js#L99)


## infoblock.tunable


<table>
	<tr>
		<td><img width="350" src="https://raw.githubusercontent.com/wavesoft/virtual-atom-smasher/master/doc/Thumbnails/infoblock.tunable.png" /></td>
		<td>
			<table>
			    <tr>
			        <th>Name:</th>
			        <td><code>infoblock.tunable</code></td>
			    </tr>
			    <tr>
			        <th>Module:</th>
			        <td>
			            <code>vas/basic/infoblock/tunable</code>
			        </td>
			    </tr>
			    <tr>
			        <th>Base Class:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/core/js/base/data_widget.js#L20">[vas/core/base/data_widget]<strong>.DataWidget</strong></a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>JS File:</th>
			        <td>
			            <code><a href="https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/infoblock/tunable.js#L16">vas/basic/js/infoblock/tunable.js</a></code>
			        </td>
			    </tr>
			    <tr>
			        <th>CSS File:</th>
			        <td>
			            <code><a href=""></strong></a></code>
			        </td>
			    </tr>
			</table>
		</td>
	</tr>
</table>
This is the body of the pop-up infoblock that explains a tunable.


### Used by
 * Component [widget.tunable.tuning](https://github.com/wavesoft/virtual-atom-smasher/blob/master/src/modules/vas/basic/js/components/tuning/tunable.js#L111)
