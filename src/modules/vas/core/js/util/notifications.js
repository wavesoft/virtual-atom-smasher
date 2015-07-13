
/**
 * [core/util/notifications] - Notification area helper
 */
define(["jquery"], 
	function($) {

		/**
		 * @class
		 * @classdesc Notification Area Helper
		 * @exports core/util/notifications
		 */
		var NotificationArea = function(config) {

			// Positioning configuration
			this.prop = {
				'x': config.xProperty || 'left',
				'y': config.yProperty || 'top'
			};
			this.pos = {
				'x': config.x || 0,
				'y': config.y || 0
			};
			this.distribute = {
				'x': config.distributeX || 1,
				'y': config.distributeY || 0
			};
			this.padding = {
				'x': config.padX || 4,
				'y': config.padY || 4
			};

			// Host element
			this.host = $(config.host) || $("body");

			// Styling information
			this.elementClass = config.elementClass || 'notification';
			this.elementTag = config.elementTag || 'div';
			this.focusClass = config.focusClass || 'notification-focus';

			// Notifications stack
			this.notifications = [];
			this.lastid = 0;

		};

		/**
		 * Allocate a new notification ID
		 */
		NotificationArea.prototype.__newid = function() {
			return "notification-" + (++this.lastid);
		}

		/**
		 * Handle showing and updating a notification element
		 */
		NotificationArea.prototype.__show = function( ntf ) {

			// Clear previous timeout if exists
			if (ntf.__timeoutTimer)
				clearTimeout(ntf.__timeoutTimer);

			// Schdule new timeout if exists
			if (ntf.timeout) {
				ntf.__timeoutTimer = setTimeout(
						(function() {
							this.__remove(notification);
						}).bind(this),
						ntf.timeout
					);
			}

			// If we don't have a focus class, add it now
			if (!ntf.element.hasClass(this.focusClass)) {

				// Cleanup previous handlers
				ntf.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');

				// Add -> Animate -> Remove sequence
				ntf.element.addClass(this.focusClass)
				ntf.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (function() {
					ntf.element.removeClass(this.focusClass)
				}).bind(this));

			}

		}

		/**
		 * Realign stack of elements
		 */
		NotificationArea.prototype.__realign = function() {

			// Start distributing elements
			var x = this.pos.x, y = this.pos.y;
			for (var i=0; i<this.notifications.length; i++) {
				var n = this.notifications[i],
					w = n.element.width(),
					h = n.element.height();

				// Position item
				var attr = {};
				attr[this.prop.x] = x;
				attr[this.prop.y] = y;
				n.element.css(attr);

				// Distribute item
				x += this.distribute.x * w + (this.distribute.x == 0 ? this.padding.x);
				y += this.distribute.y * h + (this.distribute.y == 0 ? this.padding.y);

			}

		}

		/**
		 * Display a notification
		 */
		NotificationArea.prototype.showNotification = function( config ) {

			// Initialize a notification object
			var notification = {

				'id'		: config['id'] || this.__newid(),	// The ID of the notification
				'timeout'	: config['timeout'] || 0,			// When to hide it
				'title'		: config['title'] || "",			// Notification title
				'icon'		: config['icon'] || "",				// Notification icon

				'click'		: config['click'] || function(){},	// Click callback

			};

			// If we have an id, look for other notifications in the stack
			if (notification.id !== undefined) {
				for (var i=0; i<this.notifications.length; i++) {
					var n = this.notifications[i];

					// If already exist, just update
					if (n.id == notification.id) {

						// Update properties
						n['timeout'] = notification.timeout;
						n['title'] = notification.title;
						n['icon'] = notification.icon;
						n['click'] = notification.click;

						// Show again
						this.__show(n);
						return;
					}
				}
			}

			// Create a notification element
			notification.element = $('<'+this.elementTag+' class="'+this.elementClass+'"></'+this.elementTag+'>')
									.appendTo(this.host);

			// Show
			this.notifications.push( notifications );
			this.__realign();
			this.__show(notification);

		};


		// Return notifications area class
		return NotificationArea;

	}
);