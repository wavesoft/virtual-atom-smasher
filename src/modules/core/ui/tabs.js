/**
 * [core/ui/tabs] - Reusable component for tabs
 */
define([], function() {

	/**
	 * The Tabs class is responsible for automatically managing tabbed views
	 */
	var Tabs = function( bodyHost, tabsHost ) {

		// Keep body and tabs variables
		this.bodyHost = $(bodyHost);
		this.tabsHost = $(tabsHost);

		// Prepare tabs
		this.tabs = [];

		// Pre-populate items
		var tabs = this.tabsHost.children(),
			bodies = this.bodyHost.children();
		for (var i=0; i<tabs.length; i++) {
			if (i >= bodies.length) break;
			this._adoptTab( $(tabs[i]), $(bodies[i]) );
		}

		// Focus active tab or first
		var activeTab = this.tabsHost.find("li.active");
		if (activeTab.length == 0) {
			this.tabsHost.children().first().click();
		} else {
			activeTab.click();
		}

	}

	/**
	 * Focus a particular tab
	 */
	Tabs.prototype._adoptTab = function( tab, body ) {

		// Register IDs
		var id = $(tab).data("id");
		if (tab.attr("class").indexOf("tab-") < 0) tab.addClass("tab-"+id);
		if (body.attr("class").indexOf("body-") < 0) body.addClass("body-"+id);

		// Register a click handler
		var self = this;
		tab.click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			var id = $(this).data("id");
			self.selectTab(id);
		});

	}

	/**
	 * Focus a particular tab
	 */
	Tabs.prototype.selectTab = function( id ) {
		// Unfocus everything
		this.bodyHost.children().hide();
		this.tabsHost.children().removeClass("active");
		// Focus ID
		this.bodyHost.find(".body-"+id).show();
		this.tabsHost.find(".tab-"+id).addClass("active");
	}

	/**
	 * Create new tabs
	 */
	Tabs.prototype.createTab = function( id, title ) {
		var tab = $('<li></li>').text(title).data("id", id),
			body = $('<div></div>');

		// Put components in place
		this.bodyHost.append(body);
		this.tabsHost.append(tab);
		this._adoptTab( tab, body );

		// Return body
		return body;
	}

	/**
	 * Expose class
	 */
	return Tabs;

});