/**
 * [core/ui/view/plugin-do] - A plugin that handles do: urls and callsback
 */
define(["require","jquery"], 
	function(require, $) {

		/**
		 * A templated view
		 */
		var DOPlugin = function( view ) {
			var self = this;

			// Prepare variables
			this.view = view;
			this.doHandlers = { };

			// Register handleDoURL
			view.handleDoURL = function(action, handler) {

				// Make usre we have array on handler
				if (self.doHandlers[action] == undefined)
					self.doHandlers[action] = [];

				// Append if not already exists
				if (self.doHandlers[action].indexOf(handler) < 0) {
					self.doHandlers[action].push(handler);
				}

			}

		}

		/**
		 * Fired by the plugin view controller when DOM elements are rendered
		 */
		DOPlugin.prototype.postRender = function( dom, data ) {

			// Handle all do: urls and do: event handlers
			var self = this;
			dom.find("a[href*='do:'],*[click*='do:']").each(function(i, elm) {

				// Register click handler
				$(elm).click(function() {

					// Get everything after do:
					var doPayload = $(this).attr('href') || $(this).attr('click');
						parts = doPayload.substr(3).split("(");

					// Get arguments
					var action = parts[0],
						args = [];

					// Parse arguments
					if (parts.length > 1) {
						// Trim tailing ')'
						var argStr = parts[1];
						if (argStr.charAt(argStr.length-1) == ")")
							argStr = argStr.substr(0,argStr.length-1);
						// Parse arguments
						try {
							args = eval('[' + argStr + ']');
						} catch(e) {
							console.error("Could not parse '"+argStr+"':",e);
						}
					}

					// Fire callback;
					if (self.doHandlers[action]) {
						for (var i=0; i<self.doHandlers[action].length; i++) {
							self.doHandlers[action][i].apply(this, args);
						}
					}

				})

			});

		};

		/**
		 * Return DOPlugin definition
		 */
		return DOPlugin;

	}
);