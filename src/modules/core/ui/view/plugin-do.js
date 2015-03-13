/**
 * [core/ui/view/plugin-do] - A plugin that handles do: urls and callsback
 */
define(["require","jquery"], 
	function(require, $) {

		/**
		 * Extract function name and arguments from URL
		 */
		function parseAction(url) {

			// Make sure prefix is do:
			if (url.substr(0,3) != 'do:')
				return false;

			// Get everything after 'do:''
			var parPos = url.indexOf("(");
			if (parPos < 0)
				return false;

			// Get action and arguments
			var action = url.substr(3,parPos-3),
				argStr = url.substr(parPos+1),
				args = [];

			// Parse arguments
			if (argStr) {
				// Trim tailing ')'
				if (argStr.charAt(argStr.length-1) == ")")
					argStr = argStr.substr(0,argStr.length-1);
				// Parse arguments
				try {
					args = eval('[' + argStr + ']');
				} catch(e) {
					console.error("Could not parse '"+argStr+"':",e);
				}
			}

			// Return arguments and action
			return [action, args];

		}

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
		 * Fire the give handlers
		 */
		DOPlugin.prototype.fireDoHandlers = function( action, args ) {
			// Continue only if we have a handler
			if (this.doHandlers[action]) {
				// Fire all handlers
				for (var i=0; i<this.doHandlers[action].length; i++) {
					this.doHandlers[action][i].apply(this, args);
				}
			}
		}

		/**
		 * Fired by the plugin view controller when DOM elements are rendered
		 */
		DOPlugin.prototype.postRender = function( dom, data ) {

			// Handle all links with do: urls
			var self = this;
			dom.find("a[href*='do:']").each(function(i, elm) {

				// Register click handler
				$(elm).click(function(e) {
					e.preventDefault();
					
					var a = parseAction($(this).attr('href'));
					if (!a) return;
					self.fireDoHandlers(a[0], a[1]);
				})

			});

			// Handle all forms with do: actions
			var self = this;
			dom.find("form[action*='do:']").each(function(i, elm) {

				// Register click handler
				$(elm).submit(function(e) {

					// Prevent form's default action
					e.preventDefault();
					e.stopPropagation();

					// On submit, fire action
					var a = parseAction($(this).attr('action'));
					if (!a) return;
					self.fireDoHandlers(a[0], a[1]);

				})

			});

			// Proces all handlers
			var handlers = ['click','mouseover','mouseout','keypress','keydown','keyup'];
			for (var i=0; i<handlers.length; i++) {
				(function(hName){
					dom.find("*[" + hName + "*='do:']").each(function(i, elm) {
						// Register click handler
						$(elm)[hName](function(e) {
							e.preventDefault();
							e.stopPropagation();

							var a = parseAction($(this).attr(hName));
							if (!a) return;
							self.fireDoHandlers(a[0], a[1]);
						})
					});
				})(handlers[i]);
			}


		};

		/**
		 * Return DOPlugin definition
		 */
		return DOPlugin;

	}
);