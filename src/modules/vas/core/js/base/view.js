
define(["jquery", "vas/core/base/component", "core/ui/view"], 

	/**
	 * This module extends the component class in order to provide a renderable view
	 * using mustache.js templates.
	 *
	 * @exports core/base/view
	 */
	function ($, Component, BaseView) {

		/**
		 * Instantiate a new View
		 *
		 * @class
		 * @classdesc The base View class, for rendering HTML-Templated views.
		 * @param {DOMElement} hostDOM - The DOM element where the component should be hosted in
		 * @see {@link module:core/util/event_base~EventBase|EventBase} (Parent class)
		 */
		var View = function( hostDOM ) {

			// Initialize superclasses
			Component.call(this, hostDOM);
			BaseView.call(this, false, hostDOM);

		}

		// Subclass from EventBase
		View.prototype = $.extend(Component.prototype, BaseView.prototype);

		// Return component
		return View;

	}

);