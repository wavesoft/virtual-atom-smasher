
define(

	/**
	 * This module provides the {@link EventBase} class which
	 * is used in other places in this project for forwarding events
	 * to interested parties.
	 *
	 * @exports core/util/event_base
	 */
	function() {

		/**
		 * Initialize the event class.
		 *
		 * This class provides the bare minimum functionality for
		 * event forwarding. When a receiver wants to listen for
		 * events he should register a handler with the {@link module:core/util/event_base~EventBase#on|on()}
		 * function. 
		 *
		 * After this point, any call to {@link module:core/util/event_base~EventBase#trigger|trigger()} will trigger
		 * all the listeners that are listening on this event.
		 *
		 * You can opt-out from the listening list using the {@link module:core/util/event_base~EventBase#off|off()}.
		 *
		 * @class
		 * @classdesc Base class for implementing basic event pub/sub functionality.
		 */
		var EventBase = function() {
			this.__eventCallbacks = {};
			this.__eventForwarders = [];
		}

		/**
		 * Register a handler that will be called when the specified
		 * named event is fired with the {@link module:core/util/event_base~EventBase#trigger|trigger()}.
		 *
		 * @param {String} name - The name of the event
		 * @param {function} handler - The handler to add to the listeners
		 */
		EventBase.prototype.on = function(name, handler) {
			if (this.__eventCallbacks[name] == undefined)
				this.__eventCallbacks[name] = [];
			this.__eventCallbacks[name].push(handler);
		}

		/**
		 * Register a handler that will be called when the specified
		 * named event is fired with the {@link module:core/util/event_base~EventBase#trigger|trigger()}.
		 *
		 * When the event is triggered, this handler will be automatically de-registered.
		 *
		 * @param {String} name - The name of the event
		 * @param {function} handler - The handler to add to the listeners
		 */
		EventBase.prototype.onOnce = function(name, handler) {

			// Prepare a temporary callback
			var _callback = (function() {
				// Deregister the callback
				this.off(name, _callback);
				// Fire the handler
				handler();
			}).bind(this);

			// Register temporary callback
			this.on(name, _callback);

		}

		/**
		 * Unregister from the event list.
		 *
		 * @param {String} name - The name of the event
		 * @param {function} handler - The handler to remove from the listeners
		 */
		EventBase.prototype.off = function(name, handler) {
			if (this.__eventCallbacks[name] == undefined)
				return;
			// If handler is missing, remove all handlers
			if (handler == undefined) {
				delete this.__eventCallbacks[name];
				return;
			}
			// Remove event callback
			var i = this.__eventCallbacks[name].indexOf(handler);
			this.__eventCallbacks[name].splice(i,1);
			// Remove event if blank
			if (this.__eventCallbacks[name].length == 0)
				delete this.__eventCallbacks[name];
		}

		/**
		 * Unregister all event listeners
		 */
		EventBase.prototype.offAll = function() {
			// Reset all
			this.__eventCallbacks = {};
			this.__eventForwarders = [];
		}

		/**
		 * Fire an event
		 *
		 * @param {String} name - The name of the event
		 * @param {array} args... - The arguments to pass to the listener handlers
		 */
		EventBase.prototype.trigger = function() {
			// Prepare arguments
			var args = Array.prototype.slice.call(arguments),
				name = args.shift();

			// Trigger to all forward receivers
			for (var i=0; i<this.__eventForwarders.length; i++) {
				this.__eventForwarders[i].trigger.apply( this.__eventForwarders[i], arguments );
			}

			// Require existing event
			if (!this.__eventCallbacks[name]) {
				return;
			}

			// We clone the callbacks in order to compensate modifications
			// of the array by callbacks
			var callbacks = this.__eventCallbacks[name].slice();

			// Fire callbacks
			for (var i=0; i<callbacks.length; i++) {
				try {
					callbacks[i].apply(this, args);
				} catch (e) {
					console.error("Exception while triggering event", name);
					console.error(e.stack);
				}
			}

		}

		/**
		 * Forward events
		 *
		 * @param {Object} receiver - The component to receive events
		 */
		EventBase.prototype.forwardAllEventsTo = function(receiver) {
			this.__eventForwarders.push(receiver);
		}


		return EventBase;

	}

);