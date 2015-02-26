/**
 * [core/ui/view] - A templated view
 */
define(["require", "mustache", "jquery"], 
	function(require, Mustache, $) {

		/**
		 * Generic purpose function to get value of a DOM element
		 */
		function get_element_value(elm) {

			// Missing elements? Do nothing...
			if (elm.length == 0) return;

			// If the element is checkbox, return the ":checked" value
			if (elm.is("input[type=checkbox]") || elm.is("input[type=radio]")) {

				// Return if checked
				return elm.is(":checked");

			// If field is input, use value
			} else if (elm.is("input,textarea,datalist,select")) {

				// Return value
				return elm.val();

			// If it's a dynamic selection list, look for 'selected'
			} else if (elm.is(".form-input-list")) {

				// Return selected item value
				var sel = elm.find(".selected"),
					val = sel.val();

				// Try other fields if value is missing
				if (!val) val = sel.attr("value");
				if (!val) val = sel.data("value");
				return val;

			}

		}

		/**
		 * Generic purpose function to set value of a DOM element
		 */
		function set_element_value(elm, value) {

			// Missing elements? Do nothing...
			if (elm.length == 0) return;

			// If the element is checkbox, return the ":checked" value
			if (elm.is("input[type=checkbox]") || elm.is("input[type=radio]")) {
				// Update checked
				elm.attr( "checked", value ? "checked" : "" );

			// If field is input, use value
			} else if (elm.is("input,textarea,datalist,select")) {
				elm.val( value );

			// If it's a dynamic selection list, update 'selected'
			} else {

				// Change only if we match next field
				var sel = elm.find("*[data-value=" + value + "],*[value=" + value + "]");
				if (sel.length > 0) {
					// Deselect current element
					elm.find(".selected").removeClass("selected");
					// Select next
					sel.addClass("selected");
				}

			}

		}

		/**
		 * A templated view
		 */
		var View = function(template, hostDOM) {

			// Prepare local fields
			this.viewData = {};
			this.hostDOM = hostDOM;
			this.viewSelectors = [];

			// View input elements
			this.forms = [];

			// Plugins
			this.viewPlugins = [];
			this.viewWaitPlugins = {
				counter: 0,
				hooks: []
			};

			// Import template
			if (template)
				this.loadTemplate(template);

		}

		/**
		 * Load a template plugin
		 */
		View.prototype.loadTemplatePlugin = function( name ) {

			// Increment plugin counter
			this.viewWaitPlugins.counter++;

			// Asynchronously load plug-in
			require([name], (function(pluginClass) {

				// Instantiate and register
				var plugin = new pluginClass(this);
				this.viewPlugins.push(plugin);

				// Fire pluginReady
				if (plugin.pluginReady)
					plugin.pluginReady( );

				// Decrement plugin counter and callback on zero
				if (!--this.viewWaitPlugins.counter) {
					// Fire hooks
					for (var i=0; i<this.viewWaitPlugins.hooks.length; i++)
						this.viewWaitPlugins.hooks[i]();
					// And reset
					this.viewWaitPlugins.hooks = [];
				}

			}).bind(this));
		}

		/**
		 * Set a view field
		 */
		View.prototype.loadTemplate = function( template ) {
			// Import template
			this.viewTemplate = String(template);
			Mustache.parse(this.viewTemplate);
		}

		/**
		 * Set a view field
		 */
		View.prototype.setViewData = function(key, value) {
			var transaction = {};
			
			// Normalize set({}), and set("","") cases
			if (typeof(key) == "object") {
				transaction = keyl
			} else {
				transaction[key] = value;
			}

			// Process transaction
			for (k in transaction) {
				this.viewData[k] = transaction[k];
			}

		}

		/**
		 * Get a view field value
		 */
		View.prototype.getViewData = function(key) {
			return this.viewData[key];
		}

		/**
		 * Get a value from an input element in the view
		 */
		View.prototype.valueOf = function(selector) {
			// No DOM? Empty...
			if (!this.hostDOM) return "";
			// No element? Empty...
			return get_element_value( this.hostDOM.find(selector) );
		}

		/**
		 * Set a value to an input element
		 */
		View.prototype.setValue = function(selector, value) {
			// No DOM? Empty...
			if (!this.hostDOM) return "";
			// No element? Empty...
			return set_element_value( this.hostDOM.find(selector), value );
		}

		/**
		 * Bind a DOM handler on the given path
		 */
		View.prototype.select = function(selector, callback) {
			// If we have no callback, find and return
			if (callback) {
				// Store selectors on list
				this.viewSelectors.push([selector, callback]);
				// If we have DOM, also run it now
				if (this.hostDOM)
					callback(this.hostDOM.find(selector));
			} else {
				// Return 
				if (!this.hostDOM) return $();
				return this.hostDOM.find(selector);
			}
		};

		/**
		 * Update view
		 */
		View.prototype.renderView = function() {
			var self = this,
				delayWrapper = (function() {

				// Plugins: preRender
				for (var i=0; i<this.viewPlugins.length; i++) {
					if (this.viewPlugins[i].preRender)
						this.viewPlugins[i].preRender( this.hostDOM, this.viewData );
				}

				// Render template
				this.hostDOM.html( Mustache.render(this.viewTemplate, this.viewData) );

				// Plugins: postRender
				for (var i=0; i<this.viewPlugins.length; i++) {
					if (this.viewPlugins[i].postRender)
						this.viewPlugins[i].postRender( this.hostDOM, this.viewData );
				}

				// Introspect DOM forms
				this.forms = [];
				this.hostDOM.find("form").each(function(i, elm) {
					var elm = $(elm),
						f = { 'elements': {} };

					// Abort accidental form submissions
					elm.submit(function(e) {
						e.preventDefault();
						return false;
					});

					// Iterate over input or input-like elements
					elm.find("input,textarea,datalist,select,.form-input-list").each(function(i, inpElm) {
						
						// Get field name from the fields:
						// [ name=, data-name=, or id= ]
						var  inpElm = $(inpElm),
							 name = inpElm.attr("name");
						if (!name) name = inpElm.data("name");
						if (!name) name = inpElm.attr("id");
						if (!name) return;

						// Define property
						Object.defineProperty(f, name, {
							// Get input field value
							get: function() {
								return get_element_value(inpElm);
							},
							// Set input field value
							set: function(value) {
								set_element_value(inpElm,value);
							}
						});

						// Store element
						f.elements[name] = inpElm;

					});

					// Look if we have a name for the form in the fields:
					// [ name=, data-name=, or id= ]
					var name = elm.attr("name");
					if (!name) name = elm.data("name");
					if (!name) name = elm.attr("id");

					// If we have a name, add a keyed value for the form
					self.forms.push(f);
					if (name) self.forms[name] = f;

				});

				// In any case, we have a new DOM, run selectors
				this._updateSelectors();
			}).bind(this);
			
			// If there are plug-ins pending loading, wait for them before
			if (this.viewWaitPlugins.counter > 0) {
				this.viewWaitPlugins.hooks.push( delayWrapper );
			} else {
				delayWrapper();
			}

		}

		/**
		 * Run the selectors
		 */
		View.prototype._updateSelectors = function() {
			// If we don't have any DOM, that's useless
			if (!this.hostDOM) return;
			// Run selectors now
			for (var i=0; i<this.viewSelectors.length; i++) {
				this.viewSelectors[i][1]( this.hostDOM.find(this.viewSelectors[i][0]) );
			}
		};

		/**
		 * Return view definition
		 */
		return View;

	}
);