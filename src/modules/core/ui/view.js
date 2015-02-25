/**
 * [core/ui/view] - A templated view
 */
define(["mustache", "jquery"], 
	function(Mustache, $) {

		/**
		 * A templated view
		 */
		var View = function(template, hostDOM) {

			// Prepare local fields
			this.data = [];
			this.dom = null;
			this.selectors = [];
			this.hostDOM = hostDOM;

			// Import template
			this.template = String(template);
			Mustache.parse(this.template);

		}

		/**
		 * Set a view field
		 */
		View.prototype.set = function(key, value) {
			var transaction = {};
			
			// Normalize set({}), and set("","") cases
			if (typeof(key) == "object") {
				transaction = keyl
			} else {
				transaction[key] = value;
			}

			// Process transaction
			for (k in transaction) {
				this.data[k] = transaction[k];
			}

		}

		/**
		 * Get a view field value
		 */
		View.prototype.get = function(key) {
			return this.data[key];
		}

		/**
		 * Get the view of an input element in the view
		 */
		View.prototype.valueOf = function(selector) {
			// No DOM? Empty...
			if (!this.dom) return "";

			// No element? Empty...
			var elm = this.dom.find(selector);
			if (elm.length == 0) return "";

			// If the element is checkbox, return the ":checked" value
			if (elm.is("input[type=checkbox]") || elm.is("input[type=radio]")) {
				//
				return elm.is(":checked");
			} else {
				// Return value
				return elm.val();
			}
		}

		/**
		 * Bind a DOM handler on the given path
		 */
		View.prototype.select = function(selector, callback) {
			// Store selectors on list
			this.selectors.push([selector, callback]);
			// If we have DOM, also run it now
			if (this.dom)
				callback(this.dom.find(selector));
		};

		/**
		 * Update view
		 */
		View.prototype.update = function() {

			// Render template
			var html = Mustache.render(this.template, this.data);

			// First time render and place
			if (!this.dom) {
				// Render template and define DOM
				this.dom = $(html);
				// Put on host DOM
				if (this.hostDOM)
					this.hostDOM.append(this.dom);
			} else {
				// Otherwise redefine dom's HTML
				this.dom.html(html);
			}

			// In any case, we have a new DOM, run selectors
			this._updateSelectors();

		}

		/**
		 * Run the selectors
		 */
		View.prototype._updateSelectors = function() {
			// If we don't have any DOM, that's useless
			if (!this.dom) return;
			// Run selectors now
			for (var i=0; i<this.selectors.length; i++) {
				this.selectors[i][1]( this.dom.find(this.selectors[i][0]) );
			}
		};

		/**
		 * Return view definition
		 */
		return View;

	}
);