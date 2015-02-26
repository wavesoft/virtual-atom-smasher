/**
 * [core/ui/view/plugin-checkbox-vis] - A plugin that offers DOM Visibility controlled by checkboxes
 */
define(["require","jquery"], 
	function(require, $) {

		/**
		 * A templated view
		 */
		var CheckboxVisPlugin = function( view ) {
			this.view = view;
		}

		/**
		 * Fired by the plugin view controller when DOM elements are rendered
		 */
		CheckboxVisPlugin.prototype.postRender = function( dom, data ) {

			// Helper function to apply checkbox state to matching elements
			function checkbox_apply(elm, target, fade, invert) {
				var targets = dom.find(target),
					show = elm.is(":checked");
				if (invert) show=!show;
				if (show) {
					if (!fade) {
						targets.show();
					} else if (fade == "fade") {
						targets.fadeIn();
					}
				} else {
					if (!fade) {
						targets.hide();
					} else if (fade == "fade") {
						targets.fadeOut();
					}
				}
			}

			// Find all checkboxes with 'data-show'
			dom.find("input[type=checkbox][data-show]").each(function(i,e) {
				var elm = $(e);
				checkbox_apply(elm, elm.data("show"), elm.data("show-fade"), false);
				elm.click(function(e) {
					checkbox_apply(elm, elm.data("show"), false);
				})
			});

			// Find all checkboxes with 'data-hide'
			dom.find("input[type=checkbox][data-hide]").each(function(i,e) {
				var elm = $(e);
				checkbox_apply(elm, elm.data("hide"), elm.data("hide-fade"), true);
				elm.click(function(e) {
					checkbox_apply(elm, elm.data("hide"), elm.data("hide-fade"), true);
				})
			});

		};

		/**
		 * Return CheckboxVisPlugin definition
		 */
		return CheckboxVisPlugin;

	}
);