
define(

	// Requirements
	["vas/config", "vas/core/registry", "vas/core/base/components", "vas/core/ui"],

	/**
	 * Basic black screen of death
	 *
	 * @exports vas-basic/floats/notifications
	 */
	function(config,R,C,UI) {

		/**
		 * @class
		 * @classdesc The basic black screen of death
		 */
		var NotificationFloat = function( hostDOM ) {
			C.NotificationFloat.call(this, hostDOM);

			// Make this screen bsod
			hostDOM.addClass("notifications");

			// Create image and text placeholders
			this.eHost = $('<div class="notifications-host"></div>').appendTo(hostDOM);

			// List of notifications
			this.notifications = [];
			this.notificationIndex = { };

		}
		NotificationFloat.prototype = Object.create( C.NotificationFloat.prototype );

		/**
		 * Realign notifications
		 */
		NotificationFloat.prototype.realign = function() {

		}

		///////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////
		////                            HOOK HANDLERS                              ////
		///////////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////////

		/**
		 * A notification was added
		 */
		NotificationFloat.prototype.onNotificationAdded = function( nid, notf ) {

			// Get or create element
			var inst = null;
			if (this.notificationIndex[nid] == undefined) {

				// Store notification object on list
				inst = this.notificationIndex[nid] = notf;
				this.notifications.push(inst);

				// Create element
				inst.element = $('<div class="notification"></div>').appendTo(this.eHost);

			} else {

				// Otherwise, fetch element from store
				inst = this.notificationIndex[nid];

				// Update properties
				inst['title'] = notf['title'];
				inst['icon'] = notf['icon'];

			}

			// Update item properties
			inst.element.find('.title').text( notf['title'] );
			inst.element.find('.icon').attr('class', inst['icon'] );

			// Realign items
			this.realign();

		}

		/**
		 * A notification was removed
		 */
		NotificationFloat.prototype.onNotificationRemoved = function( nid ) {

			// Lookup element
			if (this.notificationIndex[nid] == undefined) return;
			var elm = this.notificationIndex[nid].element;

			// Remove item from store
			var idx = this.notifications.indexOf( this.notificationIndex[nid] );
			if (idx >= 0) this.notifications.splice(idx, 1);
			delete this.notificationIndex[nid];

			// Fade out and remove
			elm.fadeOut(250, (function() {
				elm.remove();
			}).bind(this));

		}

		/**
		 * A notification should be focused
		 */
		NotificationFloat.prototype.onNotificationFocus = function( nid ) {

			// Lookup element
			if (this.notificationIndex[nid] == undefined) return;
			var elm = this.notificationIndex[nid].element;

			// Cleanup previous handlers
			elm.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

			// Add -> Animate -> Remove sequence
			elm.addClass( "notification-focus" )
			elm.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (function() {

				// Remove focs class
				elm.removeClass( "notification-focus" );

			}).bind(this));
		}

		// Register login screen
		R.registerComponent( "float.notifications", NotificationFloat, 1 );

	}

);